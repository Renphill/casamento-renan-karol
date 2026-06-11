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
    cotas: db.ref('cotas'),
    presencas: db.ref('presencas')
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

// Salvar presenca no Firebase
function salvarPresencaFirebase(nome, whatsapp, comparecera, acompanhantes, mensagem) {
    return refs.presencas.push({
        nome: nome,
        whatsapp: whatsapp,
        comparecera: comparecera,
        acompanhantes: parseInt(acompanhantes) || 0,
        mensagem: mensagem || '',
        data: new Date().toISOString()
    });
}

// Listar todas as presencas
function listarPresencas(callback) {
    refs.presencas.on('value', function(snapshot) {
        const dados = [];
        snapshot.forEach(function(child) {
            dados.push({ id: child.key, ...child.val() });
        });
        callback(dados.reverse());
    });
}

// Excluir presenca
function excluirPresenca(id) {
    return refs.presencas.child(id).remove();
}

// Salvar compra no Firebase
function salvarCompraFirebase(itens, total, status, mensagem, anonimo) {
    const dados = {
        itens: itens,
        total: total,
        status: status || 'pendente',
        data: new Date().toISOString()
    };
    if (mensagem) dados.mensagem = mensagem;
    if (anonimo) dados.anonimo = true;
    return refs.compras.push(dados);
}

// Atualizar cota comprada (incrementa e faz auto-expansao de 5 em 5)
function registrarCotaFirebase(cotaId, quantidade) {
    return refs.cotas.child(cotaId).transaction(function(current) {
        const val = current || { compradas: 0, total: 10 };
        if (typeof val === 'number') {
            // Migra formato antigo (numero) para novo formato (objeto)
            const compradas = val + quantidade;
            let total = 10;
            while (total <= compradas) total += 5;
            return { compradas: compradas, total: total };
        }
        const compradas = (val.compradas || 0) + quantidade;
        let total = val.total || 10;
        // Auto-expansao: quando compradas >= total, aumenta de 5 em 5
        while (total <= compradas) total += 5;
        return { compradas: compradas, total: total };
    });
}

// Obter todas as cotas
function obterCotasFirebase(callback) {
    refs.cotas.on('value', function(snapshot) {
        const dados = {};
        snapshot.forEach(function(child) {
            dados[child.key] = child.val();
        });
        callback(dados);
    });
}

// Inicializar cotas no Firebase (usa valores do codigo como padrao)
function inicializarCotaFirebase(cotaId, compradasPadrao, totalPadrao) {
    return refs.cotas.child(cotaId).transaction(function(current) {
        if (current) return; // Ja existe, nao sobrescreve
        return { compradas: compradasPadrao || 0, total: totalPadrao || 10 };
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

// Marcar compra como aprovada (paga manualmente)
function marcarComoPago(id) {
    return refs.compras.child(id).update({
        status: 'aprovado',
        dataAprovacao: new Date().toISOString()
    });
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
            // Soma o total de TODAS as compras (inclusive pendentes) para o total de compras
            // Mas o totalArrecadado só conta as aprovadas
            if (val.status === 'aprovado') {
                stats.totalArrecadado += (val.total || 0);
            }
        });
        stats.compras = s.numChildren();
        callback(stats);
    });
}

console.log('Firebase configurado com sucesso!');
