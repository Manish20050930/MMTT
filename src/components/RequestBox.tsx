import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, RefreshCw } from 'lucide-react';
import { parseNaturalLanguageRequest, ParsedTripRequest } from '../utils/itineraryEngine';

interface RequestBoxProps {
  onParsedRequest: (parsed: ParsedTripRequest) => void;
}

export const RequestBox: React.FC<RequestBoxProps> = ({ onParsedRequest }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastParsedSummary, setLastParsedSummary] = useState<ParsedTripRequest | null>(null);

  const samplePrompt =
    'Pick up six people from my home in Chennai. Plan a four-day family trip to Ooty and Coonoor, find clean budget hotels with parking, include sightseeing and vegetarian food stops, and keep the total cost affordable.';

  const handleConvert = (textToParse: string) => {
    if (!textToParse.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const result = parseNaturalLanguageRequest(textToParse);
      setLastParsedSummary(result);
      setIsProcessing(false);
      onParsedRequest(result);
    }, 280);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-xs font-semibold tracking-wider text-teal-700 uppercase mb-1">
            Express Trip Converter
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Tell us where you want to go.
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Type your travel plan in plain everyday words. We will convert it into structured stops, vehicle options, hotel choices, and a 16-hour driving compliant itinerary.
          </p>
        </div>

        <button
          onClick={() => {
            setInputText(samplePrompt);
            handleConvert(samplePrompt);
          }}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          Try Sample Request
        </button>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pick up six people from my home in Chennai. Plan a four-day family trip to Ooty and Coonoor, find clean budget hotels with parking, include sightseeing and vegetarian food stops, and keep the total cost affordable."
          className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-4 pr-32 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
        />

        <div className="absolute right-3 bottom-4 flex items-center gap-2">
          <button
            onClick={() => handleConvert(inputText)}
            disabled={!inputText.trim() || isProcessing}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all ${
              inputText.trim() && !isProcessing
                ? 'bg-slate-900 hover:bg-slate-800 shadow-sm cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Structuring...
              </>
            ) : (
              <>
                Build Trip
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick pill-free tags showing what can be entered */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Understands:</span>
        <span>Passenger counts</span>
        <span aria-hidden="true">·</span>
        <span>Temple & holiday categories</span>
        <span aria-hidden="true">·</span>
        <span>Multi-destination routes</span>
        <span aria-hidden="true">·</span>
        <span>Budget & vegetarian dietary preferences</span>
      </div>

      {lastParsedSummary && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 rounded-xl p-3">
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Structured into parameters:</span>
            <span className="font-semibold text-slate-900">
              {lastParsedSummary.passengers} Passengers
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">
              {lastParsedSummary.days} Days
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">
              {lastParsedSummary.destinations.join(' → ')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize text-slate-700">
              {lastParsedSummary.hotelPreference} Stays
            </span>
          </div>

          <span className="text-slate-500 italic">
            Review below & edit details freely
          </span>
        </div>
      )}
    </div>
  );
};
