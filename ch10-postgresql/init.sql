CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
    ('田中太郎', 'tanaka@example.com'),
    ('佐藤花子', 'sato@example.com'),
    ('鈴木一郎', 'suzuki@example.com');

INSERT INTO orders (user_id, amount, status) VALUES
    (1, 1500.00, 'completed'),
    (1, 3200.00, 'pending'),
    (2, 980.00, 'completed'),
    (3, 4500.00, 'shipped');
