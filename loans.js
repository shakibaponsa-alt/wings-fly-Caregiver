/**
 * Wings Fly Caregiver Academy - Loans Module
 * Comprehensive loan tracking and person ledgers
 */

// Global filter state for loans
let LoanFilters = {
    search: '',
    type: '',
    fromDate: '',
    toDate: ''
};

function loadLoansPage() {
    const loansPage = document.getElementById('loans-page');
    if (!loansPage) return;

    // Apply filters to loans
    const filteredLoans = AppState.loans.filter(l => {
        const matchesSearch = !LoanFilters.search ||
            AppState.loanPersons.find(p => p.id === l.personId)?.name.toLowerCase().includes(LoanFilters.search.toLowerCase());
        const matchesType = !LoanFilters.type || l.type === LoanFilters.type;
        const matchesDate = (!LoanFilters.fromDate || l.date >= LoanFilters.fromDate) &&
            (!LoanFilters.toDate || l.date <= LoanFilters.toDate);
        return matchesSearch && matchesType && matchesDate;
    });

    const totalLoanGiven = filteredLoans
        .filter(l => l.type === 'loan_given')
        .reduce((sum, l) => sum + l.amount, 0);
    const totalLoanReceived = filteredLoans
        .filter(l => l.type === 'loan_received')
        .reduce((sum, l) => sum + l.amount, 0);
    const netLoanBalance = totalLoanReceived - totalLoanGiven;

    loansPage.innerHTML = `
        <div class="loans-container">
            <!-- Page Header -->
            <div class="flex-between mb-2 no-print">
                <div>
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 4px;">Loan Management</h1>
                    <p style="color: var(--text-muted);">Track loans given to others and loans received</p>
                </div>
                <div style="display: flex; gap: var(--spacing-sm);">
                    <button class="btn-secondary" onclick="exportLoansPDF()">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button class="btn-primary" onclick="openModal('addLoanModal'); initializeLoanForm();">
                        <i class="fas fa-plus"></i> ADD LOAN TRANSACTION
                    </button>
                </div>
            </div>

            <!-- Filter Bar -->
            <div class="card mb-2 no-print" style="padding: 15px;">
                <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr auto; gap: var(--spacing-sm); align-items: end;">
                    <div class="form-group mb-0">
                        <label style="font-size: 0.75rem; margin-bottom: 4px;">Search Person</label>
                        <input type="text" id="loanSearch" class="form-input" placeholder="Name..." value="${LoanFilters.search}">
                    </div>
                    <div class="form-group mb-0">
                        <label style="font-size: 0.75rem; margin-bottom: 4px;">Type</label>
                        <select id="loanTypeFilter" class="form-select">
                            <option value="">All Types</option>
                            <option value="loan_received" ${LoanFilters.type === 'loan_received' ? 'selected' : ''}>Loan Received</option>
                            <option value="loan_given" ${LoanFilters.type === 'loan_given' ? 'selected' : ''}>Loan Given</option>
                        </select>
                    </div>
                    <div class="form-group mb-0">
                        <label style="font-size: 0.75rem; margin-bottom: 4px;">From Date</label>
                        <input type="date" id="loanFromDate" class="form-input" value="${LoanFilters.fromDate}">
                    </div>
                    <div class="form-group mb-0">
                        <label style="font-size: 0.75rem; margin-bottom: 4px;">To Date</label>
                        <input type="date" id="loanToDate" class="form-input" value="${LoanFilters.toDate}">
                    </div>
                    <button class="btn-primary" onclick="applyLoanFilters()" style="padding: 10px 20px;">
                        <i class="fas fa-filter"></i> Search
                    </button>
                </div>
            </div>

            <!-- Loan Stats -->
            <div class="stats-grid mb-2">
                ${totalLoanGiven > 0 ? `
                <div class="stat-card warning">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Loan Given</h3>
                            <div class="stat-value">৳${totalLoanGiven.toLocaleString()}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-hand-holding-usd"></i></div>
                    </div>
                </div>` : ''}
                
                ${totalLoanReceived > 0 ? `
                <div class="stat-card success">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Loan Received</h3>
                            <div class="stat-value">৳${totalLoanReceived.toLocaleString()}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-get-pocket"></i></div>
                    </div>
                </div>` : ''}

                ${Math.max(0, netLoanBalance) > 0 ? `
                <div class="stat-card info">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Net Payable (Debt)</h3>
                            <div class="stat-value">৳${Math.max(0, netLoanBalance).toLocaleString()}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                    </div>
                </div>` : ''}

                <div class="stat-card error no-print">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Persons</h3>
                            <div class="stat-value">${AppState.loanPersons.length}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                    </div>
                </div>
            </div>

            <!-- Persons List -->
            <div class="card" id="loanPersonsListCard">
                <div class="card-header no-print">
                    <h3 class="card-title"><i class="fas fa-users"></i> Persons/Ledgers</h3>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Person Name</th>
                                <th>Total Given (-)</th>
                                <th>Total Received (+)</th>
                                <th>Net Balance</th>
                                <th class="no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(() => {
            let grandTotalGiven = 0;
            let grandTotalReceived = 0;
            let rowsHtml = '';

            const filteredPersons = AppState.loanPersons.filter(person => {
                const personLoans = filteredLoans.filter(l => l.personId === person.id);
                if (personLoans.length === 0 && (LoanFilters.search || LoanFilters.type || LoanFilters.fromDate || LoanFilters.toDate)) return false;
                return true;
            });

            if (filteredPersons.length === 0) {
                return '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No records found</td></tr>';
            }

            filteredPersons.forEach(person => {
                const personLoans = filteredLoans.filter(l => l.personId === person.id);
                const given = personLoans.filter(l => l.type === 'loan_given').reduce((sum, l) => sum + l.amount, 0);
                const received = personLoans.filter(l => l.type === 'loan_received').reduce((sum, l) => sum + l.amount, 0);
                const balance = received - given;

                grandTotalGiven += given;
                grandTotalReceived += received;

                rowsHtml += `
                                        <tr>
                                            <td style="font-weight: 600;">${person.name}</td>
                                            <td style="color: var(--error);">৳${given.toLocaleString()}</td>
                                            <td style="color: var(--success);">৳${received.toLocaleString()}</td>
                                            <td style="font-weight: 700; color: ${balance >= 0 ? 'var(--success)' : 'var(--error)'}">
                                                ${balance >= 0 ? 'We Owe: ' : 'Owes Us: '}৳${Math.abs(balance).toLocaleString()}
                                            </td>
                                            <td class="no-print">
                                                <button class="icon-btn" onclick="viewLoanLedger('${person.id}')" title="View Ledger">
                                                    <i class="fas fa-book"></i>
                                                </button>
                                                <button class="icon-btn" onclick="deleteLoanPerson('${person.id}')" title="Delete">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
            });

            // Append Footer Row to rowsHtml if needed or handled outside
            // Actually, I'll return both rows and footer info
            return { rowsHtml, grandTotalGiven, grandTotalReceived };
        })().rowsHtml}
                        </tbody>
                        ${(() => {
            let totalGiven = 0;
            let totalReceived = 0;

            AppState.loanPersons.forEach(person => {
                const personLoans = filteredLoans.filter(l => l.personId === person.id);
                if (personLoans.length > 0 || !(LoanFilters.search || LoanFilters.type || LoanFilters.fromDate || LoanFilters.toDate)) {
                    totalGiven += personLoans.filter(l => l.type === 'loan_given').reduce((sum, l) => sum + l.amount, 0);
                    totalReceived += personLoans.filter(l => l.type === 'loan_received').reduce((sum, l) => sum + l.amount, 0);
                }
            });

            const totalBalance = totalReceived - totalGiven;

            return `
                                <tfoot style="background: rgba(255,255,255,0.05); font-weight: 700; border-top: 2px solid var(--primary-color);">
                                    <tr>
                                        <td>TOTAL SUMMARY</td>
                                        <td style="color: var(--error);">৳${totalGiven.toLocaleString()}</td>
                                        <td style="color: var(--success);">৳${totalReceived.toLocaleString()}</td>
                                        <td colspan="2" style="color: ${totalBalance >= 0 ? 'var(--success)' : 'var(--error)'}">
                                            NET: ${totalBalance >= 0 ? 'We Owe: ' : 'Owes Us: '}৳${Math.abs(totalBalance).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            `;
        })()}
                    </table>
                </div>
            </div>
        </div>
    `;
}

function applyLoanFilters() {
    LoanFilters = {
        search: document.getElementById('loanSearch').value,
        type: document.getElementById('loanTypeFilter').value,
        fromDate: document.getElementById('loanFromDate').value,
        toDate: document.getElementById('loanToDate').value
    };
    loadLoansPage();
}

function initializeLoanForm() {
    console.log('Initializing Loan Form...');
    const form = document.getElementById('addLoanForm');
    if (!form) {
        console.error('addLoanForm not found');
        return;
    }

    try {
        const cash = (AppState.accounts && AppState.accounts.cash) || 0;
        const banks = (AppState.accounts && AppState.accounts.banks) || [];
        const mobileBanking = (AppState.accounts && AppState.accounts.mobileBanking) || [];
        const loanPersons = AppState.loanPersons || [];

        // Options for accounts
        const accountOptions = `
            <option value="Cash">Cash (৳${cash.toLocaleString()})</option>
            <optgroup label="Bank Accounts">
                ${banks.map(b => `<option value="Bank: ${b.name} (${b.id})">${b.name} - ${b.accountNo}</option>`).join('')}
            </optgroup>
            <optgroup label="Mobile Banking">
                ${mobileBanking.map(acc => `<option value="Mobile: ${acc.name} (${acc.id})">${acc.name} - ${acc.accountNo}</option>`).join('')}
            </optgroup>
        `;

        form.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label>Date <span class="required">*</span></label>
                    <input type="date" name="date" class="form-input" value="${getTodayDate()}" required>
                </div>
                <div class="form-group">
                    <label>Person Name <span class="required">*</span></label>
                    <input type="text" name="personName" list="personList" class="form-input" placeholder="Enter person name" required>
                    <datalist id="personList">
                        ${loanPersons.map(p => `<option value="${p.name}">`).join('')}
                    </datalist>
                </div>
                <div class="form-group">
                    <label>Type <span class="required">*</span></label>
                    <select name="type" class="form-select" required>
                        <option value="loan_received">Loan Received (Credit +)</option>
                        <option value="loan_given">Loan Given (Debit -)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Amount (৳) <span class="required">*</span></label>
                    <input type="number" name="amount" class="form-input" min="0.01" step="0.01" required>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>Payment Method (Account) <span class="required">*</span></label>
                    <select name="paymentMethod" class="form-select" required>
                        ${accountOptions}
                    </select>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>Description / Note</label>
                    <textarea name="description" class="form-textarea" rows="2" placeholder="Enter details..."></textarea>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
                <button type="button" class="btn-secondary" onclick="closeModal('addLoanModal')">Cancel</button>
                <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Transaction</button>
            </div>
        `;

        form.onsubmit = handleLoanFormSubmit;
        console.log('Loan Form Initialized');
    } catch (error) {
        console.error('Error in initializeLoanForm:', error);
        form.innerHTML = `<p style="color: var(--error); padding: 20px;">Error loading form: ${error.message}</p>`;
    }
}

function handleLoanFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const personName = formData.get('personName').trim();
    const type = formData.get('type');
    const amount = parseFloat(formData.get('amount'));
    const date = formData.get('date');
    const paymentMethod = formData.get('paymentMethod');
    const description = formData.get('description') || '-';

    if (!personName || !amount) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    // 1. Find or create person
    let person = AppState.loanPersons.find(p => p.name.toLowerCase() === personName.toLowerCase());
    if (!person) {
        person = {
            id: generateId(),
            name: personName,
            createdDate: new Date().toISOString()
        };
        AppState.loanPersons.push(person);
    }

    // 2. Save Loan Transaction
    const loan = {
        id: generateId(),
        personId: person.id,
        type: type, // 'loan_received' or 'loan_given'
        amount: amount,
        date: date,
        description: description,
        paymentMethod: paymentMethod
    };
    AppState.loans.push(loan);

    // 3. Update Account Balance
    // Loan Received is Income to the academy, Loan Given is Expense
    const transType = type === 'loan_received' ? 'income' : 'expense';

    // Log in main transactions as well
    AppState.transactions.unshift({
        id: generateId(),
        type: transType,
        category: 'Loan',
        amount: amount,
        paymentMethod: paymentMethod,
        date: date,
        description: `${type === 'loan_received' ? 'Loan Received from' : 'Loan Given to'} ${person.name}. Note: ${description}`,
        loanId: loan.id
    });

    // Update account balance
    if (paymentMethod === 'Cash') {
        if (transType === 'income') AppState.accounts.cash += amount;
        else AppState.accounts.cash -= amount;
    } else if (paymentMethod.startsWith('Bank:')) {
        const idMatch = paymentMethod.match(/\((.*?)\)/);
        if (idMatch) {
            const accId = idMatch[1];
            const bank = AppState.accounts.banks.find(b => b.id === accId);
            if (bank) bank.balance = (bank.balance || 0) + (transType === 'income' ? amount : -amount);
        }
    } else if (paymentMethod.startsWith('Mobile:')) {
        const idMatch = paymentMethod.match(/\((.*?)\)/);
        if (idMatch) {
            const accId = idMatch[1];
            const mobile = AppState.accounts.mobileBanking.find(m => m.id === accId);
            if (mobile) mobile.balance = (mobile.balance || 0) + (transType === 'income' ? amount : -amount);
        }
    }

    saveDataToStorage();
    closeModal('addLoanModal');
    loadLoansPage();
    showToast('Loan transaction saved!', 'success');
}

