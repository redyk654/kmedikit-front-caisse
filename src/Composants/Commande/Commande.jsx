import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import './Commande.css';
import { ContextChargement } from '../../Context/Chargement';
import { extraireCode, CATEGORIES, nomDns, ServiceExiste } from '../../shared/Globals';
import AfficherPatient from '../Patients/AfficherPatient';
import EditerPatient from '../Patients/EditerPatient';
import ModalPatient from '../Patients/ModalPatient';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactToPrint from 'react-to-print';
import Facture from '../Facture/Facture';
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons';
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

const customStyles4 = {
    content: {
      top: '47%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#e5f3fc',
      color: '#000',
      width: '65%'
    },
};

const styleBtnAutre = {
    backgroundColor: '#6d6f94',
    color: '#fff',
    height: '5vh',
    width: '48%',
    marginTop: '5px',
    fontSize: '16px',
    cursor: 'pointer'
}

const stylePatient = {
    marginTop: '5px',
    height: '45vh',
    border: '1px solid gray',
    overflow: 'auto',
    position: 'relative',
    backgroundColor: '#fff'
}

const styleItem = {
    color: '#0e771a', 
    fontWeight: 'bold', 
    width: '100%', 
    cursor: 'pointer',
    padding: '8px', 
    borderBottom: '1px solid #0e771a',
}

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

const styleBox = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
    padding: '5px',
}

const detailsDuPatient = {
    code: '',
    nom: '',
    age: '',
    sexe: '',
    quartier: '',
    assurance: 'aucune',
    type_assurance: '0',
}

