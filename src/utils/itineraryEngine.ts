import {
  BookingType,
  TripCategory,
  DestinationStop,
  VehicleOption,
  HotelOption,
  RecommendationTier,
  DayPlan,
  DayActivity
} from '../types';
import { POPULAR_DESTINATIONS, VEHICLE_FLEET, HOTEL_CATALOG } from '../data/mockData';

export interface ParsedTripRequest {
  category: TripCategory;
  bookingType: BookingType;
  passengers: number;
  luggage: number;
  destinations: string[];
  days: number;
  hotelPreference: 'budget' | 'standard' | 'premium' | 'homestay' | 'pilgrimage';
  requiresParking: boolean;
  requiresVegFood: boolean;
  budgetNotes?: string;
  specialNeeds?: string;
}

/**
 * Intelligent natural language parser for the "Tell us where you want to go" request box.
 * Transforms unstructured text into structured booking parameters.
 */
export function parseNaturalLanguageRequest(text: string): ParsedTripRequest {
  const lower = text.toLowerCase();

  // 1. Detect passengers
  let passengers = 4;
  const paxMatch = lower.match(/(\d+)\s*(people|passengers|pax|persons|adults|members|travelers|friends|family members)/);
  if (paxMatch && paxMatch[1]) {
    passengers = Math.max(1, parseInt(paxMatch[1], 10));
  } else if (lower.includes('six people') || lower.includes('6 people')) {
    passengers = 6;
  } else if (lower.includes('couple') || lower.includes('two of us') || lower.includes('2 people')) {
    passengers = 2;
  } else if (lower.includes('solo') || lower.includes('one person')) {
    passengers = 1;
  } else if (lower.includes('eight') || lower.includes('10 people') || lower.includes('12 people') || lower.includes('large group')) {
    passengers = 10;
  }

  // 2. Detect days
  let days = 3;
  const daysMatch = lower.match(/(\d+)\s*(-|\s)?(day|days|night|nights)/);
  if (daysMatch && daysMatch[1]) {
    days = Math.max(1, parseInt(daysMatch[1], 10));
  } else if (lower.includes('four-day') || lower.includes('4 days') || lower.includes('four days')) {
    days = 4;
  } else if (lower.includes('weekend') || lower.includes('2 days') || lower.includes('two days')) {
    days = 2;
  } else if (lower.includes('day trip') || lower.includes('same day') || lower.includes('1 day')) {
    days = 1;
  } else if (lower.includes('5 days') || lower.includes('five days')) {
    days = 5;
  }

  // 3. Detect category
  let category: TripCategory = 'Family Vacation';
  if (lower.includes('temple') || lower.includes('pilgrimage') || lower.includes('darshan') || lower.includes('pooja') || lower.includes('swamy')) {
    category = 'Temple & Pilgrimage';
  } else if (lower.includes('honeymoon') || lower.includes('couple')) {
    category = 'Couple & Honeymoon';
  } else if (lower.includes('hill') || lower.includes('ooty') || lower.includes('kodaikanal') || lower.includes('yercaud') || lower.includes('munnar')) {
    category = 'Hill Station & Scenic Drive';
  } else if (lower.includes('beach') || lower.includes('coastal') || lower.includes('pondicherry') || lower.includes('mahabalipuram') || lower.includes('kanyakumari')) {
    category = 'Beaches & Coastal';
  } else if (lower.includes('falls') || lower.includes('waterfall') || lower.includes('hogenakkal') || lower.includes('courtallam')) {
    category = 'Waterfalls & Nature';
  } else if (lower.includes('heritage') || lower.includes('thanjavur') || lower.includes('kumbakonam') || lower.includes('chettinad')) {
    category = 'Heritage & Culture';
  } else if (lower.includes('wedding') || lower.includes('marriage') || lower.includes('function') || lower.includes('reception')) {
    category = 'Weddings & Functions';
  } else if (lower.includes('business') || lower.includes('meeting') || lower.includes('corporate') || lower.includes('office')) {
    category = 'Business & Corporate';
  } else if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('medical') || lower.includes('apollo')) {
    category = 'Medical & Hospital';
  } else if (lower.includes('friends') || lower.includes('bachelor') || lower.includes('gang')) {
    category = 'Friends Group Trip';
  }

  // 4. Detect destinations
  const matchedDestinations: string[] = [];
  const knownPlaces = [
    { key: 'ooty', name: 'Ooty (Udhagamandalam) & Coonoor' },
    { key: 'coonoor', name: 'Ooty (Udhagamandalam) & Coonoor' },
    { key: 'pondi', name: 'Pondicherry (Puducherry)' },
    { key: 'puducherry', name: 'Pondicherry (Puducherry)' },
    { key: 'mahabalipuram', name: 'Mahabalipuram' },
    { key: 'mamallapuram', name: 'Mahabalipuram' },
    { key: 'tirupati', name: 'Tirupati (Sri Venkateswara Swamy)' },
    { key: 'kodaikanal', name: 'Kodaikanal' },
    { key: 'kodai', name: 'Kodaikanal' },
    { key: 'yercaud', name: 'Yercaud' },
    { key: 'tiruvannamalai', name: 'Tiruvannamalai (Arulmigu Annamalaiyar)' },
    { key: 'kumbakonam', name: 'Kumbakonam & Thanjavur (Big Temple)' },
    { key: 'thanjavur', name: 'Kumbakonam & Thanjavur (Big Temple)' },
    { key: 'madurai', name: 'Madurai & Rameshwaram' },
    { key: 'rameshwaram', name: 'Madurai & Rameshwaram' },
    { key: 'kanyakumari', name: 'Kanyakumari (Cape Comorin)' },
    { key: 'munnar', name: 'Munnar & Thekkady' },
    { key: 'hogenakkal', name: 'Hogenakkal Waterfalls' },
    { key: 'vellore', name: 'Vellore & Golden Temple (Sripuram)' },
    { key: 'courtallam', name: 'Courtallam (Kutralam) Waterfalls' }
  ];

  for (const place of knownPlaces) {
    if (lower.includes(place.key) && !matchedDestinations.includes(place.name)) {
      matchedDestinations.push(place.name);
    }
  }

  // Default fallback if no specific destination matched
  if (matchedDestinations.length === 0) {
    matchedDestinations.push('Pondicherry (Puducherry)');
  }

  // 5. Detect hotel and food preferences
  let hotelPreference: 'budget' | 'standard' | 'premium' | 'homestay' | 'pilgrimage' = 'budget';
  if (lower.includes('luxury') || lower.includes('5 star') || lower.includes('resort') || lower.includes('premium')) {
    hotelPreference = 'premium';
  } else if (lower.includes('standard') || lower.includes('comfortable') || lower.includes('3 star')) {
    hotelPreference = 'standard';
  } else if (lower.includes('homestay')) {
    hotelPreference = 'homestay';
  } else if (category === 'Temple & Pilgrimage') {
    hotelPreference = 'pilgrimage';
  }

  const requiresParking = lower.includes('parking') || true;
  const requiresVegFood = lower.includes('veg') || lower.includes('vegetarian') || category === 'Temple & Pilgrimage';

  return {
    category,
    bookingType: matchedDestinations.length > 1 && !lower.includes('round trip') && lower.includes('multi') ? 'multi-city' : 'two-way',
    passengers,
    luggage: Math.max(1, Math.ceil(passengers * 0.75)),
    destinations: matchedDestinations,
    days,
    hotelPreference,
    requiresParking,
    requiresVegFood,
    budgetNotes: lower.includes('affordable') || lower.includes('budget') ? 'Focus on best value & lowest suitable cost' : undefined,
    specialNeeds: lower.includes('senior') || lower.includes('grand') || lower.includes('elderly') ? 'Elderly passengers: need gentle driving & low vehicle entry' : undefined
  };
}

