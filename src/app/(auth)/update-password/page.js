'use client'

import { useActionState } from 'react'
import { updatePassword } from '@/actions/auth'

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)

  return (
    <form action={formAction}>
      <h1>Nova lozinka</h1>

      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <div>
        <label htmlFor="password">Nova lozinka</label>
        <input id="password" name="password" type="password" required minLength={6} />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Čuvanje...' : 'Sačuvaj novu lozinku'}
      </button>
    </form>
  )
}