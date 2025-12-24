'use client'

import { useState, useEffect } from 'react'
import GrapesJSEditor from './GrapesJSEditor'

export default function HomePageEditor() {
  const [initialContent, setInitialContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger le contenu existant depuis l'API
    fetch('/api/admin/cms/homepage/load')
      .then((res) => res.json())
      .then((data) => {
        if (data.html) {
          setInitialContent(data.html)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erreur lors du chargement:', err)
        setLoading(false)
      })
  }, [])

  const handleSave = (html: string, css: string) => {
    // La sauvegarde est gérée dans GrapesJSEditor
    console.log('Page sauvegardée:', { html, css })
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      <GrapesJSEditor 
        initialContent={initialContent}
        onSave={handleSave}
        pageType="homepage"
      />
    </div>
  )
}
