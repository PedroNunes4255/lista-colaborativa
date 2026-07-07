const usuarioSalvo = localStorage.getItem("usuarioLogado");

if (!usuarioSalvo) {
    window.location.href = "../login/login.html";
} else {
    const usuario = JSON.parse(usuarioSalvo);

    const nomeUsuario = document.querySelector("#nomeUsuario");
    nomeUsuario.textContent = `Olá, ${usuario.name} 👋`;
}

const botaoSair = document.querySelector(".btn-sair");

botaoSair.addEventListener("click", function (event) {
    event.preventDefault();

    localStorage.removeItem("usuarioLogado");

    window.location.href = "../login/login.html";
});
    /*add task*/
const form = document.getElementById("taskForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const responsavel = document.getElementById("responsavel").value;

    console.log({
        titulo,
        descricao,
        responsavel
    });

    // Depois vocês enviam para o backend
});