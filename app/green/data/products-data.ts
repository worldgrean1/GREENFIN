import { Product } from './products';

export const products: Product[] = [
  // 1. Cooking Solutions - Higher Tier
  {
    name: 'Electric Induction Cooktop',
    category: 'cooking-higher',
    subcategory: 'Electric Stoves',
    price: 4500,
    rating: 4.8,
    tags: ['Electric', 'Zero Emissions', 'Modern'],
    description:
      'High-efficiency electric induction cooktop with precise temperature control and minimal emissions.',
    sale: false,
    oldPrice: null,
    badge: 'PREMIUM',
    targetUsers: ['Modern households', 'Grid-connected areas'],
    applications: [
      'All cooking needs',
      'Professional cooking',
      'Clean cooking',
    ],
    specifications: {
      power: '2000W',
      efficiency: '90% energy efficiency',
      warranty: '3 years',
    },
  },
  {
    name: 'LPG Gas Stove System',
    category: 'cooking-higher',
    subcategory: 'LPG Systems',
    price: 3200,
    rating: 4.6,
    tags: ['LPG', 'Clean Burning', 'Convenient'],
    description:
      'Complete LPG cooking system with safety features and efficient gas consumption.',
    sale: false,
    oldPrice: null,
    badge: null,
    targetUsers: ['Urban families', 'Commercial kitchens'],
    applications: ['Fast cooking', 'Restaurant use', 'Catering'],
    specifications: {
      capacity: '15kg LPG cylinder compatible',
      efficiency: '60% thermal efficiency',
      warranty: '2 years',
    },
  },

  // 3. Solar PV Systems
  {
    name: 'Household Solar System 200W',
    category: 'solar-pv',
    subcategory: 'Residential',
    price: 16500,
    rating: 4.7,
    tags: ['Solar', 'Off-grid', 'Household'],
    description:
      'Complete solar PV system for households including panels, battery, inverter, and lighting.',
    sale: true,
    oldPrice: 19000,
    badge: 'POPULAR',
    targetUsers: ['Rural households', 'Off-grid communities'],
    applications: ['Home lighting', 'Phone charging', 'Small appliances'],
    specifications: {
      power: '200W solar panel',
      capacity: '100Ah battery',
      warranty: '5 years panels, 2 years battery',
    },
  },
  {
    name: 'School Solar System 1kW',
    category: 'solar-pv',
    subcategory: 'Institutional',
    price: 85000,
    rating: 4.9,
    tags: ['Solar', 'Educational', 'Large Scale'],
    description:
      'Solar PV system designed for schools and educational institutions with classroom lighting and computer power.',
    sale: false,
    oldPrice: null,
    badge: 'INSTITUTIONAL',
    targetUsers: ['Schools', 'Educational institutions'],
    applications: [
      'Classroom lighting',
      'Computer labs',
      'Administrative offices',
    ],
    specifications: {
      power: '1000W solar array',
      capacity: '500Ah battery bank',
      warranty: '10 years panels, 3 years system',
    },
  },
  {
    name: 'Health Center Solar System 2kW',
    category: 'solar-pv',
    subcategory: 'Healthcare',
    price: 165000,
    rating: 4.8,
    tags: ['Solar', 'Healthcare', 'Critical Power'],
    description:
      'Reliable solar power system for health centers with backup power for medical equipment.',
    sale: false,
    oldPrice: null,
    badge: 'CRITICAL',
    targetUsers: ['Health centers', 'Clinics', 'Medical facilities'],
    applications: ['Medical equipment', 'Lighting', 'Refrigeration'],
    specifications: {
      power: '2000W solar array',
      capacity: '800Ah battery bank',
      warranty: '10 years panels, 5 years system',
    },
  },

  // 4. PUE (Productive Use of Energy) Products
  {
    name: 'Solar Water Pump 500W',
    category: 'pue',
    subcategory: 'Water Pumping',
    price: 28000,
    rating: 4.6,
    tags: ['Solar', 'Water Pump', 'Agriculture'],
    description:
      'Solar-powered water pump for irrigation and livestock watering, designed for smallholder farmers.',
    sale: false,
    oldPrice: null,
    badge: 'FARMING',
    targetUsers: ['Smallholder farmers', 'Agricultural cooperatives'],
    applications: ['Irrigation', 'Livestock watering', 'Garden watering'],
    specifications: {
      power: '500W solar pump',
      capacity: '2000L/hour flow rate',
      warranty: '3 years',
    },
  },
  {
    name: 'Solar Milk Chiller',
    category: 'pue',
    subcategory: 'Food Processing',
    price: 45000,
    rating: 4.5,
    tags: ['Solar', 'Dairy', 'Food Safety'],
    description:
      'Solar-powered milk cooling system to maintain milk quality and extend shelf life for dairy farmers.',
    sale: false,
    oldPrice: null,
    badge: 'DAIRY',
    targetUsers: ['Dairy farmers', 'Milk cooperatives'],
    applications: ['Milk cooling', 'Dairy processing', 'Food preservation'],
    specifications: {
      power: '800W solar system',
      capacity: '200L milk storage',
      warranty: '3 years',
    },
  },
  {
    name: 'Solar Grain Mill',
    category: 'pue',
    subcategory: 'Food Processing',
    price: 35000,
    rating: 4.4,
    tags: ['Solar', 'Grain Processing', 'Income Generation'],
    description:
      'Solar-powered grain milling system for processing cereals and generating income in rural communities.',
    sale: true,
    oldPrice: 42000,
    badge: 'SALE',
    targetUsers: ['Entrepreneurs', 'Rural communities', 'Cooperatives'],
    applications: ['Grain milling', 'Flour production', 'Income generation'],
    specifications: {
      power: '1000W solar system',
      capacity: '50kg/hour processing',
      warranty: '2 years',
    },
  },

  // 5. Solar Water Pumping Systems
  {
    name: 'Agricultural Solar Pump 1HP',
    category: 'water-pumping',
    subcategory: 'Irrigation',
    price: 55000,
    rating: 4.7,
    tags: ['Solar', 'Irrigation', 'Agriculture', 'High Capacity'],
    description:
      'High-capacity solar water pumping system for agricultural irrigation with automatic controls.',
    sale: false,
    oldPrice: null,
    badge: 'AGRICULTURE',
    targetUsers: [
      'Large farms',
      'Agricultural cooperatives',
      'Commercial farmers',
    ],
    applications: [
      'Large-scale irrigation',
      'Crop watering',
      'Agricultural production',
    ],
    specifications: {
      power: '1HP (750W) pump',
      capacity: '5000L/hour flow rate',
      warranty: '5 years',
    },
  },
  {
    name: 'Community Water Pump Solar',
    category: 'water-pumping',
    subcategory: 'Drinking Water',
    price: 75000,
    rating: 4.8,
    tags: ['Solar', 'Community', 'Drinking Water', 'Reliable'],
    description:
      'Solar-powered water pumping system for community drinking water supply in rural and off-grid areas.',
    sale: false,
    oldPrice: null,
    badge: 'COMMUNITY',
    targetUsers: ['Rural communities', 'Villages', 'Water committees'],
    applications: [
      'Community water supply',
      'Drinking water',
      'Water distribution',
    ],
    specifications: {
      power: '1.5HP (1100W) pump',
      capacity: '8000L/hour flow rate',
      warranty: '7 years',
    },
  },

  // 6. Solar Street Lights
  {
    name: 'Solar Street Light 30W',
    category: 'street-lights',
    subcategory: 'Standard',
    price: 8500,
    rating: 4.5,
    tags: ['Solar', 'Street Lighting', 'LED', 'Automatic'],
    description:
      'Standalone solar street light with LED technology and automatic dusk-to-dawn operation.',
    sale: false,
    oldPrice: null,
    badge: null,
    targetUsers: ['Municipalities', 'Communities', 'Private developments'],
    applications: ['Street lighting', 'Pathway lighting', 'Public spaces'],
    specifications: {
      power: '30W LED light',
      capacity: '12V 40Ah battery',
      warranty: '3 years',
    },
  },
  {
    name: 'Solar Street Light 60W Premium',
    category: 'street-lights',
    subcategory: 'Premium',
    price: 15000,
    rating: 4.9,
    tags: ['Solar', 'High Power', 'Smart Control', 'Durable'],
    description:
      'High-power solar street light with smart controls and motion sensors for enhanced efficiency.',
    sale: true,
    oldPrice: 18000,
    badge: 'PREMIUM',
    targetUsers: ['Cities', 'Commercial areas', 'Industrial zones'],
    applications: ['Main roads', 'Commercial lighting', 'Security lighting'],
    specifications: {
      power: '60W LED light',
      capacity: '12V 80Ah battery',
      warranty: '5 years',
    },
  },

  // 7. Power Backup Systems
  {
    name: 'Home Backup System 1kW',
    category: 'power-backup',
    subcategory: 'Residential',
    price: 45000,
    rating: 4.6,
    tags: ['Backup Power', 'Inverter', 'Battery', 'Home Use'],
    description:
      'Complete backup power system for homes with inverter and battery bank for essential appliances.',
    sale: false,
    oldPrice: null,
    badge: 'RELIABLE',
    targetUsers: ['Homeowners', 'Small businesses', 'Clinics'],
    applications: ['Power outages', 'Essential appliances', 'Emergency power'],
    specifications: {
      power: '1000W inverter',
      capacity: '200Ah battery bank',
      warranty: '3 years inverter, 2 years battery',
    },
  },
  {
    name: 'Commercial Backup System 5kW',
    category: 'power-backup',
    subcategory: 'Commercial',
    price: 185000,
    rating: 4.8,
    tags: ['Commercial', 'High Capacity', 'UPS', 'Business'],
    description:
      'High-capacity backup power system for commercial and institutional use with extended runtime.',
    sale: false,
    oldPrice: null,
    badge: 'COMMERCIAL',
    targetUsers: ['Businesses', 'Institutions', 'Hospitals', 'Schools'],
    applications: [
      'Business continuity',
      'Critical equipment',
      'Extended outages',
    ],
    specifications: {
      power: '5000W inverter',
      capacity: '800Ah battery bank',
      warranty: '5 years system',
    },
  },

  // 8. Advisory and Business Development Services
  {
    name: 'RE System Design Consultation',
    category: 'advisory',
    subcategory: 'Design Services',
    price: 5000,
    rating: 4.9,
    tags: ['Consultation', 'Design', 'Custom', 'Expert'],
    description:
      'Professional renewable energy system design and consultation services for custom installations.',
    sale: false,
    oldPrice: null,
    badge: 'EXPERT',
    targetUsers: ['Developers', 'Businesses', 'Organizations', 'Government'],
    applications: [
      'System design',
      'Feasibility studies',
      'Technical consultation',
    ],
    specifications: {
      warranty: 'Consultation guarantee',
    },
  },
  {
    name: 'Business Development Package',
    category: 'advisory',
    subcategory: 'Business Support',
    price: 15000,
    rating: 4.7,
    tags: ['Business', 'Training', 'Support', 'Development'],
    description:
      'Comprehensive business development support for renewable energy entrepreneurs and organizations.',
    sale: true,
    oldPrice: 20000,
    badge: 'PACKAGE',
    targetUsers: ['Entrepreneurs', 'Startups', 'Cooperatives', 'NGOs'],
    applications: [
      'Business planning',
      'Training',
      'Market development',
      'Scaling support',
    ],
    specifications: {
      warranty: '6 months support',
    },
  },
];
