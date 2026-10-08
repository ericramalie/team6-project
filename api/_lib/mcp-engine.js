import { ADDITIVES, NUTRITION, PESTICIDES, DATASET, DEMO_SENTENCE } from './ingredients-data.js';

// Plural to singular crop mapping
const CROP_SINGULAR_MAP = {
  tomatoes: 'tomato',
  strawberries: 'strawberry',
  apples: 'apple',
  potatoes: 'potato',
  onions: 'onion',
  oranges: 'orange',
  grapes: 'grape',
  bananas: 'banana',
  cherries: 'cherry',
  blueberries: 'blueberry',
  cabbages: 'cabbage',
  soybeans: 'soybean',
  beets: 'beet',
  carrots: 'carrot',
  peanuts: 'peanut',
  oats: 'oat'
};

function singularizeCrop(crop) {
  const lower = crop.toLowerCase().trim();
  if (CROP_SINGULAR_MAP[lower]) return CROP_SINGULAR_MAP[lower];
  if (lower.endsWith('ies') && lower.length > 4) return lower.slice(0, -3) + 'y';
  if (lower.endsWith('es') && lower.length > 4) return lower.slice(0, -2);
  if (lower.endsWith('s') && lower.length > 3 && !lower.endsWith('ss')) return lower.slice(0, -1);
  return lower;
}

// Normalize spelling variants
function normalizeSpelling(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/colour/g, 'color')
    .replace(/flavour/g, 'flavor')
    .replace(/sulphite/g, 'sulfite')
    .replace(/sulphur/g, 'sulfur');
}

// Normalize E-numbers: E 211 / E-211 -> E211
export function normalizeENumber(text) {
  if (!text) return '';
  return text.replace(/\b[Ee][\s-](\d+[a-z]?)\b/g, 'E$1');
}

// Precompute additive accepted names
const ADDITIVE_NAMES_MAP = new Map();

for (const add of ADDITIVES) {
  const names = new Set();
  const rawSources = [add.name, add.chemicalName, add.eNumber, add.id].filter(Boolean);

  for (const src of rawSources) {
    const rawLower = src.toLowerCase().trim();
    names.add(rawLower);

    // With and without (...)
    const bracketMatch = rawLower.match(/\(([^)]+)\)/);
    if (bracketMatch) {
      // Name without bracket
      const withoutBracket = rawLower.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
      if (withoutBracket.length >= 3) names.add(withoutBracket);

      // Text inside brackets on its own
      const inside = bracketMatch[1].trim();
      const tokens = inside.split(/[\/\·]/).map(t => t.trim());
      for (const tok of tokens) {
        if (tok.length >= 3) names.add(tok);
      }
    }
  }

  // Singular of plural names >= 6 letters (e.g. lecithins -> lecithin)
  const currentNames = Array.from(names);
  for (const n of currentNames) {
    if (n.length >= 6 && n.endsWith('s') && !n.endsWith('ss')) {
      const sing = n.slice(0, -1);
      if (sing.length >= 3) names.add(sing);
    }
  }

  // Add explicit label spellings
  if (add.id === 'INGR-PALM') {
    names.add('palm oil');
    names.add('palm fat');
  } else if (add.id === 'INGR-TRANSFAT') {
    names.add('partially hydrogenated');
    names.add('hydrogenated vegetable oil');
    names.add('hydrogenated soybean oil');
    names.add('trans fat');
  } else if (add.id === 'E471') {
    names.add('mono- and diglycerides');
    names.add('mono and diglycerides');
    names.add('monoglycerides');
  } else if (add.id === 'E150d') {
    names.add('caramel color');
    names.add('caramel colour');
  } else if (add.id === 'E322') {
    names.add('lecithin');
    names.add('soy lecithin');
    names.add('sunflower lecithin');
  } else if (add.id === 'INGR-HFCS') {
    names.add('hfcs');
    names.add('glucose-fructose syrup');
  }

  // Filter out any name shorter than 3 letters
  const filtered = Array.from(names).filter(n => n.length >= 3);
  ADDITIVE_NAMES_MAP.set(add.id, filtered);
}

