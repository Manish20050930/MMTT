import React from 'react';
import {
  MapPin,
  ArrowDown,
  Navigation,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Clock,
  Car,
  Home
} from 'lucide-react';
import { DestinationStop, BookingType, PickupDetails, DropoffDetails } from '../types';
import { POPULAR_DESTINATIONS } from '../data/mockData';

interface RoutePlannerProps {
  stops: DestinationStop[];
  setStops: React.Dispatch<React.SetStateAction<DestinationStop[]>>;
  bookingType: BookingType;
  pickup: PickupDetails;
  dropoff: DropoffDetails;
  totalDistanceKm: number;
  totalDrivingHours: number;
  totalDays: number;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  stops,
  setStops,
  bookingType,
  pickup,
  dropoff,
  totalDistanceKm,
  totalDrivingHours,
  totalDays
}) => {
  // Move stop up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newStops = [...stops];
    const temp = newStops[index - 1];
    newStops[index - 1] = newStops[index];
    newStops[index] = temp;
    setStops(newStops);
  };

  // Move stop down
  const moveDown = (index: number) => {
    if (index === stops.length - 1) return;
    const newStops = [...stops];
    const temp = newStops[index + 1];
    newStops[index + 1] = newStops[index];
    newStops[index] = temp;
    setStops(newStops);
  };

  // Remove stop
  const removeStop = (id: string) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  // Update nights for stop
  const updateNights = (id: string, nights: number) => {
    setStops(
      stops.map((s) =>
        s.id === id
          ? { ...s, nights: Math.max(0, nights), isOvernight: nights > 0 }
          : s
      )
    );
  };

  // Check 16-hr rule across all stops
  const exceeds16HoursInSingleLeg = stops.some((s) => s.drivingTimeHrs > 16);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
            Interactive Journey Route
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Route Stops & Daily Driving Plan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Doorstep to doorstep itinerary. Reorder stops, configure overnight stays, or add sightseeing waypoints.
          </p>
        </div>

        {/* Quick Route Summary Metrics */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-mono">
          <div>
            <div className="text-slate-500 text-[11px]">Total Distance</div>
            <div className="font-bold text-slate-900">{totalDistanceKm} km</div>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <div className="text-slate-500 text-[11px]">Est. Drive Time</div>
            <div className="font-bold text-slate-900">{totalDrivingHours} hrs</div>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <div className="text-slate-500 text-[11px]">Trip Duration</div>
            <div className="font-bold text-teal-700">{totalDays} Days</div>
          </div>
        </div>
      </div>

      {/* 16-Hour Limit Alert if triggered */}
      {exceeds16HoursInSingleLeg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-800">16-Hour Daily Driving Limit Exceeded</div>
            <p className="mt-0.5 text-red-700">
              One of your route segments requires more than 16 hours of continuous driving in a single stretch.
              For driver safety and family comfort, MMTT policy mandates inserting an overnight halt (e.g. Salem or Dindigul).
            </p>
          </div>
        </div>
      )}

      {/* Visual Vertical Route Pipeline */}
      <div className="space-y-4">
        {/* Origin: Chennai Doorstep */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" />
          </div>

          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                Doorstep Pickup — Chennai
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                Pickup Fee: ₹0 Included
              </span>
            </div>

            <p className="text-slate-600 mt-1">
              {pickup.doorNumber ? `${pickup.doorNumber}, ` : ''}
              {pickup.street ? `${pickup.street}, ` : ''}
              {pickup.area || 'Chennai'}, {pickup.pincode}
            </p>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <span>Agreed Departure: <strong className="text-slate-800">{pickup.pickupTime || '06:00 AM'}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Chauffeur arrives 15 mins prior with OTP verification</span>
            </div>
          </div>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2 text-slate-300">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Waypoint Destination Stops */}
        {stops.map((stop, index) => (
          <React.Fragment key={stop.id}>
            <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0 font-bold font-mono">
                {index + 1}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{stop.name}</span>
                    <span className="text-slate-400 ml-2">({stop.state})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded text-slate-500 hover:text-slate-900 ${
                        index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'
                      }`}
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === stops.length - 1}
                      className={`p-1 rounded text-slate-500 hover:text-slate-900 ${
                        index === stops.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100'
                      }`}
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {stops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStop(stop.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 ml-1"
                        title="Delete Stop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Driving details */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-600 text-[11px]">
                  <span>Driving Distance: <strong className="text-slate-900 font-mono">{stop.distanceKm} km</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Driving Duration: <strong className="text-slate-900 font-mono">{stop.drivingTimeHrs} hrs</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Safety Status: {stop.drivingTimeHrs <= 16 ? (
                    <span className="text-emerald-700 font-medium">Within 16h Safe Limit</span>
                  ) : (
                    <span className="text-red-600 font-medium">Exceeds 16h Limit</span>
                  )}</span>
                </div>

                {/* Sightseeing Highlights */}
                <div className="mt-2 text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-700">Sightseeing: </span>
                  {stop.attractions.slice(0, 4).join(', ')}
                </div>

                {/* Overnight Config */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-slate-700">Overnight Stay:</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateNights(stop.id, Math.max(0, stop.nights - 1))}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                      >
                        −
                      </button>
                      <span className="font-mono font-bold text-slate-900 px-1">
                        {stop.nights} {stop.nights === 1 ? 'Night' : 'Nights'}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateNights(stop.id, stop.nights + 1)}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-slate-500 text-[11px]">
                    Hotel: {stop.nights > 0 ? 'Verified with Parking' : 'Same-Day Excursion'}
                  </span>
                </div>
              </div>
            </div>

            {index < stops.length - 1 && (
              <div className="flex justify-center -my-2 text-slate-300">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Arrow Connector */}
        <div className="flex justify-center -my-2 text-slate-300">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Destination Drop-off Point */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>

          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {bookingType === 'two-way'
                  ? 'Return to Chennai Doorstep (Round Trip)'
                  : `Final Destination Drop-off: ${dropoff.finalCity || 'Customer Selected'}`}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {bookingType === 'two-way' ? 'Return to Home' : 'One-Way Multi-City'}
              </span>
            </div>

            <p className="text-slate-600 mt-1">
              {bookingType === 'two-way'
                ? `Safe drop-off back to ${pickup.doorNumber || ''} ${pickup.street || ''} ${pickup.area || 'Chennai'}, with luggage unloaded.`
                : dropoff.finalAddress || 'Custom drop-off address specified by traveler.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
