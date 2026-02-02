import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import '../styles/Dashboard.css';

import { apiGetTransactions, type Transaction } from '../services/api/ApiService';

interface ChartData {
  name: string;
  receitas: number;
  despesas: number;
  originalDate: Date;
}

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];


const Dashboard: React.FC = () => {
  const [dataChart, setDataChart] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [resumo, setResumo] = useState({
    saldo: 0,
    receitas: 0,
    despesas: 0,
    countReceitas: 0,
    countDespesas: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const listaTransacoes = await apiGetTransactions();
      processarDadosResumo(listaTransacoes);
      processarDadosGrafico(listaTransacoes);
      processarDadosCategorias(listaTransacoes);
    } catch (error) {
      console.error("Erro ao carregar dados do Dashboard:", error);
    }
  };

  const processarDadosResumo = (lista: Transaction[]) => {
    let rec = 0, desp = 0, cRec = 0, cDesp = 0;

    lista.forEach(t => {
      const valor = Number(t.valor);
      const tipo = t.tipo as string; // Casting para evitar erro de overlap
      
      if (tipo === 'receita') {
        rec += valor;
        cRec++;
      } else if (tipo === 'gasto' || tipo === 'despesa') {
        desp += valor;
        cDesp++;
      }
    });

    setResumo({ saldo: rec - desp, receitas: rec, despesas: desp, countReceitas: cRec, countDespesas: cDesp });
  };

  const processarDadosGrafico = (lista: Transaction[]) => {
    const hoje = new Date();
    const ultimosMeses: ChartData[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const nomeMes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
      ultimosMeses.push({ name: nomeMes, receitas: 0, despesas: 0, originalDate: d });
    }

    lista.forEach(t => {
      const dataTransacao = new Date(t.data);
      const mesRef = ultimosMeses.find(m => 
        m.originalDate.getMonth() === dataTransacao.getMonth() &&
        m.originalDate.getFullYear() === dataTransacao.getFullYear()
      );

      if (mesRef) {
        if ((t.tipo as string) === 'receita') mesRef.receitas += Number(t.valor);
        else mesRef.despesas += Number(t.valor);
      }
    });
    setDataChart(ultimosMeses);
  };

  const processarDadosCategorias = (lista: Transaction[]) => {
    const gastos = lista.filter(t => (t.tipo as string) === 'gasto' || (t.tipo as string) === 'despesa');
    const agrupado = gastos.reduce((acc: Record<string, number>, curr) => {
      const cat = curr.categoria || 'Outros';
      acc[cat] = (acc[cat] || 0) + Number(curr.valor);
      return acc;
    }, {});

    const formatado = Object.keys(agrupado).map(key => ({
      name: key,
      value: agrupado[key]
    })).sort((a, b) => b.value - a.value);

    setCategoryData(formatado);
  };

  // Correção definitiva para o erro do Formatter
  const tooltipFormatter = (value: number | string | undefined) => {
    if (value === undefined) return 'R$ 0,00';
    const numValue = typeof value === 'string' ? Number(value) : value;
    return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <h2>Dashboard Financeiro</h2>
          <div className="date-display">
            <Calendar size={18} />
            <span>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        <div className="cards-grid">
          <div className="card">
            <div className="card-header"><span>Saldo Atual</span><Wallet size={20} className="text-green" /></div>
            <div className="card-value">R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="card-footer text-gray">Total acumulado</div>
          </div>
          <div className="card">
            <div className="card-header"><span>Receitas</span><TrendingUp size={20} className="text-green" /></div>
            <div className="card-value text-green">R$ {resumo.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="card-footer text-green">↗ {resumo.countReceitas} transações</div>
          </div>
          <div className="card">
            <div className="card-header"><span>Despesas</span><TrendingDown size={20} className="text-red" /></div>
            <div className="card-value text-red">R$ {resumo.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="card-footer text-red">↘ {resumo.countDespesas} transações</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Fluxo de Caixa</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dataChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Area type="monotone" dataKey="receitas" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="despesas" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart-card">
            <h3>Gastos por Categoria</h3>
            <div className="chart-wrapper">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty-state">Sem dados para exibir</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;