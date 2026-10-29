export const initialCategories = [
  {
    id: 'nutrition',
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'Evidence-informed nutrition guides, gut health, and balanced dietary habits.',
    articleCount: 3
  },
  {
    id: 'fitness',
    name: 'Fitness',
    slug: 'fitness',
    description: 'Practical exercise routines, strength building, and mobility for everyday vitality.',
    articleCount: 2
  },
  {
    id: 'mental-wellness',
    name: 'Mental Wellness',
    slug: 'mental-wellness',
    description: 'Mindfulness, stress reduction techniques, and cognitive health practices.',
    articleCount: 2
  },
  {
    id: 'sleep',
    name: 'Sleep',
    slug: 'sleep',
    description: 'Circadian rhythm science, sleep hygiene, and restorative rest strategies.',
    articleCount: 1
  },
  {
    id: 'heart-health',
    name: 'Heart Health',
    slug: 'heart-health',
    description: 'Cardiovascular wellness, blood pressure care, and proactive heart health.',
    articleCount: 1
  },
  {
    id: 'healthy-lifestyle',
    name: 'Healthy Lifestyle',
    slug: 'healthy-lifestyle',
    description: 'Sustainable daily routines, hydration, ergonomics, and preventative habits.',
    articleCount: 2
  }
];

export const initialSettings = {
  websiteName: 'HealthInsight',
  textLogo: 'HealthInsight',
  logoImageUrl: '',
  tagline: 'Your Guide to Better Health & Sustainable Vitality',
  primaryColor: '#202324',
  accentColor: '#80C8C9',
  contactEmail: 'contact@healthinsight.org',
  contactPhone: '(+62)-822-4545-2882',
  contactAddress: 'Jl. Raya Kuta No. 121, Badung - Bali, Indonesia.',
  socialFacebook: 'https://facebook.com',
  socialTwitter: 'https://twitter.com',
  socialYoutube: 'https://youtube.com',
  socialLinkedin: 'https://linkedin.com',
  footerDescription: 'Dedicated to publishing verified, educational health insights to help you build everyday vitality.',
  copyrightText: '© 2026 HealthInsight Blog. All rights reserved.',
  aboutMission: 'HealthInsight is an independent educational platform created to make evidence-based health and wellness guidance clear, actionable, and accessible to everyone.',
  aboutStandards: 'We adhere to strict editorial principles: every article is thoroughly reviewed for clarity, references peer-reviewed research, and emphasizes preventive lifestyle medicine.',
  privacyPolicy: 'Your privacy matters to us. We do not sell your personal data. We only process information required for blog newsletter subscriptions and contact form inquiries.'
};

