let currentUser = null;
        let appointments = [
            {
                id: 1,
                date: '2025-06-15',
                time: '10:00',
                doctor: 'Dr. Smith - Cardiology',
                reason: 'Regular checkup',
                status: 'Confirmed'
            },
            {
                id: 2,
                date: '2025-06-20',
                time: '14:00',
                doctor: 'Dr. Johnson - Dermatology',
                reason: 'Skin examination',
                status: 'Pending'
            },
            {
                id: 3,
                date: '2025-06-08',
                time: '11:00',
                doctor: 'Dr. Williams - Pediatrics',
                reason: 'Follow-up visit',
                status: 'Completed'
            }
        ];

        // Navigation functionality
        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update active nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Find and activate the corresponding nav link
            const activeLink = Array.from(navLinks).find(link => 
                link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Close mobile menu if open
            document.getElementById('nav-menu').classList.remove('active');
            document.getElementById('burger').classList.remove('active');
        }

        // Mobile menu toggle
        document.getElementById('burger').addEventListener('click', function() {
            const navMenu = document.getElementById('nav-menu');
            const burger = document.getElementById('burger');
            
            navMenu.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Show alert function
        function showAlert(alertId, message, type) {
            const alert = document.getElementById(alertId);
            alert.textContent = message;
            alert.className = `alert ${type}`;
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 5000);
        }

        // Registration form handler
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = Object.fromEntries(formData);
            
            // Validate password strength
            if (userData.password.length < 6) {
                showAlert('register-alert', 'Password must be at least 6 characters long.', 'error');
                return;
            }
            
            // Simulate registration process
            setTimeout(() => {
                showAlert('register-alert', 'Registration successful! Please log in to continue.', 'success');
                setTimeout(() => {
                    showPage('login');
                }, 2000);
            }, 1000);
        });

        // Login form handler
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (email && password) {
                setTimeout(() => {
                    currentUser = { email: email };
                    showAlert('login-alert', 'Login successful! Welcome back.', 'success');
                    setTimeout(() => {
                        showPage('home');
                    }, 1500);
                }, 1000);
            } else {
                showAlert('login-alert', 'Please enter both email and password.', 'error');
            }
        });

        // Appointment booking form handler
        document.getElementById('booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const appointmentData = Object.fromEntries(formData);
            
            // Validate date is not in the past
            const selectedDate = new Date(appointmentData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showAlert('booking-alert', 'Please select a future date for your appointment.', 'error');
                return;
            }
            
            // Add appointment to the list
            const newAppointment = {
                id: appointments.length + 1,
                date: appointmentData.appointmentDate,
                time: appointmentData.appointmentTime,
                doctor: appointmentData.doctor,
                reason: appointmentData.reason || 'General consultation',
                status: 'Pending'
            };
            
            appointments.unshift(newAppointment);
            updateAppointmentsTable();
            
            showAlert('booking-alert', 'Appointment booked successfully! You will receive a confirmation email shortly.', 'success');
            
            // Reset form
            this.reset();
        });

        // Update appointments table
        function updateAppointmentsTable() {
            const tbody = document.getElementById('appointments-tbody');
            tbody.innerHTML = '';
            
            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                
                let statusColor = '#6c757d';
                if (appointment.status === 'Confirmed') statusColor = '#28a745';
                if (appointment.status === 'Pending') statusColor = '#ffc107';
                
                let actionButton = `<button class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="rescheduleAppointment(${appointment.id})">Reschedule</button>`;
                if (appointment.status === 'Completed') {
                    actionButton = `<button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="viewReport(${appointment.id})">View Report</button>`;
                }
                
                row.innerHTML = `
                    <td>${appointment.date}</td>
                    <td>${appointment.time}:00</td>
                    <td>${appointment.doctor}</td>
                    <td>${appointment.reason}</td>
                    <td><span style="color: ${statusColor}; font-weight: bold;">${appointment.status}</span></td>
                    <td>${actionButton}</td>
                `;
                
                tbody.appendChild(row);
            });
        }

        // Appointment actions
        function rescheduleAppointment(appointmentId) {
            const appointment = appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                if (confirm(`Are you sure you want to reschedule your appointment with ${appointment.doctor}?`)) {
                    showPage('booking');
                    showAlert('booking-alert', 'Please select a new date and time for your appointment.', 'success');
                }
            }
        }

        function viewReport(appointmentId) {
            const appointment = appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                alert(`Medical Report for ${appointment.doctor} visit on ${appointment.date}:\n\nDiagnosis: General health checkup completed\nRecommendations: Continue current medications\nNext visit: Schedule in 3 months\n\nNote: This is a sample report for demonstration purposes.`);
            }
        }

        // Set minimum date for appointment booking to today
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointmentDate').setAttribute('min', today);
            
            // Initialize appointments table
            updateAppointmentsTable();
        });

        // Smooth scrolling for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Form validation helpers
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validatePhone(phone) {
            const re = /^[\+]?[1-9][\d]{0,15}$/;
            return re.test(phone.replace(/\s/g, ''));
        }

        // Enhanced form validation for registration
        document.getElementById('register-form').addEventListener('input', function(e) {
            const field = e.target;
            const value = field.value;
            
            // Remove any existing error styling
            field.style.borderColor = '#e1e5e9';
            
            // Validate specific fields
            switch(field.id) {
                case 'email':
                    if (value && !validateEmail(value)) {
                        field.style.borderColor = '#dc3545';
                    } else if (value && validateEmail(value)) {
                        field.style.borderColor = '#28a745';
                    }
                    break;
                    
                case 'password':
                    if (value.length > 0 && value.length < 6) {
                        field.style.borderColor = '#dc3545';
                    } else if (value.length >= 6) {
                        field.style.borderColor = '#28a745';
                    }
                    break;
                    
                case 'phone':
                    if (value && !validatePhone(value)) {
                        field.style.borderColor = '#dc3545';
                    } else if (value && validatePhone(value)) {
                        field.style.borderColor = '#28a745';
                    }
                    break;
            }
        });

        // Add loading states to buttons
        function addLoadingState(button, originalText) {
            button.disabled = true;
            button.innerHTML = '<span style="opacity: 0.7;">Loading...</span>';
            
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalText;
            }, 2000);
        }

        // Enhanced form submissions with loading states
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            addLoadingState(submitBtn, 'Register');
            
            const formData = new FormData(this);
            const userData = Object.fromEntries(formData);
            
            // Validate all fields
            if (!validateEmail(userData.email)) {
                showAlert('register-alert', 'Please enter a valid email address.', 'error');
                return;
            }
            
            if (userData.password.length < 6) {
                showAlert('register-alert', 'Password must be at least 6 characters long.', 'error');
                return;
            }
            
            if (!validatePhone(userData.phone)) {
                showAlert('register-alert', 'Please enter a valid phone number.', 'error');
                return;
            }
            
            // Simulate registration process
            setTimeout(() => {
                showAlert('register-alert', 'Registration successful! Please log in to continue.', 'success');
                setTimeout(() => {
                    showPage('login');
                }, 2000);
            }, 1000);
        });

        // Add search functionality to appointments
        function searchAppointments() {
            const searchTerm = document.getElementById('appointment-search').value.toLowerCase();
            const rows = document.querySelectorAll('#appointments-tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // Enhanced prescription management
        function requestRefill(medicationName) {
            if (confirm(`Request refill for ${medicationName}?`)) {
                alert(`Refill request submitted for ${medicationName}. Your pharmacy will be notified within 24 hours.`);
            }
        }

        // Add notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
                color: white;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 4000);
        }

        // Add CSS animation for notifications
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            console.log('MediCare Patient Tracking System initialized successfully!');
            
            // Show welcome notification
            setTimeout(() => {
                showNotification('Welcome to MediCare! Your health management system is ready.', 'success');
            }, 1000);
        });