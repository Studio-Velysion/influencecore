import UsersList from '@/components/admin/users/UsersList'

export default function UsersPage() {
  return (
    <div className="row">
      <div className="col-sm-6">
        <h3 className="mb-0">Gestion des Utilisateurs</h3>
      </div>
      <div className="col-sm-6">
        <ol className="breadcrumb float-sm-end">
          <li className="breadcrumb-item">
            <a href="/admin">Admin</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Utilisateurs
          </li>
        </ol>
      </div>
      <div className="col-12 mt-4">
        <UsersList />
      </div>
    </div>
  )
}

