const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco',
  password: 'sua_senha',
  port: 5432,
});

async function cadastrarUsuario(name, email, password) {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, passwordHash]
  );

  return result.rows[0];
}