// Data storage - using localStorage to persist data between pages
let patients = [];
let appointments = [];

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializePage();
});

// Load data from localStorage
function loadData() {
    const storedPatients = localStorage.getItem('patients');
    const storedAppointments = localStorage.getItem('appointments');
    
    // Initialize with sample data if nothing exists in localStorage
    if (!storedPatients) {
        patients = [
            { id: 'P001', name: 'John Doe', age: 45, gender: 'Male', contact: '555-123-4567', medicalHistory: 'Hypertension', priority: 'Normal' },
            { id: 'P002', name: 'Jane Smith', age: 32, gender: 'Female', contact: '555-987-6543', medicalHistory: 'Diabetes Type 2', priority: 'Critical' },
            { id: 'P003', name: 'Robert Johnson', age: 67, gender: 'Male', contact: '555-456-7890', medicalHistory: 'Arthritis', priority: 'Normal' }
        ];
        savePatients();
    } else {
        patients = JSON.parse(storedPatients);
    }
    
    if (!storedAppointments) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        appointments = [
            { id: 'A001', patientId: 'P001', patientName: 'John Doe', date: today, time: '09:00', purpose: 'Regular checkup', priority: 'Normal' },
            { id: 'A002', patientId: 'P002', patientName: 'Jane Smith', date: today, time: '11:30', purpose: 'Diabetes follow-up', priority: 'Critical' }
        ];
        saveAppointments();
    } else {
        appointments = JSON.parse(storedAppointments);
    }
}

// Save data to localStorage
function savePatients() {
    localStorage.setItem('patients', JSON.stringify(patients));
}

function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Initialize page based on current URL
function initializePage() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set default date fields to today
    const today = new Date().toISOString().split('T')[0];
    const dateFields = document.querySelectorAll('input[type="date"]');
    dateFields.forEach(field => {
        field.value = today;
    });
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Initialize page-specific functionality
    switch(currentPage) {
        case 'index.html':
            // Dashboard page initialization
            setupAddPatientForm();
            break;
            
        case 'patients.html':
            // Patients page initialization
            viewAllPatients();
            setupEditPatientForm();
            break;
            
        case 'appointments.html':
            // Appointments page initialization
            updateAppointmentPatientDropdown();
            displayAppointments();
            setupBookAppointmentForm();
            setupEditAppointmentForm();
            break;
            
        case 'reports.html':
            // Reports page initialization
            updateReportStats();
            break;
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // Update total patients count
    const totalPatientsElements = document.querySelectorAll('#total-patients, #stat-total-patients');
    totalPatientsElements.forEach(element => {
        if (element) element.textContent = patients.length;
    });
    
    // Count critical patients
    const criticalPatients = patients.filter(patient => patient.priority === 'Critical').length;
    const criticalPatientsElements = document.querySelectorAll('#critical-patients, #stat-critical-patients');
    criticalPatientsElements.forEach(element => {
        if (element) element.textContent = criticalPatients;
    });
    
    // Count today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(appointment => appointment.date === today).length;
    const todayAppointmentsElements = document.querySelectorAll('#today-appointments');
    todayAppointmentsElements.forEach(element => {
        if (element) element.textContent = todayAppointments;
    });
    
    // Count weekly appointments for reports page
    const weeklyAppointmentsElement = document.getElementById('stat-weekly-appointments');
    if (weeklyAppointmentsElement) {
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        
        const weeklyAppointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        }).length;
        
        weeklyAppointmentsElement.textContent = weeklyAppointments;
    }
}

// Update report page statistics
function updateReportStats() {
    updateDashboardStats();
    
    // Additional report stats can be added here
}

// Patient Management Functions
function setupAddPatientForm() {
    const form = document.getElementById('add-patient-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addPatient();
        });
    }
}

function addPatient() {
    const name = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('patientAge').value);
    const gender = document.getElementById('patientGender').value;
    const contact = document.getElementById('contactNumber').value.trim();
    const medicalHistory = document.getElementById('medicalHistory').value.trim();
    const priority = document.getElementById('priority').value;
    
    // Validation
    if (name === '') {
        showMessage('Please enter a valid name.', 'error');
        return;
    }
    
    if (isNaN(age) || age < 0 || age > 120) {
        showMessage('Please enter a valid age between 0 and 120.', 'error');
        return;
    }
    
    if (gender === '') {
        showMessage('Please select a gender.', 'error');
        return;
    }
    
    // Generate new ID
    const newId = 'P' + (patients.length + 1).toString().padStart(3, '0');
    
    // Create new patient object
    const newPatient = {
        id: newId,
        name: name,
        age: age,
        gender: gender,
        contact: contact,
        medicalHistory: medicalHistory,
        priority: priority
    };
    
    // Add to patients array
    patients.push(newPatient);
    savePatients();
    
    // Clear form
    document.getElementById('add-patient-form').reset();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Show success message
    showMessage(`Patient ${name} added successfully with ID: ${newId}`, 'success');
}

