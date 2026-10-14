import React, { useState } from 'react';
import { Check, ShieldAlert, ArrowRight, ChevronDown, ChevronUp, Users, Car, Building2, MapPin, Sparkles } from 'lucide-react';
import { RecommendationTier, VehicleOption, HotelOption } from '../types';

interface ComparisonCardsProps {
  tiers: RecommendationTier[];
  selectedTierId: 'economy' | 'best_value' | 'premium';
  onSelectTier: (tier: RecommendationTier) => void;
  onProceedToBooking: (tier: RecommendationTier) => void;
  passengers: number;
}

export const ComparisonCards: React.FC<ComparisonCardsProps> = ({
  tiers,
  selectedTierId,
  onSelectTier,
  onProceedToBooking,
  passengers
}) => {
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>('best_value');
  const [showAlternativeComparison, setShowAlternativeComparison] = useState(false);

  const toggleBreakdown = (id: string) => {
    setExpandedBreakdown(expandedBreakdown === id ? null : id);
  };

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
            MMTT Transparent Evaluation Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cheap & Best Trip Comparisons
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every quote calculates the full group total first, alongside transparent per-person figures.
            Doorstep pickup charges are always 100% included in the fare.
          </p>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            const isBestValue = tier.id === 'best_value';

            return (
              <div
                key={tier.id}
                className={`flex flex-col justify-between bg-white rounded-3xl p-6 transition-all duration-200 ${
                  isBestValue
                    ? 'border-2 border-orange-500 shadow-lg ring-1 ring-orange-500/10 relative'
                    : 'border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  {/* Marquee label or subtitle */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {tier.name}
                    </span>
                    {isBestValue && (
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">
                        MMTT Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {tier.tagline}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Total Fare & Per Person Display */}
                  <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Complete Group Total</div>
                        <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                          ₹{tier.totalFare.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">Per Traveler</div>
                        <div className="text-lg font-bold text-teal-700 font-mono">
                          ₹{tier.perPersonFare.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Includes Car + Stays + Tolls + Tax</span>
                      <span className="text-emerald-700 font-medium">Doorstep Pickup: ₹0</span>
                    </div>
                  </div>

                  {/* Selected Vehicle & Hotel Snippets */}
                  <div className="mt-5 space-y-3">
                    {/* Vehicle */}
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Car className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="text-xs min-w-0">
                        <div className="font-bold text-slate-900 truncate">{tier.vehicle.models}</div>
                        <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{tier.vehicle.seatingCapacity} Seats</span>
                          <span aria-hidden="true">·</span>
                          <span>{tier.vehicle.luggageCapacity} Bags</span>
                          <span aria-hidden="true">·</span>
                          <span>₹{tier.vehicle.ratePerKm}/km</span>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Stays */}
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Building2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-xs min-w-0">
                        <div className="font-bold text-slate-900 truncate">
                          {tier.hotels[0]?.name || 'Curated Accommodation'}
                        </div>
                        <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>Rating: {tier.hotels[0]?.rating || 4.3}★</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{tier.hotels[0]?.tier || 'Clean'} Tier</span>
                          <span aria-hidden="true">·</span>
                          <span>Parking Included</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights (Clean prosodic bullet list) */}
                  <div className="mt-5 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Why Choose This:
                    </span>
                    {tier.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Transparent Trade-offs (Honest comparison) */}
                  <div className="mt-4 p-3 bg-amber-50/70 rounded-xl border border-amber-200/60">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block mb-1">
                      Transparent Trade-offs:
                    </span>
                    <ul className="space-y-1 text-xs text-amber-900/90 list-disc list-inside">
                      {tier.tradeoffs.map((t, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Breakdown Accordion Toggle */}
                  <button
                    onClick={() => toggleBreakdown(tier.id)}
                    className="mt-4 flex items-center justify-between w-full text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
                  >
                    <span>Inspect Complete Fare Breakdown</span>
                    {expandedBreakdown === tier.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {expandedBreakdown === tier.id && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>Chauffeur Car Base:</span>
                        <span>₹{tier.breakdown.carFare.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Driver Allowance:</span>
                        <span>₹{tier.breakdown.driverAllowance.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tolls & Parking:</span>
                        <span>₹{tier.breakdown.tollsParkingEstimate.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Hotel Accommodation:</span>
                        <span>₹{tier.breakdown.hotelTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Doorstep Pickup Fee:</span>
                        <span>₹0.00 (Included)</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Taxes & GST (5%):</span>
                        <span>₹{tier.breakdown.gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                        <span>Grand Total:</span>
                        <span>₹{tier.totalFare.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Selection Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTier(tier);
                      onProceedToBooking(tier);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isBestValue
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Select & Book This Option
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternative Modes Comparison Banner (Private Car vs Shared Bus / Train) */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Transparent Comparison: Private Car vs. Train / Bus
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                While a shared bus or second-class train ticket can seem lower per head, private chauffeur travel saves 4+ hours of transit, eliminates auto/cab luggage transfers, and picks up elderly family members right at your front door.
              </p>
            </div>

            <button
              onClick={() => setShowAlternativeComparison(!showAlternativeComparison)}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline whitespace-nowrap self-start sm:self-center"
            >
              {showAlternativeComparison ? 'Hide Travel Mode Comparison' : 'View Mode Breakdown'}
            </button>
          </div>

          {showAlternativeComparison && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">MMTT Doorstep Chauffeur</div>
                <p className="text-slate-600">Home pickup, customized stops, tea & meal stops anytime, heavy luggage safely locked, air-conditioned door-to-door.</p>
                <div className="mt-2 text-teal-700 font-semibold">Overall Value: High</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Train (Tatkal / AC 3-Tier)</div>
                <p className="text-slate-600">Must reach Chennai Central/Egmore by 5 AM, book local cabs at both ends, porter fees for bags, fixed station schedules.</p>
                <div className="mt-2 text-slate-500 font-semibold">Overall Value: Moderate</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Outstation Buses (Omni / SETC)</div>
                <p className="text-slate-600">Must board at Koyambedu or Kilambakkam KCBT, fixed drop-off points away from hotel, multiple passenger co-travelers.</p>
                <div className="mt-2 text-slate-500 font-semibold">Overall Value: Basic</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
