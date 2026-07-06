'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <form action={formAction}>
      <h1>Login</h1>

      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="password">Lozinka</label>
        <input id="password" name="password" type="password" required />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Prijavljivanje...' : 'Prijavi se'}
      </button>
    </form>
  )
}