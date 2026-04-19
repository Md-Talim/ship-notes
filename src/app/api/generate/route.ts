import { db } from "@/db/client";
import { changelogPrs, changelogs } from "@/db/schema";
import { getPrData } from "@/lib/github";
import { buildPrompt } from "@/lib/prompt";
import { generateSchema, parsePrUrl } from "@/lib/validations";
import { createGroq } from "@ai-sdk/groq";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import z from "zod";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: z.treeifyError(parsed.error) },
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
  } catch (err: unknown) {
    const status = getErrorStatus(err);
    if (status === 404) {
      return Response.json({ error: "PR not found" }, { status: 404 });
    }

    if (status === 403 || status === 429) {
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
    onFinish: async ({ text }) => {
      if (!userId) return;

      try {
        await db.transaction(async (tx) => {
          const [changelog] = await tx
            .insert(changelogs)
            .values({ userId, output: text, style, format })
            .returning({ id: changelogs.id });

          await tx.insert(changelogPrs).values({
            changelogId: changelog.id,
            prUrl: prUrl,
            prTitle: prData.title,
            owner: prParams.owner,
            repo: prParams.repo,
            prNumber: String(prParams.pullNumber),
          });
        });
      } catch (e) {
        console.log("Failed to persist changelog", { userId, prUrl, error: e });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

function getErrorStatus(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null) return undefined;
  if (!("status" in err)) return undefined;
  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}
