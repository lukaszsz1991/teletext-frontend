import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import '../../styles/teletext.css';

function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            {/* Efekt scanlines dla całego layoutu */}
            <div className="scanlines"></div>

            {/* Top Navbar */}
            <AdminNavbar />

            {/* Main content area i sidebar */}
            <div className="admin-main">
                {/* Content area */}
                <div className="admin-content">
                    {children}
                </div>

                {/* Sidebar po prawej */}
                <AdminSidebar />
            </div>
        </div>
    );
}

export default AdminLayout;