/**
 * NutriSafe Demo Dataset
 * All records strictly contain demo data with illustrative values.
 */

export const DEMO_SENTENCE = "Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.";

export const ADDITIVES = [
  {
    id: "E171",
    name: "Titanium Dioxide (E171)",
    chemicalName: "Titanium(IV) oxide",
    casNumber: "13463-67-7",
    category: "colour",
    riskLevel: "BANNED",
    eNumber: "E171",
    regulatoryStatus: "Banned in the European Union (EFSA 2021) due to genotoxicity concerns; phased out in major jurisdictions.",
    function: "Mineral white pigment and opacifying agent",
    potentialEffects: "DNA strand breaks, cellular accumulation, intestinal inflammation.",
    commonFoods: "Confectionery, white pastries, chewing gum, coffee creamers",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E924a",
    name: "Potassium Bromate (E924a)",
    chemicalName: "Potassium bromate",
    casNumber: "7758-01-2",
    category: "flour treatment agent",
    riskLevel: "BANNED",
    eNumber: "E924a",
    regulatoryStatus: "Classified as Category 2B carcinogen (IARC). Banned in the EU, UK, Canada, China, and Singapore.",
    function: "Dough conditioner and flour maturing oxidant",
    potentialEffects: "Renal toxicity, oxidative stress, documented thyroid and kidney tumors in rodent bioassays.",
    commonFoods: "Industrial sandwich breads, commercial pizza doughs",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E211",
    name: "Sodium Benzoate (E211)",
    chemicalName: "Sodium benzene-carboxylate",
    casNumber: "532-32-1",
    category: "preservative",
    riskLevel: "MODERATE",
    eNumber: "E211",
    regulatoryStatus: "Permitted with strict ADI (0-5 mg/kg bw). Under scrutiny for benzene formation in combination with ascorbic acid.",
    function: "Antimicrobial and antifungal preservative in acidic matrices",
    potentialEffects: "Can form carcinogenic benzene in presence of Vitamin C (E300); hyperactivity exacerbation in children.",
    commonFoods: "Carbonated beverages, pickles, fruit juices, salad dressings",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E621",
    name: "Monosodium Glutamate (MSG / E621)",
    chemicalName: "Sodium 2-aminopentanedioate",
    casNumber: "142-47-2",
    category: "flavour enhancer",
    riskLevel: "LOW",
    eNumber: "E621",
    regulatoryStatus: "Generally Recognized As Safe (GRAS) by FDA, regulated in Singapore SFA & HPB guidelines.",
    function: "Umami taste enhancer and savory flavor booster",
    potentialEffects: "Mild transient sensitivity (headache, flushing) in hypersensitive individuals with high bolus ingestion.",
    commonFoods: "Savory snacks, instant noodles, bullion cubes, cured meats",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E300",
    name: "Ascorbic Acid (Vitamin C / E300)",
    chemicalName: "L-ascorbic acid",
    casNumber: "50-81-7",
    category: "antioxidant",
    riskLevel: "SAFE",
    eNumber: "E300",
    regulatoryStatus: "Authorized without numerical ADI (quantum satis). Vital nutrient and antioxidant.",
    function: "Prevents oxidative degradation, stabilizes color and enzymatic browning",
    potentialEffects: "Nutritive antioxidant; forms benzene if combined with Sodium Benzoate (E211) under heat/UV light.",
    commonFoods: "Fruit juices, sports electrolyte drinks, baked bread, jams",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E950",
    name: "Acesulfame Potassium (Ace-K / E950)",
    chemicalName: "Potassium 6-methyl-2,2-dioxo-1,2,3-oxathiazin-4-olate",
    casNumber: "55589-62-3",
    category: "sweetener",
    riskLevel: "MODERATE",
    eNumber: "E950",
    regulatoryStatus: "Approved with ADI 0-9 mg/kg bw. Often blended with sucralose or aspartame to mask bitter aftertaste.",
    function: "High-intensity artificial sweetener (200x sweeter than sucrose)",
    potentialEffects: "Contains methylene chloride trace residues during manufacture; insulin signaling alteration under debate.",
    commonFoods: "Zero-sugar pre-workout drinks, diet sodas, sugar-free protein puddings",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E320",
    name: "Butylated Hydroxyanisole (BHA / E320)",
    chemicalName: "2-tert-butyl-4-methoxyphenol",
    casNumber: "25013-16-5",
    category: "antioxidant",
    riskLevel: "HIGH",
    eNumber: "E320",
    regulatoryStatus: "Restricted in the EU and classified by California Proposition 65 as a known carcinogen.",
    function: "Synthetic phenolic antioxidant preventing lipid rancidity",
    potentialEffects: "Suspected endocrine disruptor; foresomach papillomas documented in animal feeding trials.",
    commonFoods: "Dry breakfast cereals, chewing gum, dehydrated potato chips, lard",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Above demo limit"
  },
  {
    id: "E471",
    name: "Mono- and Diglycerides of Fatty Acids (E471)",
    chemicalName: "Glycerol monostearate",
    casNumber: "31566-31-1",
    category: "emulsifier",
    riskLevel: "MODERATE",
    eNumber: "E471",
    regulatoryStatus: "Approved in Codex and Singapore SFA. Often may contain hidden trans fatty acid fractions.",
    function: "Binds water and oil phases, preserves crumb softness in baked goods",
    potentialEffects: "Gut mucosal barrier disruption; metabolic inflammation if derived from partially hydrogenated oils.",
    commonFoods: "Commercial ice cream, margarine, shelf-stable bakery items, coffee creamers",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: false,
      halal: false,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E150d",
    name: "Caramel IV - Sulphite Ammonia Caramel (E150d)",
    chemicalName: "Sulphite ammonia caramel",
    casNumber: "8028-89-5",
    category: "colour",
    riskLevel: "MODERATE",
    eNumber: "E150d",
    regulatoryStatus: "Permitted with limits on 4-methylimidazole (4-MEI) by-product content.",
    function: "Dark brown food colouring synthesized with ammonia and sulphite compounds",
    potentialEffects: "Contains 4-MEI by-product, listed under IARC 2B as potentially carcinogenic to humans.",
    commonFoods: "Colas, dark beers, industrial soy sauces, gravies",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E322",
    name: "Lecithins (Soy Lecithin / E322)",
    chemicalName: "Phosphatidylcholine",
    casNumber: "8002-43-5",
    category: "emulsifier",
    riskLevel: "SAFE",
    eNumber: "E322",
    regulatoryStatus: "Approved quantum satis. Must declare allergen origin if derived from soy.",
    function: "Natural amphiphilic emulsifier and viscosity reducer",
    potentialEffects: "Benign; major allergen alert for soy-sensitive athletes and individuals.",
    commonFoods: "Chocolate, sports protein bars, instant cocoa, meal replacement shakes",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "INGR-PALM",
    name: "Palm Oil (INGR-PALM)",
    chemicalName: "Elaeis guineensis fruit oil",
    casNumber: "8002-75-3",
    category: "industrial fat",
    riskLevel: "MODERATE",
    eNumber: "INGR-PALM",
    regulatoryStatus: "Permitted agricultural fat; monitored for processing contaminants 3-MCPD and GE.",
    function: "Semi-solid high-heat frying fat and structural shortening",
    potentialEffects: "High saturated palmitic acid content; thermal refining produces genotoxic glycidyl fatty acid esters.",
    commonFoods: "Packaged instant noodles, cookies, hazelnut spreads, deep-fried snacks",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "INGR-TRANSFAT",
    name: "Partially Hydrogenated Oil (Trans Fat / INGR-TRANSFAT)",
    chemicalName: "Trans-isomer unsaturated fatty acids",
    casNumber: "555-43-1",
    category: "industrial fat",
    riskLevel: "BANNED",
    eNumber: "INGR-TRANSFAT",
    regulatoryStatus: "Banned in Singapore (MOH PHO ban 2021), US FDA (removed GRAS), and WHO REPLACE target.",
    function: "Industrial hardening of liquid plant oils to achieve long shelf stability",
    potentialEffects: "Directly elevates LDL, drops HDL, promotes systemic endothelial vascular inflammation.",
    commonFoods: "Traditional shortening, commercial frostings, non-dairy creamers",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Above demo limit"
  },
  {
    id: "INGR-HFCS",
    name: "High Fructose Corn Syrup (HFCS / INGR-HFCS)",
    chemicalName: "Glucose-fructose syrup",
    casNumber: "977042-84-4",
    category: "sweetener",
    riskLevel: "HIGH",
    eNumber: "INGR-HFCS",
    regulatoryStatus: "Approved caloric sweetener; target of Singapore MOH Nutri-Grade taxation.",
    function: "Enzymatically converted liquid corn sweetener with rapid dissolution",
    potentialEffects: "Hepatic de novo lipogenesis, non-alcoholic fatty liver disease (NAFLD), leptin resistance.",
    commonFoods: "Sweetened tea beverages, commercial energy drinks, barbecue sauces",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E250",
    name: "Sodium Nitrite (E250)",
    chemicalName: "Sodium nitrite",
    casNumber: "7632-00-0",
    category: "preservative",
    riskLevel: "HIGH",
    eNumber: "E250",
    regulatoryStatus: "Strictly limited in cured meat products (max 150 mg/kg) to curb nitrosamine formation.",
    function: "Inhibits Clostridium botulinum and fixes pink cured meat color",
    potentialEffects: "Reactivity with secondary amines under stomach acid produces carcinogenic nitrosamines.",
    commonFoods: "Hot dogs, bacon, ham, cured luncheon meats",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E102",
    name: "Tartrazine (E102)",
    chemicalName: "Trisodium 5-hydroxy-1-(4-sulfonatophenyl)-4-(4-sulfonatophenylazo)pyrazole-3-carboxylate",
    casNumber: "1934-21-0",
    category: "colour",
    riskLevel: "MODERATE",
    eNumber: "E102",
    regulatoryStatus: "EU warning label required ('May have an adverse effect on activity and attention in children').",
    function: "Synthetic azo dye imparting lemon yellow color",
    potentialEffects: "Histamine release triggers, asthma exacerbation in aspirin-sensitive persons, hyperkinesis.",
    commonFoods: "Mountain Dew style drinks, yellow mustard, flavored corn chips, candies",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E133",
    name: "Brilliant Blue FCF (E133)",
    chemicalName: "Disodium 2-({4-[ethyl(3-sulfonatobenzyl)amino]phenyl}{4-[ethyl(3-sulfonatobenzyl)iminio]cyclohexa-2,5-dien-1-ylidene}methyl)benzenesulfonate",
    casNumber: "3844-45-9",
    category: "colour",
    riskLevel: "LOW",
    eNumber: "E133",
    regulatoryStatus: "Approved synthetic triarylmethane dye across Singapore SFA, FDA, and EFSA.",
    function: "Imparts vibrant electric cyan-blue coloring",
    potentialEffects: "Low intestinal absorption (<5%); rare allergic urticaria.",
    commonFoods: "Electrolyte sports drinks, blue ice pops, energy gels, bubble teas",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E202",
    name: "Potassium Sorbate (E202)",
    chemicalName: "Potassium (2E,4E)-hexa-2,4-dienoate",
    casNumber: "24634-61-5",
    category: "preservative",
    riskLevel: "SAFE",
    eNumber: "E202",
    regulatoryStatus: "Widely approved with ADI 0-11 mg/kg bw. Metabolized like standard dietary fatty acids.",
    function: "Inhibits mold, yeast, and aerophilic bacterial growth",
    potentialEffects: "Low toxicity profile; metabolized into water and CO2 via beta-oxidation.",
    commonFoods: "Yogurt parfaits, shelf-stable protein puddings, dried fruits, cider",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E951",
    name: "Aspartame (E951)",
    chemicalName: "N-(L-alpha-Aspartyl)-L-phenylalanine 1-methyl ester",
    casNumber: "22839-47-0",
    category: "sweetener",
    riskLevel: "MODERATE",
    eNumber: "E951",
    regulatoryStatus: "IARC Group 2B classification (2023). Warning required for phenylketonurics (PKU).",
    function: "Low-calorie dipeptide artificial sweetener (200x sucrose)",
    potentialEffects: "Breaks down into phenylalanine, aspartic acid, and trace methanol; dangerous for PKU.",
    commonFoods: "Diet soda, sugar-free chewing gum, workout amino powders",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E223",
    name: "Sodium Metabisulphite (E223)",
    chemicalName: "Disodium disulfite",
    casNumber: "7681-57-4",
    category: "preservative",
    riskLevel: "MODERATE",
    eNumber: "E223",
    regulatoryStatus: "Must declare allergen notice if SO2 residual exceeds 10 mg/kg.",
    function: "Antioxidant, bleaching agent, and antimicrobial sulphite",
    potentialEffects: "Bronchospasm in asthmatics, destroys thiamine (Vitamin B1) in foods.",
    commonFoods: "Dehydrated potatoes, dried apricots, workout trail mixes, pickled ginger",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E407",
    name: "Carrageenan (E407)",
    chemicalName: "Carrageenan polysaccharide sulfate",
    casNumber: "9000-07-1",
    category: "emulsifier",
    riskLevel: "MODERATE",
    eNumber: "E407",
    regulatoryStatus: "Approved food-grade carrageenan; degraded poligeenan form is banned.",
    function: "Extracted red seaweed gelling and thickening hydrocolloid",
    potentialEffects: "Can cause intestinal barrier disruption and inflammatory bowel flare-ups.",
    commonFoods: "Plant-based milks, ready-to-drink protein shakes, dairy desserts",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E955",
    name: "Sucralose (E955)",
    chemicalName: "1,6-Dichloro-1,6-dideoxy-beta-D-fructofuranosyl 4-chloro-4-deoxy-alpha-D-galactopyranoside",
    casNumber: "56038-13-2",
    category: "sweetener",
    riskLevel: "LOW",
    eNumber: "E955",
    regulatoryStatus: "Approved worldwide with ADI 0-15 mg/kg bw.",
    function: "Heat-stable non-caloric organochlorine sweetener (600x sucrose)",
    potentialEffects: "Emerging microbiome shifts; chloropropanols generation when baked above 200°C.",
    commonFoods: "Isolate whey proteins, BCAA powder, electrolyte hydration sachets",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  },
  {
    id: "E330",
    name: "Citric Acid (E330)",
    chemicalName: "2-hydroxypropane-1,2,3-tricarboxylic acid",
    casNumber: "77-92-9",
    category: "antioxidant",
    riskLevel: "SAFE",
    eNumber: "E330",
    regulatoryStatus: "Authorized quantum satis across all major jurisdictions.",
    function: "Acidulant, buffering agent, and chelation enhancer",
    potentialEffects: "Benign naturally occurring metabolite of the Krebs cycle; dental enamel erosion if sipped continuously.",
    commonFoods: "Citrus sports beverages, electrolyte tabs, recovery gummies, canned tomatoes",
    dietary: {
      traceability: "Demo record: no batch or certification data",
      vegan: true,
      halal: true,
      kosher: true
    },
    pesticideStatus: "Within demo limits"
  }
];

