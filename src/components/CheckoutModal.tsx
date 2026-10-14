import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Car,
  Building2,
  Phone,
  User,
  Key,
  ArrowRight,
  Lock,
  CreditCard
} from 'lucide-react';
import {
  Booking,
  BookingType,
  TripCategory,
  PickupDetails,
  DropoffDetails,
  DestinationStop,
  VehicleOption,
  HotelOption,
  DayPlan,
  PaymentTransaction
} from '../types';
import { saveBooking } from '../utils/storage';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: BookingType;
  category: TripCategory;
  pickup: PickupDetails;
  dropoff: DropoffDetails;
  stops: DestinationStop[];
  vehicle: VehicleOption;
  hotels: HotelOption[];
  itinerary: DayPlan[];
  startDate: string;
  endDate: string;
  totalDays: number;
  totalDistanceKm: number;
  passengers: number;
  luggage: number;
  totalFare: number;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  bookingType,
  category,
  pickup,
  dropoff,
  stops,
  vehicle,
  hotels,
  itinerary,
  startDate,
  endDate,
  totalDays,
  totalDistanceKm,
  passengers,
  luggage,
  totalFare,
  onBookingConfirmed
}) => {
  const [customerName, setCustomerName] = useState(pickup.contactName || '');
  const [customerPhone, setCustomerPhone] = useState(pickup.contactPhone || '');
  const [customerEmail, setCustomerEmail] = useState(pickup.contactEmail || '');
  const [paymentChoice, setPaymentChoice] = useState<'advance_20' | 'full' | 'pay_to_driver'>('advance_20');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  if (!isOpen) return null;

  const advanceAmount = Math.round(totalFare * 0.2);
  const payableNow = paymentChoice === 'full' ? totalFare : paymentChoice === 'advance_20' ? advanceAmount : 0;
  const balanceDue = paymentChoice === 'full' ? 0 : totalFare - payableNow;
  const tempBookingRef = `MMTT-CH-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleStartPayment = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter primary traveler name and 10-digit mobile number.');
      return;
    }
    setErrorMsg('');

    if (paymentChoice === 'pay_to_driver') {
      // Immediate confirmation with Doorstep payment
      completeBooking();
    } else {
      // Open interactive payment gateway modal for UPI/Card/NetBanking
      setShowPaymentGateway(true);
    }
  };

  const completeBooking = (completedTxn?: PaymentTransaction) => {
    setIsSubmitting(true);
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingRef = completedTxn?.bookingRef || tempBookingRef;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingRef,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      bookingType,
      category,
      passengers,
      luggage,
      pickup: {
        ...pickup,
        contactName: customerName,
        contactPhone: customerPhone,
        contactEmail: customerEmail
      },
      dropoff,
      startDate,
      endDate,
      totalDays,
      totalDistanceKm,
      stops,
      vehicle,
      hotels,
      itinerary,
      totalFare,
      advancePaid: paymentChoice === 'full' ? totalFare : paymentChoice === 'advance_20' ? advanceAmount : 0,
      balanceDue: paymentChoice === 'full' ? 0 : paymentChoice === 'advance_20' ? balanceDue : totalFare,
      paymentMode: paymentChoice,
      pickupOtp: generatedOtp,
      transactions: completedTxn ? [completedTxn] : [],
      invoiceNumber: `INV-MMTT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      specialNotes: pickup.specialInstructions
    };

    saveBooking(newBooking);
    setIsSubmitting(false);
    setShowPaymentGateway(false);
    onBookingConfirmed(newBooking);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase">
                Final Quotation & Doorstep Booking
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Confirm & Secure Your Vehicle
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Journey Summary Strip */}
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 text-[11px] block">Trip Route</span>
                <span className="font-bold text-slate-900 truncate block">
                  Chennai → {stops.map((s) => s.name.split(' ')[0]).join(' → ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Vehicle</span>
                <span className="font-bold text-slate-900 truncate block">
                  {vehicle.models}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Schedule</span>
                <span className="font-bold text-slate-900 block font-mono">
                  {totalDays} Days ({totalDistanceKm} km)
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Doorstep Pickup</span>
                <span className="font-bold text-emerald-700 block">
                  {pickup.area || 'Chennai'} (₹0 Fee)
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information Form */}
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary Traveler Contact (For Chauffeur & OTP)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sundaram Ramachandran"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Mobile Number (For WhatsApp / SMS OTP) *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98401 23456"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Email Address (For Official GST Tax Invoice & Itinerary Voucher)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="sundaram.r@gmail.com"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Payment Options Selection */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment & Advance Token Selection
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                Total Group Fare: <strong>₹{totalFare.toLocaleString('en-IN')}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentChoice('advance_20')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentChoice === 'advance_20'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">20% Advance Token</div>
                <div className="text-sm font-bold text-orange-600 font-mono mt-0.5">
                  ₹{advanceAmount.toLocaleString('en-IN')} Now
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Remaining ₹{balanceDue.toLocaleString('en-IN')} to driver
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('full')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentChoice === 'full'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">Pay Full Total</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  ₹{totalFare.toLocaleString('en-IN')} Now
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Instant full receipt & zero cash hassle
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('pay_to_driver')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentChoice === 'pay_to_driver'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">Pay at Doorstep</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  ₹0 Now
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Pay cash/UPI when car arrives
                </div>
              </button>
            </div>
          </div>

          {/* Security & GST Assurances */}
          <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Includes 5% Transport GST, Driver Allowance, Tolls, and Doorstep Pickup.</span>
            </div>
            <span className="font-bold text-slate-900 font-mono text-[11px]">SAC: 996412</span>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Modify Preferences
            </button>

            <button
              type="button"
              onClick={handleStartPayment}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {paymentChoice === 'pay_to_driver' ? (
                <>
                  Confirm Doorstep Booking (Pay Later)
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </>
              ) : (
                <>
                  Proceed to Secure Payment (₹{payableNow.toLocaleString('en-IN')})
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Gateway Modal */}
      {showPaymentGateway && (
        <PaymentGatewayModal
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          bookingRef={tempBookingRef}
          amountToPay={payableNow}
          paymentType={paymentChoice === 'full' ? 'full' : 'advance'}
          customerName={customerName}
          customerPhone={customerPhone}
          onPaymentSuccess={(txn) => completeBooking(txn)}
        />
      )}
    </>
  );
};
