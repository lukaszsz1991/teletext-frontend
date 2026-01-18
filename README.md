# Teletext - System Zarządzania Telegazetą

Aplikacja **Teletext** to nowoczesny system zarządzania treścią w stylu retro telegazety z lat 80/90. Projekt składa się z frontendu (React) i backendu (Spring Boot).

---

## 🎯 Funkcjonalności

### Portal Czytelnika
- 📺 **Lista stron telegazety** - przeglądanie wszystkich dostępnych stron
- 📄 **Podgląd stron** - wyświetlanie treści stron
- 🔴 **Integracje na żywo** - dane z zewnętrznych API w czasie rzeczywistym

### Panel Administratora
- 🔐 **Logowanie** (JWT authentication)
- 📊 **Dashboard** - panel główny z informacjami
- 📝 **Zarządzanie stronami** - CRUD dla stron telegazety
- 🔌 **Konfiguracja integracji** - ustawienia zewnętrznych API
- 📈 **Statystyki** - odwiedziny stron

---

## 🌐 Integracje API

Aplikacja integruje się z zewnętrznymi API poprzez warstwę backendową. Frontend komunikuje się wyłącznie z endpointami backendu (Spring Boot), który z kolei pobiera dane z zewnętrznych serwisów.

### ✅ Zaimplementowane integracje:

| Integracja | Status       | Strona | Źródło danych | Opis |
|------------|--------------|--------|---------------|------|
| 🌤️ **Pogoda** | ✅ Działająca | 501 | OpenMeteo API | Prognoza 7-dniowa dla Wrocławia |
| 📰 **Wiadomości** | ✅ Działająca | 101, 102 | NewsData API | Najnowsze artykuły informacyjne |
| 💱 **Kursy walut** | ✅ Działająca | 801, 802 | NBP API | Aktualne kursy wymiany walut (USD, EUR) |
| 🎰 **Lotto** | ✅ Działająca | 302 | Totalizator Sportowy API | Wyniki ostatniego losowania |
| ⚽ **Tabela Ekstraklasy** | ✅ Działająca | 201 | Highlightly API | Tabela ligowa Ekstraklasy |
| 🏆 **Mecze Ekstraklasy** | ✅ Działająca | 202, 203 | Highlightly API | Wyniki i terminarz meczów |
| 💼 **Oferty pracy** | ⚠️ W budowie | 601 | Jooble API | Wyszukiwarka ofert pracy IT |
| 🔮 **Horoskop** | ⚠️ W budowie | 701 | Horoskop API | Horoskop dzienny dla znaków zodiaku |
| 📺 **Program TV** | 🚧 Planowane | 401 | TVP API | Ramówka telewizyjna |
| 📄 **Strony manualne** | ✅ Działająca | 900-999 | Baza danych | Strony tworzone przez administratora |

### Architektura komunikacji:
```
Frontend (React) → Backend API (Spring Boot) → External APIs
```

Korzyści z pośrednictwa backendu:
- Bezpieczne przechowywanie kluczy API
- Możliwość cache'owania odpowiedzi
- Ujednolicone obsługiwanie błędów
- Transformacja danych do spójnego formatu

---

## 🎨 Design

