// ===== Feszültségesés számítás modul =====
export default class VoltageDropModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            systemType: '3f', // '1f' vagy '3f'
            systemVoltage: 400, // V
            powerFactor: 0.8,
            sections: [
                {
                    id: 1,
                    name: 'Szakasz 1',
                    length: 50, // m
                    crossSection: 95, // mm²
                    cableType: 'XLPE',
                    current: 100, // A
                    resistance: 0.193, // Ω/km
                    reactance: 0.08, // Ω/km
                    enabled: true
                }
            ]
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
                        <label class="form-label" for="systemType">Rendszer típusa</label>
                        <select id="systemType" class="form-select">
                            <option value="1f" ${this.data.systemType === '1f' ? 'selected' : ''}>Egyfázisú</option>
                            <option value="3f" ${this.data.systemType === '3f' ? 'selected' : ''}>Háromfázisú</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="systemVoltage">Rendszer feszültség (V)</label>
                        <input type="number" id="systemVoltage" class="form-input" value="${this.data.systemVoltage}" min="100" max="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="powerFactor">Teljesítménytényező</label>
                        <select id="powerFactor" class="form-select">
                            <option value="0.8" ${this.data.powerFactor === 0.8 ? 'selected' : ''}>0.8 (induktív)</option>
                            <option value="0.9" ${this.data.powerFactor === 0.9 ? 'selected' : ''}>0.9</option>
                            <option value="1.0" ${this.data.powerFactor === 1.0 ? 'selected' : ''}>1.0 (tiszta ohmos)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">2</span>
                    Kábel szakaszok
                    <button class="btn btn-secondary btn-sm" onclick="window.currentModule.addSection()" style="margin-left: auto;">
                        + Új szakasz
                    </button>
                </h2>
                <div id="sections-container">
                    ${this.renderSections()}
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
                    Feszültségesés eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    renderSections() {
        return this.data.sections.map((section, index) => `
            <div class="section-item" data-section-id="${section.id}">
                <div class="section-header">
                    <h3>Szakasz ${section.id}: ${section.name}</h3>
                    <div class="section-controls">
                        <label class="checkbox-label">
                            <input type="checkbox" ${section.enabled ? 'checked' : ''} onchange="window.currentModule.toggleSection(${section.id})">
                            Aktív
                        </label>
                        ${this.data.sections.length > 1 ? `<button class="btn btn-error btn-sm" onclick="window.currentModule.removeSection(${section.id})">Törlés</button>` : ''}
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Szakasz neve</label>
                        <input type="text" class="form-input" value="${section.name}" onchange="window.currentModule.updateSectionName(${section.id}, this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Hossz (m)</label>
                        <input type="number" class="form-input" value="${section.length}" min="1" max="10000" onchange="window.currentModule.updateSection(${section.id}, 'length', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Keresztmetszet (mm²)</label>
                        <select class="form-select" onchange="window.currentModule.updateSection(${section.id}, 'crossSection', this.value)">
                            <option value="16" ${section.crossSection === 16 ? 'selected' : ''}>16 mm²</option>
                            <option value="25" ${section.crossSection === 25 ? 'selected' : ''}>25 mm²</option>
                            <option value="35" ${section.crossSection === 35 ? 'selected' : ''}>35 mm²</option>
                            <option value="50" ${section.crossSection === 50 ? 'selected' : ''}>50 mm²</option>
                            <option value="70" ${section.crossSection === 70 ? 'selected' : ''}>70 mm²</option>
                            <option value="95" ${section.crossSection === 95 ? 'selected' : ''}>95 mm²</option>
                            <option value="120" ${section.crossSection === 120 ? 'selected' : ''}>120 mm²</option>
                            <option value="150" ${section.crossSection === 150 ? 'selected' : ''}>150 mm²</option>
                            <option value="185" ${section.crossSection === 185 ? 'selected' : ''}>185 mm²</option>
                            <option value="240" ${section.crossSection === 240 ? 'selected' : ''}>240 mm²</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kábel típusa</label>
                        <select class="form-select" onchange="window.currentModule.updateSection(${section.id}, 'cableType', this.value)">
                            <option value="XLPE" ${section.cableType === 'XLPE' ? 'selected' : ''}>XLPE</option>
                            <option value="PVC" ${section.cableType === 'PVC' ? 'selected' : ''}>PVC</option>
                            <option value="PE" ${section.cableType === 'PE' ? 'selected' : ''}>PE</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Áram (A)</label>
                        <input type="number" class="form-input" value="${section.current}" min="0.1" max="10000" step="0.1" onchange="window.currentModule.updateSection(${section.id}, 'current', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ellenállás (Ω/km)</label>
                        <input type="number" class="form-input" value="${section.resistance}" min="0.001" max="10" step="0.001" onchange="window.currentModule.updateSection(${section.id}, 'resistance', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Reaktancia (Ω/km)</label>
                        <input type="number" class="form-input" value="${section.reactance}" min="0.001" max="1" step="0.001" onchange="window.currentModule.updateSection(${section.id}, 'reactance', this.value)">
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // System data listeners
        ['systemType', 'systemVoltage', 'powerFactor'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateSystemData();
                });
            }
        });
    }

    updateSystemData() {
        this.data.systemType = document.getElementById('systemType').value;
        this.data.systemVoltage = Number(document.getElementById('systemVoltage').value);
        this.data.powerFactor = Number(document.getElementById('powerFactor').value);
    }

    addSection() {
        const newId = Math.max(...this.data.sections.map(s => s.id)) + 1;
        const newSection = {
            id: newId,
            name: `Szakasz ${newId}`,
            length: 50,
            crossSection: 95,
            cableType: 'XLPE',
            current: 50,
            resistance: 0.193,
            reactance: 0.08,
            enabled: true
        };
        
        this.data.sections.push(newSection);
        this.renderSectionsContainer();
    }

    removeSection(sectionId) {
        if (this.data.sections.length > 1) {
            this.data.sections = this.data.sections.filter(s => s.id !== sectionId);
            this.renderSectionsContainer();
        }
    }

    toggleSection(sectionId) {
        const section = this.data.sections.find(s => s.id === sectionId);
        if (section) {
            section.enabled = !section.enabled;
        }
    }

    updateSectionName(sectionId, name) {
        const section = this.data.sections.find(s => s.id === sectionId);
        if (section) {
            section.name = name;
        }
    }

    updateSection(sectionId, field, value) {
        const section = this.data.sections.find(s => s.id === sectionId);
        if (section) {
            section[field] = field === 'length' || field === 'current' || field === 'resistance' || field === 'reactance' ? Number(value) : value;
            
            // Update cable parameters if cross-section or type changed
            if (field === 'crossSection' || field === 'cableType') {
                this.updateCableParameters(section);
            }
        }
    }

    updateCableParameters(section) {
        const resistanceValues = {
            16: 1.15, 25: 0.727, 35: 0.524, 50: 0.387, 70: 0.268,
            95: 0.193, 120: 0.153, 150: 0.124, 185: 0.0991, 240: 0.0754
        };

        const reactanceValues = {
            'XLPE': 0.08, 'PVC': 0.08, 'PE': 0.08
        };

        if (resistanceValues[section.crossSection]) {
            section.resistance = resistanceValues[section.crossSection];
        }
        
        if (reactanceValues[section.cableType]) {
            section.reactance = reactanceValues[section.cableType];
        }
    }

    renderSectionsContainer() {
        document.getElementById('sections-container').innerHTML = this.renderSections();
    }

    calculate() {
        this.updateSystemData();
        
        try {
            const enabledSections = this.data.sections.filter(s => s.enabled);
            if (enabledSections.length === 0) {
                Utils.showMessage('Legalább egy szakaszt aktiváljon!', 'warning');
                return;
            }

            let totalVoltageDrop = 0;
            let totalLength = 0;
            const sectionResults = [];

            enabledSections.forEach(section => {
                // Kábel impedancia számítás
                const resistance = (section.resistance * section.length) / 1000; // Ω
                const reactance = (section.reactance * section.length) / 1000; // Ω

                // Feszültségesés számítás
                const cosPhi = this.data.powerFactor;
                const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
                
                let voltageDrop;
                if (this.data.systemType === '3f') {
                    // Háromfázisú: ΔU = √3 × I × L × (R × cosφ + X × sinφ)
                    voltageDrop = Math.sqrt(3) * section.current * (resistance * cosPhi + reactance * sinPhi);
                } else {
                    // Egyfázisú: ΔU = 2 × I × L × (R × cosφ + X × sinφ)
                    voltageDrop = 2 * section.current * (resistance * cosPhi + reactance * sinPhi);
                }

                const voltageDropPercentage = (voltageDrop / this.data.systemVoltage) * 100;
                
                sectionResults.push({
                    name: section.name,
                    length: section.length,
                    current: section.current,
                    resistance: resistance,
                    reactance: reactance,
                    voltageDrop: voltageDrop,
                    voltageDropPercentage: voltageDropPercentage
                });

                totalVoltageDrop += voltageDrop;
                totalLength += section.length;
            });

            const totalVoltageDropPercentage = (totalVoltageDrop / this.data.systemVoltage) * 100;

            this.results = {
                sectionResults,
                totalVoltageDrop,
                totalVoltageDropPercentage,
                totalLength,
                systemVoltage: this.data.systemVoltage,
                systemType: this.data.systemType,
                powerFactor: this.data.powerFactor
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
                    <div class="result-label">Összes feszültségesés</div>
                    <div class="result-value">${Utils.formatNumber(this.results.totalVoltageDrop, 1)}<span class="result-unit">V</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Feszültségesés százalék</div>
                    <div class="result-value" style="color: ${this.results.totalVoltageDropPercentage <= 5 ? 'var(--success)' : this.results.totalVoltageDropPercentage <= 10 ? 'var(--warning)' : 'var(--error)'}">
                        ${Utils.formatNumber(this.results.totalVoltageDropPercentage, 2)}<span class="result-unit">%</span>
                    </div>
                </div>
                <div class="result-item">
                    <div class="result-label">Összes hossz</div>
                    <div class="result-value">${Utils.formatNumber(this.results.totalLength, 0)}<span class="result-unit">m</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Rendszer feszültség</div>
                    <div class="result-value">${Utils.formatNumber(this.results.systemVoltage, 0)}<span class="result-unit">V</span></div>
                </div>
            </div>

            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Szakasz</th>
                            <th>Hossz (m)</th>
                            <th>Áram (A)</th>
                            <th>Ellenállás (Ω)</th>
                            <th>Reaktancia (Ω)</th>
                            <th>Feszültségesés (V)</th>
                            <th>Feszültségesés (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.results.sectionResults.map(section => `
                            <tr>
                                <td>${section.name}</td>
                                <td>${Utils.formatNumber(section.length, 0)}</td>
                                <td>${Utils.formatNumber(section.current, 1)}</td>
                                <td>${Utils.formatNumber(section.resistance, 3)}</td>
                                <td>${Utils.formatNumber(section.reactance, 3)}</td>
                                <td>${Utils.formatNumber(section.voltageDrop, 1)}</td>
                                <td style="color: ${section.voltageDropPercentage <= 5 ? 'var(--success)' : section.voltageDropPercentage <= 10 ? 'var(--warning)' : 'var(--error)'}">
                                    ${Utils.formatNumber(section.voltageDropPercentage, 2)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="form-section">
                <h3>Feszültségesés értékelés</h3>
                <div class="status-message ${this.results.totalVoltageDropPercentage <= 5 ? 'status-success' : this.results.totalVoltageDropPercentage <= 10 ? 'status-warning' : 'status-error'}">
                    <span>${this.results.totalVoltageDropPercentage <= 5 ? '✅' : this.results.totalVoltageDropPercentage <= 10 ? '⚠️' : '❌'}</span>
                    <span>
                        ${this.results.totalVoltageDropPercentage <= 5 ? 
                            'A feszültségesés megfelelő (≤5%)' : 
                            this.results.totalVoltageDropPercentage <= 10 ? 
                            'A feszültségesés elfogadható (5-10%)' : 
                            'A feszültségesés túl magas (>10%) - növelje a kábel keresztmetszetét'
                        }
                    </span>
                </div>
            </div>
        `;

        // Status messages
        if (this.results.totalVoltageDropPercentage > 10) {
            Utils.showMessage('A feszültségesés túl magas! Javasolt a kábel keresztmetszetének növelése.', 'error');
        } else if (this.results.totalVoltageDropPercentage > 5) {
            Utils.showMessage('A feszültségesés elfogadható, de érdemes lehet optimalizálni.', 'warning');
        } else {
            Utils.showMessage('A feszültségesés megfelelő.', 'success');
        }
    }

    loadExample() {
        this.data = {
            systemType: '3f',
            systemVoltage: 400,
            powerFactor: 0.8,
            sections: [
                {
                    id: 1,
                    name: 'Főkábel',
                    length: 100,
                    crossSection: 95,
                    cableType: 'XLPE',
                    current: 120,
                    resistance: 0.193,
                    reactance: 0.08,
                    enabled: true
                },
                {
                    id: 2,
                    name: 'Elágazó kábel',
                    length: 50,
                    crossSection: 50,
                    cableType: 'XLPE',
                    current: 80,
                    resistance: 0.387,
                    reactance: 0.08,
                    enabled: true
                }
            ]
        };

        this.renderSectionsContainer();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    exportResults() {
        if (!this.results.totalVoltageDrop) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Szakasz': 'Összesen',
                'Hossz (m)': this.results.totalLength,
                'Feszültségesés (V)': this.results.totalVoltageDrop.toFixed(1),
                'Feszültségesés (%)': this.results.totalVoltageDropPercentage.toFixed(2),
                'Rendszer feszültség (V)': this.results.systemVoltage,
                'Rendszer típusa': this.results.systemType,
                'Teljesítménytényező': this.results.powerFactor
            },
            ...this.results.sectionResults.map(section => ({
                'Szakasz': section.name,
                'Hossz (m)': section.length,
                'Áram (A)': section.current.toFixed(1),
                'Ellenállás (Ω)': section.resistance.toFixed(3),
                'Reaktancia (Ω)': section.reactance.toFixed(3),
                'Feszültségesés (V)': section.voltageDrop.toFixed(1),
                'Feszültségesés (%)': section.voltageDropPercentage.toFixed(2)
            }))
        ];

        Utils.exportToCSV(exportData, 'feszultsegeses.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.voltageDropModule = VoltageDropModule;

