import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  FileText, 
  User, 
  LogOut, 
  MessageCircle 
} from 'lucide-react';
import '../styles/Dashboard.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tenta recuperar o usuário salvo no login (se existir)
  const user = JSON.parse(localStorage.getItem('user') || '{"username": "Usuário"}');

  // Função para checar se o link está ativo (para ficar verde)
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    // 1. Limpa os dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Redireciona para o Login
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Cabeçalho da Sidebar (Logo) */}
      <div className="sidebar-header">
        <div className="logo-icon">F</div>
        <div>
          <div className="logo-text">FinanceHub</div>
          <span className="logo-subtext">Controle Inteligente</span>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-title">MENU PRINCIPAL</div>
          <ul>
            <Link to="/dashboard" className="nav-link">
              <li className={isActive('/dashboard')}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </li>
            </Link>

            <Link to="/transactions" className="nav-link">
              <li className={isActive('/transactions')}>
                <ArrowRightLeft size={20} />
                <span>Transações</span>
              </li>
            </Link>

            <Link to="#" className="nav-link">
              <li className={isActive('/relatorios')}>
                <FileText size={20} />
                <span>Relatórios</span>
              </li>
            </Link>

            <Link to="/profile" className="nav-link">
              <li className={isActive('/profile')}>
                <User size={20} />
                <span>Perfil</span>
              </li>
            </Link>
          </ul>
        </div>

        {/* Seção WhatsApp (Visual) */}
        <div className="nav-section">
          <div className="nav-title">WHATSAPP</div>
          <button className="whatsapp-btn">
            <MessageCircle size={20} />
            Conectar WhatsApp
          </button>
        </div>
      </nav>

      {/* Rodapé (Perfil + Logout) */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <p className="user-name">{user.username || 'Usuário'}</p>
            <Link to="/profile" style={{ fontSize: '0.75rem', color: '#6B7280' }}>
              Ver perfil
            </Link>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;