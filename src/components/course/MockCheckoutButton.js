'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MockCheckoutButton({ userId, courseId, moduleId = null, buttonText }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = async () => {
    if (!userId) {
      alert('Morate biti ulogovani da biste kupili.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/webhooks/mock-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId,
          moduleId,
          purchaseType: moduleId ? 'module' : 'course'
        })
      })

      if (res.ok) {
        alert('Mock kupovina uspešna! Sadržaj je otključan.')
        router.refresh() // Osvežava trenutnu stranicu da bi se prikazale promene iz baze
      } else {
        alert('Došlo je do greške pri kupovini.')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handlePurchase} 
      disabled={loading}
      style={{
        padding: '8px 16px',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '10px'
      }}
    >
      {loading ? 'Procesiranje...' : buttonText}
    </button>
  )
}