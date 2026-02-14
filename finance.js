/**
 * Wings Fly Caregiver Academy - Finance Module
 * Finance tracking, accounts management, and transactions
 */

function loadFinancePage() {
    const financePage = document.getElementById('finance-page');
    if (!financePage) return;

    financePage.innerHTML = `
        <div class="finance-container">
            <!-- Page Header -->
            <div class="flex-between mb-2">
                <div>
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 4px;">Finance</h1>
                    <p style="color: var(--text-muted);">Manage income, expenses, and transactions</p>
                </div>
                <button class="btn-primary" onclick="openModal('addTransactionModal'); initializeTransactionForm();">
                    <i class="fas fa-plus"></i> Add Transaction
                </button>
            </div>
            
            <!-- Financial Summary Cards -->
            <div class="stats-grid mb-2">
                ${renderFinancialStats()}
            </div>
            
            <!-- Recent Transactions -->
            <div class="card mb-2">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-exchange-alt"></i>
                        Recent Transactions
                    </h3>
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <select id="transactionTypeFilter" class="form-select" style="width: 150px;">
                            <option value="">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>
                <div class="table-container">
                    ${renderTransactionsTable()}
                </div>
            </div>
        </div>
    `;

    // Initialize filters
    initializeFinanceFilters();
}

function loadAccountsPage() {
    const accountsPage = document.getElementById('accounts-page');
    if (!accountsPage) return;

    const accounts = AppState.accounts;
    const totalBankBalance = accounts.banks.reduce((sum, bank) => sum + (bank.balance || 0), 0);
    const totalMobileBalance = accounts.mobileBanking.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const grandTotal = accounts.cash + totalBankBalance + totalMobileBalance;

    accountsPage.innerHTML = `
        <div class="accounts-container">
            <!-- Page Header -->
            <div class="flex-between mb-2">
                <div>
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 4px;">Accounts</h1>
                    <p style="color: var(--text-muted);">Manage cash, bank accounts, and mobile banking</p>
                </div>
            </div>
            
            <!-- Cash Section -->
            <div class="card mb-2" style="background: linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(0,153,204,0.05) 100%);">
                <div class="flex-between" style="align-items: center;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div style="width: 64px; height: 64px; background: var(--gradient-primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 28px;">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 4px;">CASH</h3>
                            <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">৳${accounts.cash.toLocaleString()}</div>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Physical cash on hand</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: var(--spacing-xs);">
                        <button class="btn-secondary" onclick="updateCash()">
                            <i class="fas fa-edit"></i> UPDATE CASH
                        </button>
                        <button class="btn-primary" onclick="syncAccounts()">
                            <i class="fas fa-sync"></i> SYNC
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Bank Details Section -->
            <div class="card mb-2">
                <div class="card-header">
                    <h3 class="card-title" style="color: var(--primary-color);">
                        <i class="fas fa-university"></i>
                        BANK DETAILS
                    </h3>
                    <div style="display: flex; gap: var(--spacing-xs);">
                        <button class="btn-secondary" onclick="transferBalance()">
                            <i class="fas fa-exchange-alt"></i> TRANSFER BALANCE
                        </button>
                        <button class="btn-primary" onclick="addBankAccount()">
                            <i class="fas fa-plus"></i> ADD NEW BANK ACCOUNT
                        </button>
                    </div>
                </div>
                
                <!-- Search Bar -->
                <div style="padding: 0 var(--spacing-md) var(--spacing-md);">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search by name, bank, or account number...">
                    </div>
                </div>
                
                <!-- Bank Accounts Table -->
                <div class="table-container">
                    ${renderBankAccountsTable(accounts.banks)}
                </div>
                
                <!-- Total Bank Balance -->
                <div style="padding: var(--spacing-md); border-top: 2px solid rgba(0,217,255,0.3); background: rgba(0,217,255,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: var(--text-secondary);">Total Bank Balance</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">৳${totalBankBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Mobile Banking Section -->
            <div class="card mb-2">
                <div class="card-header">
                    <h3 class="card-title" style="color: var(--success);">
                        <i class="fas fa-mobile-alt"></i>
                        MOBILE BANKING
                    </h3>
                    <button class="btn-primary" onclick="addMobileBankingAccount()">
                        <i class="fas fa-plus"></i> ADD MOBILE ACCOUNT
                    </button>
                </div>
                
                <!-- Search Bar -->
                <div style="padding: 0 var(--spacing-md) var(--spacing-md);">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search by mobile account...">
                    </div>
                </div>
                
                <!-- Mobile Banking Table -->
                <div class="table-container">
                    ${renderMobileBankingTable(accounts.mobileBanking)}
                </div>
                
                <!-- Total Mobile Balance -->
                <div style="padding: var(--spacing-md); border-top: 2px solid rgba(0,255,163,0.3); background: rgba(0,255,163,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: var(--text-secondary);">Total Mobile Balance</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">৳${totalMobileBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Grand Total -->
            <div class="card" style="background: var(--gradient-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <i class="fas fa-coins" style="font-size: 2rem; margin-bottom: var(--spacing-xs);"></i>
                        <h3 style="font-size: 1rem; margin-bottom: 4px;">TOTAL BALANCE</h3>
                        <p style="font-size: 0.875rem; opacity: 0.9;">Cash + Bank + Mobile</p>
                    </div>
                    <div style="font-size: 2.5rem; font-weight: 700;">৳${grandTotal.toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;
}

// Render Functions
function renderFinancialStats() {
    const transactions = AppState.transactions;
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    return `
        <div class="stat-card success">
            <div class="stat-card-content">
                <div class="stat-info">
                    <h3>Total Income</h3>
                    <div class="stat-value">৳${totalIncome.toLocaleString()}</div>
                </div>
                <div class="stat-icon"><i class="fas fa-arrow-up"></i></div>
            </div>
        </div>
        <div class="stat-card error">
            <div class="stat-card-content">
                <div class="stat-info">
                    <h3>Total Expense</h3>
                    <div class="stat-value">৳${totalExpense.toLocaleString()}</div>
                </div>
                <div class="stat-icon"><i class="fas fa-arrow-down"></i></div>
            </div>
        </div>
        <div class="stat-card info">
            <div class="stat-card-content">
                <div class="stat-info">
                    <h3>Net Balance</h3>
                    <div class="stat-value">৳${netBalance.toLocaleString()}</div>
                </div>
                <div class="stat-icon"><i class="fas fa-wallet"></i></div>
            </div>
        </div>
        <div class="stat-card warning">
            <div class="stat-card-content">
                <div class="stat-info">
                    <h3>Transactions</h3>
                    <div class="stat-value">${transactions.length}</div>
                </div>
                <div class="stat-icon"><i class="fas fa-exchange-alt"></i></div>
            </div>
        </div>
    `;
}

function renderTransactionsTable() {
    const transactions = AppState.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (transactions.length === 0) {
        return `<p style="padding: var(--spacing-lg); text-align: center; color: var(--text-muted);">No transactions yet</p>`;
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(transaction => `
                    <tr>
                        <td style="color: var(--text-muted); font-size: 0.875rem;">${formatDate(transaction.date)}</td>
                        <td>
                            <span class="badge ${transaction.type === 'income' ? 'success' : 'error'}">
                                <i class="fas fa-arrow-${transaction.type === 'income' ? 'up' : 'down'}"></i>
                                ${transaction.type}
                            </span>
                        </td>
                        <td style="color: var(--text-secondary);">${transaction.category}</td>
                        <td style="color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${transaction.description}</td>
                        <td><span class="badge info" style="font-size: 0.75rem;">${transaction.paymentMethod}</span></td>
                        <td style="font-weight: 600; color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--error)'};">
                            ${transaction.type === 'income' ? '+' : '-'}৳${transaction.amount.toLocaleString()}
                        </td>
                        <td>
                            <button class="icon-btn" onclick="deleteTransaction('${transaction.id}')" style="width: 32px; height: 32px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderBankAccountsTable(banks) {
    if (banks.length === 0) {
        return `<p style="padding: var(--spacing-lg); text-align: center; color: var(--text-muted);">No bank accounts yet</p>`;
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>SL</th>
                    <th>NAME</th>
                    <th>BRANCH</th>
                    <th>BANK NAME</th>
                    <th>ACCOUNT NO.</th>
                    <th>BALANCE</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                ${banks.map((bank, index) => `
                    <tr>
                        <td style="font-weight: 600;">${index + 1}</td>
                        <td style="color: var(--text-primary); font-weight: 500;">${bank.name || 'Main Account'}</td>
                        <td>
                            <span class="badge success" style="font-size: 0.75rem;">${bank.branch}</span>
                        </td>
                        <td>
                            <span class="badge info">${bank.name}</span>
                        </td>
                        <td style="color: var(--primary-color); font-weight: 600;">${bank.accountNo}</td>
                        <td style="color: var(--success); font-weight: 700;">৳${bank.balance.toLocaleString()}</td>
                        <td>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn" onclick="viewBankDetails('${bank.id}')" style="width: 32px; height: 32px;">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="icon-btn" onclick="editBankAccount('${bank.id}')" style="width: 32px; height: 32px;">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-btn" onclick="deleteBankAccount('${bank.id}')" style="width: 32px; height: 32px;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderMobileBankingTable(accounts) {
    if (accounts.length === 0) {
        return `<p style="padding: var(--spacing-lg); text-align: center; color: var(--text-muted);">No mobile banking accounts yet</p>`;
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>SL</th>
                    <th>ACCOUNT Name</th>
                    <th>ACCOUNT NO.</th>
                    <th>BALANCE</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                ${accounts.map((acc, index) => `
                    <tr>
                        <td style="font-weight: 600;">${index + 1}</td>
                        <td>
                            <span class="badge success">${acc.name}</span>
                        </td>
                        <td style="color: var(--primary-color); font-weight: 600;">${acc.accountNo}</td>
                        <td style="color: var(--success); font-weight: 700;">৳${acc.balance.toLocaleString()}</td>
                        <td>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn" onclick="editMobileAccount('${acc.id}')" style="width: 32px; height: 32px;">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-btn" onclick="deleteMobileAccount('${acc.id}')" style="width: 32px; height: 32px;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Transaction Form
function initializeTransactionForm() {
    const form = document.getElementById('addTransactionForm');
    if (!form) return;

    form.innerHTML = `
        <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="form-group">
                <label>Type <span class="required">*</span></label>
                <select name="type" class="form-select" required>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <div class="form-group">
                <label>Category <span class="required">*</span></label>
                <input type="text" name="category" class="form-input" placeholder="e.g., Course Fee, Salary, Utilities" required>
            </div>
            <div class="form-group">
                <label>Amount (৳) <span class="required">*</span></label>
                <input type="number" name="amount" class="form-input" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Payment Method <span class="required">*</span></label>
                <select name="paymentMethod" class="form-select" required>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date <span class="required">*</span></label>
                <input type="date" name="date" class="form-input" value="${getTodayDate()}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" class="form-textarea" rows="3"></textarea>
            </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05);">
            <button type="button" class="btn-secondary" onclick="closeModal('addTransactionModal')">Cancel</button>
            <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Transaction</button>
        </div>
    `;

    form.onsubmit = handleTransactionFormSubmit;
}

function handleTransactionFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const transaction = {
        id: generateId(),
        type: formData.get('type'),
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        paymentMethod: formData.get('paymentMethod'),
        date: formData.get('date'),
        description: formData.get('description') || ''
    };

    AppState.transactions.push(transaction);
    saveDataToStorage();

    closeModal('addTransactionModal');
    loadFinancePage();
    showToast('Transaction added successfully!', 'success');
}

// Helper Functions
function initializeFinanceFilters() {
    const typeFilter = document.getElementById('transactionTypeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', filterTransactions);
    }
}

function filterTransactions() {
    const typeFilter = document.getElementById('transactionTypeFilter')?.value || '';
    // Implement filtering logic
    loadFinancePage();
}

function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    AppState.transactions = AppState.transactions.filter(t => t.id !== id);
    saveDataToStorage();
    loadFinancePage();
    showToast('Transaction deleted!', 'success');
}

// Account Management Functions
function updateCash() {
    const newAmount = prompt('Enter new cash amount:', AppState.accounts.cash);
    if (newAmount !== null) {
        AppState.accounts.cash = parseFloat(newAmount) || 0;
        saveDataToStorage();
        loadAccountsPage();
        showToast('Cash updated!', 'success');
    }
}

function syncAccounts() {
    showToast('Account sync feature coming soon!', 'info');
}

function transferBalance() {
    showToast('Transfer balance feature coming soon!', 'info');
}

function addBankAccount() {
    showToast('Add bank account feature coming soon!', 'info');
}

function addMobileBankingAccount() {
    showToast('Add mobile banking feature coming soon!', 'info');
}

function viewBankDetails(id) {
    showToast('View details feature coming soon!', 'info');
}

function editBankAccount(id) {
    showToast('Edit feature coming soon!', 'info');
}

function deleteBankAccount(id) {
    showToast('Delete feature coming soon!', 'info');
}

function editMobileAccount(id) {
    showToast('Edit feature coming soon!', 'info');
}

function deleteMobileAccount(id) {
    showToast('Delete feature coming soon!', 'info');
}

console.log('Finance Module Loaded');
