const E164_REGEX = /^\+?([1-9]\d{0,2})[\s.-]*(\d[\s.-]*){6,14}\d$/;
const DIGITS_ONLY = /^\+?[\d\s.-]+$/;

const COUNTRY_CODES: Record<string, string> = {
  '1': 'US/CA',
  '7': 'RU/KZ',
  '20': 'EG',
  '27': 'ZA',
  '30': 'GR',
  '31': 'NL',
  '32': 'BE',
  '33': 'FR',
  '34': 'ES',
  '36': 'HU',
  '39': 'IT',
  '40': 'RO',
  '41': 'CH',
  '43': 'AT',
  '44': 'UK',
  '45': 'DK',
  '46': 'SE',
  '47': 'NO',
  '48': 'PL',
  '49': 'DE',
  '51': 'PE',
  '52': 'MX',
  '53': 'CU',
  '54': 'AR',
  '55': 'BR',
  '56': 'CL',
  '57': 'CO',
  '58': 'VE',
  '60': 'MY',
  '61': 'AU',
  '62': 'ID',
  '63': 'PH',
  '64': 'NZ',
  '65': 'SG',
  '66': 'TH',
  '81': 'JP',
  '82': 'KR',
  '84': 'VN',
  '86': 'CN',
  '91': 'IN',
  '92': 'PK',
  '93': 'AF',
  '94': 'LK',
  '98': 'IR',
  '212': 'MA',
  '213': 'DZ',
  '216': 'TN',
  '218': 'LY',
  '220': 'GM',
  '221': 'SN',
  '222': 'MR',
  '223': 'ML',
  '224': 'GN',
  '225': 'CI',
  '226': 'BF',
  '227': 'NE',
  '228': 'TG',
  '229': 'BJ',
  '230': 'MU',
  '231': 'LR',
  '232': 'SL',
  '233': 'GH',
  '234': 'NG',
  '235': 'TD',
  '236': 'CF',
  '237': 'CM',
  '238': 'CV',
  '239': 'ST',
  '240': 'GQ',
  '241': 'GA',
  '242': 'CG',
  '243': 'CD',
  '244': 'AO',
  '245': 'GW',
  '246': 'IO',
  '248': 'SC',
  '249': 'SD',
  '250': 'RW',
  '251': 'ET',
  '252': 'SO',
  '253': 'DJ',
  '254': 'KE',
  '255': 'TZ',
  '256': 'UG',
  '257': 'BI',
  '258': 'MZ',
  '260': 'ZM',
  '261': 'MG',
  '262': 'RE',
  '263': 'ZW',
  '264': 'NA',
  '265': 'MW',
  '266': 'LS',
  '267': 'BW',
  '268': 'SZ',
  '269': 'KM',
  '290': 'SH',
  '291': 'ER',
  '297': 'AW',
  '298': 'FO',
  '299': 'GL',
  '350': 'GI',
  '351': 'PT',
  '352': 'LU',
  '353': 'IE',
  '354': 'IS',
  '355': 'AL',
  '356': 'MT',
  '357': 'CY',
  '358': 'FI',
  '359': 'BG',
  '370': 'LT',
  '371': 'LV',
  '372': 'EE',
  '373': 'MD',
  '374': 'AM',
  '375': 'BY',
  '376': 'AD',
  '377': 'MC',
  '378': 'SM',
  '379': 'VA',
  '380': 'UA',
  '381': 'RS',
  '382': 'ME',
  '383': 'XK',
  '385': 'HR',
  '386': 'SI',
  '387': 'BA',
  '389': 'MK',
  '420': 'CZ',
  '421': 'SK',
  '423': 'LI',
  '500': 'FK',
  '501': 'BZ',
  '502': 'GT',
  '503': 'SV',
  '504': 'HN',
  '505': 'NI',
  '506': 'CR',
  '507': 'PA',
  '508': 'PM',
  '509': 'HT',
  '590': 'GP',
  '591': 'BO',
  '592': 'GY',
  '593': 'EC',
  '594': 'GF',
  '595': 'PY',
  '596': 'MQ',
  '597': 'SR',
  '598': 'UY',
  '599': 'CW',
  '670': 'TL',
  '672': 'NF',
  '673': 'BN',
  '674': 'NR',
  '675': 'PG',
  '676': 'TO',
  '677': 'SB',
  '678': 'VN',
  '679': 'FJ',
  '680': 'PW',
  '681': 'WF',
  '682': 'CK',
  '683': 'NU',
  '685': 'WS',
  '686': 'KI',
  '687': 'NC',
  '688': 'TV',
  '689': 'PF',
  '690': 'TK',
  '691': 'FM',
  '692': 'MH',
  '850': 'KP',
  '852': 'HK',
  '853': 'MO',
  '855': 'KH',
  '856': 'LA',
  '858': 'TW',
  '860': 'CN',
  '880': 'BD',
  '886': 'TW',
  '960': 'MV',
  '961': 'LB',
  '962': 'JO',
  '963': 'SY',
  '964': 'IQ',
  '965': 'KW',
  '966': 'SA',
  '967': 'YE',
  '968': 'OM',
  '970': 'PS',
  '971': 'AE',
  '972': 'IL',
  '973': 'BH',
  '974': 'QA',
  '975': 'BT',
  '976': 'MN',
  '977': 'NP',
  '992': 'TJ',
  '993': 'TM',
  '994': 'AZ',
  '995': 'GE',
  '996': 'KG',
  '998': 'UZ',
};

