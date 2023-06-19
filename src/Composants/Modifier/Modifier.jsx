import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import '../Commande/Commande.css';
import './Modifier.css'
import { CFormSwitch, CBadge } from '@coreui/react';

// Importation des librairies installées
import Modal from 'react-modal';
import { CATEGORIES, extraireCode, nomDns } from '../../shared/Globals';
import ModifService from './ModifService';
import { toast, Toaster } from "react-hot-toast";
import AfficherGeneralites from './AfficherGeneralites';
// Styles pour les fenêtres modales
const customStyles1 = {
    content: {
      top: '15%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
    }, 
};

const customStylesGeneralites = {
    content: {
        top: '45%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        width: '40vw',
        height: '80vh',
    }
}

const styleBtnAutre = {
    height: '4vh',
    width: '38%',
    marginTop: '5px',
    fontSize: '16px',
    cursor: 'pointer'
}

const service = {
    id: '',
    designation: '',
    prix: '',
    categorie: '',
    generalite: '',
}

export default function Modifier(props) {

    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';
    
    const [listeDesGeneralites, setListeDesGeneralites] = useState([]);
    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [listeMedocSauvegarde2, setListeMedocSauvegarde2] = useState([]);
    const [medocSelect, setMedoSelect] = useState(service);
    const [messageErreur, setMessageErreur] = useState('');
    const [renrender, setRerender] = useState(true);
    const [isModifier, setIsModifier] = useState(false);
    const [modalGeneralites, setModalGeneralites] = useState(false);

    useEffect(() => {
        const d = new Date();
        let urgence;

        if (renrender) {
            // Etat d'urgence entre 17h et 8h et les weekends
            
            if (d.getHours() >= 17 || d.getHours() <= 7 || (d.getDay() === 0 || d.getDay() === 6)) {
                urgence = true;
            } else {
                urgence = false;
            }

            setRerender(false);
            // Récupération des médicaments dans la base via une requête Ajax
            const req = new XMLHttpRequest();
            if (urgence) {
                req.open('GET', `${nomDns}recuperer_services.php?urgence=oui`);
            } else {
                req.open('GET', `${nomDns}recuperer_services.php`);
            }

            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                    const result = JSON.parse(req.responseText);
    
                    // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                    setListeMedoc(result);
                    setListeMedocSauvegarde(result);
                    setListeMedocSauvegarde2(result);
                    setListeDesGeneralites(result.filter(item => parseInt(item.generalite) === 1));
                } else {
                    // Affichage des informations sur l'échec du traitement de la requête
                    console.error(req.status + " " + req.statusText);
                }
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                console.error("Erreur réseau");
            });
    
            req.send();
        }
    }, [renrender]);

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        setIsModifier(false);
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value))[0];
        setMedoSelect(medocSelectionne);
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
        setListeMedoc(medocFilter);
    }

    const changerCategorie = (e) => {
        if (e.target.value === "tout") {
            setListeMedoc(listeMedocSauvegarde2)
            setListeMedocSauvegarde(listeMedocSauvegarde2)
        } else {

            setListeMedoc(listeMedocSauvegarde2.filter(item => item.categorie.toLowerCase() === e.target.value.toLowerCase()));
            setListeMedocSauvegarde(listeMedocSauvegarde2.filter(item => item.categorie.toLowerCase() === e.target.value.toLowerCase()));
        }
    }

    const supprimer = () => {
        if (medocSelect) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}gestion_services.php?id=${medocSelect.id}`);

            req.addEventListener('load', () => {
                setRerender(!renrender);
                setMedoSelect(service);
            });
    
            req.send();
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "generalite") {
            if (parseInt(medocSelect.generalite)) {
                setMedoSelect({...medocSelect, [e.target.name]: 0});
            } else {
                setMedoSelect({...medocSelect, [e.target.name]: 1});
            }
        } else {
            setMedoSelect({...medocSelect, [e.target.name]: e.target.value.toUpperCase()});
        }
    }

    const enregistrerModif = () => {
        if (medocSelect.designation.length > 0) {
            const data = new FormData();
            data.append('designation', medocSelect.designation);
            data.append('prix', medocSelect.prix);
            data.append('categorie', medocSelect.categorie);
            data.append('generalite', medocSelect.generalite);
            data.append('id', medocSelect.id);
            
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}gestion_services.php`);

            req.addEventListener('load', () => {
                setMedoSelect(service);
                setIsModifier(false);
                setRerender(!renrender);
                toast.success('Modification enregistrée avec succès');
            });
            req.send(data);
        }
    }

    const retirerActeDesGeneralites = (e) => {
        if (e.target.id !== "") {
            const data = new FormData();
            data.append('generalite', 0);
            data.append('id', e.target.id);
            
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}gestion_services.php?retirer_generalite`);
    
            req.addEventListener('load', () => {
                setListeDesGeneralites(listeDesGeneralites.filter(item => item.id !== e.target.id));
                setRerender(!renrender);
            });
            req.send(data);
        }
    }

    const fermerModalGeneralites = () => {
        setModalGeneralites(false);
    }

    const ouvrirModalGeneralites = () => {
        setModalGeneralites(true);
    }

    return (
        <Fragment>
            <div><Toaster/></div>
            <section className="commande">
                <Modal
                    isOpen={modalGeneralites}
                    style={customStylesGeneralites}
                    onRequestClose={fermerModalGeneralites}
                    contentLabel="modal generalites"
                >
                    <AfficherGeneralites
                        listeDesGeneralites={listeDesGeneralites}
                        retirerActeDesGeneralites={retirerActeDesGeneralites}
                    />
                </Modal>
                <div className="left-side">
                    <p className="search-zone">
                        <input type="text" className="recherche" placeholder="recherchez un service" onChange={filtrerListe} autoComplete='off' />
                    </p>
                    <div>
                        <label htmlFor="categorie1">Catégorie : </label>
                        <select name="categorie1" id="categorie1" onChange={changerCategorie}>
                            <option value="tout">Tout les services</option>
                            {CATEGORIES.map(item => (
                                <option value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <a role="button" onClick={ouvrirModalGeneralites} className='link-primary'>Liste des généralités</a>
                    </div>
                    <div className="liste-medoc">
                        <h1>Services</h1>
                        <ul>
                            {listeMedoc.map(item => (
                                <li value={item.id} key={item.id} onClick={afficherInfos}>
                                    {extraireCode(item.designation)}
                                    &nbsp;
                                    {parseInt(item.generalite) === 1 
                                        &&
                                        <CBadge color='dark'>g</CBadge>
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="right-side">
                    <h1>{isModifier ? "Modifier les infos du service" : "Détails du service"}</h1>

                    <div className="infos-medoc">
                        {isModifier ? (
                            <ModifService
                                {...medocSelect}
                                handleChange={handleChange}
                                enregistrerModif={enregistrerModif}
                            />
                        ) : (
                            <div className={`ps-3 ${medocSelect.designation.length === 0 && 'd-none'}`}>
                                <div>
                                    <p>Designation</p>
                                    <p  style={{fontWeight: '700', color: '#000'}}>{extraireCode(medocSelect.designation)}</p>
                                </div>
                                <div style={{paddingTop: 10}}>
                                    <p>Prix</p>
                                    <p  style={{fontWeight: '700', color: '#000'}}>{medocSelect.prix + ' Fcfa'}</p>
                                </div>
                                <div style={{paddingTop: 10}}>
                                    <p>Catégorie</p>
                                    <p  style={{fontWeight: '700', color: '#000'}}>{medocSelect.categorie}</p>
                                </div>
                                <div>
                                    <p style={{width: '15vw'}}>
                                        <CFormSwitch checked={parseInt(medocSelect.generalite) ? true : false} size='xl' label="Généralité"/>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="details-commande">
                        <div className={`valider-annuler ${isModifier ? 'd-none' : 'd-block'}`}>
                            <button className='bootstrap-btn valider w-25' onClick={() => setIsModifier(true)}>Modifier</button>
                            <button className='bootstrap-btn annuler w-25' onClick={supprimer}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
