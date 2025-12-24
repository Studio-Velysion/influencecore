'use client'

export default function AdminFooter() {
  return (
    <footer className="app-footer">
      <div className="float-end d-none d-sm-inline">
        <strong>
          Copyright &copy; {new Date().getFullYear()}{' '}
          <a href="#" className="text-decoration-none">
            InfluenceCore
          </a>
          . All rights reserved.
        </strong>
      </div>
      <strong>
        <span>InfluenceCore Admin Panel</span>
      </strong>
    </footer>
  )
}

