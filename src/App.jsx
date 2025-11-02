import HomePage from "./pages/HomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageListPage from "./pages/PageListPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages" element={<PageListPage />} />
            </Routes>
        </Router>
    )
}

export default App;