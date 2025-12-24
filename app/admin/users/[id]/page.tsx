import UserDetail from '@/components/admin/users/UserDetail'

export default function UserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="row">
      <div className="col-sm-6">
        <h3 className="mb-0">Détail Utilisateur</h3>
      </div>
      <div className="col-sm-6">
        <ol className="breadcrumb float-sm-end">
          <li className="breadcrumb-item">
            <a href="/admin">Admin</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin/users">Utilisateurs</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Détail
          </li>
        </ol>
      </div>
      <div className="col-12 mt-4">
        <UserDetail userId={params.id} />
      </div>
    </div>
  )
}

