const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "senha123",
    database: "postgres"
});

async function criarTabela() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);
}

criarTabela();

app.get("/", (req, res) => {
    res.redirect("/login/login.html");
});

app.post("/api/cadastro", async (req, res) => {
    console.log("Cadastro recebido:", req.body);

    const { nome, email, senha, confirmar_senha } = req.body;

    if (!nome || !email || !senha || !confirmar_senha) {
        return res.status(400).json({ erro: "Preencha todos os campos." });
    }

    if (senha !== confirmar_senha) {
        return res.status(400).json({ erro: "As senhas não coincidem." });
    }

    if (senha.length < 4) {
        return res.status(400).json({ erro: "A senha precisa ter pelo menos 4 caracteres." });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
            [nome, email, senhaCriptografada]
        );

        res.status(201).json({ mensagem: "Cadastro realizado com sucesso." });
    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({ erro: "Esse e-mail já está cadastrado." });
        }

        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar usuário." });
    }
});

app.post("/api/login", async (req, res) => {
    console.log("Login recebido:", req.body);
    
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Preencha e-mail e senha." });
    }

    try {
        const resultado = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }

        const usuario = resultado.rows[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.password_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }

        res.json({
            mensagem: "Login realizado com sucesso.",
            usuario: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao fazer login." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});