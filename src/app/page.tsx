import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-170 flex-1 flex-col items-center justify-center gap-10 px-6 pb-24">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-center text-3xl font-medium tracking-tight sm:text-5xl">
            Generate changelogs from GitHub PRs in seconds.
          </h1>
          <p className="text-muted-foreground text-center text-lg">
            Paste a PR link. Get a human-readable changelog entry.
          </p>
        </div>

        <div className="flex w-full max-w-md items-center gap-2">
          <Input
            type="url"
            placeholder="https://github.com/owner/repo/pull/123"
            className="h-10 flex-1"
          />
          <Button
            size="lg"
            variant="default"
            className="h-10 gap-1.5 bg-[#ffffff] px-4"
          >
            Generate
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <ul className="text-muted-foreground flex list-disc flex-col gap-3 text-sm">
          <li>Reads the diff and PR description automatically.</li>
          <li>Writes a concise, audience-ready changelog entry.</li>
          <li>No config, no YAML, no templates.</li>
        </ul>
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <header className="mx-auto flex h-14 w-full max-w-170 items-center justify-between px-6">
      <span className="text-sm font-semibold tracking-tight">ship-notes</span>

      <Show when="signed-out">
        <SignInButton oauthFlow="redirect">
          <Button variant="outline" size="sm" className="gap-1.5">
            <span className="flex items-center gap-1.5">
              <GitHubIcon className="size-4" />
              Sign in with GitHub
            </span>
          </Button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
}
