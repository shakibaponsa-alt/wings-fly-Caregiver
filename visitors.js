/**
 * Wings Fly Caregiver Academy - Visitors Module
 * Track and manage potential leads and Academy visitors
 */

let VisitorFilters = {
    search: '',
    fromDate: '',
    toDate: ''
};

function loadVisitorsPage() {
    const tableBody = document.getElementById('visitorsTableBody');
    if (!tableBody) return;

    renderVisitorsTable();
}

function renderVisitorsTable() {
    const tableBody = document.getElementById('visitorsTableBody');
    if (!tableBody) return;

    // Apply filters
    const filteredVisitors = AppState.visitors.filter(v => {
        const matchesSearch = !VisitorFilters.search ||
            v.name.toLowerCase().includes(VisitorFilters.search.toLowerCase()) ||
            v.phone.includes(VisitorFilters.search);
        const matchesDate = (!VisitorFilters.fromDate || v.date >= VisitorFilters.fromDate) &&
            (!VisitorFilters.toDate || v.date <= VisitorFilters.toDate);
        return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredVisitors.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    <i class="fas fa-user-slash" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i>
                    No visitors found matching your criteria
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filteredVisitors.map(v => `
        <tr>
            <td>${v.date}</td>
            <td style="font-weight: 600;">${v.name}</td>
            <td>
                <span class="badge" style="background: rgba(0, 217, 255, 0.1); color: var(--primary-color); border: 1px solid var(--primary-color);">
                    ${v.phone}
                </span>
            </td>
            <td>
                <span class="badge" style="background: rgba(46, 213, 115, 0.1); color: var(--success); border: 1px solid var(--success);">
                    ${v.course}
                </span>
            </td>
            <td style="color: var(--text-muted); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${v.remarks}">
                ${v.remarks || '-'}
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="openVisitorModal('${v.id}')">
                        <i class="fas fa-edit"></i> EDIT
                    </button>
                    <button class="btn-error" style="background: var(--error); color: white; border: none; padding: 6px 12px; font-size: 0.75rem; border-radius: var(--radius-sm); cursor: pointer;" onclick="deleteVisitor('${v.id}')">
                        <i class="fas fa-trash"></i> DELETE
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function applyVisitorFilters() {
    VisitorFilters.search = document.getElementById('visitorSearch').value;
    VisitorFilters.fromDate = document.getElementById('visitorFromDate').value;
    VisitorFilters.toDate = document.getElementById('visitorToDate').value;
    renderVisitorsTable();
}

function resetVisitorFilters() {
    document.getElementById('visitorSearch').value = '';
    document.getElementById('visitorFromDate').value = '';
    document.getElementById('visitorToDate').value = '';
    VisitorFilters = { search: '', fromDate: '', toDate: '' };
    renderVisitorsTable();
}

function openVisitorModal(visitorId = null) {
    const modal = document.getElementById('visitorModal');
    const form = document.getElementById('visitorForm');
    const title = document.getElementById('visitorModalTitle');
    const courseSelect = document.getElementById('visitorCourse');

    // Reset form
    form.reset();
    document.getElementById('visitorId').value = '';

    // Populate courses dropdown
    courseSelect.innerHTML = '<option value="">Select Interested Course...</option>' +
        AppState.courses.map(c => `<option value="${c}">${c}</option>`).join('');

    if (visitorId) {
        const visitor = AppState.visitors.find(v => v.id === visitorId);
        if (visitor) {
            title.innerText = 'Edit Visitor Information';
            document.getElementById('visitorId').value = visitor.id;
            document.getElementById('visitorName').value = visitor.name;
            document.getElementById('visitorPhone').value = visitor.phone;
            document.getElementById('visitorCourse').value = visitor.course;
            document.getElementById('visitorDate').value = visitor.date;
            document.getElementById('visitorRemarks').value = visitor.remarks;
        }
    } else {
        title.innerText = 'Visitor Information';
        document.getElementById('visitorDate').value = getTodayDate();
    }

    openModal('visitorModal');
}

document.getElementById('visitorForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveVisitor();
});

function saveVisitor() {
    const id = document.getElementById('visitorId').value;
    const visitorData = {
        id: id || generateId(),
        name: document.getElementById('visitorName').value,
        phone: document.getElementById('visitorPhone').value,
        course: document.getElementById('visitorCourse').value,
        date: document.getElementById('visitorDate').value,
        remarks: document.getElementById('visitorRemarks').value
    };

    if (id) {
        // Update existing
        const index = AppState.visitors.findIndex(v => v.id === id);
        if (index !== -1) {
            AppState.visitors[index] = visitorData;
            showToast('Visitor updated successfully!', 'success');
        }
    } else {
        // Add new
        AppState.visitors.push(visitorData);
        showToast('Visitor added successfully!', 'success');
    }

    saveDataToStorage();
    closeModal('visitorModal');

    // Refresh table if visible
    const visitorsPage = document.getElementById('visitors-page');
    if (visitorsPage && (visitorsPage.classList.contains('active') || window.getComputedStyle(visitorsPage).display !== 'none')) {
        renderVisitorsTable();
    }
}

function deleteVisitor(id) {
    if (confirm('Are you sure you want to delete this visitor record?')) {
        AppState.visitors = AppState.visitors.filter(v => v.id !== id);
        saveDataToStorage();
        renderVisitorsTable();
        showToast('Visitor deleted successfully!', 'info');
    }
}

console.log('Visitors Module Loaded');
