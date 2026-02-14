/**
 * Wings Fly Caregiver Academy - Students Module
 * Student management, registration, and profiles
 */

function loadStudentsPage() {
    const studentsPage = document.getElementById('students-page');
    if (!studentsPage) return;

    const students = AppState.students;

    studentsPage.innerHTML = `
        <div class="students-container">
            <!-- Page Header -->
            <div class="flex-between mb-2">
                <div>
                    <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 4px;">Students</h1>
                    <p style="color: var(--text-muted);">Manage student registrations and profiles</p>
                </div>
                <button class="btn-primary" onclick="openAddStudentModal()">
                    <i class="fas fa-plus"></i> Add New Student
                </button>
            </div>
            
            <!-- Filters and Search -->
            <div class="card mb-2">
                <div style="display: flex; gap: var(--spacing-md); align-items: center; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <div class="search-bar">
                            <i class="fas fa-search"></i>
                            <input type="text" id="studentSearch" placeholder="Search by name, mobile, email, NID..." style="width: 100%;">
                        </div>
                    </div>
                    <select id="courseFilter" class="form-select" style="width: 250px;">
                        <option value="">All Courses</option>
                        ${getUniqueCourses().map(course => `<option value="${course}">${course}</option>`).join('')}
                    </select>
                    <select id="statusFilter" class="form-select" style="width: 150px;">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <!-- Students Statistics -->
            <div class="stats-grid mb-2" style="grid-template-columns: repeat(4, 1fr);">
                <div class="stat-card info">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Total Students</h3>
                            <div class="stat-value" id="totalStudentsCount">${students.length}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                    </div>
                </div>
                <div class="stat-card success">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Active</h3>
                            <div class="stat-value" id="activeStudentsCount">${students.filter(s => s.status === 'Active').length}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    </div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>This Month</h3>
                            <div class="stat-value" id="thisMonthCount">${getThisMonthStudents()}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                    </div>
                </div>
                <div class="stat-card error">
                    <div class="stat-card-content">
                        <div class="stat-info">
                            <h3>Pending Certificates</h3>
                            <div class="stat-value" id="pendingCertCount">${getPendingCertificates()}</div>
                        </div>
                        <div class="stat-icon"><i class="fas fa-certificate"></i></div>
                    </div>
                </div>
            </div>
            
            <!-- Students Table -->
            <div class="card">
                <div class="table-container" id="studentsTableContainer">
                    ${renderStudentsTable(students)}
                </div>
            </div>
        </div>
    `;

    // Initialize filters
    initializeStudentFilters();
}

function renderStudentsTable(students) {
    if (students.length === 0) {
        return `
            <div style="padding: var(--spacing-xl); text-align: center;">
                <i class="fas fa-user-graduate" style="font-size: 3rem; color: var(--text-muted); opacity: 0.5; margin-bottom: var(--spacing-md);"></i>
                <h3 style="color: var(--text-secondary); margin-bottom: var(--spacing-xs);">No Students Found</h3>
                <p style="color: var(--text-muted); margin-bottom: var(--spacing-md);">Start by adding your first student</p>
                <button class="btn-primary" onclick="openAddStudentModal()">
                    <i class="fas fa-plus"></i> Add Student
                </button>
            </div>
        `;
    }

    return `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Course</th>
                    <th>District</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students.map((student, index) => `
                    <tr>
                        <td style="font-weight: 600; color: var(--primary-color);">#${String(index + 1).padStart(3, '0')}</td>
                        <td>
                            <div style="font-weight: 500;">${student.nameEnglish || student.nameBangla}</div>
                            <div class="bengali-text" style="font-size: 0.75rem; color: var(--text-muted);">${student.nameBangla || ''}</div>
                        </td>
                        <td style="color: var(--text-secondary);">${student.mobile || 'N/A'}</td>
                        <td>
                            <span class="badge info" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;">
                                ${student.course || 'N/A'}
                            </span>
                        </td>
                        <td style="color: var(--text-secondary);">${student.district || 'N/A'}</td>
                        <td style="color: var(--text-muted); font-size: 0.875rem;">${formatDate(student.registrationDate)}</td>
                        <td>
                            <span class="badge ${getStatusBadgeClass(student.status)}">${student.status || 'Active'}</span>
                        </td>
                        <td>
                            <div style="display: flex; gap: 4px;">
                                <button class="icon-btn" onclick="viewStudentDetails('${student.id}')" title="View Details" style="width: 32px; height: 32px; font-size: 0.875rem;">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="icon-btn" onclick="editStudent('${student.id}')" title="Edit" style="width: 32px; height: 32px; font-size: 0.875rem;">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-btn" onclick="deleteStudent('${student.id}')" title="Delete" style="width: 32px; height: 32px; font-size: 0.875rem;">
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

function initializeStudentFilters() {
    const searchInput = document.getElementById('studentSearch');
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterStudents, 300));
    }
    if (courseFilter) {
        courseFilter.addEventListener('change', filterStudents);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterStudents);
    }
}

