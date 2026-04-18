import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";

type StyleType = "technical" | "user-facing";
type FormatType = "markdown" | "plain-text";

export function useGenerate() {
  const [style, setStyle] = useState<StyleType>("technical");
  const [format, setFormat] = useState<FormatType>("markdown");

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/generate",
  });

  const generate = (prUrl: string) => {
    complete(prUrl, { body: { prUrl, style, format } });
  };

  return {
    generate,
    completion,
    isLoading,
    error,
    style,
    setStyle,
    format,
    setFormat,
  };
}
