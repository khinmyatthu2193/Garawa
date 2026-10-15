import 'server-only';

export function isAllowedMutationOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return !appUrl || origin === appUrl.replace(/\/$/, '');
}

export function hasAcceptableBodySize(request: Request, maxBytes = 16_384) {
  const length = request.headers.get('content-length');
  return !length || Number(length) <= maxBytes;
}
