import { createClient } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.role !== 'authenticated')
    return NextResponse.redirect(new URL('/admin', request.url));

  return response;
}

export const config = {
  matcher: '/write',
};
