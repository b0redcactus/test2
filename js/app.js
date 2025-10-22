// ===== Main Application =====
class ElectricalCalculatorApp {
    constructor() {
        this.currentModule = null;
        this.modules = new Map();
        this.init();
    }

    init() {
        this.setupModules();
        this.setupRouting();
        this.setupEventListeners();
        this.render();
    }

    setupModules() {
        // Import and register all modules
        this.modules.set('short-circuit', {
            title: 'Rövidzárlati áram és hurokimpedancia',
            description: 'Ik számítás, hurokimpedancia meghatározás, védelmi eszközök kiválasztása',
            icon: '⚡',
            tags: ['Rövidzárlat', 'Hurokimpedancia', 'Védelem'],
            component: () => this.loadModule('short-circuit')
        });

        this.modules.set('selectivity', {
            title: 'Szelektivitás és időkoordináció',
            description: 'Védelmi eszközök koordinálása, szelektivitás ellenőrzés, idő-beállítások',
            icon: '🔄',
            tags: ['Szelektivitás', 'Koordináció', 'Védelem'],
            component: () => this.loadModule('selectivity')
        });

        this.modules.set('power', {
            title: 'Teljesítmény és meddőkompenzáció',
            description: 'cosφ számítás, meddőteljesítmény kompenzáció, kondenzátor méretezés',
            icon: '⚙️',
            tags: ['Teljesítmény', 'cosφ', 'Kompenzáció'],
            component: () => this.loadModule('power')
        });

        this.modules.set('energy', {
            title: 'Energiafogyasztás és költségbecslés',
            description: 'Energiafogyasztás számítás, költségbecslés, megtérülési idő',
            icon: '💰',
            tags: ['Energia', 'Költség', 'Megtérülés'],
            component: () => this.loadModule('energy')
        });

        this.modules.set('protection', {
            title: 'Érintésvédelem és kioldási idő',
            description: 'Érintésvédelmi kioldási idő ellenőrzés, RCD kiválasztás',
            icon: '🛡️',
            tags: ['Érintésvédelem', 'RCD', 'Kioldás'],
            component: () => this.loadModule('protection')
        });

        this.modules.set('thermal', {
            title: 'Hőhatás és kábelmelegedés',
            description: 'Kábel hőhatás számítás, melegedés ellenőrzés, terhelhetőség',
            icon: '🌡️',
            tags: ['Hőhatás', 'Kábel', 'Melegedés'],
            component: () => this.loadModule('thermal')
        });

        this.modules.set('battery', {
            title: 'Akkumulátor kapacitás és üzemidő',
            description: 'UPS és off-grid rendszerek, akkumulátor méretezés, üzemidő számítás',
            icon: '🔋',
            tags: ['Akkumulátor', 'UPS', 'Off-grid'],
            component: () => this.loadModule('battery')
        });

        this.modules.set('voltage-drop', {
            title: 'Feszültségesés számítás',
            description: 'Többszakaszos feszültségesés, 1f/3f támogatás, kábel méretezés',
            icon: '📉',
            tags: ['Feszültségesés', 'Kábel', 'Méretezés'],
            component: () => this.loadModule('voltage-drop')
        });

        // Additional modules for electrical engineers
        this.modules.set('transformer', {
            title: 'Transzformátor számítások',
            description: 'Transzformátor méretezés, veszteségek, hatásfok számítás',
            icon: '🔄',
            tags: ['Transzformátor', 'Veszteség', 'Hatásfok'],
            component: () => this.loadModule('transformer')
        });

        this.modules.set('cable-sizing', {
            title: 'Kábel méretezés',
            description: 'Kábel keresztmetszet meghatározás, terhelhetőség, feszültségesés',
            icon: '🔌',
            tags: ['Kábel', 'Méretezés', 'Terhelhetőség'],
            component: () => this.loadModule('cable-sizing')
        });

        this.modules.set('motor-protection', {
            title: 'Motor védelem',
            description: 'Motor indítási áramok, védelmi eszközök, motorstarter méretezés',
            icon: '🔧',
            tags: ['Motor', 'Védelem', 'Indítás'],
            component: () => this.loadModule('motor-protection')
        });

        this.modules.set('lightning-protection', {
            title: 'Villámvédelem',
            description: 'Villámvédelem méretezés, levezető rendszer, földelés',
            icon: '⚡',
            tags: ['Villámvédelem', 'Földelés', 'Levezető'],
            component: () => this.loadModule('lightning-protection')
        });
    }

