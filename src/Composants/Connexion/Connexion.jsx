import React, { useRef, useState } from 'react';
import './Connexion.css';
import { convertirDateAvecTiret, liensPhilmedical, nomDns } from '../../shared/Globals';

export default function Connexion(props) {
    let name_field = useRef()
    let password_field = useRef()
    const date_e = new Date('2025-08-13');
    
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

    const dateDuJourServeur = async () => {
        const res = fetch(`${nomDns}get_time.php`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur HTTP : " + response.status)
            }
            return response.json()
        })
        .then(data => {
            let today = data.date
            today = convertirDateAvecTiret(today.substring(0, 10))
            
            return today
        })
        .catch(error => {
            console.error('Erreur complète:', error);
        });

        return res;
    }

    const verifConnexion = async (e) => {
        e.preventDefault();
        /* vérification de l'identifiant et du mot de passe */


        const res = await dateDuJourServeur()
        // console.log(res);
        
        let date_j = new Date(res)


        // console.log(date_j);
        
        if (date_j.getTime() > date_e.getTime()) {
            setErreur('No database found');
            return;
        }



        const data = new FormData();
        data.append('nom', nom.trim().toUpperCase());
        data.append('mdp', mdp.trim().toUpperCase());

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}connexion_caisse.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
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
                <h1 className='title'>Administration</h1>
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
