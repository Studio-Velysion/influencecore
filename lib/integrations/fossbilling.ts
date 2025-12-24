import { logger } from '@/lib/logger'

type FossResult<T> = { result: T; error: { message: string; code: number } | null }

function getFossConfig() {
  const baseUrl = process.env.FOSSBILLING_URL
  const adminToken = process.env.FOSSBILLING_ADMIN_API_TOKEN

  if (!baseUrl) throw new Error('FOSSBILLING_URL is not set')
  if (!adminToken) throw new Error('FOSSBILLING_ADMIN_API_TOKEN is not set')

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    adminToken,
  }
}

export async function fossbillingAdminCall<T = any>(
  klass: string,
  method: string,
  params: Record<string, any> = {}
): Promise<T> {
  const { baseUrl, adminToken } = getFossConfig()
  const url = `${baseUrl}/index.php?_url=/api/admin/${encodeURIComponent(klass)}/${encodeURIComponent(method)}`

  const auth = Buffer.from(`admin:${adminToken}`).toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(params),
    cache: 'no-store',
  })

  const data = (await res.json().catch(() => null)) as FossResult<T> | null

  if (!res.ok || data?.error) {
    logger.error('fossbillingAdminCall', 'FOSSBilling API error', {
      status: res.status,
      data,
    })
    throw new Error(data?.error?.message || `FOSSBilling error (${res.status})`)
  }

  return data?.result as T
}