function viewAllPatients() {
    const tableBody = document.getElementById('patients-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (patients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No patients found.</td></tr>';
        return;
    }
    
    patients.forEach(patient => {
        const row = document.createElement('tr');
        
        // Add priority class if critical
        if (patient.priority === 'Critical') {
            row.classList.add('critical');
        }
        
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.priority}</td>
            <td class="action-buttons">
                <button onclick="viewPatient('${patient.id}')">View</button>
                <button class="secondary-btn" onclick="editPatient('${patient.id}')">Edit</button>
                <button class="danger-btn" onclick="deletePatient('${patient.id}')">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function searchPatients() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        viewAllPatients();
        return;
    }
    
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) || 
        patient.id.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('patients-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (filteredPatients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No matching patients found.</td></tr>';
        return;
    }
    
    filteredPatients.forEach(patient => {
        const row = document.createElement('tr');
        
        if (patient.priority === 'Critical') {
            row.classList.add('critical');
        }
        
        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.priority}</td>
            <td class="action-buttons">
                <button onclick="viewPatient('${patient.id}')">View</button>
                <button class="secondary-btn" onclick="editPatient('${patient.id}')">Edit</button>
                <button class="danger-btn" onclick="deletePatient('${patient.id}')">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    showMessage(`Found ${filteredPatients.length} matching patient(s).`, 'success');
}

function viewPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showMessage('Patient not found.', 'error');
        return;
    }
    
    // Check if we have a modal to display details
    const viewModal = document.getElementById('view-modal');
    const patientDetails = document.getElementById('patient-details');
    
    if (viewModal && patientDetails) {
        // Display in modal
        patientDetails.innerHTML = `
            <div class="patient-detail-row">
                <div class="patient-detail-label">ID:</div>
                <div class="patient-detail-value">${patient.id}</div>
            </div>
            <div class="patient-detail-row">
                <div class="patient-detail-label">Name:</div>
                <div class="patient-detail-value">${patient.name}</div>
            </div>
            <div class="patient-detail-row">
                <div class="patient-detail-label">Age:</div>
                <div class="patient-detail-value">${patient.age}</div>
            </div>
            <div class="patient-detail-row">
                <div class="patient-detail-label">Gender:</div>
                <div class="patient-detail-value">${patient.gender}</div>
            </div>
            <div class="patient-detail-row">
                <div class="patient-detail-label">Contact:</div>
                <div class="patient-detail-value">${patient.contact}</div>
            </div>
            <div class="patient-detail-row">
                <div class="patient-detail-label">Medical History:</div>
                <div class="patient-detail-value">${patient.medicalHistory || 'None'}</div>
            </div>
            <div class="patient-detail-row">
                <div class="patient-detail-label">Priority:</div>
                <div class="patient-detail-value">${patient.priority}</div>
            </div>
        `;
        
        viewModal.style.display = 'block';
    } else {
        // Use alert as fallback
        const patientDetailsText = `
            ID: ${patient.id}
            Name: ${patient.name}
            Age: ${patient.age}
            Gender: ${patient.gender}
            Contact: ${patient.contact}
            Medical History: ${patient.medicalHistory || 'None'}
            Priority: ${patient.priority}
        `;
        
        alert(patientDetailsText);
    }
}

function closeViewModal() {
    const viewModal = document.getElementById('view-modal');
    if (viewModal) {
        viewModal.style.display = 'none';
    }
}

function setupEditPatientForm() {
    const form = document.getElementById('edit-patient-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            savePatientEdit();
        });
    }
}

function editPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showMessage('Patient not found.', 'error');
        return;
    }
    
    // Fill the edit form
    document.getElementById('editPatientId').value = patient.id;
    document.getElementById('editPatientName').value = patient.name;
    document.getElementById('editPatientAge').value = patient.age;
    document.getElementById('editPatientGender').value = patient.gender;
    document.getElementById('editContactNumber').value = patient.contact;
    document.getElementById('editMedicalHistory').value = patient.medicalHistory || '';
    document.getElementById('editPriority').value = patient.priority;
    
    // Show modal
    document.getElementById('edit-modal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function savePatientEdit() {
    const patientId = document.getElementById('editPatientId').value;
    const name = document.getElementById('editPatientName').value.trim();
    const age = parseInt(document.getElementById('editPatientAge').value);
    const gender = document.getElementById('editPatientGender').value;
    const contact = document.getElementById('editContactNumber').value.trim();
    const medicalHistory = document.getElementById('editMedicalHistory').value.trim();
    const priority = document.getElementById('editPriority').value;
    
    // Validation
    if (name === '') {
        showMessage('Please enter a valid name.', 'error');
        return;
    }
    
    if (isNaN(age) || age < 0 || age > 120) {
        showMessage('Please enter a valid age between 0 and 120.', 'error');
        return;
    }
    
    // Find and update patient
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) {
        showMessage('Patient not found.', 'error');
        return;
    }
    
    // Update patient data
    patients[patientIndex].name = name;
    patients[patientIndex].age = age;
    patients[patientIndex].gender = gender;
    patients[patientIndex].contact = contact;
    patients[patientIndex].medicalHistory = medicalHistory;
    patients[patientIndex].priority = priority;
    
    // Save changes
    savePatients();
    
    // Update appointments if priority or name changed
    appointments.forEach(appointment => {
        if (appointment.patientId === patientId) {
            appointment.patientName = name;
            appointment.priority = priority;
        }
    });
    saveAppointments();
    
    // Close modal
    closeEditModal();
    
    // Update patient list
    viewAllPatients();
    
    // Show success message
    showMessage(`Patient ${name} updated successfully.`, 'success');
}

function deletePatient(patientId) {
    const confirmDelete = confirm('Are you sure you want to delete this patient?');
    
    if (!confirmDelete) {
        return;
    }
    
    // Check if patient has appointments
    const hasAppointments = appointments.some(appointment => appointment.patientId === patientId);
    
    if (hasAppointments) {
        const confirmDeleteWithAppointments = confirm('This patient has scheduled appointments. Deleting will also remove all their appointments. Continue?');
        
        if (!confirmDeleteWithAppointments) {
            return;
        }
        
        // Remove all appointments for this patient
        appointments = appointments.filter(appointment => appointment.patientId !== patientId);
        saveAppointments();
    }
    
    // Find patient name for success message
    const patientName = patients.find(p => p.id === patientId)?.name || '';
    
    // Remove patient
    patients = patients.filter(patient => patient.id !== patientId);
    savePatients();
    
    // Update patient list
    viewAllPatients();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Show success message
    showMessage(`Patient ${patientName} deleted successfully.`, 'success');
}

// Appointment Management Functions
function setupBookAppointmentForm() {
    const form = document.getElementById('book-appointment-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            bookAppointment();
        });
    }
}