function viewLoanLedger(personId) {
    const person = AppState.loanPersons.find(p => p.id === personId);
    if (!person) return;

    const personLoans = AppState.loans
        .filter(l => l.personId === personId)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    document.getElementById('loanLedgerTitle').innerHTML = `<i class="fas fa-book"></i> Ledger: ${person.name}`;

    let balance = 0;
    const ledgerTable = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>DATE</th>
                    <th>TYPE</th>
                    <th>DESCRIPTION</th>
                    <th>DEBIT (-)</th>
                    <th>CREDIT (+)</th>
                    <th>BALANCE</th>
                </tr>
            </thead>
            <tbody>
                ${personLoans.map((l, index) => {
        const debit = l.type === 'loan_given' ? l.amount : 0;
        const credit = l.type === 'loan_received' ? l.amount : 0;
        balance += (credit - debit);
        return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${formatDate(l.date)}</td>
                            <td>
                                <span class="badge ${l.type === 'loan_received' ? 'success' : 'error'}">
                                    ${l.type === 'loan_received' ? 'LOAN RECEIVED' : 'LOAN GIVEN'}
                                </span>
                            </td>
                            <td>${l.description}</td>
                            <td style="color: var(--error);">${debit > 0 ? debit.toLocaleString() : '-'}</td>
                            <td style="color: var(--success);">${credit > 0 ? credit.toLocaleString() : '-'}</td>
                            <td style="font-weight: 600;">
                                ${balance >= 0 ? 'Adv ' : 'Due '}${Math.abs(balance).toLocaleString()}
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: rgba(0,217,255,0.05); border-radius: var(--radius-md); display: flex; justify-content: flex-end; align-items: center; gap: 20px;">
            <div style="font-size: 1.25rem; font-weight: 700;">
                NET BALANCE: <span style="color: ${balance >= 0 ? 'var(--success)' : 'var(--error)'}; margin-left:10px;">
                ${balance >= 0 ? 'We Owe: ' : 'Owes Us: '}৳${Math.abs(balance).toLocaleString()}
                </span>
            </div>
            <button class="btn-secondary no-print" onclick="exportPersonLedgerPDF('${personId}')">
                <i class="fas fa-print"></i> PRINT
            </button>
        </div>
    `;

    document.getElementById('loanLedgerContent').innerHTML = ledgerTable;
    openModal('viewLoanLedgerModal');
}

function deleteLoanPerson(id) {
    if (confirm('Are you sure you want to delete this person and all their loan history? This will NOT affect account balances.')) {
        AppState.loanPersons = AppState.loanPersons.filter(p => p.id !== id);
        AppState.loans = AppState.loans.filter(l => l.personId !== id);
        saveDataToStorage();
        loadLoansPage();
        showToast('Person deleted successfully', 'success');
    }
}

function exportLoansPDF() {
    exportToPDF('loans-page', 'Wings Fly - Loan Management Report');
}

function exportPersonLedgerPDF(personId) {
    const person = AppState.loanPersons.find(p => p.id === personId);
    const title = person ? `Loan Ledger - ${person.name}` : 'Loan Ledger';
    exportToPDF('loanLedgerContent', title);
}

// formatDate is already defined in app.js

console.log('Loans Module Loaded');
