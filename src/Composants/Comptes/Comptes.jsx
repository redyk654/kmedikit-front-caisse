import React, { Fragment, useEffect, useState } from 'react';
import './Comptes.css';
import Modal from 'react-modal';
import { ROLES, nomDns } from "../../shared/Globals";

const customStyles1 = {
    content: {
      top: '42%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
    },
};

const utilisateur = {
    nom: '',
    pseudo: '',
    mdp: '',
    confirmation: ''
}

export default function Comptes(props) {

    const [listeComptes, setListeComptes] = useState([]);
    const [recettes, setRecettes] = useState([]);
    const [recettejour, setRecetteJour] = useState({});
    const [compteSelectionne, setCompteSelectionne] = useState([]);
    const [modalContenu, setModalContenu] = useState(true);
    const [nvCompte, setNvCompte] = useState(utilisateur);
    const [msgErreur, setMsgErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [reussi, setReussi] = useState('supp');

    const { nom, pseudo, mdp, confirmation } = nvCompte;


    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_caissier.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                // result = result.filter(item => (item.nom_user.toUpperCase() !== props.nomConnecte.toUpperCase())).filter(item => (item.rol.toUpperCase() !== ROLES.admin.toUpperCase()));
                setListeComptes(result);
            }
        });

        req.send();
    }, [modalReussi, modalConfirmation]);

    const changerContenuModal = () => {
        return modalContenu ? 
        (
            <Fragment>
                <h2 style={{color: '#fff'}}>Enregistrer cette recette ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button id='annuler' className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>non</button>
                    <button id='confirmer' className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={enregisterRecette}>oui</button>
                </div>
            </Fragment>
        ) :
        (
            <form action="" className="form-compte">
                <h3>Nouveau compte</h3>
                <div className="box-input">
                    <p className="input-zone">
                        <label htmlFor="">Nom</label>
                        <input type="text" name="nom" value={nom} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Identifiant</label>
                        <input type="text" name="pseudo" value={pseudo} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Mot de passe</label>
                        <input type="password" name="mdp" value={mdp} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Confirmer mot de passe</label>
                        <input type="password" name="confirmation" value={confirmation} onChange={handleChange} autoComplete="off" />
                    </p>
                    <p className="input-zone">
                        <label htmlFor="">Rôle : </label>
                        <select name="role">
                            <option value={ROLES.caissier}>caissier</option>
                            <option value={ROLES.regisseur}>regisseur</option>
                            {props.role === ROLES.admin ? <option value={ROLES.admin}>admin</option> : null}
                            <option value={ROLES.secretaire}>sécrétaire</option>
                        </select>
                    </p>
                </div>
                <div style={{color: '#fff53b'}}>{msgErreur}</div>
                <div className="btn-control">
                    <button type="reset" onClick={annulerCompte}>annuler</button>
                    <button type="submit" onClick={enregistrerCompte}>valider</button>
                </div>
            </form>
        )
    }

    const annulerCompte = () => {
        fermerModalConfirmation();
        setNvCompte(utilisateur)
        setMsgErreur('');
    }

    const enregistrerCompte = (e) => {
        e.preventDefault();
        // Enregistrement du nouveau compte dans la base de données

        if (mdp !== confirmation) {
            setMsgErreur('Le mot de passe et le mot passe de confirmation doivent être identique');
        } else if (pseudo.includes(' ')) {
            setMsgErreur("l'identifiant ne doit pas contenir d'espace");
        } else if (pseudo.length < 2 || pseudo.length > 6) {
            setMsgErreur("l'identifiant doit être compris entre 2 et 6 caractères");
        } else if (nom.length === 0) {
            setMsgErreur('le champ nom ne doit pas être vide');
        } else if (mdp.length < 3 || mdp.length > 8) {
            setMsgErreur('le mot de passe doit être compris entre 3 et 8 caractères');
        } else {
            setMsgErreur('');

            const data = new FormData();
            data.append('nom', nom.trim().toUpperCase());
            data.append('pseudo', pseudo.trim().toUpperCase());
            data.append('mdp', mdp.trim().toUpperCase());
            data.append('role', document.querySelector('form').role.value);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}enregistrer_caissier.php`);

            req.addEventListener('load', () => {
                if (req.response.toLowerCase() == "Cet identifiant est déjà utilisé. choisissez en un autre".toLowerCase()) {
                    setMsgErreur(req.response);
                } else {
                    console.log(req.response);
                    setNvCompte(utilisateur);
                    fermerModalConfirmation();
                    setReussi('');
                    setModalReussi(true);
                }
            })

            req.send(data);
        }
    }

    const handleChange = (e) => {
        setNvCompte({...nvCompte, [e.target.name]: e.target.value});
    }

    const ajouterCompte = () => {
        setModalContenu(false);
        setModalConfirmation(true)
    }

    const afficherCompte = (e) => {
        // Affichage d'un compte
        setCompteSelectionne(listeComptes.filter(item => item.nom_user === e.target.id));
    }

    const enregisterRecette = () => {
        // Enreistrement de la recette dans la base de données
        setModalContenu(true);
        setModalConfirmation(false);
        const data = new FormData();
        data.append('nom', compteSelectionne);
        data.append('montant', recettejour.recette);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}gestion_caisse.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setModalReussi(true);
            }
        })

        req.send(data);
    }
    
    const supprimerCompte = () => {
        // Suppression d'un compte
        if (compteSelectionne.length > 0) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}supprimer_compte.php?compte=${compteSelectionne[0].pseudo}`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    setCompteSelectionne([]);
                    setReussi('supp');
                    setModalReussi(true);
                }
            })
            req.send();
        }
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }
  
    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    return (
        <section className="comptes">
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                {changerContenuModal()}
            </Modal>
            <Modal
                isOpen={modalReussi}
                onRequestClose={fermerModalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                {reussi === 'supp' ?
                (
                    <Fragment>
                        <h2 style={{color: '#fff'}}>Compte supprimé✔️!</h2>
                        <button style={{width: '25%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>Fermer</button>
                    </Fragment>
                ) : 
                (
                    <Fragment>
                        <h2 style={{color: '#fff'}}>Enregistré avec succès✔️!</h2>
                        <button style={{width: '25%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>Fermer</button>
                    </Fragment>
                )}
            </Modal>
            <h1>Gestions des comptes</h1>
            <div className="container-gestion">
                <div className="box-1">
                    <h1>Comptes</h1>
                    <ul>
                        {listeComptes.length > 0 && listeComptes.map(item => (
                        <li id={item.nom_user} onClick={afficherCompte}>{item.nom_user.toUpperCase()}</li>
                        ))}
                    <div className="nv-compte">
                        <button className='bootstrap-btn' style={{width: '45%', marginBottom: '8px',}} onClick={ajouterCompte}>ajouter</button>
                    </div>
                    </ul>
                </div>
                <div className="box-2">
                   <h1>Détails Compte</h1>
                   <div className="details-compte" style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <div style={{width: '100%'}}>Nom</div>
                            <div style={{width: '100%', fontWeight: '600'}}>{compteSelectionne.length > 0 && compteSelectionne[0].nom_user}</div>
                        </div>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <div style={{width: '100%'}}>Rôle</div>
                            <div style={{width: '100%', fontWeight: '600'}}>{compteSelectionne.length > 0 && compteSelectionne[0].rol}</div>
                        </div>
                   </div>
                   {/* <div style={{width: '100%', textAlign: 'center',}}>   
                        <button className='bootstrap-btn annuler' style={{width: '15%', marginTop: '30px',}} onClick={supprimerCompte}>Supprimer</button>
                   </div> */}
                </div>
            </div>
        </section>
    )
}