export default function Commande(props) {

    const componentRef = useRef();
    const annuler = useRef();
    const btnAjout = useRef();
    const btnMateriel = useRef();
    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const autre  = {designation: '', prix: ''};
    const assuranceDefaut = 'aucune';

    const date_e = new Date('2023-12-19');
    const date_j = new Date();

    const [nouveauPatient, setNouveauPatient] = useState(detailsDuPatient);
    const [patientChoisi, setPatientChoisi] = useState(detailsDuPatient);
    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [qteDesire, setQteDesire] = useState(1);
    const [patient, setPatient] = useState('');
    const [autreState, setAutreState] = useState(autre);
    const [medocSelect, setMedoSelect] = useState(false);
    const [medocCommandes, setMedocCommandes] = useState([]);
    const [montantMateriel, setMontantMateriel] = useState(0);
    const [option, setoption] = useState('');
    const [reduction, setreduction] = useState(false);
    const [valeurReduction, setvaleurReduction] = useState(0);
    const [montantVerse, setMontantVerse] = useState(0);
    const [idFacture, setidFacture] = useState('');
    // const [urgence, setUrgence] = useState(false);
    const [listePatient, setlistePatient] = useState([]);
    const [modalEditerPatient, setModalEditerPatient] = useState(false);
    const [statu, setStatu] = useState('done');
    const [messageErreur, setMessageErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalPatient, setModalPatient] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [rerender, setRerender] = useState(true);

    const {designation, prix} = autreState;

    const { code, nom, age, sexe, quartier, assurance, type_assurance } = nouveauPatient;

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        if (date_j.getTime() <= date_e.getTime()) {
            
        } else {
            setTimeout(() => {
                setListeMedoc([]);
                setListeMedocSauvegarde([])
                props.setConnecter(false);
                // props.setOnglet(1);
            }, 5000);
            setTimeout(() => {
                props.setConnecter(false);
            }, 8000);
        }
    }, []);


    useEffect(() => {
        const d = new Date();
        let urgence;

        if (rerender || !rerender) {
            // Etat d'urgence entre 17h et 8h et les weekends
            
            if (d.getHours() >= 17 || d.getHours() <= 7 || (d.getDay() === 0 || d.getDay() === 6)) {
                urgence = true;
            } else {
                urgence = false;
            }

            setRerender(false);
            startChargement();
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
                    stopChargement();
                    document.querySelector('.recherche').value = "";
                    document.querySelector('.recherche').focus();
    
                } else {
                    // Affichage des informations sur l'échec du traitement de la requête
                    console.error(req.status + " " + req.statusText);
                }
            });
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });    
    
            req.send();
        }
    }, [rerender]);

    const calculerPrixTotal = () => {
        let prixTotalT = 0;
        if (medocSelect || designation.length > 0 && prix.length > 0) {
            
            prixTotalT = medocCommandes.reduce((som, curr) => som + parseInt(curr.prix), 0)
            prixTotalT += montantMateriel;

        }
        return parseInt(prixTotalT);
    }

    const calculerNetAPayer = () => {
        let netAPayer = (calculerPrixTotal() * ((100 - parseInt(patientChoisi.type_assurance)) / 100));

        if (!isNaN(valeurReduction))
            netAPayer = netAPayer - (netAPayer * (parseInt(valeurReduction) / 100))
        
        return isNaN(netAPayer) ? 0 : parseInt(netAPayer);
    }

    const calculerResteAPayer = () => {
        let resteAPayer = 0;
        if (parseInt(montantVerse) < calculerNetAPayer())
            resteAPayer = (calculerNetAPayer() - montantVerse)

        return parseInt(resteAPayer);
    }
    
    const calculerRelicat = () => {
        let relicat = 0;
        if (parseInt(montantVerse) > calculerNetAPayer())
            relicat = (montantVerse - calculerNetAPayer())

        return parseInt(relicat);
    }

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
        setQteDesire(1);
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1));
        setListeMedoc(medocFilter);
    }

    const retirerCommande = () => {
        const tab = medocCommandes;
        tab.pop();
        setMedocCommandes([...tab]);
        
    }

    // Enregistrement d'un médicament dans la commande
    const ajouterMedoc = () => {

        // Desactive le bouton d'ajout quelques secondes
        btnAjout.current.disabled = true;
        setTimeout(() => {
            btnAjout.current.disabled = false;
        }, 1000);

        if (qteDesire && !isNaN(qteDesire) && medocSelect) {

            setMessageErreur('');
            
            medocSelect[0].reduction = false;
            setMessageErreur('');
            setMedocCommandes([...medocCommandes, medocSelect[0]]);

            document.querySelector('.recherche').value = "";
            document.querySelector('.recherche').focus();

        }
        setQteDesire(1);
    }

    // const desactiverBoutonMateriel = () => {
    //     btnMateriel.current.disabled = true;
    //     setMontantMateriel(MONTANTMATERIEL);
    // }

    const annulerCommande = () => {
        setMedoSelect(false);
        setMedocCommandes([]);
        setPatient('');
        setvaleurReduction(0);
        setMessageErreur('');
        setMontantVerse(0);
        document.querySelector('.recherche').value = "";
        document.querySelector('.recherche').focus();
        setMontantMateriel(0);
        setreduction(false);
        setPatientChoisi(detailsDuPatient)
    }

    const sauvegarder = () => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}backup.php`);

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('');
        });


        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000000)
               .toString(32)
               .substring(1).toUpperCase();
    }

    const enregisterFacture = (id) => {

        // Enregistrement de la facture

        const data = new FormData();

        montantMateriel === 500 ? data.append('frais_materiel', 500) : data.append('frais_materiel', 0);

        data.append('id', id);
        data.append('caissier', props.nomConnecte);
        data.append('nom_patient', patientChoisi.nom);
        data.append('code_patient', patientChoisi.code);
        data.append('prix_total', calculerPrixTotal());
        data.append('reduction', valeurReduction);
        data.append('net_a_payer', calculerNetAPayer());
        data.append('montant_verse', montantVerse);
        data.append('relicat', calculerRelicat());
        data.append('reste_a_payer', calculerResteAPayer());
        data.append('assurance', patientChoisi.assurance);
        data.append('type_assurance', patientChoisi.type_assurance);
        data.append('statu', statu);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}index.php?enregistrer_facture`);

        req.addEventListener('load', () => {
            setMessageErreur('');
            // setActualiserQte(!actualiserQte);
            // Activation de la fenêtre modale qui indique la réussite de la commmande
            setModalReussi(true);
            // Désactivation de la fenêtre modale de confirmation
            fermerModalConfirmation();
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });


        req.send(data);

    }

    const validerCommande = () => {

        /* 
            Organisation des données qui seront envoyés au serveur :
                - pour la mise à jour des stocks de médicaments
                - pour la mise à jour de l'historique des commandes
        */
       const id = idUnique();
       setidFacture(id);
       if(medocCommandes.length > 0) {

            let i = 0;
            document.querySelector('.valide').disabled = true;
            annuler.current.disabled = true;

            medocCommandes.map(item => {

                const data2 = new FormData();

                data2.append('code_patient', patientChoisi.code);
                data2.append('id_facture', id);
                data2.append('designation', item.designation);
                data2.append('prix_total', item.prix);
                data2.append('categorie', item.categorie);
                data2.append('caissier', props.nomConnecte);
                data2.append('reduction', valeurReduction);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', `${nomDns}index.php?enreg_historique_service`);
                
                // Une fois la requête charger on vide tout les états
                req2.addEventListener('load', () => {
                    if (req2.status >= 200 && req2.status < 400) {
                        // console.log(req2.response);
                        setMessageErreur('');
                        i++;
                        if (medocCommandes.length === i) {
                            // Toutes les données ont été envoyées
                            enregisterFacture(id);
                        }
                    }
                });

                req2.addEventListener("error", function () {
                    // La requête n'a pas réussi à atteindre le serveur
                    setMessageErreur('Erreur réseau');
                });
        
                req2.send(data2);
            })
        } else {
            setModalReussi(true);
            // Désactivation de la fenêtre modale de confirmation
            fermerModalConfirmation();
        }
    }

    const appliquerReduction = (e) => {
        // Gestion des reduction sur un service

        setreduction(true);
    }

    const demanderConfirmation = () => {
        if (medocCommandes.length > 0) {
            if (patientChoisi.nom.length > 0) {
                if (calculerResteAPayer() > 0) {
                    setMessageErreur('Veuillez entrer le montant versé');
                } else {
                    setMessageErreur('');
                    setModalConfirmation(true);
                }
            } else {
                setMessageErreur('Entrez le nom et le prénom du patient');
            }
        }
    }

    const infosPatient = () => {

        // Affiche la fenêtre des informations du patient
        ouvrirModalPatient();

        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}index.php?tous_les_patient`);

        req.addEventListener('load', () => {
            // console.log(req.response);
            const result = JSON.parse(req.responseText);
            setlistePatient(result);
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });


        req.send();
    }

    const autreService = () => {
        setoption('autre');
        setModalPatient(true);
    }

    const handleChange = (e) => {
        setAutreState({...autreState, [e.target.name]: e.target.value});
    }

    const nouveauService = () => {
        
        if (autreState.designation.length > 0 && prix.length > 0 && !isNaN(prix)) {
            
            const data = new FormData();
            data.append('designation', autreState.designation.toUpperCase().trim());
            data.append('prix', prix);
            data.append('categorie', document.getElementById('categorie').value);
    
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}nouveau_service.php`);
    
            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    if (req.responseText.toUpperCase() === ServiceExiste.toUpperCase()) {
                        setMessageErreur('Ce service existe déjà');
                    } else {
                        setMessageErreur('');
                        setAutreState({designation: '', prix: ''});
                        setRerender(true);
                        fermerModalPatient();
                    }
                }
            });
    
            req.send(data);
        }
    }

    const contenuModal = () => {
        if (option === 'patient') {
            return (
                <Fragment>
                    <h2 style={{color: '#fff', textAlign: 'center'}}>informations du patient</h2>
                    <div className="detail-item">
                        <>
                            <ModalPatient
                                patient={patient}
                                filtrerPatient={filtrerPatient}
                                stylePatient={stylePatient}
                                listePatient={listePatient}
                                selectionnePatient={selectionnePatient}
                                ouvrirEditerPatient={ouvrirEditerPatient}
                            />
                        </>
                        <>
                            <AfficherPatient 
                                patientChoisi={patientChoisi} 
                                fermerModalPatient={fermerModalPatient}
                            />
                        </>
                    </div>
                </Fragment>
            )
        } else if (option === 'autre') {
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
                            <select name="categorie" id="categorie" style={{height: '4vh', width: '40%'}}>
                                {CATEGORIES.map(item => (
                                    <option value={item}>{item}</option>
                                ))}
                            </select>
                        </p>
                        <p className='text-light text-center'>{messageErreur}</p>
                        <p style={styleBox}>
                            <button className='bootstrap-btn valider' style={{width: '20%', cursor: 'pointer'}} onClick={nouveauService}>Ajouter</button>
                        </p>
                    </div>
                </Fragment>
            )
        }
    }

    const selectionnePatient = (e) => {
        const patientSelectionne = listePatient.filter(patient => patient.code === e.target.id)[0];
        setPatientChoisi(patientSelectionne);
    }

    const ajouterService = () => {
        if (designation.length > 0 && prix.length > 0 && !isNaN(prix)) {
            autreState.id = Math.random().toString();
            autreState.designation = document.getElementById('categorie').value + ' ' + autreState.designation
            setMedocCommandes([...medocCommandes, autreState]);
            fermerModalPatient();
        }
    }

    const filtrerPatient = (e) => {
        setPatient(e.target.value);

        const req = new XMLHttpRequest();

        req.open('GET', `${nomDns}index.php?rechercher_patient=${(e.target.value).trim()}`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);

                setlistePatient(result);
            }
            
        });

        req.send();
    }

    const resetInfosDuPatient = () => {
        setNouveauPatient(detailsDuPatient);
    }

    const ouvrirModalPatient = () => {
        setPatient('');
        setoption('patient');
        setModalPatient(true);
    }
    
    const fermerModalPatient = () => {
        setMessageErreur('');
        setModalPatient(false);
        setPatient('');
        setAutreState(autre);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        sauvegarder();
        setMedocCommandes([]);
        annulerCommande();
        setPatientChoisi(detailsDuPatient);
    }

    const fermerEditerPatient = () => {
        setModalEditerPatient(false)
    }

    const ouvrirEditerPatient = () => {
        setModalEditerPatient(true);
        fermerModalPatient();
    }

    const handleChangeReduction = (e) => {
        if(e.target.value.length === 0)
            setvaleurReduction(0);
        else
            setvaleurReduction(parseInt(e.target.value))
    }

    const handleChangeMontantVerse = (e) => {
        if(e.target.value.length === 0)
            setMontantVerse(0);
        else
            setMontantVerse(parseInt(e.target.value))
    }

    const handleChangePatient = (e) => {
        setNouveauPatient({...nouveauPatient, [e.target.name]: e.target.value});
    }

    const creerCodePatient = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000)
               .toString(32)
               .substring(1).toUpperCase();        
    }


    const ajouterNouveauPatient = () => {
        const req = new XMLHttpRequest();
        const data = new FormData();

        data.append('code', creerCodePatient());
        data.append('nouveau_patient', JSON.stringify(nouveauPatient))

        req.open('POST', `${nomDns}index.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setPatientChoisi(nouveauPatient);
                fermerEditerPatient();
                resetInfosDuPatient();
            }
        });

        req.send(data);
    }

    return (
        <section className="commande">
            <Modal
                isOpen={modalEditerPatient}
                style={customStyles4}
                contentLabel=""
            >
                <EditerPatient
                    handleChange={handleChangePatient}
                    fermerEditerPatient={fermerEditerPatient}
                    ouvrirModalPatient={ouvrirModalPatient}
                    resetInfosDuPatient={resetInfosDuPatient}
                    ajouterNouveauPatient={ajouterNouveauPatient}
                    nom={nom}
                    age={age}
                    sexe={sexe}
                    quartier={quartier}
                    assurance={assurance}
                    type_assurance={type_assurance}
                />
            </Modal>
            <Modal
                isOpen={modalPatient}
                style={customStyles3}
                contentLabel="validation commande"
                ariaHideApp={false}
                onRequestClose={fermerModalPatient}
            >
                {contenuModal()}
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>êtes-vous sûr de vouloir valider cette facture ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button ref={annuler}  style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                    <button className="valide" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={validerCommande}>Confirmer</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                <CIcon onClick={fermerModalReussi} icon={cilX} size='lg' className=' text-bg-light' role='button' />
                <h2 style={{color: '#fff'}}>Service effectué !</h2>
                <ReactToPrint
                    trigger={() => <button style={{color: '#303031', height: '5vh', width: '7vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                    content={() => componentRef.current}
                    // onAfterPrint={fermerModalReussi}
                />
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" className="recherche" placeholder="recherchez un service" onChange={filtrerListe} autoComplete='off' />
                </p>
                <div>
                    <button className='bootstrap-btn' style={styleBtnAutre} onClick={autreService}>nouveau service</button>
                </div>
                <div className="liste-medoc">
                    <h1>Services</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="TailSpin" color="#03ca7e" height={100} width={100}/></div> : listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos}>{extraireCode(item.designation).toUpperCase()}</li>
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
                                <p style={{fontWeight: '700'}}>{extraireCode(item.designation).toUpperCase()}</p>
                            </div>
                            <div style={{paddingTop: 10}}>
                                <p>Prix</p>
                                <p style={{fontWeight: '700'}}>{item.prix + ' Fcfa'}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="box" style={{marginLeft: 5}}>
                    <div className="">
                        <button className='bootstrap-btn' ref={btnAjout} style={{margin: '4px', width: '8%'}} onClick={ajouterMedoc}>ajouter</button>
                        {/* <button className='bootstrap-btn' ref={btnMateriel} style={{backgroundColor: '#6d6f94', marginLeft: '0px', width: '7%'}} onClick={desactiverBoutonMateriel}>+500</button> */}
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button className='btn-patient' style={{ width: '30%'}} onClick={infosPatient}>Infos du patient</button>
                    </div>
                    <div>
                        <div>
                            <input type="number" name="reduction" value={valeurReduction} onChange={handleChangeReduction} autoComplete='off' style={{display: reduction ? 'inline-block' : 'none'}} />
                            <button className='bootstrap-btn' style={{display: reduction ? 'none' : 'inline-block', backgroundColor: '#6d6f94'}}  onClick={appliquerReduction}>reduction</button>
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        {patientChoisi.nom.length > 0 ? (
                            <div>
                                Patient: <span style={{color: '#0e771a', fontWeight: '700'}}>{patientChoisi.nom.toUpperCase()}</span>
                            </div>
                        ) : null}
                        {patientChoisi.assurance.toUpperCase() !== assuranceDefaut.toUpperCase() ? (
                            <div style={{}}>
                                Couvert par: <span style={{color: '#0e771a', fontWeight: '700'}}>{patientChoisi.assurance.toLocaleUpperCase()}</span>
                            </div>
                        ) : null}
                        <label htmlFor="">Montant versé : </label>
                        <input type="number" name='verse' value={montantVerse} onChange={handleChangeMontantVerse} autoComplete='off' />
                    </div>
                </div>

                <div className='erreur-message'>{messageErreur}</div>

                <div className="details-commande">
                    <h1>Facture en cours</h1>

                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>Prix</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocCommandes.map(item => (
                                <tr style={{cursor: 'pointer'}} onClick={retirerCommande}>
                                    <td>{extraireCode(item.designation).toUpperCase()}</td>
                                    <td>{item.prix + ' Fcfa' }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="valider-annuler">
                        <div className="totaux">
                            <div>
                                Prix total : <span style={{color: "#012557", fontWeight: "600"}}>{calculerPrixTotal() + ' Fcfa'}</span>
                            </div>
                            <div>
                                Réduction : <span style={{color: "#012557", fontWeight: "600"}}>{valeurReduction + '%'}</span>
                            </div>
                            <div style={{display: `${parseInt(patientChoisi.type_assurance) === 0 ? 'none' : 'block'}`}}>
                                Assurance: <span style={{color: '#012557', fontWeight: '700'}}>{patientChoisi.type_assurance + '%'}</span>
                            </div>
                            <div>
                                Net à payer : <span style={{color: "#012557", fontWeight: "600"}}>{calculerNetAPayer() + ' Fcfa'}</span>
                            </div>
                            <div>
                                Montant versé : <span style={{color: "#012557", fontWeight: "600"}}>{montantVerse > 0 ? montantVerse + ' Fcfa': 0 + ' Fcfa'}</span>
                            </div>
                            <div>
                                Relicat : <span style={{color: "#012557", fontWeight: "600"}}>{calculerRelicat() + ' Fcfa'}</span>
                            </div>
                            <div>
                                Reste à payer : <span style={{color: "#012557", fontWeight: "600"}}>{calculerResteAPayer() + ' Fcfa'}</span>
                            </div>
                        </div>
                        <button className='bootstrap-btn annuler' onClick={annulerCommande}>Annnuler</button>
                        <button className='bootstrap-btn valider' onClick={demanderConfirmation}>Valider</button>

                    </div>

                    <div>
                        <div style={{display: 'none'}}>
                            <Facture
                                ref={componentRef}
                                assurance={patientChoisi.assurance}
                                type_assurance={patientChoisi.type_assurance}
                                medocCommandes={medocCommandes}
                                idFacture={idFacture}
                                patient={patientChoisi.nom}
                                codePatient={patientChoisi.code}
                                prixTotal={calculerPrixTotal}
                                reduction={valeurReduction}
                                aPayer={calculerNetAPayer}
                                montantVerse={montantVerse}
                                relicat={calculerRelicat}
                                resteaPayer={calculerResteAPayer}
                                nomConnecte={props.nomConnecte}
                                montantFrais={montantMateriel}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
