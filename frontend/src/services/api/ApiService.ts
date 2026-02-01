// frontend/src/services/api/ApiService.ts
import axios from 'axios'; // <--- 1. Importamos o Axios

const API_URL = 'http://localhost:3000'; // <--- 2. Definimos o endereço do Backend

// --- 1. Interfaces ---

export interface LoginResponse {
  token: string;
  user: { id: number; nome: string; email: string; }
}

export interface RegisterResponse {
  id: number; nome: string; email: string;
}

export interface ForgotResponse {
  email: string; message: string;
}

export interface Transaction {
  id: number;
  titulo: string;
  valor: number;
  tipo: 'receita' | 'gasto';
  categoria: string;
  data: string;
}

export interface SummaryResponse {
  saldo_total: number;
  total_receitas: number;
  total_gastos: number;
}

export interface UserProfile {
  nome: string;
  email: string;
  telefone: string;
  salario: number;
  custos_basicos: number;
  limite_alerta: number;
}

export interface FinancialGoal {
  titulo: string;
  valor_objetivo: number;
  valor_atual: number;
  data_limite: string;
}

// --- 2. Dados Falsos (Mock para o Dashboard) ---
// Mantemos isso para as telas internas funcionarem enquanto não fazemos o backend delas

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const generateToken = (email: string) => `fake-jwt-${btoa(email)}-${Date.now()}`;

let mockTransactions: Transaction[] = [
  { 
    id: 1, 
    titulo: 'Salário Mensal', 
    valor: 5000.00, 
    tipo: 'receita', 
    categoria: 'Trabalho', 
    data: new Date().toISOString() 
  },
  { 
    id: 2, 
    titulo: 'Almoço Restaurante', 
    valor: 45.90, 
    tipo: 'gasto', 
    categoria: 'Alimentação', 
    data: new Date().toISOString() 
  },
  { 
    id: 3, 
    titulo: 'Uber', 
    valor: 15.50, 
    tipo: 'gasto', 
    categoria: 'Transporte', 
    data: new Date().toISOString() 
  },
];

let mockProfile: UserProfile = {
  nome: 'Dev Teste',
  email: 'dev@email.com',
  telefone: '(31) 99999-9999',
  salario: 5000.00,
  custos_basicos: 2000.00,
  limite_alerta: 3000.00
};

let mockGoal: FinancialGoal = {
  titulo: 'Reserva de Emergência',
  valor_objetivo: 10000,
  valor_atual: 2500,
  data_limite: '2026-12-25'
};

// --- 3. Funções da API (AQUI ESTÁ A MUDANÇA) ---

// LOGIN REAL (Conectado ao Backend)
export const apiLogin = async (email: string, senha: string): Promise<LoginResponse> => {
  try {
    // Envia para o backend
    const response = await axios.post(`${API_URL}/users/login`, {
      email: email,
      password: senha // O backend espera 'password', mas o front enviava 'senha'
    });

    // Ajuste Técnico: O Front espera 'nome' e ID número, o Back manda 'username' e ID string (UUID)
    // Vamos adaptar a resposta aqui para o Front não quebrar
    return {
      token: response.data.token,
      user: {
        id: 1, // Mockamos o ID numérico pois o front não aceita UUID ainda
        nome: response.data.user.username, // Mapeamos username -> nome
        email: response.data.user.email
      }
    };
  } catch (error: any) {
    console.error("Erro no login:", error);
    // Se o backend mandou mensagem de erro, repassa ela
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Falha ao conectar com o servidor');
  }
};

// CADASTRO REAL (Conectado ao Backend)
export const apiRegister = async (nome: string, email: string, senha: string): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, {
      username: nome, // Mapeamos nome -> username
      email: email,
      password: senha
    });

    return {
      id: 1, // Mockamos o ID numérico
      nome: response.data.username,
      email: response.data.email
    };
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao criar conta');
  }
};

// --- MANTENDO O RESTO COMO MOCK (Não mexa daqui para baixo) ---
// Essas funções continuam falsas até criarmos o backend financeiro

export const apiForgot = async (email: string): Promise<ForgotResponse> => {
  await delay(800);
  return { email, message: 'Email enviado' };
};

export const apiGetTransactions = async (): Promise<Transaction[]> => {
  await delay(500);
  return [...mockTransactions];
};

export const apiCreateTransaction = async (nova: Omit<Transaction, 'id'>): Promise<Transaction> => {
  await delay(500);
  const item = { id: Date.now(), ...nova };
  mockTransactions.push(item);
  return item;
};

export const apiDeleteTransaction = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockTransactions.findIndex(t => t.id === id);
  if (index !== -1) mockTransactions.splice(index, 1);
};

export const apiGetSummary = async (): Promise<SummaryResponse> => {
  await delay(500);
  const receitas = mockTransactions
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + Number(t.valor), 0);
    
  const gastos = mockTransactions
    .filter(t => t.tipo === 'gasto')
    .reduce((acc, t) => acc + Number(t.valor), 0);
  
  return {
    total_receitas: receitas,
    total_gastos: gastos,
    saldo_total: receitas - gastos
  };
};

export const apiGetProfile = async (): Promise<UserProfile> => {
  await delay(600);
  return { ...mockProfile };
};

export const apiUpdateProfile = async (dados: UserProfile): Promise<UserProfile> => {
  await delay(1000);
  mockProfile = { ...dados };
  return mockProfile;
};

export const apiGetGoal = async (): Promise<FinancialGoal> => {
  await delay(600);
  return { ...mockGoal };
};

export const apiUpdateGoal = async (meta: FinancialGoal): Promise<FinancialGoal> => {
  await delay(1000);
  mockGoal = { ...meta };
  return mockGoal;
};