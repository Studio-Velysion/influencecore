'use client'

import { useEffect, useRef } from 'react'
// @ts-ignore - GrapesJS n'a pas de types TypeScript officiels
import grapesjs from 'grapesjs'

interface GrapesJSEditorProps {
  initialContent?: string
  onSave?: (html: string, css: string) => void
  pageType?: 'homepage' | 'pricing'
}

export default function GrapesJSEditor({ 
  initialContent, 
  onSave,
  pageType = 'homepage' 
}: GrapesJSEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // Charger le CSS de GrapesJS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/grapesjs/dist/css/grapes.min.css'
    document.head.appendChild(link)

    // Initialiser GrapesJS
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      storageManager: {
        type: 'remote',
        autosave: false,
        autoload: false,
        stepsBeforeSave: 1,
        options: {
          remote: {
            urlStore: `/api/admin/cms/${pageType}/store`,
            urlLoad: `/api/admin/cms/${pageType}/load`,
            contentTypeJson: true,
            credentials: 'include',
            headers: {},
          },
        },
      },
      plugins: [],
      pluginsOpts: {},
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'section-hero',
            label: '<b>Hero Section</b>',
            category: 'Sections',
            content: `<section class="min-h-[60vh] flex items-center justify-center" style="background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); color: white; padding: 4rem 2rem;">
              <div class="text-center">
                <h1 class="text-5xl font-bold mb-4">InfluenceCore</h1>
                <p class="text-xl mb-8 opacity-90">Votre slogan personnalisable ici</p>
                <button class="px-6 py-3 rounded-lg font-semibold" style="background: #F59E0B; color: #000;">Découvrir la plateforme</button>
              </div>
            </section>`,
          },
          {
            id: 'section-services',
            label: 'Services Section',
            category: 'Sections',
            content: `<section style="padding: 4rem 2rem; background: #12121A;">
              <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                <h2 style="font-size: 2.5rem; font-weight: bold; color: white; margin-bottom: 3rem;">Nos Services</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                  <div style="background: rgba(26, 26, 36, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #A855F7; margin-bottom: 1rem;">Service 1</h3>
                    <p style="color: #E5E7EB;">Description du service 1.</p>
                  </div>
                  <div style="background: rgba(26, 26, 36, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #A855F7; margin-bottom: 1rem;">Service 2</h3>
                    <p style="color: #E5E7EB;">Description du service 2.</p>
                  </div>
                  <div style="background: rgba(26, 26, 36, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #A855F7; margin-bottom: 1rem;">Service 3</h3>
                    <p style="color: #E5E7EB;">Description du service 3.</p>
                  </div>
                </div>
              </div>
            </section>`,
          },
          {
            id: 'section-pricing',
            label: 'Pricing Section',
            category: 'Sections',
            content: `<section style="padding: 4rem 2rem; background: #0A0A0F;">
              <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                <h2 style="font-size: 2.5rem; font-weight: bold; color: white; margin-bottom: 3rem;">Nos Tarifs</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                  <div style="background: rgba(26, 26, 36, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #A855F7; margin-bottom: 1rem;">Plan Basique</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: white; margin-bottom: 1rem;">9.99€<span style="font-size: 1rem; color: #9CA3AF;">/mois</span></p>
                    <button class="px-6 py-3 rounded-lg font-semibold" style="background: #F59E0B; color: #000; width: 100%;">Choisir ce plan</button>
                  </div>
                  <div style="background: rgba(26, 26, 36, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #A855F7; margin-bottom: 1rem;">Plan Pro</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: white; margin-bottom: 1rem;">29.99€<span style="font-size: 1rem; color: #9CA3AF;">/mois</span></p>
                    <button class="px-6 py-3 rounded-lg font-semibold" style="background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); color: white; width: 100%;">Choisir ce plan</button>
                  </div>
                  <div style="background: rgba(26, 26, 36, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #A855F7; margin-bottom: 1rem;">Plan Entreprise</h3>
                    <p style="font-size: 2rem; font-weight: bold; color: white; margin-bottom: 1rem;">Sur Devis</p>
                    <button class="px-6 py-3 rounded-lg font-semibold" style="background: transparent; border: 2px solid #9333EA; color: #9333EA; width: 100%;">Nous contacter</button>
                  </div>
                </div>
              </div>
            </section>`,
          },
          {
            id: 'text',
            label: 'Texte',
            category: 'Basique',
            content: '<div class="gjs-text" style="padding: 1rem; color: #FFFFFF;">Insérez votre texte ici</div>',
          },
          {
            id: 'image',
            label: 'Image',
            category: 'Basique',
            content: {
              type: 'image',
              src: 'https://via.placeholder.com/350x250/9333EA/FFFFFF?text=Image',
              style: { width: '100%', height: 'auto' },
            },
          },
          {
            id: 'button-primary',
            label: 'Bouton Primaire',
            category: 'Boutons',
            content: '<button class="btn-velysion-primary" style="background: #F59E0B; color: #000; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer;">Bouton</button>',
          },
          {
            id: 'button-gradient',
            label: 'Bouton Gradient',
            category: 'Boutons',
            content: '<button class="btn-velysion-gradient" style="background: linear-gradient(135deg, #9333EA 0%, #EC4899 100%); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer;">Bouton</button>',
          },
        ],
      },
      layerManager: {
        appendTo: '.layers-container',
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding'],
            properties: [
              {
                type: 'integer',
                name: 'Width',
                property: 'width',
                units: ['px', '%'],
                defaults: 'auto',
                min: 0,
              },
            ],
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['background-color', 'box-shadow', 'custom-prop'],
            properties: [
              {
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                options: [
                  { value: '12px', name: 'Tiny' },
                  { value: '18px', name: 'Medium' },
                  { value: '32px', name: 'Big' },
                ],
              },
            ],
          },
        ],
      },
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0,
              cl: 1,
              cr: 0,
              bc: 0,
              keyWidth: 'flex-basis',
            },
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: '🖥️',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-tablet',
                label: '📱',
                command: 'set-device-tablet',
                togglable: false,
              },
              {
                id: 'device-mobile',
                label: '📱',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
        ],
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '768px',
          },
        ],
      },
    })

    editorInstanceRef.current = editor

    // Charger le contenu initial si fourni
    if (initialContent) {
      editor.setComponents(initialContent)
    }

    // Ajouter des commandes personnalisées pour les devices
    editor.Commands.add('set-device-desktop', {
      run: (editor: any) => editor.setDevice('Desktop'),
    })
    editor.Commands.add('set-device-tablet', {
      run: (editor: any) => editor.setDevice('Tablet'),
    })
    editor.Commands.add('set-device-mobile', {
      run: (editor: any) => editor.setDevice('Mobile'),
    })

    // Ajouter un bouton de sauvegarde personnalisé
    editor.Panels.addButton('options', {
      id: 'save',
      className: 'btn-save',
      label: '<i class="bi bi-save"></i> Sauvegarder',
      command: 'save-custom',
      attributes: { title: 'Sauvegarder' },
    })

    editor.Commands.add('save-custom', {
      run: (editor: any) => {
        const html = editor.getHtml()
        const css = editor.getCss()
        const json = editor.getProjectData()
        
        if (onSave) {
          onSave(html, css)
        }
        
        // Sauvegarder via l'API
        fetch(`/api/admin/cms/${pageType}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ html, css, json }),
        })
        .then((res) => res.json())
        .then((data) => {
          editor.Storage.store()
          alert('Page sauvegardée avec succès!')
        })
        .catch((err) => {
          console.error('Erreur lors de la sauvegarde:', err)
          alert('Erreur lors de la sauvegarde')
        })
      },
    })

    // Charger le contenu depuis l'API si disponible
    fetch(`/api/admin/cms/${pageType}/load`)
      .then((res) => res.json())
      .then((data) => {
        if (data.html) {
          editor.setComponents(data.html)
        }
        if (data.css) {
          editor.setStyle(data.css)
        }
        if (data.gjsProject) {
          editor.loadProjectData(data.gjsProject)
        }
      })
      .catch((err) => {
        console.error('Erreur lors du chargement:', err)
      })

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy()
      }
    }
  }, [initialContent, onSave, pageType])

  return (
    <div className="gjs-editor" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div className="panel__top bg-bg-secondary border-b border-border-dark p-2">
        <div className="panel__basic-actions flex gap-2">
          <div className="panel__devices"></div>
        </div>
      </div>

      {/* Main editor area */}
      <div className="editor-row" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar gauche - Blocks */}
        <div className="panel__left bg-bg-secondary border-r border-border-dark" style={{ width: '300px', overflowY: 'auto' }}>
          <div className="blocks-container p-4">
            <h3 className="text-text-primary text-sm font-semibold mb-4">Blocs</h3>
          </div>
        </div>

        {/* Canvas central */}
        <div className="editor-canvas flex-1" style={{ overflow: 'auto', background: '#1A1A24' }}>
          <div ref={editorRef} style={{ minHeight: '100%' }}></div>
        </div>

        {/* Sidebar droite - Layers & Styles */}
        <div className="panel__right bg-bg-secondary border-l border-border-dark" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <div className="layers-container flex-1 p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-text-primary text-sm font-semibold mb-4">Layers</h3>
          </div>
          <div className="styles-container flex-1 p-4" style={{ overflowY: 'auto' }}>
            <h3 className="text-text-primary text-sm font-semibold mb-4">Styles</h3>
          </div>
        </div>
      </div>

      {/* Custom CSS pour intégrer le thème Studio Velysion */}
      <style jsx global>{`
        .gjs-editor {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .panel__top {
          background: var(--bg-secondary) !important;
          border-bottom: 1px solid var(--border-dark) !important;
        }
        .panel__left,
        .panel__right {
          background: var(--bg-secondary) !important;
          border-color: var(--border-dark) !important;
        }
        .gjs-block {
          background: var(--bg-tertiary) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-dark) !important;
        }
        .gjs-block:hover {
          background: var(--bg-hover) !important;
          border-color: var(--purple-500) !important;
        }
        .gjs-cv-canvas {
          background: var(--bg-primary) !important;
        }
        .btn-save {
          background: var(--gold-500) !important;
          color: var(--text-inverse) !important;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-save:hover {
          background: var(--gold-600) !important;
        }
      `}</style>
    </div>
  )
}

