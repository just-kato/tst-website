#!/usr/bin/env node

/**
 * Development Bypass Test
 * Tests the development bypass functionality
 */

const API_URL = 'http://localhost:3000/api/contact';

async function testDevBypass() {
  console.log('🚧 Testing development bypass...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Dev Test User',
        email: 'devtest@example.com',
        phone: '555-123-4567',
        variant: 'contact',
        botpoison: 'dev-bypass-token', // Special bypass token
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS: Development bypass worked!');
      console.log(`   Response: ${response.status} - Contact created`);
    } else {
      console.log('❌ FAILED: Development bypass did not work');
      console.log(`   Response: ${response.status} ${data.error}`);
      console.log('\n💡 To enable bypass, add to .env.local:');
      console.log('   BOTPOISON_DEV_BYPASS=true');
    }
  } catch (error) {
    console.log('❌ FAILED: Error during bypass test:', error.message);
  }
}

async function testNormalBot() {
  console.log('\n🤖 Testing normal bot (should still fail)...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Normal Bot',
        email: 'normalbot@example.com',
        phone: '555-123-4567',
        variant: 'contact',
        // No token - should still fail even with bypass enabled
      }),
    });

    const data = await response.json();

    if (response.status === 400) {
      console.log('✅ SUCCESS: Normal bots are still blocked!');
      console.log(`   Response: ${response.status} ${data.error}`);
    } else {
      console.log('❌ FAILED: Normal bot was not blocked!');
      console.log(`   Response: ${response.status} ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log('❌ FAILED: Error during normal bot test:', error.message);
  }
}

async function runTests() {
  console.log('🛠️  DEVELOPMENT BYPASS TEST');
  console.log('============================\n');

  await testDevBypass();
  await testNormalBot();

  console.log('\n============================');
  console.log('🏁 Development test completed!');
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testDevBypass, testNormalBot };