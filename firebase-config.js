// Firebase Configuration - Casamento Renan & Karol
// Credenciais reais do projeto

const firebaseConfig = {
    apiKey: "AIzaSyA-OHU9g26n1Dy6XTiW75RSYdFQju6WBcQ",
    authDomain: "casamento-renan-karol.firebaseapp.com",
    databaseURL: "https://casamento-renan-karol-default-rtdb.firebaseio.com",
    projectId: "casamento-renan-karol",
    storageBucket: "casamento-renan-karol.firebasestorage.app",
    messagingSenderId: "614890497992",
    appId: "1:614890497992:web:56609fdacbf72fdd1dc2fd"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== REFERÊNCIAS DO BANCO =====
const refs = {
    mensagens: db.ref('mensagens'),
    perguntas: db.ref('perguntas'),
    compras: db.ref('compras'),
    cotas: db.ref('cotas')
};

// ===== FUNÇÕES AUXILIARES =====

// Salvar mensagem no Firebase
function salvarMensagemFirebase(nome, texto, anonimo) {
    return refs.mensagens.push({
        nome: anonimo ? 'Anônimo' : nome,
        texto: texto,
        anonimo: anonimo,
        data: new Date().toISOString(),
        lida: false
    });
}

// Salvar pergunta no Firebase
function salvarPerguntaFirebase(nome, texto, anonimo) {
    return refs.perguntas.push({
        nome: anonimo ? 'Anônimo' : nome,
        pergunta: texto,
        anonimo: anonimo,
        data: new Date().toISOString(),
        respondida: false
    });
}

// Salvar compra no Firebase
function salvarCompraFirebase(itens, total, status) {
    return refs.compras.push({
        itens: itens,
        total: total,
        status: status || 'pendente',
        data: new Date().toISOString()
    });
}

// Atualizar cota comprada
function registrarCotaFirebase(cotaId, quantidade) {
    return refs.cotas.child(cotaId).transaction(function(current) {
        return (current || 0) + quantidade;
    });
}

// ===== FUNÇÕES DO ADMIN =====

// Listar todas as mensagens
function listarMensagens(callback) {
    refs.mensagens.on('value', function(snapshot) {
        const dados = [];
        snapshot.forEach(function(child) {
            dados.push({ id: child.key, ...child.val() });
        });
        callback(dados.reverse());
    });
}

// Listar todas as perguntas
function listarPerguntas(callback) {
    refs.perguntas.on('value', function(snapshot) {
        const dados = [];
        snapshot.forEach(function(child) {
            dados.push({ id: child.key, ...child.val() });
        });
        callback(dados.reverse());
    });
}

// Listar todas as compras
function listarCompras(callback) {
    refs.compras.on('value', function(snapshot) {
        const dados = [];
        snapshot.forEach(function(child) {
            dados.push({ id: child.key, ...child.val() });
        });
        callback(dados.reverse());
    });
}

// Excluir mensagem
function excluirMensagem(id) {
    return refs.mensagens.child(id).remove();
}

// Excluir pergunta
function excluirPergunta(id) {
    return refs.perguntas.child(id).remove();
}

// Excluir compra
function excluirCompra(id) {
    return refs.compras.child(id).remove();
}

// Obter estatísticas
function obterEstatisticas(callback) {
    const stats = { mensagens: 0, perguntas: 0, compras: 0, totalArrecadado: 0 };
    
    refs.mensagens.once('value', function(s) { 
        stats.mensagens = s.numChildren(); 
    }).then(function() {
        return refs.perguntas.once('value');
    }).then(function(s) { 
        stats.perguntas = s.numChildren(); 
        return refs.compras.once('value');
    }).then(function(s) {
        s.forEach(function(child) {
            const val = child.val();
            if (val.status === 'aprovado') stats.totalArrecadado += val.total;
        });
        stats.compras = s.numChildren();
        callback(stats);
    });
}

console.log('Firebase configurado com sucesso!');
