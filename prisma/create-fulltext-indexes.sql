-- Create GIN indexes for full-text search on University and Program tables
-- These replace the Prisma @@fulltext directive which is not supported
-- by the Prisma 7 config-based connector

CREATE INDEX IF NOT EXISTS "University_name_description_fts_idx"
  ON "University"
  USING GIN (to_tsvector('english', coalesce("name", '') || ' ' || coalesce("description", '')));

CREATE INDEX IF NOT EXISTS "Program_name_description_fts_idx"
  ON "Program"
  USING GIN (to_tsvector('english', coalesce("name", '') || ' ' || coalesce("description", '')));