function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, '');
}

function getCountryCode(normalized: string): string | null {
  if (normalized.startsWith('+')) normalized = normalized.slice(1);
  for (let len = 3; len >= 1; len--) {
    const code = normalized.slice(0, len);
    if (COUNTRY_CODES[code]) return code;
  }
  return null;
}

function formatDisplay(raw: string): string {
  const n = raw.replace(/\D/g, '');
  if (n.length <= 4) return raw.trim();
  if (n.length <= 7) return n.replace(/(\d{3})(\d+)/, '$1-$2');
  if (n.length <= 10)
    return n.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
  return n.replace(/(\d)(\d{3})(\d{3})(\d+)/, '+$1 ($2) $3-$4');
}

export interface PhoneResult {
  type: 'phone';
  countryCode: string | null;
  countryLabel: string;
  normalized: string;
  formatted: string;
  telHref: string;
}

function looksLikeTimestamp(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits !== value.trim() || digits.length < 9) return false;
  const len = digits.length;
  if (len >= 9 && len <= 10) return true;
  if (len >= 12 && len <= 13) return true;
  return false;
}

function looksLikeCodeOrId(value: string): boolean {
  const normalized = value.replace(/[\s.-]/g, '');
  if (normalized.length > 15) return true;
  const parts = value.split(/[.\s-]/).filter(Boolean);
  if (parts.length > 4) return true;
  const hasLongNumericParts = parts.some((p) => p.length > 6 && /^\d+$/.test(p));
  if (hasLongNumericParts && parts.length >= 3) return true;
  const digitRatio = normalized.replace(/\D/g, '').length / normalized.length;
  if (digitRatio > 0.9 && normalized.length > 10) return true;
  return false;
}

export function detectPhone(value: string): PhoneResult | null {
  const v = value.trim();
  if (!v || !DIGITS_ONLY.test(v) || v.replace(/\D/g, '').length < 7) return null;
  if (looksLikeTimestamp(v)) return null;
  if (looksLikeCodeOrId(v)) return null;
  if (!E164_REGEX.test(v)) return null;
  const normalized = normalizePhone(v);
  if (normalized.length < 7 || normalized.length > 15) return null;
  const withPlus = normalized.startsWith('+') ? normalized : '+' + normalized;
  const countryCode = getCountryCode(withPlus);
  if (!countryCode && !normalized.startsWith('+')) return null;
  return {
    type: 'phone',
    countryCode,
    countryLabel: countryCode ? COUNTRY_CODES[countryCode] ?? `+${countryCode}` : 'Unknown',
    normalized: withPlus,
    formatted: formatDisplay(v),
    telHref: 'tel:' + withPlus,
  };
}
