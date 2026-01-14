import NewsPage from '../pages/integrations/NewsPage';
import SportsPage from '../pages/integrations/SportsPage';
import MatchesPage from '../pages/integrations/Matchespage';
import LotteryPage from '../pages/integrations/Lotterypage';
import WeatherPage from '../pages/integrations/WeatherPage';
import CurrencyPage from '../pages/integrations/CurrencyPage';

export const INTEGRATIONS_CONFIG = {
    201: {
        category: 'SPORTS',
        component: SportsPage,
        name: 'Tabela Ekstraklasy',
        icon: '⚽',
        description: 'Aktualna tabela ligowa',
        status: 'active'
    },
    202: {
        category: 'SPORTS',
        component: MatchesPage,
        name: 'Mecze Ekstraklasy',
        icon: '📅',
        description: 'Wyniki i terminarz meczów',
        status: 'active'
    },
    203: {
        category: 'SPORTS',
        component: MatchesPage,
        name: 'Wyniki Ekstraklasy',
        icon: '🏆',
        description: 'Wyniki meczów (tydzień 48)',
        status: 'active'
    },
    102: {
        category: 'NEWS',
        component: NewsPage,
        name: 'Najnowsze Wiadomości',
        icon: '📰',
        description: 'Aktualności z Polski',
        status: 'soon'
    },
    302: {
        category: 'LOTTERY',
        component: LotteryPage,
        name: 'Wyniki Lotto',
        icon: '🎰',
        description: 'Ostatnie losowanie',
        status: 'soon'
    },
    501: {
        category: 'WEATHER',
        component: WeatherPage,
        name: 'Pogoda Wrocław',
        icon: '🌤️',
        description: 'Prognoza 7-dniowa',
        status: 'active'
    },
    801: {
        category: 'FINANCE',
        component: CurrencyPage,
        name: 'Kursy Walut USD',
        icon: '💵',
        description: 'Aktualne kursy NBP',
        status: 'active'
    },
    802: {
        category: 'FINANCE',
        component: CurrencyPage,
        name: 'Kursy Walut EUR',
        icon: '💶',
        description: 'Aktualne kursy NBP',
        status: 'active'
    }
};

export const getCategoryIntegrations = (categoryName) => {
    return Object.entries(INTEGRATIONS_CONFIG)
        .filter(([_, integration]) => integration.category === categoryName)
        .map(([pageNumber, integration]) => ({
            pageNumber: parseInt(pageNumber),
            ...integration
        }));
};

export const getIntegration = (pageNumber) => {
    return INTEGRATIONS_CONFIG[pageNumber] || null;
};

export const getAllActiveIntegrations = () => {
    return Object.entries(INTEGRATIONS_CONFIG)
        .filter(([_, integration]) => integration.status === 'active')
        .map(([pageNumber, integration]) => ({
            pageNumber: parseInt(pageNumber),
            ...integration
        }));
};