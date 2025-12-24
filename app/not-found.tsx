import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0F',
      color: '#FFFFFF',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Page non trouvée
        </h2>
        <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            style={{
              backgroundColor: '#F59E0B',
              color: '#0A0A0F',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Retour au Dashboard
          </Link>
          <Link
            href="/"
            style={{
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: '2px solid #9333EA',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Page d'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

