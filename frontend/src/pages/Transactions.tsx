import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { apiGetTransactions, apiCreateTransaction, apiDeleteTransaction, type Transaction } from '../services/api/ApiService';
import { MdAdd, MdDelete, MdClose } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';
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
      console.log("Iniciando busca de dados..."); // Log 1
      const dados = await apiGetTransactions();
      console.log("Dados recebidos da API:", dados); // Log 2 - VEJA ISSO NO CONSOLE (F12)

      // Verificação de segurança: Se dados for null/undefined, usa array vazio
      if (Array.isArray(dados)) {
        setTransacoes(dados);
      } else {
        console.error("Formato inesperado recebido:", dados);
        setTransacoes([]); 
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
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
           <div className="transactions-header-content">
             <h2>Transações</h2>
           </div>
        </header>

        <div className="actions-bar">
          <button className="btn-new-transaction" onClick={() => setIsModalOpen(true)}>
            <MdAdd size={20} /> Nova Transação
          </button>
        </div>

        {loading ? <p>Carregando...</p> : (
          <ul className="transaction-list">
            {transacoes.map((t) => (
              <li key={t.id} className={`transaction-item ${t.tipo}`}>
                <div className="info-area">
                    <strong>{t.titulo}</strong>
                    <span>{t.categoria} • {new Date(t.data).toLocaleDateString()}</span>
                </div>
                <div className="value-area">
                    <span className={`value-text ${t.tipo}`}>
                        {t.tipo === 'gasto' ? '- ' : '+ '}
                        R$ {Number(t.valor).toFixed(2)}
                    </span>
                    {/* Botão com title para acessibilidade */}
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(t.id)}
                      title="Excluir transação"
                      aria-label="Excluir transação"
                    >
                        <MdDelete size={20} />
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
                {/* Botão com title para acessibilidade */}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn-close"
                  title="Fechar modal"
                  aria-label="Fechar modal"
                >
                  <MdClose size={24}/>
                </button>
            </div>
            
            <form onSubmit={handleSalvar} className="form-layout">
                <div className="form-group">
                    <label htmlFor="input-descricao">Descrição</label>
                    <input 
                      id="input-descricao"
                      className="input-field"
                      type="text" 
                      value={titulo} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)} 
                      required 
                    />
                </div>
                
                <div className="modal-row">
                    <div className="form-group">
                        <label htmlFor="input-valor">Valor (R$)</label>
                        <input 
                          id="input-valor"
                          className="input-field"
                          type="number" 
                          value={valor} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setValor(e.target.value)} 
                          required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="select-tipo">Tipo</label>
                        <select 
                          id="select-tipo"
                          className="input-field"
                          value={tipo} 
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setTipo(e.target.value as 'receita' | 'gasto')}
                        >
                            <option value="gasto">Despesa</option>
                            <option value="receita">Receita</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="input-categoria">Categoria</label>
                    <input 
                      id="input-categoria"
                      className="input-field"
                      type="text" 
                      value={categoria} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCategoria(e.target.value)} 
                      required 
                    />
                </div>
                
                <button type="submit" className="btn-save-modal">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}