/**
 * Este arquivo simula o backend (API) do Finance Hub.
 * Ele permite que o time de Frontend construa e teste
 * o aplicativo inteiro sem precisar do servidor real.
 */


export interface LoginResponse {
  token:string;
}

export interface RegisterResponse {
  id: number;
  nome: string;
  email: string;
}

export interface Transaction{
  id:number;
  titulo: string;
  valor: number;
  tipo: 'receita' | 'gasto';
  categoria: string;
  data: string;
}

export interface SummaryResponse{
  saldo_total: number;
  total_receitas: number;
  total_gastos: number;
}

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
// --- 1. Autenticação ---

export const apiLogin = async (email:string, senha:string) => {
  await delay(1000); // Simula 1 segundo de "loading"

  // Usuário de teste
  if (email === 'dev@email.com' && senha === '123') {
    console.log('MOCK LOGIN: Sucesso');
    // Retorna o token, conforme o contrato
    return { token: 'fake-jwt-token-123456' };
  } else {
    // Retorna um erro, conforme o contrato
    console.error('MOCK LOGIN: Falha');
    throw new Error('Email ou senha inválidos.');
  }
};

export const apiRegister = async (nome:string, email:string, senha:string) => {
  await delay(1500);
  
  // Simula um email que já existe
  if (email === 'usado@email.com') {
    console.error('MOCK REGISTER: Email já existe');
    throw new Error('Este email já está em uso.');
  }

  // Simula o sucesso do cadastro
  console.log('MOCK REGISTER: Sucesso', { nome, email });
  return { id: 1, nome: nome, email: email };
};


// --- 2. Banco de Dados Falso (em memória) ---

// Usamos 'let' para que a lista possa ser modificada
let mockTransactions = [
  { 
    id: 1, 
    titulo: 'Salário (Mock)', 
    valor: 5000.00, 
    tipo: 'receita', 
    categoria: 'Salário',
    data: "2025-11-05T09:00:00Z"
  },
  { 
    id: 2, 
    titulo: 'Almoço no RU (Mock)', 
    valor: 5.50, 
    tipo: 'gasto', 
    categoria: 'Alimentação',
    data: "2025-11-09T12:30:00Z"
  },
  { 
    id: 3, 
    titulo: 'Café (Mock)', 
    valor: 8.00, 
    tipo: 'gasto', 
    categoria: 'Alimentação',
    data: "2025-11-08T15:00:00Z"
  },
];

// --- 3. Transações e Dashboard ---

export const apiGetTransactions = async () => {
  await delay(800);
  console.log('MOCK GET TRANSACTIONS: Retornando lista');
  // Retorna uma cópia da lista
  return [...mockTransactions];
};


export const apiGetSummary = async () => {
  await delay(500);

  // Calcula o resumo dinamicamente
  let totalReceitas = 0;
  let totalGastos = 0;

  for (const t of mockTransactions) {
    if (t.tipo === 'receita') {
      totalReceitas += Number(t.valor);
    } else {
      totalGastos += Number(t.valor);
    }
  }

  const summary = {
    total_receitas: totalReceitas,
    total_gastos: totalGastos,
    saldo_total: totalReceitas - totalGastos,
  };
  
  console.log('MOCK GET SUMMARY: Resumo calculado', summary);
  return summary;
};