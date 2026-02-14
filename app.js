/**
 * Wings Fly Caregiver Academy - Main App Logic
 * Core application functionality and navigation
 */

// ==================== Global State ====================
const AppState = {
    students: [],
    transactions: [],
    accounts: {
        cash: 0,
        banks: [],
        mobileBanking: []
    },
    currentPage: 'dashboard',
    initialized: false
};

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    showLoading();
    
    // Load data from localStorage
    loadDataFromStorage();
    
    // If no data, import from CSV
    if (AppState.students.length === 0) {
        await importCSVData();
    }
    
    // Initialize UI
    initializeNavigation();
    initializeModals();
    initializeHeader();
    
    // Load initial page (Dashboard)
    loadPage('dashboard');
    
    AppState.initialized = true;
    hideLoading();
    
    showToast('Welcome to Wings Fly Caregiver Academy!', 'success');
}

// ==================== Data Management ====================
function loadDataFromStorage() {
    try {
        const storedStudents = localStorage.getItem('wf_students');
        const storedTransactions = localStorage.getItem('wf_transactions');
        const storedAccounts = localStorage.getItem('wf_accounts');
        
        if (storedStudents) {
            AppState.students = JSON.parse(storedStudents);
        }
        if (storedTransactions) {
            AppState.transactions = JSON.parse(storedTransactions);
        }
        if (storedAccounts) {
            AppState.accounts = JSON.parse(storedAccounts);
        }
    } catch (error) {
        console.error('Error loading data from storage:', error);
        showToast('Error loading data', 'error');
    }
}

function saveDataToStorage() {
    try {
        localStorage.setItem('wf_students', JSON.stringify(AppState.students));
        localStorage.setItem('wf_transactions', JSON.stringify(AppState.transactions));
        localStorage.setItem('wf_accounts', JSON.stringify(AppState.accounts));
    } catch (error) {
        console.error('Error saving data to storage:', error);
        showToast('Error saving data', 'error');
    }
}

// ==================== Navigation ====================
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Update active page content
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Load page content
    loadPage(page);
    
    AppState.currentPage = page;
}

function loadPage(page) {
    switch(page) {
        case 'dashboard':
            if (typeof loadDashboard === 'function') {
                loadDashboard();
            }
            break;
        case 'students':
            if (typeof loadStudentsPage === 'function') {
                loadStudentsPage();
            }
            break;
        case 'finance':
            if (typeof loadFinancePage === 'function') {
                loadFinancePage();
            }
            break;
        case 'accounts':
            if (typeof loadAccountsPage === 'function') {
                loadAccountsPage();
            }
            break;
        default:
            console.log(`Page ${page} not implemented yet`);
    }
}

// ==================== Header Functions ====================
function initializeHeader() {
    // Update current date
    updateCurrentDate();
    setInterval(updateCurrentDate, 60000); // Update every minute
    
    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(handleGlobalSearch, 300));
    }
    
    // Add new button
    const addNewBtn = document.getElementById('addNewBtn');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', function() {
            if (AppState.currentPage === 'students') {
                openModal('addStudentModal');
            } else if (AppState.currentPage === 'finance') {
                openModal('addTransactionModal');
            } else {
                showToast('Add new feature coming soon for this page!', 'info');
            }
        });
    }
    
    // Cloud sync button
    const cloudSyncBtn = document.getElementById('cloudSyncBtn');
    if (cloudSyncBtn) {
        cloudSyncBtn.addEventListener('click', handleCloudSync);
    }
}

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (!query) {
        // Reset search
        loadPage(AppState.currentPage);
        return;
    }
    
    // Search in students
    const results = AppState.students.filter(student => {
        return (
            student.nameBangla?.toLowerCase().includes(query) ||
            student.nameEnglish?.toLowerCase().includes(query) ||
            student.mobile?.includes(query) ||
            student.email?.toLowerCase().includes(query) ||
            student.nid?.includes(query) ||
            student.course?.toLowerCase().includes(query)
        );
    });
    
    console.log('Search results:', results);
    // TODO: Display search results
    showToast(`Found ${results.length} results`, 'info');
}

function handleCloudSync() {
    showToast('Cloud sync feature coming soon!', 'info');
    // TODO: Implement Google Sheets sync
}

// ==================== Modals ====================
function initializeModals() {
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== UI Helpers ====================
function showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.add('active');
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// ==================== Utility Functions ====================
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==================== Export Functions ====================
// Export to CSV
function exportToCSV() {
    const csvContent = convertToCSV(AppState.students);
    downloadFile(csvContent, 'wings-fly-students.csv', 'text/csv');
    showToast('Data exported successfully!', 'success');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

console.log('Wings Fly Caregiver Academy - App Initialized');
