export interface VideoIdea {
  id: string
  userId: string
  title: string
  concept: string | null
  platform: string | null
  format: string | null
  status: string
  priority: string | null
  targetDate: string | null
  createdAt: string
  updatedAt: string
  scripts?: {
    id: string
    title: string
  }[]
}

