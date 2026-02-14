/**
 * Wings Fly Caregiver Academy - Dashboard Module
 * Main dashboard with statistics and overview
 */

function loadDashboard() {
    const dashboardPage = document.getElementById('dashboard-page');
    if (!dashboardPage) return;

    // Calculate statistics
    const stats = calculateStatistics();

    // Render dashboard
    dashboardPage.innerHTML = `
        <div class="dashboard-container">
            <!-- Statistics Cards -->
            <div class="stats-grid">
                ${renderStatCard('Total Students', stats.totalStudents, 'fa-user-graduate', 'info', '+12')}
                ${renderStatCard('Active Courses', stats.activeCourses, 'fa-book-open', 'success', '')}
                ${renderStatCard('Total Revenue', formatCurrency(stats.totalRevenue), 'fa-dollar-sign', 'warning', '+8%')}
                ${renderStatCard('Pending Certificates', stats.pendingCertificates, 'fa-certificate', 'error', '')}
            </div>
            
            <!-- Target Progress -->
            <div class="card" style="margin-bottom: var(--spacing-lg);">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-bullseye"></i>
                        Target Progress
                    </h3>
                    <div class="flex gap-1">
                        <input type="date" class="form-input" style="width: 140px;" id="targetFromDate" value="${getFirstDayOfMonth()}">
                        <span style="color: var(--text-muted); padding: 0 8px;">to</span>
                        <input type="date" class="form-input" style="width: 140px;" id="targetToDate" value="${getTodayDate()}">
                        <div style="display: flex; gap: var(--spacing-xs); margin-left: 8px;">
                            <button class="btn-secondary" onclick="exportDashboardPDF()" title="Download PDF Report">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button class="btn-secondary" onclick="exportToCSV()" title="Download All Data (Excel)">
                                <i class="fas fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div style="padding: var(--spacing-md) 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--text-muted); font-size: 0.875rem;">Completed:</span>
                        <span style="color: var(--text-muted); font-size: 0.875rem;">Target:</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); border-radius: 20px; height: 12px; overflow: hidden; margin-bottom: 8px;">
                        <div style="background: var(--gradient-primary); width: ${stats.targetProgress}%; height: 100%; border-radius: 20px; transition: width 1s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: center; color: var(--primary-color); font-size: 1.5rem; font-weight: 700;">
                        ${stats.targetProgress}%
                    </div>
                </div>
            </div>
            
            <!-- Recent Students and Course Distribution -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                <!-- Recent Students -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-clock"></i>
                            Recent Registrations
                        </h3>
                        <a href="#" class="btn-secondary" style="padding: 6px 12px; font-size: 0.875rem;" onclick="navigateToPage('students'); return false;">
                            View All
                        </a>
                    </div>
                    <div class="table-container">
                        ${renderRecentStudentsTable(stats.recentStudents)}
                    </div>
                </div>
                
                <!-- Course Distribution -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-chart-pie"></i>
                            Course Distribution
                        </h3>
                    </div>
                    <div style="padding: var(--spacing-md) 0;">
                        ${renderCourseDistribution(stats.courseDistribution)}
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-bolt"></i>
                        Quick Actions
                    </h3>
                </div>
                    ${renderQuickAction('fa-user-plus', 'Add Student', 'addStudentModal')}
                    ${renderQuickAction('fa-cog', 'System Settings', 'settings')}
                    ${renderQuickAction('fa-file-excel', 'Export All Data', 'export')}
                    ${renderQuickAction('fa-chart-bar', 'View Reports', 'reports')}
            </div>
        </div>
    `;

    // Add event listeners for quick actions
    initializeQuickActions();
}

function calculateStatistics() {
    const students = AppState.students;
    const transactions = AppState.transactions;

    // Get unique courses
    const courses = new Set(students.map(s => s.course).filter(Boolean));

    // Calculate total revenue
    const totalRevenue = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Count pending certificates
    const pendingCertificates = students.filter(s =>
        s.certificateSubmission?.toLowerCase().includes('no')
    ).length;

    // Get recent students (last 5)
    const recentStudents = students
        .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
        .slice(0, 5);

    // Course distribution
    const courseDistribution = {};
    students.forEach(student => {
        if (student.course) {
            courseDistribution[student.course] = (courseDistribution[student.course] || 0) + 1;
        }
    });

    // Calculate target progress (example: 70% of monthly goal)
    const targetProgress = Math.min(Math.round((students.length / 200) * 100), 100);

    return {
        totalStudents: students.length,
        activeCourses: courses.size,
        totalRevenue: totalRevenue,
        pendingCertificates: pendingCertificates,
        recentStudents: recentStudents,
        courseDistribution: courseDistribution,
        targetProgress: targetProgress
    };
}

