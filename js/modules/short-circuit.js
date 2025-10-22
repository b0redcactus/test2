// ===== Rövidzárlati áram és hurokimpedancia modul =====
class ShortCircuitModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Rendszer adatok
            systemVoltage: 400, // V
            systemType: '3f', // '1f' vagy '3f'
            frequency: 50, // Hz
            
            // Transzformátor adatok
            transformerPower: 630, // kVA
            transformerVoltageHV: 20000, // V
            transformerVoltageLV: 400, // V
            transformerImpedance: 6, // %
            transformerResistance: 1.5, // %
            transformerReactance: 5.8, // %
            
            // Kábel adatok
            cableLength: 50, // m
            cableCrossSection: 95, // mm²
            cableType: 'XLPE',
            cableResistance: 0.193, // Ω/km
            cableReactance: 0.08, // Ω/km
            
            // Védelmi eszköz adatok
            protectionType: 'fuse',
            protectionRating: 160, // A
            protectionBreakingCapacity: 50, // kA
        };
        
        this.results = {};
    }

    async render(container) {
        this.loadData();
        
        container.innerHTML = `
            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">1</span>
                    Rendszer adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="systemVoltage">Rendszer feszültség (V)</label>
                        <input type="number" id="systemVoltage" class="form-input" value="${this.data.systemVoltage}" min="100" max="1000">
                        <div class="form-help">Alapértelmezett: 400V (alacsony feszültségű rendszer)</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="systemType">Rendszer típusa</label>
                        <select id="systemType" class="form-select">
                            <option value="1f" ${this.data.systemType === '1f' ? 'selected' : ''}>Egyfázisú</option>
                            <option value="3f" ${this.data.systemType === '3f' ? 'selected' : ''}>Háromfázisú</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="frequency">Frekvencia (Hz)</label>
                        <input type="number" id="frequency" class="form-input" value="${this.data.frequency}" min="50" max="60">
                        <div class="form-help">Magyarország: 50 Hz</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">2</span>
                    Transzformátor adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="transformerPower">Teljesítmény (kVA)</label>
                        <input type="number" id="transformerPower" class="form-input" value="${this.data.transformerPower}" min="10" max="10000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="transformerVoltageHV">Magasfeszültség (V)</label>
                        <input type="number" id="transformerVoltageHV" class="form-input" value="${this.data.transformerVoltageHV}" min="1000" max="100000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="transformerVoltageLV">Alacsonyfeszültség (V)</label>
                        <input type="number" id="transformerVoltageLV" class="form-input" value="${this.data.transformerVoltageLV}" min="100" max="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="transformerImpedance">Impedancia (%)</label>
                        <input type="number" id="transformerImpedance" class="form-input" value="${this.data.transformerImpedance}" min="1" max="20" step="0.1">
                        <div class="form-help">Jellemző értékek: 4-8%</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="transformerResistance">Ellenállás (%)</label>
                        <input type="number" id="transformerResistance" class="form-input" value="${this.data.transformerResistance}" min="0.1" max="10" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="transformerReactance">Reaktancia (%)</label>
                        <input type="number" id="transformerReactance" class="form-input" value="${this.data.transformerReactance}" min="0.1" max="20" step="0.1">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Kábel adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="cableLength">Kábel hossza (m)</label>
                        <input type="number" id="cableLength" class="form-input" value="${this.data.cableLength}" min="1" max="10000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="cableCrossSection">Keresztmetszet (mm²)</label>
                        <select id="cableCrossSection" class="form-select">
                            <option value="16" ${this.data.cableCrossSection === 16 ? 'selected' : ''}>16 mm²</option>
                            <option value="25" ${this.data.cableCrossSection === 25 ? 'selected' : ''}>25 mm²</option>
                            <option value="35" ${this.data.cableCrossSection === 35 ? 'selected' : ''}>35 mm²</option>
                            <option value="50" ${this.data.cableCrossSection === 50 ? 'selected' : ''}>50 mm²</option>
                            <option value="70" ${this.data.cableCrossSection === 70 ? 'selected' : ''}>70 mm²</option>
                            <option value="95" ${this.data.cableCrossSection === 95 ? 'selected' : ''}>95 mm²</option>
                            <option value="120" ${this.data.cableCrossSection === 120 ? 'selected' : ''}>120 mm²</option>
                            <option value="150" ${this.data.cableCrossSection === 150 ? 'selected' : ''}>150 mm²</option>
                            <option value="185" ${this.data.cableCrossSection === 185 ? 'selected' : ''}>185 mm²</option>
                            <option value="240" ${this.data.cableCrossSection === 240 ? 'selected' : ''}>240 mm²</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="cableType">Kábel típusa</label>
                        <select id="cableType" class="form-select">
                            <option value="XLPE" ${this.data.cableType === 'XLPE' ? 'selected' : ''}>XLPE</option>
                            <option value="PVC" ${this.data.cableType === 'PVC' ? 'selected' : ''}>PVC</option>
                            <option value="PE" ${this.data.cableType === 'PE' ? 'selected' : ''}>PE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="cableResistance">Ellenállás (Ω/km)</label>
                        <input type="number" id="cableResistance" class="form-input" value="${this.data.cableResistance}" min="0.01" max="10" step="0.001">
                        <div class="form-help">Automatikus számítás keresztmetszet alapján</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="cableReactance">Reaktancia (Ω/km)</label>
                        <input type="number" id="cableReactance" class="form-input" value="${this.data.cableReactance}" min="0.01" max="1" step="0.001">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">4</span>
                    Védelmi eszköz adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="protectionType">Védelmi eszköz típusa</label>
                        <select id="protectionType" class="form-select">
                            <option value="fuse" ${this.data.protectionType === 'fuse' ? 'selected' : ''}>Biztosíték</option>
                            <option value="mcb" ${this.data.protectionType === 'mcb' ? 'selected' : ''}>MCB</option>
                            <option value="mccb" ${this.data.protectionType === 'mccb' ? 'selected' : ''}>MCCB</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="protectionRating">Névleges áram (A)</label>
                        <input type="number" id="protectionRating" class="form-input" value="${this.data.protectionRating}" min="1" max="10000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="protectionBreakingCapacity">Kioldó képesség (kA)</label>
                        <input type="number" id="protectionBreakingCapacity" class="form-input" value="${this.data.protectionBreakingCapacity}" min="1" max="200">
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
                    <span>📊</span>
                    Számítási eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
        this.updateCableParameters();
    }

    setupEventListeners() {
        // Cable cross-section change
        document.getElementById('cableCrossSection').addEventListener('change', () => {
            this.updateCableParameters();
        });

        // Input change listeners
        const inputs = ['systemVoltage', 'systemType', 'frequency', 'transformerPower', 
                       'transformerVoltageHV', 'transformerVoltageLV', 'transformerImpedance',
                       'transformerResistance', 'transformerReactance', 'cableLength',
                       'cableCrossSection', 'cableType', 'cableResistance', 'cableReactance',
                       'protectionType', 'protectionRating', 'protectionBreakingCapacity'];

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
            systemVoltage: Number(document.getElementById('systemVoltage').value),
            systemType: document.getElementById('systemType').value,
            frequency: Number(document.getElementById('frequency').value),
            transformerPower: Number(document.getElementById('transformerPower').value),
            transformerVoltageHV: Number(document.getElementById('transformerVoltageHV').value),
            transformerVoltageLV: Number(document.getElementById('transformerVoltageLV').value),
            transformerImpedance: Number(document.getElementById('transformerImpedance').value),
            transformerResistance: Number(document.getElementById('transformerResistance').value),
            transformerReactance: Number(document.getElementById('transformerReactance').value),
            cableLength: Number(document.getElementById('cableLength').value),
            cableCrossSection: Number(document.getElementById('cableCrossSection').value),
            cableType: document.getElementById('cableType').value,
            cableResistance: Number(document.getElementById('cableResistance').value),
            cableReactance: Number(document.getElementById('cableReactance').value),
            protectionType: document.getElementById('protectionType').value,
            protectionRating: Number(document.getElementById('protectionRating').value),
            protectionBreakingCapacity: Number(document.getElementById('protectionBreakingCapacity').value)
        };
    }

    updateCableParameters() {
        const crossSection = Number(document.getElementById('cableCrossSection').value);
        const cableType = document.getElementById('cableType').value;
        
        // Cable resistance values (Ω/km) for different cross-sections
        const resistanceValues = {
            16: 1.15, 25: 0.727, 35: 0.524, 50: 0.387, 70: 0.268,
            95: 0.193, 120: 0.153, 150: 0.124, 185: 0.0991, 240: 0.0754
        };

        const reactanceValues = {
            'XLPE': 0.08, 'PVC': 0.08, 'PE': 0.08
        };

        if (resistanceValues[crossSection]) {
            document.getElementById('cableResistance').value = resistanceValues[crossSection];
        }
        
        if (reactanceValues[cableType]) {
            document.getElementById('cableReactance').value = reactanceValues[cableType];
        }
    }

    calculate() {
        this.updateData();
        
        try {
            // Transzformátor impedancia számítás
            const transformerBaseImpedance = (this.data.transformerVoltageLV ** 2) / (this.data.transformerPower * 1000);
            const transformerImpedanceOhm = (transformerBaseImpedance * this.data.transformerImpedance) / 100;
            const transformerResistanceOhm = (transformerBaseImpedance * this.data.transformerResistance) / 100;
            const transformerReactanceOhm = (transformerBaseImpedance * this.data.transformerReactance) / 100;

            // Kábel impedancia számítás
            const cableResistanceOhm = (this.data.cableResistance * this.data.cableLength) / 1000;
            const cableReactanceOhm = (this.data.cableReactance * this.data.cableLength) / 1000;

            // Összes impedancia
            const totalResistance = transformerResistanceOhm + cableResistanceOhm;
            const totalReactance = transformerReactanceOhm + cableReactanceOhm;
            const totalImpedance = Math.sqrt(totalResistance ** 2 + totalReactance ** 2);

            // Rövidzárlati áram számítás
            let shortCircuitCurrent;
            if (this.data.systemType === '3f') {
                shortCircuitCurrent = this.data.systemVoltage / (Math.sqrt(3) * totalImpedance);
            } else {
                shortCircuitCurrent = this.data.systemVoltage / (2 * totalImpedance);
            }

            // Hurokimpedancia
            const loopImpedance = totalImpedance;

            // Védelem ellenőrzés
            const protectionAdequate = shortCircuitCurrent >= (this.data.protectionRating * 1.3);
            const breakingCapacityAdequate = shortCircuitCurrent <= (this.data.protectionBreakingCapacity * 1000);

            this.results = {
                transformerBaseImpedance,
                transformerImpedanceOhm,
                transformerResistanceOhm,
                transformerReactanceOhm,
                cableResistanceOhm,
                cableReactanceOhm,
                totalResistance,
                totalReactance,
                totalImpedance,
                shortCircuitCurrent,
                loopImpedance,
                protectionAdequate,
                breakingCapacityAdequate
            };

            this.displayResults();

        } catch (error) {
            Utils.showMessage('Hiba történt a számítás során: ' + error.message, 'error');
        }
    }

    displayResults() {
        const resultsSection = document.getElementById('results-section');
        const resultsContent = document.getElementById('results-content');

        resultsSection.style.display = 'block';

        resultsContent.innerHTML = `
            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label">Rövidzárlati áram</div>
                    <div class="result-value">${Utils.formatNumber(this.results.shortCircuitCurrent, 1)}<span class="result-unit">A</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Hurokimpedancia</div>
                    <div class="result-value">${Utils.formatNumber(this.results.loopImpedance, 3)}<span class="result-unit">Ω</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Összes ellenállás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.totalResistance, 3)}<span class="result-unit">Ω</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Összes reaktancia</div>
                    <div class="result-value">${Utils.formatNumber(this.results.totalReactance, 3)}<span class="result-unit">Ω</span></div>
                </div>
            </div>

            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Komponens</th>
                            <th>Ellenállás (Ω)</th>
                            <th>Reaktancia (Ω)</th>
                            <th>Impedancia (Ω)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Transzformátor</td>
                            <td>${Utils.formatNumber(this.results.transformerResistanceOhm, 3)}</td>
                            <td>${Utils.formatNumber(this.results.transformerReactanceOhm, 3)}</td>
                            <td>${Utils.formatNumber(this.results.transformerImpedanceOhm, 3)}</td>
                        </tr>
                        <tr>
                            <td>Kábel</td>
                            <td>${Utils.formatNumber(this.results.cableResistanceOhm, 3)}</td>
                            <td>${Utils.formatNumber(this.results.cableReactanceOhm, 3)}</td>
                            <td>${Utils.formatNumber(Math.sqrt(this.results.cableResistanceOhm**2 + this.results.cableReactanceOhm**2), 3)}</td>
                        </tr>
                        <tr style="font-weight: bold; background-color: var(--bg-tertiary);">
                            <td>Összesen</td>
                            <td>${Utils.formatNumber(this.results.totalResistance, 3)}</td>
                            <td>${Utils.formatNumber(this.results.totalReactance, 3)}</td>
                            <td>${Utils.formatNumber(this.results.totalImpedance, 3)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="form-section">
                <h3>Védelem ellenőrzés</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Védelem megfelelősége</div>
                        <div class="result-value" style="color: ${this.results.protectionAdequate ? 'var(--success)' : 'var(--error)'}">
                            ${this.results.protectionAdequate ? '✅ Megfelelő' : '❌ Nem megfelelő'}
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Kioldó képesség</div>
                        <div class="result-value" style="color: ${this.results.breakingCapacityAdequate ? 'var(--success)' : 'var(--error)'}">
                            ${this.results.breakingCapacityAdequate ? '✅ Megfelelő' : '❌ Nem megfelelő'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Status messages
        if (!this.results.protectionAdequate) {
            Utils.showMessage('A számított rövidzárlati áram alacsony lehet a biztos kioldáshoz. Ellenőrizze a védelem beállításait.', 'warning');
        }

        if (!this.results.breakingCapacityAdequate) {
            Utils.showMessage('A védelmi eszköz kioldó képessége nem megfelelő a számított rövidzárlati áramhoz.', 'error');
        }

        if (this.results.protectionAdequate && this.results.breakingCapacityAdequate) {
            Utils.showMessage('A kiválasztott védelmi eszköz megfelel a feltételeknek.', 'success');
        }
    }

    loadExample() {
        this.data = {
            systemVoltage: 400,
            systemType: '3f',
            frequency: 50,
            transformerPower: 630,
            transformerVoltageHV: 20000,
            transformerVoltageLV: 400,
            transformerImpedance: 6,
            transformerResistance: 1.5,
            transformerReactance: 5.8,
            cableLength: 50,
            cableCrossSection: 95,
            cableType: 'XLPE',
            cableResistance: 0.193,
            cableReactance: 0.08,
            protectionType: 'mcb',
            protectionRating: 160,
            protectionBreakingCapacity: 50
        };

        this.updateInputs();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    updateInputs() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'number') {
                    element.value = this.data[key];
                } else {
                    element.value = this.data[key];
                }
            }
        });
        this.updateCableParameters();
    }

    exportResults() {
        if (!this.results.shortCircuitCurrent) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = {
            'Rövidzárlati áram (A)': this.results.shortCircuitCurrent.toFixed(1),
            'Hurokimpedancia (Ω)': this.results.loopImpedance.toFixed(3),
            'Összes ellenállás (Ω)': this.results.totalResistance.toFixed(3),
            'Összes reaktancia (Ω)': this.results.totalReactance.toFixed(3),
            'Transzformátor ellenállás (Ω)': this.results.transformerResistanceOhm.toFixed(3),
            'Transzformátor reaktancia (Ω)': this.results.transformerReactanceOhm.toFixed(3),
            'Kábel ellenállás (Ω)': this.results.cableResistanceOhm.toFixed(3),
            'Kábel reaktancia (Ω)': this.results.cableReactanceOhm.toFixed(3),
            'Védelem megfelelősége': this.results.protectionAdequate ? 'Megfelelő' : 'Nem megfelelő',
            'Kioldó képesség': this.results.breakingCapacityAdequate ? 'Megfelelő' : 'Nem megfelelő'
        };

        Utils.exportToCSV([exportData], 'rovidzarlati_aram.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.shortCircuitModule = ShortCircuitModule;

