## Spis treści
- [Jak pracować z submodułami](jak-pracować-z-submodułami)
- [Docker Compose](#docker-compose)
- [Makefile](#makefile)
- [Tworzenie nowych stron](#tworzenie-nowych-stron)
- [Autorzy](#autorzy)

---

## Jak pracować z submodułami

Każdy submoduł jest osobnym repozytorium Git. Wchodząc do odpowiedniego podfolderu (`backend` lub `frontend`) pracujemy w tym repozytorium. Oznacza to, że możemy w nim tworzyć gałęzie, aktualizować kod, robić commity, PR itd.

:exclamation: Po wdrożeniu zmian w submodułach w branchu `main`, należy zaktualizować repozytorium `teletext-dev`:

```bash
make rebase # (opcjonalnie)
make push-backend # dla zmian w backendzie
make push-frontend # dla zmian w frontendzie
```

lub dla większej kontroli (np. modyfikacja commit message):

```bash
cd teletext-dev
make rebase
git add backend # lub git add frontend, w zależności od zaktualizowanego repozytorium
git commit -m "chore: update submodules"
git push -u origin xxx # xxx należy zastąpić aktualnym lokalnym branchem
```

> Ten commit w `teletext-dev` aktualizuje referencję submodułu do najnowszej wersji `main` i pozwala wszystkim współpracownikom pobrać aktualny stan projektu.

### Aktualizacja submodułów

Przed rozpoczęciem pracy warto upewnić się, że wszystkie repozytoria są aktualne.

W tym celu wystarczy uruchomić komendę:
```bash
make rebase
```

Pod tą komendą kryje się ten skrypt:
```bash
git pull --rebase
git submodule update --init --recursive --remote --jobs 2
```

Wykonanie jednej z powyższych komend spowoduje pobranie najnowszej wersji repozytoriów z branchy `main`.

---

## Docker Compose

Wykorzystujemy Docker Compose do uruchamiania wszystkich serwisów lokalnie, w tym:
- bazę danych PostgreSQL (`postgres`)
- backend Spring Boot (`backend`)
- frontend React + Nginx (`frontend`)

### Uruchomienie
1. Upewnij się, że masz zainstalowanego Dockera.
2. Skopiuj plik `.env.example` do `.env` i dostosuj zmienne środowiskowe według potrzeb.
3. Wykonaj powyższy punkt dla `.env.webclient.example`, kopiując go do `.env.webclient`.
4. Uruchom serwisy za pomocą komendy:
   ```bash
   docker-compose up --build -d
   ```

   lub użyj:

   ```bash
   make build-up
   ```

---

## Makefile

Pomocne komendy do pracy nad projektem:

| Komenda                 | Opis                                                     |
|-------------------------|----------------------------------------------------------|
| `make rebase`           | Aktualizuje repozytorium i submoduły                     |
| `make push-backend`     | Wypycha zmiany w backendzie do zdalnego repozytorium     |
| `make push-frontend`    | Wypycha zmiany w frontendzie do zdalnego repozytorium    |
| `make build`            | Buduje obrazy Docker dla wszystkich serwisów             |
| `make build-up`         | Buduje i uruchamia obrazy Docker dla wszystkich serwisów |
| `make up`               | Uruchamia serwisy Docker Compose                         |
| `make down`             | Zatrzymuje serwisy Docker Compose                        |
| `make logs`             | Wyświetla logi wszystkich serwisów                       |
| `make restart`          | Przebudowuje i restaruje wszystkie serwisy               |
| `make restart-backend`  | Przebudowuje i restaruje backend aplikacji               |
| `make restart-frontend` | Przebudowuje i restaruje frontend aplikacji              |

---

## Tworzenie nowych stron

System Telegazeta używa dwuetapowego procesu tworzenia stron:
1. **Utworzenie szablonu (Template)** - definiuje źródło danych i konfigurację
2. **Utworzenie strony (Page)** - przypisuje szablon do konkretnego numeru strony

### Zakresy numeracji stron

| Kategoria | Zakres stron | Opis |
|-----------|--------------|------|
| NEWS | 101-199 | Wiadomości |
| SPORTS | 201-299 | Sport |
| LOTTERY | 301-399 | Loterie |
| TV | 401-499 | Program TV |
| WEATHER | 501-599 | Pogoda |
| JOBS | 601-699 | Oferty pracy |
| HOROSCOPE | 701-799 | Horoskopy |
| FINANCE | 801-899 | Finanse |
| MISC | 901-999 | Różne |

### Krok 1: Utworzenie szablonu

Szablon tworzy się przez panel administracyjny (`/admin/templates/new`) lub API:

```http
POST /api/admin/templates
Content-Type: application/json
Authorization: Bearer {token}
```

#### Przykładowe konfiguracje dla różnych integracji:

**Sport - Tabela ligowa:**
```json
{
  "name": "Tabela Ekstraklasy 2025",
  "source": "SPORT_TABLE",
  "category": "SPORTS",
  "configJson": {
    "league": "ekstraklasa",
    "season": "2025"
  }
}
```

**Sport - Mecze:**
```json
{
  "name": "Mecze Ekstraklasy",
  "source": "SPORT_MATCHES",
  "category": "SPORTS",
  "configJson": {
    "league": "ekstraklasa",
    "season": "2025",
    "round": 15
  }
}
```

**Pogoda:**
```json
{
  "name": "Pogoda Wrocław",
  "source": "WEATHER",
  "category": "WEATHER",
  "configJson": {
    "city": "Wrocław",
    "days": 7
  }
}
```

**Horoskop:**
```json
{
  "name": "Horoskop Baran",
  "source": "HOROSCOPE",
  "category": "HOROSCOPE",
  "configJson": {
    "sign": "aries"
  }
}
```

**Program TV:**
```json
{
  "name": "Program TVP1",
  "source": "TV_PROGRAM",
  "category": "TV",
  "configJson": {
    "channelName": "TVP1",
    "date": "2026-01-20"
  }
}
```

**Loteria:**
```json
{
  "name": "Wyniki Lotto",
  "source": "LOTTERY",
  "category": "LOTTERY",
  "configJson": {
    "game": "lotto"
  }
}
```

**Kursy walut:**
```json
{
  "name": "Kurs USD",
  "source": "EXCHANGE_RATE",
  "category": "FINANCE",
  "configJson": {
    "currency": "USD"
  }
}
```

**Oferty pracy:**
```json
{
  "name": "Oferty pracy IT",
  "source": "JOB_OFFERS",
  "category": "JOBS",
  "configJson": {
    "keywords": "React",
    "location": "Warsaw"
  }
}
```

**Wiadomości:**
```json
{
  "name": "Wiadomości z Polski",
  "source": "NEWS",
  "category": "NEWS",
  "configJson": {
    "country": "pl",
    "limit": 10
  }
}
```

**Strona manualna:**
```json
{
  "name": "Strona informacyjna",
  "source": "MANUAL",
  "category": "MISC",
  "configJson": {}
}
```

### Krok 2: Utworzenie strony

Po utworzeniu szablonu, tworzysz stronę przypisując jej:
- **Numer strony** (z odpowiedniego zakresu)
- **Kategorię**
- **ID szablonu** (dla stron opartych na szablonach)

Strona tworzy się przez panel administracyjny (`/admin/pages/new`) lub API:

**Strona z szablonu:**
```http
POST /api/admin/pages
Content-Type: application/json
Authorization: Bearer {token}

{
  "type": "TEMPLATE",
  "pageNumber": 201,
  "category": "SPORTS",
  "templateId": 1
}
```

**Strona manualna:**
```http
POST /api/admin/pages
Content-Type: application/json
Authorization: Bearer {token}

{
  "type": "MANUAL",
  "pageNumber": 901,
  "category": "MISC",
  "title": "O systemie Telegazeta",
  "description": "Telegazeta to nowoczesny system teletekstu..."
}
```

### Krok 3: Aktywacja strony

Po utworzeniu strony należy ją aktywować:

```http
PATCH /api/admin/pages/{id}/activate
Authorization: Bearer {token}
```

### Dostępne źródła danych (source)

| Source | Opis | Wymagane pola w configJson |
|--------|------|----------------------------|
| `SPORT_TABLE` | Tabela ligowa | `league`, `season` |
| `SPORT_MATCHES` | Mecze sportowe | `league`, `season`, `round` |
| `WEATHER` | Prognoza pogody | `city`, `days` |
| `HOROSCOPE` | Horoskop | `sign` |
| `TV_PROGRAM` | Program TV | `channelName`, `date` |
| `LOTTERY` | Wyniki loterii | `game` |
| `EXCHANGE_RATE` | Kursy walut | `currency` |
| `JOB_OFFERS` | Oferty pracy | `keywords`, `location` |
| `NEWS` | Wiadomości | `country`, `limit` |
| `MANUAL` | Strona ręczna | - |

### Porady

- **Numeracja:** Zawsze używaj numerów z odpowiedniego zakresu dla danej kategorii
- **Testowanie:** Najpierw utwórz szablon, przetestuj go na stronie testowej, potem twórz docelowe strony
- **Zarządzanie:** Nieaktywne strony i szablony są ukryte dla użytkowników, ale widoczne w panelu admina
- **Edycja:** Zmiana `configJson` w szablonie automatycznie wpływa na wszystkie strony używające tego szablonu

---

## Autorzy
- [Sebastian Górski](https://github.com/sgorski00/)
- [Jakub Grzymisławski](https://github.com/jgrzymislawski/)
- [Łukasz Szenkiel](https://github.com/lukaszsz1991/)
- [Rafał Wilczewski](https://github.com/Rafal-wq/)

---

> Projekt wykonywany w ramach kursu *Projektowanie i programowanie systemów internetowych II