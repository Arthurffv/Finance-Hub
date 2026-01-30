// src/pages/Transactions.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import Sidebar from '../components/SideBar';
import { 
  apiGetTransactions, apiCreateTransaction, apiDeleteTransaction, type Transaction 
} from '../services/api/ApiService';
import { 
  Plus, Trash2, X, ArrowUpCircle, ArrowDownCircle, Calendar 
} from 'lucide-react';

// IMPORTANDO O CSS ESPECÍFICO DESTA PÁGINA
import '../styles/Transactions.css';

export default function Transactions() {
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do Formulário
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'gasto'>('gasto');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await apiGetTransactions();
      setTransacoes(dados.reverse());
    } catch (error) {
      console.error("Erro ao carregar", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await apiCreateTransaction({
        titulo,
        valor: Number(valor),
        tipo,
        categoria,
        data: data || new Date().toISOString()
      });
      setIsModalOpen(false);
      limparFormulario();
      await carregarDados();
    } catch (error) {
      alert('Erro ao salvar transação');
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Tem certeza que deseja excluir?")) {
        await apiDeleteTransaction(id);
        await carregarDados();
    }
  }

  const limparFormulario = () => {
    setTitulo('');
    setValor('');
    setTipo('gasto');
    setCategoria('');
    setData('');
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <header className="content-header">
          <div>
            <h2>Transações</h2>
            <div className="date-display">
                <Calendar size={16}/>
                <span>Gerencie suas entradas e saídas</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Nova Transação
          </button>
        </header>

        {loading ? <p>Carregando...</p> : (
          <div className="transaction-list-container">
            {transacoes.length === 0 ? (
                <div className="empty-state">Nenhuma transação registrada.</div>
            ) : (
                transacoes.map((t) => (
                <div key={t.id} className="t-item">
                    <div className="t-info">
                        <div className="t-icon">
                            {t.tipo === 'receita' ? <ArrowUpCircle color="#10B981"/> : <ArrowDownCircle color="#EF4444"/>}
                        </div>
                        <div className="t-details">
                            <h4>{t.titulo}</h4>
                            <span>{t.categoria} • {new Date(t.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                    
                    <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <span className={`t-value ${t.tipo === 'receita' ? 'text-green' : 'text-red'}`}>
                            {t.tipo === 'gasto' ? '- ' : '+ '}
                            R$ {Number(t.valor).toFixed(2)}
                        </span>
                        <button className="btn-danger" onClick={() => handleDelete(t.id)}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
                ))
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
                <h3>Nova Transação</h3>
                <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', cursor:'pointer'}}>
                    <X size={24} color="#6B7280"/>
                </button>
            </div>
            <form onSubmit={handleSalvar}>
                <div className="form-group">
                    <label>Descrição</label>
                    <input className="form-input" type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ex: Salário..." />
                </div>
                
                <div className="form-row">
                    <div className="form-group" style={{flex:1}}>
                        <label>Valor (R$)</label>
                        <input className="form-input" type="number" value={valor} onChange={e => setValor(e.target.value)} required placeholder="0.00" />
                    </div>
                    <div className="form-group" style={{flex:1}}>
                        <label>Tipo</label>
                        <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value as 'receita' | 'gasto')}>
                            <option value="gasto">Despesa</option>
                            <option value="receita">Receita</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Categoria</label>
                    <input className="form-input" type="text" value={categoria} onChange={e => setCategoria(e.target.value)} required placeholder="Ex: Alimentação" />
                </div>
                
                <div className="form-group">
                    <label>Data</label>
                    <input className="form-input" type="date" value={data} onChange={e => setData(e.target.value)} />
                </div>

                <button type="submit" className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'1rem'}}>
                    Salvar
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}