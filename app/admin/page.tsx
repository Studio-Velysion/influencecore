import { redirect } from 'next/navigation'

export default async function AdminPage() {
  // Le dashboard admin séparé est supprimé.
  // Toute l'administration est visible en bas du /dashboard selon les permissions.
  redirect('/dashboard')
}

