'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'InfluenceCore',
    siteDescription: 'Plateforme de gestion pour créateurs',
    maintenanceMode: false,
    allowRegistrations: true,
  })

  const handleSave = async () => {
    // TODO: Implémenter la sauvegarde des paramètres
    alert('Fonctionnalité à venir : Sauvegarde des paramètres')
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Paramètres Généraux</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Nom du site</label>
              <input
                type="text"
                className="form-control"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="form-group mt-3">
              <label>Description du site</label>
              <textarea
                className="form-control"
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <label className="form-check-label">Mode maintenance</label>
            </div>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={settings.allowRegistrations}
                onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
              />
              <label className="form-check-label">Autoriser les inscriptions</label>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleSave}>
              <i className="bi bi-save me-1"></i>
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Informations Système</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-sm-6"><strong>Version</strong></div>
              <div className="col-sm-6">1.0.0</div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-6"><strong>Base de données</strong></div>
              <div className="col-sm-6">SQLite</div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-6"><strong>Mode</strong></div>
              <div className="col-sm-6">
                {process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true' ? (
                  <span className="badge bg-warning">Test</span>
                ) : (
                  <span className="badge bg-success">Production</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">Actions</h3>
          </div>
          <div className="card-body">
            <button className="btn btn-warning btn-block mb-2">
              <i className="bi bi-arrow-clockwise me-1"></i>
              Vider le cache
            </button>
            <button className="btn btn-info btn-block mb-2">
              <i className="bi bi-download me-1"></i>
              Exporter les données
            </button>
            <button className="btn btn-danger btn-block">
              <i className="bi bi-trash me-1"></i>
              Réinitialiser la base de données
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

