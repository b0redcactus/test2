// ===== Hőhatás és kábelmelegedés modul =====
export default class ThermalModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Kábel adatok
            cableType: 'XLPE',
            crossSection: 95, // mm²
            conductorMaterial: 'copper', // 'copper', 'aluminum'
            insulationType: 'XLPE', // 'XLPE', 'PVC', 'PE'
            
            // Környezeti adatok
            ambientTemperature: 25, // °C
            soilTemperature: 15, // °C
            soilThermalResistivity: 1.0, // K·m/W
            installationDepth: 0.8, // m
            
            // Terhelés adatok
            loadCurrent: 100, // A
            loadFactor: 0.8, // 80%
            operatingTime: 8, // hours/day
            
            // Hőhatás paraméterek
            maxOperatingTemperature: 90, // °C
            shortCircuitTemperature: 250, // °C
            shortCircuitDuration: 1, // s
            shortCircuitCurrent: 10000, // A
            
            // Kábel geometria
            conductorDiameter: 11.0, // mm
            insulationThickness: 1.4, // mm
            sheathThickness: 2.0, // mm
        };
        
        this.results = {};
    }

    async render(container) {
        this.loadData();
        
        container.innerHTML = `
            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">1</span>
                    Kábel adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="cableType">Kábel típusa</label>
                        <select id="cableType" class="form-select">
                            <option value="XLPE" ${this.data.cableType === 'XLPE' ? 'selected' : ''}>XLPE</option>
                            <option value="PVC" ${this.data.cableType === 'PVC' ? 'selected' : ''}>PVC</option>
                            <option value="PE" ${this.data.cableType === 'PE' ? 'selected' : ''}>PE</option>
                            <option value="EPR" ${this.data.cableType === 'EPR' ? 'selected' : ''}>EPR</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="crossSection">Keresztmetszet (mm²)</label>
                        <select id="crossSection" class="form-select">
                            <option value="16" ${this.data.crossSection === 16 ? 'selected' : ''}>16 mm²</option>
                            <option value="25" ${this.data.crossSection === 25 ? 'selected' : ''}>25 mm²</option>
                            <option value="35" ${this.data.crossSection === 35 ? 'selected' : ''}>35 mm²</option>
                            <option value="50" ${this.data.crossSection === 50 ? 'selected' : ''}>50 mm²</option>
                            <option value="70" ${this.data.crossSection === 70 ? 'selected' : ''}>70 mm²</option>
                            <option value="95" ${this.data.crossSection === 95 ? 'selected' : ''}>95 mm²</option>
                            <option value="120" ${this.data.crossSection === 120 ? 'selected' : ''}>120 mm²</option>
                            <option value="150" ${this.data.crossSection === 150 ? 'selected' : ''}>150 mm²</option>
                            <option value="185" ${this.data.crossSection === 185 ? 'selected' : ''}>185 mm²</option>
                            <option value="240" ${this.data.crossSection === 240 ? 'selected' : ''}>240 mm²</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="conductorMaterial">Vezető anyaga</label>
                        <select id="conductorMaterial" class="form-select">
                            <option value="copper" ${this.data.conductorMaterial === 'copper' ? 'selected' : ''}>Réz</option>
                            <option value="aluminum" ${this.data.conductorMaterial === 'aluminum' ? 'selected' : ''}>Alumínium</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="insulationType">Szigetelés típusa</label>
                        <select id="insulationType" class="form-select">
                            <option value="XLPE" ${this.data.insulationType === 'XLPE' ? 'selected' : ''}>XLPE</option>
                            <option value="PVC" ${this.data.insulationType === 'PVC' ? 'selected' : ''}>PVC</option>
                            <option value="PE" ${this.data.insulationType === 'PE' ? 'selected' : ''}>PE</option>
                            <option value="EPR" ${this.data.insulationType === 'EPR' ? 'selected' : ''}>EPR</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">2</span>
                    Környezeti adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="ambientTemperature">Környezeti hőmérséklet (°C)</label>
                        <input type="number" id="ambientTemperature" class="form-input" value="${this.data.ambientTemperature}" min="-40" max="60" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="soilTemperature">Talaj hőmérséklet (°C)</label>
                        <input type="number" id="soilTemperature" class="form-input" value="${this.data.soilTemperature}" min="-10" max="40" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="soilThermalResistivity">Talaj hőellenállás (K·m/W)</label>
                        <select id="soilThermalResistivity" class="form-select">
                            <option value="0.7" ${this.data.soilThermalResistivity === 0.7 ? 'selected' : ''}>0.7 (nedves agyag)</option>
                            <option value="1.0" ${this.data.soilThermalResistivity === 1.0 ? 'selected' : ''}>1.0 (normál talaj)</option>
                            <option value="1.5" ${this.data.soilThermalResistivity === 1.5 ? 'selected' : ''}>1.5 (száraz talaj)</option>
                            <option value="2.5" ${this.data.soilThermalResistivity === 2.5 ? 'selected' : ''}>2.5 (kőzet)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="installationDepth">Telepítési mélység (m)</label>
                        <input type="number" id="installationDepth" class="form-input" value="${this.data.installationDepth}" min="0.3" max="3.0" step="0.1">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Terhelés adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="loadCurrent">Terhelési áram (A)</label>
                        <input type="number" id="loadCurrent" class="form-input" value="${this.data.loadCurrent}" min="1" max="10000" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loadFactor">Terhelési tényező</label>
                        <input type="number" id="loadFactor" class="form-input" value="${this.data.loadFactor * 100}" min="10" max="100" step="1">
                        <div class="form-help">Jellemző értékek: 70-90%</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="operatingTime">Üzemidő (óra/nap)</label>
                        <input type="number" id="operatingTime" class="form-input" value="${this.data.operatingTime}" min="1" max="24" step="0.5">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">4</span>
                    Rövidzárlati hőhatás
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="shortCircuitCurrent">Rövidzárlati áram (A)</label>
                        <input type="number" id="shortCircuitCurrent" class="form-input" value="${this.data.shortCircuitCurrent}" min="100" max="100000" step="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="shortCircuitDuration">Rövidzárlati idő (s)</label>
                        <input type="number" id="shortCircuitDuration" class="form-input" value="${this.data.shortCircuitDuration}" min="0.1" max="10" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="maxOperatingTemperature">Max. üzemi hőmérséklet (°C)</label>
                        <input type="number" id="maxOperatingTemperature" class="form-input" value="${this.data.maxOperatingTemperature}" min="60" max="150" step="5">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="shortCircuitTemperature">Rövidzárlati hőmérséklet (°C)</label>
                        <input type="number" id="shortCircuitTemperature" class="form-input" value="${this.data.shortCircuitTemperature}" min="150" max="400" step="10">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                    <button class="btn btn-primary btn-lg" onclick="window.currentModule.calculate()">
                        Számítás
                    </button>
                    <button class="btn btn-secondary" onclick="window.currentModule.loadExample()">
                        Példa betöltése
                    </button>
                    <button class="btn btn-secondary" onclick="window.currentModule.saveData()">
                        Mentés
                    </button>
                    <button class="btn btn-secondary" onclick="window.currentModule.exportResults()">
                        Export
                    </button>
                </div>
            </div>

            <div id="results-section" class="results-section" style="display: none;">
                <h2 class="results-title">
                    <span>🌡️</span>
                    Hőhatás eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // All input listeners
        const inputs = ['cableType', 'crossSection', 'conductorMaterial', 'insulationType',
                       'ambientTemperature', 'soilTemperature', 'soilThermalResistivity', 'installationDepth',
                       'loadCurrent', 'loadFactor', 'operatingTime',
                       'shortCircuitCurrent', 'shortCircuitDuration', 'maxOperatingTemperature', 'shortCircuitTemperature'];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateData();
                });
            }
        });
    }

    updateData() {
        this.data = {
            cableType: document.getElementById('cableType').value,
            crossSection: Number(document.getElementById('crossSection').value),
            conductorMaterial: document.getElementById('conductorMaterial').value,
            insulationType: document.getElementById('insulationType').value,
            ambientTemperature: Number(document.getElementById('ambientTemperature').value),
            soilTemperature: Number(document.getElementById('soilTemperature').value),
            soilThermalResistivity: Number(document.getElementById('soilThermalResistivity').value),
            installationDepth: Number(document.getElementById('installationDepth').value),
            loadCurrent: Number(document.getElementById('loadCurrent').value),
            loadFactor: Number(document.getElementById('loadFactor').value) / 100,
            operatingTime: Number(document.getElementById('operatingTime').value),
            shortCircuitCurrent: Number(document.getElementById('shortCircuitCurrent').value),
            shortCircuitDuration: Number(document.getElementById('shortCircuitDuration').value),
            maxOperatingTemperature: Number(document.getElementById('maxOperatingTemperature').value),
            shortCircuitTemperature: Number(document.getElementById('shortCircuitTemperature').value)
        };
    }

    calculate() {
        this.updateData();
        
        try {
            // Kábel paraméterek
            const conductorResistance = this.getConductorResistance(this.data.crossSection, this.data.conductorMaterial);
            const thermalCapacity = this.getThermalCapacity(this.data.crossSection, this.data.conductorMaterial);
            
            // Üzemi hőmérséklet számítás
            const powerLoss = this.data.loadCurrent ** 2 * conductorResistance; // W/m
            const thermalResistance = this.getThermalResistance(this.data.soilThermalResistivity, this.data.installationDepth);
            const operatingTemperature = this.data.ambientTemperature + (powerLoss * thermalResistance);
            
            // Rövidzárlati hőmérséklet számítás
            const shortCircuitPowerLoss = this.data.shortCircuitCurrent ** 2 * conductorResistance; // W/m
            const shortCircuitTemperatureRise = this.calculateShortCircuitTemperature(
                this.data.shortCircuitCurrent,
                this.data.shortCircuitDuration,
                this.data.crossSection,
                this.data.conductorMaterial
            );
            const finalShortCircuitTemperature = this.data.ambientTemperature + shortCircuitTemperatureRise;
            
            // Hőhatás értékelés
            const operatingTemperatureOK = operatingTemperature <= this.data.maxOperatingTemperature;
            const shortCircuitTemperatureOK = finalShortCircuitTemperature <= this.data.shortCircuitTemperature;
            
            // Kábel élettartam becslés
            const estimatedLifespan = this.estimateCableLifespan(operatingTemperature, this.data.maxOperatingTemperature);
            
            // Hőterhelés kategória
            const thermalCategory = this.getThermalCategory(operatingTemperature, this.data.maxOperatingTemperature);

            this.results = {
                conductorResistance,
                thermalCapacity,
                powerLoss,
                thermalResistance,
                operatingTemperature,
                shortCircuitPowerLoss,
                shortCircuitTemperatureRise,
                finalShortCircuitTemperature,
                operatingTemperatureOK,
                shortCircuitTemperatureOK,
                estimatedLifespan,
                thermalCategory
            };

            this.displayResults();

        } catch (error) {
            Utils.showMessage('Hiba történt a számítás során: ' + error.message, 'error');
        }
    }

    getConductorResistance(crossSection, material) {
        const resistivity = material === 'copper' ? 0.0175 : 0.0283; // Ω·mm²/m
        return resistivity / crossSection; // Ω/m
    }

    getThermalCapacity(crossSection, material) {
        const density = material === 'copper' ? 8960 : 2700; // kg/m³
        const specificHeat = material === 'copper' ? 385 : 900; // J/kg·K
        const volume = crossSection * 1e-6; // m³/m
        return density * specificHeat * volume; // J/K·m
    }

    getThermalResistance(soilResistivity, depth) {
        // Egyszerűsített hőellenállás számítás
        return soilResistivity * Math.log(2 * depth / 0.01) / (2 * Math.PI); // K·m/W
    }

    calculateShortCircuitTemperature(current, duration, crossSection, material) {
        const resistivity = material === 'copper' ? 0.0175 : 0.0283;
        const density = material === 'copper' ? 8960 : 2700;
        const specificHeat = material === 'copper' ? 385 : 900;
        
        const resistance = resistivity / crossSection;
        const mass = density * crossSection * 1e-6;
        const heatCapacity = mass * specificHeat;
        
        const powerLoss = current ** 2 * resistance;
        const energy = powerLoss * duration;
        const temperatureRise = energy / heatCapacity;
        
        return temperatureRise;
    }

    estimateCableLifespan(operatingTemp, maxTemp) {
        const tempRatio = operatingTemp / maxTemp;
        if (tempRatio <= 0.8) return 30;
        if (tempRatio <= 0.9) return 20;
        if (tempRatio <= 1.0) return 10;
        if (tempRatio <= 1.1) return 5;
        return 1;
    }

    getThermalCategory(operatingTemp, maxTemp) {
        const tempRatio = operatingTemp / maxTemp;
        if (tempRatio <= 0.7) return 'Alacsony';
        if (tempRatio <= 0.85) return 'Normál';
        if (tempRatio <= 1.0) return 'Magas';
        return 'Kritikus';
    }

    displayResults() {
        const resultsSection = document.getElementById('results-section');
        const resultsContent = document.getElementById('results-content');

        resultsSection.style.display = 'block';

        resultsContent.innerHTML = `
            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label">Üzemi hőmérséklet</div>
                    <div class="result-value" style="color: ${this.results.operatingTemperatureOK ? 'var(--success)' : 'var(--error)'}">
                        ${Utils.formatNumber(this.results.operatingTemperature, 1)}<span class="result-unit">°C</span>
                    </div>
                </div>
                <div class="result-item">
                    <div class="result-label">Rövidzárlati hőmérséklet</div>
                    <div class="result-value" style="color: ${this.results.shortCircuitTemperatureOK ? 'var(--success)' : 'var(--error)'}">
                        ${Utils.formatNumber(this.results.finalShortCircuitTemperature, 1)}<span class="result-unit">°C</span>
                    </div>
                </div>
                <div class="result-item">
                    <div class="result-label">Vezető ellenállás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.conductorResistance * 1000, 3)}<span class="result-unit">mΩ/m</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Hőterhelés kategória</div>
                    <div class="result-value" style="color: ${this.results.thermalCategory === 'Alacsony' ? 'var(--success)' : this.results.thermalCategory === 'Normál' ? 'var(--info)' : this.results.thermalCategory === 'Magas' ? 'var(--warning)' : 'var(--error)'}">
                        ${this.results.thermalCategory}
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Hőhatás elemzés</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Teljesítmény veszteség</div>
                        <div class="result-value">${Utils.formatNumber(this.results.powerLoss, 2)}<span class="result-unit">W/m</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Hőellenállás</div>
                        <div class="result-value">${Utils.formatNumber(this.results.thermalResistance, 3)}<span class="result-unit">K·m/W</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Rövidzárlati hőmérséklet emelkedés</div>
                        <div class="result-value">${Utils.formatNumber(this.results.shortCircuitTemperatureRise, 1)}<span class="result-unit">°C</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Becsült élettartam</div>
                        <div class="result-value">${Utils.formatNumber(this.results.estimatedLifespan, 0)}<span class="result-unit">év</span></div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Rendszer megfelelőség</h3>
                <div class="status-message ${this.results.operatingTemperatureOK ? 'status-success' : 'status-error'}">
                    <span>${this.results.operatingTemperatureOK ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.operatingTemperatureOK ? 
                            'Az üzemi hőmérséklet megfelelő' : 
                            'Az üzemi hőmérséklet túl magas - növelje a kábel keresztmetszetét'
                        }
                    </span>
                </div>
                
                <div class="status-message ${this.results.shortCircuitTemperatureOK ? 'status-success' : 'status-error'}">
                    <span>${this.results.shortCircuitTemperatureOK ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.shortCircuitTemperatureOK ? 
                            'A rövidzárlati hőmérséklet megfelelő' : 
                            'A rövidzárlati hőmérséklet túl magas - ellenőrizze a védelem beállításait'
                        }
                    </span>
                </div>
            </div>
        `;

        // Status messages
        if (!this.results.operatingTemperatureOK) {
            Utils.showMessage('Az üzemi hőmérséklet túl magas! Növelje a kábel keresztmetszetét vagy javítsa a hőelvezetést.', 'error');
        }

        if (!this.results.shortCircuitTemperatureOK) {
            Utils.showMessage('A rövidzárlati hőmérséklet túl magas! Ellenőrizze a védelem beállításait.', 'error');
        }

        if (this.results.thermalCategory === 'Kritikus') {
            Utils.showMessage('A hőterhelés kritikus! Azonnali beavatkozás szükséges.', 'error');
        } else if (this.results.thermalCategory === 'Magas') {
            Utils.showMessage('A hőterhelés magas. Érdemes optimalizálni a rendszert.', 'warning');
        } else if (this.results.operatingTemperatureOK && this.results.shortCircuitTemperatureOK) {
            Utils.showMessage('A hőhatás megfelelő.', 'success');
        }
    }

    loadExample() {
        this.data = {
            cableType: 'XLPE',
            crossSection: 95,
            conductorMaterial: 'copper',
            insulationType: 'XLPE',
            ambientTemperature: 25,
            soilTemperature: 15,
            soilThermalResistivity: 1.0,
            installationDepth: 0.8,
            loadCurrent: 120,
            loadFactor: 0.8,
            operatingTime: 8,
            shortCircuitCurrent: 10000,
            shortCircuitDuration: 1,
            maxOperatingTemperature: 90,
            shortCircuitTemperature: 250
        };

        this.updateInputs();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    updateInputs() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'loadFactor') {
                    element.value = this.data[key] * 100;
                } else {
                    element.value = this.data[key];
                }
            }
        });
    }

    exportResults() {
        if (!this.results.operatingTemperature) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Üzemi hőmérséklet (°C)': this.results.operatingTemperature.toFixed(1),
                'Rövidzárlati hőmérséklet (°C)': this.results.finalShortCircuitTemperature.toFixed(1),
                'Vezető ellenállás (mΩ/m)': (this.results.conductorResistance * 1000).toFixed(3),
                'Hőterhelés kategória': this.results.thermalCategory,
                'Teljesítmény veszteség (W/m)': this.results.powerLoss.toFixed(2),
                'Hőellenállás (K·m/W)': this.results.thermalResistance.toFixed(3),
                'Rövidzárlati hőmérséklet emelkedés (°C)': this.results.shortCircuitTemperatureRise.toFixed(1),
                'Becsült élettartam (év)': this.results.estimatedLifespan,
                'Üzemi hőmérséklet megfelelőség': this.results.operatingTemperatureOK ? 'Megfelelő' : 'Nem megfelelő',
                'Rövidzárlati hőmérséklet megfelelőség': this.results.shortCircuitTemperatureOK ? 'Megfelelő' : 'Nem megfelelő'
            }
        ];

        Utils.exportToCSV(exportData, 'hohatas_szamitas.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.thermalModule = ThermalModule;

