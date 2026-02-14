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
                        <div style="display: flex; gap: var(--spacing-xs);">
                            <button class="btn-secondary" onclick="exportFinancePDF()" title="Download PDF">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn-secondary" onclick="exportFinanceExcel()" title="Download Excel">
                                <i class="fas fa-file-excel"></i> Excel
                            </button>
                        </div>
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
                <div style="display: flex; gap: var(--spacing-xs);">
                    <button class="btn-secondary" onclick="exportAccountsPDF()" title="Download PDF">
                        <i class="fas fa-file-pdf"></i> PDF Report
                    </button>
                    <button class="btn-secondary" onclick="exportAccountsExcel()" title="Download Excel">
                        <i class="fas fa-file-excel"></i> Excel
                    </button>
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
            <div class="card mb-2" id="bankAccountsSection">
                <div class="card-header">
                    <h3 class="card-title" style="color: var(--primary-color);">
                        <i class="fas fa-university"></i>
                        BANK DETAILS
                    </h3>
                    <div style="display: flex; gap: var(--spacing-xs);">
                        <button class="btn-secondary" onclick="transferBalance()">
                            <i class="fas fa-exchange-alt"></i> TRANSFER
                        </button>
                        <button class="btn-primary" onclick="addBankAccount()">
                            <i class="fas fa-plus"></i> ADD NEW
                        </button>
                    </div>
                </div>
                
                <!-- Search Bar -->
                <div style="padding: 0 var(--spacing-md) var(--spacing-md);">
                    <div style="display: flex; gap: var(--spacing-sm); align-items: center;">
                        <div class="search-bar" style="flex: 1;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="bankSearch" placeholder="Search by name, bank, or account number...">
                        </div>
                        <div style="display: flex; gap: var(--spacing-xs);">
                            <button class="btn-secondary" onclick="exportAccountsPDF()" title="Download PDF">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button class="btn-secondary" onclick="exportAccountsExcel()" title="Download Excel">
                                <i class="fas fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Bank Accounts Table -->
                <div class="table-container" id="bankAccountsTableContainer">
                    ${renderBankAccountsTable(accounts.banks)}
                </div>
                
                <!-- Total Bank Balance -->
                <div style="padding: var(--spacing-md); border-top: 2px solid rgba(0,217,255,0.3); background: rgba(0,217,255,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: var(--text-secondary);">Total Bank Balance</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);" id="totalBankBalanceValue">৳${totalBankBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Mobile Banking Section -->
            <div class="card mb-2" id="mobileAccountsSection">
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
                    <div style="display: flex; gap: var(--spacing-sm); align-items: center;">
                        <div class="search-bar" style="flex: 1;">
                            <i class="fas fa-search"></i>
                            <input type="text" id="mobileSearch" placeholder="Search by mobile account...">
                        </div>
                        <div style="display: flex; gap: var(--spacing-xs);">
                            <button class="btn-secondary" onclick="exportAccountsPDF()" title="Download PDF">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button class="btn-secondary" onclick="exportAccountsExcel()" title="Download Excel">
                                <i class="fas fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Banking Table -->
                <div class="table-container" id="mobileAccountsTableContainer">
                    ${renderMobileBankingTable(accounts.mobileBanking)}
                </div>
                
                <!-- Total Mobile Balance -->
                <div style="padding: var(--spacing-md); border-top: 2px solid rgba(0,255,163,0.3); background: rgba(0,255,163,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: var(--text-secondary);">Total Mobile Balance</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);" id="totalMobileBalanceValue">৳${totalMobileBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Grand Total -->
            <div class="card mb-2" style="background: var(--gradient-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <i class="fas fa-coins" style="font-size: 2rem; margin-bottom: var(--spacing-xs);"></i>
                        <h3 style="font-size: 1rem; margin-bottom: 4px;">TOTAL BALANCE</h3>
                        <p style="font-size: 0.875rem; opacity: 0.9;">Cash + Bank + Mobile</p>
                    </div>
                    <div style="font-size: 2.5rem; font-weight: 700;">৳${grandTotal.toLocaleString()}</div>
                </div>
            </div>

            <!-- Account History / Statement Section -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-history"></i> Account Statement / History</h3>
                </div>
                <div style="padding: var(--spacing-md); background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); align-items: flex-end;">
                        <div class="form-group mb-0">
                            <label>Select Account</label>
                            <select id="historyAccountSelect" class="form-select">
                                <option value="Cash">Cash</option>
                                <optgroup label="Bank Accounts">
                                    ${AppState.accounts.banks.map(bank => `
                                        <option value="Bank: ${bank.name} (${bank.id})">${bank.name} - ${bank.accountNo}</option>
                                    `).join('')}
                                </optgroup>
                                <optgroup label="Mobile Banking">
                                    ${AppState.accounts.mobileBanking.map(acc => `
                                        <option value="Mobile: ${acc.name} (${acc.id})">${acc.name} - ${acc.accountNo}</option>
                                    `).join('')}
                                </optgroup>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label>From Date</label>
                            <input type="date" id="historyFromDate" class="form-input" value="${getFirstDayOfMonth()}">
                        </div>
                        <div class="form-group mb-0">
                            <label>To Date</label>
                            <input type="date" id="historyToDate" class="form-input" value="${getTodayDate()}">
                        </div>
                        <div>
                            <button class="btn-primary" onclick="filterAccountHistory()" style="width: 100%;">
                                <i class="fas fa-search"></i> SEARCH HISTORY
                            </button>
                        </div>
                    </div>
                </div>
                <div class="table-container" id="accountHistoryTableContainer" style="min-height: 200px;">
                    <p style="padding: 40px; text-align: center; color: var(--text-muted);">Select an account and click search to view history</p>
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

