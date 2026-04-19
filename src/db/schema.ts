import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const changelogs = pgTable(
  "changelogs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id").notNull(),
    output: text("output").notNull(),
    style: text("style").notNull().default("technical"),
    format: text("format").notNull().default("markdown"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("changelogs_user_id_idx").on(table.userId)],
);

export const changelogPrs = pgTable("changelog_prs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  changelogId: text("changelog_id")
    .notNull()
    .references(() => changelogs.id, { onDelete: "cascade" }),
  prUrl: text("pr_url").notNull(),
  prTitle: text("pr_title").notNull(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  prNumber: text("pr_number").notNull(),
});

export const changelogsRelations = relations(changelogs, ({ many }) => ({
  prs: many(changelogPrs),
}));

export const changelogPrsRelation = relations(changelogPrs, ({ one }) => ({
  changelog: one(changelogs, {
    fields: [changelogPrs.changelogId],
    references: [changelogs.id],
  }),
}));
