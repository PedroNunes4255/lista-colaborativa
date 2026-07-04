async function login(email, password) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const senhaCorreta = await bcrypt.compare(password, user.password_hash);
  if (!senhaCorreta) {
    throw new Error('Senha incorreta');
  }

  return { id: user.id, name: user.name, email: user.email };
}