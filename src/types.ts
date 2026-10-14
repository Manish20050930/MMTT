export type BookingType = 'two-way' | 'multi-city';

export type TripCategory =
  | 'Temple & Pilgrimage'
  | 'Family Vacation'
  | 'Couple & Honeymoon'
  | 'Friends Group Trip'
  | 'Hill Station & Scenic Drive'
  | 'Beaches & Coastal'
  | 'Waterfalls & Nature'
  | 'Heritage & Culture'
  | 'Adventure & Outdoors'
  | 'Weddings & Functions'
  | 'Business & Corporate'
  | 'Medical & Hospital'
  | 'Airport & Railway Transfer'
  | 'Shopping & Food Tour'
  | 'Weekend Getaway & Day Trip'
  | 'Custom Travel Purpose';

export interface PickupDetails {
  doorNumber: string;
  street: string;
  area: string; // e.g., Anna Nagar, T. Nagar, Adyar, Velachery, Porur, Tambaram, etc.
  landmark: string;
  pincode: string;
  pickupTime: string;
  additionalStops: Array<{ id: string; address: string; passengerName: string; phone: string }>;
  specialInstructions: string;
  accessibilityNeeds: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface DropoffDetails {
  isSameAsPickup: boolean;
  finalCity: string;
  finalAddress: string;
  estimatedReturnTime?: string;
}

export interface DestinationStop {
  id: string;
  name: string;
  state: string;
  distanceKm: number;
  drivingTimeHrs: number;
  isOvernight: boolean;
  nights: number;
  attractions: string[];
  hotelPreference?: 'budget' | 'standard' | 'premium' | 'homestay' | 'pilgrimage';
}

export interface VehicleOption {
  id: string;
  name: string;
  category: 'Hatchback' | 'Sedan' | 'MUV' | 'Premium SUV' | 'Luxury MPV' | 'Tempo 12-Seater' | 'Tempo 17-Seater' | 'Tempo 26-Seater';
  models: string; // e.g., "Maruti Suzuki WagonR / Swift"
  seatingCapacity: number;
  luggageCapacity: number; // in bags
  ratePerKm: number;
  driverAllowancePerDay: number;
  nightHaltCharge: number;
  minKmPerDay: number;
  isAc: boolean;
  features: string[];
  image: string;
  availableCount: number;
  suitableFor: string;
}

export interface HotelOption {
  id: string;
  name: string;
  destination: string;
  tier: 'budget' | 'standard' | 'premium' | 'luxury' | 'pilgrimage' | 'homestay';
  rating: number;
  reviewCount: number;
  cleanlinessScore: number;
  pricePerNight: number;
  taxAmount: number;
  distanceFromTownCenterKm: number;
  amenities: string[];
  hasParking: boolean;
  hasPureVegRestaurant: boolean;
  cancellationPolicy: string;
  verified: boolean;
  image: string;
  address: string;
}

export interface RecommendationTier {
  id: 'economy' | 'best_value' | 'premium';
  name: string;
  tagline: string;
  description: string;
  vehicle: VehicleOption;
  hotels: HotelOption[];
  totalFare: number;
  perPersonFare: number;
  breakdown: {
    carFare: number;
    tollsParkingEstimate: number;
    driverAllowance: number;
    hotelTotal: number;
    doorstepPickupFee: number; // Explicitly ₹0 (Included)
    gst: number;
  };
  tradeoffs: string[];
  highlights: string[];
  savingsAmount?: number;
}

export interface DayActivity {
  time: string;
  title: string;
  description: string;
  type: 'pickup' | 'drive' | 'meal' | 'sightseeing' | 'checkin' | 'rest' | 'drop';
  durationHrs: number;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  fromLocation: string;
  toLocation: string;
  drivingDistanceKm: number;
  drivingHours: number;
  totalDayHours: number;
  overnightLocation: string;
  activities: DayActivity[];
  hotelStay?: HotelOption;
  estimatedDayCost: number;
  exceeds16HourLimit: boolean;
  suggestedRestTown?: string;
}

export interface PaymentTransaction {
  id: string;
  bookingRef: string;
  amount: number;
  type: 'advance' | 'balance' | 'full' | 'doorstep_cash';
  method: 'UPI' | 'Card' | 'NetBanking' | 'Cash at Doorstep';
  upiProvider?: 'GooglePay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'Other';
  cardLast4?: string;
  bankName?: string;
  status: 'success' | 'pending' | 'refunded';
  timestamp: string;
  transactionRef: string;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. MMTT-CH-8291
  createdAt: string;
  status: 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  bookingType: BookingType;
  category: TripCategory;
  passengers: number;
  luggage: number;
  pickup: PickupDetails;
  dropoff: DropoffDetails;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalDistanceKm: number;
  stops: DestinationStop[];
  vehicle: VehicleOption;
  hotels: HotelOption[];
  itinerary: DayPlan[];
  totalFare: number;
  advancePaid: number;
  balanceDue: number;
  paymentMode: 'advance_20' | 'full' | 'pay_to_driver';
  pickupOtp: string;
  transactions?: PaymentTransaction[];
  invoiceNumber?: string;
  driver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    photo?: string;
    vehicleReg: string;
    vehicleModel: string;
    status: 'Assigned' | 'En Route' | 'At Doorstep' | 'Trip Active';
  };
  specialNotes?: string;
  trackingCoords?: { lat: number; lng: number };
}

export interface DriverApplication {
  id: string;
  applicationNumber: string; // e.g. MMTT-DRV-1042
  submittedAt: string;
  fullName: string;
  phone: string;
  email: string;
  residentialAddress: string;
  currentCity: string;
  preferredAreas: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  licenseNumber: string;
  licenseExpiry: string;
  licenseClasses: string[]; // e.g., ['LMV-TR', 'TRANS', 'HMV']
  experienceYears: number;
  outstationExperienceYears: number;
  languages: string[];
  highwayNavigationProficiency: 'Expert' | 'Intermediate' | 'Basic';
  hasCommercialBadge: boolean;
  employmentPreference: 'Full-Time' | 'Part-Time' | 'Contract' | 'Trip-Based';
  compensationPreference: 'Fixed Salary' | 'Per-Trip' | 'Per-Kilometre' | 'Revenue Share';
  willingOvernight: boolean;
  registrationPath: 'own_vehicle' | 'without_vehicle';
  vehicleDetails?: {
    model: string;
    category: string;
    regNumber: string;
    year: number;
    seatingCapacity: number;
    insuranceExpiry: string;
    fcExpiry: string;
    touristPermitExpiry: string;
    hasFastag: boolean;
  };
  status:
    | 'Application Submitted'
    | 'Documents Under Review'
    | 'Verification Required'
    | 'Interview / Assessment'
    | 'Approved'
    | 'Rejected'
    | 'Onboarding Completed';
  adminNotes?: string;
  interviewScheduledDate?: string;
  assignedRating?: number;
  completedTripsCount: number;
  totalEarnings: number;
  settlementPending: number;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    upiId: string;
  };
  settlementHistory?: Array<{
    id: string;
    amount: number;
    date: string;
    mode: 'Bank IMPS' | 'Instant UPI';
    status: 'Settled' | 'Processing';
    refNumber: string;
  }>;
}
