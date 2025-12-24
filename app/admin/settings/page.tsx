import SettingsPage from '@/components/admin/settings/SettingsPage'

export default function AdminSettingsPage() {
  return (
    <div className="row">
      <div className="col-sm-6">
        <h3 className="mb-0">Paramètres</h3>
      </div>
      <div className="col-sm-6">
        <ol className="breadcrumb float-sm-end">
          <li className="breadcrumb-item">
            <a href="/admin">Admin</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Paramètres
          </li>
        </ol>
      </div>
      <div className="col-12 mt-4">
        <SettingsPage />
      </div>
    </div>
  )
}

