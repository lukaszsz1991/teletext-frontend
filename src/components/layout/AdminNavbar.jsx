import { useState, useEffect } from 'react';
import '../../styles/teletext.css';

function AdminNavbar() {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Aktualizacja czasu co minutę
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60000ms = 1 minuta

        return () => clearInterval(timer);
    }, []);

    // Formatowanie daty i czasu
    const formatDate = () => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return currentTime.toLocaleDateString('pl-PL', options);
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Mock danych (zamień na prawdziwe API później)
    const temperature = "18°C";
    const holiday = "Brak święta"; // lub "Święto Niepodległości"

    return (
        <div className="admin-navbar">
            <div className="navbar-content">
                {/* Data i czas */}
                <div className="navbar-item">
                    <span className="navbar-icon">📅</span>
                    <span className="navbar-text">{formatDate()}</span>
                </div>

                <div className="navbar-item">
                    <span className="navbar-icon">🕐</span>
                    <span className="navbar-text">{formatTime()}</span>
                </div>

            </div>
        </div>
    );
}

export default AdminNavbar;