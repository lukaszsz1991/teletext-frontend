import Scanlines from "../components/layout/Scanlines.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

function PageListPage() {
    return (
        <>
        <Scanlines />
        <div className="container">
            <Header />

            <div className="info-section">
                <h3>📺 Lista Stron Telegazety</h3>
                <p>Tutaj będzie lista wszystkich stron...</p>
            </div>

            <Footer />
        </div>
        </>
    )
}

export default PageListPage;