// Store filtered transactions for export
let filteredTransactionsList = [];

function renderTransactionsTable() {
    const transactions = filteredTransactionsList.length > 0 ?
        filteredTransactionsList :
        AppState.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (transactions.length === 0) {
        return `<p style="padding: var(--spacing-lg); text-align: center; color: var(--text-muted);">No transactions yet</p>`;
    }

    const filteredIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const filteredExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return `
        <table id="financeDataTable">
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
            <tfoot style="background: rgba(0,0,0,0.1); font-weight: 700;">
                ${filteredIncome > 0 ? `
                <tr>
                    <td colspan="5" style="text-align: right; border-top: 2px solid rgba(255,255,255,0.1);">Total Income:</td>
                    <td style="color: var(--success); border-top: 2px solid rgba(255,255,255,0.1);">৳${filteredIncome.toLocaleString()}</td>
                    <td style="border-top: 2px solid rgba(255,255,255,0.1);"></td>
                </tr>
                ` : ''}
                ${filteredExpense > 0 ? `
                <tr>
                    <td colspan="5" style="text-align: right; ${filteredIncome <= 0 ? 'border-top: 2px solid rgba(255,255,255,0.1);' : ''}">Total Expense:</td>
                    <td style="color: var(--error); ${filteredIncome <= 0 ? 'border-top: 2px solid rgba(255,255,255,0.1);' : ''}">৳${filteredExpense.toLocaleString()}</td>
                    <td ${filteredIncome <= 0 ? 'style="border-top: 2px solid rgba(255,255,255,0.1);"' : ''}></td>
                </tr>
                ` : ''}
            </tfoot>
        </table>
    `;
}

