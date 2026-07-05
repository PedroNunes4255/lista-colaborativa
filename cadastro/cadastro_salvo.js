const formCadastro = document.querySelector("#form-cadastro");
const mensagem = document.querySelector("#mensagem");

formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;
    const confirmarSenha = document.querySelector("#confirmar_senha").value;

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    if (!nome || !email || !senha || !confirmarSenha) {
        mensagem.textContent = "Preencha todos os campos.";
        mensagem.classList.add("erro");
        return;
    }

    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.classList.add("erro");
        return;
    }

    try {
        const resposta = await fetch("/api/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                confirmar_senha: confirmarSenha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.erro;
            mensagem.classList.add("erro");
            return;
        }

        mensagem.textContent = "Cadastro realizado com sucesso!";
        mensagem.classList.add("sucesso");

        setTimeout(() => {
            window.location.href = "../login/login.html";
        }, 1000);

    } catch (erro) {
        mensagem.textContent = "Erro ao conectar com o servidor.";
        mensagem.classList.add("erro");
    }
});