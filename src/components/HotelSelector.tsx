import React, { useState } from 'react';
import { Building2, Star, Check, ShieldCheck, Utensils, Car, Info } from 'lucide-react';
import { HotelOption, DestinationStop } from '../types';
import { HOTEL_CATALOG } from '../data/mockData';

interface HotelSelectorProps {
  stops: DestinationStop[];
  selectedHotels: HotelOption[];
  onSelectHotelForDestination: (destName: string, hotel: HotelOption) => void;
}

export const HotelSelector: React.FC<HotelSelectorProps> = ({
  stops,
  selectedHotels,
  onSelectHotelForDestination
}) => {
  const [selectedCity, setSelectedCity] = useState(stops[0]?.name || 'Pondicherry (Puducherry)');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [onlyParking, setOnlyParking] = useState(true);

  // Available hotels in selected destination
  const destinationHotels = HOTEL_CATALOG.filter((h) => {
    const matchCity = h.destination.toLowerCase().includes(selectedCity.split(' ')[0].toLowerCase());
    const matchTier = tierFilter === 'all' || h.tier === tierFilter;
    const matchVeg = !onlyVeg || h.hasPureVegRestaurant;
    const matchParking = !onlyParking || h.hasParking;
    return matchCity && matchTier && matchVeg && matchParking;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
            Verified Clean Stays
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Curated Hotels & Pilgrimage Lodgings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Carefully evaluated for hygiene, customer ratings, safe vehicle parking, and vegetarian dining.
          </p>
        </div>

        {/* City Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {stops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedCity(stop.name)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCity === stop.name
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {stop.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls (Functional button tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Tier:</span>
          {['all', 'budget', 'standard', 'premium', 'pilgrimage'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                tierFilter === t
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={onlyVeg}
              onChange={(e) => setOnlyVeg(e.target.checked)}
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <span>Pure Vegetarian Kitchen</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={onlyParking}
              onChange={(e) => setOnlyParking(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Dedicated Car Parking</span>
          </label>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinationHotels.length > 0 ? (
          destinationHotels.map((hotel) => {
            const isCurrentlySelected = selectedHotels.some((h) => h.id === hotel.id);

            return (
              <div
                key={hotel.id}
                className={`flex flex-col justify-between rounded-2xl p-5 border transition-all ${
                  isCurrentlySelected
                    ? 'border-orange-500 bg-orange-50/20 ring-2 ring-orange-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {hotel.tier} Accommodation
                      </span>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {hotel.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {hotel.rating}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">{hotel.address}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 font-mono">
                    <span>Cleanliness: <strong className="text-teal-700">{hotel.cleanlinessScore}/10</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>{hotel.distanceFromTownCenterKm} km from center</span>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 italic">
                    {hotel.cancellationPolicy}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                      <span className="text-[11px] font-normal text-slate-500"> / night</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">+₹{hotel.taxAmount} GST</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectHotelForDestination(selectedCity, hotel)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      isCurrentlySelected
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCurrentlySelected ? '✓ Selected Stay' : 'Select Hotel'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-xs text-slate-500">
            No hotels match the selected filter. Try selecting 'All' tiers.
          </div>
        )}
      </div>
    </div>
  );
};
