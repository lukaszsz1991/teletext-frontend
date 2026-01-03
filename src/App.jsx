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
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/pages" element={<PageListPage />} />
                <Route path="/pages/:pageNumber" element={<PageViewPage />} />
                <Route path="/pages/300" element={<WeatherPage />} />
                <Route path="/pages/400" element={<CurrencyPage />} />

                {/* Admin login (public) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected admin routes */}
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