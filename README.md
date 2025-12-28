# Raízes Conectadas 🌱

> Plataforma de mapeamento de territórios ancestrais e compartilhamento de saberes tradicionais.

O **Raízes Conectadas** é uma aplicação web que conecta comunidades (Quilombos, Aldeias, etc.) através de um mapa interativo e um círculo de saberes, respeitando a oralidade e o tempo circular.

---

## Como Rodar o Projeto

Siga estes passos para baixar e executar o projeto no seu computador.

### 1. Pré-requisitos

Antes de começar, você precisa ter instalado no seu computador:
* **[Node.js](https://nodejs.org/)** (Versão LTS recomendada - v18 ou superior).
* **Git** (Para clonar o repositório).

### 2. Instalação

Abra o seu terminal (CMD, PowerShell ou Terminal do VS Code) e execute os comandos abaixo em ordem:

```bash
# 1. Clone este repositório
git clone [https://github.com/klebersonjuni-ux/ra-zes-conectadas.git](https://github.com/klebersonjuni-ux/ra-zes-conectadas.git)

# 2. Entre na pasta do projeto
cd Ra-zes-Conectadas

# 3. Instale as dependências (Isso pode levar alguns minutos)
npm install

```

> **Nota:** O comando `npm install` vai baixar todas as bibliotecas necessárias (React, Vite, Tailwind, Mapas, etc.) listadas no `package.json`.

### 3. Executando o Projeto

Para iniciar o projeto, execute:

```bash
npm run dev

```

Este comando irá iniciar simultaneamente:

1. **O Servidor Backend (JSON Server):** Rodando em `http://localhost:3000` (Simula o banco de dados).
2. **O Frontend (Vite + React):** Rodando em `http://localhost:5173`.

Após rodar o comando, o navegador deve abrir automaticamente. Se não abrir, acesse **http://localhost:5173**.

---

## 🛠️ Tecnologias Utilizadas

* **React + Vite:** Para a interface rápida e moderna.
* **Tailwind CSS:** Para estilização e design responsivo.
* **Leaflet / React-Leaflet:** Para o mapa de territórios.
* **JSON Server:** Para simular uma API REST completa com dados de comunidades e saberes.
* **Lucide React:** Para os ícones.

---

## ⚠️ Solução de Problemas Comuns

**Erro: "A execução de scripts foi desabilitada neste sistema"**
Se você estiver no Windows e receber este erro ao tentar rodar o npm, abra o PowerShell como Administrador e execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

```

**Erro: Tela branca ou mapa não carrega**
Certifique-se de que você rodou o `npm install` corretamente e que não houve erros de conexão com a internet durante a instalação.