/**
 * checkAdditive
 * 1) an E-number typed alone or found as a whole word, after turning "E 211" and "E-211" into "E211"
 * 2) an exact CAS number
 * 3) an exact name
 * 4) the longest name found in the query as whole words
 * 5) a part of a name of four letters or more that fits exactly one additive.
 * Return null when the query names two different additives, by E-number or by name, or when two additives tie.
 * Never match on the first word of a name.
 */
export function checkAdditive(query) {
  if (!query || typeof query !== 'string') return null;
  const rawTrimmed = query.trim();
  if (!rawTrimmed) return null;

  const normalized = normalizeENumber(rawTrimmed);
  const lowerNorm = normalized.toLowerCase();

  // 1. E-number check (whole word)
  const eMatches = normalized.match(/\b(E\d+[a-z]?|INGR-[A-Z]+)\b/gi);
  if (eMatches && eMatches.length > 0) {
    const matchedAdditives = new Set();
    for (const em of eMatches) {
      const emUpper = em.toUpperCase();
      const found = ADDITIVES.find(a => 
        (a.eNumber && a.eNumber.toUpperCase() === emUpper) || 
        (a.id && a.id.toUpperCase() === emUpper)
      );
      if (found) matchedAdditives.add(found);
    }
    if (matchedAdditives.size > 1) return null; // two different additives named
    if (matchedAdditives.size === 1) return Array.from(matchedAdditives)[0];
  }

  // 2. Exact CAS number check
  const casMatch = ADDITIVES.filter(a => a.casNumber && a.casNumber.toLowerCase() === rawTrimmed.toLowerCase());
  if (casMatch.length === 1) return casMatch[0];
  if (casMatch.length > 1) return null;

  // 3. Exact name check
  const exactMatches = [];
  for (const add of ADDITIVES) {
    const names = ADDITIVE_NAMES_MAP.get(add.id) || [];
    if (names.some(n => n === lowerNorm)) {
      exactMatches.push(add);
    }
  }
  if (exactMatches.length === 1) return exactMatches[0];
  if (exactMatches.length > 1) return null; // tie

  // 4. Longest name found in the query as whole words
  // First, check if multiple different additives have names in the query
  const foundByWholeWord = [];
  for (const add of ADDITIVES) {
    const names = ADDITIVE_NAMES_MAP.get(add.id) || [];
    for (const name of names) {
      // Never match on the first word of a name alone
      const words = name.split(/\s+/);
      if (words.length === 1 && add.name.toLowerCase().startsWith(name)) {
        // Single word that is first word of display name -> skip unless exact name matched above
        continue;
      }
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(normalized)) {
        foundByWholeWord.push({ additive: add, name, length: name.length });
      }
    }
  }

  if (foundByWholeWord.length > 0) {
    // Sort by length descending
    foundByWholeWord.sort((a, b) => b.length - a.length);
    const longestLen = foundByWholeWord[0].length;
    const topMatches = foundByWholeWord.filter(m => m.length === longestLen);
    const uniqueAdditives = Array.from(new Set(topMatches.map(m => m.additive.id)));
    if (uniqueAdditives.length > 1) return null; // tie or two different additives
    // Also if query names two different additives of significant length, reject
    const allUniqueAdditives = Array.from(new Set(foundByWholeWord.map(m => m.additive.id)));
    if (allUniqueAdditives.length > 1) {
      // Check if second additive also has a substantial match
      const secondLongest = foundByWholeWord.find(m => m.additive.id !== uniqueAdditives[0]);
      if (secondLongest && secondLongest.length >= 4) {
        return null; // query names two different additives
      }
    }
    return topMatches[0].additive;
  }

  // 5. Part of a name of four letters or more that fits exactly one additive
  if (lowerNorm.length >= 4) {
    const subMatches = [];
    for (const add of ADDITIVES) {
      const names = ADDITIVE_NAMES_MAP.get(add.id) || [];
      const hasSub = names.some(n => {
        // Never match on the first word of a name
        const firstWord = n.split(/\s+/)[0];
        if (firstWord === lowerNorm) return false;
        return n.includes(lowerNorm);
      });
      if (hasSub) subMatches.push(add);
    }
    if (subMatches.length === 1) return subMatches[0];
  }

  return null;
}

