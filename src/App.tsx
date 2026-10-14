import React, { useState, useMemo, useEffect } from 'react';
import {
  BookingType,
  TripCategory,
  PickupDetails,
  DropoffDetails,
  DestinationStop,
  VehicleOption,
  HotelOption,
  RecommendationTier,
  DayPlan,
  Booking
} from './types';
import {
  POPULAR_DESTINATIONS,
  VEHICLE_FLEET,
  HOTEL_CATALOG
} from './data/mockData';
import {
  calculateTripMetrics,
  generateRecommendationTiers,
  generateItinerary,
  ParsedTripRequest
} from './utils/itineraryEngine';
import { getStoredBookings } from './utils/storage';

import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { RequestBox } from './components/RequestBox';
import { ComparisonCards } from './components/ComparisonCards';
import { RoutePlanner } from './components/RoutePlanner';
import { ItineraryView } from './components/ItineraryView';
import { CarSelector } from './components/CarSelector';
import { HotelSelector } from './components/HotelSelector';
import { DrivingSafetyInfo } from './components/DrivingSafetyInfo';
import { CheckoutModal } from './components/CheckoutModal';
import { MyTripsView } from './components/MyTripsView';
import { DriveWithMMTT } from './components/DriveWithMMTT';
import { AdminDashboard } from './components/AdminDashboard';
import { SupportModal } from './components/SupportModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'plan' | 'recommendations' | 'itinerary' | 'mytrips' | 'drive' | 'admin'
  >('plan');

  // Bookings list from storage
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings());

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Core Trip Parameters
  const [bookingType, setBookingType] = useState<BookingType>('two-way');
  const [category, setCategory] = useState<TripCategory>('Family Vacation');

  // Chennai Doorstep Pickup State
  const [pickup, setPickup] = useState<PickupDetails>({
    doorNumber: 'Plot 42, Flat 2B',
    street: '12th Main Road, Shanthi Colony',
    area: 'Anna Nagar West',
    landmark: 'Opposite State Bank of India',
    pincode: '600040',
    pickupTime: '06:00 AM',
    additionalStops: [],
    specialInstructions: 'Ground floor pickup with elevator access.',
    accessibilityNeeds: 'Elderly grandparents travelling; gentle driving requested.',
    contactName: 'Sundaram Ramachandran',
    contactPhone: '+91 98401 23456',
    contactEmail: 'sundaram.r@gmail.com'
  });

  const [dropoff, setDropoff] = useState<DropoffDetails>({
    isSameAsPickup: true,
    finalCity: 'Chennai',
    finalAddress: 'Plot 42, Flat 2B, 12th Main Road, Anna Nagar West, Chennai 600040'
  });

  // Destinations & Stops (Initial: Ooty & Coonoor)
  const [stops, setStops] = useState<DestinationStop[]>([
    {
      id: 'stop-1',
      name: 'Ooty (Udhagamandalam) & Coonoor',
      state: 'Tamil Nadu',
      distanceKm: 535,
      drivingTimeHrs: 10.5,
      isOvernight: true,
      nights: 3,
      attractions: [
        'Botanical Gardens',
        'Doddabetta Peak',
        'Pykara Lake',
        'Sims Park Coonoor'
      ],
      hotelPreference: 'standard'
    }
  ]);

  // Dates & Travelers
  const [startDate, setStartDate] = useState('2026-10-22');
  const [endDate, setEndDate] = useState('2026-10-25');
  const [passengers, setPassengers] = useState(5);
  const [luggage, setLuggage] = useState(4);
  const [hotelBudgetTier, setHotelBudgetTier] = useState<
    'budget' | 'standard' | 'premium'
  >('standard');
  const [vehicleCategoryPref, setVehicleCategoryPref] = useState('auto');

  // Selection states
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(
    () => VEHICLE_FLEET[2] // Ertiga MUV
  );
  const [selectedHotels, setSelectedHotels] = useState<HotelOption[]>([
    HOTEL_CATALOG[3] // Pine Valley Eco Resort
  ]);
  const [selectedTierId, setSelectedTierId] = useState<
    'economy' | 'best_value' | 'premium'
  >('best_value');

  // Calculate duration in days
  const totalDays = useMemo(() => {
    try {
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, isNaN(diffDays) ? 4 : diffDays);
    } catch {
      return 4;
    }
  }, [startDate, endDate]);

  // Calculate distance & drive times
  const { totalDistanceKm, totalDrivingHours } = useMemo(() => {
    return calculateTripMetrics(stops, bookingType);
  }, [stops, bookingType]);

  // Generate 3 Recommendation Tiers
  const recommendationTiers = useMemo(() => {
    return generateRecommendationTiers(
      passengers,
      totalDays,
      stops,
      bookingType
    );
  }, [passengers, totalDays, stops, bookingType]);

  // Active chosen recommendation tier
  const activeRecommendationTier = useMemo(() => {
    return (
      recommendationTiers.find((t) => t.id === selectedTierId) ||
      recommendationTiers[1]
    );
  }, [recommendationTiers, selectedTierId]);

  // Generated Itinerary
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);

  // Keep itinerary synchronized whenever stops, dates or days change
  useEffect(() => {
    const generated = generateItinerary(
      stops,
      bookingType,
      startDate,
      totalDays,
      `${pickup.doorNumber ? pickup.doorNumber + ', ' : ''}${pickup.street ? pickup.street + ', ' : ''}${pickup.area}`,
      pickup.pickupTime,
      selectedHotels[0]
    );
    setItinerary(generated);
  }, [stops, bookingType, startDate, totalDays, pickup.doorNumber, pickup.street, pickup.area, pickup.pickupTime, selectedHotels]);

  // Handle parsing natural language request from express box
  const handleParsedRequest = (parsed: ParsedTripRequest) => {
    setCategory(parsed.category);
    setBookingType(parsed.bookingType);
    setPassengers(parsed.passengers);
    setLuggage(parsed.luggage);
    setHotelBudgetTier(
      parsed.hotelPreference === 'homestay' || parsed.hotelPreference === 'pilgrimage'
        ? 'standard'
        : parsed.hotelPreference
    );

    // Map matched destinations to stops
    const newStops: DestinationStop[] = parsed.destinations.map((name, i) => {
      const found = POPULAR_DESTINATIONS.find((d) => d.name === name);
      return {
        id: `stop-${Date.now()}-${i}`,
        name,
        state: found?.state || 'Tamil Nadu',
        distanceKm: found?.distanceKm || 200,
        drivingTimeHrs: found?.drivingTimeHrs || 4,
        isOvernight: true,
        nights: Math.max(1, Math.floor(parsed.days / Math.max(1, parsed.destinations.length))),
        attractions: found?.attractions || ['Town sightseeing', 'Local markets'],
        hotelPreference: parsed.hotelPreference
      };
    });

    if (newStops.length > 0) {
      setStops(newStops);
    }

    // Scroll smoothly to comparison
    setActiveTab('recommendations');
  };

  // Select a tier from comparison
  const handleSelectTier = (tier: RecommendationTier) => {
    setSelectedTierId(tier.id);
    setSelectedVehicle(tier.vehicle);
    if (tier.hotels.length > 0) {
      setSelectedHotels(tier.hotels);
    }
  };

  // Select a specific vehicle
  const handleSelectVehicle = (veh: VehicleOption) => {
    setSelectedVehicle(veh);
  };

  // Select a specific hotel
  const handleSelectHotelForDestination = (
    destName: string,
    hotel: HotelOption
  ) => {
    setSelectedHotels([hotel]);
  };

  // Handle booking confirmed
  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setIsCheckoutOpen(false);
    setActiveTab('mytrips');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSupport={() => setIsSupportOpen(true)}
        bookingsCount={bookings.length}
      />

      <main className="flex-1">
        {/* VIEW 1: Main Plan & Search Landing */}
        {activeTab === 'plan' && (
          <div className="space-y-12 pb-16">
            {/* Hero Search Section */}
            <HeroSearch
              bookingType={bookingType}
              setBookingType={setBookingType}
              category={category}
              setCategory={setCategory}
              pickup={pickup}
              setPickup={setPickup}
              dropoff={dropoff}
              setDropoff={setDropoff}
              stops={stops}
              setStops={setStops}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              passengers={passengers}
              setPassengers={setPassengers}
              luggage={luggage}
              setLuggage={setLuggage}
              hotelBudgetTier={hotelBudgetTier}
              setHotelBudgetTier={setHotelBudgetTier}
              vehicleCategoryPref={vehicleCategoryPref}
              setVehicleCategoryPref={setVehicleCategoryPref}
              onSearch={() => setActiveTab('recommendations')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* Natural Language Express Request Box */}
              <RequestBox onParsedRequest={handleParsedRequest} />

              {/* Driving Safety & 16-Hour Rule Spotlight */}
              <DrivingSafetyInfo />

              {/* Route Planner & Stops Pipeline */}
              <RoutePlanner
                stops={stops}
                setStops={setStops}
                bookingType={bookingType}
                pickup={pickup}
                dropoff={dropoff}
                totalDistanceKm={totalDistanceKm}
                totalDrivingHours={totalDrivingHours}
                totalDays={totalDays}
              />

              {/* Fleet & Car Selection */}
              <CarSelector
                selectedVehicle={selectedVehicle}
                onSelectVehicle={handleSelectVehicle}
                passengers={passengers}
                luggage={luggage}
                totalDistanceKm={totalDistanceKm}
                totalDays={totalDays}
              />

              {/* Curated Hotel Finder */}
              <HotelSelector
                stops={stops}
                selectedHotels={selectedHotels}
                onSelectHotelForDestination={handleSelectHotelForDestination}
              />

              {/* Day-by-day Itinerary */}
              <ItineraryView
                itinerary={itinerary}
                setItinerary={setItinerary}
                totalDistanceKm={totalDistanceKm}
                totalDays={totalDays}
                onProceedToCheckout={() => setIsCheckoutOpen(true)}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Cheap & Best Recommendations Comparison */}
        {activeTab === 'recommendations' && (
          <div className="space-y-12 pb-16">
            <ComparisonCards
              tiers={recommendationTiers}
              selectedTierId={selectedTierId}
              onSelectTier={handleSelectTier}
              onProceedToBooking={(tier) => {
                handleSelectTier(tier);
                setIsCheckoutOpen(true);
              }}
              passengers={passengers}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <RoutePlanner
                stops={stops}
                setStops={setStops}
                bookingType={bookingType}
                pickup={pickup}
                dropoff={dropoff}
                totalDistanceKm={totalDistanceKm}
                totalDrivingHours={totalDrivingHours}
                totalDays={totalDays}
              />

              <ItineraryView
                itinerary={itinerary}
                setItinerary={setItinerary}
                totalDistanceKm={totalDistanceKm}
                totalDays={totalDays}
                onProceedToCheckout={() => setIsCheckoutOpen(true)}
              />

              <DrivingSafetyInfo />
            </div>
          </div>
        )}

        {/* VIEW 3: Day-by-Day Itinerary Detailed View */}
        {activeTab === 'itinerary' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <ItineraryView
              itinerary={itinerary}
              setItinerary={setItinerary}
              totalDistanceKm={totalDistanceKm}
              totalDays={totalDays}
              onProceedToCheckout={() => setIsCheckoutOpen(true)}
            />
            <DrivingSafetyInfo />
          </div>
        )}

        {/* VIEW 4: My Trips & Saved Itineraries */}
        {activeTab === 'mytrips' && (
          <MyTripsView
            bookings={bookings}
            onStartNewTrip={() => setActiveTab('plan')}
          />
        )}

        {/* VIEW 5: Drive with MMTT (Recruitment & Driver Portal) */}
        {activeTab === 'drive' && (
          <DriveWithMMTT
            onBackToCustomerView={() => setActiveTab('plan')}
          />
        )}

        {/* VIEW 6: Admin Dashboard */}
        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        bookingType={bookingType}
        category={category}
        pickup={pickup}
        dropoff={dropoff}
        stops={stops}
        vehicle={selectedVehicle}
        hotels={selectedHotels}
        itinerary={itinerary}
        startDate={startDate}
        endDate={endDate}
        totalDays={totalDays}
        totalDistanceKm={totalDistanceKm}
        passengers={passengers}
        luggage={luggage}
        totalFare={activeRecommendationTier.totalFare}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* 24/7 Support Desk Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={setActiveTab}
        openSupport={() => setIsSupportOpen(true)}
      />
    </div>
  );
}
