/**
 * Wings Fly Caregiver Academy - Main App Logic
 * Core application functionality and navigation
 */

// ==================== Global State ====================
const AppState = {
    students: [],
    transactions: [],
    batches: ['Batch 01', 'Batch 02', 'Batch 03'],
    loans: [],
    loanPersons: [],
    accounts: {
        cash: 0,
        banks: [],
        mobileBanking: []
    },
    categories: {
        income: ['Course Fee', 'Registration Fee', 'Donation', 'Loan', 'Others'],
        expense: ['Salary', 'Utilities', 'Office Rent', 'Supplies', 'Marketing', 'Loan', 'Others']
    },
    courses: [
        'Caregiving for Toddler And Children',
        'Primary Health Care Level 2',
        'Caregiving for Elderly Person Level 3',
        'Dementia Caregiver Level 3',
        'Other'
    ],
    visitors: [],
    currentPage: 'dashboard',
    initialized: false
};

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', function () {
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
        const storedCategories = localStorage.getItem('wf_categories');
        if (storedCategories) {
            AppState.categories = JSON.parse(storedCategories);
        }
        const storedCourses = localStorage.getItem('wf_courses');
        if (storedCourses) {
            AppState.courses = JSON.parse(storedCourses);
        }
        AppState.batches = JSON.parse(localStorage.getItem('wf_batches')) || ['Batch 01', 'Batch 02', 'Batch 03'];
        AppState.loans = JSON.parse(localStorage.getItem('wf_loans')) || [];
        AppState.loanPersons = JSON.parse(localStorage.getItem('wf_loan_persons')) || [];
        AppState.visitors = JSON.parse(localStorage.getItem('wf_visitors')) || []; // Load visitors
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
        localStorage.setItem('wf_categories', JSON.stringify(AppState.categories));
        localStorage.setItem('wf_courses', JSON.stringify(AppState.courses));
        localStorage.setItem('wf_batches', JSON.stringify(AppState.batches));
        localStorage.setItem('wf_loans', JSON.stringify(AppState.loans));
        localStorage.setItem('wf_loan_persons', JSON.stringify(AppState.loanPersons));
        localStorage.setItem('wf_visitors', JSON.stringify(AppState.visitors)); // Save visitors
    } catch (error) {
        console.error('Error saving data to storage:', error);
        showToast('Error saving data', 'error');
    }
}

