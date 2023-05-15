import React, { useContext, useEffect, useState } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import { afficherAge, afficherSexe } from '../../shared/Globals';
import './EditerPatient.css'
import { ROLES, SEXES } from "../../shared/Globals";
import CustomLoader from '../../shared/CustomLoader';

export default function EditerPatient({ ajouterNouveauPatient, resetInfosDuPatient, handleChange, fermerEditerPatient, ouvrirModalPatient, nom, age, sexe, quartier, assurance, type_assurance }) {

    const {role} = useContext(ContextChargement);

    const [listeAssurances, setListeAssurances] = useState([]);
    const [enCours, setEnCours] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');

    useEffect(() => {
        fetch('http://serveur/backend-cmab/assurances.php?liste')
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
                <label htmlFor="" style={{color: `${'#000'}`}}>Noms et Prénoms : </label>
                <input required readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="text" name="nom" value={nom?.toUpperCase()} onChange={handleChange} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="" style={{color: `${'#000'}`}}>Age : </label>
                <input readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="number" name="age" value={age} onChange={handleChange} autoComplete="off" />
            </p>
            <p className="input-zone">
                <label htmlFor="" style={{color: `${'#000'}`}}>Sexe : </label>
                <select required disabled={enCours ? true : false} name="sexe" id="" onChange={handleChange}>
                    <option value="aucun">choisissez le sexe</option>
                    <option value={SEXES.h}>{afficherSexe(SEXES.h)}</option>
                    <option value={SEXES.f}>{afficherSexe(SEXES.f)}</option>
                </select>
            </p>
            <p className="input-zone">
                <label htmlFor="" style={{color: `${'#000'}`}}>Quartier : </label>
                <input readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="text" name="quartier" value={quartier?.toUpperCase()} onChange={handleChange} autoComplete="off" />
            </p>
            <p className="input-zone" style={{display: `${role !== ROLES.secretaire && 'none'}`}}>
                <label htmlFor="" style={{color: `${'#000'}`}}>Assurance : </label>
                <select disabled={enCours ? true : false} style={{color: `${'#000'}`}} name="assurance" id="" onChange={handleChange}>
                    <option value="aucune">choisissez une assurance</option>
                    {listeAssurances.map(item => (
                        <option value={item.designation}>{item.designation.toUpperCase()}</option>
                    ))}
                </select>
            </p>
            <p className="input-zone" style={{display: `${role !== ROLES.secretaire && 'none'}`}}>
                <label htmlFor="" style={{color: `${'#000'}`}}>Pourcentage : </label>
                <input readOnly={enCours ? true : false} style={{color: `${'#000'}`}} type="number" name="type_assurance" value={type_assurance} onChange={handleChange} autoComplete="off" />
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
