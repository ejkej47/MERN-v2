'use client'

import { useActionState } from 'react'
import { register } from '@/actions/auth'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null)

  return (
    <form action={formAction}>
      <h1>Registracija</h1>

      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state?.success && <p style={{ color: 'green' }}>{state.success}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="password">Lozinka</label>
        <input id="password" name="password" type="password" required minLength={6} />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Slanje...' : 'Registruj se'}
      </button>
    </form>
  )
}