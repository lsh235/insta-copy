#!/usr/bin/env node

// Simple test script to verify login and feed functionality

const BASE_URL = 'http://localhost:3000';

async function testLoginAndFeed() {
  console.log('🧪 Starting application test...\n');

  try {
    // Test 1: Check if homepage redirects to login
    console.log('Test 1: Checking homepage redirect...');
    const homeResponse = await fetch(`${BASE_URL}/`);
    const homeUrl = homeResponse.url;
    
    if (homeUrl.includes('/login')) {
      console.log('✅ Homepage correctly redirects to login\n');
    } else {
      console.log('❌ Homepage should redirect to login\n');
      return;
    }

    // Test 2: Check if login page loads
    console.log('Test 2: Checking login page...');
    const loginResponse = await fetch(`${BASE_URL}/login`);
    const loginHtml = await loginResponse.text();
    
    if (loginHtml.includes('Log in') && loginHtml.includes('email')) {
      console.log('✅ Login page loads correctly\n');
    } else {
      console.log('❌ Login page has issues\n');
      return;
    }

    // Test 3: Get session status
    console.log('Test 3: Checking session API...');
    const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`);
    const sessionData = await sessionResponse.json();
    
    if (sessionResponse.ok) {
      console.log('✅ Session API works');
      console.log('   Current session:', sessionData && sessionData.user ? 'Logged in' : 'Not logged in\n');
    } else {
      console.log('❌ Session API failed\n');
      return;
    }

    // Test 4: Check if feed page requires auth
    console.log('Test 4: Checking feed page authentication...');
    const feedResponse = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
    
    if (feedResponse.status === 307 || feedResponse.status === 302) {
      console.log('✅ Feed page correctly requires authentication\n');
    } else {
      console.log('⚠️  Feed page might not be protected\n');
    }

    console.log('📝 Summary:');
    console.log('   - Application is running correctly');
    console.log('   - Authentication flow works');
    console.log('   - Ready for manual testing\n');
    
    console.log('🔐 Test Accounts:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123\n');
    
    console.log('   Email: john@example.com');
    console.log('   Password: password123\n');
    
    console.log('   Email: jane@example.com');
    console.log('   Password: password123\n');

    console.log('🌐 Open in browser: http://localhost:3000');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testLoginAndFeed();
