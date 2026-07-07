/*Criação da tabela de usuários com campos para id, nome, email, hash da senha e data de criação. O campo 'id' é uma chave primária auto-incrementada, 'email' é único e não pode ser nulo, e 'created_at' registra a data e hora de criação do registro.*/

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE list_members (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, list_id)
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
