import React, { useRef, useState } from 'react';
import './Connexion.css';
import { liensPhilmedical, nomDns } from '../../shared/Globals';

export default function Connexion(props) {
    let name_field = useRef()
    let password_field = useRef()
    const date_e = new Date('2036-01-20');
    const date_j = new Date();
    
    const [erreur, setErreur] = useState('')
    const [nom, setNom] = useState('');
    const [mdp, setMdp] = useState('');
    const [showMdp, setShowMdp] = useState(false);

    // Contrôle des zone de saisie avec le state
    const handleChange = (e) => {
        if(e.target.name === "nom") {
            setNom(e.target.value);
        } else if (e.target.name === "mdp"){
            setMdp(e.target.value);
        }
    }

    const verifConnexion = (e) => {
        /* vérification de l'identifiant et du mot de passe */

        e.preventDefault();

        const data = new FormData();
        data.append('nom', nom.trim().toUpperCase());
        data.append('mdp', mdp.trim().toUpperCase());

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}connexion_caisse.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                // console.log(req.responseText);
                
                if (req.responseText == "identifiant ou mot de passe incorrect") {
                    setErreur(req.responseText);
                } else {
                    setErreur('');
                    const result = JSON.parse(req.responseText);
                    props.setRole(result.rol);
                    props.setNomConnecte(result.nom_user);
                    props.setConnecter(true);
                }
            } else {
                console.log(req.status + " " + req.statusText);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setErreur('Erreur réseau');
        });

        req.send(data);
    }

    const ouvrirLaboratoire = () => {
        props.setOnglet(13)
        props.setRole('laborantin');
        props.setNomConnecte('technicien-labo');
        props.setConnecter(true);
    }

    return (
        <div className='form'>
            <div style={{fontWeight: '600', opacity: '.1', position: 'absolute', top: 0}}>Chrisppo Youmbissi Kamdem</div>\
            <div className='float-start px-3'>
                <a href={`${liensPhilmedical.acceuil}`} className='link-light' role='button'>
                    retour à l'accueil
                </a>
            </div>
            <form action="">
                <h1 className='title'>Caisse</h1>
                <p className='text-field'>
                    <label htmlFor="nom" ref={name_field}>Identifiant</label>
                    <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={nom}
                    autoComplete='off'
                    onChange={handleChange}
                    onFocus={() => {name_field.current.style.bottom = '20px'}}
                    onBlur={(e) => {if(e.target.value === '') name_field.current.style.bottom = '1px'}}
                    />
                </p>
                <p className='text-field'>
                    <label htmlFor="mdp" ref={password_field}>Mot de passe</label>
                    <input
                    type={`${showMdp ? 'text' : 'password'}`}
                    name="mdp"
                    id="mdp"
                    value={mdp}
                    onChange={handleChange}
                    onFocus={() => password_field.current.style.bottom = '20px'}
                    onBlur={(e) => {if(e.target.value === '') password_field.current.style.bottom = '1px'}}
                    />
                </p>
                <p style={{marginTop: 8}}>
                    <label htmlFor="" style={{color: '#fff'}}>Afficher mot de passe</label>
                    <input type="checkbox" checked={showMdp} id="" onChange={(e) => setShowMdp(!showMdp)} />
                </p>
                <button type='submit' onClick={verifConnexion} >Se connecter</button>
                <div className='message-erreur'>{erreur}</div>
            </form>
        </div>
    )
}
