# Villamos Kalkulátorok - Elektromérnöki Eszközök

Egy átfogó, kliensoldali villamos kalkulátorok gyűjteménye, amelyet villamosmérnökök számára fejlesztettünk. A rendszer moduláris felépítésű, könnyen bővíthető és GitHub Pages-en futtatható.

## 🚀 Funkciók

### Főbb kalkulátorok

1. **Rövidzárlati áram és hurokimpedancia**
   - Ik számítás transzformátor és kábel adatok alapján
   - Hurokimpedancia meghatározás
   - Védelmi eszközök kiválasztása és ellenőrzése
   - Védelem megfelelőség értékelés

2. **Feszültségesés számítás**
   - Többszakaszos feszültségesés támogatás
   - 1f/3f rendszerek támogatása
   - Kábel méretezés javaslatok
   - Feszültségesés százalékos értékelés

3. **Teljesítmény és meddőkompenzáció**
   - cosφ számítás és optimalizálás
   - Meddőteljesítmény kompenzáció méretezés
   - Kondenzátor lépések tervezése
   - Gazdasági megtérülési elemzés

4. **Energiafogyasztás és költségbecslés**
   - Éves energiafogyasztás számítás
   - Tarifa elemzés és költségbecslés
   - Infláció hatásának figyelembevétele
   - Hosszú távú költség elemzés

5. **Érintésvédelem és kioldási idő**
   - RCD, MCB, biztosíték védelem ellenőrzés
   - Kioldási idő számítás
   - Érintési feszültség ellenőrzés
   - TN, TT, IT rendszerek támogatása

6. **Hőhatás és kábelmelegedés**
   - Kábel hőhatás számítás
   - Üzemi és rövidzárlati hőmérséklet
   - Kábel élettartam becslés
   - Hőterhelés kategóriák

7. **Akkumulátor kapacitás és üzemidő**
   - UPS és off-grid rendszerek méretezés
   - Akkumulátor kapacitás számítás
   - Üzemidő becslés
   - Költség elemzés és megtérülés

8. **Szelektivitás és időkoordináció**
   - Védelmi eszközök koordinálása
   - Szelektivitás ellenőrzés
   - Időkoordináció elemzés
   - Védelem megfelelőség értékelés

### További modulok

- **Transzformátor számítások** - Veszteségek, hatásfok, méretezés
- **Kábel méretezés** - Terhelhetőség, keresztmetszet meghatározás
- **Motor védelem** - Indítási áramok, védelmi eszközök
- **Villámvédelem** - Levezető rendszer, földelés méretezés

## 🛠️ Technikai részletek

### Architektúra
- **Frontend**: Tiszta JavaScript (ES6+), moduláris felépítés
- **Routing**: Hash-alapú routing (#/modul-azonosito)
- **Storage**: localStorage mentés modulonként
- **Export**: CSV/PDF export minden modulhoz
- **Responsive**: Mobil-first design, reszponzív felület

### Futtatás
```bash
# Nincs build szükséges, közvetlenül futtatható
# Egyszerűen nyissa meg az index.html fájlt böngészőben
# vagy GitHub Pages-en telepítse
```

### Bővítés
Új modul hozzáadása:
1. Hozzon létre új fájlt `js/modules/modul-neve.js`
2. Implementálja a `BaseModule` osztályt
3. Regisztrálja a modult az `app.js` fájlban
4. Adja hozzá a dashboard-hoz

## 📁 Fájlstruktúra

```
├── index.html              # Fő HTML fájl
├── assets/
│   └── styles.css          # CSS stílusok
├── js/
│   ├── app.js              # Fő alkalmazás logika
│   └── modules/            # Kalkulátor modulok
│       ├── short-circuit.js
│       ├── voltage-drop.js
│       ├── power.js
│       ├── energy.js
│       ├── protection.js
│       ├── thermal.js
│       ├── battery.js
│       ├── selectivity.js
│       └── ... (további modulok)
└── README.md
```

## 🎯 Célcsoport

- **Villamosmérnökök** - Alállomások, PV erőművek tervezése
- **Elektromérnökök** - 0.4, 11, 22, 132 kV rendszerek
- **Projektmenedzserek** - Költségbecslés, megtérülési elemzés
- **Karbantartó mérnökök** - Védelem ellenőrzés, hibakeresés

## 🔧 Használat

1. **Modul kiválasztás**: A főoldalon kattintson a kívánt kalkulátorra
2. **Adatok megadása**: Töltse ki a szükséges bemeneti mezőket
3. **Számítás**: Kattintson a "Számítás" gombra
4. **Eredmények**: Tekintse meg a számítási eredményeket
5. **Export**: Mentse el az eredményeket CSV vagy PDF formátumban
6. **Mentés**: A bemeneti adatok automatikusan mentésre kerülnek

## 📊 Számítási módszerek

### Rövidzárlati áram
- IEC 60909 szabvány alapján
- Transzformátor impedancia számítás
- Kábel impedancia figyelembevétele
- Védelem megfelelőség ellenőrzés

### Feszültségesés
- ΔU = √3 × I × L × (R × cosφ + X × sinφ)
- Többszakaszos számítás
- 1f/3f rendszerek támogatása
- Százalékos értékelés

### Meddőkompenzáció
- Kondenzátor méretezés
- Gazdasági megtérülési elemzés
- Lépéses kompenzáció tervezés
- Hatásfok számítás

## 🌟 Főbb előnyök

- **Nincs telepítés szükséges** - Böngészőben futtatható
- **Offline működés** - Internetkapcsolat nélkül is használható
- **Moduláris felépítés** - Könnyen bővíthető
- **Professzionális eredmények** - Szabványos számítási módszerek
- **Export funkciók** - CSV/PDF riportok
- **Responsive design** - Mobil és asztali eszközökön is működik

## 📝 Licenc

Ez a projekt nyílt forráskódú, szabadon használható és módosítható.

## 🤝 Közreműködés

Ha szeretne új modult hozzáadni vagy javítást javasolni, kérjük, hozza létre a megfelelő issue-t vagy pull request-et.

---

**Fejlesztve villamosmérnökök számára** ⚡