'use client'

import { useState, useEffect } from 'react'
import { VideoScript, ScriptContent, ScriptPart, ScriptChecklist, ChecklistItem } from '@/types/scripts'

interface ScriptEditorProps {
  scriptId: string
  initialScript?: VideoScript | null
  onSave?: () => void
}

// Helper pour parser le contenu JSON si nécessaire
const parseContent = (content: any): ScriptContent => {
  const defaultContent: ScriptContent = {
    hook: '',
    introduction: '',
    parts: [],
    outro: '',
    cta: '',
  }

  if (!content) {
    return defaultContent
  }

  let parsed: any
  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content)
    } catch {
      return defaultContent
    }
  } else {
    parsed = content
  }

  // S'assurer que tous les champs existent
  return {
    hook: parsed.hook || '',
    introduction: parsed.introduction || '',
    parts: Array.isArray(parsed.parts) ? parsed.parts : [],
    outro: parsed.outro || '',
    cta: parsed.cta || '',
  }
}

// Helper pour parser la checklist JSON si nécessaire
const parseChecklist = (checklist: any): ScriptChecklist => {
  if (!checklist) {
    return {
      tournage: [],
      montage: [],
    }
  }
  if (typeof checklist === 'string') {
    try {
      return JSON.parse(checklist)
    } catch {
      return {
        tournage: [],
        montage: [],
      }
    }
  }
  return checklist
}

export default function ScriptEditor({ scriptId, initialScript, onSave }: ScriptEditorProps) {
  const [title, setTitle] = useState(initialScript?.title || '')
  const [content, setContent] = useState<ScriptContent>(
    parseContent(initialScript?.content)
  )
  const [checklist, setChecklist] = useState<ScriptChecklist>(
    parseChecklist(initialScript?.checklist)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialScript) {
      setTitle(initialScript.title)
      setContent(parseContent(initialScript.content))
      setChecklist(parseChecklist(initialScript.checklist))
    }
  }, [initialScript])

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          checklist,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la sauvegarde')
        return
      }

      if (onSave) {
        onSave()
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const addPart = () => {
    const newPart: ScriptPart = {
      id: Date.now().toString(),
      title: '',
      content: '',
    }
    setContent({
      ...content,
      parts: [...(content?.parts || []), newPart],
    })
  }

  const updatePart = (id: string, field: 'title' | 'content', value: string) => {
    setContent({
      ...content,
      parts: (content?.parts || []).map((part) =>
        part.id === id ? { ...part, [field]: value } : part
      ),
    })
  }

  const removePart = (id: string) => {
    setContent({
      ...content,
      parts: (content?.parts || []).filter((part) => part.id !== id),
    })
  }

  const addChecklistItem = (type: 'tournage' | 'montage') => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: '',
      checked: false,
    }
    setChecklist({
      ...checklist,
      [type]: [...checklist[type], newItem],
    })
  }

  const updateChecklistItem = (type: 'tournage' | 'montage', id: string, field: 'text' | 'checked', value: string | boolean) => {
    setChecklist({
      ...checklist,
      [type]: checklist[type].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const removeChecklistItem = (type: 'tournage' | 'montage', id: string) => {
    setChecklist({
      ...checklist,
      [type]: checklist[type].filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Titre */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du script"
          className="w-full text-2xl font-bold px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          onBlur={handleSave}
        />
      </div>

      {/* Hook */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🎣 Hook</h3>
        <textarea
          value={content.hook}
          onChange={(e) => setContent({ ...content, hook: e.target.value })}
          placeholder="Accrochez votre audience dès les premières secondes..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          onBlur={handleSave}
        />
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">👋 Introduction</h3>
        <textarea
          value={content.introduction}
          onChange={(e) => setContent({ ...content, introduction: e.target.value })}
          placeholder="Présentez le sujet et ce que les viewers vont apprendre..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          onBlur={handleSave}
        />
      </div>

      {/* Parties */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📝 Parties</h3>
          <button
            onClick={addPart}
            className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700"
          >
            + Ajouter une partie
          </button>
        </div>
        {(content?.parts || []).map((part, index) => (
          <div key={part.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={part.title}
                onChange={(e) => updatePart(part.id, 'title', e.target.value)}
                placeholder={`Partie ${index + 1} - Titre`}
                className="flex-1 font-semibold px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                onBlur={handleSave}
              />
              <button
                onClick={() => removePart(part.id)}
                className="ml-2 text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <textarea
              value={part.content}
              onChange={(e) => updatePart(part.id, 'content', e.target.value)}
              placeholder="Contenu de cette partie..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              onBlur={handleSave}
            />
          </div>
        ))}
        {(!content?.parts || content.parts.length === 0) && (
          <p className="text-gray-500 text-sm text-center py-4">
            Aucune partie. Cliquez sur "Ajouter une partie" pour commencer.
          </p>
        )}
      </div>

      {/* Outro */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">👋 Outro</h3>
        <textarea
          value={content.outro}
          onChange={(e) => setContent({ ...content, outro: e.target.value })}
          placeholder="Conclusion et remerciements..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          onBlur={handleSave}
        />
      </div>

      {/* CTA */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Call-to-Action</h3>
        <textarea
          value={content.cta}
          onChange={(e) => setContent({ ...content, cta: e.target.value })}
          placeholder="Invitez vos viewers à s'abonner, liker, commenter..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          onBlur={handleSave}
        />
      </div>

      {/* Checklist Tournage */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🎥 Checklist Tournage</h3>
          <button
            onClick={() => addChecklistItem('tournage')}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {checklist.tournage.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => {
                  updateChecklistItem('tournage', item.id, 'checked', e.target.checked)
                  handleSave()
                }}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateChecklistItem('tournage', item.id, 'text', e.target.value)}
                placeholder="Tâche à faire..."
                className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                onBlur={handleSave}
              />
              <button
                onClick={() => {
                  removeChecklistItem('tournage', item.id)
                  handleSave()
                }}
                className="text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist Montage */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">✂️ Checklist Montage</h3>
          <button
            onClick={() => addChecklistItem('montage')}
            className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {checklist.montage.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => {
                  updateChecklistItem('montage', item.id, 'checked', e.target.checked)
                  handleSave()
                }}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateChecklistItem('montage', item.id, 'text', e.target.value)}
                placeholder="Tâche à faire..."
                className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                onBlur={handleSave}
              />
              <button
                onClick={() => {
                  removeChecklistItem('montage', item.id)
                  handleSave()
                }}
                className="text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

