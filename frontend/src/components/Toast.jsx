import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const colors = { info: 'var(--primary)', success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)' }

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--surface2)',
            border: `1px solid ${colors[t.type]}44`,
            borderLeft: `3px solid ${colors[t.type]}`,
            color: 'var(--text)',
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            minWidth: 220,
            boxShadow: `0 4px 20px rgba(0,0,0,.4)`,
            animation: 'fadeInUp .3s ease',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
