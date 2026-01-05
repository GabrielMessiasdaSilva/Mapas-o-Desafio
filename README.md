# Meus Mapas

Uma plataforma web moderna para visualizar, organizar e explorar mapas geográficos com pontos de interesse. Permite criar múltiplos mapas, adicionar pontos personalizados em cada um e gerenciar seus dados de forma intuitiva.

## 🎯 Visão Geral da Solução

O projeto **Meus Mapas** é uma aplicação full-stack que oferece uma interface elegante e responsiva para gerenciamento de mapas geográficos. Desenvolvido com as tecnologias mais modernas do ecossistema JavaScript, permite que usuários criem mapas, adicionem pontos de interesse clicando diretamente no mapa e organizem seus dados geograficamente.

### Principais Características

- ✅ **Gerenciamento de Mapas**: Criar, visualizar e deletar mapas
- ✅ **Pontos de Interesse**: Adicionar e remover pontos nos mapas com nomes personalizados
- ✅ **Mapa Interativo**: Interface de mapa com Leaflet/OpenStreetMap
- ✅ **Busca de Pontos**: Filtrar pontos por nome em tempo real
- ✅ **Design Moderno**: Interface com gradientes, glassmorphism e animações suaves
- ✅ **Persistência de Dados**: Banco de dados SQLite com sincronização automática

---


## 🖼️ Screenshots do Projeto

### Tela Inicial
![Tela Inicial](./img/img1.png)

### Mapa Aberto
![cadastro de mapas](./img/img2.png)

### Adicionando Novo Ponto
![Adicionar Ponto](./img/img3.png)

### Exportação de Dados
![Exportação](./img/img4.png)


## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16.1.1** - Framework React com SSR e otimizações automáticas
- **React 19.2.3** - Biblioteca para construção de interfaces
- **React Leaflet 5.0.0** - Componentes React para integração com mapas
- **Leaflet 1.9.4** - Biblioteca JavaScript para mapas interativos
- **Tailwind CSS 4** - Framework de CSS utilitário para estilização
- **TypeScript 5** - Superset tipado do JavaScript

### Backend
- **Next.js API Routes** - Backend serverless integrado
- **Better SQLite3 12.5.0** - Banco de dados SQL síncrono e de alta performance

### Ferramentas de Desenvolvimento
- **ESLint 9** - Linter para código JavaScript/TypeScript
- **Babel Plugin React Compiler** - Compilador otimizado para React

---

## 📁 Estrutura de Arquivos

```
meus-mapas/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Página inicial com listagem de mapas
│   │   ├── layout.tsx               # Layout raiz com metadados
│   │   ├── globals.css              # Estilos globais
│   │   ├── mapa/[id]/
│   │   │   └── page.tsx            # Página individual do mapa com editor de pontos
│   │   └── api/
│   │       ├── mapas/
│   │       │   └── route.ts        # API para CRUD de mapas
│   │       └── pontos/
│   │           └── route.ts        # API para CRUD de pontos
│   ├── components/
│   │   └── Mapa.tsx                # Componente do mapa interativo Leaflet
│   └── lib/
│       └── db.ts                   # Configuração do banco de dados SQLite
├── public/                          # Arquivos estáticos
├── package.json                     # Dependências e scripts
├── tsconfig.json                    # Configuração TypeScript
├── next.config.ts                   # Configuração Next.js
├── tailwind.config.ts               # Configuração Tailwind CSS
├── postcss.config.mjs               # Configuração PostCSS
├── eslint.config.mjs                # Configuração ESLint
└── README.md                        # Este arquivo
```

---

## 🔍 Detalhamento dos Arquivos Principais

### `src/app/page.tsx` - Página Principal
- Exibe lista de todos os mapas criados
- Mostra quantidade de pontos em cada mapa
- Interface para criar novo mapa com input
- Botões para deletar mapas com confirmação
- Design com gradiente de fundo e animações suaves

### `src/app/mapa/[id]/page.tsx` - Página do Mapa
- Renderização do mapa interativo (Leaflet)
- Interface lateral com funcionalidades:
  - Campo de busca para filtrar pontos
  - Lista de pontos com opções de deletar
  - Botão para deletar todos os pontos
  - Botão para voltar à página inicial
- Modal para nomear novo ponto quando adicionado
- Atualização dinâmica de pontos sem recarga de página

