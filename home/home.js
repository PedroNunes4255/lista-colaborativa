// home.js — TaskTogether
// Gerencia tarefas de verdade: salva no localStorage e renderiza a partir dos dados,
// em vez de deixar tarefas fixas escritas direto no HTML.

const STORAGE_KEY = 'tasktogether_tarefas';
const USUARIO_KEY = 'tasktogether_usuario';

// --- Dados iniciais (usados só na primeira visita, quando ainda não há nada salvo) ---
const TAREFAS_INICIAIS = [
    {
        id: cryptoRandomId(),
        titulo: 'Criar página de login',
        descricao: '',
        responsavel: 'Pedro',
        status: 'andamento',
        tipo: 'minha'
    },
    {
        id: cryptoRandomId(),
        titulo: 'Montar tela inicial',
        descricao: '',
        responsavel: 'Pedro',
        status: 'pendente',
        tipo: 'minha'
    },
    {
        id: cryptoRandomId(),
        titulo: 'Revisar tarefas compartilhadas',
        descricao: '',
        responsavel: 'Pedro',
        status: 'andamento',
        tipo: 'compartilhada'
    },
    {
        id: cryptoRandomId(),
        titulo: 'Conectar com Pia',
        descricao: '',
        responsavel: 'Thales',
        status: 'pendente',
        tipo: 'compartilhada'
    }
];

function cryptoRandomId() {
    // Gera um id simples e único o suficiente para essa lista
    return 'tarefa-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// --- Persistência ---
function carregarTarefas() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) {
        salvarTarefas(TAREFAS_INICIAIS);
        return TAREFAS_INICIAIS;
    }
    try {
        return JSON.parse(salvo);
    } catch (erro) {
        console.error('Erro ao ler tarefas salvas, reiniciando lista.', erro);
        salvarTarefas(TAREFAS_INICIAIS);
        return TAREFAS_INICIAIS;
    }
}

function salvarTarefas(tarefas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

let tarefas = [];

// --- Ciclo de status (clicar na tag avança o status) ---
const PROXIMO_STATUS = {
    pendente: 'andamento',
    andamento: 'concluida',
    concluida: 'pendente'
};

const LABEL_STATUS = {
    pendente: 'Pendente',
    andamento: 'Andamento',
    concluida: 'Concluída'
};

// --- Renderização ---
function renderizarTarefas() {
    const listaMinhas = document.getElementById('listaMinhasTarefas');
    const listaCompartilhadas = document.getElementById('listaTarefasCompartilhadas');

    listaMinhas.innerHTML = '';
    listaCompartilhadas.innerHTML = '';

    const minhas = tarefas.filter(t => t.tipo === 'minha');
    const compartilhadas = tarefas.filter(t => t.tipo === 'compartilhada');

    if (minhas.length === 0) {
        listaMinhas.innerHTML = '<p class="lista-vazia">Nenhuma tarefa por aqui ainda.</p>';
    } else {
        minhas.forEach(tarefa => listaMinhas.appendChild(criarItemTarefa(tarefa)));
    }

    if (compartilhadas.length === 0) {
        listaCompartilhadas.innerHTML = '<p class="lista-vazia">Nenhuma tarefa compartilhada ainda.</p>';
    } else {
        compartilhadas.forEach(tarefa => listaCompartilhadas.appendChild(criarItemTarefa(tarefa)));
    }
}

function criarItemTarefa(tarefa) {
    const item = document.createElement('div');
    item.className = 'item-tarefa';
    item.dataset.id = tarefa.id;

    const info = document.createElement('div');

    const titulo = document.createElement('h4');
    titulo.textContent = tarefa.titulo;
    info.appendChild(titulo);

    if (tarefa.descricao) {
        const descricao = document.createElement('p');
        descricao.textContent = tarefa.descricao;
        info.appendChild(descricao);
    }

    const responsavel = document.createElement('p');
    responsavel.textContent = 'Responsável: ' + tarefa.responsavel;
    info.appendChild(responsavel);

    item.appendChild(info);

    const tag = document.createElement('span');
    tag.className = 'tag ' + tarefa.status;
    tag.textContent = LABEL_STATUS[tarefa.status];
    tag.title = 'Clique para mudar o status';
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', () => alternarStatus(tarefa.id));
    item.appendChild(tag);

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.className = 'btn-excluir-tarefa';
    btnExcluir.textContent = '✕';
    btnExcluir.title = 'Excluir tarefa';
    btnExcluir.style.marginLeft = '8px';
    btnExcluir.addEventListener('click', () => excluirTarefa(tarefa.id));
    item.appendChild(btnExcluir);

    return item;
}

// --- Ações ---
function adicionarTarefa(titulo, descricao, responsavel) {
    const novaTarefa = {
        id: cryptoRandomId(),
        titulo,
        descricao,
        responsavel,
        status: 'pendente',
        tipo: 'minha'
    };
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    renderizarTarefas();
}

function alternarStatus(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;
    tarefa.status = PROXIMO_STATUS[tarefa.status];
    salvarTarefas(tarefas);
    renderizarTarefas();
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas(tarefas);
    renderizarTarefas();
}

// --- Saudação personalizada ---
function renderizarSaudacao() {
    const nome = localStorage.getItem(USUARIO_KEY);
    const titulo = document.getElementById('nomeUsuario');
    if (titulo) {
        titulo.textContent = nome ? `Olá, ${nome} 👋` : 'Olá 👋';
    }
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    tarefas = carregarTarefas();
    renderizarSaudacao();
    renderizarTarefas();

    const form = document.getElementById('formTarefa');
    form.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const titulo = document.getElementById('inputTitulo').value.trim();
        const descricao = document.getElementById('inputDescricao').value.trim();
        const responsavel = document.getElementById('inputResponsavel').value;

        if (!titulo || !responsavel) return;

        adicionarTarefa(titulo, descricao, responsavel);
        form.reset();
    });
});
