import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/teletext.css';

function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Usuń token i email z localStorage
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_email');

        // Przekieruj do logowania
        navigate('/admin/login');
    };

    // Pobierz email zalogowanego użytkownika
    const userEmail = localStorage.getItem('user_email') || 'Administrator';

    return (
        <div className="admin-sidebar">
            {/* Header sidebara */}
            <div className="sidebar-header">
                <h2>PANEL ADMINA</h2>
                <p className="sidebar-user">{userEmail}</p>
            </div>

            {/* Menu */}
            <nav className="sidebar-nav">
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                >
                    <span className="sidebar-icon">🏠</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/pages"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                >
                    <span className="sidebar-icon">📄</span>
                    <span>Strony telegazety</span>
                </NavLink>

                <NavLink
                    to="/admin/pages/new"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                >
                    <span className="sidebar-icon">➕</span>
                    <span>Dodaj stronę</span>
                </NavLink>

                <NavLink
                    to="/admin/integrations"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                >
                    <span className="sidebar-icon">🔗</span>
                    <span>Integracje</span>
                </NavLink>

                <NavLink
                    to="/admin/stats"
                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                >
                    <span className="sidebar-icon">📊</span>
                    <span>Statystyki</span>
                </NavLink>
            </nav>

            {/* Przycisk wylogowania */}
            <div className="sidebar-footer">
                <button
                    onClick={handleLogout}
                    className="sidebar-logout-btn"
                >
                    <span className="sidebar-icon">⏻</span>
                    <span>Wyloguj</span>
                </button>
            </div>
        </div>
    );
}

export default AdminSidebar;