export const fitFreeTemplate = [
  {
    id: '1',
    name: 'Confirmation',
    category: 'WELCOME',
    content:
      "Hi {{client_name}}, this is Kato with the Toasted Sesame Care Team.\n\nYou're set for:\n{{day_time_et}}\n\n\n1 = Confirm appointment\n2 = Reschedule\n3 = Cancel\nReply HELP for support. Reply STOP to opt out.\n",
    variables: ['client_name', 'day_time_et', 'contact_uuid'],
  },
  {
    id: '1b',
    name: 'Confirmation - Awesome Transition',
    category: 'WELCOME',
    content: "Awesome. There are 3 quick questions that I need to ask you to prepare for your consultation. Are you located in GA?\n1 = Yes\n2 = No",
    variables: [],
  },
  {
    id: '1c',
    name: 'Confirmation - Reschedule Response',
    category: 'WELCOME',
    content: "You can reschedule anytime here: https://toastedsesametherapy.com/reschedule/{{contact_uuid}}",
    variables: ['contact_uuid'],
  },
  {
    id: '1d',
    name: 'Confirmation - Cancel Response',
    category: 'WELCOME',
    content: "Your appointment has been cancelled. You can rebook anytime here: https://toastedsesametherapy.com/reschedule/{{contact_uuid}}",
    variables: ['contact_uuid'],
  },
  {
    id: '1ba',
    name: 'Not In State - Referrals',
    category: 'INTAKE',
    content: "Unfortunately we can only see clients that are located in GA. Here are a few referrals that may help: {{ref_a}}, {{ref_b}}. Wishing you the best.",
    variables: ['ref_a', 'ref_b'],
  },
  // If yes, continue flow
  {
    id: '3',
    name: 'Fit-or-Free Offer',
    category: 'INTAKE',
    content:
      "Awesome, we run a Fit or Free first session. If it doesn’t feel helpful or like a fit, there’s no charge. If it does, we’ll continue weekly or bi-weekly. Sound fair?\n1 = Yes\n2 = No",
    variables: [],
  },
  // If no, send referrals and end flow
  {
    id: '3b',
    name: 'Not Interested - Referrals',
    category: 'INTAKE',
    content:
      "Totally get it. Here are a few referrals that may help: {{ref_a}}, {{ref_b}}. Wishing you the best.",
    variables: ['ref_a', 'ref_b'],
  },
  // If yes, continue flow
  {
    id: '4',
    name: 'Private Pay Rate',
    category: 'INTAKE',
    content:
      "Great, sessions are $150 private pay. We can provide a superbill for out-of-network reimbursement. Proceed?\n1 = Yes\n2 = What’s a superbill?\n3 = Prefer insurance referrals",
    variables: [],
  },
  // If what’s a superbill, explain and offer to proceed or insurance referrals
  {
    id: '4b',
    name: 'What is a Superbill',
    category: 'INTAKE',
    content:
      "A superbill is a receipt with the codes your insurer needs for out-of-network reimbursement. Many clients submit and get partial reimbursement, but it depends on your plan.\nProceed private pay while you check reimbursement?\n1 = Yes\n2 = Prefer insurance referrals",
    variables: [],
  },
  // If prefer insurance referrals, send referrals and end flow
  {
    id: '4c',
    name: 'Insurance Referrals',
    category: 'INTAKE',
    content:
      "Got it. We're private pay only, but here are two great resources to find in-network or reduced-fee support:\n• Open Path Collective (affordable sessions) {{ref_open_path}}\n• Inclusive Therapists (affirming providers) {{ref_inclusive}}\nWishing you the best.\nIf you'd ever like to revisit private pay with us, you're welcome to schedule another consultation https://toastedsesametherapy.com/reschedule/{{contact_uuid}}.",
    variables: ['ref_open_path', 'ref_inclusive', 'contact_uuid'],
  },
  // If yes, continue flow
  {
    id: '5',
    name: 'Main Focus Menu',
    category: 'INTAKE',
    content:
      "Main focus?\n1 = Anxiety\n2 = Trauma\n3 = Burnout\n4 = Self-Esteem\n5 = Relationships\n6 = Transitions\n7 = Identity\n8 = ND Support\n9 = Stress\n0 = Other",
    variables: [],
  },
  // Capture focus_label based on response to use in next message
  {
    id: '6',
    name: 'Main Focus Acknowledgement',
    category: 'INTAKE',
    content: "Got it—will tailor to {{focus_label}}.",
    variables: ['focus_label'],
  },
  //continue to appointment pull-forward offer
  {
    id: '7',
    name: 'Pull-Forward Offer',
    category: 'SCHEDULING',
    content:
      "I can get you in sooner if that helps. Here’s what’s open:\n1 = Today {{slot_today}}\n2 = Tomorrow {{slot_tomorrow}}\n3 = Keep current time",
    variables: ['slot_today', 'slot_tomorrow'],
  },
  // If pull-forward accepted, confirm new time
  {
    id: '7b',
    name: 'Pull-Forward Moved',
    category: 'SCHEDULING',
    content: "You’re moved to {{new_time_et}}. Calendar updated.",
    variables: ['new_time_et'],
  },
  // If pull-forward declined, confirm keep time
  {
    id: '7c',
    name: 'Pull-Forward Keep Time',
    category: 'SCHEDULING',
    content:
      "Locked for {{day_time_et}}. Any reason you think you might miss it?",
    variables: ['day_time_et'],
  },
  // If reason given, acknowledge and end flow
  // If no response, end flow
  {
    id: '8',
    name: 'Ghosting - Same Day',
    category: 'REMINDER',
    content: "Still good for {{time_et}} today?\n1 = Yes\n2 = Reschedule",
    variables: ['time_et'],
  },
  {
    id: '9',
    name: 'Ghosting - T-60 Reminder',
    category: 'REMINDER',
    content: "60 min until {{time_et}}.\n1 = Yes\n2 = Reschedule",
    variables: ['time_et'],
  },
  {
    id: '10',
    name: 'Ghosting - Next Day Confirm',
    category: 'REMINDER',
    content: "Confirming tomorrow at {{time_et}}.\n1 = Yes\n2 = Reschedule",
    variables: ['time_et'],
  },
  {
    id: '18',
    name: 'Ghosting - Last Chance',
    category: 'REMINDER',
    content:
      "Final check before we release your spot.\n1 = I’ll be there\n2 = Reschedule\n3 = Cancel",
    variables: [],
  },
  {
    id: '19',
    name: 'Ghosting - Released Spot',
    category: 'REMINDER',
    content:
      "We released {{time_et}} since we didn't hear back. You can reschedule anytime here: https://toastedsesametherapy.com/reschedule/{{contact_uuid}}",
    variables: ['time_et', 'contact_uuid'],
  },
  {
    id: '20',
    name: 'Auto-Reply - RESCHEDULE',
    category: 'AUTOREPLY',
    content:
      "I can get you in sooner:\n1 = Earliest today\n2 = Earliest tomorrow\n3 = Keep current time",
    variables: [],
  },
  {
    id: '21',
    name: 'Auto-Reply - CANCEL',
    category: 'AUTOREPLY',
    content:
      "Your spot has been released. You can rebook anytime here: https://toastedsesametherapy.com/reschedule/{{contact_uuid}}",
    variables: ['contact_uuid'],
  },
  {
    id: '22',
    name: 'Auto-Reply - HELP',
    category: 'AUTOREPLY',
    content:
      "We are not a crisis line. For peer/affirming support (hours vary):\n• Call BlackLine at 800-604-5841\n• Text Thrive Lifeline at 313-662-8209\n• Call Trans Lifeline at 877-565-8860\n• Visit Fireweed Collective’s Crisis Toolkit: {{fireweed_link}}",
    variables: ['fireweed_link'],
  },
];
