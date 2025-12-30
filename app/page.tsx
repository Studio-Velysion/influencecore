import { getServerSessionWithTest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import HomeButton from '@/components/common/HomeButton'

export default async function Home() {
  // Mode "test" (dev / démo) : on affiche un bandeau d’info si activé.
  // ⚠️ Doit être défini ici pour éviter l’erreur TypeScript "Cannot find name 'isTestMode'" en build.
  const isTestMode =
    process.env.INFLUENCECORE_TEST_MODE === 'true' ||
    process.env.TEST_MODE === 'true' ||
    process.env.NEXT_PUBLIC_TEST_MODE === 'true'

  const testUserType = (process.env.INFLUENCECORE_TEST_USER_TYPE || 'admin') as
    | 'admin'
    | 'client'

  try {
    // Timeout pour éviter les blocages
    const session = await Promise.race([
      getServerSessionWithTest(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
    ])

    // Si connecté, rediriger vers le dashboard
    if (session) {
      redirect('/dashboard')
    }

    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        backgroundColor: '#0A0A0F',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          width: '100%', 
          textAlign: 'center',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            InfluenceCore
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '1rem',
            fontWeight: '500',
            color: '#E5E7EB'
          }}>
            Plateforme de gestion pour créateurs de contenu
          </p>
          
          <p style={{
            color: '#9CA3AF',
            marginBottom: '3rem',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '1.125rem'
          }}>
            Organisez vos idées, scripts et workflow vidéo en un seul endroit.
            Conçu pour YouTubeurs, Streamers, Vidéastes et Influenceurs.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <HomeButton
              href="/dashboard"
              style={{
                backgroundColor: '#F59E0B',
                color: '#0A0A0F',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                transition: 'all 0.25s',
                display: 'inline-block'
              }}
              hoverStyle={{
                backgroundColor: '#D97706',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
              }}
            >
              Accéder au Dashboard
            </HomeButton>
            
            <HomeButton
              href="/dashboard"
              style={{
                background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                transition: 'all 0.25s',
                display: 'inline-block'
              }}
              hoverStyle={{
                opacity: '0.9',
                boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)'
              }}
            >
              Découvrir la Plateforme
            </HomeButton>
          </div>
          
          {isTestMode && (
            <div style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <p style={{
                color: '#9CA3AF',
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}>
                Mode Test : Accès direct au tableau de bord
              </p>
              <p style={{
                color: '#6B7280',
                fontSize: '0.75rem'
              }}>
                Type utilisateur : {testUserType === 'admin' ? 'Administrateur' : 'Client'}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Erreur dans Home:', error)
    // En cas d'erreur, afficher une page simple
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#0A0A0F',
        color: '#FFFFFF',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>InfluenceCore</h1>
          <p style={{ marginBottom: '2rem', color: '#9CA3AF' }}>
            Une erreur est survenue. Veuillez consulter la console pour plus de détails.
          </p>
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
            Aller au Dashboard
          </Link>
        </div>
      </div>
    )
  }
}
