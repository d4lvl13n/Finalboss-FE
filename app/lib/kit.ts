// ConvertKit (Kit) API client — https://developers.kit.com/api-reference
const KIT_API_URL = 'https://api.kit.com/v4';
const KIT_API_KEY = process.env.KIT_API_KEY ?? '';

async function kitFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (!KIT_API_KEY) {
    throw new Error('KIT_API_KEY is not configured');
  }

  const res = await fetch(`${KIT_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': KIT_API_KEY,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Kit API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export interface CreateSubscriberParams {
  emailAddress: string;
  firstName?: string;
  state?: 'active' | 'inactive';
  fields?: Record<string, string>;
}

export async function createSubscriber(params: CreateSubscriberParams) {
  return kitFetch<{ subscriber: Record<string, unknown> }>('/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email_address: params.emailAddress,
      first_name: params.firstName || 'Subscriber',
      state: params.state ?? 'active',
      ...(params.fields ? { fields: params.fields } : {}),
    }),
  });
}
