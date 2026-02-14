/**
 * Wings Fly Caregiver Academy - Settings Module
 * Category management, Data Import/Export, and System Reset
 */

function loadSettingsPage() {
    const settingsPage = document.getElementById('settings-page');
    if (!settingsPage) return;

    settingsPage.innerHTML = `
        <div class="dashboard-container">
            <h2 style="margin-bottom: var(--spacing-lg); color: var(--text-primary);">
                <i class="fas fa-cog"></i> Settings
            </h2>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                <!-- Category Management -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-tags"></i> Finance Categories</h3>
                    </div>
                    <div style="padding: var(--spacing-md);">
                        <div style="margin-bottom: 20px;">
                            <h4 style="font-size: 0.9rem; color: var(--success); margin-bottom: 10px;">Income Categories</h4>
                            <div id="incomeCategoriesList" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                                ${renderCategories('income')}
                            </div>
                            <div class="flex gap-1">
                                <input type="text" id="newIncomeCategory" class="form-input" placeholder="Add income category...">
                                <button class="btn-primary" onclick="addCategory('income')"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>

                        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 20px 0;">

                        <div>
                            <h4 style="font-size: 0.9rem; color: var(--error); margin-bottom: 10px;">Expense Categories</h4>
                            <div id="expenseCategoriesList" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                                ${renderCategories('expense')}
                            </div>
                            <div class="flex gap-1">
                                <input type="text" id="newExpenseCategory" class="form-input" placeholder="Add expense category...">
                                <button class="btn-primary" onclick="addCategory('expense')"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Utilities -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-tools"></i> Data & System</h3>
                    </div>
                    <div style="padding: var(--spacing-md); display: flex; flex-direction: column; gap: 15px;">
                        <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                            <h4 style="font-size: 0.9rem; margin-bottom: 10px;">Data Backup</h4>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Download all your data (Students, Finance, Accounts) as a JSON file for backup.</p>
                            <div class="flex gap-1">
                                <button class="btn-secondary" onclick="exportToCSV()" style="flex: 1;">
                                    <i class="fas fa-file-excel"></i> Export All Data
                                </button>
                            </div>
                        </div>

                        <div style="background: rgba(255,107,157,0.05); padding: 15px; border-radius: var(--radius-md); border: 1px solid rgba(255,107,157,0.1);">
                            <h4 style="font-size: 0.9rem; color: var(--error); margin-bottom: 10px;">System Reset</h4>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">This will permanently delete ALL data. Use with CAUTION!</p>
                            <button class="btn-primary" onclick="resetSystemData()" style="background: var(--error); width: 100%;">
                                <i class="fas fa-trash-alt"></i> RESET ALL DATA (RESTORE)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                <!-- Course Management -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-graduation-cap"></i> Course Management</h3>
                    </div>
                    <div style="padding: var(--spacing-md);">
                        <div id="coursesList" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                            ${AppState.courses.map(course => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 15px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                                    <span>${course}</span>
                                    <button class="icon-btn" onclick="removeCourse('${course}')" style="color: var(--error);">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex gap-1">
                            <input type="text" id="newCourseName" class="form-input" placeholder="Enter new course name...">
                            <button class="btn-primary" onclick="addCourse()">
                                <i class="fas fa-plus"></i> Add Course
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Batch Management -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-layer-group"></i> Batch Management</h3>
                    </div>
                    <div style="padding: var(--spacing-md);">
                        <div id="batchesList" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                            ${AppState.batches.map(batch => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 15px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                                    <span>${batch}</span>
                                    <button class="icon-btn" onclick="removeBatch('${batch}')" style="color: var(--error);">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex gap-1">
                            <input type="text" id="newBatchName" class="form-input" placeholder="Enter new batch name...">
                            <button class="btn-primary" onclick="addBatch()">
                                <i class="fas fa-plus"></i> Add Batch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCategories(type) {
    const categories = AppState.categories[type];
    return categories.map(cat => `
        <span class="badge ${type === 'income' ? 'success' : 'error'}" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px;">
            ${cat}
            <i class="fas fa-times" style="cursor: pointer; font-size: 0.7rem; opacity: 0.7;" onclick="removeCategory('${type}', '${cat}')"></i>
        </span>
    `).join('');
}

function addCategory(type) {
    const input = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}Category`);
    const val = input.value.trim();
    if (!val) return;

    if (AppState.categories[type].includes(val)) {
        showToast('Category already exists', 'warning');
        return;
    }

    AppState.categories[type].push(val);
    saveDataToStorage();
    loadSettingsPage();
    showToast('Category added', 'success');
}

function removeCategory(type, cat) {
    if (!confirm(`Remove category "${cat}"?`)) return;

    AppState.categories[type] = AppState.categories[type].filter(c => c !== cat);
    saveDataToStorage();
    loadSettingsPage();
}

// Course Management
function addCourse() {
    const input = document.getElementById('newCourseName');
    const val = input.value.trim();
    if (!val) return;

    if (AppState.courses.includes(val)) {
        showToast('Course already exists', 'warning');
        return;
    }

    AppState.courses.push(val);
    saveDataToStorage();
    loadSettingsPage();
    showToast('Course added successfully', 'success');
}

function removeCourse(course) {
    if (!confirm(`Are you sure you want to remove the course "${course}"?`)) return;

    AppState.courses = AppState.courses.filter(c => c !== course);
    saveDataToStorage();
    loadSettingsPage();
    showToast('Course removed', 'info');
}

// Batch Management
function addBatch() {
    const input = document.getElementById('newBatchName');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;

    if (AppState.batches.includes(val)) {
        showToast('Batch already exists', 'warning');
        return;
    }

    AppState.batches.push(val);
    saveDataToStorage();
    loadSettingsPage();
    showToast('Batch added successfully', 'success');
}

function removeBatch(batch) {
    if (!confirm(`Are you sure you want to remove the batch "${batch}"?`)) return;

    AppState.batches = AppState.batches.filter(b => b !== batch);
    saveDataToStorage();
    loadSettingsPage();
    showToast('Batch removed', 'info');
}

function resetSystemData() {
    const pass1 = confirm('Are you sure you want to RESET ALL DATA? This cannot be undone.');
    if (!pass1) return;

    const pass2 = prompt('To confirm reset, please type "RESET" below:');
    if (pass2 !== 'RESET') {
        showToast('Reset cancelled', 'info');
        return;
    }

    // Clear everything
    localStorage.clear();

    showToast('System reset successful. Reloading...', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

console.log('Settings Module Loaded');