### `src/components/Mapa.tsx` - Componente Mapa
- Renderização do MapContainer do Leaflet
- Integração com OpenStreetMap para tiles
- Handler de cliques para adicionar pontos nas coordenadas selecionadas
- Renderização de marcadores com ícones padrão
- Centro inicial em São Paulo (latitude: -23.5, longitude: -46.6)

### `src/app/api/mapas/route.ts` - API de Mapas
Endpoints REST para gerenciar mapas:
- **GET**: Retorna todos os mapas com contagem de pontos
- **POST**: Cria novo mapa com nome e data de criação
- **DELETE**: Deleta mapa e todos os seus pontos associados

### `src/app/api/pontos/route.ts` - API de Pontos
Endpoints REST para gerenciar pontos:
- **GET**: Retorna pontos filtrados por mapaId
- **POST**: Adiciona novo ponto em um mapa com coordenadas
- **DELETE**: Deleta ponto individual ou todos os pontos de um mapa

### `src/lib/db.ts` - Banco de Dados
- Inicialização do SQLite3 com caminho absoluto
- Criação automática das tabelas se não existirem:
  - `mapas`: armazena informações dos mapas
  - `pontos`: armazena coordenadas e nomes dos pontos
- Configuração de chaves estrangeiras

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn como gerenciador de pacotes

### Passos para Execução

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   
   O servidor iniciará em `http://localhost:3000`

3. **Abra no navegador:**
   Acesse `http://localhost:3000` para usar a aplicação

### Outros Scripts Disponíveis

```bash
# Build para produção
npm run build

# Inicia aplicação em produção (após build)
npm start

# Executa linter ESLint
npm run lint
```

---

## 💾 Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução em `database.sqlite` na raiz do projeto.

### Schema das Tabelas

**Tabela `mapas`:**
```sql
CREATE TABLE mapas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  criado_em TEXT NOT NULL
);
```

**Tabela `pontos`:**
```sql
CREATE TABLE pontos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mapa_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  FOREIGN KEY (mapa_id) REFERENCES mapas(id)
);
```

---

## 🎨 Design e UX

- **Tema Escuro**: Interface com fundo preto e tons neutros para menor canção ocular
- **Gradientes Dinâmicos**: Uso de cores violeta/purple para destaque visual
- **Responsividade**: Layout adaptável para diferentes tamanhos de tela
- **Glassmorphism**: Efeito de vidro fosco em elementos de destaque
- **Feedback Visual**: Confirmações antes de deletar dados importantes

---

## 🔐 Recursos de Segurança

- TypeScript para type-safety
- Validação de entrada nas APIs
- Confirmação do usuário antes de deletar dados
- Isolamento de queries com prepared statements do SQLite
- CORS implícito através de mesma origem

---

## 📝 Fluxo de Uso

1. **Página Inicial**: Visualize todos os mapas criados
2. **Criar Mapa**: Digite um nome e pressione Enter para criar novo mapa
3. **Acessar Mapa**: Clique em um mapa para abrir a visualização
4. **Adicionar Pontos**: Clique em qualquer lugar do mapa para adicionar um ponto
5. **Nomear Ponto**: Digite um nome para o ponto e confirme
6. **Buscar Pontos**: Use a barra de pesquisa para filtrar pontos por nome
7. **Deletar Ponto**: Clique no ícone de lixeira próximo ao ponto desejado
8. **Gerenciar Mapa**: Use os botões na barra lateral para gerenciar ou deletar o mapa inteiro

---

## 📦 Deployment

Para fazer deploy da aplicação:

```bash
# Build para produção
npm run build

# Verificar se build foi bem-sucedido
npm start
```

A aplicação vai ser deployada em plataformas que suportam Node.js como:
- Vercel (que é o recomendado para Next.js)


---

## 👨‍💻 Desenvolvimento

A aplicação segue as melhores práticas:
- **Component-Driven**: Componentes reutilizáveis e bem estruturados
- **Type-Safe**: 100% tipado com TypeScript
- **Performance**: Carregamento dinâmico de componentes pesados
- **Clean Code**: Código limpo e bem documentado
- **Separation of Concerns**: Separação clara entre API, componentes e estilos

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um processo.

---

**Desenvolvido com ❤️ usando Next.js, React e Leaflet**
