import { and, eq } from "drizzle-orm";
import { db } from "./client";
import { changelogs } from "./schema";

export async function getUserChangelogs(userId: string, page = 1, limit = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const offset = (safePage - 1) * safeLimit;

  return db.query.changelogs.findMany({
    where: (c, { eq }) => eq(c.userId, userId),
    with: {
      prs: true,
    },
    orderBy: (c, { desc }) => desc(c.createdAt),
    limit: safeLimit,
    offset,
  });
}

export async function deleteChangelogByUser(
  userId: string,
  changelogId: string,
) {
  return db
    .delete(changelogs)
    .where(and(eq(changelogs.id, changelogId), eq(changelogs.userId, userId)))
    .returning({ id: changelogs.id });
}
