// src/pages/Profile.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import Sidebar from '../components/SideBar';
import { 
  apiGetProfile, apiUpdateProfile, 
  apiGetGoal, apiUpdateGoal, 
  type UserProfile, type FinancialGoal 
} from '../services/api/ApiService';
import { User, Target, Save, AlertTriangle } from 'lucide-react';

// IMPORTANDO O CSS ESPECÍFICO DESTA PÁGINA
import '../styles/Profile.css';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  
  // Estados
  const [perfil, setPerfil] = useState<UserProfile>({ 
    nome: '', email: '', telefone: '', 
    salario: 0, custos_basicos: 0, limite_alerta: 0 
  });
  
  const [meta, setMeta] = useState<FinancialGoal>({ 
    titulo: '', valor_objetivo: 0, valor_atual: 0, data_limite: '' 
  });

  // Métricas
  const [progresso, setProgresso] = useState(0);
  const [falta, setFalta] = useState(0);
  const [mensalidade, setMensalidade] = useState(0);

  useEffect(() => {
    carregarTudo();
  }, []);

  useEffect(() => {
    calcularMetricas();
  }, [meta]);

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
      const mesesReais = diferencaMeses <= 0 ? 1 : diferencaMeses;
      setMensalidade(valorFalta / mesesReais);
    } else {
      setMensalidade(0);
    }
  };

  const handleSalvarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    await apiUpdateProfile(perfil);
    alert('Perfil atualizado com sucesso!');
  };

  const handleSalvarMeta = async (e: FormEvent) => {
    e.preventDefault();
    await apiUpdateGoal(meta);
    alert('Meta atualizada com sucesso!');
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="content-header">
            <div>
              <h2>Meu Perfil</h2>
              <div className="date-display">
                  <User size={16}/>
                  <span>Configure seus dados e objetivos</span>
              </div>
            </div>
        </header>

        <div className="profile-grid">
            
            {/* --- CARD 1: DADOS --- */}
            <div className="card">
                <div className="card-header">
                    <h3>Dados Pessoais & Finanças</h3>
                    <div className="icon-bg green-light">
                        <User size={20} className="text-green"/>
                    </div>
                </div>

                <form onSubmit={handleSalvarPerfil}>
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input className="form-input" type="text" value={perfil.nome} onChange={e => setPerfil({...perfil, nome: e.target.value})} />
                    </div>
                    <div className="form-row">
                         <div className="form-group" style={{flex:1}}>
                            <label>Email</label>
                            <input className="form-input" type="email" value={perfil.email} onChange={e => setPerfil({...perfil, email: e.target.value})} />
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>Telefone</label>
                            <input className="form-input" type="text" value={perfil.telefone} onChange={e => setPerfil({...perfil, telefone: e.target.value})} />
                        </div>
                    </div>

                    <div style={{borderTop:'1px solid #F3F4F6', margin:'1.5rem 0'}}></div>

                    <div className="form-row">
                        <div className="form-group" style={{flex:1}}>
                            <label>Salário (R$)</label>
                            <input className="form-input" type="number" value={perfil.salario} onChange={e => setPerfil({...perfil, salario: Number(e.target.value)})} />
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>Custos Fixos (R$)</label>
                            <input className="form-input" type="number" value={perfil.custos_basicos} onChange={e => setPerfil({...perfil, custos_basicos: Number(e.target.value)})} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{display:'flex', alignItems:'center', gap:'5px', color:'#EF4444'}}>
                            <AlertTriangle size={14}/> Alerta de Gastos (Teto Mensal)
                        </label>
                        <input className="form-input" type="number" value={perfil.limite_alerta} onChange={e => setPerfil({...perfil, limite_alerta: Number(e.target.value)})} />
                    </div>

                    <button type="submit" className="btn-primary" style={{width:'100%', justifyContent:'center'}}>
                        <Save size={18}/> Salvar Dados
                    </button>
                </form>
            </div>

            {/* --- CARD 2: METAS --- */}
            <div className="card">
                <div className="card-header">
                    <h3>Objetivo Financeiro</h3>
                    <div className="icon-bg green-light">
                        <Target size={20} className="text-green"/>
                    </div>
                </div>

                <div className="progress-card">
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', fontWeight:'600'}}>
                        <span style={{color:'var(--text-gray)'}}>Progresso</span>
                        <span style={{color:'var(--primary-green)'}}>{progresso.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{width:`${progresso}%`}}></div>
                    </div>
                    
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'0.5rem'}}>
                         <div>
                            <span style={{display:'block', fontSize:'0.75rem', color:'#6B7280'}}>Falta Juntar</span>
                            <span style={{fontWeight:'bold', color:'#EF4444'}}>R$ {falta.toFixed(2)}</span>
                         </div>
                         <div style={{textAlign:'right'}}>
                            <span style={{display:'block', fontSize:'0.75rem', color:'#6B7280'}}>Economia Sugerida</span>
                            <span style={{fontWeight:'bold', color:'#3B82F6'}}>R$ {mensalidade.toFixed(2)}/mês</span>
                         </div>
                    </div>
                </div>

                <form onSubmit={handleSalvarMeta}>
                    <div className="form-group">
                        <label>Nome do Objetivo</label>
                        <input className="form-input" type="text" value={meta.titulo} onChange={e => setMeta({...meta, titulo: e.target.value})} placeholder="Ex: Viagem..."/>
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{flex:1}}>
                            <label>Valor Meta</label>
                            <input className="form-input" type="number" value={meta.valor_objetivo} onChange={e => setMeta({...meta, valor_objetivo: Number(e.target.value)})} />
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>Já Tenho</label>
                            <input className="form-input" type="number" value={meta.valor_atual} onChange={e => setMeta({...meta, valor_atual: Number(e.target.value)})} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Data Limite</label>
                        <input className="form-input" type="date" value={meta.data_limite} onChange={e => setMeta({...meta, data_limite: e.target.value})} />
                    </div>

                    <button type="submit" className="btn-primary" style={{width:'100%', justifyContent:'center'}}>
                        <Target size={18}/> Atualizar Meta
                    </button>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}