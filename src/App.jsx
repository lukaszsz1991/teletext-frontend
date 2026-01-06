import HomePage from "./pages/HomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageListPage from "./pages/PageListPage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminPages from "./pages/AdminPages.jsx";
import AdminPageNew from "./pages/AdminPageNew.jsx";
import AdminIntegrations from "./pages/AdminIntegrations.jsx";
import AdminStats from "./pages/AdminStats.jsx";
import PageViewPage from "./pages/PageViewPage.jsx";
import WeatherPage from "./pages/integrations/WeatherPage.jsx";
import CurrencyPage from "./pages/integrations/CurrencyPage.jsx";
import NewsPage from "./pages/integrations/NewsPage.jsx";
import JobsPage from "./pages/integrations/JobsPage.jsx";
import LotteryPage from "./pages/integrations/Lotterypage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages" element={<PageListPage />} />
                <Route path="/pages/:pageNumber" element={<PageViewPage />} />
                <Route path="/pages/102" element={<NewsPage />} />
                <Route path="/pages/302" element={<LotteryPage />} />
                <Route path="/pages/502" element={<WeatherPage />} />
                <Route path="/pages/600" element={<JobsPage />} />
                <Route path="/pages/801" element={<CurrencyPage />} />

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/pages"
                    element={
                        <ProtectedRoute>
                            <AdminPages />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/pages/new"
                    element={
                        <ProtectedRoute>
                            <AdminPageNew />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/pages/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminPageNew />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/integrations"
                    element={
                        <ProtectedRoute>
                            <AdminIntegrations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/stats"
                    element={
                        <ProtectedRoute>
                            <AdminStats />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    )
}

export default App;