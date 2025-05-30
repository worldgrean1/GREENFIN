export interface Product {
  name: string;
  category:
    | 'cooking-lower'
    | 'cooking-higher'
    | 'solar-pv'
    | 'pue'
    | 'water-pumping'
    | 'street-lights'
    | 'power-backup'
    | 'advisory';
  subcategory?: string;
  price: number;
  rating: number;
  tags: string[];
  description: string;
  sale: boolean;
  oldPrice: number | null;
  badge: string | null;
  targetUsers?: string[];
  applications?: string[];
  specifications?: {
    power?: string;
    capacity?: string;
    warranty?: string;
    efficiency?: string;
  };
}

// Lazy load products data to reduce initial bundle size
export const getProducts = async (): Promise<Product[]> => {
  // This will be code-split automatically by Next.js
  const { products } = await import('./products-data');
  return products;
};

// Essential products for initial render (reduce to top 6 most important)
export const essentialProducts: Product[] = [
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
];

// Legacy export for backward compatibility
export const products = essentialProducts;
