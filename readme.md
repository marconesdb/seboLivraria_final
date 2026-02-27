# 📚 Sebo — Universo das Páginas

> Livraria de livros usados com catálogo, carrinho, checkout com pagamento via Stripe e painel administrativo completo.

🔗 **Demo:** [sebo-livraria-final.vercel.app](https://sebo-livraria-final.vercel.app)



## 📸 Preview

![Home](./docs/screenshots/inicio.png)
![Catálogo](./docs/screenshots/catalogo.png)
![Detalhe do Livro](./docs/screenshots/detalhe.png)



## 🖥️ Tecnologias

### Frontend
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) — gerenciamento de estado
- [Stripe.js](https://stripe.com/docs/js) — pagamentos
- [React Hot Toast](https://react-hot-toast.com/) — notificações

### Backend
- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/) — banco de dados (CleverCloud)
- [JWT](https://jwt.io/) — autenticação
- [Stripe](https://stripe.com/) — processamento de pagamentos
- [ViaCEP](https://viacep.com.br/) — consulta de endereço por CEP

### Deploy
- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)
- **Banco de dados:** [Clever Cloud](https://www.clever-cloud.com/)

---

## ✨ Funcionalidades

### Cliente
- 🔍 Catálogo de livros com busca e filtros por categoria
- 📖 Página de detalhe do livro com descrição e ficha técnica
- 🛒 Carrinho de compras persistente
- 📦 Cálculo de frete por CEP (integração com API de shipping)
- 💳 Checkout completo com pagamento via Stripe
- 📋 Histórico de pedidos com status e código de rastreio
- 👤 Autenticação via e-mail/senha e Google OAuth

### Administrador
- 📊 Dashboard com métricas (receita, pedidos, livros, usuários)
- 📦 Gerenciamento de pedidos (atualizar status e código de rastreio)
- 📚 CRUD completo de livros
- 👥 Gerenciamento de usuários (alterar roles)

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- MySQL rodando localmente ou acesso ao banco remoto

### 1. Clone o repositório
```bash
git clone https://github.com/marconesdb/seboLivraria_final.git
cd seboLivraria_final
```

### 2. Configure o Backend
```bash
cd backend
npm install
```

Crie o arquivo `.env`:
```env
DATABASE_URL="mysql://usuario:senha@host:3306/banco"
JWT_SECRET="sua_chave_secreta"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
FRONTEND_URL="http://localhost:5173"
PORT=3333
```

Rode as migrations e inicie:
```bash
npx prisma migrate dev
npm run dev
```

### 3. Configure o Frontend
```bash
cd frontend
npm install
```

Crie o arquivo `.env`:
```env
VITE_API_URL="http://localhost:3333"
VITE_STRIPE_PUBLIC_KEY="pk_test_..."
```

Inicie o frontend:
```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Estrutura do Projeto

```
seboLivraria_final/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── store/          # Zustand (auth, cart)
│   │   ├── lib/            # Axios (api.ts)
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Funções utilitárias
│   └── public/
└── backend/
    ├── src/
    │   ├── controllers/    # Lógica das rotas
    │   ├── routes/         # Definição das rotas
    │   ├── middlewares/    # Auth, isAdmin
    │   ├── lib/            # Prisma client
    │   └── server.ts       # Entry point
    └── prisma/
        └── schema.prisma   # Modelos do banco
```

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão MySQL |
| `JWT_SECRET` | Chave secreta para JWT |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe |
| `FRONTEND_URL` | URL do frontend (CORS) |
| `VITE_API_URL` | URL da API no frontend |
| `VITE_STRIPE_PUBLIC_KEY` | Chave pública do Stripe |

---

## 👤 Acesso Admin

Para tornar um usuário administrador, execute no banco:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

Acesse o painel em: `/admin`

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido por [Marcone S. de Brito](https://github.com/marconesdb) 🚀
