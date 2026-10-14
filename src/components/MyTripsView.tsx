import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Car,
  Key,
  Share2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Booking } from '../types';

interface MyTripsViewProps {
  bookings: Booking[];
  onStartNewTrip: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({ bookings, onStartNewTrip }) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<string>('Driver Dispatched');

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handleShareTrip = (ref: string) => {
    navigator.clipboard?.writeText(
      `MMTT Live Doorstep Travel Tracking for ${ref}: Chauffeur assigned. Track vehicle live at https://mmtt.tours/track/${ref}`
    );
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto my-12">
        <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900">No Bookings Yet</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          You haven't scheduled any doorstep trips yet. Plan your temple tour, family holiday, or weekend road trip with MMTT.
        </p>
        <button
          onClick={onStartNewTrip}
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Plan a Doorstep Journey
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
            Traveler Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings & Doorstep Live Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your confirmed chauffeur assignments, pickup OTPs, driver telephone numbers, and day-by-day itineraries.
          </p>
        </div>

        <button
          onClick={onStartNewTrip}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          + Book Another Journey
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bookings List (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Your Scheduled Journeys ({bookings.length})
          </h3>

          {bookings.map((b) => {
            const isSelected = b.id === (activeBooking?.id || '');

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBookingId(b.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-white shadow-sm ring-2 ring-slate-900/5'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-slate-900">{b.bookingRef}</span>
                  <span className="font-semibold capitalize text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    {b.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-800 truncate">
                  {b.stops.map((s) => s.name.split(' ')[0]).join(' → ')}
                </div>

                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-mono">
                  <span>{b.startDate} · {b.totalDays} Days</span>
                  <span className="font-bold text-slate-900">₹{b.totalFare.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Booking Details & Live Tracker (lg:col-span-8) */}
        {activeBooking && (
          <div className="lg:col-span-8 space-y-6">
            {/* Top Card: Doorstep Pickup Verification & OTP */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Ref: {activeBooking.bookingRef}
                    </span>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {activeBooking.bookingType === 'two-way' ? 'Two-Way Round Trip' : 'Multi-City Trip'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Doorstep Pickup Status & Verification
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareTrip(activeBooking.bookingRef)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-teal-600" />
                    {shareSuccess ? 'Link Copied!' : 'Share Live Trip Link'}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    Print Voucher
                  </button>
                </div>
              </div>

              {/* Secure OTP Banner */}
              <div className="mt-6 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Pickup Security OTP (One-Time Password)
                    </div>
                    <div className="text-xs text-amber-800 mt-0.5">
                      Share this code with your chauffeur only after verifying the vehicle plate outside your door.
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0 bg-white px-4 py-2 rounded-xl border border-amber-200">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Doorstep OTP</div>
                  <div className="text-2xl font-black text-slate-900 font-mono tracking-widest">
                    {activeBooking.pickupOtp || '5921'}
                  </div>
                </div>
              </div>

              {/* Chauffeur Details Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Chauffeur Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Assigned Highway Chauffeur
                  </div>

                  {activeBooking.driver ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                        <img
                          src={activeBooking.driver.photo || '/src/assets/images/mmtt_driver_recruitment_1791998103361.jpg'}
                          alt={activeBooking.driver.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm">{activeBooking.driver.name}</div>
                        <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                          {activeBooking.driver.phone} · {activeBooking.driver.rating}★ Rated
                        </div>
                        <div className="text-emerald-700 font-semibold mt-1 flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Commercial License & Police Verified
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-600">
                      <p className="font-medium">Chauffeur Assignment in Progress</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Driver & vehicle plate details will be dispatched via SMS/WhatsApp 2 hours before pickup.</p>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Vehicle Registration & Class
                  </div>

                  <div className="font-bold text-slate-900 text-sm">
                    {activeBooking.vehicle.models}
                  </div>
                  <div className="text-slate-600 font-mono text-[11px] mt-0.5">
                    Reg: <strong className="text-slate-900">{activeBooking.driver?.vehicleReg || 'TN 01 AZ 1234'}</strong> (Commercial Yellow Plate)
                  </div>
                  <div className="text-slate-500 text-[11px] mt-2 flex items-center gap-2">
                    <span>{activeBooking.passengers} Passengers</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeBooking.luggage} Bags Boot Capacity</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-700 font-medium">Chilled AC</span>
                  </div>
                </div>
              </div>

              {/* Doorstep Pickup & Return Addresses */}
              <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Doorstep Pickup Location: </span>
                    <span className="text-slate-700">
                      {activeBooking.pickup.doorNumber ? `${activeBooking.pickup.doorNumber}, ` : ''}
                      {activeBooking.pickup.street ? `${activeBooking.pickup.street}, ` : ''}
                      {activeBooking.pickup.area || 'Chennai'} — PIN {activeBooking.pickup.pincode || '600040'}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Agreed Pickup Time: {activeBooking.pickup.pickupTime || '06:00 AM'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                  <MapPin className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Final Return Drop-off: </span>
                    <span className="text-slate-700">
                      {activeBooking.dropoff.finalAddress || 'Return to Chennai home address'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Journey Simulation Progression */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wide">
                    Live Dispatch Stage
                  </span>
                  <div className="flex gap-1.5">
                    {['Driver Dispatched', 'Arrived at Doorstep', 'Trip Active', 'Completed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSimulatedStatus(st)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          simulatedStatus === st
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center gap-3 text-xs text-teal-950 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Current Real-Time Status: <strong>{simulatedStatus}</strong>. Chauffeur is adhering to the 16-hour driving safety limits and sanitization guidelines.
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Invoice Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-xs font-mono">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans mb-3">
                Transparent Account Settlement
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Total Quoted Trip Fare:</span>
                  <span className="font-bold text-slate-900">₹{activeBooking.totalFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Advance Amount Paid:</span>
                  <span>-₹{activeBooking.advancePaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-bold border-t border-slate-100 pt-1.5 text-sm">
                  <span>Balance Due to Driver:</span>
                  <span>₹{activeBooking.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-sans">
                Doorstep pickup charges: ₹0.00 (Included in package). Driver toll receipts and parking slips will be accounted upon return.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
