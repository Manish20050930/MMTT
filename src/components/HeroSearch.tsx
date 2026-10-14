import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Car,
  Hotel,
  ArrowRight,
  Plus,
  Trash2,
  Navigation,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';
import {
  BookingType,
  TripCategory,
  DestinationStop,
  PickupDetails,
  DropoffDetails
} from '../types';
import { POPULAR_DESTINATIONS, VEHICLE_FLEET } from '../data/mockData';

interface HeroSearchProps {
  bookingType: BookingType;
  setBookingType: (t: BookingType) => void;
  category: TripCategory;
  setCategory: (c: TripCategory) => void;
  pickup: PickupDetails;
  setPickup: React.Dispatch<React.SetStateAction<PickupDetails>>;
  dropoff: DropoffDetails;
  setDropoff: React.Dispatch<React.SetStateAction<DropoffDetails>>;
  stops: DestinationStop[];
  setStops: React.Dispatch<React.SetStateAction<DestinationStop[]>>;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  passengers: number;
  setPassengers: (p: number) => void;
  luggage: number;
  setLuggage: (l: number) => void;
  hotelBudgetTier: 'budget' | 'standard' | 'premium';
  setHotelBudgetTier: (t: 'budget' | 'standard' | 'premium') => void;
  vehicleCategoryPref: string;
  setVehicleCategoryPref: (c: string) => void;
  onSearch: () => void;
}

const CHENNAI_AREAS = [
  'Anna Nagar',
  'T. Nagar',
  'Adyar',
  'Velachery',
  'Mylapore',
  'Tambaram',
  'Porur',
  'Nungambakkam',
  'Sholinganallur (OMR)',
  'Guindy',
  'Koyambedu',
  'Kilpauk',
  'Perambur',
  'Thiruvanmiyur',
  'Chromepet',
  'Medavakkam',
  'Ambattur',
  'Chennai Airport (MAA)',
  'Chennai Central (MAS)'
];

