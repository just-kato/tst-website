/**
 * Test API for Twilio Integration
 * Comprehensive testing of SMS sending, webhook processing, and delivery tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendSMS, parseIncomingMessage } from '@/lib/twilio/client';
import { processWebhook } from '@/lib/twilio/webhook-processor';
import { trackMessageDelivery, getDeliveryMetrics } from '@/lib/twilio/delivery-tracking';
// Workflow triggers removed - cron jobs have been gutted
import { initializeDefaultSMSTemplates } from '@/lib/sms/workflows';
import { initializeConversationServer, getConversationStateServer } from '@/lib/conversations/flow-manager-server';
import { getQuickResponseButtons } from '@/lib/conversations/flow-manager';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { testType, ...testData } = await request.json();
    
    // Security check - only allow in development or with secret
    const secret = request.headers.get('x-test-secret');
    if (process.env.NODE_ENV === 'production' && secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`Running Twilio integration test: ${testType}`);
    
    switch (testType) {
      case 'send_sms':
        return await testSendSMS(testData);
      
      case 'webhook_processing':
        return await testWebhookProcessing(testData);
      
      case 'delivery_tracking':
        return await testDeliveryTracking(testData);
      
      case 'workflow_triggers':
        return NextResponse.json({
          success: false,
          error: 'Workflow triggers have been removed - cron jobs were gutted',
          timestamp: new Date().toISOString(),
        });
      
      case 'initialize_templates':
        return await testInitializeTemplates();
      
      case 'conversation_flow':
        return await testConversationFlow(testData);
      
      case 'comprehensive':
        return await runComprehensiveTest(testData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Twilio integration test:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Test SMS sending functionality
 */
