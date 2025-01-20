import { NextResponse } from 'next/server';
export function middleware(request) {
  const response = NextResponse.next();
  // Get CSRF token from cookie
  const csrfToken = request.cookies.get('csrftoken');
  // Add CSRF token to response headers if it exists
  if (csrfToken) {
    response.headers.set('X-CSRFToken', csrfToken.value);
  }
  return response;
}
export const config = {
  matcher: '/login',
}