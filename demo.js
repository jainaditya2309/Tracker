// Health Tracker PWA - Demo Script
// Run this in the browser console to demonstrate all features

console.log('🏃‍♀️ Health Tracker PWA - Feature Demo Starting...');

// Demo script to showcase all features
async function runDemo() {
    console.log('📋 Demo: Setting up daily goals...');
    
    // Set demo goals
    document.getElementById('calorie-goal').value = '2000';
    document.getElementById('protein-goal').value = '100'; 
    document.getElementById('water-goal').value = '2000';
    document.getElementById('morning-skincare').value = '08:00';
    document.getElementById('evening-skincare').value = '22:00';
    
    // Save goals
    healthTracker.setDailyGoals();
    console.log('✅ Goals set successfully');
    
    await delay(1000);
    
    console.log('📊 Demo: Adding sample intake data...');
    
    // Add sample calorie intake
    document.getElementById('calorie-input').value = '400';
    healthTracker.addIntake('calories');
    
    await delay(500);
    
    document.getElementById('calorie-input').value = '300';
    healthTracker.addIntake('calories');
    
    await delay(500);
    
    // Add sample protein intake
    document.getElementById('protein-input').value = '25';
    healthTracker.addIntake('protein');
    
    await delay(500);
    
    document.getElementById('protein-input').value = '20';
    healthTracker.addIntake('protein');
    
    await delay(500);
    
    // Add sample water intake
    document.getElementById('water-input').value = '500';
    healthTracker.addIntake('water');
    
    await delay(500);
    
    document.getElementById('water-input').value = '300';
    healthTracker.addIntake('water');
    
    console.log('✅ Sample data added - check progress bars!');
    
    await delay(1000);
    
    console.log('✨ Demo: Testing skincare tracker...');
    
    // Check off some skincare tasks
    document.getElementById('morning-cleansing').checked = true;
    healthTracker.updateSkincareTask('morning-cleansing', true);
    
    await delay(500);
    
    document.getElementById('morning-moisturizing').checked = true;
    healthTracker.updateSkincareTask('morning-moisturizing', true);
    
    console.log('✅ Skincare tasks updated');
    
    await delay(1000);
    
    console.log('🔔 Demo: Testing notifications...');
    
    // Request notification permission if not already granted
    if (!healthTracker.notificationPermission) {
        console.log('📢 Please grant notification permission when prompted');
        await healthTracker.requestNotificationPermission();
    }
    
    await delay(1000);
    
    console.log('📋 Demo: Checking reminders...');
    healthTracker.showReminders();
    
    await delay(2000);
    
    console.log('🎨 Demo: Testing theme toggle...');
    healthTracker.toggleTheme();
    
    await delay(1000);
    
    healthTracker.toggleTheme(); // Switch back
    
    console.log('🎉 Demo completed! All features demonstrated.');
    console.log('');
    console.log('🔧 Try these manual tests:');
    console.log('• Add more intake data and watch progress bars');
    console.log('• Toggle dark/light mode');
    console.log('• Check off remaining skincare tasks');
    console.log('• Test "Reset Today" button');
    console.log('• Try installing as PWA (look for install icon in address bar)');
    console.log('• Test offline mode by disconnecting internet');
}

// Helper function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Feature test functions
function testDataPersistence() {
    console.log('💾 Testing data persistence...');
    
    const originalData = JSON.stringify(healthTracker.daily);
    console.log('Current data:', originalData);
    
    // Simulate page refresh
    healthTracker.loadData();
    const loadedData = JSON.stringify(healthTracker.daily);
    
    if (originalData === loadedData) {
        console.log('✅ Data persistence test passed');
    } else {
        console.log('❌ Data persistence test failed');
    }
}

function testProgressCalculation() {
    console.log('📊 Testing progress calculations...');
    
    const tests = [
        { current: 500, target: 2000, expected: 25 },
        { current: 1000, target: 2000, expected: 50 },
        { current: 2000, target: 2000, expected: 100 },
        { current: 2500, target: 2000, expected: 100 } // Should cap at 100%
    ];
    
    tests.forEach((test, index) => {
        const percentage = Math.min(100, (test.current / test.target) * 100);
        const passed = percentage === test.expected;
        console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} ${test.current}/${test.target} = ${percentage}% (expected ${test.expected}%)`);
    });
}

function testNotificationSupport() {
    console.log('🔔 Testing notification support...');
    
    if ('Notification' in window) {
        console.log('✅ Notification API supported');
        console.log('Permission status:', Notification.permission);
        
        if (Notification.permission === 'granted') {
            console.log('✅ Notifications are enabled');
            
            // Test notification
            new Notification('🧪 Test Notification', {
                body: 'Health Tracker PWA notification system is working!',
                icon: './icon-192x192.png'
            });
        } else {
            console.log('⚠️ Notifications need permission');
        }
    } else {
        console.log('❌ Notification API not supported in this browser');
    }
}

function testServiceWorker() {
    console.log('⚙️ Testing Service Worker...');
    
    if ('serviceWorker' in navigator) {
        console.log('✅ Service Worker API supported');
        
        navigator.serviceWorker.getRegistrations().then(registrations => {
            if (registrations.length > 0) {
                console.log('✅ Service Worker registered:', registrations[0].scope);
                console.log('Service Worker state:', registrations[0].active?.state);
            } else {
                console.log('⚠️ No Service Worker registrations found');
            }
        });
    } else {
        console.log('❌ Service Worker not supported in this browser');
    }
}

function testPWAFeatures() {
    console.log('📱 Testing PWA features...');
    
    // Check manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
        console.log('✅ Manifest linked:', manifestLink.href);
    } else {
        console.log('❌ No manifest found');
    }
    
    // Check theme color
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
        console.log('✅ Theme color set:', themeColor.content);
    }
    
    // Check viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        console.log('✅ Viewport configured:', viewport.content);
    }
    
    // Check if app is running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('✅ Running in standalone PWA mode');
    } else {
        console.log('ℹ️ Running in browser mode (can still be installed)');
    }
}

// Comprehensive test suite
function runAllTests() {
    console.log('🧪 Running comprehensive test suite...');
    console.log('=====================================');
    
    testDataPersistence();
    testProgressCalculation();
    testNotificationSupport();
    testServiceWorker();
    testPWAFeatures();
    
    console.log('=====================================');
    console.log('🎯 Test suite completed!');
}

// Make functions available globally
window.healthTrackerDemo = {
    runDemo,
    runAllTests,
    testDataPersistence,
    testProgressCalculation,
    testNotificationSupport,
    testServiceWorker,
    testPWAFeatures
};

console.log('🎮 Demo functions loaded! Try:');
console.log('• healthTrackerDemo.runDemo() - Full feature demo');
console.log('• healthTrackerDemo.runAllTests() - Run test suite');
console.log('• healthTrackerDemo.testNotificationSupport() - Test notifications');

// Auto-run demo after 3 seconds if user wants
setTimeout(() => {
    if (confirm('🎬 Would you like to run the automatic feature demo?')) {
        runDemo();
    }
}, 3000);
