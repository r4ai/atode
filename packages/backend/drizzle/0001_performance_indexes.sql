-- Performance optimization indexes as specified in TODO.md
-- For projects hierarchical queries
CREATE INDEX IF NOT EXISTS idx_projects_user_path ON projects USING GIST (user_id, path) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_user_parent ON projects (user_id, parent_project_id) WHERE deleted_at IS NULL;

-- For tasks queries and hierarchical operations
CREATE INDEX IF NOT EXISTS idx_tasks_user_project ON tasks (user_id, project_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_path_gist ON tasks USING GIST (path) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date) WHERE deleted_at IS NULL AND due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks (user_id, status) WHERE deleted_at IS NULL;

-- Full-text search index for tasks
CREATE INDEX IF NOT EXISTS idx_tasks_fts ON tasks USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, ''))) WHERE deleted_at IS NULL;

-- For task labels associations
CREATE INDEX IF NOT EXISTS idx_task_labels_task ON task_labels (task_id);
CREATE INDEX IF NOT EXISTS idx_task_labels_label ON task_labels (label_id);

-- For comments polymorphic queries
CREATE INDEX IF NOT EXISTS idx_comments_polymorphic ON comments (commentable_type, commentable_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments (user_id) WHERE deleted_at IS NULL;

-- For labels queries
CREATE INDEX IF NOT EXISTS idx_labels_user ON labels (user_id);
CREATE INDEX IF NOT EXISTS idx_labels_name ON labels (user_id, name);
