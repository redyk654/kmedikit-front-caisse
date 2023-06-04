import React from 'react'

export default function ModalPatient({ patient, filtrerPatient, stylePatient, listePatient, selectionnePatient, ouvrirEditerPatient }) {
  return (
    <div style={{display: 'flex', flexDirection: 'column' , width: '45%', marginTop: 10, color: '#f1f1f1'}}>
        <label htmlFor="" style={{display: 'block',}}>Nom et prénom</label>
        <div>
            <input type="text" name="qteDesire" style={{width: '250px', height: '4vh'}} value={patient} onChange={filtrerPatient} autoComplete='off' />
        </div>
        <div style={{marginTop: '10px'}}>
            <h2>Liste des patients</h2>
            <ul style={stylePatient}>
                {listePatient.length > 0 && listePatient.map(item => (
                    <li style={{padding: '6px'}} onClick={(e) => selectionnePatient(e)} id={item.code}>{item.nom.toUpperCase()}</li>
                ))}
            </ul>
            <a className='a-link' style={{color: '#fff'}} onClick={ouvrirEditerPatient}>Ajouter un patient</a>
        </div>
    </div>
  )
}