export const initialPosts = [
  {
    id: 'post-1',
    title: 'Exploring Future Renewable Energy Innovations & Healthy Environments',
    slug: 'exploring-future-renewable-energy-innovations-healthy-environments',
    excerpt: 'Embark on a journey with us as we delve into the realms of environmental health, clean energy, and sustainable living for longevity.',
    body: `## The Vital Link Between Environment and Longevity

Clean environments directly influence human cellular health, cardiovascular resilience, and respiratory vitality. Emerging research confirms that reducing exposure to ambient pollutants drastically lowers systemic inflammation.

### 1. Air Quality and Cognitive Performance
Recent multi-center clinical trials show that individuals living in areas with lower particulate matter (PM2.5) demonstrate superior cognitive resilience and lower markers of neuroinflammation. 

Key preventive practices include:
- Integrating indoor HEPA air filtration
- Increasing indoor ventilation during peak morning hours
- Cultivating broad-leaf indoor plants that support humidity and air balance

### 2. Sustainable Energy in Everyday Living
Transitioning to clean energy reduces household emissions and creates a peaceful, restorative living space. Mindful design choices, from natural day-lighting to minimizing electronic radiation in sleep sanctuaries, support our natural circadian rhythms.

> "A healthy body cannot thrive in a depleted ecosystem. True wellness begins with the environment we build around ourselves."

### Practical Steps for Home Wellness
1. Prioritize natural sunlight exposure within 30 minutes of waking.
2. Minimize chemical aerosol cleaners in favor of natural antimicrobial alternatives.
3. Establish an evening tech sunset to reduce blue-light disruption.`,
    categoryId: 'healthy-lifestyle',
    categoryName: 'Healthy Lifestyle',
    authorName: 'Dr. Elena Vance, MPH',
    featuredImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    socialImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    isFeatured: true,
    featuredOrder: 1, // Main featured on left
    seoTitle: 'Future Renewable Energy & Healthy Environments | HealthInsight',
    seoDescription: 'Discover how clean living environments and sustainable innovations bolster human longevity and everyday vitality.',
    tags: ['Environment', 'Longevity', 'Healthy Living'],
    readingTime: 6,
    publishedAt: '2023-12-11T09:00:00.000Z',
    createdAt: '2023-12-11T09:00:00.000Z',
    updatedAt: '2023-12-11T09:00:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-2',
    title: 'From Ideas to Impact in a Personal Wellness Journey',
    slug: 'from-ideas-to-impact-in-a-personal-wellness-journey',
    excerpt: 'How micro-habits and consistent daily intentions translate into profound, compounding health improvements over time.',
    body: `## Transforming Health Intentions Into Daily Habit

Many people start health resolutions with grand enthusiasm, only to experience burnout within weeks. The science of habit formation suggests an alternative: micro-commitments.

### The Power of 1% Daily Improvements
When you improve your hydration, sleep consistency, or physical mobility by just one percent each day, the compounding effect over twelve months produces transformative physiological changes.

- **Anchor Habits**: Tie new behaviors to existing routines (e.g., doing 5 minutes of mobility stretches right after your morning brew).
- **Friction Reduction**: Prepare your workout gear and water flask the night before.
- **Accountability Systems**: Track weekly consistency instead of striving for daily perfection.`,
    categoryId: 'healthy-lifestyle',
    categoryName: 'Healthy Lifestyle',
    authorName: 'Marcus Chen',
    featuredImageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: true,
    featuredOrder: 2, // Top right compact
    seoTitle: 'From Ideas to Impact in Wellness | HealthInsight',
    seoDescription: 'Learn how micro-habits compound into lasting physical and mental transformation.',
    tags: ['Habits', 'Mindset', 'Lifestyle'],
    readingTime: 4,
    publishedAt: '2023-11-20T10:30:00.000Z',
    createdAt: '2023-11-20T10:30:00.000Z',
    updatedAt: '2023-11-20T10:30:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-3',
    title: 'Navigating the Tech Landscape with Mindful Health Insights',
    slug: 'navigating-the-tech-landscape-with-mindful-health-insights',
    excerpt: 'Balancing digital productivity with posture, eye health, and neuro-restoration in an screen-dominated era.',
    body: `## The Modern Desk Worker’s Ergonomic & Neurological Survival Guide

Prolonged screen exposure alters our autonomic nervous system, leading to shallow breathing patterns known as "screen apnea" alongside digital eye strain.

### Ergonomic Best Practices
- **20-20-20 Rule**: Every 20 minutes, gaze at an object 20 feet away for at least 20 seconds.
- **Eye-Level Displays**: The top third of your computer monitor should align directly with your eye horizon.
- **Micro-Breaks**: Stand, stretch, and perform spinal extension exercises every 45 minutes.`,
    categoryId: 'fitness',
    categoryName: 'Fitness',
    authorName: 'Sarah Jenkins, PT',
    featuredImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: true,
    featuredOrder: 3, // Middle right compact
    seoTitle: 'Mindful Tech Ergonomics | HealthInsight',
    seoDescription: 'Protect your posture, visual acuity, and nervous system while working with digital technology.',
    tags: ['Ergonomics', 'Posture', 'Tech'],
    readingTime: 5,
    publishedAt: '2023-11-20T14:15:00.000Z',
    createdAt: '2023-11-20T14:15:00.000Z',
    updatedAt: '2023-11-20T14:15:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-4',
    title: 'Behind the Scenes of Crafting Balanced Daily Nutrition',
    slug: 'behind-the-scenes-of-crafting-balanced-daily-nutrition',
    excerpt: 'A deep look into whole foods, micronutrient density, and meal planning that fuels consistent mental clarity.',
    body: `## Beyond Calorie Counting: The Microbiome and Cellular Energy

True nutritional health centers on nourishing your gut microbiome and supplying the cellular mitochondria with bioavailable micronutrients.

### Cornerstones of a Vibrant Diet
1. **Diverse Fiber Sources**: Aim for 25 to 30 diverse plant species per week, including legumes, leafy greens, seeds, and spices.
2. **Quality Protein Timing**: Distribute 25-35 grams of clean protein across your meals to support muscle protein synthesis and blood sugar balance.
3. **Anti-inflammatory Fats**: Emphasize extra virgin olive oil, avocados, cold-water omega-3 rich fish, and walnuts.`,
    categoryId: 'nutrition',
    categoryName: 'Nutrition',
    authorName: 'Chef Julian Reed & Maya Lin, RD',
    featuredImageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: true,
    featuredOrder: 4, // Bottom right compact
    seoTitle: 'Crafting Balanced Daily Nutrition | HealthInsight',
    seoDescription: 'Master whole food meal planning and nutrient density for sustained physical stamina.',
    tags: ['Nutrition', 'Gut Health', 'Meal Prep'],
    readingTime: 4,
    publishedAt: '2023-11-20T16:45:00.000Z',
    createdAt: '2023-11-20T16:45:00.000Z',
    updatedAt: '2023-11-20T16:45:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-5',
    title: 'Empowering Entrepreneurs & Professionals with High-Energy Habits',
    slug: 'empowering-entrepreneurs-success-unveiled',
    excerpt: 'Science-backed strategies for busy leaders to avoid burnout, sustain cognitive focus, and protect metabolic health.',
    body: `## High-Performance Wellness for High-Stress Careers

When workloads expand, health is frequently the first pillar sacrificed. Yet physiological reserves are the bedrock of strategic decision-making.

### Actionable Protocols:
- **Glucose Management**: Avoid high-glycemic breakfasts that trigger afternoon energy crashes.
- **Ultradian Rhythm Sprints**: Work in 90-minute concentrated blocks followed by 10 minutes of physical movement.
- **Hydration & Electrolytes**: Mild dehydration can decrease executive cognitive function by up to 15%.`,
    categoryId: 'mental-wellness',
    categoryName: 'Mental Wellness',
    authorName: 'Alex Rivera',
    featuredImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'High-Energy Habits for Leaders | HealthInsight',
    seoDescription: 'Sustain executive focus and prevent career burnout with metabolic vitality strategies.',
    tags: ['Productivity', 'Energy', 'Burnout'],
    readingTime: 5,
    publishedAt: '2023-11-21T08:00:00.000Z',
    createdAt: '2023-11-21T08:00:00.000Z',
    updatedAt: '2023-11-21T08:00:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-6',
    title: 'Thriving in a Dynamic Health & Fitness Landscape',
    slug: 'thriving-in-a-dynamic-startup-landscape',
    excerpt: 'Navigating fitness fads versus proven physical conditioning for long-term joint health and cardiovascular strength.',
    body: `## Sifting Fitness Trends from Exercise Science

From hyper-specialized workout regimens to viral equipment, the fitness world is saturated with conflicting promises.

### The Timeless Foundations
1. **Progressive Overload**: Consistently challenging your muscular system stimulates bone density and metabolic health.
2. **Zone 2 Cardiovascular Base**: Moderate-intensity aerobic work enhances mitochondrial efficiency and cardiac output.
3. **Mobility & Joint Health**: Active range of motion preserves independence and pain-free movement as we age.`,
    categoryId: 'fitness',
    categoryName: 'Fitness',
    authorName: 'Coach David Thorne',
    featuredImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'Thriving in Fitness & Conditioning | HealthInsight',
    seoDescription: 'Focus on proven exercise physiology to build enduring functional strength.',
    tags: ['Fitness', 'Cardio', 'Longevity'],
    readingTime: 6,
    publishedAt: '2023-12-08T11:00:00.000Z',
    createdAt: '2023-12-08T11:00:00.000Z',
    updatedAt: '2023-12-08T11:00:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-7',
    title: 'Strategies Propelling Everyday Health Tech & Vitality',
    slug: 'strategies-propelling-tech-startups-to-success',
    excerpt: 'How wearable biometric tracking can empower proactive health decisions without causing analysis paralysis.',
    body: `## Mindful Biometric Tracking

Modern smartwatches and fitness rings track sleep stages, HRV (heart rate variability), resting heart rate, and step counts. But how do we use this data without succumbing to health anxiety?

### How to Interpret Biomarkers
- **Look at Trends, Not Daily Blips**: One poor night of sleep does not dictate your week. Examine 14-day rolling averages.
- **Listen to Your Body First**: If your tracker says you are fully recovered but you feel deeply fatigued, honor your subjective sensation.`,
    categoryId: 'healthy-lifestyle',
    categoryName: 'Healthy Lifestyle',
    authorName: 'Dr. Anita Desai',
    featuredImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'Health Tech & Wearable Biometrics | HealthInsight',
    seoDescription: 'Leverage wearable biometric feedback to make informed preventive health adjustments.',
    tags: ['Tech', 'Wearables', 'HRV'],
    readingTime: 4,
    publishedAt: '2023-12-08T13:20:00.000Z',
    createdAt: '2023-12-08T13:20:00.000Z',
    updatedAt: '2023-12-08T13:20:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-8',
    title: 'Pioneering Preventative Care in Modern Healthcare Systems',
    slug: 'pioneering-the-future-in-our-startup-showcase',
    excerpt: 'The transition from reactive sick-care to proactive longevity medicine and comprehensive routine screening.',
    body: `## The Paradigm Shift to Prevention

For decades, modern medicine excelled at acute emergency treatment while lagging in early prevention of chronic metabolic conditions. Today, preventative care is taking center stage.

### Key Preventative Blood Panels to Discuss With Your Physician
- Advanced lipid testing (ApoB, Lp(a))
- Fasting insulin and HbA1c for early glycemic assessment
- hs-CRP and Homocysteine for vascular inflammation
- Vitamin D3, Ferritin, and full thyroid panels`,
    categoryId: 'heart-health',
    categoryName: 'Heart Health',
    authorName: 'Dr. Michael Sterling, MD',
    featuredImageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'Preventative Medicine & Screening | HealthInsight',
    seoDescription: 'Why proactive biomarker screening is essential for long-term healthspan.',
    tags: ['Prevention', 'Cardiovascular', 'Medicine'],
    readingTime: 7,
    publishedAt: '2023-12-08T15:00:00.000Z',
    createdAt: '2023-12-08T15:00:00.000Z',
    updatedAt: '2023-12-08T15:00:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-9',
    title: 'Artificial Intelligence & Diagnostic Innovations in Medicine',
    slug: 'artificial-intelligence-impact-on-modern-industries',
    excerpt: 'Examining how modern computational tools assist pathologists, radiologists, and researchers in early disease detection.',
    body: `## AI in Diagnostic Medicine: Augmenting Clinical Precision

Machine learning models trained on millions of clinical imaging scans are rapidly assisting physicians in spotting micro-anomalies that human eyes might miss.

### Current Clinical Breakthroughs
- **Dermatological Screening**: Smartphone cameras paired with neural networks flagging irregular melanomas.
- **Cardiology ECG Analysis**: Algorithms detecting subtle cardiac arrhythmia hours before physical symptoms manifest.
- **Drug Discovery Acceleration**: Rapid molecular modeling cutting down experimental phases for novel therapeutics.`,
    categoryId: 'mental-wellness',
    categoryName: 'Mental Wellness',
    authorName: 'Tanya Gomez, Bio-informatics Researcher',
    featuredImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'AI in Diagnostic Health Innovations | HealthInsight',
    seoDescription: 'How computational intelligence is enhancing diagnostic precision across modern clinical medicine.',
    tags: ['AI', 'Health Tech', 'Diagnostics'],
    readingTime: 5,
    publishedAt: '2023-12-11T12:00:00.000Z',
    createdAt: '2023-12-11T12:00:00.000Z',
    updatedAt: '2023-12-11T12:00:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-10',
    title: 'Healthy Eating Habits for a Fast-Paced Busy Lifestyle',
    slug: 'healthy-eating-habits-for-a-busy-lifestyle',
    excerpt: 'Practical meal strategies, smart snacking, and mindful hydration for individuals with demanding schedules.',
    body: `## Nutrition Strategies When You Don’t Have Hours to Cook

Eating well does not require spending three hours every night in the kitchen. With a few strategic habits, you can nourish your body efficiently.

### 1. The Power of "Formula Meals"
Instead of complex recipes, construct meals using a simple formula:
- **Base**: Leafy greens or steamed vegetables
- **Protein**: Canned wild salmon, hard-boiled eggs, grilled chicken breast, or tofu
- **Complex Carb**: Quinoa, sweet potato, or brown rice
- **Healthy Fat**: Pumpkin seeds, olive oil drizzle, or tahini dressing

### 2. Smart Snacking Essentials
Keep raw almonds, roasted chickpeas, or unsweetened Greek yogurt within arm’s reach to curb reactive sugar cravings.`,
    categoryId: 'nutrition',
    categoryName: 'Nutrition',
    authorName: 'Laura Vance, Nutritionist',
    featuredImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'Healthy Eating Habits for Busy Lives | HealthInsight',
    seoDescription: 'Simple, time-efficient nutrition formulas for busy professionals and students.',
    tags: ['Nutrition', 'Meal Prep', 'Quick Meals'],
    readingTime: 4,
    publishedAt: '2023-12-11T14:30:00.000Z',
    createdAt: '2023-12-11T14:30:00.000Z',
    updatedAt: '2023-12-11T14:30:00.000Z',
    deletedAt: null
  },
  {
    id: 'post-11',
    title: 'The Neuroscience of Deep Restorative Sleep',
    slug: 'the-neuroscience-of-deep-restorative-sleep',
    excerpt: 'Understanding slow-wave sleep, glymphatic brain clearance, and bedtime protocols for genuine restoration.',
    body: `## Why Sleep is Your Brain’s Most Important Washing Cycle

During deep non-REM stage 3 sleep, the glymphatic system opens up, washing away metabolic waste products accumulated throughout the day.

### Four Non-Negotiable Sleep Hygiene Rules:
1. **Consistent Bedtime**: Go to sleep and wake up within a 30-minute window every day, even on weekends.
2. **Cool Room Temperature**: Keep your bedroom around 65°F (18°C) to allow core body temperature to decline naturally.
3. **No Caffeine Past 2 PM**: Caffeine has an average half-life of 5 to 7 hours and disrupts deep sleep architecture.
4. **Darkness and Silence**: Use blackout shades or an eye mask for uninterrupted melatonin production.`,
    categoryId: 'sleep',
    categoryName: 'Sleep',
    authorName: 'Dr. Jason Wu, Sleep Specialist',
    featuredImageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    socialImageUrl: '',
    status: 'published',
    isFeatured: false,
    seoTitle: 'Neuroscience of Deep Sleep | HealthInsight',
    seoDescription: 'Optimize slow-wave sleep and glymphatic brain detox with evidence-backed sleep protocols.',
    tags: ['Sleep', 'Neuroscience', 'Recovery'],
    readingTime: 6,
    publishedAt: '2023-12-12T08:15:00.000Z',
    createdAt: '2023-12-12T08:15:00.000Z',
    updatedAt: '2023-12-12T08:15:00.000Z',
    deletedAt: null
  }
];
