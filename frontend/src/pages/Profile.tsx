import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { MdSave, MdPerson, MdFlag, MdCalculate, MdWarning, MdAttachMoney } from 'react-icons/md';
import { 
  apiGetProfile, apiUpdateProfile, 
  apiGetGoal, apiUpdateGoal, 
  type UserProfile, type FinancialGoal 
} from '../services/api/ApiService';
import Sidebar from '../components/Sidebar';
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
    const sal = perfil.salario || 0;
    const custos = perfil.custos_basicos || 0;
    setDinheiroLivre(sal - custos);
  }, [meta, perfil]);

  const carregarTudo = async () => {
    try {
      const [dadosPerfil, dadosMeta] = await Promise.all([apiGetProfile(), apiGetGoal()]);
      
      setPerfil({
        ...dadosPerfil,
        nome: dadosPerfil.nome || '',
        salario: dadosPerfil.salario || 0,
        custos_basicos: dadosPerfil.custos_basicos || 0,
        limite_alerta: dadosPerfil.limite_alerta || 0
      });

      setMeta({
        ...dadosMeta,
        titulo: dadosMeta.titulo || '',
        valor_objetivo: dadosMeta.valor_objetivo || 0,
        valor_atual: dadosMeta.valor_atual || 0,
        data_limite: dadosMeta.data_limite || ''
      });

    } catch (error) {
      console.error("Erro ao carregar", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularMetricas = () => {
    const vObjetivo = meta.valor_objetivo || 0;
    const vAtual = meta.valor_atual || 0;

    const valorFalta = Math.max(0, vObjetivo - vAtual);
    setFalta(valorFalta);

    const porc = vObjetivo > 0 ? (vAtual / vObjetivo) * 100 : 0;
    setProgresso(Math.min(100, porc));

    if (meta.data_limite && valorFalta > 0) {
      const hoje = new Date();
      const limite = new Date(meta.data_limite);
      
      if (!isNaN(limite.getTime())) {
        const diferencaAnos = limite.getFullYear() - hoje.getFullYear();
        const diferencaMeses = (diferencaAnos * 12) + (limite.getMonth() - hoje.getMonth());
        
        if (diferencaMeses > 0) {
          setMensalidade(valorFalta / diferencaMeses);
        } else {
          setMensalidade(valorFalta);
        }
      }
    } else {
      setMensalidade(0);
    }
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
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
      <Sidebar />
      {/* 1. REMOVI 'profile-layout' DAQUI. Agora é só 'main-content' */}
      <main className="main-content">
        <header className="content-header">
           <h2>Planejamento Pessoal</h2>
        </header>
        
        {/* 2. NOVA DIV PARA O GRID. Ela envolve apenas os cards. */}
        <div className="profile-grid">
            
            {/* COLUNA 1: DADOS E FINANÇAS PESSOAIS */}
            <section className="profile-card">
              <div className="card-header-profile">
                <MdPerson size={24} />
                <h3>Perfil & Finanças</h3>
              </div>
              
              <form onSubmit={handleSalvarPerfil}>
                <div className="form-group">
                  <label htmlFor="input-nome">Nome</label>
                  <input 
                    id="input-nome"
                    type="text" 
                    value={perfil.nome || ''} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPerfil({...perfil, nome: e.target.value})} 
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="input-salario">Salário Mensal (R$)</label>
                    <input 
                      id="input-salario"
                      type="number" 
                      value={perfil.salario || 0} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPerfil({...perfil, salario: Number(e.target.value)})} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-custos">Custos Fixos (R$)</label>
                    <input 
                      id="input-custos"
                      type="number" 
                      value={perfil.custos_basicos || 0} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPerfil({...perfil, custos_basicos: Number(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="summary-box">
                  <div className="summary-header">
                    <MdCalculate size={20} /> 
                    <span>Resumo Mensal:</span>
                  </div>
                  <p style={{margin:0, fontSize:'0.95rem', color:'#4B5563'}}>
                    Sobram <strong>R$ {dinheiroLivre.toFixed(2)}</strong> livres após pagar contas básicas.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="input-alerta" style={{color: '#ff4d4d', display:'flex', alignItems:'center', gap:'5px'}}>
                    <MdWarning/> Definir Alerta de Gastos (Teto)
                  </label>
                  <input 
                    id="input-alerta"
                    type="number" 
                    value={perfil.limite_alerta || 0} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPerfil({...perfil, limite_alerta: Number(e.target.value)})} 
                    style={{borderColor: '#ffcccb'}}
                    placeholder="Avise-me se eu gastar mais que..."
                  />
                </div>

                <button type="submit" className="btn-save-profile">
                  <MdSave /> Salvar Dados
                </button>
              </form>
            </section>

            {/* COLUNA 2: OBJETIVOS */}
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
                  <label htmlFor="input-objetivo">Objetivo</label>
                  <input 
                    id="input-objetivo"
                    type="text" 
                    value={meta.titulo || ''} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMeta({...meta, titulo: e.target.value})} 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="input-valor-meta">Valor Meta</label>
                    <input 
                      id="input-valor-meta"
                      type="number" 
                      value={meta.valor_objetivo || 0} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMeta({...meta, valor_objetivo: Number(e.target.value)})} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-valor-atual">Já Tenho</label>
                    <input 
                      id="input-valor-atual"
                      type="number" 
                      value={meta.valor_atual || 0} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMeta({...meta, valor_atual: Number(e.target.value)})} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input-data-limite">Data Limite</label>
                  <input 
                    id="input-data-limite"
                    type="date" 
                    value={formatDateForInput(meta.data_limite)} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMeta({...meta, data_limite: e.target.value})} 
                  />
                </div>
                <button type="submit" className="btn-save-goal">
                  <MdAttachMoney /> Atualizar Meta
                </button>
              </form>
            </section>
        </div>
      </main>
    </div>
  );
}