import React from 'react'
import type { DashboardCardData, PermissionKey } from './DASHBOARD_DATA'
import { iconNode } from './iconMap'

export function DashboardCards(props: {
  cards: DashboardCardData[]
  can: (permission: PermissionKey) => boolean
  onNavigate?: (path: string) => void
}) {
  const visible = props.cards.filter((c) => props.can(c.permission))

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      {visible.map((card) => (
        <div
          key={card.path}
          onClick={() => props.onNavigate?.(card.path)}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 16,
            background: 'rgba(18, 18, 26, 0.6)',
            cursor: props.onNavigate ? 'pointer' : 'default',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 700 }}>{card.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{card.title}</div>
              <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>{card.description}</div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: card.bgColor,
                flex: '0 0 auto',
              }}
            >
              {iconNode(card.iconKey, { size: 22, color: 'white' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


