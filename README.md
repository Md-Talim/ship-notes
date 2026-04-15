# ship-notes

Turn any GitHub PR into a clean, human-readable changelog entry — in seconds.

## The problem

Writing changelogs is the last thing anyone does before a release, and it shows.

Most teams either skip it entirely, paste raw PR titles into a markdown file, or spend 20 minutes rewriting what the diff already says in plain English. The result is changelog entries that are either missing, too technical for users to understand, or too vague to mean anything.

ship-notes reads your PR — the diff, the description, the commit messages — and writes the changelog entry for you. The kind a human would write if they had the time.


## What it does

Paste a GitHub PR URL. Get a changelog entry back.

That's the whole thing.

Under the hood: it fetches your PR via the GitHub API, reads the diff and description, sends it to an LLM with a structured prompt, and streams the result back to you — formatted, categorized, and ready to paste wherever you need it.

**Output options:**
- Technical (for your team's internal changelog)
- User-facing (for release notes non-engineers will read)
- Markdown, plain text, or JSON

**Export options:**
- Copy to clipboard
- Download as `.md`
- Copy formatted for GitHub Releases

Every changelog you generate is saved to your account. Come back, re-copy, regenerate if needed.


## Who it's for

- Solo developers shipping fast who skip changelog writing because it's tedious
- Small teams that want consistent release notes without a process
- Anyone who writes "misc fixes" in their changelog and feels bad about it

## Status

In active development. 