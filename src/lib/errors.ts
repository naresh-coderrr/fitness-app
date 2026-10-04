type ErrorShape = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

function asErrorShape(error: unknown): ErrorShape {
  if (typeof error === 'object' && error !== null) {
    return error as ErrorShape;
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  return {};
}

export function toUserMessage(error: unknown): string {
  const shape = asErrorShape(error);
  const message = (shape.message ?? '').toLowerCase();
  const code = String(shape.code ?? '');
  const name = shape.name ?? '';

  if (name === 'MissingSupabaseConfigError' && shape.message) {
    return shape.message;
  }

  if (
    code === '23505' ||
    code === 'user_already_exists' ||
    message.includes('already registered') ||
    message.includes('user already registered')
  ) {
    return 'That email is already registered.';
  }

  if (
    code === 'invalid_credentials' ||
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials')
  ) {
    return 'That email or password is incorrect.';
  }

  if (
    shape.status === 429 ||
    code === 'over_email_send_rate_limit' ||
    message.includes('rate limit')
  ) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (code === '42501' || message.includes('row-level security')) {
    return "You don't have permission to do that.";
  }

  if (
    name === 'TypeError' ||
    message.includes('network request failed') ||
    message.includes('failed to fetch') ||
    message.includes('network error')
  ) {
    return 'Check your connection and try again.';
  }

  return 'Something went wrong. Please try again.';
}
