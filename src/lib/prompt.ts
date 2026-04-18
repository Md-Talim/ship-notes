import { GenerateInput } from "./validations";

type PrData = {
  title: string;
  body: string;
  commits: string[];
  diff: string;
};

export function buildPrompt(
  pr: PrData,
  options: Pick<GenerateInput, "style" | "format">,
): string {
  const audienceInstruction =
    options.style === "technical"
      ? "The audience is developers reading an internal changelog. Be specific about what changed technically."
      : "The audience is end users reading release notes. Focus on what changed for them, not how.";

  const formatInstruction =
    options.format === "markdown"
      ? "Respond in Markdown. Use a one-sentence summary, then a bullet list categorized by: Features, Fixes, Breaking Changes (omit empty categories)."
      : "Respond in plain text. One summary sentence, then a bulleted list.";

  return `You are a technical writer generating a changelog entry from a GitHub pull request.

  ${audienceInstruction}
  ${formatInstruction}

  ---

  PR Title: ${pr.title}

  PR Description: ${pr.body || "(no description provided - use diff and commits)"}

  Commit Messages:
  ${pr.commits.join("\n")}

  Diff (may be truncated):
  ${pr.diff}

  ---

  Generate the changelog entry now. No preamble, no explanation — just the changelog.`;
}
