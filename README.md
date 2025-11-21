# FINANCE HUB

1. Escopo do Sistema<br>
   1.1 - Objetivo<br>
       Um sistema de Gestão Financeira Pessoal (Finance Hub), com o objetivo principal de fornecer uma plataforma centralizada e detalhada para o controle e gestão das finanças pessoais, de que forma que o usuário possa ter uma visão clara e total da sua vida financeira.<br>
   1.2  - Features<br>
       As principais Features (funcionalidades) serão:<br>
       1. Controle de Gastos e Despesas: Permitir o registro de todas as saídas de dinheiro, classificadas por categorias (alimentação, moradia, transporte, lazer, etc.)<br>
       2. Gestão de Entradas e Receitas: Permitir o registro de todas as fontes de renda, como salário, rendimentos extras e outros e outros recebimentos, para acompanhar o fluxo de caixa positivo.<br>
       3. Acompanhamento de Investimentos: Possibilitar o registro e a visualização da carteira de investimentos (ações, fundos, renda fixa, etc.), monitorando rentabilidade e alocação.<br>
       4. Detalhamento Financeiro: Oferecer a capacidade de incluir detalhes importantes em cada transação, como datas de vencimento, pagamentos recorrentes e notas explicativas.<br>
       5. Geração de Relatórios e Dashboards: Apresentar painéis visuais intuitivos e relatórios pesonalizáveis (mensais, anuais) sobre o desempenho financeiro, comparando receitas vs despesas e a evolução dos investimentos.<br>
       6. Orçamento Pessoal: Funcionalidade para criar e acompanhar orçamentos definidos por categoria, ajudando o usuário a manter-se dentro dos limites financeiros estabelecidos.<br>

2. Membros da Equipe<br>
     Arthur Fernando Fernandes Vasconcelos - Frontend Developer<br>
     Davi Emílio de Paula Fonseca - Fullstack Developer<br>
     Eduardo Christianini Fonseca Junior - Backend Developer<br>
     Joao Vitor Cota Silva- Frontend Developer<br>
     Tharsos Gabriel Couto Fernandes- Backend Developer<br>

3. Tecnologias<br>
     Frontend: React<br>
     Backend: Python com Django<br>
     Controle de versão: GitHub<br>
     Gerenciamento de Ambientes (Containerização): Docker<br>
     Prototipagem: Figma e Base44<br>
     Banco de Dados: PostgreSQL<br>
4. Backlog do Produto (Product Backlog)<br>

[ÉPICO] Autenticação e Segurança do Usuário<br>
[História 1] Como um novo usuário, eu quero poder me cadastrar na plataforma usando meu e-mail e uma senha, para que eu possa ter uma conta pessoal e segura.<br>
[História 2] Como um usuário cadastrado, eu quero poder fazer login no sistema, para acessar meu painel financeiro.<br>
[História 3] Como um usuário logado, eu quero poder fazer logout da minha conta, para garantir que ninguém mais acesse minhas informações no meu dispositivo.<br>
[História 4] Como um usuário que esqueceu a senha, eu quero poder solicitar uma redefinição de senha através do meu e-mail, para recuperar o acesso à minha conta.<br>

[ÉPICO] Gestão de Transações (Receitas e Despesas)<br>
[História 5] Como usuário, eu quero poder registrar uma nova despesa, informando valor, data, descrição e uma categoria, para que eu possa acompanhar para onde meu dinheiro está indo.<br>
[História 6] Como usuário, eu quero poder registrar uma nova receita, informando valor, data, descrição e uma categoria (ex: "Salário", "Freelance"), para saber quanto dinheiro estou recebendo.<br>
[História 7] Como usuário, eu quero poder editar os detalhes (valor, data, descrição, categoria) de uma transação que já registrei, para corrigir erros ou adicionar informações.<br>
[História 8] Como usuário, eu quero poder excluir uma transação que registrei por engano ou que não é mais relevante.<br>
[História 9] Como usuário, eu quero ver uma lista de todas as minhas transações recentes (receitas e despesas) em ordem cronológica, para ter uma visão geral do meu fluxo de caixa.<br>

[ÉPICO] Visualização e Orçamento<br>
[História 10] Como usuário, eu quero ver um dashboard principal com o meu saldo atual (Total de Receitas - Total de Despesas do mês), para entender minha situação financeira rapidamente.<br>
[História 11] Como usuário, eu quero ver um gráfico (ex: pizza ou barras) no dashboard que mostre meus gastos totais por categoria no mês atual, para identificar onde estou gastando mais.<br>
[História 12] Como usuário, eu quero poder definir um limite de orçamento mensal para categorias específicas (ex: R$ 400 em "Restaurantes"), para tentar controlar meus gastos.<br>
[História 13] Como usuário, eu quero ser notificado ou ver um alerta visual quando eu estiver próximo (ex: 80%) de atingir o limite de orçamento de uma categoria.<br>

[ÉPICO] Acompanhamento de Investimentos (Feature Futura)<br>
[História 14] Como usuário, eu quero poder registrar meus diferentes tipos de investimentos (ex: Ações, Renda Fixa) e a quantidade/valor aplicado, para centralizar minhas finanças.<br>
[História 15] Como usuário, eu quero poder atualizar o valor atual dos meus investimentos, para acompanhar a rentabilidade da minha carteira.<br>

5. Backlog da Sprint (Sprint Backlog) - Sprint 1<br>
Meta da Sprint 1: "Permitir que um usuário se cadastre, faça login, registre uma transação (receita ou despesa) e veja seu saldo atualizado."<br>

[História 1] Como um novo usuário, eu quero poder me cadastrar na plataforma usando meu e-mail e uma senha, para que eu possa ter uma conta pessoal e segura.<br>
(Tarefas Técnicas: Criar modelo User, endpoint /register no Backend, Tela de Cadastro no Frontend).<br>

[História 2] Como um usuário cadastrado, eu quero poder fazer login no sistema, para acessar meu painel financeiro.<br>
(Tarefas Técnicas: Criar endpoint /login com JWT/token no Backend, Tela de Login no Frontend, gestão de estado de autenticação).<br>

[História 3] Como usuário, eu quero poder registrar uma nova despesa, informando valor, data, descrição e uma categoria, para que eu possa acompanhar para onde meu dinheiro está indo.<br>
(Tarefas Técnicas: Criar modelo Transaction e Category no Backend, endpoint POST /transactions no Backend, formulário "Nova Despesa" no Frontend).<br>

[História 4] Como usuário, eu quero poder registrar uma nova receita, informando valor, data, descrição e uma categoria (ex: "Salário", "Freelance"), para saber quanto dinheiro estou recebendo.<br>
(Tarefas Técnicas: Reutilizar o endpoint POST /transactions (diferenciando por tipo), formulário "Nova Receita" no Frontend).<br>

[História 5] Como usuário, eu quero ver um dashboard principal com o meu saldo atual (Total de Receitas - Total de Despesas do mês), para entender minha situação financeira rapidamente.<br>
(Tarefas Técnicas: Criar endpoint GET /dashboard/summary no Backend que calcula o saldo, componente de "Saldo" na tela principal do Frontend).<br>
