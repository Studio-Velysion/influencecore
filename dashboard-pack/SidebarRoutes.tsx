import React from 'react'
import type { PermissionKey, SidebarRouteItem } from './DASHBOARD_DATA'
import { iconNode } from './iconMap'

export function SidebarRoutes(props: {
  routes: SidebarRouteItem[]
  can?: (permission: PermissionKey) => boolean
  activePath?: string
  onNavigate?: (path: string) => void
}) {
  const can = props.can ?? (() => true)
  const visible = props.routes.filter((r) => (r.permission ? can(r.permission) : true))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {visible.map((r) => {
        const active = props.activePath ? props.activePath.startsWith(r.path) : false
        return (
          <div
            key={r.path}
            onClick={() => props.onNavigate?.(r.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              cursor: props.onNavigate ? 'pointer' : 'default',
              background: active ? 'rgba(147, 51, 234, 0.2)' : 'transparent',
              color: active ? '#A855F7' : 'rgba(229,231,235,0.95)',
            }}
          >
            {iconNode(r.iconKey, { size: 18, color: active ? '#A855F7' : 'rgba(229,231,235,0.95)' })}
            <span style={{ fontSize: 14 }}>{r.label}</span>
          </div>
        )
      })}
    </div>
  )
}


