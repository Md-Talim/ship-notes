import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Ship Notes</h1>
      <p className="text-muted-foreground max-w-md text-center text-lg">
        Point it at a GitHub repo or PR, get a human-readable changelog entry.
      </p>
      <Button size="lg">Get Started</Button>
    </div>
  );
}