export const NUTRITION = [
  {
    id: "FOOD-HUMMUS",
    name: "Hummus",
    hebrewName: "חומוס",
    category: "Plant Protein & Healthy Fats",
    servingSize: "100g",
    calories: 166,
    protein: 7.9,
    carbs: 14.3,
    fat: 9.6,
    fiber: 6.0,
    sodium: 382,
    recoveryScore: 88,
    glycemicIndex: "Low",
    exerciseTiming: "Pre-workout (2hr prior)",
    recommendedFor: "Sustained complex carbohydrates and slow-release energy for long gym or running sessions.",
    vendingAvailability: "ActiveSG Clementi & Bishan Vending Pod #1",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-TAHINI",
    name: "Tahini",
    hebrewName: "טחינה",
    category: "Mineral & Healthy Fats",
    servingSize: "100g",
    calories: 595,
    protein: 17.0,
    carbs: 21.2,
    fat: 53.8,
    fiber: 9.3,
    sodium: 115,
    recoveryScore: 84,
    glycemicIndex: "Low",
    exerciseTiming: "All-day recovery",
    recommendedFor: "High magnesium, calcium, and zinc for post-exercise bone and connective tissue remodeling.",
    vendingAvailability: "ActiveSG Tampines Hub Vending Pod #2",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-YOGURT",
    name: "Greek Yogurt",
    hebrewName: "יוגורט יווני",
    category: "High Protein Dairy",
    servingSize: "170g",
    calories: 100,
    protein: 18.0,
    carbs: 6.0,
    fat: 0.7,
    fiber: 0.0,
    sodium: 60,
    recoveryScore: 95,
    glycemicIndex: "Low",
    exerciseTiming: "Post-workout (within 45min)",
    recommendedFor: "Rapid leucine delivery for muscle protein synthesis (MPS) immediately after strength training.",
    vendingAvailability: "ActiveSG Toa Payoh & Jurong East Gym Vending Stations",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-CHICKEN",
    name: "Chicken Breast",
    hebrewName: "חזה עוף",
    category: "Lean Protein",
    servingSize: "150g",
    calories: 247,
    protein: 46.5,
    carbs: 0.0,
    fat: 5.4,
    fiber: 0.0,
    sodium: 111,
    recoveryScore: 96,
    glycemicIndex: "Zero",
    exerciseTiming: "Post-workout (within 45min)",
    recommendedFor: "Highest biological value protein for structural myofibrillar hypertrophy and muscle recovery.",
    vendingAvailability: "Hot Fresh ActiveFuel Dispenser - Bedok & Bishan ActiveSG",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-BROWN-RICE",
    name: "Brown Rice",
    hebrewName: "אורז חום",
    category: "Complex Carbohydrates",
    servingSize: "195g",
    calories: 216,
    protein: 5.0,
    carbs: 45.0,
    fat: 1.8,
    fiber: 3.5,
    sodium: 10,
    recoveryScore: 89,
    glycemicIndex: "Medium",
    exerciseTiming: "Pre-workout (2hr prior)",
    recommendedFor: "Complete muscle glycogen replenishment without insulin spikes.",
    vendingAvailability: "Hot Fresh ActiveFuel Dispenser - Bedok & Bishan ActiveSG",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-OATS",
    name: "Oats",
    hebrewName: "שיבולת שועל",
    category: "Beta-Glucan Carbohydrates",
    servingSize: "80g",
    calories: 307,
    protein: 10.7,
    carbs: 54.8,
    fat: 5.3,
    fiber: 8.2,
    sodium: 4,
    recoveryScore: 92,
    glycemicIndex: "Low",
    exerciseTiming: "Pre-workout (2hr prior)",
    recommendedFor: "Beta-glucan fiber supports steady blood glucose and gastrointestinal comfort during cardio.",
    vendingAvailability: "ActiveFuel Breakfast Chill Locker #4",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-SALMON",
    name: "Salmon Fillet",
    hebrewName: "סלמון",
    category: "Omega-3 Protein",
    servingSize: "150g",
    calories: 312,
    protein: 34.0,
    carbs: 0.0,
    fat: 18.5,
    fiber: 0.0,
    sodium: 90,
    recoveryScore: 98,
    glycemicIndex: "Zero",
    exerciseTiming: "Post-workout (within 45min)",
    recommendedFor: "High EPA & DHA omega-3 fatty acids to suppress post-exercise inflammation and DOMS.",
    vendingAvailability: "Hot Fresh ActiveFuel Dispenser - Jurong West Sports Hub",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-QUINOA",
    name: "Quinoa Salad",
    hebrewName: "קינואה",
    category: "Complete Plant Grain",
    servingSize: "185g",
    calories: 222,
    protein: 8.1,
    carbs: 39.4,
    fat: 3.6,
    fiber: 5.2,
    sodium: 13,
    recoveryScore: 91,
    glycemicIndex: "Low",
    exerciseTiming: "Pre-workout (2hr prior)",
    recommendedFor: "All 9 essential amino acids in a light, easily digestible grain base.",
    vendingAvailability: "ActiveSG Clementi Healthy Grab-and-Go Pod",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-WHEY",
    name: "Protein Shake (Whey Isolate)",
    hebrewName: "שייק חלבון מי גבינה",
    category: "Rapid Assimilation Protein",
    servingSize: "300ml",
    calories: 140,
    protein: 30.0,
    carbs: 2.0,
    fat: 1.0,
    fiber: 0.5,
    sodium: 140,
    recoveryScore: 99,
    glycemicIndex: "Low",
    exerciseTiming: "Post-workout (within 45min)",
    recommendedFor: "Ultra-fast amino acid influx to stimulate mTOR pathway within the critical post-exercise window.",
    vendingAvailability: "ActiveFuel Chilled Protein Shaker Dispenser (All ActiveSG Gyms)",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-ENERGY-BAR",
    name: "Energy Bar",
    hebrewName: "חטיף אנרגיה",
    category: "Intra-Workout Fuel",
    servingSize: "60g",
    calories: 220,
    protein: 10.0,
    carbs: 32.0,
    fat: 6.0,
    fiber: 4.0,
    sodium: 120,
    recoveryScore: 85,
    glycemicIndex: "Medium",
    exerciseTiming: "Pre-workout (2hr prior)",
    recommendedFor: "Portable sports fuel with fast glucose & dates for high-intensity intervals and court sports.",
    vendingAvailability: "ActiveSG All Sports Hall Vending Machines",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-BOWL",
    name: "Post-Workout Rice Bowl",
    hebrewName: "קערת אורז לאחר אימון",
    category: "Balanced Macro Recovery",
    servingSize: "380g",
    calories: 520,
    protein: 42.0,
    carbs: 62.0,
    fat: 11.0,
    fiber: 6.0,
    sodium: 460,
    recoveryScore: 97,
    glycemicIndex: "Medium",
    exerciseTiming: "Post-workout (within 45min)",
    recommendedFor: "Ideal 3:1 carb-to-protein ratio designed by board-certified sports dietitians.",
    vendingAvailability: "Hot Fresh ActiveFuel Dispenser - Bishan & Clementi",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  },
  {
    id: "FOOD-ELECTROLYTE",
    name: "Electrolyte Hydration Drink",
    hebrewName: "משקה אלקטרוליטים",
    category: "Hydration & Mineral Balance",
    servingSize: "500ml",
    calories: 50,
    protein: 0.0,
    carbs: 12.0,
    fat: 0.0,
    fiber: 0.0,
    sodium: 350,
    recoveryScore: 94,
    glycemicIndex: "Low",
    exerciseTiming: "Post-workout (within 45min)",
    recommendedFor: "Replaces sweat sodium, potassium, and magnesium to prevent cramping in humid tropical conditions.",
    vendingAvailability: "All ActiveSG Pool & Court Vending Terminals",
    dietary: {
      traceability: "Demo record: no batch or certification data"
    }
  }
];

