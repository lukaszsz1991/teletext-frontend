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

### ✅ Działające (frontend):
- **🌤️ Pogoda** (Strona 300) - Open Meteo API - aktualna temperatura i warunki pogodowe
- **💱 Kursy walut** (Strona 400) - NBP API - kursy EUR, USD, GBP, CHF
- **📰 Wiadomości** (Strona 500) - NewsData API - najnowsze wiadomości z Polski
- **💼 Oferty pracy** (Strona 600) - Jooble API - wyszukiwarka ofert IT

### ⏳ Wymagające backendu (CORS block):
- **🎰 Lotto** - wyniki losowania (w planach)
- **🔮 Horoskop** - horoskop dzienny (w planach)
- **⚽ Sport** - wyniki sportowe (w planach)

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
- **Fetch API** - komunikacja z backendem i zewnętrznymi API

### Backend
- **Spring Boot** 3.4.1 (Java 21)
- **PostgreSQL** 17.2 - baza danych
- **Redis** 8.4.0 - cache
- **JWT** - autentykacja
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
│   │   │   │   ├── WeatherPage.jsx
│   │   │   │   ├── CurrencyPage.jsx
│   │   │   │   ├── NewsPage.jsx
│   │   │   │   └── JobsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PageListPage.jsx
│   │   │   ├── PageViewPage.jsx
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
│   │   ├── domain/              # Modele, repozytoria, serwisy
│   │   └── exceptions/
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
| `/pages` | Lista wszystkich stron telegazety |
| `/pages/:pageNumber` | Podgląd konkretnej strony |
| `/pages/300` | Pogoda (live API) |
| `/pages/400` | Kursy walut (live API) |
| `/pages/500` | Wiadomości (live API) |
| `/pages/600` | Oferty pracy (live API) |

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
- `GET /api/public/pages` - lista stron
- `GET /api/public/pages/{pageNumber}` - pojedyncza strona
- `GET /api/public/categories` - lista kategorii

**Admin (wymagany JWT):**
- `POST /api/admin/auth/login` - logowanie
- `GET /api/admin/stats/pages` - statystyki

**Dokumentacja:** http://localhost:8080/swagger-ui/index.html

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
# Integracje
WEBCLIENT_NEWS_DATA_SECRET=pub_xxxxx
WEBCLIENT_LOTTO_SECRET=xxxxx
WEBCLIENT_JOOBLE_SECRET=xxxxx
WEBCLIENT_HIGHLIGHTLY_SECRET=xxxxx
```
## 📋 TODO

- [ ] Backend endpoints dla Lotto/Horoskop/Sport
- [ ] CRUD dla stron w panelu admina
- [ ] Paginacja listy stron
- [ ] Filtrowanie po kategoriach
- [ ] Upload obrazów
- [ ] Testy jednostkowe
- [ ] CI/CD pipeline

---

## 👥 Autorzy

- [Sebastian Górski](https://github.com/sgorski00/) - Backend
- [Jakub Grzymisławski](https://github.com/jgrzymislawski/) - Backend
- [Łukasz Szenkiel](https://github.com/lukaszsz1991/) - Backend
- [Rafał Wilczewski](https://github.com/Rafal-wq/) - Frontend

---

## 📄 Licencja

Projekt wykonywany w ramach kursu *Projektowanie i programowanie systemów internetowych II*  
Collegium Witelona Uczelnia Państwowa


---

## 📞 Kontakt

Projekt GitHub: [teletext-dev](https://github.com/lukaszsz1991/teletext-dev)
