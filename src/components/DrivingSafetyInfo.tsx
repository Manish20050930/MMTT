import React from 'react';
import { ShieldCheck, AlertTriangle, Coffee, Moon, Clock, BedDouble } from 'lucide-react';

export const DrivingSafetyInfo: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-400 uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Safety Policy & Chauffeur Welfare
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            MMTT 16-Hour Maximum Daily Driving Guarantee
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            At Manish Mart Tours and Travels, passenger safety and driver alertness are non-negotiable.
            We will never compress an unrealistic 18-hour journey into a single day just to advertise an artificially cheap fare.
          </p>
        </div>

        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 shrink-0 text-left">
          <div className="text-xs text-slate-400 font-medium">Daily Driving Ceiling</div>
          <div className="text-3xl font-extrabold text-orange-400 font-mono">16 Hours</div>
          <div className="text-[11px] text-slate-300 mt-1">Recommended: &le; 10 hrs per day</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white mb-0.5">Mandatory Night Rest</div>
            <p className="text-slate-400">Chauffeurs get 8 hours of uninterrupted sleep before morning departures, ensuring zero microsleep risk on highways.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white mb-0.5">2.5-Hour Rest Intervals</div>
            <p className="text-slate-400">Routes schedule clean highway refreshments and restroom halts at reputed vegetarian restaurants (A2B, Saravana Bhavan, Murugan Idli).</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400 shrink-0">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white mb-0.5">Overnight Hub Suggestions</div>
            <p className="text-slate-400">When trips exceed safe single-day driving limits (e.g., Kanyakumari or Munnar), our engine suggests comfortable midway halts like Salem or Dindigul.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white mb-0.5">Driving vs Sightseeing Time</div>
            <p className="text-slate-400">Itineraries clearly distinguish pure behind-the-wheel driving hours from relaxed temple darshan or sightseeing durations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
