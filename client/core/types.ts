export type Language = 'en' | 'hi' | 'ta';

export type Domain = 
  | 'pest_outbreak'
  | 'crop_disease'
  | 'water_stress'
  | 'soil_issue'
  | 'weather_alert'
  | 'irrigation_problem';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface TranscriptionResult {
  text: string;
  language: Language;
  confidence: number;
}

export interface DomainClassification {
  domain: Domain;
  confidence: number;
}

export interface NLUResult {
  issue: string;
  severity: Severity;
  location: string;
  entities: string[];
  summary_local: string;
  summary_en: string;
}

export interface Report {
  id: string;
  timestamp: number;
  audio_duration: number;
  language: Language;
  transcription: string;
  domain: Domain;
  severity: Severity;
  issue: string;
  location: string;
  geoLocation?: GeoLocation;
  entities: string[];
  summary_local: string;
  summary_en: string;
  synced: boolean;
  fieldWorkerNote?: string;
}
