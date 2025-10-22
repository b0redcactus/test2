// ===== Szelektivitás és időkoordináció modul =====
class SelectivityModule extends BaseModule {
    constructor() {
        super();
        this.data = {
            // Rendszer adatok
            systemVoltage: 400, // V
            systemType: '3f', // '1f', '3f'
            frequency: 50, // Hz
            
            // Védelem adatok
            protections: [
                {
                    id: 1,
                    name: 'Fővédelem',
                    type: 'mcb', // 'fuse', 'mcb', 'mccb', 'relay'
                    rating: 250, // A
                    breakingCapacity: 25, // kA
                    characteristic: 'C', // 'B', 'C', 'D'
                    timeDelay: 0, // s
                    enabled: true
                },
                {
                    id: 2,
                    name: 'Elágazó védelem',
                    type: 'mcb',
                    rating: 63, // A
                    breakingCapacity: 6, // kA
                    characteristic: 'C',
                    timeDelay: 0,
                    enabled: true
                },
                {
                    id: 3,
                    name: 'Végpont védelem',
                    type: 'mcb',
                    rating: 16, // A
                    breakingCapacity: 6, // kA
                    characteristic: 'B',
                    timeDelay: 0,
                    enabled: true
                }
            ],
            
            // Rövidzárlati adatok
            shortCircuitCurrent: 15000, // A
            earthFaultCurrent: 5000, // A
            
            // Koordináció követelmények
            selectivityMargin: 0.1, // 10%
            timeMargin: 0.1, // 10%
            minimumTimeDelay: 0.1, // s
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
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">2</span>
                    Rövidzárlati adatok
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="shortCircuitCurrent">Rövidzárlati áram (A)</label>
                        <input type="number" id="shortCircuitCurrent" class="form-input" value="${this.data.shortCircuitCurrent}" min="100" max="100000" step="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="earthFaultCurrent">Földzárlati áram (A)</label>
                        <input type="number" id="earthFaultCurrent" class="form-input" value="${this.data.earthFaultCurrent}" min="10" max="10000" step="10">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">3</span>
                    Védelmi eszközök
                    <button class="btn btn-secondary btn-sm" onclick="window.currentModule.addProtection()" style="margin-left: auto;">
                        + Új védelem
                    </button>
                </h2>
                <div id="protections-container">
                    ${this.renderProtections()}
                </div>
            </div>

            <div class="form-section">
                <h2 class="section-title">
                    <span class="section-number">4</span>
                    Koordináció beállítások
                </h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" for="selectivityMargin">Szelektivitási margó (%)</label>
                        <input type="number" id="selectivityMargin" class="form-input" value="${this.data.selectivityMargin * 100}" min="5" max="50" step="1">
                        <div class="form-help">Jellemző értékek: 10-20%</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="timeMargin">Idő margó (%)</label>
                        <input type="number" id="timeMargin" class="form-input" value="${this.data.timeMargin * 100}" min="5" max="50" step="1">
                        <div class="form-help">Jellemző értékek: 10-20%</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="minimumTimeDelay">Minimális idő késleltetés (s)</label>
                        <input type="number" id="minimumTimeDelay" class="form-input" value="${this.data.minimumTimeDelay}" min="0.05" max="1" step="0.05">
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
                    <span>🔄</span>
                    Szelektivitás eredmények
                </h2>
                <div id="results-content"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    renderProtections() {
        return this.data.protections.map((protection, index) => `
            <div class="protection-item" data-protection-id="${protection.id}">
                <div class="protection-header">
                    <h3>${protection.name}</h3>
                    <div class="protection-controls">
                        <label class="checkbox-label">
                            <input type="checkbox" ${protection.enabled ? 'checked' : ''} onchange="window.currentModule.toggleProtection(${protection.id})">
                            Aktív
                        </label>
                        ${this.data.protections.length > 1 ? `<button class="btn btn-error btn-sm" onclick="window.currentModule.removeProtection(${protection.id})">Törlés</button>` : ''}
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Védelem neve</label>
                        <input type="text" class="form-input" value="${protection.name}" onchange="window.currentModule.updateProtectionName(${protection.id}, this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Típus</label>
                        <select class="form-select" onchange="window.currentModule.updateProtection(${protection.id}, 'type', this.value)">
                            <option value="fuse" ${protection.type === 'fuse' ? 'selected' : ''}>Biztosíték</option>
                            <option value="mcb" ${protection.type === 'mcb' ? 'selected' : ''}>MCB</option>
                            <option value="mccb" ${protection.type === 'mccb' ? 'selected' : ''}>MCCB</option>
                            <option value="relay" ${protection.type === 'relay' ? 'selected' : ''}>Relé</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Névleges áram (A)</label>
                        <input type="number" class="form-input" value="${protection.rating}" min="1" max="10000" step="1" onchange="window.currentModule.updateProtection(${protection.id}, 'rating', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kioldó képesség (kA)</label>
                        <input type="number" class="form-input" value="${protection.breakingCapacity}" min="1" max="200" step="1" onchange="window.currentModule.updateProtection(${protection.id}, 'breakingCapacity', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Jellemző</label>
                        <select class="form-select" onchange="window.currentModule.updateProtection(${protection.id}, 'characteristic', this.value)">
                            <option value="B" ${protection.characteristic === 'B' ? 'selected' : ''}>B (3-5×)</option>
                            <option value="C" ${protection.characteristic === 'C' ? 'selected' : ''}>C (5-10×)</option>
                            <option value="D" ${protection.characteristic === 'D' ? 'selected' : ''}>D (10-20×)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Idő késleltetés (s)</label>
                        <input type="number" class="form-input" value="${protection.timeDelay}" min="0" max="10" step="0.1" onchange="window.currentModule.updateProtection(${protection.id}, 'timeDelay', this.value)">
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // System data listeners
        ['systemVoltage', 'systemType', 'frequency', 'shortCircuitCurrent', 'earthFaultCurrent',
         'selectivityMargin', 'timeMargin', 'minimumTimeDelay'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateSystemData();
                });
            }
        });
    }

    updateSystemData() {
        this.data.systemVoltage = Number(document.getElementById('systemVoltage').value);
        this.data.systemType = document.getElementById('systemType').value;
        this.data.frequency = Number(document.getElementById('frequency').value);
        this.data.shortCircuitCurrent = Number(document.getElementById('shortCircuitCurrent').value);
        this.data.earthFaultCurrent = Number(document.getElementById('earthFaultCurrent').value);
        this.data.selectivityMargin = Number(document.getElementById('selectivityMargin').value) / 100;
        this.data.timeMargin = Number(document.getElementById('timeMargin').value) / 100;
        this.data.minimumTimeDelay = Number(document.getElementById('minimumTimeDelay').value);
    }

    addProtection() {
        const newId = Math.max(...this.data.protections.map(p => p.id)) + 1;
        const newProtection = {
            id: newId,
            name: `Védelem ${newId}`,
            type: 'mcb',
            rating: 16,
            breakingCapacity: 6,
            characteristic: 'B',
            timeDelay: 0,
            enabled: true
        };
        
        this.data.protections.push(newProtection);
        this.renderProtectionsContainer();
    }

    removeProtection(protectionId) {
        if (this.data.protections.length > 1) {
            this.data.protections = this.data.protections.filter(p => p.id !== protectionId);
            this.renderProtectionsContainer();
        }
    }

    toggleProtection(protectionId) {
        const protection = this.data.protections.find(p => p.id === protectionId);
        if (protection) {
            protection.enabled = !protection.enabled;
        }
    }

    updateProtectionName(protectionId, name) {
        const protection = this.data.protections.find(p => p.id === protectionId);
        if (protection) {
            protection.name = name;
        }
    }

    updateProtection(protectionId, field, value) {
        const protection = this.data.protections.find(p => p.id === protectionId);
        if (protection) {
            protection[field] = field === 'rating' || field === 'breakingCapacity' || field === 'timeDelay' ? Number(value) : value;
        }
    }

    renderProtectionsContainer() {
        document.getElementById('protections-container').innerHTML = this.renderProtections();
    }

    calculate() {
        this.updateSystemData();
        
        try {
            const enabledProtections = this.data.protections.filter(p => p.enabled);
            if (enabledProtections.length < 2) {
                Utils.showMessage('Legalább két védelmi eszközt aktiváljon!', 'warning');
                return;
            }

            // Védelem karakterisztikák számítása
            const protectionCharacteristics = enabledProtections.map(protection => {
                const characteristics = this.getProtectionCharacteristics(protection);
                return {
                    ...protection,
                    ...characteristics
                };
            });

            // Szelektivitás ellenőrzés
            const selectivityResults = this.checkSelectivity(protectionCharacteristics);
            
            // Időkoordináció ellenőrzés
            const timeCoordinationResults = this.checkTimeCoordination(protectionCharacteristics);
            
            // Védelem megfelelőség
            const protectionAdequacy = this.checkProtectionAdequacy(protectionCharacteristics);

            this.results = {
                protectionCharacteristics,
                selectivityResults,
                timeCoordinationResults,
                protectionAdequacy,
                systemAdequate: selectivityResults.adequate && timeCoordinationResults.adequate && protectionAdequacy.adequate
            };

            this.displayResults();

        } catch (error) {
            Utils.showMessage('Hiba történt a számítás során: ' + error.message, 'error');
        }
    }

    getProtectionCharacteristics(protection) {
        const tripCurrent = this.getTripCurrent(protection.rating, protection.characteristic);
        const tripTime = this.getTripTime(protection, this.data.shortCircuitCurrent);
        const breakingCapacityAdequate = this.data.shortCircuitCurrent <= (protection.breakingCapacity * 1000);
        
        return {
            tripCurrent,
            tripTime,
            breakingCapacityAdequate
        };
    }

    getTripCurrent(rating, characteristic) {
        const multipliers = { 'B': 5, 'C': 10, 'D': 20 };
        return rating * multipliers[characteristic];
    }

    getTripTime(protection, shortCircuitCurrent) {
        if (protection.type === 'fuse') {
            return this.getFuseTripTime(protection.rating, shortCircuitCurrent);
        } else {
            return this.getMCBTripTime(protection, shortCircuitCurrent);
        }
    }

    getFuseTripTime(rating, current) {
        // Egyszerűsített biztosíték karakterisztika
        const ratio = current / rating;
        if (ratio < 1.5) return 3600; // 1 óra
        if (ratio < 2) return 60; // 1 perc
        if (ratio < 4) return 10; // 10 másodperc
        return 0.1; // 0.1 másodperc
    }

    getMCBTripTime(protection, current) {
        const ratio = current / protection.rating;
        const characteristic = protection.characteristic;
        
        if (ratio < 1.13) return 3600; // 1 óra
        if (ratio < 1.45) return 60; // 1 perc
        
        if (characteristic === 'B' && ratio >= 3 && ratio <= 5) return 0.1;
        if (characteristic === 'C' && ratio >= 5 && ratio <= 10) return 0.1;
        if (characteristic === 'D' && ratio >= 10 && ratio <= 20) return 0.1;
        
        return 0.01; // 0.01 másodperc
    }

    checkSelectivity(protections) {
        const issues = [];
        let adequate = true;

        for (let i = 0; i < protections.length - 1; i++) {
            const current = protections[i];
            const next = protections[i + 1];
            
            const currentTripTime = current.tripTime + current.timeDelay;
            const nextTripTime = next.tripTime + next.timeDelay;
            
            const timeMargin = (currentTripTime - nextTripTime) / nextTripTime;
            
            if (timeMargin < this.data.timeMargin) {
                issues.push(`${current.name} és ${next.name} között nincs megfelelő idő margó`);
                adequate = false;
            }
        }

        return { adequate, issues };
    }

    checkTimeCoordination(protections) {
        const issues = [];
        let adequate = true;

        for (let i = 0; i < protections.length - 1; i++) {
            const current = protections[i];
            const next = protections[i + 1];
            
            if (current.tripTime <= next.tripTime) {
                issues.push(`${current.name} kioldási ideje nem nagyobb, mint ${next.name} kioldási ideje`);
                adequate = false;
            }
        }

        return { adequate, issues };
    }

    checkProtectionAdequacy(protections) {
        const issues = [];
        let adequate = true;

        protections.forEach(protection => {
            if (!protection.breakingCapacityAdequate) {
                issues.push(`${protection.name} kioldó képessége nem megfelelő`);
                adequate = false;
            }
        });

        return { adequate, issues };
    }

    displayResults() {
        const resultsSection = document.getElementById('results-section');
        const resultsContent = document.getElementById('results-content');

        resultsSection.style.display = 'block';

        resultsContent.innerHTML = `
            <div class="form-section">
                <h3>Védelem karakterisztikák</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Védelem</th>
                                <th>Típus</th>
                                <th>Névleges áram (A)</th>
                                <th>Kioldó képesség (kA)</th>
                                <th>Kioldási áram (A)</th>
                                <th>Kioldási idő (s)</th>
                                <th>Megfelelőség</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.results.protectionCharacteristics.map(protection => `
                                <tr>
                                    <td>${protection.name}</td>
                                    <td>${protection.type.toUpperCase()}</td>
                                    <td>${protection.rating}</td>
                                    <td>${protection.breakingCapacity}</td>
                                    <td>${Utils.formatNumber(protection.tripCurrent, 0)}</td>
                                    <td>${Utils.formatNumber(protection.tripTime, 3)}</td>
                                    <td style="color: ${protection.breakingCapacityAdequate ? 'var(--success)' : 'var(--error)'}">
                                        ${protection.breakingCapacityAdequate ? '✅' : '❌'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="form-section">
                <h3>Szelektivitás ellenőrzés</h3>
                <div class="status-message ${this.results.selectivityResults.adequate ? 'status-success' : 'status-error'}">
                    <span>${this.results.selectivityResults.adequate ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.selectivityResults.adequate ? 
                            'A szelektivitás megfelelő' : 
                            'A szelektivitás nem megfelelő'
                        }
                    </span>
                </div>
                ${this.results.selectivityResults.issues.length > 0 ? `
                    <ul style="margin-top: 1rem; color: var(--error);">
                        ${this.results.selectivityResults.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>

            <div class="form-section">
                <h3>Időkoordináció ellenőrzés</h3>
                <div class="status-message ${this.results.timeCoordinationResults.adequate ? 'status-success' : 'status-error'}">
                    <span>${this.results.timeCoordinationResults.adequate ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.timeCoordinationResults.adequate ? 
                            'Az időkoordináció megfelelő' : 
                            'Az időkoordináció nem megfelelő'
                        }
                    </span>
                </div>
                ${this.results.timeCoordinationResults.issues.length > 0 ? `
                    <ul style="margin-top: 1rem; color: var(--error);">
                        ${this.results.timeCoordinationResults.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>

            <div class="form-section">
                <h3>Összesített értékelés</h3>
                <div class="status-message ${this.results.systemAdequate ? 'status-success' : 'status-error'}">
                    <span>${this.results.systemAdequate ? '✅' : '❌'}</span>
                    <span>
                        ${this.results.systemAdequate ? 
                            'A védelmi rendszer megfelelő' : 
                            'A védelmi rendszer nem megfelelő - szükséges a beállítások módosítása'
                        }
                    </span>
                </div>
            </div>
        `;

        // Status messages
        if (!this.results.systemAdequate) {
            Utils.showMessage('A védelmi rendszer nem megfelelő! Ellenőrizze a beállításokat.', 'error');
        } else {
            Utils.showMessage('A védelmi rendszer megfelelő és szelektív.', 'success');
        }
    }

    loadExample() {
        this.data = {
            systemVoltage: 400,
            systemType: '3f',
            frequency: 50,
            shortCircuitCurrent: 15000,
            earthFaultCurrent: 5000,
            protections: [
                {
                    id: 1,
                    name: 'Fővédelem',
                    type: 'mccb',
                    rating: 250,
                    breakingCapacity: 25,
                    characteristic: 'C',
                    timeDelay: 0.5,
                    enabled: true
                },
                {
                    id: 2,
                    name: 'Elágazó védelem',
                    type: 'mcb',
                    rating: 63,
                    breakingCapacity: 6,
                    characteristic: 'C',
                    timeDelay: 0.1,
                    enabled: true
                },
                {
                    id: 3,
                    name: 'Végpont védelem',
                    type: 'mcb',
                    rating: 16,
                    breakingCapacity: 6,
                    characteristic: 'B',
                    timeDelay: 0,
                    enabled: true
                }
            ],
            selectivityMargin: 0.1,
            timeMargin: 0.1,
            minimumTimeDelay: 0.1
        };

        this.renderProtectionsContainer();
        Utils.showMessage('Példa adatok betöltve', 'success');
    }

    exportResults() {
        if (!this.results.protectionCharacteristics) {
            Utils.showMessage('Először végezzen számítást!', 'warning');
            return;
        }

        const exportData = [
            {
                'Rendszer feszültség (V)': this.data.systemVoltage,
                'Rövidzárlati áram (A)': this.data.shortCircuitCurrent,
                'Földzárlati áram (A)': this.data.earthFaultCurrent,
                'Szelektivitás megfelelőség': this.results.selectivityResults.adequate ? 'Megfelelő' : 'Nem megfelelő',
                'Időkoordináció megfelelőség': this.results.timeCoordinationResults.adequate ? 'Megfelelő' : 'Nem megfelelő',
                'Védelem megfelelőség': this.results.protectionAdequacy.adequate ? 'Megfelelő' : 'Nem megfelelő',
                'Rendszer megfelelőség': this.results.systemAdequate ? 'Megfelelő' : 'Nem megfelelő'
            },
            ...this.results.protectionCharacteristics.map(protection => ({
                'Védelem': protection.name,
                'Típus': protection.type.toUpperCase(),
                'Névleges áram (A)': protection.rating,
                'Kioldó képesség (kA)': protection.breakingCapacity,
                'Kioldási áram (A)': protection.tripCurrent,
                'Kioldási idő (s)': protection.tripTime.toFixed(3),
                'Megfelelőség': protection.breakingCapacityAdequate ? 'Megfelelő' : 'Nem megfelelő'
            }))
        ];

        Utils.exportToCSV(exportData, 'szelektivitas_szamitas.csv');
    }
}

// Set current module for global access
window.currentModule = null;
window.selectivityModule = SelectivityModule;

