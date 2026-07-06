'use client'

import { useActionState } from 'react'
import { forgotPassword } from '@/actions/auth'

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null)

  return (
    <form action={formAction}>
      <h1>Zaboravljena lozinka</h1>

      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state?.success && <p style={{ color: 'green' }}>{state.success}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Slanje...' : 'Pošalji link za reset'}
      </button>
    </form>
  )
}