function filterStudents() {
    const searchQuery = document.getElementById('studentSearch')?.value.toLowerCase() || '';
    const courseFilter = document.getElementById('courseFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    let filtered = AppState.students;

    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(student => {
            return (
                student.nameBangla?.toLowerCase().includes(searchQuery) ||
                student.nameEnglish?.toLowerCase().includes(searchQuery) ||
                student.mobile?.includes(searchQuery) ||
                student.email?.toLowerCase().includes(searchQuery) ||
                student.nid?.includes(searchQuery) ||
                student.fatherNameEnglish?.toLowerCase().includes(searchQuery)
            );
        });
    }

    // Apply course filter
    if (courseFilter) {
        filtered = filtered.filter(student => student.course === courseFilter);
    }

    // Apply status filter
    if (statusFilter) {
        filtered = filtered.filter(student => student.status === statusFilter);
    }

    // Update table
    const tableContainer = document.getElementById('studentsTableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = renderStudentsTable(filtered);
    }

    // Update counts
    document.getElementById('totalStudentsCount').textContent = filtered.length;
}

function openAddStudentModal() {
    initializeStudentForm();
    openModal('addStudentModal');
}

function initializeStudentForm() {
    const form = document.getElementById('addStudentForm');
    if (!form) return;

    form.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Name (Bangla) <span class="required">*</span></label>
                <input type="text" name="nameBangla" class="form-input bengali-text" required>
            </div>
            <div class="form-group">
                <label>Name (English) <span class="required">*</span></label>
                <input type="text" name="nameEnglish" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Father's Name (English)</label>
                <input type="text" name="fatherNameEnglish" class="form-input">
            </div>
            <div class="form-group">
                <label>Mother's Name (English)</label>
                <input type="text" name="motherNameEnglish" class="form-input">
            </div>
            <div class="form-group">
                <label>Mobile Number <span class="required">*</span></label>
                <input type="tel" name="mobile" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-input">
            </div>
            <div class="form-group">
                <label>NID / Passport No</label>
                <input type="text" name="nid" class="form-input">
            </div>
            <div class="form-group">
                <label>Marital Status</label>
                <select name="maritalStatus" class="form-select">
                    <option value="">Select...</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>District <span class="required">*</span></label>
                <input type="text" name="district" class="form-input" required>
            </div>
            <div class="form-group">
                <label>Division</label>
                <input type="text" name="division" class="form-input">
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>Course <span class="required">*</span></label>
                <select name="course" class="form-select" required>
                    <option value="">Select Course...</option>
                    <option value="Caregiving for Toddler And Children">Caregiving for Toddler And Children</option>
                    <option value="Primary Health Care Level 2">Primary Health Care Level 2</option>
                    <option value="Caregiving for Elderly Person Level 3">Caregiving for Elderly Person Level 3</option>
                    <option value="Dementia Caregiver Level 3">Dementia Caregiver Level 3</option>
                    <option value="Caregiving for Special Need">Caregiving for Special Need</option>
                </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label>Address</label>
                <textarea name="address" class="form-textarea" rows="2"></textarea>
            </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.05);">
            <button type="button" class="btn-secondary" onclick="closeModal('addStudentModal')">
                Cancel
            </button>
            <button type="submit" class="btn-primary">
                <i class="fas fa-save"></i> Save Student
            </button>
        </div>
    `;

    form.onsubmit = handleStudentFormSubmit;
}

function handleStudentFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const student = {
        id: generateId(),
        nameBangla: formData.get('nameBangla'),
        nameEnglish: formData.get('nameEnglish'),
        fatherNameEnglish: formData.get('fatherNameEnglish'),
        motherNameEnglish: formData.get('motherNameEnglish'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        nid: formData.get('nid'),
        maritalStatus: formData.get('maritalStatus'),
        district: formData.get('district'),
        division: formData.get('division'),
        course: formData.get('course'),
        address: formData.get('address'),
        registrationDate: new Date().toISOString(),
        enrollmentDate: new Date().toISOString(),
        status: 'Active'
    };

    AppState.students.push(student);
    saveDataToStorage();

    closeModal('addStudentModal');
    loadStudentsPage();
    showToast('Student added successfully!', 'success');
}

function viewStudentDetails(id) {
    const student = AppState.students.find(s => s.id === id);
    if (!student) return;

    displayStudentProfile(student);
    openModal('viewStudentModal');
}

function displayStudentProfile(student) {
    const profileContent = document.getElementById('studentProfileContent');
    if (!profileContent) return;

    profileContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: var(--spacing-lg);">
            <!-- Profile Picture -->
            <div>
                <div style="width: 180px; height: 180px; background: var(--gradient-primary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: white; margin-bottom: var(--spacing-md);">
                    <i class="fas fa-user"></i>
                </div>
                <span class="badge ${getStatusBadgeClass(student.status)}" style="width: 100%; justify-content: center;">
                    ${student.status || 'Active'}
                </span>
            </div>
            
            <!-- Student Details -->
            <div>
                <h2 style="font-size: 1.5rem; margin-bottom: 4px;">${student.nameEnglish || student.nameBangla}</h2>
                <p class="bengali-text" style="color: var(--text-muted); margin-bottom: var(--spacing-md);">${student.nameBangla || ''}</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md);">
                    ${renderProfileField('fas fa-book-open', 'Course', student.course)}
                    ${renderProfileField('fas fa-phone', 'Mobile', student.mobile)}
                    ${renderProfileField('fas fa-envelope', 'Email', student.email)}
                    ${renderProfileField('fas fa-id-card', 'NID', student.nid)}
                    ${renderProfileField('fas fa-user', 'Father', student.fatherNameEnglish)}
                    ${renderProfileField('fas fa-user', 'Mother', student.motherNameEnglish)}
                    ${renderProfileField('fas fa-map-marker-alt', 'District', student.district)}
                    ${renderProfileField('fas fa-calendar', 'Enrolled', formatDate(student.enrollmentDate))}
                </div>
            </div>
        </div>
    `;
}

function renderProfileField(icon, label, value) {
    return `
        <div style="display: flex; gap: var(--spacing-sm); align-items: start;">
            <i class="${icon}" style="color: var(--primary-color); margin-top: 4px;"></i>
            <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${label}</div>
                <div style="color: var(--text-primary); font-weight: 500;">${value || 'N/A'}</div>
            </div>
        </div>
    `;
}

function editStudent(id) {
    showToast('Edit feature coming soon!', 'info');
}

function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    AppState.students = AppState.students.filter(s => s.id !== id);
    saveDataToStorage();
    loadStudentsPage();
    showToast('Student deleted successfully!', 'success');
}

// Helper functions
function getUniqueCourses() {
    return [...new Set(AppState.students.map(s => s.course).filter(Boolean))];
}

function getStatusBadgeClass(status) {
    if (status === 'Active') return 'success';
    if (status === 'Completed') return 'info';
    if (status === 'Inactive') return 'error';
    return 'warning';
}

function getThisMonthStudents() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return AppState.students.filter(student => {
        const date = new Date(student.registrationDate);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;
}

function getPendingCertificates() {
    return AppState.students.filter(s =>
        s.certificateSubmission?.toLowerCase().includes('no')
    ).length;
}

console.log('Students Module Loaded');
