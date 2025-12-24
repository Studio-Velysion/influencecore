import { logger } from '@/lib/logger'

type Json = Record<string, any>

function getHelpdeskConfig() {
  const baseUrl = process.env.HELPDESK_URL
  const apiKey = process.env.HELPDESK_API_KEY
  const apiSecret = process.env.HELPDESK_API_SECRET

  if (!baseUrl) {
    throw new Error('HELPDESK_URL is not set')
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiKey,
    apiSecret,
  }
}

async function helpdeskFetch(path: string, init: RequestInit = {}) {
  const { baseUrl, apiKey, apiSecret } = getHelpdeskConfig()
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json')

  // Frappe: Authorization: token api_key:api_secret
  if (apiKey && apiSecret) {
    headers.set('Authorization', `token ${apiKey}:${apiSecret}`)
  }

  const res = await fetch(url, { ...init, headers, cache: 'no-store' })
  return res
}

export async function helpdeskCreateTicket(input: {
  subject: string
  description: string
  raisedByEmail?: string
}) {
  const payload: Json = {
    subject: input.subject,
    description: input.description,
  }
  if (input.raisedByEmail) payload.raised_by = input.raisedByEmail

  const res = await helpdeskFetch('/api/resource/HD Ticket', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = (await res.json().catch(() => null)) as any
  if (!res.ok) {
    logger.error('helpdeskCreateTicket', 'Helpdesk API error', {
      status: res.status,
      data,
    })
    throw new Error(data?.message || 'Helpdesk error')
  }

  return data?.data
}


