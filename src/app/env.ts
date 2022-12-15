import dotenv from "dotenv";
import { z, TypeOf } from "zod";

dotenv.config();

const withDevDefault = <T extends z.ZodTypeAny>(schema: T, val: TypeOf<T>) =>
  process.env["NODE_ENV"] !== "production" ? schema.default(val) : schema;

const schema = z.object({
  API_URL: withDevDefault(z.string().url(), "http://localhost"),
  PORT: z.string().transform(Number),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2)
  );
  process.exit(1);
}

export const env = parsed.data;