Aplikacja stylizowana na klasyczną telegazetę:
- ⬛ Czarne tło z zielonym tekstem (#00ff00)
- 🔤 Font monospace (Courier New)
- 📺 Efekty CRT (scanlines, flicker, glow)
- 🎭 ASCII art w nagłówkach
- 📱 Responsywny design

---

## 🛠️ Technologie

### Frontend
- **React** 19 + **Vite** - nowoczesny stack
- **React Router** 6 - routing SPA
- **Vanilla CSS** - stylizacja bez frameworków
- **Fetch API** - komunikacja z backendem

### Backend
- **Spring Boot** 3.4.1 (Java 21)
- **PostgreSQL** 17.2 - baza danych
- **Redis** 8.4.0 - cache
- **JWT** - autentykacja
- **WebClient** - komunikacja z zewnętrznymi API
- **Flyway** - migracje bazy danych
- **Docker** - konteneryzacja

---

## 🚀 Szybki start (Docker)

### Wymagania:
- Docker 24.0+
- Docker Compose 2.22+
- Make (opcjonalnie)

### Uruchomienie całego projektu:
```bash
# Sklonuj repozytorium
git clone https://github.com/lukaszsz1991/teletext-dev.git
cd teletext-dev

# Uruchom wszystkie serwisy
make build-up

# Lub bez Make:
docker-compose up --build
```

**Aplikacja dostępna pod:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html

### Dostępne komendy Make:

| Komenda | Opis |
|---------|------|
| `make build-up` | Buduje i uruchamia wszystkie kontenery |
| `make down` | Zatrzymuje wszystkie kontenery |
| `make restart-backend` | Restartuje backend |
| `make restart-frontend` | Restartuje frontend |
| `make logs-backend` | Logi backendu |
| `make logs-frontend` | Logi frontendu |

---

## 💻 Rozwój lokalny (bez Dockera)

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

Dostępny na: http://localhost:3000

### Backend:
```bash
cd backend
./mvnw spring-boot:run
```

Dostępny na: http://localhost:8080

**Wymagane:** PostgreSQL i Redis działające lokalnie

---

## 📂 Struktura projektu
```
teletext-dev/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Header, Footer, Scanlines
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── integrations/    # Strony z integracjami API
│   │   │   │   ├── WeatherPage.jsx    (501)
│   │   │   │   ├── NewsPage.jsx       (101, 102)
│   │   │   │   ├── CurrencyPage.jsx   (801, 802)
│   │   │   │   ├── LotteryPage.jsx    (302)
│   │   │   │   ├── SportsPage.jsx     (201)
│   │   │   │   ├── MatchesPage.jsx    (202, 203)
│   │   │   │   └── JobsPage.jsx       (601) - w budowie
│   │   │   ├── ManualPageWrapper.jsx  # Strony manualne (900-999)
│   │   │   ├── DynamicPageView.jsx    # Router stron (MANUAL/TEMPLATE)
│   │   │   ├── CategoryBrowserPage.jsx # Lista stron (dynamiczna)
│   │   │   ├── HomePage.jsx
│   │   │   └── Admin*.jsx       # Panel admina
│   │   ├── services/
│   │   │   └── api.jsx          # API client
│   │   ├── styles/
│   │   │   └── teletext.css
│   │   └── App.jsx
│   └── Dockerfile
├── backend/
│   ├── src/main/java/.../
│   │   ├── api/                 # Kontrolery REST
│   │   ├── config/              # Konfiguracja (Security, CORS)
│   │   ├── integration/         # Serwisy integracji z API
│   │   ├── teletext/            # Logika biznesowa
│   │   │   ├── page/            # Zarządzanie stronami
│   │   │   ├── template/        # Szablony stron
│   │   │   └── schema/          # Walidacja konfiguracji
│   │   └── common/
│   └── Dockerfile
├── docker-files/
│   └── postgres/
│       └── init.sql             # Inicjalizacja bazy
├── compose.yml                  # Docker Compose
├── Makefile                     # Skróty komend
├── .env                         # Konfiguracja backendu
└── .env.webclient               # Klucze API
```

---

## 🌐 Routing

### Strony publiczne:

| URL | Opis |
|-----|------|
| `/` | Strona główna z nawigacją |
| `/pages` | Lista wszystkich stron telegazety (dynamiczna z bazy) |
| `/pages/:pageNumber` | Podgląd konkretnej strony |
| `/pages/501` | Pogoda - prognoza 7-dniowa dla Wrocławia |
| `/pages/101` `/pages/102` | Wiadomości - najnowsze artykuły |
| `/pages/801` `/pages/802` | Kursy walut - USD/EUR z NBP |
| `/pages/302` | Lotto - wyniki ostatniego losowania |
| `/pages/201` | Tabela Ekstraklasy |
| `/pages/202` `/pages/203` | Mecze Ekstraklasy |
| `/pages/9XX` | Strony manualne (900-999) tworzone przez admina |

### Panel administratora:

| URL | Opis |
|-----|------|
| `/admin/login` | Logowanie (publiczne) |
| `/admin/dashboard` | Panel główny ⚠️ |
| `/admin/pages` | Zarządzanie stronami ⚠️ |
| `/admin/stats` | Statystyki ⚠️ |

⚠️ Wymaga zalogowania (JWT token)

---

## 🔐 Autoryzacja

**Testowe dane logowania:**
```
Login: admin
Hasło: admin
```

Token JWT przechowywany w `localStorage` jako `jwt_token`.

---

## 📡 API Endpoints

### Backend (localhost:8080):

**Publiczne:**
- `GET /api/public/pages` - lista wszystkich stron
- `GET /api/public/pages/{pageNumber}` - szczegóły strony z wygenerowaną treścią
- `GET /api/public/categories` - lista kategorii

**Admin (wymagany JWT):**
- `POST /api/admin/auth/login` - logowanie (zwraca JWT token)
- `POST /api/admin/auth/logout` - wylogowanie
- `POST /api/admin/auth/refresh` - odświeżenie tokenu
- `GET /api/admin/pages` - lista stron (zarządzanie)
- `POST /api/admin/pages` - utworzenie nowej strony
- `PUT /api/admin/pages/{id}` - edycja strony
- `DELETE /api/admin/pages/{id}` - usunięcie strony
- `GET /api/admin/templates` - lista szablonów integracji
- `POST /api/admin/templates` - utworzenie szablonu
- `GET /api/admin/schemas` - lista schematów konfiguracji
- `GET /api/admin/schemas/{source}` - schemat dla konkretnego źródła
- `GET /api/admin/stats/pages` - statystyki odwiedzin

**Dokumentacja Swagger:** http://localhost:8080/swagger-ui/index.html

---

## 🔧 Konfiguracja

### Zmienne środowiskowe (`.env`):
```env
# Backend
POSTGRES_USER=teletext_user
POSTGRES_PASSWORD=teletext_pass
POSTGRES_DB=teletext_db

# JWT
JWT_SECRET=twój_sekret_base64

# Redis
REDIS_PASSWORD=redis_pass
```

### Klucze API (`.env.webclient`):
```env
# API URLs
WEBCLIENT_OPEN_METEO_API_BASE_URL=https://api.open-meteo.com/
WEBCLIENT_NBP_API_BASE_URL=https://api.nbp.pl/
WEBCLIENT_NEWS_DATA_API_BASE_URL=https://newsdata.io/
WEBCLIENT_LOTTO_API_BASE_URL=https://developers.lotto.pl/
WEBCLIENT_JOOBLE_API_BASE_URL=https://jooble.org/
WEBCLIENT_HOROSCOPE_API_BASE_URL=https://www.moj-codzienny-horoskop.com/
WEBCLIENT_HIGHLIGHTLY_API_BASE_URL=https://sports.highlightly.net/
WEBCLIENT_TVP_API_BASE_URL=https://www.tvp.pl/

# API Secrets
WEBCLIENT_NEWS_DATA_SECRET=pub_xxxxx
WEBCLIENT_LOTTO_SECRET=xxxxx
WEBCLIENT_JOOBLE_SECRET=xxxxx
WEBCLIENT_HIGHLIGHTLY_SECRET=xxxxx
```

## 👥 Autorzy

- [Sebastian Górski](https://github.com/sgorski00/)
- [Jakub Grzymisławski](https://github.com/jgrzymislawski/)
- [Łukasz Szenkiel](https://github.com/lukaszsz1991/)
- [Rafał Wilczewski](https://github.com/Rafal-wq/)

---

## 📄 Licencja

Projekt wykonywany w ramach kursu *Projektowanie i programowanie systemów internetowych II*  
Collegium Witelona Uczelnia Państwowa w Legnicy

---

## 📞 Kontakt

Projekt GitHub: [teletext-dev](https://github.com/lukaszsz1991/teletext-dev)