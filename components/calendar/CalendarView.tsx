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
    'Idée': 'bg-bg-tertiary text-text-secondary border border-border-dark',
    'Écriture': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'Tournage': 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
    'Montage': 'bg-purple-600/20 text-purple-300 border border-purple-600/30',
    'Programmée': 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
    'Publiée': 'bg-state-success/20 text-state-success border border-state-success/30',
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-tertiary">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-text-primary">Calendrier éditorial</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 border border-border-dark rounded-lg hover:bg-bg-hover hover:border-purple-500/30 text-text-secondary transition-velysion"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-text-primary min-w-[200px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 border border-border-dark rounded-lg hover:bg-bg-hover hover:border-purple-500/30 text-text-secondary transition-velysion"
          >
            →
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm link-velysion font-medium"
          >
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      <div className="card-velysion overflow-hidden p-0">
        <div className="grid grid-cols-7 border-b border-border-dark">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-text-secondary bg-bg-secondary">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[120px] border border-border-dark bg-bg-secondary/30" />
            }

            const dayIdeas = getIdeasForDate(day)
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`min-h-[120px] border border-border-dark p-2 ${
                  isToday ? 'bg-purple-500/10 border-purple-500/30' : 'bg-bg-tertiary/50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-purple-400' : 'text-text-secondary'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayIdeas.slice(0, 3).map((idea) => (
                    <Link
                      key={idea.id}
                      href={`/ideas/${idea.id}`}
                      className={`block text-xs p-1.5 rounded truncate hover:opacity-80 transition-velysion ${statusColors[idea.status] || statusColors['Idée']}`}
                      title={idea.title}
                    >
                      {idea.title}
                    </Link>
                  ))}
                  {dayIdeas.length > 3 && (
                    <div className="text-xs text-text-muted px-1">
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
        <div className="card-velysion p-8 text-center">
          <p className="text-text-tertiary mb-4">
            Aucune vidéo programmée pour {monthNames[month]} {year}
          </p>
          <Link
            href="/ideas"
            className="link-velysion font-medium"
          >
            Créer une idée avec date cible
          </Link>
        </div>
      )}
    </div>
  )
}

