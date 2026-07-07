import { EMAIL_NOT_CONFIGURED_CODE, EMAIL_NOT_CONFIGURED_MESSAGE } from './email';

export async function handleEmailApiResponse(response: Response): Promise<{ ok: true } | { ok: false; message: string }> {
  if (response.ok) {
    return { ok: true };
  }

  let payload: { error?: string; message?: string } = {};
  try {
    payload = await response.json();
  } catch {
    // ignore parse errors
  }

  if (payload.error === EMAIL_NOT_CONFIGURED_CODE || response.status === 503) {
    return {
      ok: false,
      message: payload.message || EMAIL_NOT_CONFIGURED_MESSAGE,
    };
  }

  return {
    ok: false,
    message: payload.message || payload.error || 'Failed to send email. Please try again later.',
  };
}
