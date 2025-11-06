#!/usr/bin/env node

/**
 * Security Monitoring Script
 * Helps track botpoison performance and potential false positives
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeSecurityMetrics() {
  console.log('🔍 SECURITY METRICS ANALYSIS');
  console.log('============================\n');

  try {
    // Get all contacts from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return;
    }

    // Analyze the data
    const total = contacts.length;
    const verified = contacts.filter(c => c.custom_fields?.botpoisonVerified).length;
    const needsReview = contacts.filter(c => c.custom_fields?.needsReview).length;
    const unverified = contacts.filter(c => !c.custom_fields?.botpoisonVerified).length;

    console.log(`📊 LAST 7 DAYS SUMMARY:`);
    console.log(`   Total Submissions: ${total}`);
    console.log(`   Botpoison Verified: ${verified} (${((verified/total)*100).toFixed(1)}%)`);
    console.log(`   Unverified but Allowed: ${unverified} (${((unverified/total)*100).toFixed(1)}%)`);
    console.log(`   Flagged for Review: ${needsReview} (${((needsReview/total)*100).toFixed(1)}%)`);

    console.log('\n📋 RECENT SUBMISSIONS:');
    console.log('======================');

    contacts.slice(0, 10).forEach((contact, index) => {
      const status = contact.custom_fields?.botpoisonVerified ? '✅ Verified' :
                     contact.custom_fields?.needsReview ? '⚠️  Review' : '❓ Unknown';
      const timestamp = new Date(contact.created_at).toLocaleString();

      console.log(`${index + 1}. ${contact.name} (${contact.email})`);
      console.log(`   Status: ${status} | ${timestamp}`);
      if (contact.custom_fields?.userAgent) {
        const ua = contact.custom_fields.userAgent;
        const browser = ua.includes('Chrome') ? 'Chrome' :
                       ua.includes('Firefox') ? 'Firefox' :
                       ua.includes('Safari') ? 'Safari' : 'Other';
        console.log(`   Browser: ${browser}`);
      }
      console.log('');
    });

    // Check for potential false positives
    const potentialFalsePositives = contacts.filter(c =>
      c.custom_fields?.needsReview &&
      c.custom_fields?.userAgent &&
      !c.custom_fields.userAgent.includes('bot')
    );

    if (potentialFalsePositives.length > 0) {
      console.log('🚨 POTENTIAL FALSE POSITIVES:');
      console.log('=============================');
      potentialFalsePositives.forEach(contact => {
        console.log(`   ${contact.name} (${contact.email})`);
        console.log(`   Reason: ${contact.custom_fields?.securityStatus || 'Unknown'}`);
      });
    } else {
      console.log('✅ No obvious false positives detected');
    }

    // Performance metrics
    console.log('\n📈 PERFORMANCE INDICATORS:');
    console.log('==========================');
    console.log(`   False Positive Rate: ${((potentialFalsePositives.length/total)*100).toFixed(1)}%`);
    console.log(`   Security Coverage: ${((verified/total)*100).toFixed(1)}%`);

    if (verified/total > 0.8) {
      console.log('   ✅ Good security coverage');
    } else if (verified/total > 0.6) {
      console.log('   ⚠️  Moderate security coverage');
    } else {
      console.log('   ❌ Low security coverage - consider investigating');
    }

  } catch (error) {
    console.error('Error analyzing metrics:', error);
  }
}

async function checkRecentBlocked() {
  console.log('\n🚫 BLOCKED SUBMISSIONS CHECK');
  console.log('============================');
  console.log('(Checking server logs for blocked attempts...)');
  console.log('Note: Check your server logs for "Bot protection" or "Security verification" errors');
  console.log('These would indicate submissions that were blocked by botpoison.');
}

async function runMonitoring() {
  await analyzeSecurityMetrics();
  await checkRecentBlocked();

  console.log('\n💡 RECOMMENDATIONS:');
  console.log('===================');
  console.log('1. Monitor false positive rate - should be < 5%');
  console.log('2. Check user feedback for security-related issues');
  console.log('3. Review flagged submissions in your dashboard');
  console.log('4. Consider temporarily disabling if false positive rate > 10%');
  console.log('\nTo disable botpoison temporarily, comment out the verification in:');
  console.log('   src/app/api/contact/route.ts');
}

if (require.main === module) {
  runMonitoring().catch(console.error);
}

module.exports = { analyzeSecurityMetrics, checkRecentBlocked };