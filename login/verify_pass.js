const formLogin = document.querySelector("#form-login");
const mensagem = document.querySelector("#mensagem");

formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    if (!email || !senha) {
        mensagem.textContent = "Preencha e-mail e senha.";
        mensagem.classList.add("erro");
        return;
    }

    try {
        const resposta = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.erro;
            mensagem.classList.add("erro");
            return;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

        window.location.href = "../home/home.html";

    } catch (erro) {
        mensagem.textContent = "Erro ao conectar com o servidor.";
        mensagem.classList.add("erro");
    }
});