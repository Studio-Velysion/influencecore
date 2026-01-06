import React from 'react'
import {
  FiHome,
  FiVideo,
  FiFileText,
  FiCalendar,
  FiEdit3,
  FiUsers,
  FiShield,
  FiCreditCard,
  FiSettings,
  FiLayout,
  FiAlertCircle,
  FiLifeBuoy,
} from 'react-icons/fi'
import type { IconKey } from './DASHBOARD_DATA'

export function iconNode(iconKey: IconKey | 'home', props: { size?: number; color?: string } = {}) {
  const size = props.size ?? 20
  const color = props.color ?? 'white'
  switch (iconKey) {
    case 'home':
      return <FiHome size={size} color={color} />
    case 'video':
      return <FiVideo size={size} color={color} />
    case 'fileText':
      return <FiFileText size={size} color={color} />
    case 'calendar':
      return <FiCalendar size={size} color={color} />
    case 'edit':
      return <FiEdit3 size={size} color={color} />
    case 'users':
      return <FiUsers size={size} color={color} />
    case 'shield':
      return <FiShield size={size} color={color} />
    case 'creditCard':
      return <FiCreditCard size={size} color={color} />
    case 'settings':
      return <FiSettings size={size} color={color} />
    case 'layout':
      return <FiLayout size={size} color={color} />
    case 'alertCircle':
      return <FiAlertCircle size={size} color={color} />
    case 'lifeBuoy':
      return <FiLifeBuoy size={size} color={color} />
    default:
      return null
  }
}


