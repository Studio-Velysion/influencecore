import HomePageEditor from '@/components/admin/cms/HomePageEditor'

export default function CMSPage() {
  return (
    <div className="row">
      <div className="col-sm-6">
        <h3 className="mb-0">Gestion de la Page d&apos;Accueil</h3>
      </div>
      <div className="col-sm-6">
        <ol className="breadcrumb float-sm-end">
          <li className="breadcrumb-item">
            <a href="/admin">Admin</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            CMS
          </li>
        </ol>
      </div>
      <div className="col-12 mt-4">
        <HomePageEditor />
      </div>
    </div>
  )
}

