import { prisma } from '@/lib/prisma'

export type ErrorLogLevel = 'error' | 'warning' | 'info'

export interface GetErrorLogsParams {
  level?: ErrorLogLevel
  resolved?: boolean
  limit?: number
  offset?: number
  userId?: string
}

export async function getErrorLogs(params: GetErrorLogsParams = {}) {
  const { level, resolved, limit = 100, offset = 0, userId } = params

  return prisma.errorLog.findMany({
    where: {
      ...(level ? { level } : {}),
      ...(typeof resolved === 'boolean' ? { resolved } : {}),
      ...(userId ? { userId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  })
}

export async function countUnresolvedErrors() {
  return prisma.errorLog.count({ where: { resolved: false } })
}

export async function markErrorAsResolved(errorLogId: string, adminUserId: string) {
  await prisma.errorLog.update({
    where: { id: errorLogId },
    data: {
      resolved: true,
      resolvedAt: new Date(),
      resolvedBy: adminUserId,
    },
  })
}


