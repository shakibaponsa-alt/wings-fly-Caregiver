/**
 * Wings Fly Caregiver Academy - Data Importer
 * Import student data from CSV file
 */

async function importCSVData() {
    try {
        showLoading();
        console.log('Starting CSV import...');

        // Fetch the CSV file
        const response = await fetch('Copy of Fainal Wings Fly Caregiver (web app) - Form Responses 1.csv');
        const csvText = await response.text();

        // Parse CSV
        const students = parseStudentCSV(csvText);

        // Save to AppState
        AppState.students = students;
        saveDataToStorage();

        console.log(`Imported ${students.length} students`);
        showToast(`Successfully imported ${students.length} students!`, 'success');

        // Initialize finance data based on bank details
        initializeFinanceData(students);

        hideLoading();
        return students;
    } catch (error) {
        console.error('Error importing CSV:', error);
        showToast('Error importing data. Using sample data instead.', 'warning');

        // Load sample data instead
        loadSampleData();
        hideLoading();
    }
}

function parseStudentCSV(csvText) {
    const lines = csvText.split('\n');
    const students = [];

    // Skip first empty line and header line (lines 0 and 1)
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
            const student = parseCSVLine(line, i);
            if (student && student.nameEnglish) {
                student.id = generateId();
                student.enrollmentDate = student.registrationDate || new Date().toISOString();
                student.status = 'Active';
                students.push(student);
            }
        } catch (error) {
            console.error(`Error parsing line ${i}:`, error);
        }
    }

    return students;
}

function parseCSVLine(line, lineNumber) {
    // Parse CSV with proper handling of commas inside quotes
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    // Map CSV columns to student object
    const student = {
        registrationDate: values[0] || '',
        nameBangla: values[1] || '',
        nameEnglish: values[2] || '',
        fatherNameBangla: values[3] || '',
        fatherNameEnglish: values[4] || '',
        motherNameBangla: values[5] || '',
        motherNameEnglish: values[6] || '',
        maritalStatus: values[7] || '',
        nationality: values[8] || '',
        nid: values[9] || '',
        mobile: values[10] || '',
        email: values[11] || '',
        village: values[12] || '',
        po: values[13] || '',
        ps: values[14] || '',
        district: values[15] || '',
        division: values[16] || '',
        course: values[17] ? values[17].replace('🔹 ', '').trim() : '',
        certificateSubmission: values[18] || '',
        certificateNote: values[19] || '',
        documents: values[20] || '',
        bankDetails: values[21] || ''
    };

    return student;
}

function initializeFinanceData(students) {
    // Initialize bank accounts from student data
    const bankSet = new Set();
    const mobileBankingSet = new Set();

    students.forEach(student => {
        if (student.bankDetails) {
            // Extract bank names from bank details
            const details = student.bankDetails.toLowerCase();

            // Check for common banks
            if (details.includes('dutch bangla') || details.includes('dbbl')) {
                bankSet.add('Dutch Bangla Bank');
            }
            if (details.includes('islami bank') || details.includes('ibbl')) {
                bankSet.add('Islami Bank Bangladesh');
            }
            if (details.includes('brac bank')) {
                bankSet.add('BRAC Bank');
            }
            if (details.includes('city bank')) {
                bankSet.add('City Bank');
            }
            if (details.includes('sonali bank')) {
                bankSet.add('Sonali Bank');
            }
            if (details.includes('pubali bank')) {
                bankSet.add('Pubali Bank');
            }
            if (details.includes('eastern bank')) {
                bankSet.add('Eastern Bank');
            }
            if (details.includes('standard chartered')) {
                bankSet.add('Standard Chartered Bank');
            }
            if (details.includes('ucb') || details.includes('united commercial')) {
                bankSet.add('United Commercial Bank');
            }

            // Check for mobile banking
            if (details.includes('bkash')) {
                mobileBankingSet.add('bKash');
            }
            if (details.includes('nagad')) {
                mobileBankingSet.add('Nagad');
            }
            if (details.includes('rocket')) {
                mobileBankingSet.add('Rocket');
            }
        }
    });

    // Initialize sample accounts
    AppState.accounts = {
        cash: 567801,
        banks: Array.from(bankSet).map((name, index) => ({
            id: generateId(),
            name: name,
            accountNo: '****' + Math.floor(Math.random() * 10000),
            branch: 'Main Branch',
            balance: Math.floor(Math.random() * 500000) + 100000
        })),
        mobileBanking: Array.from(mobileBankingSet).map((name, index) => ({
            id: generateId(),
            name: name,
            accountNo: '01' + Math.floor(Math.random() * 1000000000),
            balance: Math.floor(Math.random() * 100000) + 10000
        }))
    };

    // Add default bank if none found
    if (AppState.accounts.banks.length === 0) {
        AppState.accounts.banks.push({
            id: generateId(),
            name: 'BRAC Bank Ltd',
            accountNo: '3052570001',
            branch: 'Banasree Branch',
            balance: 558367
        });
    }

    // Add default mobile banking if none found
    if (AppState.accounts.mobileBanking.length === 0) {
        AppState.accounts.mobileBanking.push({
            id: generateId(),
            name: 'bKash',
            accountNo: '01712345678',
            balance: 25000
        });
    }

    // Initialize sample transactions
    initializeSampleTransactions();

    saveDataToStorage();
}

