#!/usr/bin/env node

/**
 * Bot Protection Test Script
 * This script simulates bot behavior to test botpoison protection
 */

const API_URL = 'http://localhost:3000/api/contact';

async function testBotSubmission() {
  console.log('🤖 Testing bot submission (should fail)...\n');

  try {
    // Simulate bot submission without botpoison token
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Bot McBotface',
        email: 'bot@example.com',
        phone: '555-123-4567',
        variant: 'contact',
        // No botpoison token - this should fail
      }),
    });

    const data = await response.json();

    if (response.status === 400 && data.error.includes('Bot protection')) {
      console.log('✅ SUCCESS: Bot submission was correctly blocked!');
      console.log(`   Response: ${response.status} ${data.error}`);
    } else {
      console.log('❌ FAILED: Bot submission was not blocked!');
      console.log(`   Response: ${response.status} ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log('❌ FAILED: Error during bot test:', error.message);
  }
}

async function testInvalidToken() {
  console.log('\n🎭 Testing with invalid botpoison token (should fail)...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Fake Token User',
        email: 'fake@example.com',
        phone: '555-123-4567',
        variant: 'contact',
        botpoison: 'fake-invalid-token-12345',
      }),
    });

    const data = await response.json();

    if (response.status === 400 && data.error.includes('Bot protection')) {
      console.log('✅ SUCCESS: Invalid token was correctly rejected!');
      console.log(`   Response: ${response.status} ${data.error}`);
    } else {
      console.log('❌ FAILED: Invalid token was accepted!');
      console.log(`   Response: ${response.status} ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log('❌ FAILED: Error during invalid token test:', error.message);
  }
}

async function testRapidSubmissions() {
  console.log('\n⚡ Testing rapid submissions (should all fail)...\n');

  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Rapid Bot ${i}`,
          email: `rapid${i}@example.com`,
          phone: '555-123-4567',
          variant: 'contact',
          // No botpoison token
        }),
      })
    );
  }

  try {
    const responses = await Promise.all(promises);
    let blockedCount = 0;

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const data = await response.json();

      if (response.status === 400 && data.error.includes('Bot protection')) {
        blockedCount++;
      }
    }

    console.log(`✅ SUCCESS: ${blockedCount}/5 rapid submissions were blocked`);
    if (blockedCount === 5) {
      console.log('   All rapid submissions correctly blocked!');
    }
  } catch (error) {
    console.log('❌ FAILED: Error during rapid submission test:', error.message);
  }
}

async function runAllTests() {
  console.log('🛡️  BOTPOISON PROTECTION TEST SUITE');
  console.log('=====================================\n');

  await testBotSubmission();
  await testInvalidToken();
  await testRapidSubmissions();

  console.log('\n=====================================');
  console.log('🏁 Test suite completed!');
  console.log('\nTo test legitimate submissions:');
  console.log('1. Go to http://localhost:3000/book/trauma');
  console.log('2. Fill out the form normally');
  console.log('3. Submit (should work with real botpoison token)');
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testBotSubmission, testInvalidToken, testRapidSubmissions };