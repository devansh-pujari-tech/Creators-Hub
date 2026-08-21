CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO authors (name, email)
VALUES ('Demo Author', 'demo@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (author_id, title, content)
SELECT authors.id, 'SQL joins in practice', 'A demo row for the learning module.'
FROM authors
WHERE authors.email = 'demo@example.com'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'SQL joins in practice');
