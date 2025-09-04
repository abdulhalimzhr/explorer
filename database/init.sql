-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create files table (bonus feature)
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    folder_id INTEGER NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    size BIGINT DEFAULT 0,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_path ON folders(path);
CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);

-- Insert sample data
INSERT INTO folders (name, parent_id, path) VALUES 
('Root', NULL, '/'),
('Documents', 1, '/Documents'),
('Pictures', 1, '/Pictures'),
('Music', 1, '/Music'),
('Videos', 1, '/Videos'),
('Work', 2, '/Documents/Work'),
('Personal', 2, '/Documents/Personal'),
('Projects', 6, '/Documents/Work/Projects'),
('Reports', 6, '/Documents/Work/Reports'),
('Family', 3, '/Pictures/Family'),
('Vacation', 3, '/Pictures/Vacation'),
('Rock', 4, '/Music/Rock'),
('Jazz', 4, '/Music/Jazz'),
('Movies', 5, '/Videos/Movies'),
('Tutorials', 5, '/Videos/Tutorials');

-- Insert sample files
INSERT INTO files (name, folder_id, size, mime_type) VALUES
('resume.pdf', 6, 1024000, 'application/pdf'),
('cover_letter.docx', 6, 512000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
('family_photo.jpg', 10, 2048000, 'image/jpeg'),
('vacation_video.mp4', 11, 104857600, 'video/mp4'),
('song.mp3', 12, 5242880, 'audio/mpeg'),
('presentation.pptx', 9, 3145728, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');