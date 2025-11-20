import { transcribeAudio, detectLanguage } from './asr';
import { classifyDomain } from './domain';
import { extractNLU } from './nlu';
import { captureGeoLocation } from './geolocation';
import type { Report, Language } from './types';

export async function processAudio(audioBlob: Blob): Promise<Report> {
  // Step 1: Convert audio to PCM and transcribe
  const transcriptionResult = await transcribeAudio(audioBlob);
  
  // Step 2: Classify domain
  const domainResult = classifyDomain(transcriptionResult.text);
  
  // Step 3: Extract NLU
  const nluResult = extractNLU(
    transcriptionResult.text, 
    transcriptionResult.language,
    domainResult.domain
  );
  
  // Step 4: Create report
  const report: Report = {
    id: generateId(),
    timestamp: Date.now(),
    audio_duration: 0, // Will be calculated from audio
    language: transcriptionResult.language,
    transcription: transcriptionResult.text,
    domain: domainResult.domain,
    severity: nluResult.severity,
    issue: nluResult.issue,
    location: nluResult.location,
    entities: nluResult.entities,
    summary_local: nluResult.summary_local,
    summary_en: nluResult.summary_en,
    synced: false
  };
  
  return report;
}

/**
 * Process audio with pre-transcribed text (for Web Speech API)
 * Includes geo-location capture for field reporting
 */
export async function processAudioWithTranscript(audioBlob: Blob, transcript: string): Promise<Report> {
  console.log('Processing with transcript:', transcript);
  
  // Step 1: Capture geo-location (async, don't block processing)
  const geoLocationPromise = captureGeoLocation();
  
  // Step 2: Detect language from transcript
  const language = detectLanguage(transcript);
  
  // Step 3: Classify domain
  const domainResult = classifyDomain(transcript);
  
  // Step 4: Extract NLU
  const nluResult = extractNLU(
    transcript, 
    language,
    domainResult.domain
  );
  
  // Step 5: Wait for geo-location
  const geoLocation = await geoLocationPromise;
  
  // Step 6: Create report
  const report: Report = {
    id: generateId(),
    timestamp: Date.now(),
    audio_duration: 0,
    language: language,
    transcription: transcript,
    domain: domainResult.domain,
    severity: nluResult.severity,
    issue: nluResult.issue,
    location: nluResult.location,
    geoLocation: geoLocation,
    entities: nluResult.entities,
    summary_local: nluResult.summary_local,
    summary_en: nluResult.summary_en,
    synced: false
  };
  
  return report;
}

function generateId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
