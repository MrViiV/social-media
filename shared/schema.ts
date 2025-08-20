import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // 'tiktok', 'instagram', 'youtube', 'twitter'
  downloadType: text("download_type").notNull(), // 'username', 'keyword', 'hashtag', 'url', 'bulk'
  value: text("value").notNull(), // username, keyword, hashtag, or URL
  limit: integer("limit").default(10),
  status: text("status").notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  progress: integer("progress").default(0), // 0-100
  totalFiles: integer("total_files").default(0),
  completedFiles: integer("completed_files").default(0),
  zipUrl: text("zip_url"),
  excelUrl: text("excel_url"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const downloadFiles = pgTable("download_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  downloadId: varchar("download_id").notNull().references(() => downloads.id),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  size: text("size"),
  views: integer("views"),
  likes: integer("likes"),
  comments: integer("comments"),
  metadata: text("metadata"), // JSON string for additional data
});

export const insertDownloadSchema = createInsertSchema(downloads).pick({
  platform: true,
  downloadType: true,
  value: true,
  limit: true,
});

export const insertDownloadFileSchema = createInsertSchema(downloadFiles).pick({
  downloadId: true,
  filename: true,
  url: true,
  size: true,
  views: true,
  likes: true,
  comments: true,
  metadata: true,
});

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;
export type InsertDownloadFile = z.infer<typeof insertDownloadFileSchema>;
export type DownloadFile = typeof downloadFiles.$inferSelect;
