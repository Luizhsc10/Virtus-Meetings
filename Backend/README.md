# VirtusMeetings

## English

### Overview

VirtusMeetings is a full-stack language exchange platform designed to connect learners from different backgrounds in a social and interactive environment. Users can create accounts, complete their profiles, discover other learners, send friend requests, start conversations, and exchange messages in real time.

This project includes both the **frontend** and **backend**, built to support a scalable and modern social communication experience.

---

### Main Features

- User authentication with JWT and HTTP-only cookies
- User onboarding flow
- Profile-based user discovery
- Friend request system
- Friends list management
- One-to-one conversations
- Realtime messaging with Socket.IO
- Unread message tracking
- Protected routes and secure backend architecture

---

### Tech Stack

#### Frontend
- React / Next.js
- Tailwind CSS
- JavaScript / TypeScript
- Socket.IO Client

#### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- cookie-parser
- dotenv

---

### Project Structure

```bash
frontend/
Backend/
│── controllers/
│── lib/
│── middleware/
│── models/
│── routes/
│── .env
│── .gitignore
│── package.json
│── server.js

```


Backend Features
Authentication
Signup
Login
Logout
Auth check
Password hashing
JWT cookie-based authentication
Users
Get current user
Complete onboarding
Discover users
Get friends list
Friend Requests
Send friend requests
View incoming requests
Accept requests
Reject requests
Messaging
Create or get conversations
Fetch conversation list
Send messages
Fetch messages
Track unread messages
Mark messages as read
Realtime
User socket connection
Join conversation rooms
Receive messages in real time
Online users tracking
Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/virtusmeetings.git
cd virtusmeetings
2. Install backend dependencies
cd Backend
npm install
3. Create environment variables

Create a .env file inside the backend folder:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
4. Start the backend server
node server.js
```

or
```
npx nodemon server.js
```

Current Socket.IO events include:

```
join-user-room
join-conversation
new-message
online-users
Future Improvements
Typing indicators
Realtime friend request notifications
Audio and video call signaling
Group chat support
Media uploads
Profile editing
Notifications system
Automated testing
Author

```

---

## Português

### Visão Geral

VirtusMeetings é uma plataforma full stack de troca de idiomas criada para conectar pessoas de diferentes origens em um ambiente social e interativo. Os usuários podem criar contas, completar seus perfis, descobrir outros aprendizes, enviar solicitações de amizade, iniciar conversas e trocar mensagens em tempo real.

Este projeto inclui tanto o **frontend** quanto o **backend**, estruturados para oferecer uma experiência moderna, escalável e segura.

---

### Principais Funcionalidades

- Autenticação de usuários com JWT e cookies HTTP-only
- Fluxo de onboarding de usuário
- Descoberta de usuários baseada em perfil
- Sistema de solicitações de amizade
- Gerenciamento de lista de amigos
- Conversas individuais
- Mensagens em tempo real com Socket.IO
- Controle de mensagens não lidas
- Rotas protegidas e arquitetura segura no backend

---

### Tecnologias Utilizadas

#### Frontend
- React / Next.js
- Tailwind CSS
- JavaScript / TypeScript
- Socket.IO Client

#### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO
- cookie-parser
- dotenv

---

### Estrutura do Projeto

```bash
frontend/
Backend/
│── controllers/
│── lib/
│── middleware/
│── models/
│── routes/
│── .env
│── .gitignore
│── package.json
│── server.js
```

Funcionalidades do Backend
Autenticação
Cadastro
Login
Logout
Verificação de autenticação
Criptografia de senha com hash
Autenticação baseada em JWT com cookies
Usuários
Buscar usuário atual
Completar onboarding
Descobrir usuários
Buscar lista de amigos
Solicitações de Amizade
Enviar solicitações de amizade
Visualizar solicitações recebidas
Aceitar solicitações
Rejeitar solicitações
Mensagens
Criar ou buscar conversas
Buscar lista de conversas
Enviar mensagens
Buscar mensagens
Controlar mensagens não lidas
Marcar mensagens como lidas
Tempo Real
Conexão de usuário via socket
Entrada em salas de conversa
Recebimento de mensagens em tempo real
Rastreamento de usuários online

---

Instalação
1. Clone o repositório
```
git clone https://github.com/YOUR_USERNAME/virtusmeetings.git
cd virtusmeetings
```
2. Instale as dependências do backend
```
cd Backend
npm install
```
3. Crie as variáveis de ambiente

Crie um arquivo .env dentro da pasta backend:
```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
4. Inicie o servidor backend
node server.js
```
ou
```
npx nodemon server.js
```
5. Inicie o frontend



Developed as part of the VirtusMeetings full-stack project.
