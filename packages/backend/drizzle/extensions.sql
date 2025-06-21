-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add indexes for performance optimization as specified in TODO.md
CREATE INDEX IF NOT EXISTS idx_projects_user_path ON projects USING GIST (user_id, path) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_user_project ON tasks (user_id, project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_path_gist ON tasks USING GIST (path) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date) WHERE deleted_at IS NULL AND due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_fts ON tasks USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_task_labels_task ON task_labels (task_id);
CREATE INDEX IF NOT EXISTS idx_comments_polymorphic ON comments (commentable_type, commentable_id) WHERE deleted_at IS NULL;