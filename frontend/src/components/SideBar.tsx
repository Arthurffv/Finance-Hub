import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  User, 
  MessageCircle, 
  LogOut, 
  FileText 
} from 'lucide-react';
import '../styles/Dashboard.css';

export default function Sidebar() {
  const location = useLocation();
  const getActiveClass = (path: string) => location.pathname === path ? 'active' : '';

  return (
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
            <Link to="/dashboard" className="nav-link">
              <li className={getActiveClass('/dashboard')}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </li>
            </Link>
            
            <Link to="/transactions" className="nav-link">
              <li className={getActiveClass('/transactions')}>
                <ArrowRightLeft size={20} />
                <span>Transações</span>
              </li>
            </Link>

            <Link to="/reports" className="nav-link">
              <li className={getActiveClass('/reports')}>
                <FileText size={20} />
                <span>Relatórios</span>
              </li>
            </Link>
            
            <Link to="/profile" className="nav-link">
              <li className={getActiveClass('/profile')}>
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
          <div className="avatar">U</div>
          <div className="user-info">
            <p className="user-name">Usuário</p>
            <p className="user-email">Ver perfil</p>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}