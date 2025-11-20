export type AppLanguage = 'hi' | 'ta' | 'en';

interface Translations {
  appName: string;
  tagline: string;
  recordButton: string;
  stopButton: string;
  processing: string;
  instruction: string;
  history: string;
  languageLabel: string;
  summaryTitle: string;
  localSummary: string;
  englishSummary: string;
  entities: string;
  editButton: string;
  saveButton: string;
  confirmButton: string;
  backButton: string;
  reportSaved: string;
  historyTitle: string;
  noReports: string;
  deleteButton: string;
  confirmDelete: string;
  location: string;
  accuracy: string;
}

export const translations: Record<AppLanguage, Translations> = {
  hi: {
    appName: 'कृषि सेंस',
    tagline: 'खेत से डेटा, निर्णय तक',
    recordButton: 'रिपोर्ट दर्ज करें',
    stopButton: 'रुकें',
    processing: 'प्रोसेस हो रहा है...',
    instruction: 'अपनी खेत की स्थिति बताएं',
    history: 'रिपोर्ट इतिहास',
    languageLabel: 'भाषा',
    summaryTitle: 'रिपोर्ट सारांश',
    localSummary: 'स्थानीय सारांश',
    englishSummary: 'English Summary',
    entities: 'मुख्य जानकारी',
    editButton: 'संपादित करें',
    saveButton: 'सहेजें',
    confirmButton: 'पुष्टि करें',
    backButton: 'वापस',
    reportSaved: 'रिपोर्ट सफलतापूर्वक सहेजी गई!',
    historyTitle: 'रिपोर्ट इतिहास',
    noReports: 'कोई रिपोर्ट नहीं',
    deleteButton: 'हटाएं',
    confirmDelete: 'क्या आप इस रिपोर्ट को हटाना चाहते हैं?',
    location: 'स्थान',
    accuracy: 'सटीकता'
  },
  ta: {
    appName: 'விவசாய சென்ஸ்',
    tagline: 'வயலிலிருந்து தரவு, முடிவுக்கு',
    recordButton: 'அறிக்கை பதிவு செய்யவும்',
    stopButton: 'நிறுத்து',
    processing: 'செயலாக்கம்...',
    instruction: 'உங்கள் வயல் நிலையை பகிரவும்',
    history: 'அறிக்கை வரலாறு',
    languageLabel: 'மொழி',
    summaryTitle: 'அறிக்கை சுருக்கம்',
    localSummary: 'உள்ளூர் சுருக்கம்',
    englishSummary: 'English Summary',
    entities: 'முக்கிய தகவல்',
    editButton: 'திருத்து',
    saveButton: 'சேமி',
    confirmButton: 'உறுதிப்படுத்து',
    backButton: 'திரும்பு',
    reportSaved: 'அறிக்கை வெற்றிகரமாக சேமிக்கப்பட்டது!',
    historyTitle: 'அறிக்கை வரலாறு',
    noReports: 'அறிக்கைகள் இல்லை',
    deleteButton: 'நீக்கு',
    confirmDelete: 'இந்த அறிக்கையை நீக்க விரும்புகிறீர்களா?',
    location: 'இடம்',
    accuracy: 'துல்லியம்'
  },
  en: {
    appName: 'AgriSense',
    tagline: 'Field Data to Decision Makers',
    recordButton: 'Record Report',
    stopButton: 'Stop',
    processing: 'Processing...',
    instruction: 'Share your field observation',
    history: 'Report History',
    languageLabel: 'Language',
    summaryTitle: 'Report Summary',
    localSummary: 'Local Summary',
    englishSummary: 'English Summary',
    entities: 'Key Information',
    editButton: 'Edit',
    saveButton: 'Save',
    confirmButton: 'Confirm',
    backButton: 'Back',
    reportSaved: 'Report saved successfully!',
    historyTitle: 'Report History',
    noReports: 'No reports yet',
    deleteButton: 'Delete',
    confirmDelete: 'Are you sure you want to delete this report?',
    location: 'Location',
    accuracy: 'Accuracy'
  }
};
