# PV és Alállomási Tervtípusok Ellenőrző

Ez egy egyszerű weboldal, amely segít ellenőrizni, hogy egy PV vagy alállomási tervcsomagban minden szükséges terv benne van-e.

## Funkciók

### 📋 Tervtípusok
- **PV Tervek**: Layouts, Single Line Diagram, Civil Engineering, Electrical, Structural
- **Alállomási Tervek**: Layouts, Single Line Diagram, Civil Engineering, Electrical, Protection & Control, Mechanical

### ✅ Ellenőrzési funkciók
- Interaktív checkboxok minden tervtípushoz
- Progress bar a teljesítés követésére
- Összes kijelölése/törlése gombok
- Visszaállítás funkció
- Automatikus mentés (localStorage)
- Responsive design mobil eszközökre

### ⌨️ Billentyűparancsok
- `Ctrl + A`: Összes kijelölése
- `Ctrl + D`: Összes törlése  
- `Ctrl + R`: Visszaállítás

## GitHub Pages telepítés

### 1. Repository létrehozása
1. Menj a GitHub-ra és hozz létre egy új repository-t
2. Nevezd el például: `pv-substation-checklist`

### 2. Fájlok feltöltése
1. Töltsd fel ezeket a fájlokat a repository gyökérkönyvtárába:
   - `index.html`
   - `styles.css`
   - `script.js`

### 3. GitHub Pages engedélyezése
1. Menj a repository **Settings** fülre
2. Görgess le a **Pages** szekcióhoz
3. **Source**-nál válaszd a **Deploy from a branch** opciót
4. **Branch**-nál válaszd a **main** ágat
5. Kattints a **Save** gombra

### 4. Weboldal elérése
A weboldal elérhető lesz a következő címen:
```
https://[felhasználóneved].github.io/pv-substation-checklist/
```

## Fájlstruktúra

```
pv-substation-checklist/
├── index.html          # Fő HTML fájl
├── styles.css          # CSS stílusok
├── script.js           # JavaScript funkcionalitás
└── README.md           # Ez a fájl
```

## Használat

1. Nyisd meg a weboldalt
2. Jelöld ki azokat a tervtípusokat, amelyeket ellenőrzöttél a tervcsomagban
3. A progress bar mutatja, hogy hány tervet jelöltél ki
4. A beállítások automatikusan mentődnek a böngészőben

## Testreszabás

### Új tervtípusok hozzáadása
1. Nyisd meg az `index.html` fájlt
2. Keress rá a megfelelő kategóriára (PV vagy Alállomási)
3. Add hozzá az új tervtípust a megfelelő subcategory alatt:

```html
<label class="plan-item">
    <input type="checkbox" data-category="pv" data-subcategory="layouts">
    <span class="plan-name">Új Tervtípus</span>
    <span class="plan-description">Leírás</span>
</label>
```

### Színek módosítása
Nyisd meg a `styles.css` fájlt és módosítsd a színváltozókat:
- Fő színek: `#667eea`, `#764ba2`
- Háttér: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

## Technikai részletek

- **HTML5**: Modern szemantikus struktúra
- **CSS3**: Flexbox, Grid, animációk, responsive design
- **Vanilla JavaScript**: Nincs külső függőség
- **LocalStorage**: Adatok helyi tárolása
- **PWA kész**: Service Worker támogatás

## Böngésző támogatás

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Licenc

Ez a projekt nyílt forráskódú és szabadon használható.

## Kapcsolat

Ha kérdésed van vagy javaslatod van, nyiss egy issue-t a GitHub repository-ban.
