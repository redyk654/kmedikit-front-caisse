import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import './Commande.css';
import { ContextChargement } from '../../Context/Chargement';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactToPrint from 'react-to-print';
import Facture from '../Facture/Facture';
import { extraireCode } from '../../shared/Globals';
import AfficherPatient from '../Patients/AfficherPatient';
import EditerPatient from '../Patients/EditerPatient';
import ModalPatient from '../Patients/ModalPatient';
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
    const [patient, setpatient] = useState('');
    const [nomPatient, setNomPatient] = useState(false);
    const [autreState, setAutreState] = useState(autre);
    const [medocSelect, setMedoSelect] = useState(false);
    const [medocCommandes, setMedocCommandes] = useState([]);
    const [frais, setFrais] = useState(false);
    const [montantFrais, setMontantFrais] = useState(0);
    const [qtePrixTotal, setQtePrixTotal] = useState({});
    const [option, setoption] = useState('');
    const [reduction, setreduction] = useState(false);
    const [remise, setremise] = useState(false);
    const [valeurReduction, setvaleurReduction] = useState('');
    const [verse, setverse] = useState('');
    const [montantVerse, setmontantVerse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [idFacture, setidFacture] = useState('');
    // const [urgence, setUrgence] = useState(false);
    const[actualiserQte, setActualiserQte] = useState(false);
    const [listePatient, setlistePatient] = useState([]);
    const [listePatientSauvegarde, setlistePatientSauvegarde] = useState([]);
    const [modalEditerPatient, setModalEditerPatient] = useState(false);
    // const [assurance, setAssurance] = useState(assuranceDefaut);
    // const [type_assurance, setTypeAssurance] = useState(0);
    const [statu, setStatu] = useState('done');
    const [messageErreur, setMessageErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalPatient, setModalPatient] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [statePourRerender, setStatePourRerender] = useState(true);
    const [state, setState] = useState(0);
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

    useEffect(() => {
        /* Hook exécuter lors de la mise à jour de la liste de médicaments commandés,
           L'exécution du hook va permettre d'actualier les prix et les quantités
        */

        /*
         ***IMPORTANT*** : Il y a un bug non résolu qui fais que lors de la suppression d'un médicament de la liste des commandes,
         les prix et quantités ne sont pas mis à jour correctement
         */
        if (medocSelect || designation.length > 0 && prix.length > 0) {
            let prixTotal = 0;
            medocCommandes.map(item => {
                prixTotal += parseInt(item.prix);
            });

            if (frais) {
                prixTotal += 500;
                setMontantFrais(500);
            }
            
            // prixTotal += medocSelect[0].prix_total;
            
            Object.defineProperty(qtePrixTotal, 'prix_total', {
                value: prixTotal,
                configurable: true,
                enumerable: true,
            });

            Object.defineProperty(qtePrixTotal, 'a_payer', {
                value: prixTotal * ((100 - parseInt(type_assurance)) / 100),
                configurable: true,
                enumerable: true,
            });

            setStatePourRerender(!statePourRerender); // état modifié pour rerendre le composant
        }

    }, [medocCommandes, frais]);

    useEffect(() => {
        // Pour mettre à jour le relicat et le reste à payer
        if (montantVerse >= parseInt(qtePrixTotal.a_payer)) {
            setrelicat(montantVerse - parseInt(qtePrixTotal.a_payer));
            setresteaPayer(0);
        } else {
            if (montantVerse < parseInt(qtePrixTotal.a_payer)) {
                setresteaPayer(parseInt(qtePrixTotal.a_payer) - montantVerse);
                setrelicat(0);
            }
        }

    }, [montantVerse, medocCommandes, frais, reduction, patientChoisi, nomPatient]);

    useEffect(() => {
        if(assurance.toLowerCase() !== assuranceDefaut) {
            if(parseInt(qtePrixTotal.a_payer)) {
                Object.defineProperty(qtePrixTotal, 'a_payer', {
                    value: (parseInt(qtePrixTotal.prix_total) * (100 - parseInt(type_assurance))) / 100,
                    configurable: true,
                    enumerable: true,
                });
    
            }
        }
        setStatePourRerender(!statePourRerender);
    }, [assurance]);

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
        /* 
            - Mise à jour de la quantité du médicament commandé dans la liste des commandes
            - Mise à jour du prix total du médicament commandé

            - Mise à jour du nombre total de médicaments commandés
            - Mise à jour de la quantité total des médicaments commandés
            - Mise à jour du prix total de la commande
        */

        btnAjout.current.disabled = true;
        setTimeout(() => {
            btnAjout.current.disabled = false;
        }, 1000);
        // Desactive le bouton d'ajout quelques secondes

        if (qteDesire && !isNaN(qteDesire) && medocSelect) {

            setMessageErreur('');
            
            medocSelect[0].reduction = false;

            // const existe = medocCommandes.filter(item => (medocSelect[0].id == item.id));

            // if (existe.length > 0) {
            //     setMessageErreur('Cet acte est déjà dans la facture');
            // } else {
                setMessageErreur('');
                setMedocCommandes([...medocCommandes, medocSelect[0]]);
                // setMedoSelect(false);
            // }

            document.querySelector('.recherche').value = "";
            document.querySelector('.recherche').focus();

        }
        setQteDesire(1);
        setvaleurReduction('');
        setremise(false);
    }

    const fraisMateriel = () => {
        // +500 des frais de matériel
        setFrais(true);
    }

    const annulerCommande = () => {
        setState(0);
        setMedocCommandes([]);
        setQtePrixTotal({});
        setpatient('');
        setmontantVerse('')
        setrelicat(0);
        setremise(0);
        setMessageErreur('');
        setresteaPayer(0);
        setverse('');
        setFrais(false);
        document.querySelector('.recherche').value = "";
        document.querySelector('.recherche').focus();
        setMontantFrais(0);
        setreduction(false);
        setPatientChoisi(detailsDuPatient)
    }

    const sauvegarder = () => {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cmab/backup.php');

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
        return Math.floor((1 + Math.random()) * 0x1000000000)
               .toString(32)
               .substring(1) + qtePrixTotal.prix_total;        
    }

    const enregisterFacture = (id) => {

        // Enregistrement de la facture


        const data = new FormData();

        montantFrais === 500 ? data.append('frais', 500) : data.append('frais', 0);

        data.append('id', id);
        data.append('caissier', props.nomConnecte);
        nomPatient && data.append('patient', nomPatient);
        data.append('prix_total', qtePrixTotal.prix_total);
        data.append('remise', remise);
        data.append('a_payer', qtePrixTotal.a_payer);
        data.append('montant_verse', montantVerse);
        data.append('relicat', relicat);
        data.append('reste_a_payer', resteaPayer);
        data.append('assurance', assurance);
        data.append('type_assurance', type_assurance);
        data.append('statu', statu);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cmab/gestion_factures.php');

        req.addEventListener('load', () => {
            setMedoSelect(false);
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

    const enregisterPatient = () => {
        // On enregistre le patient dans la base de donnés s'il n'y est pas encore
        if (nomPatient) {

            // const patient = listePatientSauvegarde.filter(item => (item.nom.toLowerCase().indexOf(nomPatient.toLowerCase()) !== -1));
            // if(patient.length === 0) {
            //     const data = new FormData();
            //     data.append('nom_patient', nomPatient);
            //     data.append('assurance', assuranceDefaut);
            //     data.append('type_assurance', 0);        
                
            //     const req = new XMLHttpRequest();
            //     req.open('POST', 'http://serveur/backend-cmab/gestion_patients.php');
    
            //     req.send(data);
            // }
        }
    }

    const enregistrerAssurance = (data) => {
        data.append('quantite', qteDesire);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://serveur/backend-cmab/data_assurance.php');

        req.addEventListener("load", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('');
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
       if(medocCommandes.length > 0 && state === 0) {

            let i = 0;
            document.querySelector('.valide').disabled = true;
            annuler.current.disabled = true;

            medocCommandes.map(item => {

                const data2 = new FormData();

                nomPatient && data2.append('patient', nomPatient);
                data2.append('assurance', assurance);
                data2.append('id_facture', id);
                data2.append('designation', item.designation);
                data2.append('prix_total', item.prix);
                data2.append('categorie', item.categorie);
                data2.append('caissier', props.nomConnecte);
                data2.append('reduction', remise);
                assurance !== assuranceDefaut && enregistrerAssurance(data2);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', 'http://serveur/backend-cmab/maj_historique_service.php');
                
                // Une fois la requête charger on vide tout les états
                req2.addEventListener('load', () => {
                    if (req2.status >= 200 && req2.status < 400) {
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

        if (e.target.textContent === "reduction") {
            setreduction(true);
        } else if (e.target.textContent === "appliquer") {
            
            if (!isNaN(valeurReduction) && valeurReduction > 0) {
                // On applique la reduction en mettant à jour le prix total

                Object.defineProperty(qtePrixTotal, 'a_payer', {
                    value: qtePrixTotal.prix_total - (qtePrixTotal.prix_total * (parseInt(valeurReduction) / 100)),
                    configurable: true,
                    enumerable: true,
                });

                setremise(valeurReduction);

                setvaleurReduction('');
                setreduction(false);
            }
        }
    }

    const handleClick = (e) => {
        if (medocCommandes.length > 0 && verse !== "") {
            setmontantVerse(verse);
            setverse('');
            setMessageErreur('');
        }
    }

    const ajouterPatient = () => {
        if(patient !== "") {
            setNomPatient(patient.trim());
            setpatient('');

            if(assurance.toLowerCase() !== assuranceDefaut) {
                if(parseInt(qtePrixTotal.a_payer)) {
                    Object.defineProperty(qtePrixTotal, 'a_payer', {
                        value: (parseInt(qtePrixTotal.prix_total) * (100 - parseInt(type_assurance))) / 100,
                        configurable: true,
                        enumerable: true,
                    });
                }
                setStatu('pending');
            } else {
                setStatu('done');
            }

            setStatePourRerender(!statePourRerender);
            fermerModalPatient();
            setMessageErreur('');
        }
    }

    const demanderConfirmation = () => {
        if (medocCommandes.length > 0) {
            if (nomPatient) {
                if (resteaPayer > 0) {
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
        req.open('GET', 'http://serveur/backend-cmab/index.php?tous_les_patient');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setlistePatient(result);
            setlistePatientSauvegarde(result);
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
                            <input type="text" style={{height: '4vh'}} value={designation} onChange={handleChange} name='designation' autoComplete='off' />
                        </p>
                        <p style={styleBox}>
                            <label htmlFor="">Prix</label>
                            <input type="text" style={{height: '4vh'}} value={prix} onChange={handleChange} name='prix' autoComplete='off' />
                        </p>
                        <p style={styleBox}>
                            <label htmlFor="categorie">Catégorie</label>
                            <select name="categorie" id="categorie">
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
        setpatient(e.target.value);

        const req = new XMLHttpRequest();

        req.open('GET', `http://serveur/backend-cmab/index.php?rechercher_patient=${(e.target.value).trim()}`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);

                setlistePatient(result);
                setlistePatientSauvegarde(result);
            }
            
        });

        req.send();
    }

    const resetInfosDuPatient = () => {
        setNouveauPatient(detailsDuPatient);
    }

    const ouvrirModalPatient = () => {
        setpatient('');
        setoption('patient');
        setModalPatient(true);
    }
    
    const fermerModalPatient = () => {
        setModalPatient(false);
        setpatient('');
        setAutreState(autre);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        sauvegarder();
        setNomPatient('');
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

        req.open('POST', 'http://serveur/backend-cmab/index.php');

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
                <h2 style={{color: '#fff'}}>Service effectué !</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermerModalReussi}>ok</button>
                <ReactToPrint
                    trigger={() => <button style={{color: '#303031', height: '5vh', width: '7vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                    content={() => componentRef.current}
                    onAfterPrint={fermerModalReussi}
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
                <button
                    style={{position: 'absolute', 
                    right: '0%', top: '0%', 
                    backgroundColor: '#03ca7e',
                    border: 'none',
                    opacity: '.9',
                    width: '50px',
                    height: '20px',
                    }}
                    onClick={() => {setState(s => s+1);}}
                >
                </button>
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
                        <button className='bootstrap-btn' style={{backgroundColor: '#6d6f94', marginLeft: '0px', width: '7%'}} onClick={fraisMateriel}>+500</button>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button className='btn-patient' style={{ width: '30%'}} onClick={infosPatient}>Infos du patient</button>
                    </div>
                    <div>
                        <div>
                            <input type="text" name="reduction" value={valeurReduction} onChange={(e) => {setvaleurReduction(e.target.value)}} autoComplete='off' style={{display: reduction ? 'inline-block' : 'none'}} />
                            <button className='bootstrap-btn' onClick={appliquerReduction} style={{backgroundColor: '#6d6f94'}}>{reduction ? 'appliquer' : 'reduction'}</button>
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
                        <input type="text" name='verse' value={verse} onChange={(e) => !isNaN(e.target.value) && setverse(e.target.value)} autoComplete='off' />
                        <button className='bootstrap-btn' onClick={handleClick} style={{width: '5%'}}>ok</button>
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
                                Prix total : <span style={{color: "#0e771a", fontWeight: "600"}}>{medocCommandes.length > 0 ? qtePrixTotal.prix_total + ' Fcfa': 0 + ' Fcfa'}</span>
                            </div>
                            <div>
                                Réduction : <span style={{color: "#0e771a", fontWeight: "600"}}>{remise ? remise + '%' : 0 + '%'}</span>
                            </div>
                            <div>
                                Net à payer : <span style={{color: "#0e771a", fontWeight: "600"}}>{qtePrixTotal.a_payer ? qtePrixTotal.a_payer + ' Fcfa': 0 + ' Fcfa'}</span>
                            </div>
                            <div>
                                Montant versé : <span style={{color: "#0e771a", fontWeight: "600"}}>{montantVerse > 0 ? montantVerse + ' Fcfa': 0 + ' Fcfa'}</span>
                            </div>
                            <div>
                                Relicat : <span style={{color: "#0e771a", fontWeight: "600"}}>{relicat > 0 ? relicat + ' Fcfa': 0 + ' Fcfa'}</span>
                            </div>
                            <div>
                                Reste à payer : <span style={{color: "#0e771a", fontWeight: "600"}}>{resteaPayer > 0 ? resteaPayer + ' Fcfa': 0 + ' Fcfa'}</span>
                            </div>
                        </div>
                        <button className='bootstrap-btn annuler' onClick={annulerCommande}>Annnuler</button>
                        <button className='bootstrap-btn valider' onClick={demanderConfirmation}>Valider</button>

                    </div>

                    <div>
                        <div style={{display: 'none'}}>
                            <Facture
                                ref={componentRef}
                                assurance={assurance}
                                medocCommandes={medocCommandes}
                                idFacture={idFacture}
                                patient={nomPatient}
                                prixTotal={qtePrixTotal.prix_total}
                                reduction={remise}
                                aPayer={qtePrixTotal.a_payer}
                                montantVerse={montantVerse}
                                relicat={relicat}
                                resteaPayer={resteaPayer}
                                nomConnecte={props.nomConnecte}
                                montantFrais={montantFrais}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
