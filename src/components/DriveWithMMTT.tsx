import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  FileCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  UserCheck,
  Briefcase,
  ChevronRight,
  Phone,
  Wallet,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { DriverApplication } from '../types';
import { getStoredDrivers, saveDriverApplication } from '../utils/storage';

interface DriveWithMMTTProps {
  onBackToCustomerView?: () => void;
}

export const DriveWithMMTT: React.FC<DriveWithMMTTProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'status' | 'dashboard'>('overview');
  const [registrationPath, setRegistrationPath] = useState<'own_vehicle' | 'without_vehicle'>('own_vehicle');

  // Application form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Chennai');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [preferredAreas, setPreferredAreas] = useState('Anna Nagar, Guindy, Airport, Koyambedu');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');

  // Driving credentials
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2032-12-31');
  const [experienceYears, setExperienceYears] = useState(7);
  const [outstationExperienceYears, setOutstationExperienceYears] = useState(5);
  const [languages, setLanguages] = useState('Tamil, English');
  const [hasCommercialBadge, setHasCommercialBadge] = useState(true);
  const [highwayNav, setHighwayNav] = useState<'Expert' | 'Intermediate' | 'Basic'>('Expert');

  // Preferences
  const [employmentPref, setEmploymentPref] = useState<'Full-Time' | 'Part-Time' | 'Contract' | 'Trip-Based'>('Full-Time');
  const [compPref, setCompPref] = useState<'Fixed Salary' | 'Per-Trip' | 'Per-Kilometre' | 'Revenue Share'>('Per-Kilometre');
  const [willingOvernight, setWillingOvernight] = useState(true);

  // Vehicle details (for own vehicle)
  const [vehicleModel, setVehicleModel] = useState('Maruti Suzuki Ertiga / Innova');
  const [vehicleReg, setVehicleReg] = useState('TN 01 AZ 9988');
  const [vehicleYear, setVehicleYear] = useState(2023);
  const [seatingCapacity, setSeatingCapacity] = useState(6);
  const [insuranceExpiry, setInsuranceExpiry] = useState('2027-06-30');
  const [fcExpiry, setFcExpiry] = useState('2028-04-15');

  // Submission feedback
  const [submittedApp, setSubmittedApp] = useState<DriverApplication | null>(null);
  const [lookupAppNumber, setLookupAppNumber] = useState('');
  const [lookupResult, setLookupResult] = useState<DriverApplication | null>(null);

  // Dashboard driver selection
  const driversList = getStoredDrivers();
  const [selectedDashboardDriverId, setSelectedDashboardDriverId] = useState<string>(
    driversList[0]?.id || ''
  );
  const activeDashboardDriver =
    driversList.find((d) => d.id === selectedDashboardDriverId) || driversList[0];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !licenseNumber) {
      alert('Please fill in required fields: Full Name, Phone, and License Number.');
      return;
    }

    const appNumber = `MMTT-DRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApplication: DriverApplication = {
      id: `drv-${Date.now()}`,
      applicationNumber: appNumber,
      submittedAt: new Date().toISOString(),
      fullName,
      phone,
      email,
      residentialAddress,
      currentCity: city,
      preferredAreas: preferredAreas.split(',').map((s) => s.trim()),
      emergencyContact: {
        name: emergencyName || 'Family Member',
        relation: emergencyRelation,
        phone: emergencyPhone || phone
      },
      licenseNumber,
      licenseExpiry,
      licenseClasses: ['LMV-TR', 'TRANS'],
      experienceYears: Number(experienceYears),
      outstationExperienceYears: Number(outstationExperienceYears),
      languages: languages.split(',').map((s) => s.trim()),
      highwayNavigationProficiency: highwayNav,
      hasCommercialBadge,
      employmentPreference: employmentPref,
      compensationPreference: compPref,
      willingOvernight,
      registrationPath,
      vehicleDetails:
        registrationPath === 'own_vehicle'
          ? {
              model: vehicleModel,
              category: 'MUV / SUV',
              regNumber: vehicleReg,
              year: Number(vehicleYear),
              seatingCapacity: Number(seatingCapacity),
              insuranceExpiry,
              fcExpiry,
              touristPermitExpiry: '2028-12-31',
              hasFastag: true
            }
          : undefined,
      status: 'Application Submitted',
      completedTripsCount: 0,
      totalEarnings: 0,
      settlementPending: 0,
      adminNotes: 'Application received via online portal. Ready for document verification.'
    };

    saveDriverApplication(newApplication);
    setSubmittedApp(newApplication);
    setActiveTab('status');
  };

  const handleLookup = () => {
    const list = getStoredDrivers();
    const found = list.find(
      (d) =>
        d.applicationNumber.toLowerCase() === lookupAppNumber.trim().toLowerCase() ||
        d.phone.replace(/\s+/g, '') === lookupAppNumber.replace(/\s+/g, '')
    );
    setLookupResult(found || null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs for Driver Section (Functional buttons, single-line) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recruitment Overview
            </button>
            <button
              onClick={() => {
                setRegistrationPath('own_vehicle');
                setActiveTab('apply');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'apply' && registrationPath === 'own_vehicle'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Your Vehicle
            </button>
            <button
              onClick={() => {
                setRegistrationPath('without_vehicle');
                setActiveTab('apply');
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'apply' && registrationPath === 'without_vehicle'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Apply Without Vehicle
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'status'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Check Application Status
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Existing Driver Portal
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Recruitment Desk: <strong className="text-slate-900">044-2841-8800 (Ext. 2)</strong>
          </div>
        </div>

        {/* VIEW 1: Recruitment Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Recruitment Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 hidden lg:block">
                <img
                  src="/src/assets/images/mmtt_driver_recruitment_1791998103361.jpg"
                  alt="MMTT Professional Driver"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
              </div>

              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-400 uppercase mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  Official Manish Mart Tours & Travels Driver Careers
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Drive with MMTT — Turn Every Journey into an Opportunity.
                </h1>

                <p className="mt-4 text-base text-slate-300 leading-relaxed">
                  Join Manish Mart Tours and Travels as a professional driver. Access travel opportunities, choose suitable assignments, and grow with a customer-focused travel company.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setRegistrationPath('own_vehicle');
                      setActiveTab('apply');
                    }}
                    className="px-5 py-3 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Register Your Vehicle (Own Car)
                  </button>

                  <button
                    onClick={() => {
                      setRegistrationPath('without_vehicle');
                      setActiveTab('apply');
                    }}
                    className="px-5 py-3 text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    Apply as Driver (MMTT Fleet)
                  </button>

                  <button
                    onClick={() => setActiveTab('status')}
                    className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
                  >
                    Check Application Status
                  </button>
                </div>
              </div>
            </div>

            {/* Two Registration Paths Explained */}
            <div>
              <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
                Flexible Partnership Model
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
                Two Driver Registration Paths
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                    <Car className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">1. Driver with Own Vehicle</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Own an Ertiga, Dzire, Innova, or Tempo Traveller with a valid commercial yellow plate and tourist permit? Register your vehicle on MMTT's dispatch network. Enjoy steady long-distance bookings with upfront settlements.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Transparent per-km compensation & fuel policies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Direct driver night allowance & toll reimbursements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Doorstep pickup assignments tailored to your residential area</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      setRegistrationPath('own_vehicle');
                      setActiveTab('apply');
                    }}
                    className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Register Vehicle & Apply
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">2. Driver Without Own Vehicle</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Have 5+ years of highway driving experience with an LMV-TR badge? Apply to captain MMTT's company-owned and partner tourist fleet. Subject to fleet availability and driving assessment approval.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Drive modern Innova Crysta, Carens, and Tempo Travellers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Strict 16-hour driving limit with guaranteed rest periods</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Choice of fixed salary, per-trip payout, or contract terms</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      setRegistrationPath('without_vehicle');
                      setActiveTab('apply');
                    }}
                    className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply for Fleet Driver Role
                  </button>
                </div>
              </div>
            </div>

            {/* Document Verification & Onboarding Workflow */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
                Recruitment Workflow
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
                7-Step Transparent Onboarding Process
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-mono font-bold text-slate-400 mb-1">Step 01</div>
                  <div className="font-bold text-slate-900 mb-1">Application Submitted</div>
                  <p className="text-slate-600">Submit online credentials, experience summary, and emergency contact details.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-mono font-bold text-slate-400 mb-1">Step 02</div>
                  <div className="font-bold text-slate-900 mb-1">Documents Review</div>
                  <p className="text-slate-600">Admin reviews commercial license, badge, police verification, and vehicle RC/FC/Insurance.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-mono font-bold text-slate-400 mb-1">Step 03</div>
                  <div className="font-bold text-slate-900 mb-1">Driving Assessment</div>
                  <p className="text-slate-600">In-person road driving evaluation, GPS navigation test, and customer etiquette briefing in Koyambedu.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-mono font-bold text-slate-400 mb-1">Step 04</div>
                  <div className="font-bold text-slate-900 mb-1">Trip Assignment Ready</div>
                  <p className="text-slate-600">Official onboarding badge issued. Driver becomes eligible for doorstep assignments.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Application Form */}
        {activeTab === 'apply' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
                Official Application Form
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                {registrationPath === 'own_vehicle'
                  ? 'Register Vehicle & Driver Partnership'
                  : 'Apply as Professional Fleet Chauffeur'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Please provide accurate personal credentials, commercial licenses, and vehicle documents.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-6 text-xs">
              {/* Section 1: Personal Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  1. Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. M. Saravanan"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Phone (Primary) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94440 00000"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="saravanan.tours@gmail.com"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Current Base City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Residential Address (Chennai)</label>
                  <input
                    type="text"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="Door No, Street, Area, Chennai PIN Code"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Preferred Pickup Hubs / Areas</label>
                  <input
                    type="text"
                    value={preferredAreas}
                    onChange={(e) => setPreferredAreas(e.target.value)}
                    placeholder="Anna Nagar, Tambaram, Airport, Koyambedu, Porur"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Section 2: Driving Credentials */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  2. Commercial Driving Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Driving License Number *</label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. TN-09-2015-0012345"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">License Validity Date</label>
                    <input
                      type="date"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Total Driving Exp (Years)</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Outstation Highway Exp</label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={outstationExperienceYears}
                      onChange={(e) => setOutstationExperienceYears(Number(e.target.value))}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">GPS Navigation</label>
                    <select
                      value={highwayNav}
                      onChange={(e) => setHighwayNav(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      <option value="Expert">Expert (Google Maps / Fastag)</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCommercialBadge}
                      onChange={(e) => setHasCommercialBadge(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="font-medium text-slate-700">Commercial Passenger Transport Badge (Badge No. available)</span>
                  </label>
                </div>
              </div>

              {/* Section 3: Preferences & Compensation */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  3. Engagement & Compensation Preference
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Engagement Type</label>
                    <select
                      value={employmentPref}
                      onChange={(e) => setEmploymentPref(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      <option value="Full-Time">Full-Time (Dedicated Fleet)</option>
                      <option value="Trip-Based">Trip-Based Outstation</option>
                      <option value="Contract">Seasonal / Weekend Contract</option>
                      <option value="Part-Time">Part-Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Payment Model</label>
                    <select
                      value={compPref}
                      onChange={(e) => setCompPref(e.target.value as any)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      <option value="Per-Kilometre">Per-Kilometre Compensation</option>
                      <option value="Per-Trip">Per-Trip Fixed Payout</option>
                      <option value="Fixed Salary">Monthly Fixed Salary</option>
                      <option value="Revenue Share">Agreed Revenue Share</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={willingOvernight}
                      onChange={(e) => setWillingOvernight(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="font-medium text-slate-700">Willing to do outstation overnight stays (Driver allowance provided)</span>
                  </label>
                </div>
              </div>

              {/* Section 4: Vehicle Information (Mandatory ONLY for own_vehicle) */}
              {registrationPath === 'own_vehicle' && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    4. Vehicle Information & Permits
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Vehicle Model & Make *</label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g. Toyota Innova Crysta / Maruti Ertiga"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Vehicle Registration No. (Yellow Plate) *</label>
                      <input
                        type="text"
                        value={vehicleReg}
                        onChange={(e) => setVehicleReg(e.target.value)}
                        placeholder="TN 01 AZ 1234"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Manufacturing Year</label>
                      <input
                        type="number"
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(Number(e.target.value))}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Seating Capacity</label>
                      <select
                        value={seatingCapacity}
                        onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      >
                        <option value={4}>4 Seater (Sedan / Hatch)</option>
                        <option value={6}>6 Seater (Ertiga / Carens)</option>
                        <option value={7}>7 Seater (Innova Crysta)</option>
                        <option value={12}>12 Seater (Tempo Traveller)</option>
                        <option value={17}>17 Seater (Tempo Traveller)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Insurance Validity</label>
                      <input
                        type="date"
                        value={insuranceExpiry}
                        onChange={(e) => setInsuranceExpiry(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  By submitting, you agree to MMTT's Driver Safety and 16-Hour Maximum Driving Code.
                </span>

                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Submit Driver Application
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: Check Application Status */}
        {activeTab === 'status' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
                Recruitment Verification Status
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Track Your Driver Onboarding
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your application reference code (e.g. MMTT-DRV-1001) or registered phone number.
              </p>

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={lookupAppNumber}
                  onChange={(e) => setLookupAppNumber(e.target.value)}
                  placeholder="Enter MMTT-DRV-xxxx or Mobile No"
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Search
                </button>
              </div>

              {submittedApp && !lookupResult && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Application Submitted Successfully!
                  </div>
                  <p className="mt-1">
                    Your reference number is <strong className="font-mono">{submittedApp.applicationNumber}</strong>.
                    Our recruitment team will review your driving license and contact you within 24 hours.
                  </p>
                </div>
              )}

              {lookupResult && (
                <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-slate-400 font-mono text-[11px] block">Application ID</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">{lookupResult.applicationNumber}</span>
                    </div>

                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg text-xs">
                      {lookupResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block">Applicant Name:</span>
                      <strong className="text-slate-800">{lookupResult.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Path:</span>
                      <strong className="text-slate-800 capitalize">
                        {lookupResult.registrationPath === 'own_vehicle' ? 'Own Vehicle' : 'MMTT Fleet Driver'}
                      </strong>
                    </div>
                  </div>

                  {lookupResult.interviewScheduledDate && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                      <strong>Driving Assessment Scheduled:</strong> {lookupResult.interviewScheduledDate} at Koyambedu Dispatch Hub.
                    </div>
                  )}

                  {lookupResult.adminNotes && (
                    <div className="text-slate-600 italic">
                      Admin Note: {lookupResult.adminNotes}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: Approved Driver Dashboard */}
        {activeTab === 'dashboard' && activeDashboardDriver && (
          <div className="space-y-6">
            {/* Driver Profile Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src="/src/assets/images/mmtt_driver_recruitment_1791998103361.jpg"
                      alt={activeDashboardDriver.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{activeDashboardDriver.fullName}</h3>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Verified Chauffeur
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      Badge: {activeDashboardDriver.licenseNumber} · {activeDashboardDriver.assignedRating || 4.9}★ Rating
                    </div>
                  </div>
                </div>

                {/* Driver Selector for demo testing */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-500">Switch Driver Profile:</span>
                  <select
                    value={activeDashboardDriver.id}
                    onChange={(e) => setSelectedDashboardDriverId(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  >
                    {driversList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName} ({d.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Financial & Trip Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs font-mono">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[11px] font-sans">Total Earnings</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{activeDashboardDriver.totalEarnings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[11px] font-sans">Pending Settlement</div>
                  <div className="text-xl font-bold text-orange-600 mt-1">
                    ₹{activeDashboardDriver.settlementPending.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[11px] font-sans">Completed Outstation Trips</div>
                  <div className="text-xl font-bold text-teal-700 mt-1">
                    {activeDashboardDriver.completedTripsCount} Trips
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[11px] font-sans">Daily Driving Cap</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    16h Safe Max
                  </div>
                </div>
              </div>

              {/* Driver Financial Settlements & Bank Hub */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Earnings, Bank Account & Instant Settlements
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transparent payout management. Daily allowances, outstation night halt, and Fastag toll reimbursements.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (activeDashboardDriver.settlementPending <= 0) {
                        alert('No pending settlements at this time.');
                        return;
                      }
                      alert(
                        `Settlement request for ₹${activeDashboardDriver.settlementPending.toLocaleString('en-IN')} submitted! MMTT Finance will process IMPS payout to your linked bank account within 2 hours.`
                      );
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all self-start sm:self-auto"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    Request Instant Settlement (₹{activeDashboardDriver.settlementPending.toLocaleString('en-IN')})
                  </button>
                </div>

                {/* Bank / UPI Details Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Registered Bank Account (For Direct IMPS Payouts)
                    </span>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Bank Name:</span>
                        <strong className="text-slate-800">State Bank of India</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                        <strong className="text-slate-800">SBIN0001842</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Account Number:</span>
                        <strong className="text-slate-800">38940192841</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">UPI Handle:</span>
                        <strong className="text-teal-700">senthil.tourist@okaxis</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Transparent Compensation Structure
                    </span>
                    <ul className="space-y-1.5 text-slate-600">
                      <li className="flex items-center justify-between">
                        <span>Day Allowance:</span>
                        <strong className="text-slate-900 font-mono">₹500 / day</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Outstation Night Halt:</span>
                        <strong className="text-slate-900 font-mono">₹400 / night</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Toll Reimbursement:</span>
                        <strong className="text-emerald-700 font-semibold font-mono">100% via Fastag</strong>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Payment Timeline:</span>
                        <span className="font-medium text-slate-800">Same-Day Post Trip Completion</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Settlement History Table */}
                <div className="mt-6">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Recent Payout Disbursals
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Reference ID</th>
                          <th className="p-2.5">Payment Mode</th>
                          <th className="p-2.5 text-right">Amount Disbursed</th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="p-2.5 text-slate-500 text-[11px]">2026-10-10</td>
                          <td className="p-2.5 font-bold text-slate-900">SETTLE-MMTT-9842</td>
                          <td className="p-2.5 font-sans">Bank IMPS (SBI)</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">₹14,500</td>
                          <td className="p-2.5 text-center">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              DISBURSED
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-slate-500 text-[11px]">2026-10-04</td>
                          <td className="p-2.5 font-bold text-slate-900">SETTLE-MMTT-9102</td>
                          <td className="p-2.5 font-sans">Instant UPI (Axis)</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">₹8,900</td>
                          <td className="p-2.5 text-center">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              DISBURSED
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Active Assigned Trip Schedule */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Current Assigned Trip Assignment
                </h4>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="font-mono font-bold text-slate-800">Booking: MMTT-CH-8419 (Ooty & Coonoor)</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      Ready for Doorstep Pickup
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Doorstep Customer Address:</span>
                      <strong className="text-slate-900">
                        Plot 42, Flat 2B, 12th Main Road, Shanthi Colony, Anna Nagar West, Chennai 600040
                      </strong>
                      <div className="text-[11px] text-slate-500 mt-1">Customer: Sundaram Ramachandran (+91 98401 23456)</div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Trip Details & Safety:</span>
                      <div>Passengers: 5 Adults · 4 Suitcases</div>
                      <div>Vehicle: Maruti Ertiga ZXi+ (AC)</div>
                      <div className="text-teal-700 font-semibold mt-1">
                        Driver Day Allowance: ₹500/day · Night Halt: ₹400/night
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
