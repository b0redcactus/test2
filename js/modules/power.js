// ===== Teljesítmény és meddőkompenzáció modul =====
class PowerModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Alapadatok
            activePower: 100, // kW
            reactivePower: 60, // kVAR
            apparentPower: 116.6, // kVA
            powerFactor: 0.857,
            voltage: 400, // V
            frequency: 50, // Hz
            
            // Kompenzáció adatok
            targetPowerFactor: 0.95,
            compensationType: 'automatic', // 'automatic', 'manual'
            capacitorSteps: 5,
            stepSize: 10, // kVAR
            
            // Költség adatok
            energyPrice: 45, // Ft/kWh
            demandCharge: 2500, // Ft/kW
            capacitorCost: 50000, // Ft/kVAR
            maintenanceCost: 0.05, // 5% évente
        };
        
        this.results = {};
    }

    async render(container) {
        this.loadData();
        
        container.innerHTML = `
            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">1</span>
                    Alapadatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="activePower">Aktív teljesítmény (kW)</label>
                        <input type="number" id="activePower" class="form-input" value="${this.data.activePower}" min="0.1" max="10000" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reactivePower">Meddő teljesítmény (kVAR)</label>
                        <input type="number" id="reactivePower" class="form-input" value="${this.data.reactivePower}" min="0" max="10000" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="apparentPower">Látszólagos teljesítmény (kVA)</label>
                        <input type="number" id="apparentPower" class="form-input" value="${this.data.apparentPower}" min="0.1" max="10000" step="0.1">
                        <div class="form-help">Automatikus számítás: √(P² + Q²)</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="powerFactor">Teljesítménytényező</label>
                        <input type="number" id="powerFactor" class="form-input" value="${this.data.powerFactor}" min="0.1" max="1" step="0.001">
                        <div class="form-help">Automatikus számítás: P/S</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="voltage">Feszültség (V)</label>
                        <input type="number" id="voltage" class="form-input" value="${this.data.voltage}" min="100" max="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="frequency">Frekvencia (Hz)</label>
                        <input type="number" id="frequency" class="form-input" value="${this.data.frequency}" min="50" max="60">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">2</span>
                    Kompenzáció beállítások
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="targetPowerFactor">Cél teljesítménytényező</label>
                        <select id="targetPowerFactor" class="form-select">
                            <option value="0.9" ${this.data.targetPowerFactor === 0.9 ? 'selected' : ''}>0.9</option>
                            <option value="0.92" ${this.data.targetPowerFactor === 0.92 ? 'selected' : ''}>0.92</option>
                            <option value="0.95" ${this.data.targetPowerFactor === 0.95 ? 'selected' : ''}>0.95</option>
                            <option value="0.98" ${this.data.targetPowerFactor === 0.98 ? 'selected' : ''}>0.98</option>
                            <option value="1.0" ${this.data.targetPowerFactor === 1.0 ? 'selected' : ''}>1.0</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="compensationType">Kompenzáció típusa</label>
                        <select id="compensationType" class="form-select">
                            <option value="automatic" ${this.data.compensationType === 'automatic' ? 'selected' : ''}>Automatikus</option>
                            <option value="manual" ${this.data.compensationType === 'manual' ? 'selected' : ''}>Manuális</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="capacitorSteps">Kondenzátor lépések száma</label>
                        <input type="number" id="capacitorSteps" class="form-input" value="${this.data.capacitorSteps}" min="1" max="20">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="stepSize">Lépés mérete (kVAR)</label>
                        <input type="number" id="stepSize" class="form-input" value="${this.data.stepSize}" min="1" max="100">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Költség adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="energyPrice">Energia ár (Ft/kWh)</label>
                        <input type="number" id="energyPrice" class="form-input" value="${this.data.energyPrice}" min="1" max="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="demandCharge">Teljesítmény díj (Ft/kW)</label>
                        <input type="number" id="demandCharge" class="form-input" value="${this.data.demandCharge}" min="100" max="10000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="capacitorCost">Kondenzátor költség (Ft/kVAR)</label>
                        <input type="number" id="capacitorCost" class="form-input" value="${this.data.capacitorCost}" min="1000" max="1000000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="maintenanceCost">Karbantartási költség (%)</label>
                        <input type="number" id="maintenanceCost" class="form-input" value="${this.data.maintenanceCost * 100}" min="0" max="20" step="0.1">
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
                    <span>📊</span>
                    Kompenzáció eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto-calculation listeners
        ['activePower', 'reactivePower'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.calculateDerivedValues();
                });
            }
        });

        // All input listeners
        const inputs = ['activePower', 'reactivePower', 'apparentPower', 'powerFactor', 'voltage', 'frequency',
                       'targetPowerFactor', 'compensationType', 'capacitorSteps', 'stepSize',
                       'energyPrice', 'demandCharge', 'capacitorCost', 'maintenanceCost'];

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
            activePower: Number(document.getElementById('activePower').value),
            reactivePower: Number(document.getElementById('reactivePower').value),
            apparentPower: Number(document.getElementById('apparentPower').value),
            powerFactor: Number(document.getElementById('powerFactor').value),
            voltage: Number(document.getElementById('voltage').value),
            frequency: Number(document.getElementById('frequency').value),
            targetPowerFactor: Number(document.getElementById('targetPowerFactor').value),
            compensationType: document.getElementById('compensationType').value,
            capacitorSteps: Number(document.getElementById('capacitorSteps').value),
            stepSize: Number(document.getElementById('stepSize').value),
            energyPrice: Number(document.getElementById('energyPrice').value),
            demandCharge: Number(document.getElementById('demandCharge').value),
            capacitorCost: Number(document.getElementById('capacitorCost').value),
            maintenanceCost: Number(document.getElementById('maintenanceCost').value) / 100
        };
    }

    calculateDerivedValues() {
        const activePower = Number(document.getElementById('activePower').value);
        const reactivePower = Number(document.getElementById('reactivePower').value);
        
        if (activePower > 0 && reactivePower >= 0) {
            const apparentPower = Math.sqrt(activePower ** 2 + reactivePower ** 2);
            const powerFactor = activePower / apparentPower;
            
            document.getElementById('apparentPower').value = apparentPower.toFixed(1);
            document.getElementById('powerFactor').value = powerFactor.toFixed(3);
        }
    }

    calculate() {
        this.updateData();
        
        try {
            // Szükséges kompenzáció számítása
            const targetReactivePower = this.data.activePower * Math.tan(Math.acos(this.data.targetPowerFactor));
            const requiredCompensation = this.data.reactivePower - targetReactivePower;
            
            // Kondenzátor méretezés
            const capacitorRating = Math.ceil(requiredCompensation / this.data.stepSize) * this.data.stepSize;
            const actualReactivePower = this.data.reactivePower - capacitorRating;
            const actualApparentPower = Math.sqrt(this.data.activePower ** 2 + actualReactivePower ** 2);
            const actualPowerFactor = this.data.activePower / actualApparentPower;
            
            // Költség számítás
            const capacitorInvestment = capacitorRating * this.data.capacitorCost;
            const annualMaintenance = capacitorInvestment * this.data.maintenanceCost;
            
            // Energia megtakarítás
            const powerReduction = this.data.apparentPower - actualApparentPower;
            const annualEnergySavings = powerReduction * 8760 * this.data.energyPrice; // 8760 óra/év
            const annualDemandSavings = powerReduction * this.data.demandCharge * 12; // 12 hónap
            
            const totalAnnualSavings = annualEnergySavings + annualDemandSavings;
            const paybackPeriod = capacitorInvestment / totalAnnualSavings;
            
            // Kondenzátor lépések
            const steps = [];
            for (let i = 1; i <= this.data.capacitorSteps; i++) {
                const stepPower = i * this.data.stepSize;
                if (stepPower <= capacitorRating) {
                    steps.push({
                        step: i,
                        power: stepPower,
                        enabled: stepPower <= capacitorRating
                    });
                }
            }

            this.results = {
                requiredCompensation,
                capacitorRating,
                actualReactivePower,
                actualApparentPower,
                actualPowerFactor,
                powerReduction,
                capacitorInvestment,
                annualMaintenance,
                annualEnergySavings,
                annualDemandSavings,
                totalAnnualSavings,
                paybackPeriod,
                steps
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
                    <div class="result-label">Szükséges kompenzáció</div>
                    <div class="result-value">${Utils.formatNumber(this.results.requiredCompensation, 1)}<span class="result-unit">kVAR</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Kondenzátor méretezés</div>
                    <div class="result-value">${Utils.formatNumber(this.results.capacitorRating, 0)}<span class="result-unit">kVAR</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Kompenzáció után cosφ</div>
                    <div class="result-value" style="color: var(--success)">${Utils.formatNumber(this.results.actualPowerFactor, 3)}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Teljesítmény csökkentés</div>
                    <div class="result-value">${Utils.formatNumber(this.results.powerReduction, 1)}<span class="result-unit">kVA</span></div>
                </div>
            </div>

            <div class="form-section">
                <h3>Kondenzátor lépések</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Lépés</th>
                                <th>Teljesítmény (kVAR)</th>
                                <th>Állapot</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.results.steps.map(step => `
                                <tr>
                                    <td>${step.step}</td>
                                    <td>${step.power}</td>
                                    <td style="color: ${step.enabled ? 'var(--success)' : 'var(--text-muted)'}">
                                        ${step.enabled ? '✅ Aktív' : '⭕ Inaktív'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label">Beruházási költség</div>
                    <div class="result-value">${Utils.formatNumber(this.results.capacitorInvestment, 0)}<span class="result-unit">Ft</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Éves energia megtakarítás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.annualEnergySavings, 0)}<span class="result-unit">Ft</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Éves teljesítmény megtakarítás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.annualDemandSavings, 0)}<span class="result-unit">Ft</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Összes éves megtakarítás</div>
                    <div class="result-value" style="color: var(--success)">${Utils.formatNumber(this.results.totalAnnualSavings, 0)}<span class="result-unit">Ft</span></div>
                </div>
            </div>

            <div class="form-section">
                <h3>Megtérülési elemzés</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Megtérülési idő</div>
                        <div class="result-value" style="color: ${this.results.paybackPeriod <= 3 ? 'var(--success)' : this.results.paybackPeriod <= 5 ? 'var(--warning)' : 'var(--error)'}">
                            ${Utils.formatNumber(this.results.paybackPeriod, 1)}<span class="result-unit">év</span>
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Éves karbantartás</div>
                        <div class="result-value">${Utils.formatNumber(this.results.annualMaintenance, 0)}<span class="result-unit">Ft</span></div>
                    </div>
                </div>
            </div>
        `;

        // Status messages
        if (this.results.requiredCompensation <= 0) {
            Utils.showMessage('A jelenlegi teljesítménytényező már megfelelő.', 'info');
        } else if (this.results.paybackPeriod <= 3) {
            Utils.showMessage('A kompenzáció gazdaságilag nagyon kedvező.', 'success');
        } else if (this.results.paybackPeriod <= 5) {
            Utils.showMessage('A kompenzáció gazdaságilag kedvező.', 'success');
        } else {
            Utils.showMessage('A kompenzáció gazdaságilag kevésbé kedvező, de technikailag szükséges lehet.', 'warning');
        }
    }

    loadExample() {
        this.data = {
            activePower: 500,
            reactivePower: 300,
            apparentPower: 583.1,
            powerFactor: 0.857,
            voltage: 400,
            frequency: 50,
            targetPowerFactor: 0.95,
            compensationType: 'automatic',
            capacitorSteps: 6,
            stepSize: 25,
            energyPrice: 45,
            demandCharge: 2500,
            capacitorCost: 50000,
            maintenanceCost: 0.05
        };

        this.updateInputs();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    updateInputs() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'maintenanceCost') {
                    element.value = this.data[key] * 100;
                } else {
                    element.value = this.data[key];
                }
            }
        });
    }

    exportResults() {
        if (!this.results.capacitorRating) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Szükséges kompenzáció (kVAR)': this.results.requiredCompensation.toFixed(1),
                'Kondenzátor méretezés (kVAR)': this.results.capacitorRating,
                'Kompenzáció után cosφ': this.results.actualPowerFactor.toFixed(3),
                'Teljesítmény csökkentés (kVA)': this.results.powerReduction.toFixed(1),
                'Beruházási költség (Ft)': this.results.capacitorInvestment,
                'Éves energia megtakarítás (Ft)': this.results.annualEnergySavings,
                'Éves teljesítmény megtakarítás (Ft)': this.results.annualDemandSavings,
                'Összes éves megtakarítás (Ft)': this.results.totalAnnualSavings,
                'Megtérülési idő (év)': this.results.paybackPeriod.toFixed(1),
                'Éves karbantartás (Ft)': this.results.annualMaintenance
            }
        ];

        Utils.exportToCSV(exportData, 'meddokompenzacio.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.powerModule = PowerModule;