    setupRouting() {
        // Hash-based routing
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.slice(1);
        const moduleId = hash.split('/')[0];
        
        if (moduleId && this.modules.has(moduleId)) {
            this.showModule(moduleId);
        } else {
            this.showDashboard();
        }
    }

    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                // Mobile menu toggle logic can be added here
            });
        }
    }

    async showDashboard() {
        this.currentModule = null;
        this.render();
    }

    async showModule(moduleId) {
        this.currentModule = moduleId;
        this.render();
    }

    async loadModule(moduleId) {
        // Dinamikus modul betöltés script taggal
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = `js/modules/${moduleId}.js`;
            script.onload = () => {
                // A modul betöltése után a globális változóban elérhető
                const moduleName = this.getModuleClassName(moduleId);
                if (window[moduleName]) {
                    resolve({ default: window[moduleName] });
                } else {
                    reject(new Error(`Module ${moduleId} not found`));
                }
            };
            script.onerror = () => reject(new Error(`Failed to load module ${moduleId}`));
            document.head.appendChild(script);
        });
    }

    getModuleClassName(moduleId) {
        const classNames = {
            'short-circuit': 'shortCircuitModule',
            'voltage-drop': 'voltageDropModule',
            'power': 'powerModule',
            'battery': 'batteryModule',
            'thermal': 'thermalModule',
            'selectivity': 'selectivityModule',
            'energy': 'energyModule',
            'protection': 'protectionModule'
        };
        return classNames[moduleId] || `${moduleId}Module`;
    }

    async render() {
        const mainContent = document.getElementById('mainContent');
        
        if (this.currentModule) {
            await this.renderModule();
  } else {
            this.renderDashboard();
        }
    }

    renderDashboard() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div class="dashboard fade-in">
                <h1 class="dashboard-title">Villamos Kalkulátorok</h1>
                <p class="dashboard-subtitle">
                    Professzionális elektromérnöki eszközök gyűjteménye. 
                    Rövidzárlati áramok, feszültségesés, védelmi eszközök és egyéb villamos számítások.
                </p>
                
                <div class="calculator-grid">
                    ${Array.from(this.modules.entries()).map(([id, module]) => `
                        <a href="#/${id}" class="calculator-card" data-module="${id}">
                            <div class="calculator-icon">${module.icon}</div>
                            <h3 class="calculator-title">${module.title}</h3>
                            <p class="calculator-description">${module.description}</p>
                            <div class="calculator-tags">
                                ${module.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async renderModule() {
        const mainContent = document.getElementById('mainContent');
        const module = this.modules.get(this.currentModule);
        
        if (!module) {
            this.renderDashboard();
            return;
        }

        try {
            const ModuleComponent = await module.component();
            const moduleInstance = new ModuleComponent.default();
            
            mainContent.innerHTML = `
                <div class="module-container fade-in">
                    <div class="module-header">
                        <a href="#/" class="back-button">
                            ← Vissza a főoldalra
                        </a>
                        <h1 class="module-title">${module.title}</h1>
                        <p class="module-description">${module.description}</p>
                    </div>
                    <div id="module-content"></div>
                </div>
            `;

            const moduleContent = document.getElementById('module-content');
            window.currentModule = moduleInstance;
            await moduleInstance.render(moduleContent);
        } catch (error) {
            console.error('Error loading module:', error);
            mainContent.innerHTML = `
                <div class="module-container">
                    <div class="status-message status-error">
                        <span>❌</span>
                        <span>Hiba történt a modul betöltése során. Kérjük, próbálja újra.</span>
                    </div>
                    <a href="#/" class="btn btn-primary">Vissza a főoldalra</a>
                </div>
            `;
        }
    }
}

// ===== Utility Functions =====
class Utils {
    static formatNumber(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) return '—';
        return Number(value).toFixed(decimals);
    }

    static formatUnit(value, unit, decimals = 2) {
        return `${this.formatNumber(value, decimals)} ${unit}`;
    }

    static validateInput(value, min = null, max = null) {
        const num = Number(value);
        if (isNaN(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    }

    static showMessage(message, type = 'info', container = null) {
        const messageEl = document.createElement('div');
        messageEl.className = `status-message status-${type}`;
        messageEl.innerHTML = `
            <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
        `;

        if (container) {
            container.appendChild(messageEl);
        } else {
            document.getElementById('module-content').appendChild(messageEl);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

    static saveToStorage(key, data) {
        try {
            localStorage.setItem(`electrical-calc-${key}`, JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    static loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`electrical-calc-${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
    return null;
        }
    }

    static exportToCSV(data, filename) {
        const csv = this.convertToCSV(data);
        this.downloadFile(csv, filename, 'text/csv');
    }

    static exportToPDF(data, filename) {
        // Simple PDF generation using browser print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${filename}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { text-align: center; margin-bottom: 30px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Villamos Kalkulátor - ${filename}</h1>
                        <p>Generálva: ${new Date().toLocaleString('hu-HU')}</p>
                    </div>
                    ${data}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    static convertToCSV(data) {
        if (Array.isArray(data)) {
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
            ].join('\n');
            return csvContent;
        }
        return '';
    }

    static downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// ===== Base Module Class =====
class BaseModule {
    constructor() {
        this.data = {};
        this.results = {};
    }

    async render(container) {
        // Override in subclasses
    }

    calculate() {
        // Override in subclasses
    }

    saveData() {
        Utils.saveToStorage(this.constructor.name, this.data);
    }

    loadData() {
        const saved = Utils.loadFromStorage(this.constructor.name);
        if (saved) {
            this.data = saved;
            this.updateInputs();
        }
    }

    updateInputs() {
        // Override in subclasses to update form inputs
    }

    exportResults() {
        // Override in subclasses
    }

    loadExample() {
        // Override in subclasses
    }
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ElectricalCalculatorApp();
    window.Utils = Utils;
    window.BaseModule = BaseModule;
});

// Export for module system
export { ElectricalCalculatorApp, Utils, BaseModule };