import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Koristimo osnovni paket za Admina

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, courseId, moduleId, purchaseType } = body;

    // Kreiramo Admin klijenta koji preskače RLS pravila
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Upis u transactions
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount: 5000,
        currency: 'RSD',
        status: 'paid',
        payment_provider: 'mock_concept',
        provider_transaction_id: `mock_txn_${Date.now()}`
      });

    if (txError) throw txError;

    // 2. Dodavanje prava pristupa u enrollments
    const { error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        module_id: moduleId || null
      });

    if (enrollError) throw enrollError;

    // 3. Dodavanje prava pristupa za modul
    if (purchaseType === 'module' && moduleId) {
      const { error: moduleAccessError } = await supabaseAdmin
        .from('user_module_access')
        .insert({
          user_id: userId,
          module_id: moduleId
        });

      if (moduleAccessError) throw moduleAccessError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}