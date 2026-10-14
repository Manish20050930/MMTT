import React from 'react';
import { Compass, Car, ShieldCheck, UserCheck, CalendarDays, PhoneCall, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  activeTab: 'plan' | 'recommendations' | 'itinerary' | 'mytrips' | 'drive' | 'admin';
  setActiveTab: (tab: 'plan' | 'recommendations' | 'itinerary' | 'mytrips' | 'drive' | 'admin') => void;
  openSupport: () => void;
  bookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openSupport,
  bookingsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setActiveTab('plan')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400 font-bold text-lg shadow-sm group-hover:bg-slate-800 transition-colors">
              M
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                MMTT
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-normal block">
                Manish Mart Tours & Travels
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Clean single-line prose, no pills) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('plan')}
              className={`transition-colors whitespace-nowrap py-1 ${
                activeTab === 'plan'
                  ? 'text-slate-950 font-semibold border-b-2 border-orange-500'
                  : 'hover:text-slate-900'
              }`}
            >
              Plan a Trip
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`transition-colors whitespace-nowrap py-1 ${
                activeTab === 'recommendations'
                  ? 'text-slate-950 font-semibold border-b-2 border-orange-500'
                  : 'hover:text-slate-900'
              }`}
            >
              Cheap & Best Options
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                activeTab === 'drive'
                  ? 'text-slate-950 font-semibold border-b-2 border-orange-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4 text-teal-600" />
              Drive with MMTT
            </button>

            <button
              onClick={() => setActiveTab('mytrips')}
              className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                activeTab === 'mytrips'
                  ? 'text-slate-950 font-semibold border-b-2 border-orange-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-slate-400" />
              My Trips
              {bookingsCount > 0 && (
                <span className="text-xs text-slate-500 font-mono">({bookingsCount})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-slate-950 font-semibold border-b-2 border-orange-500'
                  : 'hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              Admin Portal
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openSupport}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="24/7 Helpline & Doorstep Assistance"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
              24/7 Support: 044-2841-8800
            </button>

            <button
              onClick={() => setActiveTab('plan')}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              Book Doorstep Car
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-slate-100 text-xs font-medium gap-4">
          <button
            onClick={() => setActiveTab('plan')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'plan' ? 'text-slate-900 font-bold border-b-2 border-orange-500' : 'text-slate-600'
            }`}
          >
            Plan Trip
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'recommendations' ? 'text-slate-900 font-bold border-b-2 border-orange-500' : 'text-slate-600'
            }`}
          >
            Compare Rates
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'drive' ? 'text-slate-900 font-bold border-b-2 border-orange-500' : 'text-slate-600'
            }`}
          >
            Drive with MMTT
          </button>
          <button
            onClick={() => setActiveTab('mytrips')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'mytrips' ? 'text-slate-900 font-bold border-b-2 border-orange-500' : 'text-slate-600'
            }`}
          >
            My Trips ({bookingsCount})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'admin' ? 'text-slate-900 font-bold border-b-2 border-orange-500' : 'text-slate-600'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
