import React from 'react';
import { X, Printer, Download, CheckCircle, FileText, Building2, MapPin } from 'lucide-react';
import { Booking } from '../types';

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen) return null;

  const invoiceNumber = booking.invoiceNumber || `INV-MMTT-2026-${booking.bookingRef.replace('MMTT-CH-', '')}`;
  const cgst = Math.round(booking.totalFare * 0.025);
  const sgst = Math.round(booking.totalFare * 0.025);
  const taxableValue = booking.totalFare - (cgst + sgst);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-6 text-slate-900 print:shadow-none print:m-0 print:p-4">
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Official GST Tax Invoice & Trip Voucher
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950 text-teal-400 font-extrabold flex items-center justify-center text-sm">
                M
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                MMTT — Manish Mart Tours & Travels
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Doorstep-to-Doorstep Chauffeur Travel & Verified Lodgings<br />
              No. 18, Jawaharlal Nehru Road, Koyambedu, Chennai 600107
            </p>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              GSTIN: <strong className="text-slate-800">33AAACM1984Q1Z2</strong> · SAC: <strong className="text-slate-800">996412</strong>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <div className="text-sm font-bold text-slate-900">{invoiceNumber}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">Date: {new Date(booking.createdAt).toLocaleDateString('en-IN')}</div>
            <div className="text-teal-700 font-semibold mt-1">Booking Ref: {booking.bookingRef}</div>
            <div className="text-[11px] text-slate-500">Doorstep OTP: <strong className="text-slate-900">{booking.pickupOtp}</strong></div>
          </div>
        </div>

        {/* Bill To & Journey Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To (Traveler)</div>
            <div className="font-bold text-slate-900 text-sm">{booking.pickup.contactName || 'Valued Customer'}</div>
            <div className="text-slate-600 mt-0.5 font-mono">{booking.pickup.contactPhone}</div>
            <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
              {booking.pickup.doorNumber ? `${booking.pickup.doorNumber}, ` : ''}
              {booking.pickup.street ? `${booking.pickup.street}, ` : ''}
              {booking.pickup.area}, Chennai {booking.pickup.pincode}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Journey Overview</div>
            <div className="font-bold text-slate-900">
              Chennai → {booking.stops.map((s) => s.name.split(' ')[0]).join(' → ')}
            </div>
            <div className="text-slate-600 text-[11px] mt-0.5 font-mono">
              Vehicle: {booking.vehicle.models} ({booking.driver?.vehicleReg || 'TN Commercial Yellow Plate'})
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5 font-mono">
              Dates: {booking.startDate} to {booking.endDate} ({booking.totalDays} Days · {booking.totalDistanceKm} km)
            </div>
          </div>
        </div>

        {/* Itemized Charges Table */}
        <div className="py-4 border-b border-slate-200">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="pb-2">Description</th>
                <th className="pb-2 text-center">SAC Code</th>
                <th className="pb-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2">
                  <div className="font-bold text-slate-900 font-sans">
                    Chauffeur-Driven Tourist Car Package ({booking.vehicle.models})
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Includes fuel, highway driving, tolls, parking, and driver outstation allowance
                  </div>
                </td>
                <td className="py-2 text-center">996412</td>
                <td className="py-2 text-right font-bold text-slate-900">
                  ₹{Math.round(taxableValue * 0.72).toLocaleString('en-IN')}
                </td>
              </tr>

              <tr>
                <td className="py-2">
                  <div className="font-bold text-slate-900 font-sans">
                    Hotel & Pilgrimage Stays ({booking.hotels.map((h) => h.name).join(', ')})
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Verified clean rooms with vehicle parking
                  </div>
                </td>
                <td className="py-2 text-center">996311</td>
                <td className="py-2 text-right font-bold text-slate-900">
                  ₹{Math.round(taxableValue * 0.28).toLocaleString('en-IN')}
                </td>
              </tr>

              <tr>
                <td className="py-2">
                  <div className="font-bold text-emerald-700 font-sans">
                    Doorstep Home Pickup & Return Drop-off Service in Chennai
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Direct residential pickup — 100% Included by MMTT
                  </div>
                </td>
                <td className="py-2 text-center">996412</td>
                <td className="py-2 text-right text-emerald-700 font-bold">
                  ₹0.00 (Free)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* GST & Totals */}
        <div className="py-4 space-y-1.5 text-xs font-mono border-b border-slate-200">
          <div className="flex justify-between text-slate-600">
            <span>Taxable Value:</span>
            <span>₹{taxableValue.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Central GST (CGST @ 2.5%):</span>
            <span>₹{cgst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>State GST (SGST @ 2.5%):</span>
            <span>₹{sgst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Grand Total (INR):</span>
            <span>₹{booking.totalFare.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment History & Settlement */}
        <div className="py-4 text-xs font-mono">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans">
            Payment & Settlement Status
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between text-emerald-800 font-bold">
              <span>Advance Paid Online:</span>
              <span>₹{booking.advancePaid.toLocaleString('en-IN')} (Verified)</span>
            </div>
            <div className="flex justify-between text-slate-700 font-bold">
              <span>Balance Amount Due:</span>
              <span>₹{booking.balanceDue.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans pt-1">
              Payment mode: {booking.paymentMode === 'full' ? 'Paid in Full' : booking.paymentMode === 'advance_20' ? '20% Advance Token' : 'Doorstep Cash/UPI to Driver'}
            </div>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="pt-4 text-[10px] text-slate-400 space-y-1">
          <div>* This is a computer-generated tax invoice. No signature is required.</div>
          <div>* Manish Mart Tours and Travels complies with the 16-Hour Daily Driving Safety Limit. Driver toll receipts and parking slips are available upon request.</div>
          <div>* Customer Support: 044-2841-8800 · support@manishmarttours.com</div>
        </div>
      </div>
    </div>
  );
};
