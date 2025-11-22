# Teletext Frontend

Frontend aplikacji **Teletext** - system zarządzania telegazetą w stylu retro.

---

## 🎨 Design

Aplikacja stylizowana jest na klasyczną telegazetę z lat 80/90:
- Czarne tło z zielonym tekstem
- Font monospace (Courier New)
- Efekty CRT (scanlines, flicker)
- ASCII art
- Responsywny design

---

## 🛠️ Technologie

- **React** 19
- **Vite** - szybki bundler
- **React Router** - routing między stronami
- **Axios** - komunikacja z API
- **CSS** - vanilla CSS (bez frameworków)

---

## 📦 Instalacja

### Wymagania:
- Node.js 18+
- npm lub yarn

### Kroki:

1. **Sklonuj repozytorium:**
```bash
git clone https://github.com/lukaszsz1991/teletext-frontend.git
cd teletext-frontend
```

2. **Zainstaluj zależności:**
```bash
npm install
```

3. **Uruchom serwer deweloperski:**
```bash
npm run dev
```

4. **Otwórz w przeglądarce:**
```
http://localhost:5173
```

---

## 🚀 Dostępne komendy

| Komenda | Opis |
|---------|------|
| `npm run dev` | Uruchamia serwer deweloperski (localhost:5173) |
| `npm run build` | Buduje aplikację do produkcji (folder `dist/`) |
| `npm run preview` | Podgląd zbudowanej aplikacji |
| `npm run lint` | Sprawdza kod pod kątem błędów (ESLint) |

---

## 📁 Struktura projektu
```
frontend/
├── public/              
├── src/
│   ├── components/      
│   │   ├── layout/      
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Scanlines.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/           
│   │   ├── HomePage.jsx
│   │   ├── PageListPage.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminPages.jsx
│   │   ├── AdminPageNew.jsx
│   │   ├── AdminIntegrations.jsx
│   │   └── AdminStats.jsx
│   ├── services/        
│   │   └── api.jsx
│   ├── styles/          
│   │   └── teletext.css
│   ├── App.jsx          
│   └── main.jsx         
├── index.html           
├── package.json         
└── vite.config.js       
```

---

## 🌐 Routing

### Strony publiczne:

| URL | Komponent | Opis |
|-----|-----------|------|
| `/` | `HomePage` | Strona główna |
| `/pages` | `PageListPage` | Lista stron telegazety |

### Panel administratora (chronione):

| URL | Komponent | Opis |
|-----|-----------|------|
| `/admin/login` | `AdminLogin` | Logowanie administratora |
| `/admin/dashboard` | `AdminDashboard` | Panel główny admina |
| `/admin/pages` | `AdminPages` | Zarządzanie stronami |
| `/admin/pages/new` | `AdminPageNew` | Dodawanie nowej strony |
| `/admin/integrations` | `AdminIntegrations` | Konfiguracja integracji |
| `/admin/stats` | `AdminStats` | Statystyki odwiedzin |

**Uwaga:** Wszystkie trasy `/admin/*` (oprócz `/admin/login`) wymagają zalogowania. Brak tokenu JWT przekierowuje do strony logowania.

---

## 🔐 Autoryzacja

Panel administratora wykorzystuje JWT (JSON Web Token) do autoryzacji:

- Token przechowywany w `localStorage`
- Automatyczne przekierowanie przy braku tokenu
- Przycisk wylogowania w menu bocznym

**Dane testowe (mock):**
```
Email: admin@test.pl
Hasło: admin123
```

---

## 🔌 Połączenie z backendem

Backend aplikacji znajduje się w osobnym repozytorium:
- Repo: https://github.com/lukaszsz1991/teletext-backend
- API URL (lokalnie): `http://localhost:8080/api`
- Dokumentacja (Swagger): `http://localhost:8080/swagger-ui.html`

**Aby frontend działał z danymi:**
1. Uruchom backend (patrz: backend README)
2. Backend musi być dostępny na `http://localhost:8080`
3. Frontend automatycznie połączy się z API

**Aktualne API endpoints:**
- `POST /api/auth/login` - Logowanie administratora

---

## 👥 Autorzy

- [Sebastian Górski](https://github.com/sgorski00/)
- [Jakub Grzymisławski](https://github.com/jgrzymislawski/)
- [Łukasz Szenkiel](https://github.com/lukaszsz1991/)
- [Rafał Wilczewski](https://github.com/Rafal-wq/)

---

## 📄 Licencja

Projekt wykonywany w ramach kursu *Projektowanie i programowanie systemów internetowych II*

---

## ✅ Zrealizowane funkcjonalności

- [x] Logowanie administratora (JWT)
- [x] Panel administratora z layoutem
- [x] Top navbar (data, czas, temperatura, święto)
- [x] Sidebar z menu nawigacyjnym
- [x] Protected routes
- [x] Wylogowanie
- [ ] Połączenie z API backendu
- [ ] CRUD dla stron telegazety
- [ ] Integracje zewnętrzne (pogoda, lotto, kursy walut, etc.)
- [ ] Statystyki odwiedzin