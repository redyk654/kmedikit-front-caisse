import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import '../Commande/Commande.css';
import { ContextChargement } from '../../Context/Chargement';

// Importation des librairies installées
import Modal from 'react-modal';
import { extraireCode, nomDns } from '../../shared/Globals';
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

const customStyles3 = {
    content: {
      top: '48%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#038654',
      width: '80%',
      height: '85vh'
    }, 
};

const styleBtnAutre = {
    height: '4vh',
    width: '38%',
    marginTop: '5px',
    fontSize: '16px',
    cursor: 'pointer'
}

const styleBox = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
    padding: '5px',
}

const autre  = {designation: '', prix: ''};

export default function Modifier(props) {

    const componentRef = useRef();
    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [listeMedocSauvegarde2, setListeMedocSauvegarde2] = useState([]);
    const [medocSelect, setMedoSelect] = useState(false);
    const [nouveauPrix, setNouveauPrix]= useState('');
    const [messageErreur, setMessageErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalPatient, setModalPatient] = useState(false);
    const [renrender, setRerender] = useState(true);
    const [autreState, setAutreState] = useState(autre);

    const {designation, prix} = autreState;

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
                req.open('GET', 'http://serveur/backend-cmab/recuperer_services.php?urgence=oui');
            } else {
                req.open('GET', 'http://serveur/backend-cmab/recuperer_services.php');
            }
            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                    const result = JSON.parse(req.responseText);
    
                    // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                    setListeMedoc(result);
                    setListeMedocSauvegarde(result);
                    setListeMedocSauvegarde2(result);
    
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
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
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

            setListeMedoc(listeMedocSauvegarde2.filter(item => item.categorie.toLowerCase() === e.target.value));
            setListeMedocSauvegarde(listeMedocSauvegarde2.filter(item => item.categorie.toLowerCase() === e.target.value));
        }
    }

    const supprimer = () => {
        if (medocSelect) {
            const req = new XMLHttpRequest();
            req.open('GET', `http://serveur/backend-cmab/gestion_services.php?id=${medocSelect[0].id}`);

            req.addEventListener('load', () => {
                setRerender(!renrender);
                setMedoSelect(false);
            });
    
            req.send();
        }
    }

    const modifierService = () => {
        if (medocSelect) {
            document.querySelector('#enregistrer').disabled = true
            const data = new FormData();
            data.append('prix', nouveauPrix);
            data.append('id', medocSelect[0].id);
            
            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/gestion_services.php');

            req.addEventListener('load', () => {
                fermerModalConfirmation();
                setRerender(!renrender);
                setMedoSelect(false);
            });
    
            req.send(data);
        }
    }

    const contenuModal = () => {
        return (
            <Fragment>
                <h2 style={{color: '#fff', textAlign: 'center'}}>Nouveau Service</h2>
                <div style={{color: '#fff'}}>
                    <p style={styleBox}>
                        <label htmlFor="">Désignation</label>
                        <input type="text" style={{height: '4vh', width: '40%'}} value={designation.toUpperCase()} onChange={handleChange} name='designation' autoComplete='off' />
                    </p>
                    <p style={styleBox}>
                        <label htmlFor="">Prix</label>
                        <input type="text" style={{height: '4vh', width: '40%'}} value={prix} onChange={handleChange} name='prix' autoComplete='off' />
                    </p>
                    <p style={styleBox}>
                        <label htmlFor="categorie">Catégorie</label>
                        <select name="categorie" id="categorie-add" style={{height: '4vh', width: '40%'}}>
                            <option value="maternité">Maternité</option>
                            <option value="imagerie">Imagerie</option>
                            <option value="laboratoire">Laboratoire</option>
                            <option value="carnet">Carnet</option>
                            <option value="medecine">Medecine</option>
                            <option value="chirurgie">Chirurgie</option>
                            <option value="upec">Upec</option>
                            <option value="consultation spécialiste">Consultation Spécialiste</option>
                        </select>
                    </p>
                    <p style={styleBox}>
                        <button style={{width: '20%', cursor: 'pointer'}} onClick={nouveauService}>OK</button>
                    </p>
                </div>
            </Fragment>
        )
    }

    const nouveauService = () => {
        
        if (autreState.designation.length > 0 && prix.length > 0 && !isNaN(prix)) {
            
            const data = new FormData();
            data.append('designation', autreState.designation.toUpperCase().trim());
            data.append('prix', prix);
            data.append('categorie', document.getElementById('categorie-add').value);
    
            const req = new XMLHttpRequest();
            req.open('POST', 'http://serveur/backend-cmab/nouveau_service.php');
    
            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    setAutreState({designation: '', prix: ''});
                    setRerender(true);
                    fermerModalPatient();
                }
            });
    
            req.send(data);
        }
    }

    const handleChange = (e) => {
        setAutreState({...autreState, [e.target.name]: e.target.value});
    }
    
    const autreService = () => {
        setModalPatient(true);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    const fermerModalPatient = () => {
        setAutreState(autre);
        setModalPatient(false);

    }


    return (
        <section className="commande">
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                onRequestClose={fermerModalConfirmation}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>Modifier le prix de {medocSelect && extraireCode(medocSelect[0]?.designation)}</h2>
                <div style={{margin: 10}}>
                    <input type="number" onChange={(e) => setNouveauPrix(e.target.value)} />
                </div>
                <button id='enregistrer' style={styleBtnAutre} onClick={modifierService}>Enregistrer</button>
            </Modal>
            <Modal
                isOpen={modalPatient}
                style={customStyles3}
                contentLabel=""
                ariaHideApp={false}
                onRequestClose={fermerModalPatient}
            >
                {contenuModal()}
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" className="recherche" placeholder="recherchez un service" onChange={filtrerListe} autoComplete='off' />
                </p>
                <div>
                    <label htmlFor="categorie">Catégorie : </label>
                    <select name="categorie" id="categorie" onChange={changerCategorie}>
                        <option value="tout">Tout les services</option>
                        <option value="maternité">Maternité</option>
                        <option value="imagerie">Imagerie</option>
                        <option value="laboratoire">Laboratoire</option>
                        <option value="carnet">Carnet</option>
                        <option value="medecine">Medecine</option>
                        <option value="chirurgie">Chirurgie</option>
                        <option value="upec">Upec</option>
                        <option value="consultation spécialiste">Consultation Spécialiste</option>
                    </select>
                </div>
                <div>
                    <button className='' style={styleBtnAutre} onClick={autreService}>nouveau service</button>
                </div>
                <div className="liste-medoc">
                    <h1>Services</h1>
                    <ul>
                        {listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos}>{extraireCode(item.designation)}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="right-side">
                <h1>{medocSelect ? "Détails du service" : "Selectionnez un service pour voir les détails"}</h1>

                <div className="infos-medoc">
                    {medocSelect && medocSelect.map(item => (
                        <div className="service">
                            <div>
                                <p>Designation</p>
                                <p  style={{fontWeight: '700', color: '#000'}}>{extraireCode(item.designation)}</p>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <p>Prix</p>
                                <p  style={{fontWeight: '700', color: '#000'}}>{item.prix + ' Fcfa'}</p>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <p>Catégorie</p>
                                <p  style={{fontWeight: '700', color: '#000'}}>{item.categorie}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="details-commande">
                        <div className="valider-annuler">
                            <button className='bootstrap-btn annuler' onClick={supprimer}>Supprimer</button>
                            <button className='bootstrap-btn valider' onClick={() => setModalConfirmation(true)}>Modifier</button>

                        </div>
                    </div>
            </div>
        </section>
    )
}
