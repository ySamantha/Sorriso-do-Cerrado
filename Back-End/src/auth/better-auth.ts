import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/db.js";
import * as schema from "../database/schema.js";

const isProduction = process.env.NODE_ENV === "production";
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;
const frontendURL = process.env.FRONTEND_URL;

if (isProduction && (!secret || !baseURL || !frontendURL)) {
  throw new Error(
    "BETTER_AUTH_SECRET, BETTER_AUTH_URL, and FRONTEND_URL are required in production",
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema,
  }),
  secret: secret || "local-development-only-secret-change-before-deploying",
  baseURL: baseURL || "http://localhost:3000",
  trustedOrigins: [frontendURL || "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    additionalFields: {
      papel: {
        type: "string",
        defaultValue: "cliente",
        input: false,
      },
    },
  },
});