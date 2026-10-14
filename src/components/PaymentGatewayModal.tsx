import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Wallet,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { PaymentTransaction } from '../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  amountToPay: number;
  paymentType: 'advance' | 'balance' | 'full' | 'doorstep_cash';
  customerName: string;
  customerPhone: string;
  onPaymentSuccess: (txn: PaymentTransaction) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  bookingRef,
  amountToPay,
  paymentType,
  customerName,
  customerPhone,
  onPaymentSuccess
}) => {
  const [activeMethod, setActiveMethod] = useState<'upi' | 'card' | 'netbanking' | 'doorstep'>('upi');

  // UPI state
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GooglePay' | 'PhonePe' | 'Paytm' | 'CRED'>('GooglePay');
  const [upiWaitingApproval, setUpiWaitingApproval] = useState(false);

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8921 4452 1098');
  const [cardHolder, setCardHolder] = useState(customerName || 'Sundaram Ramachandran');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('482');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('7492');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [lastTxn, setLastTxn] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExecutePayment = (overrideMethod?: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      const txnRef = `TXN-MMTT-${Math.floor(100000 + Math.random() * 900000)}`;
      const methodLabel =
        overrideMethod === 'Doorstep' || activeMethod === 'doorstep'
          ? 'Cash at Doorstep'
          : activeMethod === 'upi'
          ? 'UPI'
          : activeMethod === 'card'
          ? 'Card'
          : 'NetBanking';

      const txn: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        bookingRef,
        amount: amountToPay,
        type: paymentType,
        method: methodLabel as any,
        upiProvider: activeMethod === 'upi' ? (selectedUpiApp as any) : undefined,
        cardLast4: activeMethod === 'card' ? cardNumber.slice(-4) : undefined,
        bankName: activeMethod === 'netbanking' ? selectedBank : undefined,
        status: 'success',
        timestamp: new Date().toISOString(),
        transactionRef: txnRef
      };

      setIsProcessing(false);
      setShowOtpScreen(false);
      setPaymentDone(true);
      setLastTxn(txn);

      setTimeout(() => {
        onPaymentSuccess(txn);
      }, 1400);
    }, 900);
  };

  const triggerCardOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpScreen(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              MMTT 256-Bit SSL Secure Payment Gateway
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Pay ₹{amountToPay.toLocaleString('en-IN')}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentDone && lastTxn ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Ref: <strong className="font-mono text-slate-800">{lastTxn.transactionRef}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs font-mono space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold text-slate-900">₹{amountToPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="capitalize">{lastTxn.method} {lastTxn.upiProvider ? `(${lastTxn.upiProvider})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Reference:</span>
                <span>{bookingRef}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                <span>Receipt Status:</span>
                <span>Verified</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Updating your booking manifest and voucher...
            </p>
          </div>
        ) : showOtpScreen ? (
          /* 3D Secure OTP Simulation Screen */
          <div className="py-6 space-y-5">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Bank 3D Secure Verification</span>
                <span className="text-teal-700 font-mono font-bold">RuPay / Visa</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                A one-time passcode has been sent to your registered mobile number ending with <strong>{customerPhone.slice(-4) || '2345'}</strong>.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Enter 4-Digit Bank OTP
              </label>
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                maxLength={6}
                placeholder="7492"
                className="w-full text-center text-2xl font-mono font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-400 block text-center mt-1">
                Demo Test OTP: 7492
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOtpScreen(false)}
                className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleExecutePayment()}
                disabled={isProcessing}
                className="w-2/3 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Authorizing Bank...
                  </>
                ) : (
                  <>Authorize & Confirm Payment</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {/* Payment Context Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Payment for: <strong className="text-slate-900">{bookingRef}</strong> ({paymentType === 'advance' ? '20% Advance Token' : paymentType === 'balance' ? 'Trip Balance' : 'Full Journey Total'})
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                ₹{amountToPay.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMethod('upi')}
                className={`py-2 px-1 text-center rounded-lg transition-all ${
                  activeMethod === 'upi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setActiveMethod('card')}
                className={`py-2 px-1 text-center rounded-lg transition-all ${
                  activeMethod === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setActiveMethod('netbanking')}
                className={`py-2 px-1 text-center rounded-lg transition-all ${
                  activeMethod === 'netbanking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NetBanking
              </button>
              <button
                type="button"
                onClick={() => setActiveMethod('doorstep')}
                className={`py-2 px-1 text-center rounded-lg transition-all ${
                  activeMethod === 'doorstep' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                At Doorstep
              </button>
            </div>

            {/* TAB 1: UPI / QR Code */}
            {activeMethod === 'upi' && (
              <div className="space-y-4 text-xs">
                {/* Instant QR Code Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center shrink-0">
                      <QrCode className="w-16 h-16 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Scan with Any UPI App</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Google Pay · PhonePe · Paytm · BHIM · CRED
                      </p>
                      <div className="mt-1 text-teal-700 font-mono text-[11px]">
                        VPA: mmtt.trips@icici
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExecutePayment('UPI')}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl whitespace-nowrap text-xs shadow-xs"
                  >
                    {isProcessing ? 'Verifying...' : 'Simulate UPI QR Scan'}
                  </button>
                </div>

                {/* Popular App Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Or Pay Directly via Installed App:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'GooglePay', label: 'Google Pay' },
                      { name: 'PhonePe', label: 'PhonePe' },
                      { name: 'Paytm', label: 'Paytm' },
                      { name: 'CRED', label: 'CRED UPI' }
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.name as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedUpiApp === app.name
                            ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UPI ID VPA input */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Or Enter Your UPI ID (VPA):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@okhdfcbank or name@upi"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleExecutePayment('UPI')}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Request Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Credit / Debit Card */}
            {activeMethod === 'card' && (
              <form onSubmit={triggerCardOtp} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Card Number (Visa / MasterCard / RuPay)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4532 8921 4452 1098"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold tracking-wider focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Sundaram Ramachandran"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/29"
                      maxLength={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-center"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      CVV / Security Code
                    </label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="482"
                      maxLength={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="mt-3 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Connecting to Bank...' : `Proceed to 3D Secure Verification (₹${amountToPay.toLocaleString('en-IN')})`}
                </button>
              </form>
            )}

            {/* TAB 3: Net Banking */}
            {activeMethod === 'netbanking' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Select Your Bank:
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'State Bank of India',
                      'HDFC Bank',
                      'ICICI Bank',
                      'Axis Bank',
                      'Canara Bank',
                      'Indian Bank'
                    ].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedBank === bank
                            ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5 mb-1 opacity-70" />
                        <span className="truncate block">{bank}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExecutePayment('NetBanking')}
                  disabled={isProcessing}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Redirecting to {selectedBank}...
                    </>
                  ) : (
                    <>Pay ₹{amountToPay.toLocaleString('en-IN')} via {selectedBank}</>
                  )}
                </button>
              </div>
            )}

            {/* TAB 4: Pay at Doorstep */}
            {activeMethod === 'doorstep' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Pay at Chennai Doorstep on Departure
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    You can pay the chauffeur directly when the tourist vehicle arrives at your residence in Chennai.
                    Inspect the vehicle, verify the commercial yellow plate, and exchange the 4-digit pickup OTP before handing over cash or scanning the driver's UPI QR code.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Payable at Doorstep:</span>
                    <strong className="text-slate-900">₹{amountToPay.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Modes Accepted by Driver:</span>
                    <span>Cash / GPay / PhonePe / Paytm</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExecutePayment('Doorstep')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Confirm Doorstep Payment Option
                </button>
              </div>
            )}

            {/* Footer trust badge */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                RBI & NPCI Compliant Payment System
              </span>
              <span>MMTT GSTIN: 33AAACM1984Q1Z2</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
