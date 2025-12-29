import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig()

export default defineConfig({
  schema: "src/lib/db",
  out: "src/out",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});