function renderStatCard(title, value, icon, type, change) {
    const changeHtml = change ? `
        <div class="stat-change ${change.startsWith('+') ? 'positive' : 'negative'}">
            <i class="fas fa-arrow-${change.startsWith('+') ? 'up' : 'down'}"></i>
            ${change}
        </div>
    ` : '';

    return `
        <div class="stat-card ${type}">
            <div class="stat-card-content">
                <div class="stat-info">
                    <h3>${title}</h3>
                    <div class="stat-value">${value}</div>
                    ${changeHtml}
                </div>
                <div class="stat-icon">
                    <i class="fas ${icon}"></i>
                </div>
            </div>
        </div>
    `;
}

function renderRecentStudentsTable(students) {
    if (students.length === 0) {
        return '<p style="padding: var(--spacing-md); text-align: center; color: var(--text-muted);">No students yet</p>';
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr style="cursor: pointer;" onclick="viewStudent('${student.id}')">
                        <td>
                            <div style="font-weight: 500;">${student.nameEnglish || student.nameBangla}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${student.mobile || ''}</div>
                        </td>
                        <td>
                            <span class="badge info" style="font-size: 0.7rem;">
                                ${student.course ? student.course.substring(0, 30) + '...' : 'N/A'}
                            </span>
                        </td>
                        <td style="color: var(--text-muted); font-size: 0.875rem;">
                            ${formatDate(student.registrationDate)}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderCourseDistribution(distribution) {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const colors = [
        'var(--primary-color)',
        'var(--success)',
        'var(--warning)',
        '#667EEA',
        '#FF6B9D',
        '#FFA500'
    ];

    if (total === 0) {
        return '<p style="padding: var(--spacing-md); text-align: center; color: var(--text-muted);">No course data</p>';
    }

    return Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])
        .map(([course, count], index) => {
            const percentage = Math.round((count / total) * 100);
            return `
                <div style="margin-bottom: var(--spacing-md);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.875rem;">
                        <span style="color: var(--text-secondary);">${course.substring(0, 40)}</span>
                        <span style="color: var(--text-primary); font-weight: 600;">${count} (${percentage}%)</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); border-radius: 8px; height: 8px; overflow: hidden;">
                        <div style="background: ${colors[index % colors.length]}; width: ${percentage}%; height: 100%; border-radius: 8px; transition: width 1s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
}

function renderQuickAction(icon, label, action) {
    return `
        <div class="quick-action-card" onclick="handleQuickAction('${action}')" style="
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            text-align: center;
            cursor: pointer;
            transition: all var(--transition-fast);
        " onmouseover="this.style.background='rgba(0,217,255,0.1)'; this.style.borderColor='var(--primary-color)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)';">
            <i class="fas ${icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: var(--spacing-xs);"></i>
            <div style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary);">${label}</div>
        </div>
    `;
}

function initializeQuickActions() {
    // Quick actions are handled by handleQuickAction function
}

function handleQuickAction(action) {
    switch (action) {
        case 'addStudentModal':
            openModal('addStudentModal');
            if (typeof initializeStudentForm === 'function') {
                initializeStudentForm();
            }
            break;
        case 'export':
            exportToCSV();
            break;
        case 'settings':
            navigateToPage('settings');
            break;
        case 'reports':
            showToast('Reports feature coming soon!', 'info');
            break;
    }
}

function viewStudent(id) {
    const student = AppState.students.find(s => s.id === id);
    if (!student) return;

    if (typeof displayStudentProfile === 'function') {
        displayStudentProfile(student);
    }
    openModal('viewStudentModal');
}

// Utility functions for dates are now in app.js

console.log('Dashboard Module Loaded');
