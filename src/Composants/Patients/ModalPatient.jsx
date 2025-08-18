import React from 'react'

export default function ModalPatient({ patient, filtrerPatient, stylePatient, listePatient, selectionnePatient, ouvrirEditerPatient }) {
  return (
    <div className="modal-patient-container">
      <div className="modal-patient-list">
        <label htmlFor="recherche-patient" className="modal-patient-label">Nom et prénom</label>
        <input
          id="recherche-patient"
          type="text"
          name="qteDesire"
          className="modal-patient-input"
          value={patient}
          onChange={filtrerPatient}
          autoComplete="off"
          placeholder="Rechercher un patient..."
        />
        <div className="modal-patient-list-block">
          <h2 className="modal-patient-list-title">Liste des patients</h2>
          <ul className="modal-patient-ul">
            {listePatient.length > 0 ? listePatient.map(item => (
              <li
                className="modal-patient-li"
                onClick={e => selectionnePatient(e)}
                id={item.code}
                key={item.code}
              >
                {item.nom.toUpperCase()}
              </li>
            )) : <li className="modal-patient-li empty">Aucun patient trouvé</li>}
          </ul>
          <button className="modal-patient-add-btn" onClick={ouvrirEditerPatient}>
            + Créer un patient
          </button>
        </div>
      </div>
      {/* La fiche patient sera affichée à droite via AfficherPatient */}
    </div>
  )
}
