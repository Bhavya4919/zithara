CREATE DATABASE customer_records_db;

CREATE TABLE customer_records (
    sno SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    age INTEGER,
    phone VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
