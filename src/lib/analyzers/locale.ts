const BCP47_REGEX = /^([a-z]{2,3})(?:-([a-z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?(?:-[a-zA-Z0-9]{5,8}|-[0-9][a-zA-Z0-9]{3})*$/i;

const LANG_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ru: 'Russian',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
  id: 'Indonesian',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  el: 'Greek',
  he: 'Hebrew',
  uk: 'Ukrainian',
  cs: 'Czech',
  ro: 'Romanian',
  hu: 'Hungarian',
  sk: 'Slovak',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sr: 'Serbian',
  sl: 'Slovenian',
  lt: 'Lithuanian',
  lv: 'Latvian',
  et: 'Estonian',
};

const SCRIPT_NAMES: Record<string, string> = {
  Hans: 'Simplified Chinese',
  Hant: 'Traditional Chinese',
  Latn: 'Latin',
  Cyrl: 'Cyrillic',
  Arab: 'Arabic',
  Deva: 'Devanagari',
};

const REGION_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  BR: 'Brazil',
  CA: 'Canada',
  AU: 'Australia',
  IN: 'India',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  JP: 'Japan',
  CN: 'China',
  KR: 'South Korea',
  RU: 'Russia',
  MX: 'Mexico',
  PT: 'Portugal',
  NL: 'Netherlands',
  PL: 'Poland',
  TR: 'Turkey',
  TW: 'Taiwan',
  HK: 'Hong Kong',
  SG: 'Singapore',
  MY: 'Malaysia',
  TH: 'Thailand',
  ID: 'Indonesia',
  VN: 'Vietnam',
  PH: 'Philippines',
  ZA: 'South Africa',
  NG: 'Nigeria',
  EG: 'Egypt',
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  IL: 'Israel',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  AT: 'Austria',
  CH: 'Switzerland',
  BE: 'Belgium',
  IE: 'Ireland',
  NZ: 'New Zealand',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
};

export interface LocaleResult {
  type: 'locale';
  language: string;
  languageLabel: string;
  script: string | null;
  scriptLabel: string | null;
  region: string | null;
  regionLabel: string | null;
  readable: string;
}

export function detectLocale(value: string): LocaleResult | null {
  const v = value.trim();
  if (!v || v.length < 2) return null;
  const m = v.match(BCP47_REGEX);
  if (!m) return null;
  const [, lang, script, region] = m;
  if (!lang) return null;
  const langLower = lang.toLowerCase();
  const languageLabel = LANG_NAMES[langLower] ?? langLower;
  const scriptLabel = script ? (SCRIPT_NAMES[script] ?? script) : null;
  const regionLabel = region ? (REGION_NAMES[region.toUpperCase()] ?? region) : null;
  const parts = [languageLabel];
  if (scriptLabel) parts.push(scriptLabel);
  if (regionLabel) parts.push(regionLabel);
  return {
    type: 'locale',
    language: langLower,
    languageLabel,
    script: script ?? null,
    scriptLabel,
    region: region ?? null,
    regionLabel,
    readable: parts.join(' · '),
  };
}
