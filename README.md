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

- **React** 18
- **Vite** - szybki bundler
- **React Router** - routing między stronami
- **Axios** - komunikacja z API (będzie dodany)
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
├── public/              # Pliki statyczne
├── src/
│   ├── components/      # Komponenty wielokrotnego użytku
│   │   └── layout/      # Header, Footer, Scanlines
│   ├── pages/           # Główne widoki/strony
│   │   ├── HomePage.jsx
│   │   └── PageListPage.jsx
│   ├── services/        # API communication (TODO)
│   ├── styles/          # Style globalne
│   │   └── teletext.css
│   ├── utils/           # Helpery, stałe (TODO)
│   ├── App.jsx          # Główny komponent z routingiem
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Zależności npm
└── vite.config.js       # Konfiguracja Vite
```

---

## 🌐 Routing

Aktualnie dostępne strony:

| URL | Komponent | Opis |
|-----|-----------|------|
| `/` | `HomePage` | Strona główna (landing page) |
| `/pages` | `PageListPage` | Lista stron telegazety (TODO: połączenie z API) |

**Planowane:**
- `/pages/:pageNumber` - Widok pojedynczej strony (np. `/pages/100`)
- `/admin/login` - Logowanie administratora
- `/admin/dashboard` - Panel admina

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

## 🐛 Znane problemy / TODO

- [ ] Połączenie z API backendu
- [ ] Wyświetlanie listy stron z API
- [ ] Widok pojedynczej strony telegazety
- [ ] Panel administratora
- [ ] Autoryzacja JWT