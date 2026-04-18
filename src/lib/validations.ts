import { z } from "zod";

const PR_URL_REGEX = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;

export const generateSchema = z.object({
  prUrl: z
    .string()
    .min(1, "PR URL is required")
    .regex(PR_URL_REGEX, "must be a valid PR URL"),
  style: z.enum(["technical", "user-facing"]),
  format: z.enum(["markdown", "plain-text"]),
});

export type GenerateInput = z.infer<typeof generateSchema>;

export function parsePrUrl(url: string) {
  const match = url.match(PR_URL_REGEX);
  if (!match) {
    throw new Error("Invalid PR URL");
  }

  return {
    owner: match[1],
    repo: match[2],
    pullNumber: Number(match[3]),
  };
}
