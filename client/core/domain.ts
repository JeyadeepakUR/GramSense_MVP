import type { Domain, DomainClassification } from './types';

// Agricultural domain-specific keyword dictionaries
const DOMAIN_KEYWORDS: Record<Domain, { hi: string[]; ta: string[]; en: string[] }> = {
  pest_outbreak: {
    hi: ['कीड़े', 'कीट', 'टिड्डी', 'इल्ली', 'फैल', 'हमला', 'नुकसान', 'खा रहे'],
    ta: ['பூச்சி', 'வெட்டுக்கிளி', 'புழு', 'தாக்குதல்', 'பரவல்', 'சேதம்'],
    en: ['pest', 'insect', 'locust', 'caterpillar', 'infestation', 'attack', 'damage', 'eating', 'outbreak']
  },
  crop_disease: {
    hi: ['बीमारी', 'रोग', 'पत्ते', 'सूख', 'पीला', 'धब्बे', 'झुलस', 'मुरझा'],
    ta: ['நோய்', 'இலை', 'வாடுதல்', 'மஞ்சள்', 'புள்ளி', 'உலர்வு'],
    en: ['disease', 'blight', 'leaf', 'wilt', 'yellow', 'spots', 'fungal', 'rot', 'infection']
  },
  water_stress: {
    hi: ['पानी', 'सूखा', 'सिंचाई', 'कम', 'नहीं', 'बारिश', 'वर्षा'],
    ta: ['தண்ணீர்', 'வறட்சி', 'நீர்ப்பாசனம்', 'பற்றாக்குறை', 'மழை'],
    en: ['water', 'drought', 'irrigation', 'shortage', 'dry', 'rain', 'moisture', 'stress']
  },
  soil_issue: {
    hi: ['मिट्टी', 'जमीन', 'खारा', 'बंजर', 'कटाव', 'उपजाऊ नहीं'],
    ta: ['மண்', 'உவர்', 'அரிப்பு', 'மலட்டு', 'வளம்'],
    en: ['soil', 'land', 'erosion', 'saline', 'barren', 'infertile', 'degradation', 'compaction']
  },
  weather_alert: {
    hi: ['मौसम', 'तूफान', 'ओला', 'आंधी', 'बादल', 'गर्मी', 'ठंड'],
    ta: ['வானிலை', 'புயல்', 'கல்மழை', 'காற்று', 'வெப்பம்'],
    en: ['weather', 'storm', 'hail', 'wind', 'heat', 'cold', 'frost', 'cyclone', 'alert']
  },
  irrigation_problem: {
    hi: ['पाइप', 'पंप', 'नहर', 'टूटा', 'बंद', 'रिसाव', 'मोटर'],
    ta: ['குழாய்', 'மோட்டார்', 'கால்வாய்', 'உடைந்த', 'கசிவு', 'பம்ப்'],
    en: ['pipe', 'pump', 'canal', 'broken', 'leak', 'motor', 'valve', 'channel', 'blocked']
  }
};

export function classifyDomain(text: string): DomainClassification {
  const normalizedText = text.toLowerCase();
  const scores: Record<Domain, number> = {
    pest_outbreak: 0,
    crop_disease: 0,
    water_stress: 0,
    soil_issue: 0,
    weather_alert: 0,
    irrigation_problem: 0
  };

  // Count keyword matches for each domain
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const allKeywords = [...keywords.hi, ...keywords.ta, ...keywords.en];
    
    for (const keyword of allKeywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        scores[domain as Domain]++;
      }
    }
  }

  // Find domain with highest score
  let maxDomain: Domain = 'crop_disease';
  let maxScore = 0;

  for (const [domain, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxDomain = domain as Domain;
    }
  }

  // If no matches, default to crop_disease
  if (maxScore === 0) {
    maxDomain = 'crop_disease';
    maxScore = 1;
  }

  const confidence = Math.min(maxScore / 5, 1.0);

  console.log('Domain classification:', { domain: maxDomain, confidence, scores });

  return {
    domain: maxDomain,
    confidence
  };
}
