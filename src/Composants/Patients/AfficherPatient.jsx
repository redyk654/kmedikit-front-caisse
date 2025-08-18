import React from 'react';
import { afficherAge, afficherSexe } from '../../shared/Globals';
import './AfficherPatient.css'

export default function AfficherPatient({ patientChoisi, fermerModalPatient }) {

  return (
    <div className="patient-details-container">
      <div className="patient-details-header">
        <h2>👤 Détails du Patient</h2>
      </div>
            <div className="patient-details-actions">
        <button 
          className="btn-select-patient" 
          onClick={fermerModalPatient}
          type="button"
        >
          ✅ Sélectionner ce patient
        </button>
      </div>
      <div className="patient-details-content">
        <div className="patient-info-grid">
          <div className="patient-info-item">
            <label>Code Patient</label>
            <div className="patient-info-value">
              {patientChoisi.code.toUpperCase()}
            </div>
          </div>

          <div className="patient-info-item">
            <label>Noms et Prénoms</label>
            <div className="patient-info-value">
              {patientChoisi.nom.toUpperCase()}
            </div>
          </div>

          <div className="patient-info-item">
            <label>Âge</label>
            <div className="patient-info-value">
              {afficherAge(patientChoisi.age)}
            </div>
          </div>

          <div className="patient-info-item">
            <label>Sexe</label>
            <div className="patient-info-value">
              {afficherSexe(patientChoisi.sexe)}
            </div>
          </div>

          <div className="patient-info-item">
            <label>Quartier</label>
            <div className="patient-info-value">
              {patientChoisi.quartier.toUpperCase()}
            </div>
          </div>

          {/* <div className="patient-info-item">
            <label>Assurance</label>
            <div className="patient-info-value">
              {patientChoisi.assurance.toUpperCase()}
            </div>
          </div>

          <div className="patient-info-item">
            <label>Pourcentage Assurance</label>
            <div className="patient-info-value">
              {patientChoisi.type_assurance}%
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
