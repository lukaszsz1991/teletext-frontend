import NewsPage from '../pages/integrations/NewsPage';
import SportsPage from '../pages/integrations/SportsPage';
import MatchesPage from '../pages/integrations/Matchespage';
import LotteryPage from '../pages/integrations/Lotterypage';
import WeatherPage from '../pages/integrations/WeatherPage';
import CurrencyPage from '../pages/integrations/CurrencyPage';
import JobsPage from '../pages/integrations/JobsPage';

export const TEMPLATE_COMPONENTS = {
    'sport-table': SportsPage,
    'sport-matches': MatchesPage,
    'news': NewsPage,
    'lottery': LotteryPage,
    'weather': WeatherPage,
    'exchange-rate': CurrencyPage,
    'job-offers': JobsPage,
    'horoscope': null,
    'tv-program': null,
    'manual': null,
};

export const getComponentForSource = (source) => {
    return TEMPLATE_COMPONENTS[source] || null;
};