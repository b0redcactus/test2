// DOM elemek
const checkAllBtn = document.getElementById('checkAll');
const uncheckAllBtn = document.getElementById('uncheckAll');
const resetAllBtn = document.getElementById('resetAll');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Állapot követés
let totalPlans = checkboxes.length;
let checkedPlans = 0;

// Progress bar frissítése
function updateProgress() {
    checkedPlans = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const percentage = totalPlans > 0 ? (checkedPlans / totalPlans) * 100 : 0;
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${checkedPlans}/${totalPlans} kiválasztva`;
    
    // Szín változtatás a progress bar-ban
    if (percentage === 100) {
        progressFill.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
    } else if (percentage >= 75) {
        progressFill.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
    } else {
        progressFill.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
}

// Plan item stílus frissítése
function updatePlanItemStyle(checkbox) {
    const planItem = checkbox.closest('.plan-item');
    if (checkbox.checked) {
        planItem.classList.add('checked');
    } else {
        planItem.classList.remove('checked');
    }
}

// Összes checkbox eseménykezelő
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        updatePlanItemStyle(this);
        updateProgress();
        
        // Animáció hozzáadása
        const planItem = this.closest('.plan-item');
        planItem.style.transform = 'scale(1.02)';
        setTimeout(() => {
            planItem.style.transform = '';
        }, 200);
    });
});

// Összes kijelölése
checkAllBtn.addEventListener('click', function() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        updatePlanItemStyle(checkbox);
    });
    updateProgress();
    
    // Gomb animáció
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Összes törlése
uncheckAllBtn.addEventListener('click', function() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        updatePlanItemStyle(checkbox);
    });
    updateProgress();
    
    // Gomb animáció
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Visszaállítás (localStorage-ból)
resetAllBtn.addEventListener('click', function() {
    if (confirm('Biztosan visszaállítod az összes beállítást?')) {
        localStorage.removeItem('pvSubstationChecklist');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            updatePlanItemStyle(checkbox);
        });
        updateProgress();
        
        // Gomb animáció
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        showNotification('Beállítások visszaállítva!', 'success');
    }
});

// LocalStorage mentés és betöltés
function saveToLocalStorage() {
    const state = {};
    checkboxes.forEach(checkbox => {
        state[checkbox.getAttribute('data-category') + '_' + checkbox.getAttribute('data-subcategory') + '_' + checkbox.nextElementSibling.textContent] = checkbox.checked;
    });
    localStorage.setItem('pvSubstationChecklist', JSON.stringify(state));
}

function loadFromLocalStorage() {
    const savedState = localStorage.getItem('pvSubstationChecklist');
    if (savedState) {
        const state = JSON.parse(savedState);
        checkboxes.forEach(checkbox => {
            const key = checkbox.getAttribute('data-category') + '_' + checkbox.getAttribute('data-subcategory') + '_' + checkbox.nextElementSibling.textContent;
            if (state[key] !== undefined) {
                checkbox.checked = state[key];
                updatePlanItemStyle(checkbox);
            }
        });
        updateProgress();
    }
}

// Automatikus mentés checkbox változáskor
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', saveToLocalStorage);
});

// Notification rendszer
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Stílus hozzáadása
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animáció bejövés
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Automatikus eltávolítás
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Kategória szerinti szűrés (jövőbeli funkció)
function filterByCategory(category) {
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => {
        if (category === 'all' || section.querySelector(`[data-category="${category}"]`)) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Keresés funkció (jövőbeli funkció)
function searchPlans(searchTerm) {
    const planItems = document.querySelectorAll('.plan-item');
    planItems.forEach(item => {
        const planName = item.querySelector('.plan-name').textContent.toLowerCase();
        const planDescription = item.querySelector('.plan-description').textContent.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        if (planName.includes(searchLower) || planDescription.includes(searchLower)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+A: összes kijelölése
    if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        checkAllBtn.click();
    }
    
    // Ctrl+D: összes törlése
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        uncheckAllBtn.click();
    }
    
    // Ctrl+R: visszaállítás
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetAllBtn.click();
    }
});

// Drag and drop funkció (jövőbeli funkció)
function enableDragAndDrop() {
    const planItems = document.querySelectorAll('.plan-item');
    
    planItems.forEach(item => {
        item.draggable = true;
        
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.querySelector('.plan-name').textContent);
            this.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
        });
    });
}

// Statisztikák megjelenítése
function showStatistics() {
    const pvChecked = document.querySelectorAll('[data-category="pv"]:checked').length;
    const substationChecked = document.querySelectorAll('[data-category="substation"]:checked').length;
    
    const stats = `
        PV tervek: ${pvChecked} kiválasztva
        Alállomási tervek: ${substationChecked} kiválasztva
        Összesen: ${checkedPlans}/${totalPlans}
    `;
    
    showNotification(stats, 'info');
}

// Export funkció (jövőbeli funkció)
function exportChecklist() {
    const checkedItems = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const category = checkbox.getAttribute('data-category');
        const subcategory = checkbox.getAttribute('data-subcategory');
        const name = checkbox.nextElementSibling.textContent;
        checkedItems.push(`${category} - ${subcategory}: ${name}`);
    });
    
    const exportData = {
        timestamp: new Date().toISOString(),
        totalPlans: totalPlans,
        checkedPlans: checkedPlans,
        checkedItems: checkedItems
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `tervcsomag-ellenorzes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Inicializálás
document.addEventListener('DOMContentLoaded', function() {
    // LocalStorage betöltése
    loadFromLocalStorage();
    
    // Progress bar inicializálása
    updateProgress();
    
    // Drag and drop engedélyezése
    enableDragAndDrop();
    
    // Üdvözlő üzenet
    setTimeout(() => {
        showNotification('Üdvözöljük a PV és Alállomási Tervtípusok Ellenőrzőben!', 'success');
    }, 1000);
    
    // Automatikus mentés engedélyezése
    setInterval(saveToLocalStorage, 30000); // 30 másodpercenként mentés
});

// Service Worker regisztrálása (PWA támogatás)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker regisztrálva:', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker regisztráció sikertelen:', error);
            });
    });
}

// Online/offline állapot kezelése
window.addEventListener('online', function() {
    showNotification('Kapcsolat helyreállt!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Nincs internetkapcsolat! Az adatok helyi tárolásban vannak.', 'error');
});

// Teljesítmény optimalizálás
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced progress update
const debouncedUpdateProgress = debounce(updateProgress, 100);

// Accessibility javítások
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Focus management
function focusNextCheckbox(currentCheckbox) {
    const allCheckboxes = Array.from(checkboxes);
    const currentIndex = allCheckboxes.indexOf(currentCheckbox);
    const nextCheckbox = allCheckboxes[currentIndex + 1];
    
    if (nextCheckbox) {
        nextCheckbox.focus();
    }
}

function focusPreviousCheckbox(currentCheckbox) {
    const allCheckboxes = Array.from(checkboxes);
    const currentIndex = allCheckboxes.indexOf(currentCheckbox);
    const previousCheckbox = allCheckboxes[currentIndex - 1];
    
    if (previousCheckbox) {
        previousCheckbox.focus();
    }
}

// Arrow key navigation
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusNextCheckbox(this);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusPreviousCheckbox(this);
        }
    });
});
