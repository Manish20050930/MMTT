import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Car,
  Utensils,
  Camera,
  BedDouble,
  MapPin,
  Plus,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { DayPlan, DayActivity } from '../types';

interface ItineraryViewProps {
  itinerary: DayPlan[];
  setItinerary: React.Dispatch<React.SetStateAction<DayPlan[]>>;
  totalDistanceKm: number;
  totalDays: number;
  onProceedToCheckout: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  setItinerary,
  totalDistanceKm,
  totalDays,
  onProceedToCheckout
}) => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('04:00 PM');
  const [newActivityType, setNewActivityType] = useState<DayActivity['type']>('sightseeing');

  const handleAddCustomActivity = (dayNumber: number) => {
    if (!newActivityTitle.trim()) return;

    setItinerary((prev) =>
      prev.map((day) => {
        if (day.dayNumber === dayNumber) {
          const updatedActivities: DayActivity[] = [
            ...day.activities,
            {
              time: newActivityTime,
              title: newActivityTitle.trim(),
              description: 'Custom activity added by traveler.',
              type: newActivityType,
              durationHrs: 1.5
            }
          ];
          return { ...day, activities: updatedActivities };
        }
        return day;
      })
    );

    setNewActivityTitle('');
    setEditingDay(null);
  };

  const getActivityIcon = (type: DayActivity['type']) => {
    switch (type) {
      case 'pickup':
      case 'drop':
        return <MapPin className="w-4 h-4 text-teal-600" />;
      case 'drive':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'sightseeing':
        return <Camera className="w-4 h-4 text-purple-600" />;
      case 'checkin':
      case 'rest':
        return <BedDouble className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
            Day-by-Day Customized Journey
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Comprehensive Trip Itinerary
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Doorstep pickup, sightseeing stops, meal breaks, and comfortable overnight rests.
            Click any day to add custom personal visits or temple timings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onProceedToCheckout}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            Review Quotation & Book
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {itinerary.map((day) => (
          <div
            key={day.dayNumber}
            className={`border rounded-2xl p-5 transition-all ${
              day.exceeds16HourLimit
                ? 'border-red-200 bg-red-50/40'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            {/* Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 font-bold font-mono text-xs flex items-center justify-center">
                  D{day.dayNumber}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{day.title}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                    <span>{day.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>Route: {day.fromLocation} → {day.toLocation}</span>
                  </div>
                </div>
              </div>

              {/* Day Metrics Badge */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                <span>Drive: <strong className="text-slate-900">{day.drivingHours}h</strong> ({day.drivingDistanceKm} km)</span>
                <span className="text-slate-300">|</span>
                <span>Day Span: <strong className="text-slate-900">{day.totalDayHours}h</strong></span>
                <span className="text-slate-300">|</span>
                <span>Est. Day Spend: <strong>₹{day.estimatedDayCost.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            {/* 16-Hour Rule Warning if any */}
            {day.exceeds16HourLimit && (
              <div className="mt-3 p-3 bg-red-100/70 border border-red-300 rounded-xl flex items-center gap-2 text-xs text-red-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  Warning: Planned driving ({day.drivingHours} hrs) exceeds MMTT's 16-hour daily driving ceiling.
                  Recommended midway rest stop: {day.suggestedRestTown || 'Salem / Dindigul Highway'}.
                </span>
              </div>
            )}

            {/* Activities Timeline */}
            <div className="mt-4 space-y-3">
              {day.activities.map((act, actIdx) => (
                <div
                  key={actIdx}
                  className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/70 text-xs shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-slate-900">{act.title}</span>
                      <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {act.time} ({act.durationHrs}h)
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Overnight Hotel Summary if stay exists */}
            {day.hotelStay && (
              <div className="mt-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Overnight Lodging: <strong>{day.hotelStay.name}</strong> ({day.hotelStay.tier} tier)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 font-mono">
                  Rating: {day.hotelStay.rating}★ · Verified Parking
                </span>
              </div>
            )}

            {/* Add Custom Activity Form */}
            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              {editingDay === day.dayNumber ? (
                <div className="w-full bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-800">Add Custom Activity to Day {day.dayNumber}:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Visit maternal family home / Special pooja"
                      value={newActivityTitle}
                      onChange={(e) => setNewActivityTitle(e.target.value)}
                      className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Time (e.g. 03:30 PM)"
                        value={newActivityTime}
                        onChange={(e) => setNewActivityTime(e.target.value)}
                        className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono"
                      />
                      <select
                        value={newActivityType}
                        onChange={(e) => setNewActivityType(e.target.value as any)}
                        className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                      >
                        <option value="sightseeing">Sightseeing</option>
                        <option value="meal">Meal Stop</option>
                        <option value="rest">Rest Halt</option>
                        <option value="drive">Drive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingDay(null)}
                      className="px-3 py-1 rounded text-slate-600 hover:text-slate-900 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomActivity(day.dayNumber)}
                      className="px-3 py-1 bg-slate-900 text-white font-semibold rounded text-xs hover:bg-slate-800"
                    >
                      Save Activity
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingDay(day.dayNumber)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 py-1"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-600" />
                  + Add Custom Visit / Temple Stop to Day {day.dayNumber}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
