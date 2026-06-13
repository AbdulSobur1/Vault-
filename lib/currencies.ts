export interface SupportedCurrency {
  code: string;       // ISO 4217
  name: string;
  symbol: string;
  flag: string;       // emoji flag
  decimals: number;   // decimal places to display
  region: string;
}

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'NGN', name: 'Nigerian Naira',       symbol: '₦',  flag: '🇳🇬', decimals: 2, region: 'Africa'        },
  { code: 'USD', name: 'US Dollar',            symbol: '$',  flag: '🇺🇸', decimals: 2, region: 'Americas'      },
  { code: 'GBP', name: 'British Pound',        symbol: '£',  flag: '🇬🇧', decimals: 2, region: 'Europe'        },
  { code: 'EUR', name: 'Euro',                 symbol: '€',  flag: '🇪🇺', decimals: 2, region: 'Europe'        },
  { code: 'CAD', name: 'Canadian Dollar',      symbol: 'C$', flag: '🇨🇦', decimals: 2, region: 'Americas'      },
  { code: 'AUD', name: 'Australian Dollar',    symbol: 'A$', flag: '🇦🇺', decimals: 2, region: 'Oceania'       },
  { code: 'AED', name: 'UAE Dirham',           symbol: 'د.إ',flag: '🇦🇪', decimals: 2, region: 'Middle East'   },
  { code: 'SAR', name: 'Saudi Riyal',          symbol: '﷼',  flag: '🇸🇦', decimals: 2, region: 'Middle East'   },
  { code: 'GHS', name: 'Ghanaian Cedi',        symbol: '₵',  flag: '🇬🇭', decimals: 2, region: 'Africa'        },
  { code: 'KES', name: 'Kenyan Shilling',      symbol: 'KSh',flag: '🇰🇪', decimals: 2, region: 'Africa'        },
  { code: 'ZAR', name: 'South African Rand',   symbol: 'R',  flag: '🇿🇦', decimals: 2, region: 'Africa'        },
  { code: 'INR', name: 'Indian Rupee',         symbol: '₹',  flag: '🇮🇳', decimals: 2, region: 'Asia'          },
  { code: 'CNY', name: 'Chinese Yuan',         symbol: '¥',  flag: '🇨🇳', decimals: 2, region: 'Asia'          },
  { code: 'JPY', name: 'Japanese Yen',         symbol: '¥',  flag: '🇯🇵', decimals: 0, region: 'Asia'          },
  { code: 'CHF', name: 'Swiss Franc',          symbol: 'Fr', flag: '🇨🇭', decimals: 2, region: 'Europe'        },
  { code: 'BRL', name: 'Brazilian Real',       symbol: 'R$', flag: '🇧🇷', decimals: 2, region: 'Americas'      },
  { code: 'MXN', name: 'Mexican Peso',         symbol: '$',  flag: '🇲🇽', decimals: 2, region: 'Americas'      },
  { code: 'EGP', name: 'Egyptian Pound',       symbol: 'E£', flag: '🇪🇬', decimals: 2, region: 'Africa'        },
  { code: 'TZS', name: 'Tanzanian Shilling',   symbol: 'TSh',flag: '🇹🇿', decimals: 2, region: 'Africa'        },
  { code: 'XOF', name: 'West African CFA',     symbol: 'Fr', flag: '🌍',  decimals: 0, region: 'Africa'        },
];

export const getCurrency = (code: string): SupportedCurrency | undefined =>
  SUPPORTED_CURRENCIES.find(c => c.code === code);

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currency?.decimals ?? 2,
    maximumFractionDigits: currency?.decimals ?? 2,
  }).format(amount);
}
