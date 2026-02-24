# Sebo - Livraria de Usados 📚

Uma plataforma moderna e elegante para compra e venda de livros usados, focada em economia circular e acessibilidade literária.

![Preview](./Preview.png)


## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS** (Estilização moderna e responsiva)
- **Zustand** (Gerenciamento de estado global)
- **React Router DOM** (Navegação SPA)
- **Lucide React** (Ícones)
- **Motion** (Animações fluidas)
- **React Hot Toast** (Notificações)

## ✨ Funcionalidades

- [x] **Vitrine de Destaques:** Home com livros em destaque e categorias.
- [x] **Catálogo Completo:** Listagem de livros com filtros por categoria e ordenação por preço.
- [x] **Busca Inteligente:** Barra de busca funcional para encontrar títulos, autores ou ISBN.
- [x] **Detalhes do Livro:** Página dedicada com ficha técnica, descrição e livros relacionados.
- [x] **Carrinho de Compras:** Gerenciamento de itens, quantidades e cálculo de total em tempo real.
- [x] **Fluxo de Checkout:** Processo de finalização de compra simulado com etapas de endereço e pagamento.
- [x] **Autenticação:** Sistema de login e proteção de rotas (Perfil, Pedidos, Checkout).
- [x] **Painel Administrativo:** Dashboard para gestão de estoque e visualização de KPIs de vendas.
- [x] **Design Responsivo:** Totalmente adaptado para dispositivos móveis, tablets e desktops.
- [x] **Dark Mode Support:** Preparado para temas claros e escuros via Tailwind.

## 📦 Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sebo-livraria.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:3000` no seu navegador.

## 📂 Estrutura de Pastas

```text
src/
├── components/
│   ├── layout/      # Header, Footer, Layout principal
│   └── ui/          # Componentes reutilizáveis (BookCard, etc)
├── pages/           # Páginas da aplicação
├── store/           # Estados globais (Cart, Auth)
├── types/           # Definições de tipos TypeScript
├── utils/           # Funções utilitárias e Mock Data
└── App.tsx          # Configuração de rotas
```

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido com ❤️ por [Marcone Silva de Brito]