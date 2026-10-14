import React, { useState } from 'react';
import {
  Users,
  Car,
  Building2,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Download,
  Filter,
  Search,
  DollarSign,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Booking, DriverApplication, VehicleOption } from '../types';
import {
  getStoredBookings,
  getStoredDrivers,
  updateDriverStatus,
  assignDriverToBooking
} from '../utils/storage';
import { VEHICLE_FLEET, HOTEL_CATALOG } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [adminSection, setAdminSection] = useState<'bookings' | 'drivers' | 'fleet' | 'reports'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>(getStoredBookings());
  const [drivers, setDrivers] = useState<DriverApplication[]>(getStoredDrivers());

  // Filter / Search states
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'assigned'>('all');
  const [driverFilter, setDriverFilter] = useState<string>('all');
  const [selectedDriverForAction, setSelectedDriverForAction] = useState<DriverApplication | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Refresh data
  const refreshData = () => {
    setBookings(getStoredBookings());
    setDrivers(getStoredDrivers());
  };

  const handleUpdateStatus = (id: string, status: DriverApplication['status']) => {
    updateDriverStatus(id, status, adminNoteInput || undefined);
    refreshData();
    setActionSuccessMsg(`Status updated to: ${status}`);
    setSelectedDriverForAction(null);
    setAdminNoteInput('');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleAssignDriver = (bookingId: string, driverId: string) => {
    const updated = assignDriverToBooking(bookingId, driverId);
    if (updated) {
      refreshData();
      setActionSuccessMsg(`Assigned driver to Booking ${updated.bookingRef}`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const filteredDrivers = drivers.filter((d) => {
    if (driverFilter === 'all') return true;
    return d.status === driverFilter;
  });

  // Calculate high-level KPIs
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalFare, 0);
  const totalCompletedTrips = drivers.reduce((sum, d) => sum + d.completedTripsCount, 0);
  const activeFleetCount = VEHICLE_FLEET.reduce((sum, v) => sum + v.availableCount, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
              MMTT Central Operations Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin & Fleet Dispatch Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Operations: Active 24/7</span>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Top KPIs Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs font-mono">
            <div className="text-xs text-slate-500 font-sans">Total Pipeline Bookings</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{bookings.length}</div>
            <div className="text-[11px] text-teal-700 mt-1 font-sans">Doorstep Pickups Scheduled</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs font-mono">
            <div className="text-xs text-slate-500 font-sans">Bookings Value</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-700 mt-1 font-sans">Advance + On-Arrival dues</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs font-mono">
            <div className="text-xs text-slate-500 font-sans">Recruited Driver Pool</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{drivers.length}</div>
            <div className="text-[11px] text-slate-600 mt-1 font-sans">Own Vehicle & Fleet Cap</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs font-mono">
            <div className="text-xs text-slate-500 font-sans">Fleet Vehicles Available</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{activeFleetCount} Cars</div>
            <div className="text-[11px] text-teal-700 mt-1 font-sans">Yellow-Plate Commercial</div>
          </div>
        </div>

        {/* Section Navigation Tabs (Single-line controls) */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setAdminSection('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              adminSection === 'bookings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Customer Bookings & Dispatch ({bookings.length})
          </button>

          <button
            onClick={() => setAdminSection('drivers')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              adminSection === 'drivers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Driver Recruitment & Verification ({drivers.length})
          </button>

          <button
            onClick={() => setAdminSection('fleet')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              adminSection === 'fleet'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Vehicle Rates & Fleet
          </button>

          <button
            onClick={() => setAdminSection('reports')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              adminSection === 'reports'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            16-Hour Driving Safety Audit
          </button>
        </div>

        {/* SECTION 1: Customer Bookings & Dispatch */}
        {adminSection === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Manage Doorstep Bookings & Assign Drivers
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Filter:</span>
                {['all', 'confirmed', 'assigned'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f as any)}
                    className={`px-2.5 py-1 rounded-md capitalize font-medium ${
                      bookingFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Ref & Date</th>
                    <th className="p-3">Customer & Doorstep Address</th>
                    <th className="p-3">Route & Days</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Total Fare</th>
                    <th className="p-3">Pickup OTP</th>
                    <th className="p-3">Assigned Chauffeur</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono">
                        <div className="font-bold text-slate-900">{b.bookingRef}</div>
                        <div className="text-slate-400 text-[10px]">{b.startDate}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900">{b.pickup.contactName || 'Valued Customer'}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{b.pickup.contactPhone}</div>
                        <div className="text-slate-400 text-[10px] truncate max-w-xs">
                          {b.pickup.doorNumber} {b.pickup.street}, {b.pickup.area}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-slate-900">
                          {b.stops.map((s) => s.name.split(' ')[0]).join(' → ')}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono">
                          {b.totalDays} Days · {b.totalDistanceKm} km
                        </div>
                      </td>

                      <td className="p-3 font-medium text-slate-800">
                        {b.vehicle.models}
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-900">
                        ₹{b.totalFare.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3 font-mono font-bold text-amber-700">
                        {b.pickupOtp}
                      </td>

                      <td className="p-3">
                        {b.driver ? (
                          <div className="text-emerald-800">
                            <span className="font-bold block">{b.driver.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">{b.driver.vehicleReg}</span>
                          </div>
                        ) : (
                          <span className="text-orange-600 font-medium">Unassigned</span>
                        )}
                      </td>

                      <td className="p-3">
                        <select
                          onChange={(e) => {
                            if (e.target.value) handleAssignDriver(b.id, e.target.value);
                          }}
                          defaultValue=""
                          className="text-[11px] bg-slate-100 border border-slate-300 rounded px-2 py-1 font-medium text-slate-800"
                        >
                          <option value="">Assign Chauffeur...</option>
                          {drivers.filter((d) => d.status === 'Onboarding Completed' || d.status === 'Approved').map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.fullName} ({d.assignedRating || 4.8}★)
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: Driver Recruitment & Verification */}
        {adminSection === 'drivers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Driver Applications & Document Audit
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Filter Status:</span>
                  <select
                    value={driverFilter}
                    onChange={(e) => setDriverFilter(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="all">All Applications</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Documents Under Review">Documents Under Review</option>
                    <option value="Interview / Assessment">Interview / Assessment</option>
                    <option value="Approved">Approved</option>
                    <option value="Onboarding Completed">Onboarding Completed</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">App Number & Name</th>
                      <th className="p-3">Path & Vehicle</th>
                      <th className="p-3">License & Expiry</th>
                      <th className="p-3">Experience</th>
                      <th className="p-3">Preferred Compensation</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDrivers.map((drv) => (
                      <tr key={drv.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono">
                          <div className="font-bold text-slate-900">{drv.fullName}</div>
                          <div className="text-slate-400 text-[10px]">{drv.applicationNumber} · {drv.phone}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-medium text-slate-800 capitalize">
                            {drv.registrationPath === 'own_vehicle' ? 'Own Vehicle' : 'Fleet Chauffeur'}
                          </span>
                          {drv.vehicleDetails && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              {drv.vehicleDetails.model} ({drv.vehicleDetails.regNumber})
                            </div>
                          )}
                        </td>

                        <td className="p-3 font-mono text-slate-800">
                          <div>{drv.licenseNumber}</div>
                          <div className="text-[10px] text-slate-400">Exp: {drv.licenseExpiry}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-slate-900">{drv.experienceYears} Yrs Total</span>
                          <div className="text-[10px] text-slate-400">{drv.outstationExperienceYears} Yrs Highway</div>
                        </td>

                        <td className="p-3 font-medium text-slate-700">
                          {drv.compensationPreference}
                        </td>

                        <td className="p-3">
                          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {drv.status}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => setSelectedDriverForAction(drv)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800"
                          >
                            Review / Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for Reviewing Driver Application */}
            {selectedDriverForAction && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-base">
                      Recruitment Action: {selectedDriverForAction.fullName}
                    </h4>
                    <button
                      onClick={() => setSelectedDriverForAction(null)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div>
                      <span className="text-slate-400 block">License & Badges:</span>
                      <strong className="text-slate-800 font-mono">
                        {selectedDriverForAction.licenseNumber} ({selectedDriverForAction.hasCommercialBadge ? 'Commercial Badge Verified' : 'Standard DL'})
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Residential Address:</span>
                      <span className="text-slate-700">{selectedDriverForAction.residentialAddress || 'Chennai'}</span>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Admin Audit Notes / Feedback:
                      </label>
                      <input
                        type="text"
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        placeholder="e.g. Verified license on Parivahan portal. Ready for road test."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => handleUpdateStatus(selectedDriverForAction.id, 'Interview / Assessment')}
                      className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700"
                    >
                      Schedule Assessment
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedDriverForAction.id, 'Approved')}
                      className="px-3 py-1.5 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800"
                    >
                      Approve Driver
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedDriverForAction.id, 'Onboarding Completed')}
                      className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
                    >
                      Complete Onboarding
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: Vehicle Rates & Fleet */}
        {adminSection === 'fleet' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Fleet Rates & Driver Allowance Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Official rates per km, minimum billable km rules, and driver daily/night halt allowances.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              {VEHICLE_FLEET.map((v) => (
                <div key={v.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm font-sans">{v.category}</span>
                    <span className="text-teal-700 font-bold">₹{v.ratePerKm}/km</span>
                  </div>

                  <div className="text-slate-600 font-sans">{v.models}</div>

                  <div className="pt-2 border-t border-slate-200 text-slate-500 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Min Billable:</span>
                      <span className="text-slate-900">{v.minKmPerDay} km/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver Day Allowance:</span>
                      <span className="text-slate-900">₹{v.driverAllowancePerDay}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night Halt:</span>
                      <span className="text-slate-900">₹{v.nightHaltCharge}/night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: 16-Hour Driving Safety Audit */}
        {adminSection === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1 font-sans">
              16-Hour Maximum Driving Safety & Welfare Compliance Log
            </h3>
            <p className="text-slate-500 mb-6">
              All routes are strictly validated. Any automated booking exceeding 16 continuous driving hours per day is flagged and segmented.
            </p>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
                <span>Route: Chennai → Ooty (10.5 hrs drive)</span>
                <span className="font-bold text-emerald-700">COMPLIANT (&le; 16h limit)</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
                <span>Route: Chennai → Pondicherry (3.5 hrs drive)</span>
                <span className="font-bold text-emerald-700">COMPLIANT (&le; 16h limit)</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
                <span>Route: Chennai → Tirupati (3.5 hrs drive)</span>
                <span className="font-bold text-emerald-700">COMPLIANT (&le; 16h limit)</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
                <span>Route: Chennai → Kanyakumari (12.5 hrs drive)</span>
                <span className="font-bold text-emerald-700">COMPLIANT (Recommended halt: Madurai)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
