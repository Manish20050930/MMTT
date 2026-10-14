import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'plan' | 'recommendations' | 'itinerary' | 'mytrips' | 'drive' | 'admin') => void;
  openSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, openSupport }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-950 font-bold text-base">
                M
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                MMTT
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Manish Mart Tours and Travels (MMTT) — Affordable doorstep-to-doorstep private chauffeur travel, customized South Indian itineraries, and transparent hotel booking from Chennai.
            </p>
            <div className="text-[11px] text-slate-500">
              Chennai Head Hub: Koyambedu, Chennai 600107
            </div>
          </div>

          {/* Travel Services */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Travel Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('plan')}
                  className="hover:text-white transition-colors text-left"
                >
                  Temple Pilgrimages & Darshan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plan')}
                  className="hover:text-white transition-colors text-left"
                >
                  Hill Stations (Ooty, Kodai, Yercaud)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plan')}
                  className="hover:text-white transition-colors text-left"
                >
                  Beaches (Pondicherry, Mahabalipuram)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plan')}
                  className="hover:text-white transition-colors text-left"
                >
                  Family Holidays & Weekend Getaways
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('plan')}
                  className="hover:text-white transition-colors text-left"
                >
                  Weddings & Corporate Offsites
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Platform Navigation */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="hover:text-white transition-colors"
                >
                  Cheap & Best Comparison Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('drive')}
                  className="hover:text-white transition-colors"
                >
                  Drive with MMTT (Recruitment)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('mytrips')}
                  className="hover:text-white transition-colors"
                >
                  My Trips & Live OTP Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors"
                >
                  Admin Operations Portal
                </button>
              </li>
              <li>
                <button
                  onClick={openSupport}
                  className="hover:text-white transition-colors"
                >
                  24/7 Support Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Safety Guarantees
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>· 16-Hour Maximum Daily Driving Limit</li>
              <li>· 100% Doorstep Home Pickup in Chennai</li>
              <li>· Commercial Yellow Plate Tourist Fleet</li>
              <li>· Mandatory 8-Hour Chauffeur Night Rest</li>
              <li>· Transparent Inclusive Rates (No Surprise Tolls)</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-900 text-teal-400 font-mono text-[11px]">
              24/7 Helpline: 044-2841-8800
            </div>
          </div>
        </div>

        {/* Legal notice & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Manish Mart Tours and Travels (MMTT). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Chennai, Tamil Nadu, India</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Passenger Transport Licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
