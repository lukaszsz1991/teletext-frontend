import HomePage from "./pages/HomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageListPage from "./pages/PageListPage.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPages from "./pages/admin/AdminPages.jsx";
import AdminPageNew from "./pages/admin/AdminPageNew.jsx";
import AdminIntegrations from "./pages/admin/AdminIntegrations.jsx";
import AdminStats from "./pages/admin/AdminStats.jsx";
import TemplateDetailPage from "./pages/admin/TemplateDetailPage.jsx";
import TemplateEditPage from "./pages/admin/TemplateEditPage.jsx";
import PageViewPage from "./pages/PageViewPage.jsx";
import WeatherPage from "./pages/integrations/WeatherPage.jsx";
import CurrencyPage from "./pages/integrations/CurrencyPage.jsx";
import NewsPage from "./pages/integrations/NewsPage.jsx";
import JobsPage from "./pages/integrations/JobsPage.jsx";
import LotteryPage from "./pages/integrations/Lotterypage.jsx";
import SportsPage from "./pages/integrations/SportsPage.jsx";
import MatchesPage from "./pages/integrations/Matchespage.jsx";
import CategoryBrowserPage from './pages/CategoryBrowserPage';
import DynamicPageView from './pages/DynamicPageView';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pages" element={<CategoryBrowserPage />} />
                <Route path="/pages/:pageNumber" element={<DynamicPageView />} />

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
                    path="/admin/templates/:id"
                    element={
                        <ProtectedRoute>
                            <TemplateDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/templates/edit/:id"
                    element={
                        <ProtectedRoute>
                            <TemplateEditPage />
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