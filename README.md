# FINANCE HUB

# 🚀 Finance Hub - Gestão Financeira Pessoal

## 1. Escopo do Sistema

### 1.1 - Objetivo
O **Finance Hub** é uma plataforma centralizada para controle e gestão das finanças pessoais. O objetivo principal é fornecer ao usuário uma visão clara, completa e intuitiva de sua vida financeira, facilitando a tomada de decisão e o planejamento a longo prazo.

### 1.2 - Funcionalidades (Features)
1. **Controle de Gastos e Despesas:** Registro detalhado de saídas classificadas por categorias (alimentação, transporte, lazer, etc.).
2. **Gestão de Entradas e Receitas:** Registro de fontes de renda (salário, freelance, rendimentos) para acompanhamento do fluxo de caixa.
3. **Acompanhamento de Investimentos (Futuro):** Visualização de carteira (ações, renda fixa) com monitoramento de rentabilidade.
4. **Detalhamento de Transações:** Inclusão de datas, notas explicativas e marcações de pagamentos recorrentes.
5. **Dashboards Inteligentes:** Painéis visuais para comparação de receitas vs. despesas e evolução patrimonial.
6. **Orçamento Pessoal:** Definição de limites de gastos por categoria com alertas de teto orçamentário.

---

## 👥 Membros da Equipe
* **Arthur Fernando Fernandes Vasconcelos** - *Frontend Developer*
* **Davi Emílio de Paula Fonseca** - *Fullstack Developer*
* **Eduardo Christianini Fonseca Junior** - *Backend Developer*
* **Joao Vitor Cota Silva** - *Frontend Developer*
* **Tharsos Gabriel Couto Fernandes** - *Backend Developer*

---

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React (TypeScript)
* **Backend:** Node.js (JavaScript)
* **Banco de Dados:** PostgreSQL
* **Containerização:** Docker
* **Versionamento:** GitHub
* **Design/Prototipagem:** Figma e Base44

---

## 📋 Backlog do Produto (Product Backlog)

### 🔐 [ÉPICO] Autenticação e Segurança do Usuário
- [x] **[História 1]** Como um novo usuário, eu quero poder me cadastrar na plataforma usando meu e-mail e uma senha.
- [x] **[História 2]** Como um usuário cadastrado, eu quero poder fazer login no sistema para acessar meu painel.
- [ ] **[História 3]** Como um usuário logado, eu quero poder fazer logout da minha conta.
- [x] **[História 4]** Como um usuário que esqueceu a senha, eu quero poder solicitar uma redefinição via e-mail.

### 💸 [ÉPICO] Gestão de Transações (Receitas e Despesas)
- [x] **[História 5]** Como usuário, eu quero poder registrar uma nova despesa informando valor, data e categoria.
- [x] **[História 6]** Como usuário, eu quero poder registrar uma nova receita para acompanhar minha renda.
- [ ] **[História 7]** Como usuário, eu quero poder editar os detalhes de uma transação já registrada.
- [x] **[História 8]** Como usuário, eu quero poder excluir uma transação registrada por engano.
- [x] **[História 9]** Como usuário, eu quero ver uma lista de todas as minhas transações em ordem cronológica.

### 📊 [ÉPICO] Visualização e Orçamento
- [x] **[História 10]** Como usuário, eu quero ver um dashboard com meu saldo atual (Receitas - Despesas).
- [x] **[História 11]** Como usuário, eu quero ver um gráfico de gastos por categoria no mês atual.
- [x] **[História 12]** Como usuário, eu quero poder definir um limite de orçamento mensal por categoria.
- [ ] **[História 13]** Como usuário, eu quero ver um alerta visual quando atingir 80% do meu limite de orçamento.

### 🔍 [ÉPICO] Filtros e Exportação (Melhorias de UX)
- [ ] **[História 14]** Como usuário, quero filtrar minha lista de transações por mês e ano para análise histórica.
- [ ] **[História 15]** Como usuário, quero poder baixar um arquivo CSV das minhas transações para uso externo.

5. ## 📅 Backlog da Sprint 1

**Meta da Sprint:** "Permitir que um usuário se cadastre, faça login, registre transações financeiras e visualize seu saldo consolidado no dashboard."

---

### 🛡️ [História 1] Cadastro de Usuário
**Descrição:** Como um novo usuário, eu quero poder me cadastrar na plataforma usando meu e-mail e uma senha, para que eu possa ter uma conta pessoal e segura.

- [x] Criar modelo de dados `User` no Banco de Dados.
- [x] Desenvolver endpoint `POST /auth/register` no Backend.
- [x] Criar tela de Cadastro com validação de campos no Frontend.

---

### 🔑 [História 2] Login e Autenticação
**Descrição:** Como um usuário cadastrado, eu quero poder fazer login no sistema, para acessar meu painel financeiro de forma segura.

- [x] Criar endpoint `POST /auth/login` com geração de Token JWT no Backend.
- [x] Criar tela de Login no Frontend.
- [x] Implementar armazenamento do token (LocalStorage) e proteção de rotas privadas.

---

### 💸 [História 3] Registro de Despesas
**Descrição:** Como usuário, eu quero poder registrar uma nova despesa, informando valor, data, descrição e categoria, para acompanhar minhas saídas financeiras.

- [x] Criar modelo `Transaction` (identificado com tipo: "gasto") no Backend.
- [x] Criar endpoint `POST /transactions` para salvar os dados.
- [x] Desenvolver formulário de entrada de despesas no Frontend.

---

### 💰 [História 4] Registro de Receitas
**Descrição:** Como usuário, eu quero poder registrar uma nova receita, informando valor, data, descrição e categoria, para saber quanto dinheiro estou recebendo.

- [x] Reutilizar o modelo e endpoint de transações, enviando o tipo como "receita".
- [x] Desenvolver interface para entrada de receitas no Frontend.
- [x] Listar transações cadastradas para conferência do usuário.

---

### 📊 [História 5] Dashboard de Saldo Consolidado
**Descrição:** Como usuário, eu quero ver um dashboard principal com o meu saldo atualizado, para entender minha situação financeira rapidamente.

- [x] Criar endpoint `GET /transactions` para buscar o histórico do usuário.
- [x] Implementar lógica no Frontend para somar receitas, subtrair despesas e calcular o saldo total.
- [x] Criar componentes visuais de resumo (Cards de Saldo, Receitas e Despesas) no Dashboard.
