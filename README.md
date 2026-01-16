# Akvaparkovi u Hrvatskoj 🌊

Web aplikacija za prikaz informacija o akvaparkcima u Hrvatskoj s integracijom Google Analytics API-ja.

## 📋 Opis projekta

Ovaj projekt je izrađen kao dio kolegija "Tehnologije interaktivnog weba" i obuhvaća:
- Integraciju Google Analytics API-ja
- OAuth 2.0 autentifikaciju
- Vizualizaciju podataka o ponašanju korisnika
- Sustav preporuka temeljen na Cosine Similarity algoritmu
- Analizu uzoraka ponašanja korisnika (Funnel, Retention, Path analiza)

## 🛠️ Tehnologije

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- D3.js za vizualizaciju cijena
- Chart.js za analytics grafove
- Google Analytics Data API v1
- Google Identity Services (OAuth 2.0)

## 🚀 Postavke za lokalni razvoj

### 1. Kloniraj repozitorij
```bash
git clone https://github.com/tvoje-korisnicko-ime/akvaparkovi.git
cd akvaparkovi
```

### 2. Konfiguriraj environment varijable
Kopiraj `.env.example` u `.env` i popuni svoje podatke:
```bash
cp .env.example .env
```

### 3. Pokreni lokalni server
Možeš koristiti VS Code Live Server ekstenziju ili bilo koji drugi lokalni server:
```bash
# Ako imaš Python
python -m http.server 5500

# Ili koristi Live Server u VS Code
```

## ☁️ Google Cloud Console postavke

### Authorized JavaScript Origins:
```
http://localhost:5500
http://127.0.0.1:5500
https://akvaparkovi.vercel.app
```

### Authorized Redirect URIs:
```
http://localhost:5500/login.html
http://127.0.0.1:5500/login.html
https://akvaparkovi.vercel.app/login.html
```

## 📁 Struktura projekta

```
├── index.html          # Glavna stranica s prikazom akvaparkova
├── login.html          # OAuth 2.0 login stranica
├── analytics.html      # Analytics dashboard
├── config.js           # Konfiguracija (Client ID, Property ID)
├── scripts.js          # Glavna JavaScript logika
├── styles.css          # CSS stilovi
├── .env                # Environment varijable (NIJE u repozitoriju)
├── .env.example        # Primjer environment varijabli
├── .gitignore          # Git ignore file
└── images/             # Slike akvaparkova
    ├── biograd/
    ├── cikat/
    ├── istralandia/
    ├── martilandia/
    ├── porec/
    └── sibenik/
```

## 📊 Funkcionalnosti

### 1. OAuth 2.0 Autentifikacija
- Sigurna prijava putem Google računa
- Pristup Google Analytics podacima

### 2. Dohvaćanje Analytics podataka
- Broj korisnika, sesija, pregleda stranica
- Prosječno trajanje sesije
- Bounce rate
- Broj događaja

### 3. Vizualizacija (3 ključne metrike)
- Korisnici po uređaju (Desktop/Mobile/Tablet)
- Korisnici kroz vrijeme (linijski graf)
- Izvori prometa (pie chart)

### 4. Sustav preporuka
- Content-based filtering
- Cosine Similarity algoritam
- Preporuke na temelju korisničkih interakcija

### 5. Analize ponašanja
- **Funnel analiza**: Praćenje korisničkog toka
- **Retention analiza**: Day 1, 7, 14, 30 retention
- **Path analiza**: Najčešće korisničke putanje

## ⚠️ Napomena o podacima

Neki podaci u aplikaciji mogu biti generirani/simulirani za demonstraciju jer Google Analytics API možda nema dovoljno stvarnih podataka za novu stranicu. Aplikacija jasno označava koji su podaci stvarni, a koji simulirani.

## 🔒 Sigurnost

- `.env` datoteka s osjetljivim podacima NIJE uključena u repozitorij
- Client Secret se koristi samo na backendu (ako je potrebno)
- API ključ je ograničen na specifične domene

## 👤 Autor

[Tvoje ime]  
Kolegij: Tehnologije interaktivnog weba  
Akademska godina: 2025./2026.

## 📄 Licenca

Ovaj projekt je izrađen za edukacijske svrhe.