function updateAppointmentPatientDropdown() {
    const patientDropdowns = document.querySelectorAll('#appointmentPatientId, #editAppointmentPatientId');
    
    patientDropdowns.forEach(dropdown => {
        if (!dropdown) return;
        
        // Save current selection if it exists
        const currentSelection = dropdown.value;
        
        // Clear dropdown except for the first option
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }
        
        // Add patients to dropdown
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.name} (${patient.id}) ${patient.priority === 'Critical' ? '- CRITICAL' : ''}`;
            dropdown.appendChild(option);
        });
        
        // Restore selection if it exists
        if (currentSelection) {
            dropdown.value = currentSelection;
        }
    });
}

function bookAppointment() {
    const patientId = document.getElementById('appointmentPatientId').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const purpose = document.getElementById('appointmentPurpose').value.trim();
    
    // Validation
    if (!patientId) {
        showMessage('Please select a patient.', 'error');
        return;
    }
    
    if (!date) {
        showMessage('Please select a date.', 'error');
        return;
    }
    
    if (!time) {
        showMessage('Please select a time.', 'error');
        return;
    }
    
    if (!purpose) {
        showMessage('Please enter the appointment purpose.', 'error');
        return;
    }
    
    // Get patient details
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showMessage('Selected patient not found.', 'error');
        return;
    }
    
    // Generate new appointment ID
    const newId = 'A' + (appointments.length + 1).toString().padStart(3, '0');
    
    // Create new appointment object
    const newAppointment = {
        id: newId,
        patientId: patientId,
        patientName: patient.name,
        date: date,
        time: time,
        purpose: purpose,
        priority: patient.priority
    };
    
    // Add to appointments array
    appointments.push(newAppointment);
    saveAppointments();
    
    // Clear form
    document.getElementById('book-appointment-form').reset();
    document.getElementById('appointmentDate').value = new Date().toISOString().split('T')[0];
    
    // Update appointments list
    displayAppointments();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Show success message
    showMessage(`Appointment booked successfully for ${patient.name} on ${date} at ${time}.`, 'success');
}

function displayAppointments() {
    const tableBody = document.getElementById('appointments-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (appointments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No appointments found.</td></tr>';
        return;
    }
    
    // Sort by date and time
    const sortedAppointments = [...appointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });
    
    sortedAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        // Add priority class if critical
        if (appointment.priority === 'Critical') {
            row.classList.add('critical');
        }
        
        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientName}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${formatTime(appointment.time)}</td>
            <td>${appointment.purpose}</td>
            <td>${appointment.priority}</td>
            <td class="action-buttons">
                <button class="secondary-btn" onclick="editAppointment('${appointment.id}')">Edit</button>
                <button class="danger-btn" onclick="deleteAppointment('${appointment.id}')">Cancel</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, options);
}

function setupEditAppointmentForm() {
    const form = document.getElementById('edit-appointment-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAppointmentEdit();
        });
    }
}

function editAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        showMessage('Appointment not found.', 'error');
        return;
    }
    
    // Update patient dropdown first
    updateAppointmentPatientDropdown();
    
    // Fill the edit form
    document.getElementById('editAppointmentId').value = appointment.id;
    document.getElementById('editAppointmentPatientId').value = appointment.patientId;
    document.getElementById('editAppointmentDate').value = appointment.date;
    document.getElementById('editAppointmentTime').value = appointment.time;
    document.getElementById('editAppointmentPurpose').value = appointment.purpose;
    
    // Show modal
    document.getElementById('edit-appointment-modal').style.display = 'block';
}

function closeEditAppointmentModal() {
    document.getElementById('edit-appointment-modal').style.display = 'none';
}

function saveAppointmentEdit() {
    const appointmentId = document.getElementById('editAppointmentId').value;
    const patientId = document.getElementById('editAppointmentPatientId').value;
    const date = document.getElementById('editAppointmentDate').value;
    const time = document.getElementById('editAppointmentTime').value;
    const purpose = document.getElementById('editAppointmentPurpose').value.trim();
    
    // Validation
    if (!date) {
        showMessage('Please select a date.', 'error');
        return;
    }
    
    if (!time) {
        showMessage('Please select a time.', 'error');
        return;
    }
    
    if (!purpose) {
        showMessage('Please enter the appointment purpose.', 'error');
        return;
    }
    
    // Find and update appointment
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) {
        showMessage('Appointment not found.', 'error');
        return;
    }
    
    // Get patient details to update priority and name
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showMessage('Patient not found.', 'error');
        return;
    }
    
    // Update appointment data
    appointments[appointmentIndex].date = date;
    appointments[appointmentIndex].time = time;
    appointments[appointmentIndex].purpose = purpose;
    appointments[appointmentIndex].patientName = patient.name;
    appointments[appointmentIndex].priority = patient.priority;
    
    // Save changes
    saveAppointments();
    
    // Close modal
    closeEditAppointmentModal();
    
    // Update appointments list
    displayAppointments();
    
    // Show success message
    showMessage(`Appointment updated successfully for ${patient.name} on ${date} at ${time}.`, 'success');
}

function deleteAppointment(appointmentId) {
    const confirmDelete = confirm('Are you sure you want to cancel this appointment?');
    
    if (!confirmDelete) {
        return;
    }
    
    // Find appointment details for success message
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        showMessage('Appointment not found.', 'error');
        return;
    }
    
    // Remove appointment
    appointments = appointments.filter(a => a.id !== appointmentId);
    saveAppointments();
    
    // Update appointments list
    displayAppointments();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Show success message
    showMessage(`Appointment for ${appointment.patientName} on ${formatDate(appointment.date)} at ${formatTime(appointment.time)} has been cancelled.`, 'success');
}

function viewTodaysAppointments() {
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppointments = appointments.filter(appointment => appointment.date === today);
    
    const tableBody = document.getElementById('appointments-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (todayAppointments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No appointments scheduled for today.</td></tr>';
        showMessage('No appointments scheduled for today.', 'info');
        return;
    }
    
}