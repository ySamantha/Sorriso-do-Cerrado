import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://root:root@localhost:3307/sorrisodb",
  },
});