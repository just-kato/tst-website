import {
  somaticAnimation,
  identityAnimation,
  neuroAnimation,
  traumaAnimation,
} from './animations';

export const helpWithKeywords = [
  'Anxiety & Overwhelm',
  'Burnout & Exhaustion',
  'Trauma & CPTSD',
  'Self-Esteem Issues',
  'LGBTQIA+ Affirming',
  'Relationship Challenges',
  'Neurodivergence Support',
  'Life Transitions',
  'ADHD',
  'Stress Management',
  'Cultural Identity',
  'Non-Monogamy',
  'BIPOC Affirming',
  'Depression',
  'Autism Spectrum',
  'Adoption',
  'Racial Stress & Trauma',
  'Identity Exploration',
];


export const individualTherapyData = {
  title: 'One-on-One Support',
  description:
    "A supportive space to help you feel less alone in what you're holding. Our individual therapy sessions are designed for adults in Georgia struggling with anxiety, burnout, and the weight of past trauma. Together, we'll explore what’s been weighing on you, make sense of your experiences, and find a path toward regulation and self-compassion. This work is personalized, collaborative, and guided by your unique needs.",
  tags: ['50-minute sessions', 'Virtual & Phone', 'Personalized Approach'],
  imageUrl:
    'https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/Services%20Page%20Asset.svg',
};

export const ourApproachData = [
  {
    title: 'Neuro-Affirming',
    description:
      'We work with your brain, not against it. Sensory needs, executive function, and nonlinear growth are all valid parts of your process.',
    benefits: [
      "We celebrate the unique ways your brain works, rather than trying to 'fix' it.",
      'Sessions are flexible to accommodate your sensory needs and energy levels.',
      'Your natural ways of processing and communicating are respected and validated.',
    ],
    animationData: neuroAnimation,
    altText:
      'Animation of a brain with gears turning, symbolizing neuro-affirming therapy',
  },
  {
    title: 'Trauma-Informed',
    description:
      "We move at your pace and honor your nervous system. This work centers safety, trust, and regulation so your healing isn't rushed or forced.",
    benefits: [
      'Your safety is our top priority. We always move at a pace that feels comfortable for you.',
      'We focus on building trust and collaboration in our therapeutic relationship.',
      'The goal is to empower you with tools for regulation, not to force you to relive painful memories.',
    ],
    animationData: traumaAnimation,
    altText:
      'Animation of a heart with a protective shield, symbolizing trauma-informed care',
  },
  {
    title: 'Somatic',
    description:
      'Your body holds wisdom, not just symptoms. Together, we build safe ways to listen, release, and come back to yourself.',
    benefits: [
      "We gently explore the connection between your body's sensations and your emotions.",
      "You'll learn practical techniques to release stored tension and calm your nervous system.",
      "It's about learning to listen to your body's wisdom as a path to healing and wholeness.",
    ],
    animationData: somaticAnimation,
    altText:
      'Animation of a person meditating with flowing energy, symbolizing somatic therapy',
  },
  {
    title: 'Identity Work',
    description:
      'We make space for your gender, sexuality, race, neurodivergence, and relationships. Together, we build the boundaries that help you stay connected to who you are.',
    benefits: [
      'This is a safe space to explore all facets of who you are without judgment.',
      'We help you build and reinforce boundaries that protect your energy and sense of self.',
      'Your lived experience is honored as a central and valid part of your story.',
    ],
    animationData: identityAnimation,
    altText:
      'Animation of diverse hands coming together, symbolizing identity work and inclusivity',
  },
];
