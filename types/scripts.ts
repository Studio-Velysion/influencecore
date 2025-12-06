export interface VideoScript {
  id: string
  userId: string
  videoIdeaId: string | null
  title: string
  content: ScriptContent
  checklist: ScriptChecklist
  createdAt: string
  updatedAt: string
  videoIdea?: {
    id: string
    title: string
  } | null
}

export interface ScriptContent {
  hook: string
  introduction: string
  parts: ScriptPart[]
  outro: string
  cta: string
}

export interface ScriptPart {
  id: string
  title: string
  content: string
}

export interface ScriptChecklist {
  tournage: ChecklistItem[]
  montage: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