async function testSendSMS(data: any): Promise<NextResponse> {
  try {
    const { phoneNumber = '+15551234567', message = 'Test message from Toasted Sesame Therapy' } = data;
    
    console.log(`Sending test SMS to ${phoneNumber}`);
    
    // Test SMS sending
    const result = await sendSMS(phoneNumber, message);
    
    // Store test message in database
    await supabase.from('crm_messages').insert([
      {
        contact_id: 1, // Use a test contact ID
        content: message,
        direction: 'OUTBOUND',
        message_status: 'SENT',
        message_type: 'SMS',
        twilio_sid: result.sid,
      },
    ]);
    
    return NextResponse.json({
      success: true,
      testType: 'send_sms',
      result: {
        messageSid: result.sid,
        status: result.status,
        phoneNumber,
        message,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      testType: 'send_sms',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Test webhook processing functionality
 */
async function testWebhookProcessing(data: any): Promise<NextResponse> {
  try {
    const { simulateIncoming = true } = data;
    
    // Simulate webhook data
    const webhookData = simulateIncoming ? {
      MessageSid: 'SM' + Math.random().toString(36).substr(2, 32),
      From: '+15551234567',
      To: '+14702989902',
      Body: 'Test incoming message',
      MessageStatus: 'received',
    } : {
      MessageSid: 'SM' + Math.random().toString(36).substr(2, 32),
      MessageStatus: 'delivered',
    };
    
    console.log('Testing webhook processing:', webhookData);
    
    // Parse incoming message
    const incomingMessage = parseIncomingMessage(webhookData);
    
    // Process webhook
    const result = await processWebhook(incomingMessage, false);
    
    return NextResponse.json({
      success: true,
      testType: 'webhook_processing',
      result: {
        processed: result.success,
        strategy: result.processed_via,
        operationType: result.operation_type,
        messageId: result.message_id,
        contactId: result.contact_id,
        error: result.error,
      },
      webhookData: incomingMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      testType: 'webhook_processing',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Test delivery tracking functionality
 */
async function testDeliveryTracking(data: any): Promise<NextResponse> {
  try {
    const { messageSid } = data;
    
    if (!messageSid) {
      throw new Error('messageSid required for delivery tracking test');
    }
    
    console.log(`Testing delivery tracking for message: ${messageSid}`);
    
    // Test delivery tracking
    const deliveryStatus = await trackMessageDelivery(messageSid, true);
    
    // Get delivery metrics
    const metrics = await getDeliveryMetrics('last_24h');
    
    return NextResponse.json({
      success: true,
      testType: 'delivery_tracking',
      result: {
        deliveryStatus,
        metrics,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      testType: 'delivery_tracking',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

// testWorkflowTriggers function removed - workflow triggers have been gutted

/**
 * Test template initialization
 */
async function testInitializeTemplates(): Promise<NextResponse> {
  try {
    console.log('Testing template initialization');
    
    await initializeDefaultSMSTemplates();
    
    // Get templates count
    const { data: templates, error } = await supabase
      .from('crm_message_templates')
      .select('id, name, category')
      .eq('is_active', true);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      testType: 'initialize_templates',
      result: {
        templatesCreated: templates?.length || 0,
        templates: templates || [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      testType: 'initialize_templates',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Test conversation flow functionality
 */
async function testConversationFlow(data: any): Promise<NextResponse> {
  try {
    const { contactName = 'Test User', appointmentDateTime } = data;
    
    console.log('Testing conversation flow system');
    
    // Create a test contact
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert([
        {
          name: contactName,
          email: `test-${Date.now()}@example.com`,
          phone_number: `+1555${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
          contact_status: 'ACTIVE',
          appointment_status: 'SCHEDULED',
          archived: false,
        },
      ])
      .select()
      .single();
    
    if (contactError) {
      throw contactError;
    }
    
    // Initialize conversation
    const appointmentDate = appointmentDateTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const conversationState = await initializeConversationServer(
      contact.id,
      appointmentDate,
      contactName
    );
    
    // Get quick response buttons for initial step
    const quickButtons = getQuickResponseButtons(
      conversationState.currentStepId,
      conversationState.variables
    );
    
    // Test retrieving conversation state
    const retrievedState = await getConversationStateServer(contact.id);
    
    return NextResponse.json({
      success: true,
      testType: 'conversation_flow',
      result: {
        contactId: contact.id,
        conversationState,
        quickResponseButtons: quickButtons,
        retrievedState,
        welcomeMessage: conversationState.history[0]?.messageContent,
        currentStep: conversationState.currentStepId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      testType: 'conversation_flow',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Run comprehensive integration test
 */
async function runComprehensiveTest(data: any): Promise<NextResponse> {
  const results: any = {
    tests: {},
    errors: [],
    startTime: new Date().toISOString(),
  };
  
  try {
    console.log('Running comprehensive Twilio integration test');
    
    // 1. Initialize templates
    try {
      const templateResult = await testInitializeTemplates();
      const templateData = await templateResult.json();
      results.tests.templates = templateData;
    } catch (error) {
      results.errors.push(`Template initialization failed: ${(error as Error).message}`);
    }
    
    // 2. Test SMS sending (if phone number provided)
    if (data.phoneNumber) {
      try {
        const smsResult = await testSendSMS(data);
        const smsData = await smsResult.json();
        results.tests.sms = smsData;
        
        // 3. Test delivery tracking with the sent message
        if (smsData.success && smsData.result?.messageSid) {
          try {
            const trackingResult = await testDeliveryTracking({
              messageSid: smsData.result.messageSid,
            });
            const trackingData = await trackingResult.json();
            results.tests.delivery = trackingData;
          } catch (error) {
            results.errors.push(`Delivery tracking failed: ${(error as Error).message}`);
          }
        }
      } catch (error) {
        results.errors.push(`SMS sending failed: ${(error as Error).message}`);
      }
    }
    
    // 4. Test webhook processing
    try {
      const webhookResult = await testWebhookProcessing({ simulateIncoming: true });
      const webhookData = await webhookResult.json();
      results.tests.webhook = webhookData;
    } catch (error) {
      results.errors.push(`Webhook processing failed: ${(error as Error).message}`);
    }
    
    // 5. Workflow triggers skipped - cron jobs have been gutted
    results.tests.workflows = {
      success: false,
      message: 'Workflow triggers have been removed - cron jobs were gutted',
      skipped: true,
    };
    
    results.endTime = new Date().toISOString();
    results.success = results.errors.length === 0;
    results.summary = {
      testsRun: Object.keys(results.tests).length,
      testsSuccessful: Object.values(results.tests).filter((test: any) => test.success).length,
      errorCount: results.errors.length,
    };
    
    return NextResponse.json(results);
  } catch (error) {
    results.endTime = new Date().toISOString();
    results.success = false;
    results.errors.push(`Comprehensive test failed: ${(error as Error).message}`);
    
    return NextResponse.json(results, { status: 500 });
  }
}

// GET method for test documentation and status
export async function GET() {
  return NextResponse.json({
    message: 'Twilio Integration Test API',
    availableTests: [
      {
        type: 'send_sms',
        description: 'Test SMS sending functionality',
        parameters: { phoneNumber: 'string', message: 'string' },
      },
      {
        type: 'webhook_processing',
        description: 'Test webhook processing (incoming messages and status updates)',
        parameters: { simulateIncoming: 'boolean' },
      },
      {
        type: 'delivery_tracking',
        description: 'Test message delivery tracking',
        parameters: { messageSid: 'string (required)' },
      },
      {
        type: 'workflow_triggers',
        description: 'Test automated workflow triggers',
        parameters: { testContactId: 'number', appointmentDateTime: 'string' },
      },
      {
        type: 'initialize_templates',
        description: 'Initialize default SMS templates',
        parameters: {},
      },
      {
        type: 'conversation_flow',
        description: 'Test human-in-the-loop conversation flow system',
        parameters: { contactName: 'string', appointmentDateTime: 'string' },
      },
      {
        type: 'comprehensive',
        description: 'Run all tests in sequence',
        parameters: { phoneNumber: 'string (optional)' },
      },
    ],
    usage: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { testType: 'string', /* ...parameters based on testType */ },
    },
  });
}