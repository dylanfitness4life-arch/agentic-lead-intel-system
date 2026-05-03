import { z } from "zod";

export const analyzeRequestSchema = z.object({
  url: z.string().url(),
  businessName: z.string().min(1).max(120).optional(),
  location: z.string().max(120).optional()
});

export function validateAnalyzeRequest(body) {
  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
  return parsed.data;
}