export const PESTICIDES = [
  {
    id: "PEST-GLYPHOSATE",
    pesticide: "Glyphosate",
    casNumber: "1071-83-6",
    type: "Herbicide",
    crops: ["soybean", "corn", "wheat", "oat", "barley"],
    mrlLimitMgKg: 5.0,
    detectedLevelMgKg: 0.82,
    status: "Within demo limits",
    regulatoryAgency: "Singapore SFA / Codex Alimentarius MRL 2024",
    healthImpact: "Broad-spectrum systemic organophosphorus herbicide; monitored for non-Hodgkin lymphoma debate."
  },
  {
    id: "PEST-CHLORPYRIFOS",
    pesticide: "Chlorpyrifos",
    casNumber: "2921-88-2",
    type: "Insecticide",
    crops: ["apple", "orange", "strawberry", "grape"],
    mrlLimitMgKg: 0.01,
    detectedLevelMgKg: 0.045,
    status: "Above demo limit",
    regulatoryAgency: "Singapore SFA / EU Zero-Tolerance Threshold",
    healthImpact: "Organophosphate acetylcholinesterase inhibitor; banned in residential uses and restricted globally due to developmental neurotoxicity."
  },
  {
    id: "PEST-MANCOZEB",
    pesticide: "Mancozeb",
    casNumber: "8018-01-7",
    type: "Fungicide",
    crops: ["potato", "tomato", "onion", "apple"],
    mrlLimitMgKg: 3.0,
    detectedLevelMgKg: 0.45,
    status: "Within demo limits",
    regulatoryAgency: "Codex Alimentarius / Singapore SFA Food Regulations",
    healthImpact: "Dithiocarbamate contact fungicide; breaks down into ethylene thiourea (ETU) which impacts thyroid hormone regulation."
  },
  {
    id: "PEST-IMIDACLOPRID",
    pesticide: "Imidacloprid",
    casNumber: "138261-41-3",
    type: "Insecticide",
    crops: ["tomato", "lettuce", "cotton", "rice"],
    mrlLimitMgKg: 1.0,
    detectedLevelMgKg: 0.12,
    status: "Within demo limits",
    regulatoryAgency: "Singapore SFA / Codex MRL",
    healthImpact: "Neonicotinoid targeting nicotinic acetylcholine receptors; highly toxic to pollinators and honeybees."
  },
  {
    id: "PEST-MALATHION",
    pesticide: "Malathion",
    casNumber: "121-75-5",
    type: "Insecticide",
    crops: ["strawberry", "cherry", "blueberry"],
    mrlLimitMgKg: 8.0,
    detectedLevelMgKg: 0.65,
    status: "Within demo limits",
    regulatoryAgency: "Singapore SFA / Codex MRL",
    healthImpact: "Broad spectrum organophosphate; monitored under IARC 2A classification."
  },
  {
    id: "PEST-AZOXYSTROBIN",
    pesticide: "Azoxystrobin",
    casNumber: "131860-33-8",
    type: "Fungicide",
    crops: ["banana", "grape", "tomato"],
    mrlLimitMgKg: 2.0,
    detectedLevelMgKg: 0.28,
    status: "Within demo limits",
    regulatoryAgency: "Codex MRL / Singapore SFA",
    healthImpact: "Strobilurin broad-spectrum fungicide inhibiting mitochondrial cellular respiration."
  },
  {
    id: "PEST-CYPERMETHRIN",
    pesticide: "Cypermethrin",
    casNumber: "52315-07-8",
    type: "Insecticide",
    crops: ["cabbage", "cotton", "soybean", "spinach"],
    mrlLimitMgKg: 2.0,
    detectedLevelMgKg: 0.19,
    status: "Within demo limits",
    regulatoryAgency: "Codex Alimentarius / SFA Guidelines",
    healthImpact: "Synthetic pyrethroid acting as an axonal sodium channel modulator."
  },
  {
    id: "PEST-DDT",
    pesticide: "DDT",
    casNumber: "50-29-3",
    type: "Legacy Insecticide",
    crops: ["carrot", "beet", "peanut"],
    mrlLimitMgKg: 0.05,
    detectedLevelMgKg: 0.08,
    status: "Above demo limit",
    regulatoryAgency: "Stockholm Convention Persistent Organic Pollutant (POP)",
    healthImpact: "Bioaccumulative organochlorine with high environmental persistence and endocrine disrupting effects."
  }
];

export const DATASET = {
  additivesCount: ADDITIVES.length,
  nutritionCount: NUTRITION.length,
  pesticidesCount: PESTICIDES.length,
  totalCount: ADDITIVES.length + NUTRITION.length + PESTICIDES.length,
  notice: DEMO_SENTENCE
};
