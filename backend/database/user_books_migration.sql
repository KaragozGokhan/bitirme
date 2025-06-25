-- Purchased books table
CREATE TABLE IF NOT EXISTS user_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    acquisition_method VARCHAR(20) NOT NULL DEFAULT 'purchase', -- 'purchase', 'premium', 'gift'
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id) -- A user cannot have the same book more than once
); 