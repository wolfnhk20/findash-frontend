"use client"
import { useEffect, useState } from "react"

export function FinDashAppWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const wakeBackend = async () => {
      try {
        await fetch("https://findash-backend-m4ta.onrender.com/actuator/health")
      } catch {}
      setReady(true)
    }

    wakeBackend()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Starting services...</p>
      </div>
    )
  }

  return <>{children}</>
}