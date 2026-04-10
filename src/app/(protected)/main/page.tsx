import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowRight } from "lucide-react";

export default function MainApp() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 pt-10 pb-24">
      {/* PR URL Input */}
      <div className="flex flex-col gap-3">
        <Input
          type="url"
          placeholder="https://github.com/org/repo/pull/123"
          className="h-12 text-base"
        />

        {/* Toggles row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Style</span>
            <ToggleGroup
              variant="outline"
              size="sm"
              defaultValue={["technical"]}
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
              defaultValue={["markdown"]}
            >
              <ToggleGroupItem value="markdown">Markdown</ToggleGroupItem>
              <ToggleGroupItem value="plain">Plain text</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Generate button */}
        <Button size="lg" className="h-10 w-full gap-1.5">
          Generate changelog
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Output area */}
      <div className="border-border bg-muted/30 flex min-h-64 flex-1 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">
          Paste a PR link above and hit generate.
        </p>
      </div>
    </main>
  );
}
