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
  FileText,
  CreditCard,
  Receipt,
  Sparkles
} from 'lucide-react';
import { Booking, PaymentTransaction } from '../types';
import { saveBooking } from '../utils/storage';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { TaxInvoiceModal } from './TaxInvoiceModal';

interface MyTripsViewProps {
  bookings: Booking[];
  onStartNewTrip: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({ bookings, onStartNewTrip }) => {
  const [bookingList, setBookingList] = useState<Booking[]>(bookings);
  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<string>('Driver Dispatched');

  // Payment modals state
  const [showPayBalanceModal, setShowPayBalanceModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Sync bookingList with prop when updated
  React.useEffect(() => {
    setBookingList(bookings);
  }, [bookings]);

  const activeBooking =
    bookingList.find((b) => b.id === selectedBookingId) || bookingList[0];

  const handleShareTrip = (ref: string) => {
    navigator.clipboard?.writeText(
      `MMTT Live Doorstep Travel Tracking for ${ref}: Chauffeur assigned. Track vehicle live at https://mmtt.tours/track/${ref}`
    );
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    if (!activeBooking) return;

    const updatedBooking: Booking = {
      ...activeBooking,
      advancePaid: activeBooking.advancePaid + txn.amount,
      balanceDue: Math.max(0, activeBooking.balanceDue - txn.amount),
      transactions: [...(activeBooking.transactions || []), txn]
    };

    saveBooking(updatedBooking);
    setBookingList((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
    );
    setShowPayBalanceModal(false);
  };

  if (!bookingList || bookingList.length === 0) {
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
            Traveler Dashboard & Payments
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings, OTPs & Payment Records
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View verified chauffeur assignments, pickup OTPs, balance settlement receipts, and official GST tax invoices.
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
            Your Scheduled Journeys ({bookingList.length})
          </h3>

          {bookingList.map((b) => {
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

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className={b.balanceDue === 0 ? 'text-emerald-700 font-semibold' : 'text-orange-600 font-semibold'}>
                    {b.balanceDue === 0 ? '✓ Paid in Full' : `Due: ₹${b.balanceDue.toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-slate-400 font-mono">OTP: {b.pickupOtp}</span>
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
                    onClick={() => setShowInvoiceModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-teal-700" />
                    GST Tax Invoice
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
                      Doorstep Security OTP (One-Time Password)
                    </div>
                    <div className="text-xs text-amber-800 mt-0.5">
                      Verify chauffeur face & yellow plate outside your home in Chennai, then share this OTP.
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0 bg-white px-4 py-2 rounded-xl border border-amber-200">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Doorstep OTP</div>
                  <div className="text-2xl font-black text-slate-900 font-mono tracking-widest">
                    {activeBooking.pickupOtp}
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
                      <p className="text-[11px] text-slate-400 mt-0.5">Driver & vehicle plate details will be dispatched via SMS/WhatsApp before pickup.</p>
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

            {/* Financial Settlement & Payments Hub */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Payment Status & Trip Transactions
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transparent accounting of advance tokens, driver settlements, and balance due.
                  </p>
                </div>

                {activeBooking.balanceDue > 0 ? (
                  <button
                    onClick={() => setShowPayBalanceModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Pay Balance Online (₹{activeBooking.balanceDue.toLocaleString('en-IN')})
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Settlement Completed (Paid in Full)
                  </div>
                )}
              </div>

              {/* Balances Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-xs font-mono">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] font-sans block">Total Journey Fare</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{activeBooking.totalFare.toLocaleString('en-IN')}
                  </div>
                  <span className="text-slate-500 text-[10px] font-sans">Car + Hotels + Tolls + GST</span>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                  <span className="text-emerald-700 text-[11px] font-sans block font-semibold">Total Paid to Date</span>
                  <div className="text-xl font-bold text-emerald-800 mt-1">
                    ₹{activeBooking.advancePaid.toLocaleString('en-IN')}
                  </div>
                  <span className="text-emerald-700 text-[10px] font-sans">Verified via Online Gateway</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 text-[11px] font-sans block">Outstanding Balance</span>
                  <div className={`text-xl font-bold mt-1 ${activeBooking.balanceDue > 0 ? 'text-orange-600' : 'text-slate-400'}`}>
                    ₹{activeBooking.balanceDue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-slate-500 text-[10px] font-sans">
                    {activeBooking.balanceDue > 0 ? 'Payable via UPI / Card or to Driver' : 'Zero Balance Due'}
                  </span>
                </div>
              </div>

              {/* Transactions Log */}
              {activeBooking.transactions && activeBooking.transactions.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Verified Payment Ledger
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Date & Time</th>
                          <th className="p-2.5">Transaction ID</th>
                          <th className="p-2.5">Mode</th>
                          <th className="p-2.5 text-right">Amount</th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {activeBooking.transactions.map((t) => (
                          <tr key={t.id}>
                            <td className="p-2.5 text-slate-500 text-[11px]">
                              {new Date(t.timestamp).toLocaleDateString('en-IN')} {new Date(t.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-2.5 font-bold text-slate-900">{t.transactionRef}</td>
                            <td className="p-2.5 font-sans">
                              {t.method} {t.upiProvider ? `(${t.upiProvider})` : ''}
                            </td>
                            <td className="p-2.5 text-right font-bold text-slate-900">
                              ₹{t.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                SUCCESS
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pay Balance Gateway Modal */}
      {showPayBalanceModal && activeBooking && (
        <PaymentGatewayModal
          isOpen={showPayBalanceModal}
          onClose={() => setShowPayBalanceModal(false)}
          bookingRef={activeBooking.bookingRef}
          amountToPay={activeBooking.balanceDue}
          paymentType="balance"
          customerName={activeBooking.pickup.contactName}
          customerPhone={activeBooking.pickup.contactPhone}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* GST Tax Invoice Modal */}
      {showInvoiceModal && activeBooking && (
        <TaxInvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          booking={activeBooking}
        />
      )}
    </div>
  );
};
