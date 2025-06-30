# API de Gerenciamento de Tarefas (To-Do List)

[![CI - API de Tarefas](https://github.com/Vicius1/todo-api/actions/workflows/ci.yml/badge.svg)](https://github.com/Vicius1/todo-api/actions/workflows/ci.yml)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## Descrição do Projeto

API RESTful para um sistema de gerenciamento de tarefas (to-do list), desenvolvida como aprendizado de backend. A aplicação permite que usuários se cadastrem, se autentiquem de forma segura e gerenciem suas próprias tarefas pessoais.

O projeto foi construído seguindo as melhores práticas de desenvolvimento, com uma arquitetura em camadas, testes de integração automatizados, ambiente containerizado com Docker para garantir a portabilidade, e documentação interativa com Swagger.

---

## Funcionalidades Principais

-   **Autenticação de Usuários:** Sistema completo de cadastro e login com autenticação via Token JWT.
-   **CRUD de Tarefas:** Usuários autenticados podem Criar, Listar, Atualizar e Deletar suas próprias tarefas.
-   **Filtro de Tarefas:** A listagem de tarefas pode ser filtrada por status (`pendente` ou `concluída`).
-   **Segurança:** Rotas de tarefas são protegidas por middleware, garantindo que um usuário não possa acessar ou modificar as tarefas de outro.
-   **Validação de Dados:** A API valida os dados de entrada na camada de controller para garantir a integridade e fornecer feedback claro e amigável ao cliente.
-   **Documentação Interativa:** Uma interface Swagger (`/api-docs`) documenta todos os endpoints e permite testá-los diretamente pelo navegador.

---

### Endpoints da API

<div align="center">
    
| Verbo HTTP | Rota                | Descrição                      | Autenticação Requerida |
| :--------- | :------------------ | :----------------------------- | :--------------------- |
| `POST`     | `/users/register`   | Registra um novo usuário.      | Não                    |
| `POST`     | `/users/login`      | Autentica um usuário.          | Não                    |
| `POST`     | `/tasks`            | Cria uma nova tarefa.          | Sim (JWT)              |
| `GET`      | `/tasks`            | Lista as tarefas do usuário.   | Sim (JWT)              |
| `PUT`      | `/tasks/:id`        | Atualiza uma tarefa existente. | Sim (JWT)              |
| `DELETE`   | `/tasks/:id`        | Deleta uma tarefa existente.   | Sim (JWT)              |

</div>
    
---

## Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias e bibliotecas:

-   **Backend:** Node.js, Express.js
-   **Banco de Dados:** PostgreSQL
-   **ORM:** Prisma
-   **Autenticação:** JSON Web Token (`jsonwebtoken`), `bcryptjs`
-   **Testes:** Jest, Supertest
-   **Containerização:** Docker, Docker Compose
-   **Documentação:** Swagger (`swagger-ui-express`, `swagger-jsdoc`)

---

## Arquitetura

O projeto segue uma arquitetura em camadas para garantir a separação de responsabilidades e a manutenibilidade:

-   **Routes:** Definem os endpoints da API e os conectam aos Controllers, aplicando middlewares de autenticação e validação.
-   **Controllers:** Recebem as requisições HTTP, validam os dados de entrada e orquestram a lógica, chamando os Services.
-   **Services:** Contêm a lógica de negócio principal da aplicação.
-   **Models/Prisma:** A camada de acesso aos dados, gerenciada pelo Prisma ORM.

### Modelo de Dados (ERD)

A estrutura do banco de dados, com as entidades `User` e `Task` e seu relacionamento, é definida pelo `schema.prisma` e pode ser visualizada no seguinte diagrama:

<div align="center">

![Diagrama de Entidade e Relacionamento](assets/ERD.svg)

</div>

---

## Pré-requisitos

Para a abordagem recomendada com **Docker**, o único pré-requisito é:
* [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose (geralmente já vem com o Docker Desktop).

Para rodar este projeto **localmente (sem Docker)**, você precisaria ter as seguintes ferramentas instaladas em sua máquina:
* [Node.js](https://nodejs.org/) (v18.x ou superior)
* [PostgreSQL](https://www.postgresql.org/) (v15 ou superior)
* Um gerenciador de pacotes como [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

---

## Como Executar o Projeto (com Docker)

Existem duas maneiras de executar a aplicação: com Docker (recomendado) ou localmente.

### Método 1: Com Docker (Recomendado)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Vicius1/todo-api.git
    cd todo-api
    ```

2.  **Crie o arquivo `.env.docker`:**
    Copie o conteúdo do `.env.example` para um novo arquivo chamado `.env.docker` e preencha as variáveis. A `DATABASE_URL` deve apontar para o serviço `db`.
    * **Exemplo de `DATABASE_URL` para este arquivo:**
      `postgresql://postgres:123@db:5432/todo_db?schema=public`
      
> **IMPORTANTE:**
> As informações que serão colocadas nesse arquivo `.env.docker` devem ser **exatamente as mesmas** que estão definidas no arquivo `docker-compose.yml` na seção do serviço `db`.
> O usuário pode alterá-las, desde que sejam iguais nos dois arquivos.

3.  **Construa e inicie os contêineres:**
    Este comando irá construir a imagem da API e iniciar os serviços da API e do banco de dados em segundo plano.
    ```bash
    npm run docker:start
    ```
    
**Pronto!** A API estará rodando em `http://localhost:3000`.

### Método 2: Localmente (Sem Docker)

1.  **Clone o repositório** e instale as dependências:
    ```bash
    git clone https://github.com/Vicius1/todo-api.git
    cd todo-api
    npm install
    ```

2.  **Configure o Banco de Dados:**
    Garanta que você tenha um servidor PostgreSQL rodando localmente. Crie um banco de dados para a aplicação (ex: `todo_db`).

3.  **Crie o arquivo `.env`:**
    Copie o conteúdo do `.env.example` para um novo arquivo chamado `.env` e preencha as variáveis. A `DATABASE_URL` deve apontar para o seu banco local em `localhost`.
    * **Exemplo de `DATABASE_URL` para este arquivo:**
      `postgresql://postgres:123@localhost:5432/todo_db?schema=public`

4.  **Execute as migrações:**
    ```bash
    npx prisma migrate dev
    ```
    
5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

**Pronto!** A API estará rodando em `http://localhost:3000`.

---

## Documentação da API

A documentação completa e interativa dos endpoints está disponível através do Swagger. Após iniciar o projeto, acesse:

**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---
## Exemplos de Uso (cURL)

Aqui estão alguns exemplos de como interagir com a API usando o cURL.

**1. Registrar um Novo Usuário**

```bash
curl -X POST http://localhost:3000/users/register \
-H "Content-Type: application/json" \
-d '{
  "name": "João Silva",
  "email": "joao.silva@exemplo.com",
  "password": "senhaForte123"
}'
```

**2. Fazer Login para Obter um Token**

```bash
curl -X POST http://localhost:3000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "joao.silva@exemplo.com",
  "password": "senhaForte123"
}'
```
> Copie o token retornado para usar nos próximos passos.

Para os exemplos abaixo, substitua SEU_TOKEN_JWT_AQUI pelo token que você obteve no passo 2.

**3. Criar uma Nova Tarefa**
```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
-d '{
  "name": "Comprar pão",
  "description": "Ir à padaria da esquina."
}'
```

**4. Listar Todas as Tarefas**

#### Listar todas
```bash
curl -X GET http://localhost:3000/tasks \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

#### Listar apenas as tarefas pendentes
```bash
curl -X GET "http://localhost:3000/tasks?status=pendente" \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

**5. Atualizar uma Tarefa**

(Substitua 1 pelo ID da tarefa que deseja atualizar).

```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
-d '{
  "status": "concluída",
  "priority": "baixa"
}'
```

**6. Deletar uma Tarefa**

(Substitua 1 pelo ID da tarefa que deseja deletar).

```bash
curl -X DELETE http://localhost:3000/tasks/1 \
-H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

---

## Como Executar os Testes

### Método 1: Com Docker (Recomendado)

1.  Crie o arquivo `.env.test` a partir do `.env.example`. A `DATABASE_URL` deve apontar para o serviço `db` com o nome do banco de testes (ex: `todo_db_test`).
      * **Exemplo de `DATABASE_URL` para este arquivo:**
      `postgresql://postgres:123@db:5432/todo_db_test?schema=public`

2.  **Garanta que os contêineres estejam no ar:**
    ```bash
    npm run docker:start
    ```

3.  **Rode a Suíte de Testes:**
    Este comando executa as migrações no banco de dados de teste e executa todos os testes dentro do contêiner da API.
    ```bash
    npm run test:docker
    ```
    
### Método 2: Localmente (Sem Docker)

1.  **Garanta que seu PostgreSQL local esteja rodando.**
   
2.  **Crie um banco de dados de teste manualmente ou com o seguinte comando:**
     ```bash
    createdb todo_db_test
    ```
     
3.  Crie o arquivo `.env.test` a partir do `.env.example` e preencha a `DATABASE_URL` apontando para o seu banco de teste em `localhost`.
    * **Exemplo de `DATABASE_URL` para este arquivo:**
      `postgresql://postgres:123@db:5432/todo_db_test?schema=public`
   
4.  **Prepare o banco de teste:**
    ```bash
    npm run test:migrate
    ```
    
5.  **Rode os testes:**
    ```bash
    npm test
    ```
---

## Template para `.env.example`

Ele serve de guia para a criação dos arquivos `.env.docker`, `.env.test` e `.env`.

```env
# Porta da aplicação
PORT=3000

# Connection URL para o banco de dados.
# O DATABASE_URL tem o seguinte formato: DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:SUA_PORTA/NOME_DO_BANCO?schema=public"
DATABASE_URL=

# Chave secreta para assinar os tokens JWT
# Ex: JWT_SECRET=SUA_CHAVE_SUPER_SECRETA_AQUI
JWT_SECRET=
```
