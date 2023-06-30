import React, { useState } from 'react';
import { afficherAge, afficherSexe } from '../../shared/Globals';
import './AfficherPatient.css'

export default function AfficherPatient({ patientChoisi, fermerModalPatient }) {

  return (
    <form action="" className="form-patient">
        <h2 style={{textAlign: 'center', color: '#fff'}}>Détails Infos</h2>
        <div className="box-input">
            <p className="input-zone">
                <label htmlFor="">Code : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="code" readOnly value={patientChoisi.code.toUpperCase()} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="">Noms et Prénoms : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="nom" readOnly value={patientChoisi.nom.toUpperCase()} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="">Age : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="age" readOnly value={afficherAge(patientChoisi.age)} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="">Sexe : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="sexe" readOnly value={afficherSexe(patientChoisi.sexe)} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="">Quartier : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="quartier" readOnly value={patientChoisi.quartier.toUpperCase()} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="">Assurance : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="assurance" readOnly value={patientChoisi.assurance.toUpperCase()} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="">Pourcentage : </label>
                <input style={{color: `${'#fff'}`}} type="text" name="sexe" readOnly value={patientChoisi.type_assurance} autoComplete="off" />
            </p>
        </div>
        <div style={{marginTop: '20px', marginLeft: '40%',}}>
            <button style={{width: '130px'}} className='bootstrap-btn valider' type="submit" onClick={fermerModalPatient}>Selectionner</button>
        </div>
    </form>
  )
}
