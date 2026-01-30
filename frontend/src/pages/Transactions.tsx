// frontend/src/pages/Transactions.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { apiGetTransactions, apiCreateTransaction, apiDeleteTransaction, type Transaction } from '../services/api/ApiService';
import { MdAdd, MdDelete, MdAttachMoney, MdClose, MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

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
      setTransacoes(dados);
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
      <header className="dashboard-header">
        <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
            <Link to="/dashboard" style={{color: 'white', textDecoration:'none'}}><MdArrowBack size={24}/></Link>
            <h2>Transações</h2>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="actions-bar">
          <h3>Histórico Completo</h3>
          <button className="btn-new" onClick={() => setIsModalOpen(true)}>
            <MdAdd size={20} /> Nova
          </button>
        </div>

        {loading ? <p>Carregando...</p> : (
          <ul className="transaction-list">
            {transacoes.map((t) => (
              <li key={t.id} className={`transaction-item ${t.tipo}`}>
                <div className="icon-area"><MdAttachMoney /></div>
                <div className="info-area">
                    <strong>{t.titulo}</strong>
                    <span>{t.categoria} • {new Date(t.data).toLocaleDateString()}</span>
                </div>
                <div className="value-area">
                    <span className="value">
                        {t.tipo === 'gasto' ? '- ' : '+ '}
                        R$ {Number(t.valor).toFixed(2)}
                    </span>
                    <button className="btn-delete" onClick={() => handleDelete(t.id)}>
                        <MdDelete />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
                <h3>Nova Transação</h3>
                <button onClick={() => setIsModalOpen(false)} className="btn-close"><MdClose size={24}/></button>
            </div>
            <form onSubmit={handleSalvar}>
                <div className="form-group">
                    <label>Descrição</label>
                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ex: Almoço" />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Valor (R$)</label>
                        <input type="number" value={valor} onChange={e => setValor(e.target.value)} required placeholder="0.00" />
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value as 'receita' | 'gasto')}>
                            <option value="gasto">Despesa</option>
                            <option value="receita">Receita</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Categoria</label>
                    <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} required placeholder="Ex: Alimentação" />
                </div>
                <div className="form-group">
                    <label>Data</label>
                    <input type="date" value={data} onChange={e => setData(e.target.value)} />
                </div>
                <button type="submit" className="btn-save">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}