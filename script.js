// Health Tracker PWA - Main JavaScript File

class HealthTracker {
    constructor() {
        this.goals = {
            calories: 2000,
            protein: 100,
            water: 2000,
            morningTime: '08:00',
            eveningTime: '22:00'
        };
        
        this.daily = {
            calories: 0,
            protein: 0,
            water: 0,
            skincare: {
                morningCleansing: false,
                morningMoisturizing: false,
                eveningCleansing: false,
                eveningMoisturizing: false
            }
        };
        
        this.notificationPermission = false;
        this.reminderIntervals = [];
        
        this.init();
    }

    // Initialize the app
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.checkMidnightReset();
        this.requestNotificationPermission();
        this.setupReminders();
        this.registerServiceWorker();
        this.setupPWAInstall();
    }

    // Load data from localStorage
    loadData() {
        const savedGoals = localStorage.getItem('healthTracker-goals');
        const savedDaily = localStorage.getItem('healthTracker-daily');
        const savedTheme = localStorage.getItem('healthTracker-theme');
        const lastDate = localStorage.getItem('healthTracker-lastDate');
        
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
        }
        
        // Check if it's a new day and reset if needed
        const today = new Date().toDateString();
        if (lastDate !== today) {
            this.resetDay(false); // Silent reset for new day
        } else if (savedDaily) {
            this.daily = JSON.parse(savedDaily);
        }
        
        // Apply saved theme
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('healthTracker-goals', JSON.stringify(this.goals));
        localStorage.setItem('healthTracker-daily', JSON.stringify(this.daily));
        localStorage.setItem('healthTracker-lastDate', new Date().toDateString());
    }

    // Setup event listeners
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Save goals
        document.getElementById('save-goals').addEventListener('click', () => {
            this.setDailyGoals();
        });

        // Reset day
        document.getElementById('reset-day').addEventListener('click', () => {
            this.confirmResetDay();
        });

        // Check reminders
        document.getElementById('check-reminders').addEventListener('click', () => {
            this.showReminders();
        });

        // Enable notifications
        document.getElementById('enable-notifications').addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        // Skincare checkboxes
        const checkboxes = document.querySelectorAll('.checkbox-item input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateSkincareTask(e.target.id, e.target.checked);
            });
        });

        // Enter key support for inputs
        ['calorie-input', 'protein-input', 'water-input'].forEach(inputId => {
            document.getElementById(inputId).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const type = inputId.replace('-input', '') + 's';
                    this.addIntake(type);
                }
            });
        });
    }

    // Set daily goals
    setDailyGoals() {
        const calorieGoal = document.getElementById('calorie-goal').value;
        const proteinGoal = document.getElementById('protein-goal').value;
        const waterGoal = document.getElementById('water-goal').value;
        const morningTime = document.getElementById('morning-skincare').value;
        const eveningTime = document.getElementById('evening-skincare').value;

        if (calorieGoal) this.goals.calories = parseInt(calorieGoal);
        if (proteinGoal) this.goals.protein = parseInt(proteinGoal);
        if (waterGoal) this.goals.water = parseInt(waterGoal);
        if (morningTime) this.goals.morningTime = morningTime;
        if (eveningTime) this.goals.eveningTime = eveningTime;

        this.saveData();
        this.updateUI();
        this.setupReminders();
        this.showToast('Goals saved successfully! 🎯');
    }

    // Add intake data
    addIntake(type) {
        const inputId = type.slice(0, -1) + '-input'; // Remove 's' from end
        const input = document.getElementById(inputId);
        const value = parseFloat(input.value);

        if (!value || value <= 0) {
            this.showToast('Please enter a valid amount! ⚠️', 'error');
            return;
        }

        const typeKey = type.slice(0, -1); // Remove 's' from end
        this.daily[typeKey] += value;
        input.value = '';
        
        this.saveData();
        this.updateUI();
        this.showToast(`Added ${value} ${typeKey}! 👍`);
        
        // Check if goal is reached
        this.checkGoalCompletion(typeKey);
    }

    // Update UI with current data
    updateUI() {
        this.updateGoalInputs();
        this.updateProgress();
        this.updateSkincareUI();
    }

    // Update goal inputs
    updateGoalInputs() {
        document.getElementById('calorie-goal').value = this.goals.calories;
        document.getElementById('protein-goal').value = this.goals.protein;
        document.getElementById('water-goal').value = this.goals.water;
        document.getElementById('morning-skincare').value = this.goals.morningTime;
        document.getElementById('evening-skincare').value = this.goals.eveningTime;
    }

    // Update progress displays
    updateProgress() {
        this.updateProgressCard('calorie', this.daily.calories, this.goals.calories);
        this.updateProgressCard('protein', this.daily.protein, this.goals.protein);
        this.updateProgressCard('water', this.daily.water, this.goals.water);
    }

    // Update individual progress card
    updateProgressCard(type, current, target) {
        const currentEl = document.getElementById(`${type}-current`);
        const targetEl = document.getElementById(`${type}-target`);
        const remainingEl = document.getElementById(`${type}-remaining`);
        const progressEl = document.getElementById(`${type}-progress`);

        const remaining = Math.max(0, target - current);
        const percentage = Math.min(100, (current / target) * 100);

        currentEl.textContent = Math.round(current);
        targetEl.textContent = target;
        remainingEl.textContent = remaining > 0 ? `${Math.round(remaining)} remaining` : 'Goal reached! 🎉';
        progressEl.style.width = `${percentage}%`;

        // Add visual feedback for completed goals
        const card = progressEl.closest('.progress-card');
        if (percentage >= 100) {
            card.classList.add('success');
            remainingEl.style.color = 'var(--success)';
        } else {
            card.classList.remove('success');
            remainingEl.style.color = 'var(--text-secondary)';
        }
    }

    // Update skincare UI
    updateSkincareUI() {
        document.getElementById('morning-time').textContent = this.goals.morningTime;
        document.getElementById('evening-time').textContent = this.goals.eveningTime;

        // Update checkboxes
        Object.keys(this.daily.skincare).forEach(task => {
            const checkbox = document.getElementById(task.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (checkbox) {
                checkbox.checked = this.daily.skincare[task];
                checkbox.closest('.checkbox-item').classList.toggle('completed', this.daily.skincare[task]);
            }
        });
    }

    // Update skincare task
    updateSkincareTask(taskId, completed) {
        const taskKey = taskId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        this.daily.skincare[taskKey] = completed;
        this.saveData();
        
        const item = document.getElementById(taskId).closest('.checkbox-item');
        item.classList.toggle('completed', completed);
        
        this.showToast(completed ? 'Skincare task completed! ✨' : 'Skincare task unchecked');
    }

    // Check goal completion and send notifications
    checkGoalCompletion(type) {
        const current = this.daily[type];
        const target = this.goals[type];
        const percentage = (current / target) * 100;

        if (percentage >= 100) {
            this.sendNotification(`🎉 ${type.charAt(0).toUpperCase() + type.slice(1)} goal reached!`, 
                `Great job! You've reached your daily ${type} goal.`);
        } else if (percentage >= 75) {
            const remaining = target - current;
            this.sendNotification(`🔥 Almost there!`, 
                `Only ${Math.round(remaining)} ${type === 'water' ? 'ml' : type === 'protein' ? 'g' : ''} ${type} left to reach your goal!`);
        }
    }

    // Show reminders for remaining goals
    showReminders() {
        const reminders = [];
        
        if (this.daily.calories < this.goals.calories) {
            reminders.push(`${this.goals.calories - this.daily.calories} calories remaining`);
        }
        
        if (this.daily.protein < this.goals.protein) {
            reminders.push(`${this.goals.protein - this.daily.protein}g protein remaining`);
        }
        
        if (this.daily.water < this.goals.water) {
            reminders.push(`${this.goals.water - this.daily.water}ml water remaining`);
        }

        const incompleteSkincare = Object.entries(this.daily.skincare)
            .filter(([key, value]) => !value)
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());
        
        if (incompleteSkincare.length > 0) {
            reminders.push(`Skincare tasks: ${incompleteSkincare.join(', ')}`);
        }

        if (reminders.length === 0) {
            this.showToast('All goals completed! 🌟', 'success');
        } else {
            this.sendNotification('📋 Daily Reminders', reminders.join('\n'));
            this.showToast(`${reminders.length} reminders sent!`);
        }
    }

    // Reset day data
    resetDay(showConfirmation = true) {
        if (showConfirmation && !confirm('Are you sure you want to reset today\'s progress?')) {
            return;
        }

        this.daily = {
            calories: 0,
            protein: 0,
            water: 0,
            skincare: {
                morningCleansing: false,
                morningMoisturizing: false,
                eveningCleansing: false,
                eveningMoisturizing: false
            }
        };

        this.saveData();
        this.updateUI();
        
        if (showConfirmation) {
            this.showToast('Day reset successfully! 🔄');
        }
    }

    // Setup automatic midnight reset
    checkMidnightReset() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            this.resetDay(false);
            // Setup recurring daily reset
            setInterval(() => {
                this.resetDay(false);
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }

    // Request notification permission
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            this.showToast('This browser does not support notifications', 'error');
            return;
        }

        const permission = await Notification.requestPermission();
        this.notificationPermission = permission === 'granted';
        
        if (this.notificationPermission) {
            this.showToast('Notifications enabled! 🔔');
            document.getElementById('enable-notifications').textContent = 'Notifications Enabled ✓';
            document.getElementById('enable-notifications').disabled = true;
        } else {
            this.showToast('Notifications denied. Enable them in browser settings.', 'error');
        }
    }

    // Send notification
    sendNotification(title, body, options = {}) {
        if (!this.notificationPermission) return;

        const defaultOptions = {
            body: body,
            icon: 'icon-192x192.png',
            badge: 'icon-192x192.png',
            tag: 'health-tracker',
            requireInteraction: false,
            ...options
        };

        new Notification(title, defaultOptions);
    }

    // Setup skincare reminders
    setupReminders() {
        // Clear existing intervals
        this.reminderIntervals.forEach(interval => clearInterval(interval));
        this.reminderIntervals = [];

        // Check reminders every minute
        const reminderInterval = setInterval(() => {
            this.checkSkincareReminders();
        }, 60000); // Check every minute

        this.reminderIntervals.push(reminderInterval);
        
        // Initial check
        this.checkSkincareReminders();
    }

    // Check if it's time for skincare reminders
    checkSkincareReminders() {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Morning reminder
        if (currentTime === this.goals.morningTime && 
            (!this.daily.skincare.morningCleansing || !this.daily.skincare.morningMoisturizing)) {
            this.sendNotification('🌅 Morning Skincare Reminder', 
                'Time for your morning skincare routine!');
        }
        
        // Evening reminder
        if (currentTime === this.goals.eveningTime && 
            (!this.daily.skincare.eveningCleansing || !this.daily.skincare.eveningMoisturizing)) {
            this.sendNotification('🌙 Evening Skincare Reminder', 
                'Time for your evening skincare routine!');
        }
    }

    // Toggle theme
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('healthTracker-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    // Update theme icon
    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Confirm reset day
    confirmResetDay() {
        if (confirm('Are you sure you want to reset today\'s progress? This action cannot be undone.')) {
            this.resetDay(false);
            this.showToast('Day reset successfully! 🔄');
        }
    }

    // Register service worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./service-worker.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    // Setup PWA install prompt
    setupPWAInstall() {
        let deferredPrompt;
        const installBtn = document.getElementById('install-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'block';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    this.showToast('App installed successfully! 📱');
                }
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });

        // Hide install button if already installed
        window.addEventListener('appinstalled', () => {
            installBtn.style.display = 'none';
            this.showToast('Welcome to Health Tracker PWA! 🎉');
        });
    }
}

// Global functions for HTML onclick events
function addIntake(type) {
    healthTracker.addIntake(type);
}

function closeInstallModal() {
    document.getElementById('install-instructions').style.display = 'none';
}

// Initialize app when DOM is loaded
let healthTracker;

document.addEventListener('DOMContentLoaded', () => {
    healthTracker = new HealthTracker();
});

// Utility functions
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getCurrentTimeString() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Handle app visibility change for better performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh data when app becomes visible
        if (healthTracker) {
            healthTracker.updateUI();
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    healthTracker.showToast('Back online! 🌐');
});

window.addEventListener('offline', () => {
    healthTracker.showToast('You\'re offline. Data will sync when reconnected. 📱');
});

// Prevent form submission on Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
    }
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Performance optimization: Debounce input events
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

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HealthTracker };
}
