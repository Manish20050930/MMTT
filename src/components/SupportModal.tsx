import React from 'react';
import { X, PhoneCall, ShieldAlert, Clock, MessageSquare, MapPin, Mail } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase">
              24/7 Dispatch Control Room
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              MMTT Help & Emergency Desk
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Main Emergency Call */}
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-2 text-orange-900 font-bold text-sm mb-1">
              <PhoneCall className="w-4 h-4 text-orange-600" />
              Direct Helpline (Toll Free & Landline)
            </div>
            <div className="text-base font-bold text-slate-900 font-mono">
              044-2841-8800 / +91 94440 12345
            </div>
            <p className="text-[11px] text-orange-800 mt-1">
              For active trips, doorstep delay assistance, and highway breakdown support.
            </p>
          </div>

          {/* Operational Hours & Transparency */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block">24/7 Digital Platform Availability:</strong>
                <p className="text-slate-600 text-[11px]">
                  Trip planning, instant quotation generation, and booking submissions are active 24/7.
                  Chauffeur dispatches for midnight or early dawn (3 AM - 5 AM) are pre-confirmed the previous evening.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Headquarters & Fleet Hub:</strong>
                <p className="text-slate-600 text-[11px]">
                  Manish Mart Tours and Travels (MMTT), No. 18, Jawaharlal Nehru Road, Koyambedu, Chennai, Tamil Nadu 600107
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Mail className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Email & Grievance Officer:</strong>
                <p className="text-slate-600 text-[11px]">
                  support@manishmarttours.com · driverhelp@manishmarttours.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
          >
            Close Support Desk
          </button>
        </div>
      </div>
    </div>
  );
};
