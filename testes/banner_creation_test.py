import http.cookiejar
import json
import os
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPOSE_FILE = os.path.join(BASE_DIR, "docker-compose.yml")
UPLOADS_DIR = os.path.join(BASE_DIR, "Back-End", "uploads")
API_URL = os.environ.get("API_URL", "http://localhost:3000")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@email.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))
PNG_1X1 = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0bIDAT\x08\xd7c\xf8"
    b"\xcf\xc0\xf0\x1f\x00\x05\x00\x01\xff\x89\x99=\x1d\x00\x00\x00\x00IEND"
    b"\xaeB`\x82"
)


def request(endpoint, method="GET", body=None, headers=None):
    request_headers = {"Origin": "http://localhost:5173"}
    request_headers.update(headers or {})
    data = body

    if isinstance(body, dict):
        request_headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(
        f"{API_URL}{endpoint}",
        data=data,
        headers=request_headers,
        method=method,
    )

    try:
        with opener.open(req, timeout=10) as response:
            response_body = response.read()
            return response.status, decode_body(response_body)
    except urllib.error.HTTPError as error:
        return error.code, decode_body(error.read())


def decode_body(body):
    if not body:
        return {}
    try:
        return json.loads(body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return body


def multipart_file_request(endpoint, fields, file_field, filename, content, content_type):
    boundary = f"----BannerTest{uuid.uuid4().hex}"
    chunks = []

    for name, value in fields.items():
        chunks.extend([
            f"--{boundary}\r\n".encode(),
            f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
            str(value).encode("utf-8"),
            b"\r\n",
        ])

    chunks.extend([
        f"--{boundary}\r\n".encode(),
        (
            f'Content-Disposition: form-data; name="{file_field}"; '
            f'filename="{filename}"\r\n'
        ).encode(),
        f"Content-Type: {content_type}\r\n\r\n".encode(),
        content,
        b"\r\n",
        f"--{boundary}--\r\n".encode(),
    ])

    return request(
        endpoint,
        method="POST",
        body=b"".join(chunks),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )


def wait_for_api(max_attempts=30):
    for _ in range(max_attempts):
        try:
            status, _ = request("/")
            if status == 200:
                return
        except (OSError, urllib.error.URLError):
            pass
        time.sleep(2)
    raise AssertionError(f"API did not become ready at {API_URL}")


def assert_banner_is_listed(banner_id, expected_image_url):
    status, banners = request("/banners")
    assert status == 200 and isinstance(banners, list), (
        f"Could not list banners: {banners}"
    )
    banner = next((item for item in banners if item["id"] == banner_id), None)
    assert banner is not None, f"Created banner {banner_id} was not listed"
    assert banner["imagemURL"] == expected_image_url, (
        f"Unexpected image URL for banner {banner_id}: {banner['imagemURL']}"
    )


def run_banner_creation_tests():
    created_banner_ids = []
    uploaded_image_url = None

    print("Starting Docker services...")
    subprocess.run(
        ["docker", "compose", "-f", COMPOSE_FILE, "up", "-d"],
        check=True,
    )

    try:
        print("Waiting for the API...")
        wait_for_api()

        print("Signing in as the admin...")
        status, result = request(
            "/api/auth/sign-in/email",
            method="POST",
            body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        assert status == 200, f"Admin sign-in failed: {result}"

        unique_id = uuid.uuid4().hex[:10]

        print("Test 1/2: create a banner with an external image URL...")
        external_image_url = f"https://example.com/banner-{unique_id}.jpg"
        status, result = request(
            "/banners",
            method="POST",
            body={
                "titulo": f"URL banner test {unique_id}",
                "imagemURL": external_image_url,
                "link": "https://example.com/",
                "ordem": 901,
            },
        )
        assert status == 201, f"URL banner creation failed: {result}"
        url_banner_id = result["id"]
        created_banner_ids.append(url_banner_id)
        assert_banner_is_listed(url_banner_id, external_image_url)
        print("  PASS: URL banner was created and listed with the expected URL.")

        print("Test 2/2: create a banner by uploading an image...")
        filename = f"banner-test-{unique_id}.png"
        status, result = multipart_file_request(
            "/banners",
            fields={
                "titulo": f"Upload banner test {unique_id}",
                "link": "https://example.com/uploaded/",
                "ordem": 902,
            },
            file_field="imagem",
            filename=filename,
            content=PNG_1X1,
            content_type="image/png",
        )
        assert status == 201, f"Uploaded banner creation failed: {result}"
        upload_banner_id = result["id"]
        created_banner_ids.append(upload_banner_id)
        uploaded_image_url = result["imagemURL"]

        parsed_url = urllib.parse.urlparse(uploaded_image_url)
        uploaded_filename = os.path.basename(parsed_url.path)
        assert parsed_url.path.startswith("/uploads/") and uploaded_filename, (
            f"Unexpected uploaded image URL: {uploaded_image_url}"
        )
        assert_banner_is_listed(upload_banner_id, uploaded_image_url)

        image_status, image_content = request(parsed_url.path)
        assert image_status == 200, "Uploaded banner image was not served by the API"
        assert image_content == PNG_1X1, "Served banner image does not match the upload"
        print("  PASS: uploaded banner was created, listed, and its image is served.")

        print("\nBoth banner creation tests passed.")
    finally:
        if cookie_jar:
            for banner_id in reversed(created_banner_ids):
                status, result = request(f"/banners/{banner_id}", method="DELETE")
                if status != 200:
                    print(f"Warning: could not remove test banner {banner_id}: {result}")

        if uploaded_image_url:
            filename = os.path.basename(urllib.parse.urlparse(uploaded_image_url).path)
            if filename.startswith("banner-test-"):
                image_path = os.path.join(UPLOADS_DIR, filename)
                if os.path.isfile(image_path):
                    os.remove(image_path)

        print("Stopping Docker services...")
        subprocess.run(["docker", "compose", "-f", COMPOSE_FILE, "down"], check=True)


if __name__ == "__main__":
    run_banner_creation_tests()
