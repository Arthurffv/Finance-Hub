import React, { useEffect, useState } from 'react';
import Sidebar from  '../components/SideBar';
import { 
  Download, 
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import '../styles/Dashboard.css';
import '../styles/Reports.css'; 
import { apiGetTransactions, type Transaction } from '../services/api/ApiService';

const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiGetTransactions();
        if (Array.isArray(data)) {
          setTransactions(data);
          setFilteredTransactions(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados de relatórios:", error);
      }
    };
    loadData();
  }, []);

  const handleExportCSV = () => {
    const dataToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions;
    
    const headers = ['Data,Categoria,Descricao,Valor,Tipo\n'];
    const rows = dataToExport.map(t => 
      `${new Date(t.data).toLocaleDateString('pt-BR')},${t.categoria || 'Outros'},${t.titulo},${t.valor},${t.tipo}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_financeiro_${new Date().toLocaleDateString('pt-BR')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar adicionada para corrigir a navegação lateral */}
      <Sidebar />

      <main className="main-content">
        <header className="content-header reports-header">
          <div>
            <h2>Relatórios Detalhados</h2>
            <p className="text-gray">Analise e exporte sua movimentação financeira</p>
          </div>
          <button className="export-btn" onClick={handleExportCSV}>
            <Download size={20} />
            Exportar CSV
          </button>
        </header>

        <section className="card filter-section">
          <div className="filter-group">
            <div className="input-container">
              <label htmlFor="date-start" className="nav-title">DATA INICIAL</label>
              <input 
                id="date-start"
                type="date" 
                className="date-input" 
                placeholder="dd/mm/aaaa"
              />
            </div>
            <div className="input-container">
              <label htmlFor="date-end" className="nav-title">DATA FINAL</label>
              <input 
                id="date-end"
                type="date" 
                className="date-input" 
                placeholder="dd/mm/aaaa"
              />
            </div>
            <button className="btn-filter" onClick={() => console.log("Filtrando em:", transactions.length, "itens")}>
              <Filter size={18} />
              Filtrar
            </button>
          </div>
        </section>

        <div className="chart-card table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th className="nav-title">DATA</th>
                <th className="nav-title">CATEGORIA</th>
                <th className="nav-title">DESCRIÇÃO</th>
                <th className="nav-title">TIPO</th>
                <th className="nav-title text-right">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t, index) => (
                  <tr key={index}>
                    <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className="category-badge">
                        {t.categoria || 'Geral'}
                      </span>
                    </td>
                    <td>{t.titulo}</td>
                    <td>
                      {t.tipo === 'receita' ? 
                        <TrendingUp size={16} className="text-green" /> : 
                        <TrendingDown size={16} className="text-red" />
                      }
                    </td>
                    <td className={`text-right fw-600 ${t.tipo === 'receita' ? 'text-green' : 'text-red'}`}>
                      {t.tipo === 'gasto' ? '-' : '+'} R$ {Math.abs(Number(t.valor)).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-state">Nenhuma transação encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Reports;