function filterAccountHistory() {
    const account = document.getElementById('historyAccountSelect')?.value;
    const fromDate = document.getElementById('historyFromDate')?.value;
    const toDate = document.getElementById('historyToDate')?.value;

    if (!account) return;

    const filtered = AppState.transactions.filter(t => {
        const matchesAccount = t.paymentMethod === account;
        const transactionDate = t.date.split('T')[0];
        const matchesFrom = !fromDate || transactionDate >= fromDate;
        const matchesTo = !toDate || transactionDate <= toDate;
        return matchesAccount && matchesFrom && matchesTo;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById('accountHistoryTableContainer');
    if (container) {
        container.innerHTML = renderAccountHistoryTable(filtered);
    }
}

function renderAccountHistoryTable(transactions) {
    if (transactions.length === 0) {
        return `<p style="padding: 40px; text-align: center; color: var(--text-muted);">No transaction history found for this period</p>`;
    }

    const totalIn = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(t => `
                    <tr>
                        <td style="color: var(--text-muted);">${formatDate(t.date)}</td>
                        <td>
                            <span class="badge ${t.type === 'income' ? 'success' : 'error'}">
                                ${t.type.toUpperCase()}
                            </span>
                        </td>
                        <td>${t.category}</td>
                        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.description}</td>
                        <td style="font-weight: 600; color: ${t.type === 'income' ? 'var(--success)' : 'var(--error)'};">
                            ${t.type === 'income' ? '+' : '-'}৳${t.amount.toLocaleString()}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot style="background: rgba(255,255,255,0.02); font-weight: 700;">
                <tr>
                    <td colspan="4" style="text-align: right;">Total In:</td>
                    <td style="color: var(--success);">৳${totalIn.toLocaleString()}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right;">Total Out:</td>
                    <td style="color: var(--error);">৳${totalOut.toLocaleString()}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right;">Net Cash Flow:</td>
                    <td style="color: var(--primary-color);">৳${(totalIn - totalOut).toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
    `;
}

// Export Functions for Finance
function exportFinancePDF() {
    exportToPDF('financeDataTable', 'Wings Fly - Finance Report');
}

function exportFinanceExcel() {
    const data = filteredTransactionsList.length > 0 ? filteredTransactionsList : AppState.transactions;
    if (data.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }

    const exportData = data.map((t, index) => ({
        'SL': index + 1,
        'Date': formatDate(t.date),
        'Type': t.type,
        'Category': t.category,
        'Description': t.description,
        'Payment Method': t.paymentMethod,
        'Amount': t.amount
    }));

    exportToExcel(exportData, 'Wings_Fly_Finance_Report');
}

function exportAccountsPDF() {
    // Generate a combined printable view of accounts without redundant header
    const printContent = `
        <div id="accountsPrintArea" style="color: #000; font-family: 'Inter', sans-serif;">
            <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; font-size: 16px;">Financial Summary</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div style="background: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
                        <span style="font-size: 12px; color: #666; display: block;">Cash Balance</span>
                        <strong style="font-size: 18px; color: #2ecc71;">৳${AppState.accounts.cash.toLocaleString()}</strong>
                    </div>
                    <div style="background: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
                        <span style="font-size: 12px; color: #666; display: block;">Bank Balance</span>
                        <strong style="font-size: 18px; color: #3498db;">৳${AppState.accounts.banks.reduce((s, b) => s + b.balance, 0).toLocaleString()}</strong>
                    </div>
                    <div style="background: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
                        <span style="font-size: 12px; color: #666; display: block;">Mobile Balance</span>
                        <strong style="font-size: 18px; color: #e67e22;">৳${AppState.accounts.mobileBanking.reduce((s, m) => s + m.balance, 0).toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; font-size: 16px;">Bank Accounts</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px;">Bank Name</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px;">Account Number</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px;">Branch</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 12px;">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${AppState.accounts.banks.length === 0 ? '<tr><td colspan="4" style="text-align: center; padding: 10px;">No bank accounts</td></tr>' :
            AppState.accounts.banks.map(b => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px;">${b.name}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px;">${b.accountNo}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px;">${b.branch || 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px; text-align: right; font-weight: bold;">৳${b.balance.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; font-size: 16px;">Mobile Banking</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px;">Account Name</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px;">Account Number</th>
                            <th style="border: 1px solid #ddd; padding: 10px; text-align: right; font-size: 12px;">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${AppState.accounts.mobileBanking.length === 0 ? '<tr><td colspan="3" style="text-align: center; padding: 10px;">No mobile accounts</td></tr>' :
            AppState.accounts.mobileBanking.map(m => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px;">${m.name}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px;">${m.accountNo}</td>
                                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px; text-align: right; font-weight: bold;">৳${m.balance.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Temporary container for capturing content
    const temp = document.createElement('div');
    temp.id = 'tempPrintContainer';
    temp.style.position = 'fixed'; // Using fixed instead of absolute
    temp.style.left = '-9999px';
    temp.style.top = '0';
    temp.style.width = '800px'; // Give it a specific width for better cloning
    temp.innerHTML = printContent;
    document.body.appendChild(temp);

    exportToPDF('tempPrintContainer', 'Wings Fly - Accounts Report');

    setTimeout(() => {
        if (document.body.contains(temp)) {
            document.body.removeChild(temp);
        }
    }, 2000); // Increased timeout to ensure cloning is complete
}

function exportAccountsExcel() {
    const banks = AppState.accounts.banks.map(b => ({
        'Type': 'Bank',
        'Name': b.name,
        'Account No': b.accountNo,
        'Branch': b.branch,
        'Balance': b.balance
    }));

    const mobile = AppState.accounts.mobileBanking.map(m => ({
        'Type': 'Mobile',
        'Name': m.name,
        'Account No': m.accountNo,
        'Branch': 'N/A',
        'Balance': m.balance
    }));

    exportToExcel([...banks, ...mobile], 'Wings_Fly_Accounts_Report');
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
                <select name="category" id="transactionCategorySelect" class="form-select" required>
                    <!-- Options will be populated based on type -->
                </select>
            </div>
            <div class="form-group">
                <label>Amount (৳) <span class="required">*</span></label>
                <input type="number" name="amount" class="form-input" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Payment Method <span class="required">*</span></label>
                <select name="paymentMethod" class="form-select" required>
                    <option value="Cash">Cash</option>
                    <optgroup label="Bank Accounts">
                        ${AppState.accounts.banks.map(bank => `
                            <option value="Bank: ${bank.name} (${bank.id})">${bank.name} - ${bank.accountNo}</option>
                        `).join('')}
                    </optgroup>
                    <optgroup label="Mobile Banking">
                        ${AppState.accounts.mobileBanking.map(acc => `
                            <option value="Mobile: ${acc.name} (${acc.id})">${acc.name} - ${acc.accountNo}</option>
                        `).join('')}
                    </optgroup>
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

    // Update categories based on type
    const typeSelect = form.querySelector('select[name="type"]');
    const catSelect = document.getElementById('transactionCategorySelect');

    const updateCategories = () => {
        const type = typeSelect.value;
        const categories = AppState.categories[type] || [];
        catSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
    };

    typeSelect.addEventListener('change', updateCategories);
    updateCategories(); // Initial call
}

function handleTransactionFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount'));
    const type = formData.get('type');
    const paymentMethod = formData.get('paymentMethod');

    const transaction = {
        id: generateId(),
        type: type,
        category: formData.get('category'),
        amount: amount,
        paymentMethod: paymentMethod,
        date: formData.get('date'),
        description: formData.get('description') || ''
    };

    // Update account balances
    updateAccountBalance(paymentMethod, amount, type);

    AppState.transactions.unshift(transaction);
    saveDataToStorage();

    closeModal('addTransactionModal');
    loadFinancePage();
    showToast('Transaction added successfully!', 'success');
}

function updateAccountBalance(method, amount, type) {
    if (method === 'Cash') {
        if (type === 'income') AppState.accounts.cash += amount;
        else AppState.accounts.cash -= amount;
    } else if (method.startsWith('Bank: ')) {
        const bankId = method.split('(')[1]?.replace(')', '');
        const bank = AppState.accounts.banks.find(b => b.accountNo === bankId || b.id === bankId);
        if (bank) {
            if (type === 'income') bank.balance += amount;
            else bank.balance -= amount;
        }
    } else if (method.startsWith('Mobile: ')) {
        const accId = method.split('(')[1]?.replace(')', '');
        const acc = AppState.accounts.mobileBanking.find(a => a.accountNo === accId || a.id === accId);
        if (acc) {
            if (type === 'income') acc.balance += amount;
            else acc.balance -= amount;
        }
    }
}

// Helper Functions
function initializeFinanceFilters() {
    const typeFilter = document.getElementById('transactionTypeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', filterTransactions);
    }
}

function initializeAccountFilters() {
    const bankSearch = document.getElementById('bankSearch');
    const mobileSearch = document.getElementById('mobileSearch');

    if (bankSearch) {
        bankSearch.addEventListener('input', debounce(filterBanks, 300));
    }
    if (mobileSearch) {
        mobileSearch.addEventListener('input', debounce(filterMobileBanking, 300));
    }
}

function filterBanks() {
    const query = document.getElementById('bankSearch')?.value.toLowerCase() || '';
    const banks = AppState.accounts.banks;

    const filtered = banks.filter(bank =>
        bank.name?.toLowerCase().includes(query) ||
        bank.accountNo?.includes(query) ||
        bank.branch?.toLowerCase().includes(query)
    );

    const tableContainer = document.getElementById('bankAccountsTableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = renderBankAccountsTable(filtered);
    }

    const total = filtered.reduce((sum, b) => sum + b.balance, 0);
    const totalEl = document.getElementById('totalBankBalanceValue');
    if (totalEl) totalEl.textContent = `৳${total.toLocaleString()}`;
}

function filterMobileBanking() {
    const query = document.getElementById('mobileSearch')?.value.toLowerCase() || '';
    const accounts = AppState.accounts.mobileBanking;

    const filtered = accounts.filter(acc =>
        acc.name?.toLowerCase().includes(query) ||
        acc.accountNo?.includes(query)
    );

    const tableContainer = document.getElementById('mobileAccountsTableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = renderMobileBankingTable(filtered);
    }

    const total = filtered.reduce((sum, a) => sum + a.balance, 0);
    const totalEl = document.getElementById('totalMobileBalanceValue');
    if (totalEl) totalEl.textContent = `৳${total.toLocaleString()}`;
}

function filterTransactions() {
    const typeFilter = document.getElementById('transactionTypeFilter')?.value || '';

    let filtered = AppState.transactions;

    // Apply type filter
    if (typeFilter) {
        filtered = filtered.filter(t => t.type === typeFilter);
    }

    filteredTransactionsList = filtered;

    // Update table
    const tableContainer = document.querySelector('#finance-page .table-container');
    if (tableContainer) {
        tableContainer.innerHTML = renderTransactionsTable();
    }
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
    const modal = document.getElementById('transferModal');
    const form = document.getElementById('transferForm');
    if (!form) return;

    // Build the options for "From" and "To"
    const options = `
        <option value="cash">Cash (৳${AppState.accounts.cash.toLocaleString()})</option>
        <optgroup label="Bank Accounts">
            ${AppState.accounts.banks.map(b => `<option value="bank:${b.id}">${b.name} - ${b.accountNo} (৳${b.balance.toLocaleString()})</option>`).join('')}
        </optgroup>
        <optgroup label="Mobile Banking">
            ${AppState.accounts.mobileBanking.map(m => `<option value="mobile:${m.id}">${m.name} - ${m.accountNo} (৳${m.balance.toLocaleString()})</option>`).join('')}
        </optgroup>
    `;

    form.innerHTML = `
        <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="form-group">
                <label>From Account <span class="required">*</span></label>
                <select name="fromAccount" class="form-select" required>
                    <option value="">Select source...</option>
                    ${options}
                </select>
            </div>
            <div class="form-group">
                <label>To Account <span class="required">*</span></label>
                <select name="toAccount" class="form-select" required>
                    <option value="">Select destination...</option>
                    ${options}
                </select>
            </div>
            <div class="form-group">
                <label>Date <span class="required">*</span></label>
                <input type="date" name="date" class="form-input" value="${getTodayDate()}" required>
            </div>
            <div class="form-group">
                <label>Amount (৳) <span class="required">*</span></label>
                <input type="number" name="amount" class="form-input" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Note</label>
                <input type="text" name="note" class="form-input" placeholder="Optional transfer note">
            </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05);">
            <button type="button" class="btn-secondary" onclick="closeModal('transferModal')">Cancel</button>
            <button type="submit" class="btn-primary"><i class="fas fa-exchange-alt"></i> Transfer Now</button>
        </div>
    `;

    form.onsubmit = handleTransferFormSubmit;
    openModal('transferModal');
}

function handleTransferFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const from = formData.get('fromAccount');
    const to = formData.get('toAccount');
    const amount = parseFloat(formData.get('amount'));
    const note = formData.get('note') || 'Internal Balance Transfer';

    const date = formData.get('date') || getTodayDate();

    if (from === to) {
        showToast('Source and destination accounts must be different', 'error');
        return;
    }

    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    // Deduct from Source
    let fromSuccess = false;
    let fromAccountName = 'Cash';
    if (from === 'cash') {
        if (AppState.accounts.cash >= amount) {
            AppState.accounts.cash -= amount;
            fromSuccess = true;
        }
    } else if (from.startsWith('bank:')) {
        const id = from.split(':')[1];
        const bank = AppState.accounts.banks.find(b => b.id === id);
        if (bank && bank.balance >= amount) {
            bank.balance -= amount;
            fromSuccess = true;
            fromAccountName = `Bank: ${bank.name} (${bank.id})`;
        }
    } else if (from.startsWith('mobile:')) {
        const id = from.split(':')[1];
        const mobile = AppState.accounts.mobileBanking.find(m => m.id === id);
        if (mobile && mobile.balance >= amount) {
            mobile.balance -= amount;
            fromSuccess = true;
            fromAccountName = `Mobile: ${mobile.name} (${mobile.id})`;
        }
    }

    if (!fromSuccess) {
        showToast('Insufficient balance in source account', 'error');
        return;
    }

    // Add to Destination
    let toAccountName = 'Cash';
    if (to === 'cash') {
        AppState.accounts.cash += amount;
    } else if (to.startsWith('bank:')) {
        const id = to.split(':')[1];
        const bank = AppState.accounts.banks.find(b => b.id === id);
        if (bank) {
            bank.balance = (bank.balance || 0) + amount;
            toAccountName = `Bank: ${bank.name} (${bank.id})`;
        }
    } else if (to.startsWith('mobile:')) {
        const id = to.split(':')[1];
        const mobile = AppState.accounts.mobileBanking.find(m => m.id === id);
        if (mobile) {
            mobile.balance = (mobile.balance || 0) + amount;
            toAccountName = `Mobile: ${mobile.name} (${mobile.id})`;
        }
    }

    // Log the transfer as a special "Transfer" transaction
    // To keep it simple and show in history for both accounts, we'll create ONE transaction
    // but the filter logic will need to handle it. Actually, for the current history logic, 
    // it's better to create TWO transactions: 1 Expense from source, 1 Income to destination.

    // 1. Expense from source
    AppState.transactions.unshift({
        id: generateId(),
        type: 'expense',
        category: 'Transfer',
        amount: amount,
        paymentMethod: fromAccountName,
        date: date,
        description: `Balance Transfer to ${toAccountName}. Note: ${note}`
    });

    // 2. Income to destination
    AppState.transactions.unshift({
        id: generateId(),
        type: 'income',
        category: 'Transfer',
        amount: amount,
        paymentMethod: toAccountName,
        date: date,
        description: `Balance Transfer from ${fromAccountName}. Note: ${note}`
    });

    saveDataToStorage();
    closeModal('transferModal');
    loadAccountsPage();
    showToast('Balance transferred successfully!', 'success');
}

let currentEditingAccountId = null;
let currentEditingAccountType = null; // 'bank' or 'mobile'

function addBankAccount() {
    currentEditingAccountId = null;
    currentEditingAccountType = 'bank';
    const modal = document.getElementById('accountModal');
    const title = document.getElementById('accountModalTitle');
    title.innerHTML = '<i class="fas fa-university"></i> Add Bank Account';

    initializeAccountForm();
    openModal('accountModal');
}

function addMobileBankingAccount() {
    currentEditingAccountId = null;
    currentEditingAccountType = 'mobile';
    const modal = document.getElementById('accountModal');
    const title = document.getElementById('accountModalTitle');
    title.innerHTML = '<i class="fas fa-mobile-alt"></i> Add Mobile Account';

    initializeAccountForm();
    openModal('accountModal');
}

function initializeAccountForm(existingData = null) {
    const form = document.getElementById('accountForm');
    if (!form) return;

    const isBank = currentEditingAccountType === 'bank';

    form.innerHTML = `
        <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="form-group">
                <label>${isBank ? 'Account Holder Name' : 'Account Name (e.g. Bkash)'} <span class="required">*</span></label>
                <input type="text" name="name" class="form-input" value="${existingData?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Account Number <span class="required">*</span></label>
                <input type="text" name="accountNo" class="form-input" value="${existingData?.accountNo || ''}" required>
            </div>
            ${isBank ? `
            <div class="form-group">
                <label>Branch Name</label>
                <input type="text" name="branch" class="form-input" value="${existingData?.branch || ''}">
            </div>
            ` : ''}
            <div class="form-group">
                <label>Initial Balance (৳)</label>
                <input type="number" name="balance" class="form-input" step="0.01" value="${existingData?.balance || 0}">
            </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05);">
            <button type="button" class="btn-secondary" onclick="closeModal('accountModal')">Cancel</button>
            <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Account</button>
        </div>
    `;

    form.onsubmit = handleAccountFormSubmit;
}

function handleAccountFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        accountNo: formData.get('accountNo'),
        balance: parseFloat(formData.get('balance')) || 0
    };

    if (currentEditingAccountType === 'bank') {
        data.branch = formData.get('branch') || '';
        if (currentEditingAccountId) {
            const index = AppState.accounts.banks.findIndex(b => b.id === currentEditingAccountId);
            if (index !== -1) AppState.accounts.banks[index] = { ...AppState.accounts.banks[index], ...data };
        } else {
            AppState.accounts.banks.push({ id: generateId(), ...data });
        }
    } else {
        if (currentEditingAccountId) {
            const index = AppState.accounts.mobileBanking.findIndex(m => m.id === currentEditingAccountId);
            if (index !== -1) AppState.accounts.mobileBanking[index] = { ...AppState.accounts.mobileBanking[index], ...data };
        } else {
            AppState.accounts.mobileBanking.push({ id: generateId(), ...data });
        }
    }

    saveDataToStorage();
    closeModal('accountModal');
    loadAccountsPage();
    showToast(`Account ${currentEditingAccountId ? 'updated' : 'added'} successfully!`, 'success');
}

function deleteBankAccount(id) {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    AppState.accounts.banks = AppState.accounts.banks.filter(b => b.id !== id);
    saveDataToStorage();
    loadAccountsPage();
    showToast('Bank account deleted!', 'success');
}

function deleteMobileAccount(id) {
    if (!confirm('Are you sure you want to delete this mobile account?')) return;
    AppState.accounts.mobileBanking = AppState.accounts.mobileBanking.filter(m => m.id !== id);
    saveDataToStorage();
    loadAccountsPage();
    showToast('Mobile account deleted!', 'success');
}

function editBankAccount(id) {
    const bank = AppState.accounts.banks.find(b => b.id === id);
    if (!bank) return;
    currentEditingAccountId = id;
    currentEditingAccountType = 'bank';
    const title = document.getElementById('accountModalTitle');
    title.innerHTML = '<i class="fas fa-edit"></i> Edit Bank Account';
    initializeAccountForm(bank);
    openModal('accountModal');
}

function editMobileAccount(id) {
    const mobile = AppState.accounts.mobileBanking.find(m => m.id === id);
    if (!mobile) return;
    currentEditingAccountId = id;
    currentEditingAccountType = 'mobile';
    const title = document.getElementById('accountModalTitle');
    title.innerHTML = '<i class="fas fa-edit"></i> Edit Mobile Account';
    initializeAccountForm(mobile);
    openModal('accountModal');
}

console.log('Finance Module Loaded');
