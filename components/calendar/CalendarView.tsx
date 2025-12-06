'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CalendarIdea {
  id: string
  title: string
  status: string
  platform: string | null
  format: string | null
  targetDate: string
  priority: string | null
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [ideas, setIdeas] = useState<CalendarIdea[]>([])
  const [loading, setLoading] = useState(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    fetchIdeas()
  }, [year, month])

  const fetchIdeas = async () => {
    try {
      const monthStr = String(month + 1).padStart(2, '0')
      const response = await fetch(`/api/calendar?year=${year}&month=${monthStr}`)
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du calendrier:', error)
    } finally {
      setLoading(false)
    }
  }

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1))
  }

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(year, month, 1).getDay()
  }

  const getIdeasForDate = (date: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    return ideas.filter((idea) => {
      const ideaDate = new Date(idea.targetDate).toISOString().split('T')[0]
      return ideaDate === dateStr
    })
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const daysInMonth = getDaysInMonth()
  const firstDay = getFirstDayOfMonth()
  const days = []

  // Jours vides avant le premier jour du mois
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const statusColors: Record<string, string> = {
    'Idée': 'bg-gray-100 text-gray-800',
    'Écriture': 'bg-blue-100 text-blue-800',
    'Tournage': 'bg-yellow-100 text-yellow-800',
    'Montage': 'bg-purple-100 text-purple-800',
    'Programmée': 'bg-orange-100 text-orange-800',
    'Publiée': 'bg-green-100 text-green-800',
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Calendrier éditorial</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            →
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
          >
            Aujourd'hui
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[120px] border border-gray-200" />
            }

            const dayIdeas = getIdeasForDate(day)
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`min-h-[120px] border border-gray-200 p-2 ${
                  isToday ? 'bg-primary-50' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayIdeas.slice(0, 3).map((idea) => (
                    <Link
                      key={idea.id}
                      href={`/ideas/${idea.id}`}
                      className={`block text-xs p-1 rounded truncate hover:opacity-80 ${statusColors[idea.status] || statusColors['Idée']}`}
                      title={idea.title}
                    >
                      {idea.title}
                    </Link>
                  ))}
                  {dayIdeas.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayIdeas.length - 3} autre{dayIdeas.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {ideas.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">
            Aucune vidéo programmée pour {monthNames[month]} {year}
          </p>
          <Link
            href="/ideas"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Créer une idée avec date cible
          </Link>
        </div>
      )}
    </div>
  )
}