// ==================== Navigation ====================
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
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
    switch (page) {
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
                if (typeof initializeAccountFilters === 'function') {
                    initializeAccountFilters();
                }
            }
            break;
        case 'settings':
            if (typeof loadSettingsPage === 'function') {
                loadSettingsPage();
            }
            break;
        case 'loans':
            if (typeof loadLoansPage === 'function') {
                loadLoansPage();
            }
            break;
        case 'visitors':
            if (typeof loadVisitorsPage === 'function') {
                loadVisitorsPage();
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
        addNewBtn.addEventListener('click', function () {
            if (AppState.currentPage === 'students') {
                openModal('addStudentModal');
            } else if (AppState.currentPage === 'finance') {
                openModal('addTransactionModal');
            } else if (AppState.currentPage === 'loans') {
                openModal('addLoanModal');
                if (typeof initializeLoanForm === 'function') initializeLoanForm();
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
        btn.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
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

// Utility functions for dates
function getTodayDate() {
    try {
        const today = new Date();
        return today.toISOString().split('T')[0];
    } catch (e) {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

function getFirstDayOfMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export functions for whole pages
function exportDashboardPDF() {
    exportToPDF('dashboard-page', 'Wings Fly - Dashboard Report');
}

// ==================== Export Functions ====================
// Export to PDF (using a clean print implementation with header)
function exportToPDF(elementId, title) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    // Create a temporary print container
    const printContainer = document.createElement('div');
    printContainer.id = 'printContainer';
    printContainer.style.position = 'absolute';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '100%';
    printContainer.style.zIndex = '99999';
    printContainer.style.background = '#fff';
    printContainer.style.color = '#000';
    printContainer.style.padding = '20px';

    // Add Header
    printContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #00D9FF; padding-bottom: 15px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
                <img src="logo.jpeg" alt="Logo" style="width: 60px; height: 60px; border-radius: 50%; object-fit: contain;">
                <div style="text-align: left;">
                    <h1 style="font-size: 24px; color: #0099CC; margin: 0; font-family: 'Inter', sans-serif;">Wings Fly Caregiver Academy</h1>
                    <p style="margin: 0; color: #666; font-size: 14px;">Excellence in Caregiving Education</p>
                </div>
            </div>
            <h2 style="font-size: 18px; color: #333; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">${title}</h2>
            <p style="font-size: 11px; color: #888;">Generated on: ${new Date().toLocaleString()}</p>
        </div>
    `;

    // Clone the table or element
    const clone = targetElement.cloneNode(true);
    clone.style.width = '100%';
    clone.style.color = '#000';
    clone.style.background = '#fff';
    clone.style.position = 'relative'; // Reset positioning
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.visibility = 'visible';
    clone.style.display = 'block';
    clone.id = 'printTableClone';

    printContainer.appendChild(clone);
    document.body.appendChild(printContainer);

    // Apply print-specific styles
    const style = document.createElement('style');
    style.id = 'printStyle';
    style.innerHTML = `
        @media print {
            /* Enforce strictly white background */
            html, body { 
                background: #ffffff !important; 
                background-color: #ffffff !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
                height: auto !important;
                min-height: 100% !important;
            }
            
            /* Hide EVERYTHING except our container */
            body > *:not(#printContainer) { 
                display: none !important; 
                visibility: hidden !important;
            }

            #printContainer {
                display: block !important;
                visibility: visible !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
                color: #000 !important;
            }

            #printContainer * {
                visibility: visible !important;
                color: #000 !important;
                background: transparent !important;
            }

            .data-table { 
                display: table !important; 
                width: 100% !important; 
                margin-top: 20px !important; 
                border-collapse: collapse !important; 
                border: 1px solid #000 !important;
            }
            .data-table th, .data-table td { 
                border: 1px solid #000 !important; 
                padding: 8px !important; 
                color: #000 !important; 
                font-size: 10pt !important;
                text-align: left !important;
            }
            .data-table th { background-color: #eee !important; font-weight: bold !important; }
            .data-table tfoot { font-weight: bold !important; border-top: 2px solid #000 !important; }

            .no-export, .no-print, .actions, .btn-primary, .btn-secondary, .icon-btn, .search-bar, .flex-between button { 
                display: none !important; 
            }
            
            /* Clean Stats Row for Print */
            .stats-grid { 
                display: flex !important; 
                flex-wrap: wrap !important;
                gap: 20px !important; 
                margin-bottom: 20px !important; 
                border-bottom: 1px solid #000 !important;
                padding-bottom: 15px !important;
            }
            .stat-card { 
                flex: 1 !important;
                min-width: 150px !important;
                border: none !important; 
                padding: 5px !important; 
            }
            .stat-card h3 { font-size: 10pt !important; margin: 0 !important; color: #555 !important; }
            .stat-card .stat-value { font-size: 14pt !important; font-weight: bold !important; margin: 5px 0 !important; }
            .stat-icon { display: none !important; }

            h1, h2, h3 { color: #000 !important; margin-bottom: 5px !important; }
            
            table { 
                width: 100% !important; 
                border-collapse: collapse !important; 
                border: 1px solid #ddd !important;
                margin-top: 10px !important;
            }
            
            th, td { 
                border: 1px solid #ddd !important; 
                padding: 8px !important; 
                color: #000000 !important; 
                background: #ffffff !important; 
                font-size: 11px !important; 
                text-align: left !important;
            }
            
            th { 
                background-color: #f8f9fa !important;
                font-weight: bold !important;
                text-transform: uppercase !important;
            }
            
            .badge { 
                border: 1px solid #ddd !important; 
                color: #000000 !important; 
                background: transparent !important; 
                padding: 2px 6px !important; 
                border-radius: 4px !important;
                font-size: 10px !important;
            }
            
            /* Hide actions column and buttons in print */
            th:last-child, td:last-child, .icon-btn, button { 
                display: none !important; 
            }
            
            /* High contrast fix */
            * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
                color-adjust: exact !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Set document title temporarily for the filename
    const originalTitle = document.title;
    document.title = title;

    setTimeout(() => {
        window.print();

        // Clean up
        if (document.body.contains(printContainer)) document.body.removeChild(printContainer);
        if (document.head.contains(style)) document.head.removeChild(style);
        document.title = originalTitle;
    }, 500);
}

// Export to Excel (CSV-based)
function exportToExcel(data, filename) {
    if (!data || data.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            let val = row[header] === null || row[header] === undefined ? '' : row[header];
            // Format for CSV (quotes, escaping)
            val = val.toString().replace(/"/g, '""');
            return `"${val}"`;
        }).join(','))
    ].join('\n');

    downloadFile(csvContent, `${filename}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    showToast('Export successful!', 'success');
}

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
document.addEventListener('keydown', function (e) {
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
