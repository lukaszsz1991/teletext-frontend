import { Link } from "react-router-dom";
import Scanlines from "../components/layout/Scanlines.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

function HomePage() {
    return (
        <>
        <Scanlines />
            <div className="container">
                <Header />

                <div className="main-grid">
                    <div className="card">
                        <h2>👤 Portal Czytelnika</h2>
                        <div className="ascii-art">
                            ███████████
                            █ CZYTAJ █
                            ███████████
                        </div>
                        <p>Przeglądaj numery telegazety, odkrywaj nowe artykuły i bądź na bieżąco z najnowszymi wiadomościami.</p>
                        <div className="button-group">
                            <Link to="/pages" className="btn">PRZEGLĄDAJ</Link>
                        </div>
                    </div>


                <div className="card">
                    <h2>⚙️ Panel Administratora</h2>
                    <div className="ascii-art">
                        ██████████████████████████████
                        █ ZARZĄDZANIE ADMINISTRATORA █
                        ██████████████████████████████
                    </div>
                    <p>Zarządzaj treścią, twórz nowe strony, konfiguruj integracje i monitoruj statystyki.</p>
                    <div className="button-group">
                        <Link to="/admin/login" className="btn">ZALOGUJ</Link>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h3>📋 Co oferujemy:</h3>
                <ul className="feature-list">
                    <li>Przegląd struktury numerów telegazety</li>
                    <li>Edytor stron z wsparciem ASCII art</li>
                    <li>7+ integracji (pogoda, lotto, tabela ekstraklasy, kursy walut, wiadomości)</li>
                    <li>Statystyki odwiedzin i popularności</li>
                    <li>Responsywny design w stylu retro</li>
                </ul>
            </div>

            <div className="info-section">
                <h3>🔧 Technologia:</h3>
                <ul className="feature-list">
                    <li>
                        : React</li>
                    <li>Komunikacja: REST API</li>
                    <li>Dokumentacja: OpenAPI</li>
                    <li>Design: Telegazeta (retro aesthetic)</li>
                </ul>
            </div>

            <Footer />
            </div>
        </>
    )
}

export default HomePage;