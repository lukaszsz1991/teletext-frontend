import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PagesList from '../components/PagesList';
import '../styles/teletext.css';

function AdminPages() {
    const navigate = useNavigate();

    return (
        <AdminLayout>
            <div className="header">
                <h1>STRONY TELEGAZETY</h1>
                <p>Zarządzanie stronami</p>
            </div>

            <div className="button-group" style={{ marginBottom: '30px' }}>
                <button
                    className="btn"
                    onClick={() => navigate('/admin/pages/new')}
                >
                    ➕ Dodaj nową stronę
                </button>
                <button
                    className="btn"
                    onClick={() => window.location.reload()}
                >
                    🔄 Odśwież listę
                </button>
            </div>

            <PagesList />
        </AdminLayout>
    );
}

export default AdminPages;