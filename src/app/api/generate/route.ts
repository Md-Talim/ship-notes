import { getPrData } from "@/lib/github";
import { buildPrompt } from "@/lib/prompt";
import { generateSchema, parsePrUrl } from "@/lib/validations";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextRequest } from "next/server";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { prUrl, style, format } = parsed.data;

  let prParams;
  try {
    prParams = parsePrUrl(prUrl);
  } catch {
    return Response.json({ error: "Invalid PR URL" }, { status: 400 });
  }

  let prData;
  try {
    const raw = await getPrData(
      prParams.owner,
      prParams.repo,
      prParams.pullNumber,
    );
    prData = { ...raw, diff: raw.diff };
  } catch (err: any) {
    if (err.status === 404) {
      return Response.json({ error: "PR not found" }, { status: 404 });
    }

    if (err.status === 403 || err.status === 429) {
      return Response.json(
        { error: "GitHub rate limit hit. Try again in a few minutes." },
        { status: 429 },
      );
    }

    return Response.json(
      { error: "Failed to fetch PR from GitHub." },
      { status: 500 },
    );
  }

  const prompt = buildPrompt(prData, { style, format });

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    prompt,
  });

  return result.toUIMessageStreamResponse();
}
