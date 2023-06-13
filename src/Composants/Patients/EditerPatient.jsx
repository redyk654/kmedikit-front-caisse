import React, { useContext, useEffect, useState } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import { afficherAge, afficherSexe } from '../../shared/Globals';
import './EditerPatient.css'
import { ROLES, SEXES, nomDns } from "../../shared/Globals";
import CustomLoader from '../../shared/CustomLoader';

export default function EditerPatient({ ajouterNouveauPatient, resetInfosDuPatient, handleChange, fermerEditerPatient, ouvrirModalPatient, nom, age, sexe, quartier, assurance, type_assurance }) {

    const {role} = useContext(ContextChargement);

    const [listeAssurances, setListeAssurances] = useState([]);
    const [enCours, setEnCours] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');

    useEffect(() => {
        fetch(`${nomDns}assurances.php?liste`)
        .then(response => response.json())
        .then(data => setListeAssurances(data));
    }, [])

    const retour = async () => {
        await fermerEditerPatient();
        resetInfosDuPatient();
        ouvrirModalPatient();
    }

    const execAjouterNouveauPatient = async (e) => {
        e.preventDefault();
        if (nom !== '' && (sexe.toUpperCase() === SEXES.f.toUpperCase() || sexe.toUpperCase() === SEXES.h.toUpperCase())) {
            setMessageErreur('');
            setEnCours(true)
            await ajouterNouveauPatient(e);
            setEnCours(false);
        } else {
            setMessageErreur('Nom et Sexe obligatoires');
        }
    }

  return (
    <form action="" className="form-editer-patient">
        <a className='a-link' style={{width: '90px', display: `${enCours ? 'none' : 'block'}`}} onClick={retour}>retour</a>
        <h2 style={{textAlign: 'center', color: '#000'}}>Nouveau patient</h2>
        <div className="box-input">
            <p className="input-zone">
                <label htmlFor="nom-prenom" style={{color: `${'#000'}`}}>Noms et Prénoms : </label>
                <input id='nom-prenom' required readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="text" name="nom" value={nom?.toUpperCase()} onChange={handleChange} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="age-patient" style={{color: `${'#000'}`}}>Age : </label>
                <input id='age-patient' readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="number" name="age" value={age} onChange={handleChange} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="sexe-patient" style={{color: `${'#000'}`}}>Sexe : </label>
                <select required disabled={enCours ? true : false} name="sexe" id="sexe-patient" onChange={handleChange}>
                    <option value="aucun">choisissez le sexe</option>
                    <option value={SEXES.h}>{afficherSexe(SEXES.h)}</option>
                    <option value={SEXES.f}>{afficherSexe(SEXES.f)}</option>
                </select>
            </p>
            <p className="input-zone">
                <label htmlFor="quartier-patient" style={{color: `${'#000'}`}}>Quartier : </label>
                <input id='quartier-patient' readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="text" name="quartier" value={quartier?.toUpperCase()} onChange={handleChange} autoComplete="off" />
            </p>
            <p className="input-zone" style={{display: `${role !== ROLES.secretaire && 'none'}`}}>
                <label htmlFor="assurance-patient" style={{color: `${'#000'}`}}>Assurance : </label>
                <select id='assurance-patient' disabled={enCours ? true : false} style={{color: `${'#000'}`}} name="assurance" onChange={handleChange}>
                    <option value="aucune">choisissez une assurance</option>
                    {listeAssurances.map(item => (
                        <option value={item.designation}>{item.designation.toUpperCase()}</option>
                    ))}
                </select>
            </p>
            <p className="input-zone" style={{display: `${role !== ROLES.secretaire && 'none'}`}}>
                <label htmlFor="poucentage-patient" style={{color: `${'#000'}`}}>Pourcentage : </label>
                <input id='poucentage-patient' readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="number" name="type_assurance" value={type_assurance} onChange={handleChange} autoComplete="off" />
            </p>
        </div>
        <div style={{textAlign: 'center', margin: '10px', color: '#df322d'}}>
            {messageErreur}
        </div>
        {enCours ? 
            <CustomLoader
                styles={{textAlign: 'center'}}
                color="#03ca7e"
                height={80}
                width={80}
            />
                :
            <div style={{marginTop: '20px', marginLeft: '40%',}}>
                <button style={{width: '130px'}} className='bootstrap-btn valider' type="submit" onClick={execAjouterNouveauPatient}>Valider</button>
            </div>
        }
    </form>
  )
}