function initializeSampleTransactions() {
    AppState.transactions = [
        {
            id: generateId(),
            date: new Date('2026-02-01').toISOString(),
            type: 'income',
            category: 'Course Fee',
            amount: 35000,
            description: 'Caregiving for Elderly Person Level 3 - 5 students',
            paymentMethod: 'Bank Transfer'
        },
        {
            id: generateId(),
            date: new Date('2026-02-05').toISOString(),
            type: 'income',
            category: 'Course Fee',
            amount: 28000,
            description: 'Primary Health Care Level 2 - 4 students',
            paymentMethod: 'Cash'
        },
        {
            id: generateId(),
            date: new Date('2026-02-08').toISOString(),
            type: 'expense',
            category: 'Salary',
            amount: 45000,
            description: 'Instructor salaries - February',
            paymentMethod: 'Bank Transfer'
        },
        {
            id: generateId(),
            date: new Date('2026-02-10').toISOString(),
            type: 'income',
            category: 'Course Fee',
            amount: 42000,
            description: 'Dementia Caregiver Level 3 - 6 students',
            paymentMethod: 'bKash'
        },
        {
            id: generateId(),
            date: new Date('2026-02-12').toISOString(),
            type: 'expense',
            category: 'Utilities',
            amount: 8500,
            description: 'Electricity and internet bills',
            paymentMethod: 'Cash'
        }
    ];
}

function loadSampleData() {
    // Load sample student data if CSV import fails
    AppState.students = [
        {
            id: generateId(),
            registrationDate: '2026-01-27',
            nameBangla: 'সুমাইয়া বিনতী রায়হান মাইশা',
            nameEnglish: 'Sumaiya Binti Raihan Maisha',
            fatherNameEnglish: 'Raihan Habib',
            motherNameEnglish: 'Fahmida Akter Monika',
            mobile: '01794522502',
            email: 'sumaiyaraihanofficial@gmail.com',
            district: 'Dhaka',
            course: 'Caregiving for Toddler And Children',
            status: 'Active',
            enrollmentDate: '2026-01-27'
        },
        {
            id: generateId(),
            registrationDate: '2026-01-28',
            nameBangla: 'সুইটি শিলা',
            nameEnglish: 'Sweety Shila',
            fatherNameEnglish: 'Shahidul Islam',
            motherNameEnglish: 'Lili Islam',
            mobile: '01308556509',
            email: 'iamsweetyshila@gmail.com',
            district: 'Jashore',
            course: 'Primary Health Care Level 2',
            status: 'Active',
            enrollmentDate: '2026-01-28'
        }
    ];

    initializeFinanceData(AppState.students);
    saveDataToStorage();
}

// Auto-import on first load
if (typeof window !== 'undefined') {
    console.log('Data Importer Module Loaded');
}
