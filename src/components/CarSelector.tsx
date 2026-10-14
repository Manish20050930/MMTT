import React from 'react';
import { Users, Briefcase, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { VehicleOption } from '../types';
import { VEHICLE_FLEET } from '../data/mockData';

interface CarSelectorProps {
  selectedVehicle: VehicleOption;
  onSelectVehicle: (v: VehicleOption) => void;
  passengers: number;
  luggage: number;
  totalDistanceKm: number;
  totalDays: number;
}

export const CarSelector: React.FC<CarSelectorProps> = ({
  selectedVehicle,
  onSelectVehicle,
  passengers,
  luggage,
  totalDistanceKm,
  totalDays
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="max-w-2xl mb-6">
        <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
          Chauffeur-Driven Tourist Fleet
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Select Your Private Vehicle
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          All commercial yellow-plate tourist vehicles come with experienced highway chauffeurs, fuel, verified insurance, and doorstep pickup included in Chennai.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VEHICLE_FLEET.map((veh) => {
          const isSelected = selectedVehicle.id === veh.id;
          const isCapacityAdequate = veh.seatingCapacity >= passengers;
          const isLuggageAdequate = veh.luggageCapacity >= luggage;

          // Estimated car fare for comparison
          const billableKm = Math.max(totalDistanceKm, veh.minKmPerDay * totalDays);
          const estCarFare = Math.round(billableKm * veh.ratePerKm);

          return (
            <div
              key={veh.id}
              onClick={() => onSelectVehicle(veh)}
              className={`flex flex-col justify-between rounded-2xl p-5 border cursor-pointer transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-50/80 ring-2 ring-slate-900/10 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                      {veh.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{veh.models}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    ₹{veh.ratePerKm}/km
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-3">{veh.suitableFor}</p>

                {/* Capacity Badges */}
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 pb-3 border-b border-slate-100 font-mono">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {veh.seatingCapacity} Seater
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {veh.luggageCapacity} Bags
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-semibold">Chilled AC</span>
                </div>

                {/* Features */}
                <div className="space-y-1 text-xs text-slate-600">
                  {veh.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Warnings if capacity is too small */}
                {(!isCapacityAdequate || !isLuggageAdequate) && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200/60 text-[11px] text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      {!isCapacityAdequate
                        ? `Only ${veh.seatingCapacity} seats (you entered ${passengers} pax)`
                        : `Fits ${veh.luggageCapacity} bags (you have ${luggage} bags)`}
                    </span>
                  </div>
                )}
              </div>

              {/* Fare & Selection Button */}
              <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Est. Vehicle Subtotal</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    ₹{estCarFare.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVehicle(veh);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Choose Vehicle'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <span>Transparent billing: Minimum billable distance {selectedVehicle.minKmPerDay} km/day · Driver allowance ₹{selectedVehicle.driverAllowancePerDay}/day</span>
        <span className="text-emerald-700 font-medium">Doorstep Pickup: ₹0 (No extra city charges)</span>
      </div>
    </div>
  );
};
