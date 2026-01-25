import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importante para navegação
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  User, 
  LogOut, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  MessageCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import '../styles/Dashboard.css';

// Importando seus serviços para buscar dados reais
import { apiGetTransactions, apiGetProfile, type Transaction } from '../services/api/ApiService';

const Dashboard: React.FC = () => {
  // Estados para armazenar dados reais
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState('Usuário');
  const [resumo, setResumo] = useState({
    saldo: 0,
    receitas: 0,
    despesas: 0,
    countReceitas: 0,
    countDespesas: 0
  });

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [listaTransacoes, perfil] = await Promise.all([
        apiGetTransactions(),
        apiGetProfile()
      ]);

      setTransacoes(listaTransacoes);
      if (perfil.nome) setUserName(perfil.nome);
      calcularResumo(listaTransacoes);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    }
  };

  const calcularResumo = (lista: Transaction[]) => {
    let rec = 0;
    let desp = 0;
    let cRec = 0;
    let cDesp = 0;

    // Filtra transações do mês atual (Opcional: aqui estou pegando total geral para simplificar)
    lista.forEach(t => {
      const valor = Number(t.valor);
      if (t.tipo === 'receita') {
        rec += valor;
        cRec++;
      } else {
        desp += valor;
        cDesp++;
      }
    });

    setResumo({
      saldo: rec - desp,
      receitas: rec,
      despesas: desp,
      countReceitas: cRec,
      countDespesas: cDesp
    });
  };

  // Prepara dados para o gráfico (agrupando por mês - lógica simplificada)
  // Num cenário real, você agruparia 'transacoes' por data.
  // Mantive o mock data para o gráfico por enquanto para não quebrar o visual sem ter muitas transações.
  const dataChart = [
    { name: 'ago', receitas: 0, despesas: 0 },
    { name: 'set', receitas: 0, despesas: 0 },
    { name: 'out', receitas: 200, despesas: 0 },
    { name: 'nov', receitas: 1400, despesas: 100 },
    { name: 'dez', receitas: 1000, despesas: 450 },
    { name: 'jan', receitas: 0, despesas: 0 }, // Futuro: preencher com dados reais
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">B</div>
          <div>
            <h1 className="logo-text">FinanceHub</h1>
            <span className="logo-subtext">Controle Inteligente</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-title">MENU PRINCIPAL</p>
            <ul>
              {/* Link para o Dashboard (Página atual) */}
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <li className="active">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </li>
              </Link>
              
              {/* Link para Transações */}
              <Link to="/transactions" style={{ textDecoration: 'none' }}>
                <li>
                  <ArrowRightLeft size={20} />
                  <span>Transações</span>
                </li>
              </Link>
              
              {/* Link para Perfil */}
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <li>
                  <User size={20} />
                  <span>Perfil</span>
                </li>
              </Link>
            </ul>
          </div>

          <div className="nav-section">
            <p className="nav-title">WHATSAPP</p>
            <button className="whatsapp-btn">
              <MessageCircle size={20} />
              Conectar WhatsApp
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <p className="user-name">{userName}</p>
              <p className="user-email">Ver perfil completo</p>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <h2>Dashboard Financeiro</h2>
          <div className="date-display">
            📅 {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </div>
        </header>

        {/* Cards Row com DADOS REAIS */}
        <div className="cards-grid">
          <div className="card">
            <div className="card-header">
              <span>Saldo Atual</span>
              <div className="icon-bg green-light">
                <Wallet size={20} className="text-green" />
              </div>
            </div>
            <div className="card-value">
              R$ {resumo.saldo.toFixed(2)}
            </div>
            <div className="card-footer text-gray">
              Atualizado agora
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span>Receitas Totais</span>
              <div className="icon-bg green-light">
                <TrendingUp size={20} className="text-green" />
              </div>
            </div>
            <div className="card-value text-green">
              R$ {resumo.receitas.toFixed(2)}
            </div>
            <div className="card-footer text-green">
              ↗ {resumo.countReceitas} transações
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span>Despesas Totais</span>
              <div className="icon-bg red-light">
                <TrendingDown size={20} className="text-red" />
              </div>
            </div>
            <div className="card-value text-red">
              R$ {resumo.despesas.toFixed(2)}
            </div>
            <div className="card-footer text-red">
              ↘ {resumo.countDespesas} transações
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Evolução (Simulação)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dataChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorReceitas)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    stroke="#EF4444" 
                    fillOpacity={1} 
                    fill="url(#colorDespesas)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot green"></span> Receitas</span>
                <span className="legend-item"><span className="dot red"></span> Despesas</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Gastos por Categoria</h3>
            <div className="empty-state" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999'}}>
              Em breve
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;