# GUIA COMPLETO - Configuracao Firebase + GitHub Pages

## 1. CRIAR PROJETO NO FIREBASE (Banco de Dados)

### Passo 1: Acesse o Firebase
- Va para: https://console.firebase.google.com/
- Faca login com sua conta Google (mesma do GitHub ou outra)

### Passo 2: Criar Novo Projeto
1. Clique em "Adicionar projeto"
2. Nome do projeto: `casamento-renan-karol`
3. Desative "Google Analytics" (ou deixe ativado, tanto faz)
4. Clique em "Criar projeto"

### Passo 3: Ativar Realtime Database
1. No menu lateral, clique em "Realtime Database" (icone de base de dados)
2. Clique em "Criar banco de dados"
3. Escolha a regiao: `us-central1`
4. No modo de seguranca, selecione: **"Iniciar no modo de teste"**
5. Clique em "Ativar"

### Passo 4: Pegar as Credenciais
1. Clique no icone de engrenagem (Configuracoes) ao lado de "Visao geral do projeto"
2. Selecione "Configuracoes do projeto"
3. Na aba "Geral", role ate "Seus aplicativos"
4. Clique no icone `</>` (Web)
5. De um apelido: `Site Casamento`
6. Clique em "Registrar aplicativo"
7. **Copie o objeto `firebaseConfig`** que aparecera

### Passo 5: Colar no Arquivo
Abra o arquivo `firebase-config.js` e substitua TODO o conteudo pelo que voce copiou:

```javascript
// Exemplo de como deve ficar:
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXX",
    authDomain: "casamento-renan-karol.firebaseapp.com",
    databaseURL: "https://casamento-renan-karol-default-rtdb.firebaseio.com",
    projectId: "casamento-renan-karol",
    storageBucket: "casamento-renan-karol.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123"
};

// Restante do codigo mantem igual...
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
// ... etc
```

### Passo 6: Regras de Seguranca
1. No Realtime Database, va para "Regras"
2. Substitua por:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Clique em "Publicar"

> **IMPORTANTE:** Essas regras permitem leitura/escrita publica. Para producao, voce deve restringir, mas para o casamento funciona perfeitamente.

---

## 2. HOSPEDAR NO GITHUB PAGES (sem afetar o Cha de Panela)

### A. Criar Novo Repositorio (SEPARADO do Cha de Panela)

1. Acesse: https://github.com/new
2. **Nome do repositorio:** `casamento-renan-karol` (ou qualquer nome)
3. **IMPORTANTE:** Deixe como "Publico"
4. **Nao** inicialize com README
5. Clique em "Criar repositorio"

### B. Enviar os Arquivos

No seu computador, na pasta do projeto, abra o terminal e digite:

```bash
# Entrar na pasta do projeto
cd casamento

# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Site do casamento Renan e Karol"

# Conectar com o GitHub (substitua pelo seu usuario)
git remote add origin https://github.com/SEU_USUARIO/casamento-renan-karol.git

# Enviar
git branch -M main
git push -u origin main
```

### C. Ativar GitHub Pages

1. No GitHub, va em "Settings" (Configuracoes) do repositorio
2. No menu lateral, clique em "Pages"
3. Em "Source", selecione: `Deploy from a branch`
4. Selecione a branch: `main`
5. Pasta: `/ (root)`
6. Clique em "Save"

7. Aguarde 2-5 minutos
8. Seu site estara em: `https://SEU_USUARIO.github.io/casamento-renan-karol/`

> **O Cha de Panela NAO sera afetado!** Eles sao repositorios SEPARADOS.

---

## 3. SENHA DO ADMIN

A senha padrao do painel admin e: **renankarol2026**

Para alterar, abra o arquivo `admin.html` e procure por:
```javascript
const SENHA_ADMIN = 'renankarol2026';
```

Substitua por qualquer senha que desejar.

---

## 4. URLs IMPORTANTES

| URL | Descricao |
|-----|-----------|
| `https://SEU_USUARIO.github.io/casamento-renan-karol/` | Site do casamento |
| `https://SEU_USUARIO.github.io/casamento-renan-karol/lista_presentes.html` | Lista de presentes |
| `https://SEU_USUARIO.github.io/casamento-renan-karol/admin.html` | Painel Admin |
| `https://console.firebase.google.com/` | Firebase Console |

---

## 5. O QUE ESTA ARMAZENADO NO BANCO

O Firebase guarda automaticamente:

- **Mensagens** do mural (com nome, texto, data, anonimo)
- **Perguntas** para os noivos (com nome, pergunta, data, anonimo)
- **Compras** realizadas (itens, total, status, data)
- **Cotas** simbolicas compradas (contador)

Tudo em TEMPO REAL! Quando alguem enviar uma mensagem, voce ve imediatamente no admin.

---

## 6. RESUMO

1. ✅ Criar projeto no Firebase
2. ✅ Copiar credenciais para `firebase-config.js`
3. ✅ Criar repositorio SEPARADO no GitHub
4. ✅ Enviar arquivos
5. ✅ Ativar GitHub Pages
6. ✅ Acessar admin com a senha

**O Cha de Panela continua no ar sem nenhuma alteracao!**
