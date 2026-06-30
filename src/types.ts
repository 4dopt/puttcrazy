export interface FoodOption {
  id: string;
  name: string;
  type: 'main' | 'drink' | 'extra';
  description?: string;
  isAllergenFriendly?: boolean;
  allergens?: string[];
  emoji: string;
}

export interface PartyPackage {
  id: string;
  name: string;
  minKids: number;
  ageRange: string;
  pricePerKid: number;
  duration: string;
  features: string[];
  description: string;
  cateringDetails: string;
}

export interface BirthdaySlot {
  id: string;
  time: string;
  status: 'available' | 'filling-fast' | 'booked';
  spotsLeft?: number;
  dayType: 'weekend' | 'weekday';
}

export interface DayAvailability {
  date: string; // ISO date string or human date e.g. "Saturday, July 4"
  slots: BirthdaySlot[];
}

export interface CalculatorState {
  selectedPackageId: string;
  kidsCount: number;
  selectedMains: Record<number, string>; // kid index -> food ID
  selectedDrinks: Record<number, string>; // kid index -> drink ID
  selectedExtras: string[]; // list of extra IDs
  partyDate: string;
  partyTime: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  childName: string;
  childAge: number;
  allergiesNote: string;
}
