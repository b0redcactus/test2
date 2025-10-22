// ===== Akkumulátor kapacitás és üzemidő modul =====
class BatteryModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Rendszer adatok
            systemType: 'ups', // 'ups', 'offgrid', 'backup'
            voltage: 48, // V
            batteryType: 'lead-acid', // 'lead-acid', 'lithium', 'gel'
            
            // Terhelés adatok
            loadPower: 1000, // W
            loadVoltage: 230, // V
            runtime: 2, // hours
            efficiency: 0.9, // 90%
            
            // Akkumulátor adatok
            batteryCapacity: 100, // Ah
            batteryVoltage: 12, // V
            batteryCount: 4, // db
            depthOfDischarge: 0.8, // 80%
            temperature: 25, // °C
            
            // Költség adatok
            batteryCost: 50000, // Ft/db
            inverterCost: 100000, // Ft
            installationCost: 50000, // Ft
            maintenanceCost: 0.02, // 2% évente
        };
        
        this.results = {};
    }

    async render(container) {
        this.loadData();
        
        container.innerHTML = `
            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">1</span>
                    Rendszer típusa
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="systemType">Rendszer típusa</label>
                        <select id="systemType" class="form-select">
                            <option value="ups" ${this.data.systemType === 'ups' ? 'selected' : ''}>UPS (Szünetmentes tápegység)</option>
                            <option value="offgrid" ${this.data.systemType === 'offgrid' ? 'selected' : ''}>Off-grid (Hálózattól független)</option>
                            <option value="backup" ${this.data.systemType === 'backup' ? 'selected' : ''}>Backup (Tartalék energia)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="voltage">Rendszer feszültség (V)</label>
                        <select id="voltage" class="form-select">
                            <option value="12" ${this.data.voltage === 12 ? 'selected' : ''}>12 V</option>
                            <option value="24" ${this.data.voltage === 24 ? 'selected' : ''}>24 V</option>
                            <option value="48" ${this.data.voltage === 48 ? 'selected' : ''}>48 V</option>
                            <option value="96" ${this.data.voltage === 96 ? 'selected' : ''}>96 V</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="batteryType">Akkumulátor típusa</label>
                        <select id="batteryType" class="form-select">
                            <option value="lead-acid" ${this.data.batteryType === 'lead-acid' ? 'selected' : ''}>Ólom-sav</option>
                            <option value="lithium" ${this.data.batteryType === 'lithium' ? 'selected' : ''}>Lítium-ion</option>
                            <option value="gel" ${this.data.batteryType === 'gel' ? 'selected' : ''}>Gél</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">2</span>
                    Terhelés adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="loadPower">Terhelés teljesítménye (W)</label>
                        <input type="number" id="loadPower" class="form-input" value="${this.data.loadPower}" min="1" max="100000" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loadVoltage">Terhelés feszültsége (V)</label>
                        <input type="number" id="loadVoltage" class="form-input" value="${this.data.loadVoltage}" min="12" max="400" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="runtime">Szükséges üzemidő (óra)</label>
                        <input type="number" id="runtime" class="form-input" value="${this.data.runtime}" min="0.1" max="24" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="efficiency">Rendszer hatásfoka</label>
                        <input type="number" id="efficiency" class="form-input" value="${this.data.efficiency * 100}" min="50" max="100" step="1">
                        <div class="form-help">Jellemző értékek: UPS 85-95%, Off-grid 80-90%</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Akkumulátor adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="batteryCapacity">Akkumulátor kapacitás (Ah)</label>
                        <input type="number" id="batteryCapacity" class="form-input" value="${this.data.batteryCapacity}" min="1" max="10000" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="batteryVoltage">Akkumulátor feszültség (V)</label>
                        <input type="number" id="batteryVoltage" class="form-input" value="${this.data.batteryVoltage}" min="6" max="48" step="6">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="batteryCount">Akkumulátorok száma</label>
                        <input type="number" id="batteryCount" class="form-input" value="${this.data.batteryCount}" min="1" max="100" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="depthOfDischarge">Kisütési mélység</label>
                        <input type="number" id="depthOfDischarge" class="form-input" value="${this.data.depthOfDischarge * 100}" min="20" max="100" step="1">
                        <div class="form-help">Ólom-sav: 50-80%, Lítium: 80-95%</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="temperature">Hőmérséklet (°C)</label>
                        <input type="number" id="temperature" class="form-input" value="${this.data.temperature}" min="-20" max="60" step="1">
                        <div class="form-help">Optimum: 20-25°C</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">4</span>
                    Költség adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="batteryCost">Akkumulátor költség (Ft/db)</label>
                        <input type="number" id="batteryCost" class="form-input" value="${this.data.batteryCost}" min="1000" max="1000000" step="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="inverterCost">Inverter költség (Ft)</label>
                        <input type="number" id="inverterCost" class="form-input" value="${this.data.inverterCost}" min="10000" max="5000000" step="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="installationCost">Telepítési költség (Ft)</label>
                        <input type="number" id="installationCost" class="form-input" value="${this.data.installationCost}" min="0" max="1000000" step="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="maintenanceCost">Karbantartási költség (%)</label>
                        <input type="number" id="maintenanceCost" class="form-input" value="${this.data.maintenanceCost * 100}" min="0" max="10" step="0.1">
                        <div class="form-help">Éves karbantartási költség százaléka</div>
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
                    <span>🔋</span>
                    Akkumulátor eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto-calculation listeners
        ['loadPower', 'runtime', 'efficiency'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.calculateRequiredCapacity();
                });
            }
        });

        // All input listeners
        const inputs = ['systemType', 'voltage', 'batteryType', 'loadPower', 'loadVoltage', 'runtime', 'efficiency',
                       'batteryCapacity', 'batteryVoltage', 'batteryCount', 'depthOfDischarge', 'temperature',
                       'batteryCost', 'inverterCost', 'installationCost', 'maintenanceCost'];

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
            systemType: document.getElementById('systemType').value,
            voltage: Number(document.getElementById('voltage').value),
            batteryType: document.getElementById('batteryType').value,
            loadPower: Number(document.getElementById('loadPower').value),
            loadVoltage: Number(document.getElementById('loadVoltage').value),
            runtime: Number(document.getElementById('runtime').value),
            efficiency: Number(document.getElementById('efficiency').value) / 100,
            batteryCapacity: Number(document.getElementById('batteryCapacity').value),
            batteryVoltage: Number(document.getElementById('batteryVoltage').value),
            batteryCount: Number(document.getElementById('batteryCount').value),
            depthOfDischarge: Number(document.getElementById('depthOfDischarge').value) / 100,
            temperature: Number(document.getElementById('temperature').value),
            batteryCost: Number(document.getElementById('batteryCost').value),
            inverterCost: Number(document.getElementById('inverterCost').value),
            installationCost: Number(document.getElementById('installationCost').value),
            maintenanceCost: Number(document.getElementById('maintenanceCost').value) / 100
        };
    }

    calculateRequiredCapacity() {
        const loadPower = Number(document.getElementById('loadPower').value);
        const runtime = Number(document.getElementById('runtime').value);
        const efficiency = Number(document.getElementById('efficiency').value) / 100;
        const voltage = Number(document.getElementById('voltage').value);
        
        if (loadPower > 0 && runtime > 0 && efficiency > 0 && voltage > 0) {
            const requiredCapacity = (loadPower * runtime) / (voltage * efficiency);
            document.getElementById('batteryCapacity').value = Math.ceil(requiredCapacity);
        }
    }

    calculate() {
        this.updateData();
        
        try {
            // Hőmérséklet korrekció
            const temperatureFactor = this.getTemperatureFactor(this.data.batteryType, this.data.temperature);
            
            // Akkumulátor kapacitás számítás
            const totalBatteryCapacity = this.data.batteryCapacity * this.data.batteryCount;
            const usableCapacity = totalBatteryCapacity * this.data.depthOfDischarge * temperatureFactor;
            const totalBatteryEnergy = usableCapacity * this.data.voltage; // Wh
            
            // Terhelés energiaigénye
            const loadEnergy = this.data.loadPower * this.data.runtime; // Wh
            const requiredBatteryEnergy = loadEnergy / this.data.efficiency; // Wh
            
            // Tényleges üzemidő számítás
            const actualRuntime = (totalBatteryEnergy * this.data.efficiency) / this.data.loadPower;
            
            // Akkumulátor kihasználtság
            const batteryUtilization = (requiredBatteryEnergy / totalBatteryEnergy) * 100;
            
            // Költség számítás
            const totalBatteryCost = this.data.batteryCount * this.data.batteryCost;
            const totalSystemCost = totalBatteryCost + this.data.inverterCost + this.data.installationCost;
            const annualMaintenanceCost = totalSystemCost * this.data.maintenanceCost;
            
            // Energia sűrűség
            const energyDensity = totalBatteryEnergy / (this.data.batteryCount * this.data.batteryCapacity);
            
            // Élettartam becslés
            const estimatedLifespan = this.getBatteryLifespan(this.data.batteryType, this.data.depthOfDischarge);

            this.results = {
                totalBatteryCapacity,
                usableCapacity,
                totalBatteryEnergy,
                loadEnergy,
                requiredBatteryEnergy,
                actualRuntime,
                batteryUtilization,
                totalBatteryCost,
                totalSystemCost,
                annualMaintenanceCost,
                energyDensity,
                estimatedLifespan,
                temperatureFactor,
                systemAdequate: actualRuntime >= this.data.runtime
            };

            this.displayResults();

        } catch (error) {
            Utils.showMessage('Hiba történt a számítás során: ' + error.message, 'error');
        }
    }

    getTemperatureFactor(batteryType, temperature) {
        if (batteryType === 'lithium') {
            if (temperature < 0) return 0.7;
            if (temperature < 10) return 0.9;
            if (temperature > 45) return 0.8;
            return 1.0;
        } else { // lead-acid, gel
            if (temperature < 0) return 0.5;
            if (temperature < 10) return 0.8;
            if (temperature > 40) return 0.9;
            return 1.0;
        }
    }

    getBatteryLifespan(batteryType, depthOfDischarge) {
        if (batteryType === 'lithium') {
            if (depthOfDischarge <= 0.5) return 10;
            if (depthOfDischarge <= 0.8) return 8;
            return 6;
        } else { // lead-acid, gel
            if (depthOfDischarge <= 0.3) return 8;
            if (depthOfDischarge <= 0.5) return 6;
            if (depthOfDischarge <= 0.8) return 4;
            return 2;
        }
    }

    displayResults() {
        const resultsSection = document.getElementById('results-section');
        const resultsContent = document.getElementById('results-content');

        resultsSection.style.display = 'block';

        resultsContent.innerHTML = `
            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label">Összes akkumulátor kapacitás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.totalBatteryCapacity, 0)}<span class="result-unit">Ah</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Hasznos kapacitás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.usableCapacity, 0)}<span class="result-unit">Ah</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Összes energia</div>
                    <div class="result-value">${Utils.formatNumber(this.results.totalBatteryEnergy, 0)}<span class="result-unit">Wh</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Tényleges üzemidő</div>
                    <div class="result-value" style="color: ${this.results.systemAdequate ? 'var(--success)' : 'var(--error)'}">
                        ${Utils.formatNumber(this.results.actualRuntime, 1)}<span class="result-unit">h</span>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Rendszer elemzés</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Akkumulátor kihasználtság</div>
                        <div class="result-value">${Utils.formatNumber(this.results.batteryUtilization, 1)}<span class="result-unit">%</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Hőmérséklet korrekció</div>
                        <div class="result-value">${Utils.formatNumber(this.results.temperatureFactor, 2)}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Energia sűrűség</div>
                        <div class="result-value">${Utils.formatNumber(this.results.energyDensity, 1)}<span class="result-unit">Wh/Ah</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Becsült élettartam</div>
                        <div class="result-value">${Utils.formatNumber(this.results.estimatedLifespan, 0)}<span class="result-unit">év</span></div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Költség elemzés</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Akkumulátor költség</div>
                        <div class="result-value">${Utils.formatNumber(this.results.totalBatteryCost, 0)}<span class="result-unit">Ft</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Összes rendszer költség</div>
                        <div class="result-value">${Utils.formatNumber(this.results.totalSystemCost, 0)}<span class="result-unit">Ft</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Éves karbantartás</div>
                        <div class="result-value">${Utils.formatNumber(this.results.annualMaintenanceCost, 0)}<span class="result-unit">Ft</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Költség/Wh</div>
                        <div class="result-value">${Utils.formatNumber(this.results.totalSystemCost / this.results.totalBatteryEnergy, 2)}<span class="result-unit">Ft/Wh</span></div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Rendszer megfelelőség</h3>
                <div class="status-message ${this.results.systemAdequate ? 'status-success' : 'status-error'}">
                    <span>${this.results.systemAdequate ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.systemAdequate ? 
                            `A rendszer megfelelő. Tényleges üzemidő: ${this.results.actualRuntime.toFixed(1)} óra` : 
                            `A rendszer nem megfelelő. Szükséges: ${this.data.runtime} óra, elérhető: ${this.results.actualRuntime.toFixed(1)} óra`
                        }
                    </span>
                </div>
            </div>
        `;

        // Status messages
        if (!this.results.systemAdequate) {
            Utils.showMessage('A rendszer nem biztosítja a szükséges üzemidőt. Növelje az akkumulátor kapacitását!', 'error');
        } else if (this.results.batteryUtilization > 90) {
            Utils.showMessage('Az akkumulátor kihasználtsága magas. Érdemes lehet nagyobb kapacitást választani.', 'warning');
        } else {
            Utils.showMessage('A rendszer megfelelő és optimálisan méretezett.', 'success');
        }
    }

    loadExample() {
        this.data = {
            systemType: 'ups',
            voltage: 48,
            batteryType: 'lead-acid',
            loadPower: 2000,
            loadVoltage: 230,
            runtime: 4,
            efficiency: 0.9,
            batteryCapacity: 100,
            batteryVoltage: 12,
            batteryCount: 4,
            depthOfDischarge: 0.8,
            temperature: 25,
            batteryCost: 50000,
            inverterCost: 150000,
            installationCost: 75000,
            maintenanceCost: 0.02
        };

        this.updateInputs();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    updateInputs() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'efficiency' || key === 'depthOfDischarge' || key === 'maintenanceCost') {
                    element.value = this.data[key] * 100;
                } else {
                    element.value = this.data[key];
                }
            }
        });
    }

    exportResults() {
        if (!this.results.totalBatteryCapacity) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Összes akkumulátor kapacitás (Ah)': this.results.totalBatteryCapacity,
                'Hasznos kapacitás (Ah)': this.results.usableCapacity,
                'Összes energia (Wh)': this.results.totalBatteryEnergy,
                'Tényleges üzemidő (h)': this.results.actualRuntime.toFixed(1),
                'Akkumulátor kihasználtság (%)': this.results.batteryUtilization.toFixed(1),
                'Hőmérséklet korrekció': this.results.temperatureFactor.toFixed(2),
                'Energia sűrűség (Wh/Ah)': this.results.energyDensity.toFixed(1),
                'Becsült élettartam (év)': this.results.estimatedLifespan,
                'Akkumulátor költség (Ft)': this.results.totalBatteryCost,
                'Összes rendszer költség (Ft)': this.results.totalSystemCost,
                'Éves karbantartás (Ft)': this.results.annualMaintenanceCost,
                'Költség/Wh (Ft/Wh)': (this.results.totalSystemCost / this.results.totalBatteryEnergy).toFixed(2),
                'Rendszer megfelelőség': this.results.systemAdequate ? 'Megfelelő' : 'Nem megfelelő'
            }
        ];

        Utils.exportToCSV(exportData, 'akkumulator_szamitas.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.batteryModule = BatteryModule;

