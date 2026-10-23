import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";

export interface ParsedUpload {
  fields: Record<string, string>;
  file?: {
    filename: string;
  };
}

const uploadsDirectory = path.resolve(process.cwd(), "uploads");

export const parseUploadRequest = async (
  request: FastifyRequest,
  expectedField: string,
): Promise<ParsedUpload> => {
  if (!request.isMultipart()) {
    return {
      fields: (request.body ?? {}) as Record<string, string>,
    };
  }

  const result: ParsedUpload = { fields: {} };

  for await (const part of request.parts()) {
    if (part.type === "field") {
      result.fields[part.fieldname] =
        typeof part.value === "string" ? part.value : String(part.value);
      continue;
    }

    if (part.fieldname !== expectedField) {
      part.file.resume();
      continue;
    }

    if (result.file) {
      part.file.resume();
      throw new Error(`Only one ${expectedField} file is allowed`);
    }

    result.file = await saveUpload(part);
  }

  return result;
};

const saveUpload = async (part: MultipartFile): Promise<{ filename: string }> => {
  await mkdir(uploadsDirectory, { recursive: true });

  const extension = path.extname(path.basename(part.filename));
  const baseName = path.basename(part.filename, extension)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 80);
  const filename = `${baseName || "upload"}-${randomUUID()}${extension}`;

  await writeFile(path.join(uploadsDirectory, filename), await part.toBuffer());

  return { filename };
};
