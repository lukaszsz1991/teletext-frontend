import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api.jsx';

/**
 * Komponent zabezpieczający trasy wymagające autoryzacji
 * Jeśli użytkownik nie jest zalogowany, przekierowuje do /admin/login
 */
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        // Użytkownik nie jest zalogowany, przekierowanie strony do logowania
        return <Navigate to="/admin/login" replace />;
    }

    // Użytkownik jest zalogowany, pokaż komponent
    return children;
}

export default ProtectedRoute;