// ===== Energiafogyasztás és költségbecslés modul =====
class EnergyModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Rendszer adatok
            systemType: 'industrial', // 'residential', 'commercial', 'industrial'
            voltage: 400, // V
            frequency: 50, // Hz
            
            // Terhelés adatok
            activePower: 500, // kW
            reactivePower: 300, // kVAR
            powerFactor: 0.857,
            operatingHours: 8760, // hours/year
            loadFactor: 0.8, // 80%
            
            // Tarifa adatok
            tariffType: 'two-rate', // 'single-rate', 'two-rate', 'three-rate'
            energyPrice: 45, // Ft/kWh
            demandCharge: 2500, // Ft/kW
            reactiveCharge: 500, // Ft/kVARh
            networkFee: 15, // Ft/kWh
            systemFee: 8, // Ft/kWh
            
            // Kompenzáció adatok
            compensationEnabled: true,
            targetPowerFactor: 0.95,
            compensationCost: 50000, // Ft/kVAR
            compensationEfficiency: 0.95,
            
            // Költség infláció
            inflationRate: 0.05, // 5%
            analysisPeriod: 10, // years
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
                            <option value="residential" ${this.data.systemType === 'residential' ? 'selected' : ''}>Lakossági</option>
                            <option value="commercial" ${this.data.systemType === 'commercial' ? 'selected' : ''}>Kereskedelmi</option>
                            <option value="industrial" ${this.data.systemType === 'industrial' ? 'selected' : ''}>Ipari</option>
                        </select>
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
                    Terhelés adatok
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
                        <label class="form-label" for="powerFactor">Teljesítménytényező</label>
                        <input type="number" id="powerFactor" class="form-input" value="${this.data.powerFactor}" min="0.1" max="1" step="0.001">
                        <div class="form-help">Automatikus számítás: P/S</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="operatingHours">Üzemidő (óra/év)</label>
                        <input type="number" id="operatingHours" class="form-input" value="${this.data.operatingHours}" min="100" max="8760" step="1">
                        <div class="form-help">Folyamatos üzem: 8760 óra/év</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loadFactor">Terhelési tényező</label>
                        <input type="number" id="loadFactor" class="form-input" value="${this.data.loadFactor * 100}" min="10" max="100" step="1">
                        <div class="form-help">Jellemző értékek: 70-90%</div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Tarifa adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="tariffType">Tarifa típusa</label>
                        <select id="tariffType" class="form-select">
                            <option value="single-rate" ${this.data.tariffType === 'single-rate' ? 'selected' : ''}>Egységes tarifa</option>
                            <option value="two-rate" ${this.data.tariffType === 'two-rate' ? 'selected' : ''}>Kétárú tarifa</option>
                            <option value="three-rate" ${this.data.tariffType === 'three-rate' ? 'selected' : ''}>Háromárú tarifa</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="energyPrice">Energia ár (Ft/kWh)</label>
                        <input type="number" id="energyPrice" class="form-input" value="${this.data.energyPrice}" min="1" max="1000" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="demandCharge">Teljesítmény díj (Ft/kW)</label>
                        <input type="number" id="demandCharge" class="form-input" value="${this.data.demandCharge}" min="100" max="10000" step="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reactiveCharge">Meddő díj (Ft/kVARh)</label>
                        <input type="number" id="reactiveCharge" class="form-input" value="${this.data.reactiveCharge}" min="0" max="1000" step="10">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="networkFee">Hálózati díj (Ft/kWh)</label>
                        <input type="number" id="networkFee" class="form-input" value="${this.data.networkFee}" min="0" max="100" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="systemFee">Rendszer díj (Ft/kWh)</label>
                        <input type="number" id="systemFee" class="form-input" value="${this.data.systemFee}" min="0" max="100" step="1">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">4</span>
                    Kompenzáció beállítások
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="compensationEnabled">Kompenzáció engedélyezve</label>
                        <select id="compensationEnabled" class="form-select">
                            <option value="true" ${this.data.compensationEnabled ? 'selected' : ''}>Igen</option>
                            <option value="false" ${!this.data.compensationEnabled ? 'selected' : ''}>Nem</option>
                        </select>
                    </div>
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
                        <label class="form-label" for="compensationCost">Kompenzáció költség (Ft/kVAR)</label>
                        <input type="number" id="compensationCost" class="form-input" value="${this.data.compensationCost}" min="1000" max="1000000" step="1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="compensationEfficiency">Kompenzáció hatásfoka</label>
                        <input type="number" id="compensationEfficiency" class="form-input" value="${this.data.compensationEfficiency * 100}" min="50" max="100" step="1">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">5</span>
                    Költség elemzés
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="inflationRate">Infláció mértéke (%)</label>
                        <input type="number" id="inflationRate" class="form-input" value="${this.data.inflationRate * 100}" min="0" max="20" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="analysisPeriod">Elemzési időszak (év)</label>
                        <input type="number" id="analysisPeriod" class="form-input" value="${this.data.analysisPeriod}" min="1" max="30" step="1">
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
                    <span>💰</span>
                    Energia költség eredmények
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
        const inputs = ['systemType', 'voltage', 'frequency', 'activePower', 'reactivePower', 'powerFactor',
                       'operatingHours', 'loadFactor', 'tariffType', 'energyPrice', 'demandCharge',
                       'reactiveCharge', 'networkFee', 'systemFee', 'compensationEnabled', 'targetPowerFactor',
                       'compensationCost', 'compensationEfficiency', 'inflationRate', 'analysisPeriod'];

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
            frequency: Number(document.getElementById('frequency').value),
            activePower: Number(document.getElementById('activePower').value),
            reactivePower: Number(document.getElementById('reactivePower').value),
            powerFactor: Number(document.getElementById('powerFactor').value),
            operatingHours: Number(document.getElementById('operatingHours').value),
            loadFactor: Number(document.getElementById('loadFactor').value) / 100,
            tariffType: document.getElementById('tariffType').value,
            energyPrice: Number(document.getElementById('energyPrice').value),
            demandCharge: Number(document.getElementById('demandCharge').value),
            reactiveCharge: Number(document.getElementById('reactiveCharge').value),
            networkFee: Number(document.getElementById('networkFee').value),
            systemFee: Number(document.getElementById('systemFee').value),
            compensationEnabled: document.getElementById('compensationEnabled').value === 'true',
            targetPowerFactor: Number(document.getElementById('targetPowerFactor').value),
            compensationCost: Number(document.getElementById('compensationCost').value),
            compensationEfficiency: Number(document.getElementById('compensationEfficiency').value) / 100,
            inflationRate: Number(document.getElementById('inflationRate').value) / 100,
            analysisPeriod: Number(document.getElementById('analysisPeriod').value)
        };
    }

    calculateDerivedValues() {
        const activePower = Number(document.getElementById('activePower').value);
        const reactivePower = Number(document.getElementById('reactivePower').value);
        
        if (activePower > 0 && reactivePower >= 0) {
            const apparentPower = Math.sqrt(activePower ** 2 + reactivePower ** 2);
            const powerFactor = activePower / apparentPower;
            
            document.getElementById('powerFactor').value = powerFactor.toFixed(3);
        }
    }

    calculate() {
        this.updateData();
        
        try {
            // Alapadatok számítása
            const apparentPower = Math.sqrt(this.data.activePower ** 2 + this.data.reactivePower ** 2);
            const effectivePower = this.data.activePower * this.data.loadFactor;
            const effectiveReactivePower = this.data.reactivePower * this.data.loadFactor;
            
            // Éves energiafogyasztás
            const annualEnergyConsumption = effectivePower * this.data.operatingHours; // kWh
            const annualReactiveConsumption = effectiveReactivePower * this.data.operatingHours; // kVARh
            
            // Kompenzáció számítása
            let compensationResults = null;
            if (this.data.compensationEnabled) {
                const targetReactivePower = this.data.activePower * Math.tan(Math.acos(this.data.targetPowerFactor));
                const requiredCompensation = Math.max(0, this.data.reactivePower - targetReactivePower);
                const compensationInvestment = requiredCompensation * this.data.compensationCost;
                const compensatedReactivePower = Math.max(0, this.data.reactivePower - requiredCompensation);
                
                compensationResults = {
                    requiredCompensation,
                    compensationInvestment,
                    compensatedReactivePower,
                    newPowerFactor: this.data.activePower / Math.sqrt(this.data.activePower ** 2 + compensatedReactivePower ** 2)
                };
            }
            
            // Költség számítás
            const energyCost = annualEnergyConsumption * this.data.energyPrice;
            const demandCost = this.data.activePower * this.data.demandCharge * 12; // 12 hónap
            const reactiveCost = annualReactiveConsumption * this.data.reactiveCharge;
            const networkCost = annualEnergyConsumption * this.data.networkFee;
            const systemCost = annualEnergyConsumption * this.data.systemFee;
            
            const totalAnnualCost = energyCost + demandCost + reactiveCost + networkCost + systemCost;
            
            // Kompenzáció utáni költség
            let compensatedCosts = null;
            if (compensationResults) {
                const compensatedReactiveCost = (compensationResults.compensatedReactivePower * this.data.operatingHours) * this.data.reactiveCharge;
                const compensatedTotalCost = energyCost + demandCost + compensatedReactiveCost + networkCost + systemCost;
                const annualSavings = totalAnnualCost - compensatedTotalCost;
                const paybackPeriod = compensationResults.compensationInvestment / annualSavings;
                
                compensatedCosts = {
                    compensatedReactiveCost,
                    compensatedTotalCost,
                    annualSavings,
                    paybackPeriod
                };
            }
            
            // Infláció hatása
            const inflationFactors = [];
            for (let year = 1; year <= this.data.analysisPeriod; year++) {
                inflationFactors.push(Math.pow(1 + this.data.inflationRate, year));
            }
            
            const totalCostWithInflation = totalAnnualCost * inflationFactors.reduce((sum, factor) => sum + factor, 0) / this.data.analysisPeriod;
            
            this.results = {
                apparentPower,
                effectivePower,
                effectiveReactivePower,
                annualEnergyConsumption,
                annualReactiveConsumption,
                energyCost,
                demandCost,
                reactiveCost,
                networkCost,
                systemCost,
                totalAnnualCost,
                compensationResults,
                compensatedCosts,
                totalCostWithInflation,
                inflationFactors
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
                    <div class="result-label">Látszólagos teljesítmény</div>
                    <div class="result-value">${Utils.formatNumber(this.results.apparentPower, 1)}<span class="result-unit">kVA</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Hatásos teljesítmény</div>
                    <div class="result-value">${Utils.formatNumber(this.results.effectivePower, 1)}<span class="result-unit">kW</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Éves energiafogyasztás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.annualEnergyConsumption, 0)}<span class="result-unit">kWh</span></div>
                </div>
                <div class="result-item">
                    <div class="result-label">Éves meddőfogyasztás</div>
                    <div class="result-value">${Utils.formatNumber(this.results.annualReactiveConsumption, 0)}<span class="result-unit">kVARh</span></div>
                </div>
            </div>

            <div class="form-section">
                <h3>Költség felbontás</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Energia költség</div>
                        <div class="result-value">${Utils.formatNumber(this.results.energyCost, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Teljesítmény díj</div>
                        <div class="result-value">${Utils.formatNumber(this.results.demandCost, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Meddő díj</div>
                        <div class="result-value">${Utils.formatNumber(this.results.reactiveCost, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Hálózati díj</div>
                        <div class="result-value">${Utils.formatNumber(this.results.networkCost, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                </div>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Rendszer díj</div>
                        <div class="result-value">${Utils.formatNumber(this.results.systemCost, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Összes éves költség</div>
                        <div class="result-value" style="color: var(--primary); font-weight: bold;">${Utils.formatNumber(this.results.totalAnnualCost, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                </div>
            </div>

            ${this.results.compensationResults ? `
                <div class="form-section">
                    <h3>Kompenzáció elemzés</h3>
                    <div class="results-grid">
                        <div class="result-item">
                            <div class="result-label">Szükséges kompenzáció</div>
                            <div class="result-value">${Utils.formatNumber(this.results.compensationResults.requiredCompensation, 1)}<span class="result-unit">kVAR</span></div>
                        </div>
                        <div class="result-item">
                            <div class="result-label">Kompenzáció beruházás</div>
                            <div class="result-value">${Utils.formatNumber(this.results.compensationResults.compensationInvestment, 0)}<span class="result-unit">Ft</span></div>
                        </div>
                        <div class="result-item">
                            <div class="result-label">Új teljesítménytényező</div>
                            <div class="result-value" style="color: var(--success)">${Utils.formatNumber(this.results.compensationResults.newPowerFactor, 3)}</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${this.results.compensatedCosts ? `
                <div class="form-section">
                    <h3>Kompenzáció megtakarítás</h3>
                    <div class="results-grid">
                        <div class="result-item">
                            <div class="result-label">Kompenzáció utáni költség</div>
                            <div class="result-value">${Utils.formatNumber(this.results.compensatedCosts.compensatedTotalCost, 0)}<span class="result-unit">Ft/év</span></div>
                        </div>
                        <div class="result-item">
                            <div class="result-label">Éves megtakarítás</div>
                            <div class="result-value" style="color: var(--success)">${Utils.formatNumber(this.results.compensatedCosts.annualSavings, 0)}<span class="result-unit">Ft/év</span></div>
                        </div>
                        <div class="result-item">
                            <div class="result-label">Megtérülési idő</div>
                            <div class="result-value" style="color: ${this.results.compensatedCosts.paybackPeriod <= 3 ? 'var(--success)' : this.results.compensatedCosts.paybackPeriod <= 5 ? 'var(--warning)' : 'var(--error)'}">
                                ${Utils.formatNumber(this.results.compensatedCosts.paybackPeriod, 1)}<span class="result-unit">év</span>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="form-section">
                <h3>Hosszú távú költség elemzés</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Inflációval korrigált költség</div>
                        <div class="result-value">${Utils.formatNumber(this.results.totalCostWithInflation, 0)}<span class="result-unit">Ft/év</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Elemzési időszak</div>
                        <div class="result-value">${this.data.analysisPeriod}<span class="result-unit">év</span></div>
                    </div>
                </div>
            </div>
        `;

        // Status messages
        if (this.results.compensatedCosts) {
            if (this.results.compensatedCosts.paybackPeriod <= 3) {
                Utils.showMessage('A kompenzáció gazdaságilag nagyon kedvező.', 'success');
            } else if (this.results.compensatedCosts.paybackPeriod <= 5) {
                Utils.showMessage('A kompenzáció gazdaságilag kedvező.', 'success');
            } else {
                Utils.showMessage('A kompenzáció gazdaságilag kevésbé kedvező.', 'warning');
            }
        }
    }

    loadExample() {
        this.data = {
            systemType: 'industrial',
            voltage: 400,
            frequency: 50,
            activePower: 1000,
            reactivePower: 600,
            powerFactor: 0.857,
            operatingHours: 8760,
            loadFactor: 0.8,
            tariffType: 'two-rate',
            energyPrice: 45,
            demandCharge: 2500,
            reactiveCharge: 500,
            networkFee: 15,
            systemFee: 8,
            compensationEnabled: true,
            targetPowerFactor: 0.95,
            compensationCost: 50000,
            compensationEfficiency: 0.95,
            inflationRate: 0.05,
            analysisPeriod: 10
        };

        this.updateInputs();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    updateInputs() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'loadFactor' || key === 'compensationEfficiency' || key === 'inflationRate') {
                    element.value = this.data[key] * 100;
                } else if (key === 'compensationEnabled') {
                    element.value = this.data[key] ? 'true' : 'false';
                } else {
                    element.value = this.data[key];
                }
            }
        });
    }

    exportResults() {
        if (!this.results.totalAnnualCost) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Látszólagos teljesítmény (kVA)': this.results.apparentPower.toFixed(1),
                'Hatásos teljesítmény (kW)': this.results.effectivePower.toFixed(1),
                'Éves energiafogyasztás (kWh)': this.results.annualEnergyConsumption,
                'Éves meddőfogyasztás (kVARh)': this.results.annualReactiveConsumption,
                'Energia költség (Ft/év)': this.results.energyCost,
                'Teljesítmény díj (Ft/év)': this.results.demandCost,
                'Meddő díj (Ft/év)': this.results.reactiveCost,
                'Hálózati díj (Ft/év)': this.results.networkCost,
                'Rendszer díj (Ft/év)': this.results.systemCost,
                'Összes éves költség (Ft/év)': this.results.totalAnnualCost,
                'Inflációval korrigált költség (Ft/év)': this.results.totalCostWithInflation,
                'Elemzési időszak (év)': this.data.analysisPeriod
            }
        ];

        if (this.results.compensationResults) {
            exportData[0]['Szükséges kompenzáció (kVAR)'] = this.results.compensationResults.requiredCompensation.toFixed(1);
            exportData[0]['Kompenzáció beruházás (Ft)'] = this.results.compensationResults.compensationInvestment;
            exportData[0]['Új teljesítménytényező'] = this.results.compensationResults.newPowerFactor.toFixed(3);
        }

        if (this.results.compensatedCosts) {
            exportData[0]['Kompenzáció utáni költség (Ft/év)'] = this.results.compensatedCosts.compensatedTotalCost;
            exportData[0]['Éves megtakarítás (Ft/év)'] = this.results.compensatedCosts.annualSavings;
            exportData[0]['Megtérülési idő (év)'] = this.results.compensatedCosts.paybackPeriod.toFixed(1);
        }

        Utils.exportToCSV(exportData, 'energia_koltseg.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.energyModule = EnergyModule;

