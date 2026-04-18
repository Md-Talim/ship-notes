"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGenerate } from "@/hooks/use-generate";
import { ArrowRight } from "lucide-react";
import { SubmitEvent, useState } from "react";

export function PrGenerateForm() {
  const [prUrl, setPrUrl] = useState("");
  const {
    generate,
    completion,
    isLoading,
    error,
    style,
    setStyle,
    format,
    setFormat,
  } = useGenerate();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prUrl.trim() || isLoading) {
      return;
    }

    generate(prUrl.trim());
  };

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          type="url"
          placeholder="https://github.com/org/repo/pull/123"
          className="h-12 text-base"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Style</span>
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[style]}
              onValueChange={(value) => {
                const nextStyle = value[0];
                if (nextStyle === "technical" || nextStyle === "user-facing") {
                  setStyle(nextStyle);
                }
              }}
            >
              <ToggleGroupItem value="technical">Technical</ToggleGroupItem>
              <ToggleGroupItem value="user-facing">User-facing</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Format</span>
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[format]}
              onValueChange={(value) => {
                const nextFormat = value[0];
                if (nextFormat === "markdown" || nextFormat === "plain-text") {
                  setFormat(nextFormat);
                }
              }}
            >
              <ToggleGroupItem value="markdown">Markdown</ToggleGroupItem>
              <ToggleGroupItem value="plain-text">Plain text</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full gap-1.5"
          disabled={isLoading || !prUrl.trim()}
        >
          {isLoading ? "Generating..." : "Generate changelog"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="border-border bg-muted/30 flex min-h-64 flex-1 rounded-lg border border-dashed">
        {error ? (
          <p className="text-destructive p-4 text-sm">{error.message}</p>
        ) : completion ? (
          <pre className="w-full overflow-x-auto p-4 text-sm whitespace-pre-wrap">
            {completion}
          </pre>
        ) : (
          <p className="text-muted-foreground m-auto text-sm">
            Paste a PR link above and hit generate.
          </p>
        )}
      </div>
    </>
  );
}
