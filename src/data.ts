import { FoodOption, PartyPackage, DayAvailability, BirthdaySlot } from './types';

export const PARTY_PACKAGES: PartyPackage[] = [
  {
    id: 'driving-range',
    name: 'Driving Range Party',
    minKids: 6,
    ageRange: '5-12',
    pricePerKid: 16.50,
    duration: '1 Hour of Golf + Food Time',
    features: [
      '1 Hour of Golf on the professional Driving Range',
      'Unlimited range balls during play',
      'Interactive visual trackers (where available)',
      '1 Meal per Kid (1 Main Dish & 1 Soft Drink)',
      'Dedicated bays and safety introduction'
    ],
    description: 'Perfect for active kids who want to feel like golfing pros! Unlimited balls and high-energy swing fun under the supervision of parents/guardians.',
    cateringDetails: 'Includes 1 freshly made hot main dish and 1 chilled soft drink per kid.'
  },
  {
    id: 'adventure-golf',
    name: 'Putt Crazy Adventure Golf Party',
    minKids: 6,
    ageRange: '5-12',
    pricePerKid: 16.50,
    duration: '1 Round of 18 Holes + Food Time',
    features: [
      '1 full Round of 18-holes Putt Crazy Adventure Golf',
      'Adventure scorecards, child-sized putters and colored balls',
      'Crazy loops, custom tunnels, and fun neon challenges',
      '1 Meal per Kid (1 Main Dish & 1 Soft Drink)',
      'Self-guided fun across the spectacular mini golf course'
    ],
    description: 'An immersive putting experience with winding pathways, wild obstacles, and friendly competition on our famous Putt Crazy course.',
    cateringDetails: 'Includes 1 freshly made hot main dish and 1 chilled soft drink per kid.'
  },
  {
    id: 'combo-party',
    name: 'Ultimate Range & Putt Combo',
    minKids: 6,
    ageRange: '5-12',
    pricePerKid: 21.50, // 16.50 + 5.00
    duration: '1 Hour Range + 18-Hole Adventure + Food Time',
    features: [
      '1 Hour of Golf with unlimited balls on the Driving Range',
      '1 full Round of 18-holes Putt Crazy Adventure Golf',
      'A massive £11.50 saving compared to separate standard entry!',
      '1 Meal per Kid (1 Main Dish & 1 Soft Drink)',
      'All equipment provided (clubs, putters, and balls)'
    ],
    description: 'The ultimate kids party experience at Northwick Park! Enjoy both premium attractions for an unbeatable deal of just £5 extra per child.',
    cateringDetails: 'Includes 1 freshly made hot main dish and 1 chilled soft drink per kid, served at your reserved party table.'
  }
];

export const FOOD_MAINS: FoodOption[] = [
  {
    id: 'main-pasta-tomato',
    name: 'Pasta in Tomato sauce',
    type: 'main',
    description: 'Delicious pasta tossed in a savory, slow-simmered rich tomato sauce.',
    isAllergenFriendly: true,
    allergens: ['Gluten'],
    emoji: '🍝'
  },
  {
    id: 'main-pasta-cream',
    name: 'Pasta in Cream sauce',
    type: 'main',
    description: 'Creamy, smooth white sauce over perfectly cooked pasta.',
    isAllergenFriendly: false,
    allergens: ['Gluten', 'Dairy'],
    emoji: '🥣'
  },
  {
    id: 'main-nuggets',
    name: 'Chicken nuggets with chips',
    type: 'main',
    description: 'Crispy golden chicken nuggets served with hot skinny chips.',
    isAllergenFriendly: true,
    allergens: ['Gluten'],
    emoji: '🍗'
  },
  {
    id: 'main-fish-goujons',
    name: 'Fish Goujons with chips',
    type: 'main',
    description: 'Lightly battered cod fish goujons fried to perfection and paired with hot skinny chips.',
    isAllergenFriendly: true,
    allergens: ['Fish', 'Gluten'],
    emoji: '🐟'
  }
];

export const FOOD_DRINKS: FoodOption[] = [
  {
    id: 'drink-blackcurrant-jug',
    name: 'Black currant squash Jug',
    type: 'drink',
    isAllergenFriendly: true,
    emoji: '🍇'
  },
  {
    id: 'drink-orange-jug',
    name: 'Orange squash jug',
    type: 'drink',
    isAllergenFriendly: true,
    emoji: '🍊'
  }
];

export const FOOD_EXTRAS: FoodOption[] = [];

// Helper to generate dynamic days with realistic timeslots
export function getMockAvailability(): DayAvailability[] {
  const days: DayAvailability[] = [];
  const today = new Date();
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate 14 days of availability starting from today
  for (let i = 0; i < 14; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    
    const dayOfWeek = dayNames[targetDate.getDay()];
    const dateStr = `${dayOfWeek}, ${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;
    const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;
    
    // Setup time slots from 12:00 PM to 09:00 PM
    const slots: BirthdaySlot[] = [
      { id: `${i}-12`, time: '12:00 PM', status: i % 4 === 1 ? 'booked' : 'available', spotsLeft: i % 4 === 1 ? 0 : 3, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-13`, time: '01:00 PM', status: 'available', spotsLeft: 4, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-14`, time: '02:00 PM', status: isWeekend && i % 2 === 0 ? 'booked' : 'filling-fast', spotsLeft: isWeekend && i % 2 === 0 ? 0 : 1, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-15`, time: '03:00 PM', status: 'available', spotsLeft: 4, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-16`, time: '04:00 PM', status: i % 5 === 0 ? 'booked' : 'available', spotsLeft: i % 5 === 0 ? 0 : 4, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-17`, time: '05:00 PM', status: 'available', spotsLeft: 3, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-18`, time: '06:00 PM', status: 'available', spotsLeft: 3, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-19`, time: '07:00 PM', status: isWeekend ? 'filling-fast' : 'available', spotsLeft: 2, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-20`, time: '08:00 PM', status: 'available', spotsLeft: 4, dayType: isWeekend ? 'weekend' : 'weekday' },
      { id: `${i}-21`, time: '09:00 PM', status: 'available', spotsLeft: 4, dayType: isWeekend ? 'weekend' : 'weekday' }
    ];
    
    days.push({
      date: dateStr,
      slots: slots
    });
  }
  
  return days;
}