const TRIP_CATEGORIES: TripCategory[] = [
  'Family Vacation',
  'Temple & Pilgrimage',
  'Hill Station & Scenic Drive',
  'Weekend Getaway & Day Trip',
  'Beaches & Coastal',
  'Heritage & Culture',
  'Waterfalls & Nature',
  'Couple & Honeymoon',
  'Friends Group Trip',
  'Weddings & Functions',
  'Business & Corporate',
  'Medical & Hospital',
  'Airport & Railway Transfer',
  'Custom Travel Purpose'
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  bookingType,
  setBookingType,
  category,
  setCategory,
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  stops,
  setStops,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  passengers,
  setPassengers,
  luggage,
  setLuggage,
  hotelBudgetTier,
  setHotelBudgetTier,
  vehicleCategoryPref,
  setVehicleCategoryPref,
  onSearch
}) => {
  const [showMultiPickup, setShowMultiPickup] = useState(false);
  const [selectedPresetDestination, setSelectedPresetDestination] = useState('');

  // Handle adding stop
  const handleAddStop = (name: string) => {
    const existing = POPULAR_DESTINATIONS.find((d) => d.name === name);
    const newStop: DestinationStop = {
      id: `stop-${Date.now()}`,
      name: name || 'Pondicherry (Puducherry)',
      state: existing?.state || 'Tamil Nadu',
      distanceKm: existing?.distanceKm || 160,
      drivingTimeHrs: existing?.drivingTimeHrs || 3.5,
      isOvernight: existing?.isOvernight ?? true,
      nights: existing?.nights || 1,
      attractions: existing?.attractions || ['Town sightseeing', 'Local market'],
      hotelPreference: hotelBudgetTier
    };
    setStops([...stops, newStop]);
    setSelectedPresetDestination('');
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-16">
      {/* Background Hero Banner Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/mmtt_hero_travel_1791998102269.jpg"
          alt="Scenic Tamil Nadu Highway Travel"
          className="w-full h-full object-cover object-center brightness-45"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title & Value Proposition */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-300 uppercase mb-3">
            <span>Manish Mart Tours & Travels</span>
            <span aria-hidden="true">·</span>
            <span>Chennai Doorstep Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            From Your Doorstep to Anywhere.
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-200 text-balance leading-relaxed">
            Find affordable cars, great hotels, and perfectly planned trips from Chennai.
            Chauffeur-driven hatchbacks, sedans, Innova Crysta, and Tempo Travellers delivered directly to your home.
          </p>
        </div>

        {/* Master Booking Search Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          {/* Trip Type & Category Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            {/* 1. Two-Way vs Multi-City Segmented Control */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setBookingType('two-way')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  bookingType === 'two-way'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Two-Way Trip (Round Trip)
              </button>
              <button
                type="button"
                onClick={() => setBookingType('multi-city')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  bookingType === 'multi-city'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Multi-City Trip (Custom End)
              </button>
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Trip Purpose:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TripCategory)}
                className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {TRIP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mt-6">
            {/* 1. Chennai Doorstep Pickup Address (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  Doorstep Pickup (Chennai)
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Fee: ₹0 Included
                </span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pickup.doorNumber}
                    onChange={(e) => setPickup({ ...pickup, doorNumber: e.target.value })}
                    placeholder="Flat / Door No."
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <input
                    type="text"
                    value={pickup.pincode}
                    onChange={(e) => setPickup({ ...pickup, pincode: e.target.value })}
                    placeholder="PIN Code (e.g. 600040)"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <input
                  type="text"
                  value={pickup.street}
                  onChange={(e) => setPickup({ ...pickup, street: e.target.value })}
                  placeholder="Street / Apartment Name / Landmark"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={pickup.area}
                    onChange={(e) => setPickup({ ...pickup, area: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    {CHENNAI_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={pickup.pickupTime}
                    onChange={(e) => setPickup({ ...pickup, pickupTime: e.target.value })}
                    placeholder="Time: 06:00 AM"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowMultiPickup(!showMultiPickup)}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline block pt-1"
                >
                  {showMultiPickup ? '− Hide Multiple Pickup Points' : '+ Add Multiple Pickup Points in Chennai'}
                </button>

                {showMultiPickup && (
                  <div className="pt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100">
                    <p className="font-semibold text-slate-800">Additional Chennai Stops:</p>
                    <p className="italic text-slate-500">Pick up relatives at Anna Nagar, T. Nagar, or Airport en route before highway departure.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Destinations & Stops (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-orange-600" />
                    Destinations & Stops
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {stops.length} {stops.length === 1 ? 'City' : 'Cities'}
                  </span>
                </div>

                {/* Stops List */}
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {stops.map((stop, idx) => (
                    <div
                      key={stop.id}
                      className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    >
                      <span className="font-mono text-slate-400 font-bold">{idx + 1}.</span>
                      <span className="font-medium text-slate-800 flex-1 truncate">
                        {stop.name}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono whitespace-nowrap">
                        {stop.distanceKm} km · {stop.drivingTimeHrs}h
                      </span>
                      {stops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(stop.id)}
                          className="text-slate-400 hover:text-red-600 p-0.5"
                          title="Remove Stop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Stop Dropdown */}
                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={selectedPresetDestination}
                    onChange={(e) => {
                      if (e.target.value) handleAddStop(e.target.value);
                    }}
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">+ Add South India Destination...</option>
                    {POPULAR_DESTINATIONS.filter(
                      (d) => !stops.some((s) => s.name === d.name)
                    ).map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {bookingType === 'multi-city' && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Final Drop-off Destination:
                  </label>
                  <input
                    type="text"
                    value={dropoff.finalAddress}
                    onChange={(e) => setDropoff({ ...dropoff, finalAddress: e.target.value })}
                    placeholder="e.g. Bangalore Airport / Coimbatore Home"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              )}
            </div>

            {/* 3. Dates, Passengers & Preferences (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Schedule & Travelers
                </span>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Return Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Passengers</label>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={passengers}
                        onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-full text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Luggage Bags</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={luggage}
                      onChange={(e) => setLuggage(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Hotel Tier</label>
                    <select
                      value={hotelBudgetTier}
                      onChange={(e) => setHotelBudgetTier(e.target.value as any)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="budget">Budget (Clean Stays)</option>
                      <option value="standard">Standard (3-Star)</option>
                      <option value="premium">Premium Resort</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">Car Class</label>
                    <select
                      value={vehicleCategoryPref}
                      onChange={(e) => setVehicleCategoryPref(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="auto">Smart Suitable</option>
                      <option value="Sedan">Sedan (Dzire/Etios)</option>
                      <option value="MUV">MUV (Ertiga/Carens)</option>
                      <option value="Premium SUV">SUV (Innova Crysta)</option>
                      <option value="Tempo">Tempo Traveller</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onSearch}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                Find My Best Trip
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>

          {/* Transparent Assurance Badges (Clean prose, no pill sandwich) */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-semibold text-slate-900">Doorstep Pickup Included</span>
              <span aria-hidden="true">·</span>
              <span>16-Hour Max Driving Safety Rule</span>
              <span aria-hidden="true">·</span>
              <span>Commercial Yellow-Plate Tourist Fleet</span>
              <span aria-hidden="true">·</span>
              <span>All Tolls & Allowances Quoted Upfront</span>
            </div>

            <div className="text-slate-500 text-xs">
              Direct Support: <span className="font-semibold text-slate-900">044-2841-8800</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