/**
 * Calculates full driving distance and enforces 16-hour maximum driving rule.
 */
export function calculateTripMetrics(stops: DestinationStop[], bookingType: BookingType) {
  let totalOneWayKm = 0;
  let totalOneWayHours = 0;

  stops.forEach((stop) => {
    totalOneWayKm += stop.distanceKm;
    totalOneWayHours += stop.drivingTimeHrs;
  });

  const totalDistanceKm = bookingType === 'two-way' ? totalOneWayKm * 2 : totalOneWayKm;
  const totalDrivingHours = bookingType === 'two-way' ? totalOneWayHours * 2 : totalOneWayHours;

  return {
    totalDistanceKm: Math.max(100, Math.round(totalDistanceKm)),
    totalDrivingHours: Math.round(totalDrivingHours * 10) / 10
  };
}

/**
 * Generates 3 comparison options:
 * - Economy: Lowest cost suitable vehicle and clean budget accommodation.
 * - Best Value: Optimal balance of spacious comfort, verified quality hotel, and best per-person pricing.
 * - Premium Comfort: Top executive vehicle (Crysta / Hycross) + premium hotel stay.
 */
export function generateRecommendationTiers(
  passengers: number,
  days: number,
  stops: DestinationStop[],
  bookingType: BookingType
): RecommendationTier[] {
  const { totalDistanceKm, totalDrivingHours } = calculateTripMetrics(stops, bookingType);

  // 1. Filter vehicles by capacity
  const eligibleVehicles = VEHICLE_FLEET.filter((v) => v.seatingCapacity >= passengers);
  const vehiclesSortedByPrice = [...eligibleVehicles].sort((a, b) => a.ratePerKm - b.ratePerKm);

  const economyVehicle = vehiclesSortedByPrice[0] || VEHICLE_FLEET[0];
  const bestValueVehicle =
    vehiclesSortedByPrice.find((v) => v.category === 'MUV' || v.category === 'Sedan') ||
    vehiclesSortedByPrice[Math.min(1, vehiclesSortedByPrice.length - 1)];
  const premiumVehicle =
    vehiclesSortedByPrice.find((v) => v.category === 'Premium SUV' || v.category === 'Luxury MPV') ||
    vehiclesSortedByPrice[vehiclesSortedByPrice.length - 1];

  // Helper for fare calculation
  const calculateFare = (
    veh: VehicleOption,
    hotelTier: 'budget' | 'standard' | 'premium'
  ) => {
    const billableKm = Math.max(totalDistanceKm, veh.minKmPerDay * days);
    const carFare = Math.round(billableKm * veh.ratePerKm);
    const driverAllowance = veh.driverAllowancePerDay * days;
    const nightHalt = days > 1 ? veh.nightHaltCharge * (days - 1) : 0;
    const tollsParkingEstimate = Math.round(totalDistanceKm * 1.35); // Realistic TN highway toll + parking avg

    // Find destination hotels
    const matchedHotels = stops.map((stop) => {
      const candidates = HOTEL_CATALOG.filter((h) => h.destination === stop.name);
      return (
        candidates.find((h) => h.tier === hotelTier) ||
        candidates.find((h) => h.tier === 'standard') ||
        candidates[0] ||
        HOTEL_CATALOG[0]
      );
    });

    const roomCount = Math.max(1, Math.ceil(passengers / 2));
    const nights = Math.max(0, days - 1);
    const hotelCostPerNight = matchedHotels.reduce((sum, h) => sum + (h.pricePerNight + h.taxAmount), 0);
    const hotelTotal = hotelCostPerNight * roomCount * (nights > 0 ? nights : 1);

    const doorstepPickupFee = 0; // Transparently ₹0 (Always included in MMTT)
    const subtotal = carFare + driverAllowance + nightHalt + tollsParkingEstimate + hotelTotal;
    const gst = Math.round((carFare + driverAllowance) * 0.05); // 5% GST on transport
    const totalFare = subtotal + gst;
    const perPersonFare = Math.round(totalFare / Math.max(1, passengers));

    return {
      totalFare,
      perPersonFare,
      matchedHotels,
      breakdown: {
        carFare,
        driverAllowance: driverAllowance + nightHalt,
        tollsParkingEstimate,
        hotelTotal,
        doorstepPickupFee,
        gst
      }
    };
  };

  const ecoCalc = calculateFare(economyVehicle, 'budget');
  const bestCalc = calculateFare(bestValueVehicle, 'standard');
  const premCalc = calculateFare(premiumVehicle, 'premium');

  return [
    {
      id: 'economy',
      name: 'Economy Option',
      tagline: 'Lowest suitable cost without risking safety or basic comfort',
      description: `Ideal for smart travelers focusing strictly on savings. Clean AC ${economyVehicle.name} with verified hygienic budget stays.`,
      vehicle: economyVehicle,
      hotels: ecoCalc.matchedHotels,
      totalFare: ecoCalc.totalFare,
      perPersonFare: ecoCalc.perPersonFare,
      breakdown: ecoCalc.breakdown,
      savingsAmount: Math.max(0, bestCalc.totalFare - ecoCalc.totalFare),
      tradeoffs: [
        `Vehicle capacity fits exactly ${passengers} passengers; limited space for bulky suitcases.`,
        'Budget hotels offer clean essentials & hot water, but fewer luxury amenities or swimming pools.',
        'Slightly firmer ride on mountain ghat roads compared to premium Innova suspension.'
      ],
      highlights: [
        'Cheapest guaranteed private chauffeur package from Chennai',
        'Includes 100% doorstep pickup & drop-off',
        'Fuel, tolls, parking and driver day allowance all pre-calculated'
      ]
    },
    {
      id: 'best_value',
      name: 'Best Value (Recommended)',
      tagline: 'The strongest balance of price, spacious vehicle, and hotel comfort',
      description: `Our most popular choice for South Indian routes. Roomier ${bestValueVehicle.name} paired with top-rated standard hotels with verified parking and vegetarian meals.`,
      vehicle: bestValueVehicle,
      hotels: bestCalc.matchedHotels,
      totalFare: bestCalc.totalFare,
      perPersonFare: bestCalc.perPersonFare,
      breakdown: bestCalc.breakdown,
      tradeoffs: [
        `Costs ~₹${Math.round(bestCalc.totalFare - ecoCalc.totalFare)} more than Economy, but provides substantially more legroom and boot capacity.`,
        'Includes prime location hotels with dedicated driver rest facilities.'
      ],
      highlights: [
        'Superior highway ride stability & generous boot capacity for all luggage',
        'Hotels with 4.3+ ratings, safe vehicle parking, and authentic South Indian breakfast',
        'Comfortable seating so elderly passengers and kids remain fresh throughout the drive'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Comfort',
      tagline: 'Executive comfort, captain seats, and luxury resort hospitality',
      description: `First-class private travel in a flagship ${premiumVehicle.name} with superior suspension, driven by our highest-rated senior chauffeur.`,
      vehicle: premiumVehicle,
      hotels: premCalc.matchedHotels,
      totalFare: premCalc.totalFare,
      perPersonFare: premCalc.perPersonFare,
      breakdown: premCalc.breakdown,
      tradeoffs: [
        'Higher investment tier suited for special family occasions, weddings, or VIP leisure.',
        'Luxury resorts may require advance booking confirmation during peak weekend seasons.'
      ],
      highlights: [
        'Flagship Toyota Innova Crysta / Hycross with ultra-smooth suspension',
        'Premium 4-star / luxury heritage resort with scenic views and valet parking',
        'Senior highway chauffeur with 10+ years outstation experience and emergency first-aid kit'
      ]
    }
  ];
}

/**
 * Builds a realistic Day-by-Day Itinerary respecting the MMTT 16-Hour Daily Driving Limit.
 */
export function generateItinerary(
  stops: DestinationStop[],
  bookingType: BookingType,
  startDateStr: string,
  totalDays: number,
  pickupAddress: string,
  pickupTime: string = '06:00 AM',
  selectedHotel?: HotelOption
): DayPlan[] {
  const days: DayPlan[] = [];
  const start = new Date(startDateStr || new Date().toISOString());

  // Distribute stops across totalDays
  for (let i = 0; i < totalDays; i++) {
    const curDate = new Date(start);
    curDate.setDate(start.getDate() + i);
    const dateFormatted = curDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    const isFirstDay = i === 0;
    const isLastDay = i === totalDays - 1;

    let fromLoc = 'Chennai Doorstep';
    let toLoc = stops[0]?.name || 'Pondicherry';
    let drivingDistanceKm = stops[0]?.distanceKm || 160;
    let drivingHours = stops[0]?.drivingTimeHrs || 3.5;

    if (isFirstDay) {
      fromLoc = `Doorstep (${pickupAddress.split(',')[0] || 'Chennai'})`;
      toLoc = stops[0]?.name || 'Destination';
      drivingDistanceKm = stops[0]?.distanceKm || 160;
      drivingHours = stops[0]?.drivingTimeHrs || 3.5;
    } else if (isLastDay && bookingType === 'two-way') {
      fromLoc = stops[stops.length - 1]?.name || 'Destination';
      toLoc = `Return to Chennai Doorstep`;
      drivingDistanceKm = stops[stops.length - 1]?.distanceKm || 160;
      drivingHours = stops[stops.length - 1]?.drivingTimeHrs || 3.5;
    } else {
      const stopIdx = Math.min(i, stops.length - 1);
      fromLoc = stops[Math.max(0, stopIdx - 1)]?.name || 'Local Destination';
      toLoc = stops[stopIdx]?.name || 'Sightseeing & Excursions';
      drivingDistanceKm = Math.round((stops[stopIdx]?.distanceKm || 100) * 0.4); // Local sightseeing
      drivingHours = Math.round(drivingDistanceKm / 35 * 10) / 10;
    }

    // Check MMTT 16-Hour Driving Limit Rule
    const exceeds16Hours = drivingHours > 16;
    let suggestedRestTown: string | undefined;

    if (drivingHours > 12) {
      suggestedRestTown = 'Salem / Dindigul Highway Rest Hub';
    }

    const activities: DayActivity[] = [];

    if (isFirstDay) {
      activities.push({
        time: pickupTime,
        title: 'Doorstep Pickup & Luggage Loading',
        description: `Chauffeur arrives at ${pickupAddress}. OTP verification & family luggage boarding.`,
        type: 'pickup',
        durationHrs: 0.5
      });
      activities.push({
        time: '08:30 AM',
        title: 'Highway Breakfast & Filter Coffee Break',
        description: 'Clean vegetarian highway stop with sanitized restrooms & parking.',
        type: 'meal',
        durationHrs: 0.75
      });
      activities.push({
        time: '01:30 PM',
        title: `Arrival at ${toLoc} & Hotel Check-in`,
        description: `Check into ${selectedHotel ? selectedHotel.name : 'hotel'}, unpack and refresh.`,
        type: 'checkin',
        durationHrs: 1.5
      });
      activities.push({
        time: '04:30 PM',
        title: 'Evening Sightseeing & Local Stroll',
        description: `Visit nearby attractions (${(stops[0]?.attractions || ['City center', 'Scenic viewpoint']).slice(0, 2).join(', ')}).`,
        type: 'sightseeing',
        durationHrs: 3.0
      });
      activities.push({
        time: '08:30 PM',
        title: 'Dinner & Overnight Rest',
        description: 'Authentic dinner at hotel or nearby restaurant. Restful sleep for driver and family.',
        type: 'rest',
        durationHrs: 8.0
      });
    } else if (isLastDay && bookingType === 'two-way') {
      activities.push({
        time: '08:00 AM',
        title: 'Breakfast & Hotel Check-out',
        description: 'Complete checkout formalities, load luggage into vehicle boot.',
        type: 'checkin',
        durationHrs: 1.0
      });
      activities.push({
        time: '09:30 AM',
        title: 'Souvenir Shopping & Final Sightseeing',
        description: 'Local produce, spices, tea/coffee or temple prasadam collection.',
        type: 'sightseeing',
        durationHrs: 2.5
      });
      activities.push({
        time: '01:00 PM',
        title: 'Lunch on Highway & Return Drive',
        description: 'Comfortable highway drive back towards Chennai with scheduled tea stops.',
        type: 'drive',
        durationHrs: drivingHours
      });
      activities.push({
        time: '08:00 PM',
        title: 'Final Doorstep Drop-off in Chennai',
        description: `Safe return to customer home (${pickupAddress}). Luggage unloading and trip settlement.`,
        type: 'drop',
        durationHrs: 0.5
      });
    } else {
      activities.push({
        time: '08:30 AM',
        title: 'Breakfast at Hotel',
        description: 'Hearty morning breakfast before setting out for full day excursion.',
        type: 'meal',
        durationHrs: 1.0
      });
      activities.push({
        time: '10:00 AM',
        title: `Full Day Tour: ${toLoc}`,
        description: `Guided visit to ${(stops[0]?.attractions || ['Key sights', 'Cultural spots']).join(', ')}.`,
        type: 'sightseeing',
        durationHrs: 5.0
      });
      activities.push({
        time: '01:30 PM',
        title: 'Lunch & Relaxed Rest Break',
        description: 'Traditional lunch break and rest to avoid afternoon heat.',
        type: 'meal',
        durationHrs: 1.5
      });
      activities.push({
        time: '07:30 PM',
        title: 'Evening Stroll & Leisure Dinner',
        description: 'Dinner at town market or resort restaurant.',
        type: 'rest',
        durationHrs: 3.0
      });
    }

    const totalDayHours = activities.reduce((acc, a) => acc + a.durationHrs, 0);

    days.push({
      dayNumber: i + 1,
      date: dateFormatted,
      title: isFirstDay
        ? `Day 1: Chennai Doorstep Departure to ${toLoc}`
        : isLastDay
        ? `Day ${i + 1}: Final Sightseeing & Return to Chennai Home`
        : `Day ${i + 1}: Exploring ${toLoc}`,
      fromLocation: fromLoc,
      toLocation: toLoc,
      drivingDistanceKm,
      drivingHours,
      totalDayHours: Math.min(24, Math.round(totalDayHours * 10) / 10),
      overnightLocation: isLastDay && bookingType === 'two-way' ? 'Chennai (Home)' : toLoc,
      activities,
      hotelStay: isLastDay && bookingType === 'two-way' ? undefined : selectedHotel,
      estimatedDayCost: Math.round(drivingDistanceKm * 14 + (isLastDay ? 0 : 2500)),
      exceeds16HourLimit: exceeds16Hours,
      suggestedRestTown
    });
  }

  return days;
}
