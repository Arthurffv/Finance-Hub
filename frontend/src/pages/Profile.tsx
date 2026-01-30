// frontend/src/pages/Profile.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdSave, MdPerson, MdFlag, MdTimeline, MdAttachMoney, MdWarning, MdCalculate } from 'react-icons/md';
import { 
  apiGetProfile, apiUpdateProfile, 
  apiGetGoal, apiUpdateGoal, 
  type UserProfile, type FinancialGoal 
} from '../services/api/ApiService';
import '../styles/Dashboard.css';
import '../styles/Profile.css';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  
  const [perfil, setPerfil] = useState<UserProfile>({ 
    nome: '', email: '', telefone: '', 
    salario: 0, custos_basicos: 0, limite_alerta: 0 
  });
  
  const [meta, setMeta] = useState<FinancialGoal>({ 
    titulo: '', valor_objetivo: 0, valor_atual: 0, data_limite: '' 
  });

  const [progresso, setProgresso] = useState(0);
  const [falta, setFalta] = useState(0);
  const [mensalidade, setMensalidade] = useState(0);
  const [dinheiroLivre, setDinheiroLivre] = useState(0);

  useEffect(() => {
    carregarTudo();
  }, []);

  useEffect(() => {
    calcularMetricas();
    // Calcula dinheiro livre (Salário - Custos)
    setDinheiroLivre(perfil.salario - perfil.custos_basicos);
  }, [meta, perfil]);

  const carregarTudo = async () => {
    try {
      const [dadosPerfil, dadosMeta] = await Promise.all([apiGetProfile(), apiGetGoal()]);
      setPerfil(dadosPerfil);
      setMeta(dadosMeta);
    } catch (error) {
      console.error("Erro ao carregar", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularMetricas = () => {
    const valorFalta = Math.max(0, meta.valor_objetivo - meta.valor_atual);
    setFalta(valorFalta);

    const porc = meta.valor_objetivo > 0 
      ? (meta.valor_atual / meta.valor_objetivo) * 100 
      : 0;
    setProgresso(Math.min(100, porc));

    if (meta.data_limite && valorFalta > 0) {
      const hoje = new Date();
      const limite = new Date(meta.data_limite);
      const diferencaAnos = limite.getFullYear() - hoje.getFullYear();
      const diferencaMeses = (diferencaAnos * 12) + (limite.getMonth() - hoje.getMonth());
      
      if (diferencaMeses > 0) {
        setMensalidade(valorFalta / diferencaMeses);
      } else {
        setMensalidade(valorFalta);
      }
    } else {
      setMensalidade(0);
    }
  };

  const handleSalvarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    await apiUpdateProfile(perfil);
    alert('Dados financeiros atualizados!');
  };

  const handleSalvarMeta = async (e: FormEvent) => {
    e.preventDefault();
    await apiUpdateGoal(meta);
    alert('Meta definida!');
  };

  if (loading) return <div className="loading-screen">Carregando...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
          <Link to="/dashboard" style={{color: 'white'}}><MdArrowBack size={28}/></Link>
          <h2>Planejamento Pessoal</h2>
        </div>
      </header>

      <main className="dashboard-content profile-layout">
        
        {/* COLUNA 1: DADOS E FINANÇAS PESSOAIS */}
        <section className="profile-card">
          <div className="card-header-profile">
            <MdPerson size={24} />
            <h3>Perfil & Finanças</h3>
          </div>
          
          <form onSubmit={handleSalvarPerfil}>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={perfil.nome} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Salário Mensal (R$)</label>
                    <input type="number" value={perfil.salario} onChange={e => setPerfil({...perfil, salario: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                    <label>Custos Fixos (R$)</label>
                    <input type="number" value={perfil.custos_basicos} onChange={e => setPerfil({...perfil, custos_basicos: Number(e.target.value)})} />
                </div>
            </div>

            {/* CARD DE ANÁLISE RÁPIDA */}
            <div style={{background: '#f0f8ff', padding: '1rem', borderRadius: '8px', margin: '1rem 0', border: '1px solid #cce4ff'}}>
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px', color:'#0056b3'}}>
                    <MdCalculate /> <strong>Resumo Mensal:</strong>
                </div>
                <p style={{margin:0, fontSize:'0.9rem', color:'#555'}}>
                    Sobram <strong>R$ {dinheiroLivre.toFixed(2)}</strong> livres após pagar contas básicas.
                </p>
            </div>

            <div className="form-group">
                <label style={{color: '#ff4d4d', display:'flex', alignItems:'center', gap:'5px'}}>
                    <MdWarning/> Definir Alerta de Gastos (Teto)
                </label>
                <input 
                    type="number" 
                    value={perfil.limite_alerta} 
                    onChange={e => setPerfil({...perfil, limite_alerta: Number(e.target.value)})} 
                    style={{borderColor: '#ffcccb'}}
                    placeholder="Avise-me se eu gastar mais que..."
                />
            </div>

            <button type="submit" className="btn-save-profile">
              <MdSave /> Salvar Dados
            </button>
          </form>
        </section>

        {/* COLUNA 2: OBJETIVOS (MANTIDO) */}
        <section className="profile-card goal-card">
          <div className="card-header-profile">
            <MdFlag size={24} />
            <h3>Minha Meta</h3>
          </div>
          
          <div className="goal-summary">
            <div className="progress-container">
              <div className="progress-bar" style={{width: `${progresso}%`}}></div>
            </div>
            <p className="progress-text">{progresso.toFixed(1)}% Concluído</p>
            
            <div className="goal-stats">
              <div className="stat-item red">
                <span>Falta:</span>
                <strong>R$ {falta.toFixed(2)}</strong>
              </div>
              <div className="stat-item blue">
                <span>Guardar:</span>
                <strong>R$ {mensalidade.toFixed(2)} / mês</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleSalvarMeta}>
            <div className="form-group">
              <label>Objetivo</label>
              <input type="text" value={meta.titulo} onChange={e => setMeta({...meta, titulo: e.target.value})} />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Valor Meta</label>
                    <input type="number" value={meta.valor_objetivo} onChange={e => setMeta({...meta, valor_objetivo: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                    <label>Já Tenho</label>
                    <input type="number" value={meta.valor_atual} onChange={e => setMeta({...meta, valor_atual: Number(e.target.value)})} />
                </div>
            </div>
            <div className="form-group">
              <label>Data Limite</label>
              <input type="date" value={meta.data_limite} onChange={e => setMeta({...meta, data_limite: e.target.value})} />
            </div>
            <button type="submit" className="btn-save-goal">
              <MdAttachMoney /> Atualizar Meta
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}