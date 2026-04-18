import { Octokit } from "@octokit/rest";

function getOctokit(token?: string) {
  return new Octokit({ auth: token });
}

export async function getPrData(
  owner: string,
  repo: string,
  pullNumber: number,
  token?: string,
) {
  const octokit = getOctokit(token);

  const [pr, commits] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number: pullNumber }),
    octokit.pulls.listCommits({ owner, repo, pull_number: pullNumber }),
  ]);

  const diffResponse = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: { format: "diff" },
  });

  return {
    title: pr.data.title,
    body: pr.data.body ?? "",
    commits: commits.data.map((c) => c.commit.message),
    diff: diffResponse.data as unknown as string,
    url: pr.data.html_url,
    mergedAt: pr.data.merged_at,
  };
}
