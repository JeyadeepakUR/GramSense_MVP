import type { Language, Domain, NLUResult, Severity } from './types';

// Extract entities, severity, location, and generate summaries
export function extractNLU(
  text: string, 
  language: Language,
  domain: Domain
): NLUResult {
  const entities = extractEntities(text, domain);
  const severity = detectSeverity(text, language);
  const location = extractLocation(text, language);
  const issue = extractIssue(text, domain);
  
  const summary_local = generateSummary(text, issue, severity, location, entities, domain, language);
  const summary_en = generateEnglishSummary(text, issue, severity, location, entities, domain, language);
  
  return {
    issue,
    severity,
    location,
    entities,
    summary_local,
    summary_en
  };
}

function extractEntities(text: string, domain: Domain): string[] {
  const entities: string[] = [];
  const normalizedText = text.toLowerCase();
  
  // Domain-specific entity patterns for agricultural observations
  const entityPatterns: Record<Domain, RegExp[]> = {
    pest_outbreak: [
      /धान|गेहूं|मक्का|कपास|टमाटर|कीड़े|टिड्डी|इल्ली/gi,
      /நெல்|கோதுமை|சோளம்|பருத்தி|தக்காளி|பூச்சி|வெட்டுக்கிளி/gi,
      /rice|wheat|corn|cotton|tomato|potato|pest|locust|caterpillar|aphid/gi
    ],
    crop_disease: [
      /धान|गेहूं|बीमारी|पत्ते|फंगस|फफूंद/gi,
      /நெல்|கோதுமை|நோய்|இலை|பூஞ்சை/gi,
      /rice|wheat|disease|blight|fungal|leaf|rot|wilt/gi
    ],
    water_stress: [
      /पानी|सिंचाई|सूखा|बारिश|नमी/gi,
      /தண்ணீர்|நீர்ப்பாசனம்|வறட்சி|மழை/gi,
      /water|irrigation|drought|rain|moisture/gi
    ],
    soil_issue: [
      /मिट्टी|खारा|उर्वरक|खाद|पोषक/gi,
      /மண்|உவர்|உரம்|ஊட்டச்சத்து/gi,
      /soil|saline|fertilizer|nutrient|erosion/gi
    ],
    weather_alert: [
      /मौसम|तूफान|ओला|तापमान|गर्मी/gi,
      /வானிலை|புயல்|கல்மழை|வெப்பநிலை/gi,
      /weather|storm|hail|temperature|heat|frost/gi
    ],
    irrigation_problem: [
      /पाइप|पंप|मोटर|नहर|रिसाव/gi,
      /குழாய்|மோட்டார்|பம்ப்|கால்வாய்/gi,
      /pipe|pump|motor|canal|leak|valve/gi
    ]
  };
  
  const patterns = entityPatterns[domain] || [];
  for (const pattern of patterns) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      entities.push(...matches);
    }
  }
  
  return [...new Set(entities)]; // Remove duplicates
}

function detectSeverity(text: string, language: Language): Severity {
  const normalizedText = text.toLowerCase();
  
  const severityKeywords = {
    critical: {
      hi: ['तुरंत', 'जरूरी', 'खतरनाक', 'गंभीर', 'बहुत'],
      ta: ['உடனடி', 'அவசரம்', 'ஆபத்தான', 'தீவிர'],
      en: ['urgent', 'emergency', 'critical', 'dangerous', 'severe', 'immediately']
    },
    high: {
      hi: ['बहुत', 'ज्यादा', 'अधिक'],
      ta: ['மிக', 'அதிகம்'],
      en: ['very', 'much', 'serious', 'major']
    },
    medium: {
      hi: ['समस्या', 'दिक्कत', 'परेशानी'],
      ta: ['பிரச்சினை', 'சிரமம்'],
      en: ['problem', 'issue', 'difficulty']
    }
  };
  
  // Check for critical keywords
  const criticalWords = severityKeywords.critical[language] || severityKeywords.critical.en;
  if (criticalWords.some(word => normalizedText.includes(word))) {
    return 'critical';
  }
  
  // Check for high severity
  const highWords = severityKeywords.high[language] || severityKeywords.high.en;
  if (highWords.some(word => normalizedText.includes(word))) {
    return 'high';
  }
  
  // Check for medium severity
  const mediumWords = severityKeywords.medium[language] || severityKeywords.medium.en;
  if (mediumWords.some(word => normalizedText.includes(word))) {
    return 'medium';
  }
  
  return 'low';
}

function extractLocation(text: string, _language: Language): string {
  // Extract location mentions
  const locationPatterns = [
    /(?:near|at|in|पास|में|அருகில்|இல்)\s+([^\s,\.]+(?:\s+[^\s,\.]+){0,2})/gi
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      return match[0].trim();
    }
  }
  
  return '';
}

function extractIssue(text: string, _domain: Domain): string {
  // Extract the main issue from text
  // For now, use the first sentence or up to 100 chars
  const firstSentence = text.split(/[।|।|\.|\?]/)[0].trim();
  return firstSentence.substring(0, 100);
}

function generateSummary(
  originalText: string,
  issue: string,
  severity: Severity,
  location: string,
  entities: string[],
  domain: Domain,
  language: Language
): string {
  // For local language, keep original text with minimal formatting
  const prefix = severity === 'critical' || severity === 'high' 
    ? (language === 'hi' ? 'तत्काल कार्रवाई आवश्यक' : language === 'ta' ? 'உடனடி நடவடிக்கை தேவை' : 'Urgent Action Required')
    : (language === 'hi' ? 'क्षेत्र रिपोर्ट' : language === 'ta' ? 'வயல் அறிக்கை' : 'Field Report');
  
  return `${prefix}: ${originalText}`;
}

function generateEnglishSummary(
  originalText: string,
  issue: string,
  severity: Severity,
  location: string,
  entities: string[],
  domain: Domain,
  sourceLanguage: Language
): string {
  // If already English, return formatted version
  if (sourceLanguage === 'en') {
    const prefix = severity === 'critical' || severity === 'high' 
      ? 'Urgent Action Required' 
      : 'Field Report';
    return `${prefix}: ${originalText}`;
  }
  
  // For Hindi/Tamil, generate English summary from domain and entities
  const prefix = severity === 'critical' || severity === 'high' 
    ? 'Urgent Action Required' 
    : 'Field Report';
  
  const domainDescriptions: Record<Domain, string> = {
    pest_outbreak: 'Pest outbreak detected',
    crop_disease: 'Crop disease identified',
    water_stress: 'Water stress reported',
    soil_issue: 'Soil issue detected',
    weather_alert: 'Weather alert issued',
    irrigation_problem: 'Irrigation problem reported'
  };
  
  const parts = [prefix, domainDescriptions[domain]];
  
  if (entities.length > 0) {
    parts.push(`Affected: ${entities.join(', ')}`);
  }
  
  if (location) {
    parts.push(`Location: ${location}`);
  }
  
  // Add severity level
  parts.push(`Severity: ${severity.toUpperCase()}`);
  
  return parts.join('. ');
}
