const SUDO_API_URL = process.env.SUDO_API_URL!;
const SUDO_VAULT_URL = process.env.SUDO_VAULT_URL!;
const SUDO_API_KEY = process.env.SUDO_API_KEY!;
const SUDO_BUSINESS_ID = process.env.SUDO_BUSINESS_ID!;

// Base headers for all Sudo API requests
const sudoHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUDO_API_KEY}`,
};

// ── CUSTOMERS (Cardholders) ──────────────────────────────────────────

export interface SudoCustomerPayload {
  type: 'individual';
  name: string;
  email: string;
  phoneNumber?: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    country: string;   // ISO 3166-1 alpha-2 e.g. 'NG'
    postalCode: string;
  };
}

export async function createSudoCustomer(payload: SudoCustomerPayload) {
  const res = await fetch(`${SUDO_API_URL}/customers`, {
    method: 'POST',
    headers: sudoHeaders,
    body: JSON.stringify({
      ...payload,
      status: 'active',
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Sudo createCustomer failed: ${err.message ?? res.status}`);
  }

  const data = await res.json();
  return data.data; // returns customer object with _id
}

export async function getSudoCustomer(customerId: string) {
  const res = await fetch(`${SUDO_API_URL}/customers/${customerId}`, {
    headers: sudoHeaders,
  });
  if (!res.ok) throw new Error(`Sudo getCustomer failed: ${res.status}`);
  const data = await res.json();
  return data.data;
}

// ── CARDS ────────────────────────────────────────────────────────────

export type CardCurrency = 'USD' | 'NGN';

export async function createVirtualCard(
  customerId: string,
  currency: CardCurrency = 'USD',
  spendingLimit?: { amount: number; interval: 'daily' | 'weekly' | 'monthly' }
) {
  const body: Record<string, any> = {
    customerId,
    currency,
    type: 'virtual',
    status: 'active',
    debitCurrency: currency,
  };

  if (spendingLimit) {
    body.spendingControls = {
      spendingLimits: [{
        amount: spendingLimit.amount * 100, // Sudo uses kobo/cents
        interval: spendingLimit.interval,
      }],
    };
  }

  const res = await fetch(`${SUDO_VAULT_URL}/cards`, {
    method: 'POST',
    headers: sudoHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Sudo createCard failed: ${err.message ?? res.status}`);
  }

  const data = await res.json();
  return data.data; // { _id, last4, expiryMonth, expiryYear, currency, status, ... }
}

// Reveal full card details (PAN, CVV) — call vault endpoint
// Returns a secure token — use on client to display details
export async function getCardToken(sudoCardId: string): Promise<string> {
  const res = await fetch(`${SUDO_API_URL}/cards/${sudoCardId}/token`, {
    headers: sudoHeaders,
  });

  if (!res.ok) throw new Error(`Sudo getCardToken failed: ${res.status}`);
  const data = await res.json();
  return data.data.token; // JWT token — pass to client to reveal card details
}

// Get full card details from vault (server-side only)
export async function revealCardDetails(sudoCardId: string) {
  const res = await fetch(`${SUDO_VAULT_URL}/cards/${sudoCardId}?reveal=true`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(SUDO_API_KEY + ':').toString('base64')}`,
    },
  });

  if (!res.ok) throw new Error(`Sudo revealCard failed: ${res.status}`);
  const data = await res.json();
  return data.data; // { number, cvv, expiryMonth, expiryYear }
}

// Update card status (freeze/unfreeze)
export async function updateCardStatus(
  sudoCardId: string,
  status: 'active' | 'inactive'
) {
  const res = await fetch(`${SUDO_VAULT_URL}/cards/${sudoCardId}`, {
    method: 'PUT',
    headers: sudoHeaders,
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error(`Sudo updateCard failed: ${res.status}`);
  return (await res.json()).data;
}

// Cancel (terminate) a card permanently
export async function cancelCard(sudoCardId: string) {
  const res = await fetch(`${SUDO_VAULT_URL}/cards/${sudoCardId}`, {
    method: 'PUT',
    headers: sudoHeaders,
    body: JSON.stringify({ status: 'cancelled' }),
  });

  if (!res.ok) throw new Error(`Sudo cancelCard failed: ${res.status}`);
  return (await res.json()).data;
}

// Get card transactions from Sudo
export async function getCardTransactions(sudoCardId: string, limit = 20) {
  const res = await fetch(
    `${SUDO_API_URL}/cards/${sudoCardId}/transactions?limit=${limit}`,
    { headers: sudoHeaders }
  );

  if (!res.ok) throw new Error(`Sudo getTransactions failed: ${res.status}`);
  return (await res.json()).data;
}
