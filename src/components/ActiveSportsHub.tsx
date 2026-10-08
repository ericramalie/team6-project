import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bot, CheckCircle2, Flame, Dumbbell, ShieldCheck, Tag, Gift, QrCode } from 'lucide-react';

interface ActiveSportsHubProps {
  onSelectMealForNutrition?: (mealName: string) => void;
}

export const ActiveSportsHub: React.FC<ActiveSportsHubProps> = ({ onSelectMealForNutrition }) => {
  // Court Booking State
  const [sport, setSport] = useState('Badminton');
  const [venue, setVenue] = useState('ActiveSG Clementi Sports Centre');
  const [date, setDate] = useState('2026-10-15');
  const [timeSlot, setTimeSlot] = useState('19:00 - 20:00');
  const [courtBooked, setCourtBooked] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);

  // Autobooking Bot Preset
  const [botActive, setBotActive] = useState(false);
  const [botDaysAdvance, setBotDaysAdvance] = useState(14);
  const [botTargetTime, setBotTargetTime] = useState('07:00:00 AM');
  const [botPreferredCourt, setBotPreferredCourt] = useState('Court 3 or 4 (Aircon)');

  // Daily Nutrition & Macro Calculator
  const [calcAge, setCalcAge] = useState(28);
  const [calcWeight, setCalcWeight] = useState(72);
  const [calcGoal, setCalcGoal] = useState<'hypertrophy' | 'fatloss' | 'endurance'>('hypertrophy');
  const [calcSportType, setCalcSportType] = useState('Racket Sports / HIIT');
  const [calculatedPlan, setCalculatedPlan] = useState<any>(null);

  // Vending Locker Reservation
  const [selectedVendingHub, setSelectedVendingHub] = useState('ActiveSG Clementi Pod #1');
  const [selectedMealType, setSelectedMealType] = useState('Hot Fresh Protein Bento (Chicken & Rice)');
  const [reservationPin, setReservationPin] = useState<string | null>(null);

  // First Download Voucher
  const [voucherClaimed, setVoucherClaimed] = useState(false);

  function handleCourtBooking(e: React.FormEvent) {
    e.preventDefault();
    const conf = {
      id: `ASG-${Math.floor(100000 + Math.random() * 900000)}`,
      sport,
      venue,
      date,
      timeSlot,
      status: 'CONFIRMED',
      syncedWithMcp: true
    };
    setBookingConfirmation(conf);
    setCourtBooked(true);
  }

  function handleCalculateMacros(e: React.FormEvent) {
    e.preventDefault();
    // Harris-Benedict & athletic multipliers
    const bmr = 10 * calcWeight + 6.25 * 175 - 5 * calcAge + 5;
    let multiplier = 1.55;
    let proteinFactor = 2.0; // g/kg
    let carbFactor = 4.0;

    if (calcGoal === 'hypertrophy') {
      multiplier = 1.65;
      proteinFactor = 2.2;
      carbFactor = 4.5;
    } else if (calcGoal === 'fatloss') {
      multiplier = 1.4;
      proteinFactor = 2.4;
      carbFactor = 3.0;
    } else {
      multiplier = 1.75;
      proteinFactor = 1.8;
      carbFactor = 6.0;
    }

    const tdee = Math.round(bmr * multiplier);
    const targetCalories = calcGoal === 'hypertrophy' ? tdee + 300 : calcGoal === 'fatloss' ? tdee - 450 : tdee;
    const proteinGrams = Math.round(calcWeight * proteinFactor);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

    setCalculatedPlan({
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      waterLitres: (calcWeight * 0.045).toFixed(1),
      preWorkoutMeal: 'Hummus & Whole Grain Flatbread (2h prior)',
      postWorkoutMeal: 'ActiveFuel Chicken Breast & Quinoa Bowl (<45m)'
    });
  }

  function handleReserveVendingLocker() {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setReservationPin(pin);
  }

  return (
    <div className="space-y-10">
      {/* Visual Header */}
      <div className="relative border-2 border-neutral-700 bg-neutral-950 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="/src/assets/images/istock_badminton_court.jpg"
            alt="ActiveSG Badminton Sports Arena Court (iStockphoto)"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-4xl">
          <div className="inline-block px-3 py-1 bg-lime-400 text-black text-xs font-black uppercase tracking-widest mb-3">
            ACTIVESG INTEGRATION & SMART VENDING
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
            ACTIVESG SPORTS HUB & <span className="text-lime-400">SMART RECOVERY</span> LOCKERS
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed font-medium">
            Book badminton, tennis, and gym sessions with autobooking release bots. Pair your workout intensity with fresh hot and cold recovery meals collected from smart vending lockers across ActiveSG venues.
          </p>

          {/* First Download Promo Banner */}
          <div className="mt-6 p-4 bg-neutral-900 border-2 border-lime-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-lime-400 shrink-0" />
              <div>
                <p className="text-sm font-black uppercase text-white tracking-wide">
                  1st Download Free Sample Food Voucher
                </p>
                <p className="text-xs text-neutral-300">
                  Claim 100% off any post-workout recovery bento at ActiveSG vending pods.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVoucherClaimed(true)}
              className="px-4 py-2 bg-lime-400 text-black font-black uppercase text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white cursor-pointer shrink-0"
            >
              {voucherClaimed ? 'VOUCHER APPLIED' : 'CLAIM VOUCHER'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 1. Court Booking & Autobooking Bot | 2. Smart Vending Lockers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Court Booking Card */}
        <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-700">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-lime-400">
                ONE-STOP BOOKING PLATFORM
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                ActiveSG Sports Booking
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-neutral-800 text-lime-400 font-mono text-xs font-bold border border-neutral-700">
              ActiveSG Certified
            </span>
          </div>

          <form onSubmit={handleCourtBooking} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Sport Type</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
              >
                <option value="Badminton">Badminton (Indoor Hall)</option>
                <option value="Tennis">Tennis (Outdoor / Sheltered)</option>
                <option value="Table Tennis">Table Tennis</option>
                <option value="Squash">Squash Court</option>
                <option value="Basketball">Basketball Court</option>
                <option value="ActiveSG Gym">ActiveSG Gym Session</option>
                <option value="Lap Swimming">ActiveSG Swimming Complex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">ActiveSG Venue</label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
              >
                <option value="ActiveSG Clementi Sports Centre">ActiveSG Clementi Sports Centre</option>
                <option value="ActiveSG Bishan Sports Centre">ActiveSG Bishan Sports Centre</option>
                <option value="Our Tampines Hub">Our Tampines Hub (Sports Hall)</option>
                <option value="ActiveSG Jurong West Sports Centre">ActiveSG Jurong West Sports Centre</option>
                <option value="ActiveSG Bedok Sports Hall">ActiveSG Bedok Sports Hall</option>
                <option value="ActiveSG Toa Payoh Sports Centre">ActiveSG Toa Payoh Sports Centre</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
                >
                  <option value="07:00 - 08:00">07:00 - 08:00 (Morning)</option>
                  <option value="12:00 - 13:00">12:00 - 13:00 (Lunch)</option>
                  <option value="18:00 - 19:00">18:00 - 19:00 (Peak)</option>
                  <option value="19:00 - 20:00">19:00 - 20:00 (Prime)</option>
                  <option value="20:00 - 21:00">20:00 - 21:00 (Prime)</option>
                  <option value="21:00 - 22:00">21:00 - 22:00 (Late)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-lime-400 text-black font-black uppercase tracking-wider text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              BOOK COURT & SCHEDULE RECOVERY MEAL
            </button>
          </form>

          {courtBooked && bookingConfirmation && (
            <div className="p-4 bg-black border-2 border-lime-400 space-y-2">
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Court Reserved: {bookingConfirmation.id}</span>
              </div>
              <p className="text-xs text-white">
                {bookingConfirmation.sport} @ {bookingConfirmation.venue} on {bookingConfirmation.date} ({bookingConfirmation.timeSlot})
              </p>
              <p className="text-[11px] text-neutral-400">
                A locker pickup slot at the venue's smart vending pod has been synchronized.
              </p>
            </div>
          )}

          {/* Autobooking Bot Preset */}
          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-lime-400" />
                <h3 className="text-xs font-black uppercase text-white tracking-wider">
                  Autobooking Bot Presets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBotActive(!botActive)}
                className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase cursor-pointer border ${
                  botActive ? 'bg-lime-400 text-black border-white' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}
              >
                {botActive ? 'BOT ACTIVE' : 'BOT PAUSED'}
              </button>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Auto-fires booking request exactly at 07:00:00 AM on the 14-day advance slot window release.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-neutral-950 border border-neutral-800 text-neutral-300">
                Trigger: <strong className="text-lime-400">{botTargetTime}</strong>
              </div>
              <div className="p-2 bg-neutral-950 border border-neutral-800 text-neutral-300">
                Advance: <strong className="text-lime-400">{botDaysAdvance} Days</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Vending Locker Hub Card */}
        <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-700">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-lime-400">
                HOT & CHILLED COLLECTION PODS
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                ActiveFuel Vending Lockers
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-neutral-800 text-neutral-200 font-mono text-xs font-bold border border-neutral-700">
              Singapore HPB Certified
            </span>
          </div>

          <div className="relative h-44 overflow-hidden border border-neutral-800">
            <img
              src="/src/assets/images/istock_vending_machine.jpg"
              alt="ActiveFuel Smart Vending Dispenser (iStockphoto)"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
              <p className="text-xs font-mono text-lime-400 font-bold uppercase">
                Central Kitchen Daily Restock · Thermal Temperature Controlled
              </p>
              <p className="text-sm font-black text-white uppercase">
                Take-Home Hot & Chilled Recovery Meals
              </p>
            </div>
          </div>

          {/* Vending Hub Selector & Reservation */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Select Vending Pod Location</label>
              <select
                value={selectedVendingHub}
                onChange={(e) => setSelectedVendingHub(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
              >
                <option value="ActiveSG Clementi Pod #1">ActiveSG Clementi Pod #1 (Near Main Sports Hall)</option>
                <option value="ActiveSG Bishan Pod #2">ActiveSG Bishan Pod #2 (Stadium Entrance)</option>
                <option value="Our Tampines Hub Locker #4">Our Tampines Hub Locker #4 (Arena B1)</option>
                <option value="ActiveSG Jurong West Gym Pod">ActiveSG Jurong West Gym Pod (Level 2)</option>
                <option value="ActiveSG Bedok Sports Pod">ActiveSG Bedok Sports Pod (Pool Concourse)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Select Nutritionist-Designed Meal</label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
              >
                <option value="Hot Fresh Protein Bento (Chicken & Rice)">Hot Fresh Protein Bento (46g Protein, Lean Chicken & Brown Rice)</option>
                <option value="Grilled Salmon & Quinoa Anti-Inflammatory Bowl">Grilled Salmon & Quinoa Anti-Inflammatory Bowl (Omega-3s)</option>
                <option value="Greek Yogurt & Berry Recovery Parfait (Chilled)">Greek Yogurt & Berry Recovery Parfait (Chilled Leucine Booster)</option>
                <option value="Whey Isolate Rapid Recovery Shake (Chilled)">Whey Isolate Rapid Recovery Shake (Chilled 30g Protein)</option>
                <option value="High-Electrolyte Hydration Flask">High-Electrolyte Hydration Flask (Tropical Lime Salt)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleReserveVendingLocker}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-lime-400 border-2 border-lime-400 font-black uppercase text-xs tracking-wider cursor-pointer transition-colors"
            >
              GENERATE DISPENSER PICKUP PIN
            </button>
          </div>

          {reservationPin && (
            <div className="p-4 bg-black border-2 border-lime-400 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Dispenser Collection PIN</span>
                <p className="text-2xl font-black font-mono text-lime-400 tracking-widest">{reservationPin}</p>
                <p className="text-[11px] text-neutral-400">Valid at {selectedVendingHub} for 90 minutes.</p>
              </div>
              <div className="w-12 h-12 bg-lime-400 text-black flex items-center justify-center font-bold">
                <QrCode className="w-8 h-8" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Nutritional Needs & Macro Calculator (From Masterprompt / BMC) */}
      <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <span className="text-[10px] font-black tracking-widest uppercase text-lime-400">
            NUTRITIONIST STAT CALCULATOR
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            CALCULATE DAILY NUTRITIONAL & MACRO NEEDS
          </h2>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Calculates your target macros based on age, body weight, sport type, and fitness goal. Tailors post-exercise meals that fit your exact protein and glycogen requirements.
          </p>
        </div>

        <form onSubmit={handleCalculateMacros} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Age (Years)</label>
            <input
              type="number"
              min={12}
              max={99}
              value={calcAge}
              onChange={(e) => setCalcAge(Number(e.target.value))}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:border-lime-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Body Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={250}
              value={calcWeight}
              onChange={(e) => setCalcWeight(Number(e.target.value))}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:border-lime-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Sport / Training</label>
            <select
              value={calcSportType}
              onChange={(e) => setCalcSportType(e.target.value)}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
            >
              <option value="Racket Sports / HIIT">Racket Sports / Court Agility</option>
              <option value="Resistance Training">Gym / Hypertrophy Lifting</option>
              <option value="Endurance Running / Swimming">Endurance Cardio / Swimming</option>
              <option value="General Active Lifestyle">Senior Health / Longevity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Fitness Goal</label>
            <select
              value={calcGoal}
              onChange={(e) => setCalcGoal(e.target.value as any)}
              className="w-full p-2.5 bg-neutral-950 border border-neutral-700 text-white text-xs font-semibold focus:border-lime-400 focus:outline-none"
            >
              <option value="hypertrophy">Muscle Hypertrophy & Strength</option>
              <option value="fatloss">Fat Loss & Conditioning</option>
              <option value="endurance">Endurance & Glycogen Replenishment</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-lime-400 text-black font-black uppercase text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white cursor-pointer"
            >
              CALCULATE TARGET MACROS
            </button>
          </div>
        </form>

        {calculatedPlan && (
          <div className="mt-6 p-6 bg-black border-2 border-lime-400 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-lime-400">
                PERSONALIZED MACRONUTRIENT RECOVERY TARGETS
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Daily Hydration Baseline: <strong className="text-white">{calculatedPlan.waterLitres} L / day</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Daily Calorie Target</span>
                <p className="text-2xl font-black font-mono text-white tabular-nums">{calculatedPlan.calories} kcal</p>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Target Protein</span>
                <p className="text-2xl font-black font-mono text-lime-400 tabular-nums">{calculatedPlan.protein}g</p>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Target Carbs</span>
                <p className="text-2xl font-black font-mono text-amber-400 tabular-nums">{calculatedPlan.carbs}g</p>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Target Fats</span>
                <p className="text-2xl font-black font-mono text-cyan-400 tabular-nums">{calculatedPlan.fat}g</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-neutral-950 border border-neutral-800">
                <span className="font-bold uppercase text-neutral-400">Recommended Pre-Workout Fuel:</span>
                <p className="text-sm font-bold text-white mt-0.5">{calculatedPlan.preWorkoutMeal}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Sustained low-GI carbohydrates to prevent mid-match hypoglycemic dips.</p>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800">
                <span className="font-bold uppercase text-neutral-400">Recommended Post-Workout Recovery:</span>
                <p className="text-sm font-bold text-white mt-0.5">{calculatedPlan.postWorkoutMeal}</p>
                <p className="text-[11px] text-neutral-400 mt-1">High-leucine meal box with electrolyte restoration for optimal muscle protein synthesis.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Partners & Certifications */}
      <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-wrap items-center justify-around gap-6 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span className="font-bold text-neutral-300">Singapore Food Agency (SFA) Standards</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span className="font-bold text-neutral-300">Health Promotion Board (HPB) Guidelines</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span className="font-bold text-neutral-300">ActiveSG Facility Network</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400" />
          <span className="font-bold text-neutral-300">Board Certified Sports Nutritionists</span>
        </div>
      </div>
    </div>
  );
};