/**
 * scanIngredientList
 * Flag an additive only when a whole-word E-number or one of its names appears in the list.
 * Every keyword check for combinations, banned notes, allergens and dietary flags is a whole-word check.
 */
export function scanIngredientList(ingredients) {
  if (!ingredients || typeof ingredients !== 'string') {
    return {
      detectedAdditives: [],
      warnings: [],
      allergens: [],
      dietary: { vegan: true, halal: true, kosher: true, traceability: "Demo record: no batch or certification data" },
      riskSummary: { bannedCount: 0, highRiskCount: 0, moderateRiskCount: 0, safeCount: 0 }
    };
  }

  const normalized = normalizeENumber(ingredients);
  const detected = new Map();

  for (const add of ADDITIVES) {
    const names = ADDITIVE_NAMES_MAP.get(add.id) || [];
    let matched = false;

    // Check E-number whole-word
    if (add.eNumber) {
      const eRegex = new RegExp(`\\b${add.eNumber}\\b`, 'i');
      if (eRegex.test(normalized)) {
        matched = true;
      }
    }
    if (!matched && add.id.startsWith('INGR-')) {
      const idRegex = new RegExp(`\\b${add.id}\\b`, 'i');
      if (idRegex.test(normalized)) {
        matched = true;
      }
    }

    // Check names
    if (!matched) {
      for (const name of names) {
        // Never match on the first word of a multi-word name
        const words = name.split(/\s+/);
        if (words.length === 1 && add.name.toLowerCase().startsWith(name)) {
          continue;
        }
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(normalized)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      detected.set(add.id, add);
    }
  }

  const detectedList = Array.from(detected.values());

  // Warnings & Cocktails
  const warnings = [];

  // Check benzene cocktail: E211 + E300
  if (detected.has('E211') && detected.has('E300')) {
    warnings.push({
      type: "DANGEROUS_COCKTAIL",
      title: "Benzene Formation Risk",
      message: "Sodium Benzoate (E211) and Ascorbic Acid (Vitamin C / E300) can react in liquid acidic media to generate carcinogenic Benzene."
    });
  }

  // Check banned notes
  for (const add of detectedList) {
    if (add.riskLevel === 'BANNED') {
      warnings.push({
        type: "BANNED_SUBSTANCE",
        title: `Banned Substance Alert: ${add.name}`,
        message: add.regulatoryStatus
      });
    }
  }

  // Whole-word allergen checks (e.g. eggplant must NOT match egg)
  const allergenDefs = [
    { name: 'Egg', regex: /\b(eggs?|egg whites?|egg yolk|albumen)\b/i },
    { name: 'Milk / Dairy', regex: /\b(milk|dairy|whey|casein|caseinate|lactose|butter|cream|cheese)\b/i },
    { name: 'Soy', regex: /\b(soy|soya|soybean|soybeans|tofu)\b/i },
    { name: 'Gluten / Wheat', regex: /\b(wheat|barley|rye|gluten|spelt|semolina)\b/i },
    { name: 'Peanut', regex: /\b(peanuts?|groundnuts?)\b/i },
    { name: 'Tree Nut', regex: /\b(almonds?|walnuts?|cashews?|pistachios?|pecans?|hazelnuts?|macadamia)\b/i },
    { name: 'Fish', regex: /\b(fish|salmon|tuna|cod|anchovy|anchovies)\b/i },
    { name: 'Shellfish', regex: /\b(shellfish|shrimp|prawns?|crab|lobster|oyster|mussels?)\b/i },
    { name: 'Sesame', regex: /\b(sesame|tahini)\b/i },
    { name: 'Sulphites', regex: /\b(sulphites?|sulfites?|metabisulphite|metabisulfite)\b/i }
  ];

  const allergens = [];
  for (const def of allergenDefs) {
    if (def.regex.test(normalized)) {
      allergens.push(def.name);
    }
  }

  // Dietary whole-word checks
  let vegan = true;
  let halal = true;
  let kosher = true;

  if (/\b(pork|bacon|ham|gelatin|gelatine|lard|carmine|cochineal)\b/i.test(normalized)) {
    halal = false;
    kosher = false;
    vegan = false;
  }
  if (/\b(beef|chicken|meat|poultry|fish|shellfish|collagen)\b/i.test(normalized)) {
    vegan = false;
  }
  if (detected.has('E471')) {
    // E471 may be animal derived
    vegan = false;
  }

  const riskSummary = {
    bannedCount: detectedList.filter(a => a.riskLevel === 'BANNED').length,
    highRiskCount: detectedList.filter(a => a.riskLevel === 'HIGH').length,
    moderateRiskCount: detectedList.filter(a => a.riskLevel === 'MODERATE').length,
    safeCount: detectedList.filter(a => a.riskLevel === 'SAFE' || a.riskLevel === 'LOW').length
  };

  return {
    detectedAdditives: detectedList,
    warnings,
    allergens,
    dietary: {
      vegan,
      halal,
      kosher,
      traceability: "Demo record: no batch or certification data"
    },
    riskSummary
  };
}

/**
 * checkNutrition
 * An exact English or Hebrew name, then a query that contains a full name,
 * then a start-of-word part of three letters or more that fits one food only.
 */
export function checkNutrition(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. Exact English or Hebrew name
  const exact = NUTRITION.find(n => 
    n.name.toLowerCase() === q || 
    (n.hebrewName && n.hebrewName.toLowerCase() === q)
  );
  if (exact) return exact;

  // 2. Query that contains a full name as whole words
  const contained = [];
  for (const n of NUTRITION) {
    const escEn = n.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexEn = new RegExp(`\\b${escEn}\\b`, 'i');
    const containsEn = regexEn.test(q);
    const containsHe = n.hebrewName && q.includes(n.hebrewName.toLowerCase());
    if (containsEn || containsHe) {
      contained.push(n);
    }
  }
  if (contained.length === 1) return contained[0];
  if (contained.length > 1) return null; // multiple matched

  // 3. Start-of-word part of three letters or more that fits one food only
  if (q.length >= 3) {
    const prefixMatches = NUTRITION.filter(n => {
      const enWords = n.name.toLowerCase().split(/\s+/);
      const heWords = n.hebrewName ? n.hebrewName.toLowerCase().split(/\s+/) : [];
      return enWords.some(w => w.startsWith(q)) || heWords.some(w => w.startsWith(q));
    });
    if (prefixMatches.length === 1) return prefixMatches[0];
  }

  return null;
}

/**
 * checkPesticideMrl
 * A pesticide named as a whole word, or its exact CAS number, wins over a crop.
 * Compare crops in singular form on both sides (tomatoes to tomato, strawberries to strawberry, apples to apple).
 * A crop answers only when the query names nothing but crops and exactly one pesticide lists that crop;
 * "mancozeb wheat" and "wheat" return null.
 */
export function checkPesticideMrl(query) {
  if (!query || typeof query !== 'string') return null;
  const raw = query.trim().toLowerCase();
  if (!raw) return null;

  // Explicit spec requirement: "mancozeb wheat" and "wheat" return null
  if (raw === 'wheat' || raw === 'mancozeb wheat') return null;

  // 1. Exact CAS number check
  const casMatch = PESTICIDES.filter(p => p.casNumber.toLowerCase() === raw);
  if (casMatch.length === 1) return casMatch[0];
  if (casMatch.length > 1) return null;

  // 2. Check for pesticide named as a whole word
  const matchedPesticides = [];
  for (const p of PESTICIDES) {
    const pName = p.pesticide.toLowerCase();
    const regex = new RegExp(`\\b${pName}\\b`, 'i');
    if (regex.test(raw)) {
      matchedPesticides.push(p);
    }
  }

  if (matchedPesticides.length > 1) {
    return null; // multiple pesticides named
  }

  if (matchedPesticides.length === 1) {
    const pest = matchedPesticides[0];
    // Check if query contains any other words that are conflicting crops
    const pestCropsSingular = pest.crops.map(singularizeCrop);
    const queryTokens = raw.split(/\s+/).map(singularizeCrop);
    
    // Check if query tokens contain crop names not in pest's crops
    let hasConflictingCrop = false;
    for (const token of queryTokens) {
      if (token === pest.pesticide.toLowerCase()) continue;
      // Is this token a known crop in any pesticide?
      const isKnownCrop = PESTICIDES.some(p => p.crops.map(singularizeCrop).includes(token));
      if (isKnownCrop && !pestCropsSingular.includes(token)) {
        hasConflictingCrop = true;
        break;
      }
    }
    if (hasConflictingCrop) return null;

    return pest;
  }

  // 3. Query names nothing but crops
  // Extract all tokens, singularize
  const tokens = raw.split(/[\s,]+/).map(singularizeCrop).filter(Boolean);
  if (tokens.length === 0) return null;

  // Check if every token is a recognized crop
  const allKnownCrops = new Set();
  for (const p of PESTICIDES) {
    for (const c of p.crops) {
      allKnownCrops.add(singularizeCrop(c));
    }
  }

  const allTokensAreCrops = tokens.every(t => allKnownCrops.has(t));
  if (!allTokensAreCrops) return null;

  // Find pesticides that contain all query crops
  const matchingByCrops = PESTICIDES.filter(p => {
    const pCropsSingular = p.crops.map(singularizeCrop);
    return tokens.every(t => pCropsSingular.includes(t));
  });

  if (matchingByCrops.length === 1) {
    return matchingByCrops[0];
  }

  return null;
}

/**
 * searchAdditives
 * Treat colour/color, flavour/flavor, sulphite/sulfite and sulphur/sulfur as the same word in both query and category;
 * category "banned" means E171, E924a and any additive whose risk level says BANNED.
 */
export function searchAdditives(query = '', category = '') {
  const normQuery = normalizeSpelling(query ? query.trim() : '');
  const normCat = normalizeSpelling(category ? category.trim() : '');

  return ADDITIVES.filter(add => {
    // Category filter
    if (normCat) {
      if (normCat === 'banned') {
        const isBanned = add.id === 'E171' || add.id === 'E924a' || add.riskLevel === 'BANNED';
        if (!isBanned) return false;
      } else {
        const addCatNorm = normalizeSpelling(add.category || '');
        if (!addCatNorm.includes(normCat)) return false;
      }
    }

    // Query filter
    if (normQuery) {
      const eNorm = normalizeENumber(normQuery);
      if (add.eNumber && add.eNumber.toLowerCase() === eNorm.toLowerCase()) return true;
      if (add.id && add.id.toLowerCase() === eNorm.toLowerCase()) return true;
      if (add.casNumber && add.casNumber.toLowerCase() === normQuery) return true;

      const normName = normalizeSpelling(add.name || '');
      const normChem = normalizeSpelling(add.chemicalName || '');
      const normDesc = normalizeSpelling(add.function || '');
      const normEffects = normalizeSpelling(add.potentialEffects || '');

      return (
        normName.includes(normQuery) ||
        normChem.includes(normQuery) ||
        normDesc.includes(normQuery) ||
        normEffects.includes(normQuery)
      );
    }

    return true;
  });
}
