// ===== Érintésvédelem és kioldási idő modul =====
export default class ProtectionModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Rendszer adatok
            systemType: 'TN-S', // 'TN-S', 'TN-C', 'TN-C-S', 'TT', 'IT'
            systemVoltage: 230, // V
            frequency: 50, // Hz
            
            // Védelem adatok
            protectionType: 'RCD', // 'RCD', 'MCB', 'Fuse'
            protectionRating: 30, // mA for RCD, A for MCB/Fuse
            protectionBreakingCapacity: 6, // kA
            protectionTimeDelay: 0, // s
            
            // Hurokimpedancia adatok
            loopImpedance: 0.5, // Ω
            earthResistance: 10, // Ω (for TT systems)
            neutralResistance: 0.1, // Ω
            
            // Terhelés adatok
            loadPower: 2000, // W
            loadCurrent: 8.7, // A
            loadVoltage: 230, // V
            
            // Környezeti adatok
            ambientTemperature: 25, // °C
            installationType: 'indoor', // 'indoor', 'outdoor'
            protectionClass: 'IP20', // 'IP20', 'IP44', 'IP65'
            
            // Biztonsági követelmények
            maxDisconnectionTime: 0.4, // s (for 230V systems)
            maxTouchVoltage: 50, // V (for dry conditions)
            maxTouchVoltageWet: 25, // V (for wet conditions)
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
                            <option value="TN-S" ${this.data.systemType === 'TN-S' ? 'selected' : ''}>TN-S</option>
                            <option value="TN-C" ${this.data.systemType === 'TN-C' ? 'selected' : ''}>TN-C</option>
                            <option value="TN-C-S" ${this.data.systemType === 'TN-C-S' ? 'selected' : ''}>TN-C-S</option>
                            <option value="TT" ${this.data.systemType === 'TT' ? 'selected' : ''}>TT</option>
                            <option value="IT" ${this.data.systemType === 'IT' ? 'selected' : ''}>IT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="systemVoltage">Rendszer feszültség (V)</label>
                        <input type="number" id="systemVoltage" class="form-input" value="${this.data.systemVoltage}" min="100" max="1000">
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
                    Védelem adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="protectionType">Védelem típusa</label>
                        <select id="protectionType" class="form-select">
                            <option value="RCD" ${this.data.protectionType === 'RCD' ? 'selected' : ''}>RCD (Érintésvédelmi kapcsoló)</option>
                            <option value="MCB" ${this.data.protectionType === 'MCB' ? 'selected' : ''}>MCB (Miniatűr megszakító)</option>
                            <option value="Fuse" ${this.data.protectionType === 'Fuse' ? 'selected' : ''}>Biztosíték</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="protectionRating">Védelem névleges értéke</label>
                        <input type="number" id="protectionRating" class="form-input" value="${this.data.protectionRating}" min="0.01" max="10000" step="0.01">
                        <div class="form-help" id="protectionRatingHelp">RCD: mA, MCB/Biztosíték: A</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="protectionBreakingCapacity">Kioldó képesség (kA)</label>
                        <input type="number" id="protectionBreakingCapacity" class="form-input" value="${this.data.protectionBreakingCapacity}" min="1" max="200" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="protectionTimeDelay">Idő késleltetés (s)</label>
                        <input type="number" id="protectionTimeDelay" class="form-input" value="${this.data.protectionTimeDelay}" min="0" max="10" step="0.01">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Hurokimpedancia adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="loopImpedance">Hurokimpedancia (Ω)</label>
                        <input type="number" id="loopImpedance" class="form-input" value="${this.data.loopImpedance}" min="0.01" max="100" step="0.01">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="earthResistance">Földelési ellenállás (Ω)</label>
                        <input type="number" id="earthResistance" class="form-input" value="${this.data.earthResistance}" min="0.1" max="1000" step="0.1">
                        <div class="form-help">TT rendszerekhez</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="neutralResistance">Nulldvezető ellenállás (Ω)</label>
                        <input type="number" id="neutralResistance" class="form-input" value="${this.data.neutralResistance}" min="0.01" max="10" step="0.01">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">4</span>
                    Terhelés adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="loadPower">Terhelés teljesítménye (W)</label>
                        <input type="number" id="loadPower" class="form-input" value="${this.data.loadPower}" min="1" max="100000" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loadCurrent">Terhelési áram (A)</label>
                        <input type="number" id="loadCurrent" class="form-input" value="${this.data.loadCurrent}" min="0.1" max="1000" step="0.1">
                        <div class="form-help">Automatikus számítás: P/U</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loadVoltage">Terhelés feszültsége (V)</label>
                        <input type="number" id="loadVoltage" class="form-input" value="${this.data.loadVoltage}" min="100" max="1000">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">5</span>
                    Környezeti adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="ambientTemperature">Környezeti hőmérséklet (°C)</label>
                        <input type="number" id="ambientTemperature" class="form-input" value="${this.data.ambientTemperature}" min="-40" max="60" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="installationType">Telepítés típusa</label>
                        <select id="installationType" class="form-select">
                            <option value="indoor" ${this.data.installationType === 'indoor' ? 'selected' : ''}>Beltéri</option>
                            <option value="outdoor" ${this.data.installationType === 'outdoor' ? 'selected' : ''}>Kültéri</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="protectionClass">Védettségi osztály</label>
                        <select id="protectionClass" class="form-select">
                            <option value="IP20" ${this.data.protectionClass === 'IP20' ? 'selected' : ''}>IP20 (beltéri)</option>
                            <option value="IP44" ${this.data.protectionClass === 'IP44' ? 'selected' : ''}>IP44 (kültéri)</option>
                            <option value="IP65" ${this.data.protectionClass === 'IP65' ? 'selected' : ''}>IP65 (por- és vízálló)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">6</span>
                    Biztonsági követelmények
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="maxDisconnectionTime">Max. kioldási idő (s)</label>
                        <input type="number" id="maxDisconnectionTime" class="form-input" value="${this.data.maxDisconnectionTime}" min="0.01" max="5" step="0.01">
                        <div class="form-help">230V: 0.4s, 400V: 0.2s</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="maxTouchVoltage">Max. érintési feszültség (V)</label>
                        <input type="number" id="maxTouchVoltage" class="form-input" value="${this.data.maxTouchVoltage}" min="10" max="100" step="1">
                        <div class="form-help">Száraz környezet: 50V</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="maxTouchVoltageWet">Max. érintési feszültség nedves (V)</label>
                        <input type="number" id="maxTouchVoltageWet" class="form-input" value="${this.data.maxTouchVoltageWet}" min="5" max="50" step="1">
                        <div class="form-help">Nedves környezet: 25V</div>
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
                    <span>🛡️</span>
                    Érintésvédelem eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto-calculation listeners
        ['loadPower', 'loadVoltage'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.calculateLoadCurrent();
                });
            }
        });

        // Protection type change
        document.getElementById('protectionType').addEventListener('change', () => {
            this.updateProtectionRatingHelp();
        });

        // All input listeners
        const inputs = ['systemType', 'systemVoltage', 'frequency', 'protectionType', 'protectionRating',
                       'protectionBreakingCapacity', 'protectionTimeDelay', 'loopImpedance', 'earthResistance',
                       'neutralResistance', 'loadPower', 'loadCurrent', 'loadVoltage', 'ambientTemperature',
                       'installationType', 'protectionClass', 'maxDisconnectionTime', 'maxTouchVoltage', 'maxTouchVoltageWet'];

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
            systemVoltage: Number(document.getElementById('systemVoltage').value),
            frequency: Number(document.getElementById('frequency').value),
            protectionType: document.getElementById('protectionType').value,
            protectionRating: Number(document.getElementById('protectionRating').value),
            protectionBreakingCapacity: Number(document.getElementById('protectionBreakingCapacity').value),
            protectionTimeDelay: Number(document.getElementById('protectionTimeDelay').value),
            loopImpedance: Number(document.getElementById('loopImpedance').value),
            earthResistance: Number(document.getElementById('earthResistance').value),
            neutralResistance: Number(document.getElementById('neutralResistance').value),
            loadPower: Number(document.getElementById('loadPower').value),
            loadCurrent: Number(document.getElementById('loadCurrent').value),
            loadVoltage: Number(document.getElementById('loadVoltage').value),
            ambientTemperature: Number(document.getElementById('ambientTemperature').value),
            installationType: document.getElementById('installationType').value,
            protectionClass: document.getElementById('protectionClass').value,
            maxDisconnectionTime: Number(document.getElementById('maxDisconnectionTime').value),
            maxTouchVoltage: Number(document.getElementById('maxTouchVoltage').value),
            maxTouchVoltageWet: Number(document.getElementById('maxTouchVoltageWet').value)
        };
    }

    calculateLoadCurrent() {
        const loadPower = Number(document.getElementById('loadPower').value);
        const loadVoltage = Number(document.getElementById('loadVoltage').value);
        
        if (loadPower > 0 && loadVoltage > 0) {
            const loadCurrent = loadPower / loadVoltage;
            document.getElementById('loadCurrent').value = loadCurrent.toFixed(1);
        }
    }

    updateProtectionRatingHelp() {
        const protectionType = document.getElementById('protectionType').value;
        const helpElement = document.getElementById('protectionRatingHelp');
        
        if (protectionType === 'RCD') {
            helpElement.textContent = 'RCD: mA (jellemző értékek: 10, 30, 100, 300 mA)';
        } else {
            helpElement.textContent = 'MCB/Biztosíték: A (jellemző értékek: 6, 10, 16, 20, 25, 32, 40, 63 A)';
        }
    }

    calculate() {
        this.updateData();
        
        try {
            // Rövidzárlati áram számítás
            const shortCircuitCurrent = this.data.systemVoltage / this.data.loopImpedance;
            
            // Érintési feszültség számítás
            const touchVoltage = this.calculateTouchVoltage();
            
            // Kioldási idő számítás
            const disconnectionTime = this.calculateDisconnectionTime(shortCircuitCurrent);
            
            // Védelem megfelelőség ellenőrzése
            const protectionAdequate = this.checkProtectionAdequacy(shortCircuitCurrent, disconnectionTime);
            
            // Érintésvédelem ellenőrzése
            const touchProtectionAdequate = this.checkTouchProtection(touchVoltage, disconnectionTime);
            
            // Rendszer megfelelőség
            const systemAdequate = protectionAdequate && touchProtectionAdequate;

            this.results = {
                shortCircuitCurrent,
                touchVoltage,
                disconnectionTime,
                protectionAdequate,
                touchProtectionAdequate,
                systemAdequate,
                maxAllowedTouchVoltage: this.getMaxAllowedTouchVoltage(),
                maxAllowedDisconnectionTime: this.data.maxDisconnectionTime
            };

            this.displayResults();

        } catch (error) {
            Utils.showMessage('Hiba történt a számítás során: ' + error.message, 'error');
        }
    }

    calculateTouchVoltage() {
        if (this.data.systemType === 'TT') {
            // TT rendszer: Ut = Ie × Re
            const earthFaultCurrent = this.data.systemVoltage / (this.data.earthResistance + this.data.neutralResistance);
            return earthFaultCurrent * this.data.earthResistance;
        } else {
            // TN rendszer: Ut = Isc × Zs
            const shortCircuitCurrent = this.data.systemVoltage / this.data.loopImpedance;
            return shortCircuitCurrent * this.data.loopImpedance;
        }
    }

    calculateDisconnectionTime(shortCircuitCurrent) {
        if (this.data.protectionType === 'RCD') {
            // RCD azonnali kioldás
            return 0.04; // 40 ms
        } else if (this.data.protectionType === 'MCB') {
            // MCB karakterisztika alapján
            const ratio = shortCircuitCurrent / this.data.protectionRating;
            if (ratio < 1.13) return 3600; // 1 óra
            if (ratio < 1.45) return 60; // 1 perc
            if (ratio >= 5) return 0.1; // 0.1 másodperc
            return 0.4; // 0.4 másodperc
        } else {
            // Biztosíték karakterisztika
            const ratio = shortCircuitCurrent / this.data.protectionRating;
            if (ratio < 1.5) return 3600;
            if (ratio < 2) return 60;
            if (ratio < 4) return 10;
            return 0.1;
        }
    }

    checkProtectionAdequacy(shortCircuitCurrent, disconnectionTime) {
        // Kioldó képesség ellenőrzés
        const breakingCapacityAdequate = shortCircuitCurrent <= (this.data.protectionBreakingCapacity * 1000);
        
        // Kioldási idő ellenőrzés
        const timeAdequate = disconnectionTime <= this.data.maxDisconnectionTime;
        
        return breakingCapacityAdequate && timeAdequate;
    }

    checkTouchProtection(touchVoltage, disconnectionTime) {
        const maxAllowedTouchVoltage = this.getMaxAllowedTouchVoltage();
        const touchVoltageAdequate = touchVoltage <= maxAllowedTouchVoltage;
        
        return touchVoltageAdequate;
    }

    getMaxAllowedTouchVoltage() {
        if (this.data.installationType === 'outdoor' || this.data.protectionClass === 'IP44' || this.data.protectionClass === 'IP65') {
            return this.data.maxTouchVoltageWet;
        } else {
            return this.data.maxTouchVoltage;
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
                    <div class="result-label">Érintési feszültség</div>
                    <div class="result-value" style="color: ${this.results.touchVoltage <= this.results.maxAllowedTouchVoltage ? 'var(--success)' : 'var(--error)'}">
                        ${Utils.formatNumber(this.results.touchVoltage, 1)}<span class="result-unit">V</span>
                    </div>
                </div>
                <div class="result-item">
                    <div class="result-label">Kioldási idő</div>
                    <div class="result-value" style="color: ${this.results.disconnectionTime <= this.results.maxAllowedDisconnectionTime ? 'var(--success)' : 'var(--error)'}">
                        ${Utils.formatNumber(this.results.disconnectionTime, 3)}<span class="result-unit">s</span>
                    </div>
                </div>
                <div class="result-item">
                    <div class="result-label">Max. megengedett érintési feszültség</div>
                    <div class="result-value">${Utils.formatNumber(this.results.maxAllowedTouchVoltage, 0)}<span class="result-unit">V</span></div>
                </div>
            </div>

            <div class="form-section">
                <h3>Védelem megfelelőség</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="result-label">Védelem megfelelősége</div>
                        <div class="result-value" style="color: ${this.results.protectionAdequate ? 'var(--success)' : 'var(--error)'}">
                            ${this.results.protectionAdequate ? '✅ Megfelelő' : '❌ Nem megfelelő'}
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Érintésvédelem</div>
                        <div class="result-value" style="color: ${this.results.touchProtectionAdequate ? 'var(--success)' : 'var(--error)'}">
                            ${this.results.touchProtectionAdequate ? '✅ Megfelelő' : '❌ Nem megfelelő'}
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h3>Rendszer értékelés</h3>
                <div class="status-message ${this.results.systemAdequate ? 'status-success' : 'status-error'}">
                    <span>${this.results.systemAdequate ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.systemAdequate ? 
                            'Az érintésvédelem megfelelő' : 
                            'Az érintésvédelem nem megfelelő - szükséges a védelem módosítása'
                        }
                    </span>
                </div>
            </div>

            <div class="form-section">
                <h3>Javaslatok</h3>
                <div class="status-message status-info">
                    <span>ℹ️</span>
                    <span>
                        ${this.getRecommendations()}
                    </span>
                </div>
            </div>
        `;

        // Status messages
        if (!this.results.systemAdequate) {
            Utils.showMessage('Az érintésvédelem nem megfelelő! Ellenőrizze a védelem beállításait.', 'error');
        } else {
            Utils.showMessage('Az érintésvédelem megfelelő.', 'success');
        }
    }

    getRecommendations() {
        const recommendations = [];
        
        if (!this.results.protectionAdequate) {
            recommendations.push('Növelje a védelmi eszköz kioldó képességét vagy csökkentse a hurokimpedanciát.');
        }
        
        if (!this.results.touchProtectionAdequate) {
            recommendations.push('Csökkentse az érintési feszültséget RCD beépítésével vagy földelési ellenállás csökkentésével.');
        }
        
        if (this.data.systemType === 'TT' && this.data.earthResistance > 50) {
            recommendations.push('A TT rendszerben javasolt az RCD használata és a földelési ellenállás csökkentése.');
        }
        
        if (this.data.protectionType !== 'RCD' && this.data.systemType === 'TT') {
            recommendations.push('TT rendszerben kötelező az RCD használata.');
        }
        
        return recommendations.length > 0 ? recommendations.join(' ') : 'A rendszer megfelelő beállításokkal rendelkezik.';
    }

    loadExample() {
        this.data = {
            systemType: 'TN-S',
            systemVoltage: 230,
            frequency: 50,
            protectionType: 'RCD',
            protectionRating: 30,
            protectionBreakingCapacity: 6,
            protectionTimeDelay: 0,
            loopImpedance: 0.5,
            earthResistance: 10,
            neutralResistance: 0.1,
            loadPower: 2000,
            loadCurrent: 8.7,
            loadVoltage: 230,
            ambientTemperature: 25,
            installationType: 'indoor',
            protectionClass: 'IP20',
            maxDisconnectionTime: 0.4,
            maxTouchVoltage: 50,
            maxTouchVoltageWet: 25
        };

        this.updateInputs();
        this.updateProtectionRatingHelp();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    updateInputs() {
        Object.keys(this.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.data[key];
            }
        });
    }

    exportResults() {
        if (!this.results.shortCircuitCurrent) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Rendszer típusa': this.data.systemType,
                'Rendszer feszültség (V)': this.data.systemVoltage,
                'Védelem típusa': this.data.protectionType,
                'Védelem névleges értéke': this.data.protectionRating,
                'Kioldó képesség (kA)': this.data.protectionBreakingCapacity,
                'Hurokimpedancia (Ω)': this.data.loopImpedance,
                'Földelési ellenállás (Ω)': this.data.earthResistance,
                'Rövidzárlati áram (A)': this.results.shortCircuitCurrent.toFixed(1),
                'Érintési feszültség (V)': this.results.touchVoltage.toFixed(1),
                'Kioldási idő (s)': this.results.disconnectionTime.toFixed(3),
                'Max. megengedett érintési feszültség (V)': this.results.maxAllowedTouchVoltage,
                'Max. megengedett kioldási idő (s)': this.results.maxAllowedDisconnectionTime,
                'Védelem megfelelőség': this.results.protectionAdequate ? 'Megfelelő' : 'Nem megfelelő',
                'Érintésvédelem': this.results.touchProtectionAdequate ? 'Megfelelő' : 'Nem megfelelő',
                'Rendszer megfelelőség': this.results.systemAdequate ? 'Megfelelő' : 'Nem megfelelő'
            }
        ];

        Utils.exportToCSV(exportData, 'erintesvedelem.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.protectionModule = ProtectionModule;

