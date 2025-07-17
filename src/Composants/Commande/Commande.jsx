import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import './Commande.css';
import { ContextChargement } from '../../Context/Chargement';
import { extraireCode, CATEGORIES, nomDns, ServiceExiste, nomServeurNode, getDateTime, CATEGORIES_RUBRIQUES } from '../../shared/Globals';
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
import { io } from 'socket.io-client';
import { CFormInput, CListGroup, CListGroupItem } from '@coreui/react';

// const socket = io.connect(`${nomServeurNode}`);

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
        left: '60vw',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#038654',
        width: '80%',
        height: '95vh'
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
    const {chargement, stopChargement, startChargement } = useContext(ContextChargement);

    const autre  = {designation: '', prix: ''};
    const prescripteurDefault = {id: 0, designation: ''};

    const date_e = new Date('2036-12-19');
    const date_j = new Date();

    const [medocCommandes, setMedocCommandes] = useState([]);
    const [nouveauPatient, setNouveauPatient] = useState(detailsDuPatient);
    const [patientChoisi, setPatientChoisi] = useState(detailsDuPatient);
    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [qteDesire, setQteDesire] = useState(1);
    const [patient, setPatient] = useState('');
    const [autreState, setAutreState] = useState(autre);
    const [medocSelect, setMedoSelect] = useState(false);
    // const [medocCommandes, setMedocCommandes] = useState([]);
    const [montantMateriel, setMontantMateriel] = useState(0);
    const [option, setoption] = useState('');
    const [reduction, setreduction] = useState(false);
    const [valeurReduction, setvaleurReduction] = useState(0);
    const [montantVerse, setMontantVerse] = useState('');
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
    const [msgPatient, setMsgPatient] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [actesMorgue, setActesMorgue] = useState([]);
    const [listePrescripteurs, setListePrescripteurs] = useState([]);
    const [prescripteurRecherche, setPrescripteurRecherche] = useState('');
    const [prescripteurChoisi, setPrescripteurChoisi] = useState(prescripteurDefault);
    const [hasPrescripteur, setHasPrescripteur] = useState(false);

    const vueListePrescripteurs = prescripteurRecherche.length > 0 ? listePrescripteurs.filter(item => item.designation.toLowerCase().includes(prescripteurRecherche.toLowerCase())) : [];

    const {designation, prix} = autreState;

    const { code, nom, age, sexe, quartier, assurance, type_assurance } = nouveauPatient;

    const execGetDateTime = async () => {
        const dateTime = await getDateTime();
        setCurrentDate(dateTime.date);
    }

    useEffect(() => {
        // startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        if (date_j.getTime() <= date_e.getTime()) {
            
        } else {
            // setTimeout(() => {
            //     setListeMedoc([]);
            //     setListeMedocSauvegarde([]);
            //     props.setConnecter(false);
            // }, 5000);
            // setTimeout(() => {
            //     props.setConnecter(false);
            // }, 8000);
        }
    }, []);

    useEffect(() => {
        const d = new Date();

        if (rerender || !rerender) {
            // Etat d'urgence entre 17h et 8h et les weekends

            setRerender(false);
            startChargement();
            // Récupération des médicaments dans la base via une requête Ajax
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recuperer_services.php`);

            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                    // setInterval(() => {
                        // console.log(req.responseText);

                        const result = JSON.parse(req.responseText);
                        // console.log(result);

                        const temp = result
                            .filter(item => item.designation.toLowerCase().includes("mortuaire"))

                        ajouterQteActesMorgue(temp);                            
                        setActesMorgue(temp);

                        // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                        setListeMedoc(result);
                        setListeMedocSauvegarde(result);
                        stopChargement();
                        document.querySelector('.recherche').value = "";
                        document.querySelector('.recherche').focus();
                        fetchPrescripteurs();
                    // }, props.delayLoad);

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

    const handleChangePrescripteur = (e) => {
        setPrescripteurRecherche(e.target.value);
    }

    const fetchPrescripteurs = () => {
        const req = new XMLHttpRequest();

        req.open('GET', `${nomDns}gestion_prescripteurs.php?liste`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setListePrescripteurs(result);
            }
        });

        req.send();
    }

    const choisirPrescripteur = (e) => {
        const prescripteur = listePrescripteurs.filter(item => item.id == e.target.id)[0];
        setPrescripteurChoisi(prescripteur);        
        setPrescripteurRecherche('');
    }

    const creerPrescripteur = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('designation', prescripteurRecherche.toUpperCase().trim());

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}gestion_prescripteurs.php?create`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText.toLowerCase() == 'existe') {
                    setMessageErreur('Ce prescripteur existe déjà');
                } else {
                    // const result = JSON.parse(req.responseText);
                    setMessageErreur('');
                    setRerender(true);
                }
            }
        });

        req.send(data);
    }

    const modifierPrixActeMorgue = (item) => {
        if (item.designation.toLowerCase() == "toilette mortuaire") {
            Object.defineProperty(item, 'prix', {
                value: 20000,
                configurable: true,
                enumerable: true
            });
        } else if (item.designation.toLowerCase() == "traitement mortuaire") {
            Object.defineProperty(item, 'prix', {
                value: 10000,
                configurable: true,
                enumerable: true
            });
        }
    }

    const ajouterQteActesMorgue = (data) => {
        if (data.length > 0) {
            data.forEach(item => {
                modifierPrixActeMorgue(item)
                Object.defineProperty(item, 'qte_commander', {
                    value: 1,
                    configurable: true,
                    enumerable: true
                });

                Object.defineProperty(item, 'prix_total', {
                    value: parseInt(item.prix) * parseInt(item.qte_commander),
                    configurable: true,
                    enumerable: true
                });
            })
        }
    }

    const calculerPrixTotal = () => {
        let prixTotalT = 0;
        if (medocSelect || designation.length > 0 && prix.length > 0) {
            
            prixTotalT = medocCommandes.reduce((som, curr) => som + parseInt(curr.prix_total), 0)
            prixTotalT += montantMateriel;

        }
        return parseInt(prixTotalT);
    }

    const calculerNetAPayer = () => {
        let netAPayer = (calculerPrixTotal() * ((100 - parseInt(patientChoisi.type_assurance)) / 100));

        if (!isNaN(valeurReduction))
            netAPayer = netAPayer - (netAPayer * (parseFloat(valeurReduction) / 100))

        return isNaN(netAPayer) ? 0 : parseInt(netAPayer);
    }

    // const calculerResteAPayer = () => {
    //     let resteAPayer = 0;
    //     if (isNaN(parseInt(montantVerse))) {
    //         resteAPayer = (calculerNetAPayer() - resteAPayer);
    //         return parseInt(resteAPayer);
    //     } else {
    //         resteAPayer = (calculerNetAPayer() - montantVerse);
    //         return resteAPayer < 0 ? 0 : parseInt(resteAPayer);
    //     }
    // }

    // const calculerRelicat = () => {
    //     let relicat = 0;
    //     if (parseInt(montantVerse) > calculerNetAPayer())
    //         relicat = (montantVerse - calculerNetAPayer())

    //     return parseInt(relicat);
    // }

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
        setQteDesire(1);
        document.querySelector('#qteDesire').focus();

    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1));
        setListeMedoc(medocFilter);
    }

    const retirerActe = (id) => {
        const tab = [...medocCommandes];
        const acteM = tab.filter(item => item.designation.toLowerCase().includes('morgue'));

        if (acteM.length > 0) {
            annulerCommande();
            return
        }

        const index = tab.findIndex(item => item.id == id);
        tab.splice(index, 1);
        setMedocCommandes(tab);
    }

    // Enregistrement d'un médicament dans la commande
    const ajouterMedoc = (e) => {
        e.preventDefault();
        // verifier si l'acte doit exigé un prescripteur
        const verif_rubrique = CATEGORIES_RUBRIQUES.filter(item => item == medocSelect[0].categorie || item == medocSelect[0].rubrique);
        if (verif_rubrique.length > 0 && prescripteurChoisi.id == 0) {
            setHasPrescripteur(true);
        }

        // Desactive le bouton d'ajout quelques secondes
        btnAjout.current.disabled = true;
        setTimeout(() => {
            btnAjout.current.disabled = false;
        }, 1000);

        if (qteDesire && !isNaN(qteDesire) && medocSelect) {
            setMessageErreur('');

            Object.defineProperty(medocSelect[0], 'qte_commander', {
                value: qteDesire,
                configurable: true,
                enumerable: true
            });
            
            Object.defineProperty(medocSelect[0], 'prix_total', {
                value: parseInt(medocSelect[0].prix) * parseInt(qteDesire),
                configurable: true,
                enumerable: true
            });
            
            medocSelect[0].reduction = false;
            if (medocSelect[0].designation.toLowerCase().includes('morgue')) {
                setMedocCommandes([...medocCommandes, ...actesMorgue, medocSelect[0]]);
                return
            }
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
        setPrescripteurChoisi(prescripteurDefault);
        setMedoSelect(false);
        setMedocCommandes([]);
        setPatient('');
        setvaleurReduction(0);
        document.querySelector('#montant-reduction').value = "";
        setMessageErreur('');
        setMontantVerse('');
        document.querySelector('.recherche').value = "";
        document.querySelector('.recherche').focus();
        setMontantMateriel(0);
        setreduction(false);
        setPatientChoisi(detailsDuPatient)
        document.querySelector('#valider-facture').disabled = false;
        document.querySelector('#annuler-facture').disabled = false;
        activeBtnValidation();
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        return Math.floor((1 + Math.random()) * 0x1000000000000)
               .toString(32)
               .substring(1).toUpperCase();
    }

    const actualisationHistorique = () => {
        // setTimeout(() => {
        //     socket.emit('actualisation_historique');
        // }, 5000);
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
        data.append('montant_verse', calculerNetAPayer());
        data.append('relicat', 0);
        data.append('reste_a_payer', 0);
        data.append('assurance', patientChoisi.assurance);
        data.append('type_assurance', patientChoisi.type_assurance);
        data.append('statu', statu);
        data.append('id_prescripteur', prescripteurChoisi.id);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}index.php?enregistrer_facture`);

        req.addEventListener('load', () => {
            // console.log(req.responseText);
            
            setMessageErreur('');
            execGetDateTime();
            actualisationHistorique();
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

        setTimeout(() => {       
            req.send(data);
        }, props.delayLoad);
    }

    const validerCommande = () => {

        /* 
            Organisation des données qui seront envoyés au serveur :
                - pour la mise à jour des stocks de médicaments
                - pour la mise à jour de l'historique des commandes
        */
    //    console.log("test");
       const id = idUnique();
       setidFacture(id);
       if(medocCommandes.length > 0) {

            let i = 0;
            document.querySelector('#valider-facture').disabled = true;
            document.querySelector('#annuler-facture').disabled = true;
            // annuler.current.disabled = true;

            medocCommandes.map(item => {

                const data2 = new FormData();

                data2.append('code_patient', patientChoisi.code);
                data2.append('id_facture', id);
                data2.append('designation', item.designation);
                data2.append('pu', item.prix);
                data2.append('qte', item.qte_commander);
                data2.append('prix_total', item.prix_total);
                data2.append('categorie', item.categorie);
                data2.append('caissier', props.nomConnecte);
                data2.append('reduction', valeurReduction);
                data2.append('id_prescripteur', prescripteurChoisi.id);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', `${nomDns}index.php?enreg_historique_service`);

                // Une fois la requête charger on vide tout les états
                req2.addEventListener('load', () => {
                    // console.log(req2.responseText);
                    
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
        // if (hasPrescripteur && prescripteurChoisi.id == 0) {
        //     setMessageErreur('Veuillez choisir un prescripteur pour cette facture'.toUpperCase());
        //     return
        // }
        if (medocCommandes.length > 0) {
            if (patientChoisi.nom.length > 0) {
                validerCommande();
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
                    console.log(req.responseText);
                    
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
                    <CIcon onClick={fermerModalPatient} icon={cilX} size='lg' className=' text-bg-light' role='button' />
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
        // sauvegarder();
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

    const disabledBtnValidation = () => {
        const btnValidation = document.querySelector('#valider-facture');
        btnValidation.disabled = true;
        btnValidation.classList.add('disabled');
    }

    const activeBtnValidation = () => {
        const btnValidation = document.querySelector('#valider-facture');
        btnValidation.disabled = false;
        btnValidation.classList.remove('disabled');
    }

    const handleChangeReduction = (e) => {
        if(e.target.value.length === 0)
            setvaleurReduction(0);
        else {
            if (parseInt(e.target.value) > calculerPrixTotal()) {
                disabledBtnValidation();
                setMessageErreur('le montant de la réduction ne peut pas être supérieur au prix total');
                const valeurDuPourcentage = 100 - ((parseInt(e.target.value) * 100) / calculerPrixTotal())
                setvaleurReduction(parseFloat(valeurDuPourcentage))
            } else {
                activeBtnValidation();
                setMessageErreur('');
                const valeurDuPourcentage = 100 - ((parseInt(e.target.value) * 100) / calculerPrixTotal())
                setvaleurReduction(parseFloat(valeurDuPourcentage))
            }
        }
    }

    // const handleChangeMontantVerse = (e) => {
    //     if(e.target.value.length === 0)
    //         setMontantVerse('');
    //     else
    //         setMontantVerse(parseInt(e.target.value))
    // }

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

        const nouveauCodePatient = creerCodePatient()

        data.append('code', nouveauCodePatient);
        data.append('nouveau_patient', JSON.stringify(nouveauPatient))

        req.open('POST', `${nomDns}index.php`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                if (result.message.toLowerCase() !== 'existe') {
                    setPatientChoisi({...nouveauPatient, code: nouveauCodePatient});
                    fermerEditerPatient();
                    resetInfosDuPatient();
                    setMsgPatient('');
                } else {
                    setMsgPatient('Ce patient existe déjà');
                }
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
                    msgPatient={msgPatient}
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
                <CIcon onClick={fermerModalReussi} icon={cilX} size='xl' className=' text-bg-light' role='button' />
                <h2 style={{color: '#fff'}}>Facture enregistré !</h2>
                <ReactToPrint
                    trigger={() => <button style={{color: '#303031', height: '5vh', width: '11vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                    content={() => componentRef.current}
                    // onAfterPrint={fermerModalReussi}
                />
            </Modal>
            <div className="left-side">
                <div className="search-zone">
                    <input 
                        type="text" 
                        className="recherche" 
                        placeholder="Rechercher un service..." 
                        onChange={filtrerListe} 
                        autoComplete='off' 
                    />
                </div>
                <div>
                    <button 
                        className='nouveau-service-btn' 
                        onClick={autreService}
                    >
                        ✨ Nouveau service
                    </button>
                </div>
                <div className="liste-medoc">
                    <h1>📋 Liste des actes</h1>
                    <ul>
                        {chargement ? (
                            <div className="loader">
                                <Loader type="TailSpin" color="#3b82f6" height={60} width={60}/>
                            </div>
                        ) : (
                            listeMedoc.map(item => (
                                <li 
                                    value={item.id} 
                                    key={item.id} 
                                    onClick={afficherInfos}
                                >
                                    {extraireCode(item.designation).toUpperCase()}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
            <div className="right-side">
                <h1>
                    {medocSelect ? "📄 Détails du service" : "👆 Sélectionnez un service"}
                </h1>
                <div className="infos-medoc">
                    {medocSelect && medocSelect.map(item => (
                        <div className="service" key={item.id}>
                            <div>
                                <p>Désignation</p>
                                <p>{extraireCode(item.designation).toUpperCase()}</p>
                            </div>
                            <div>
                                <p>Prix unitaire</p>
                                <p>{item.prix} FCFA</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="box">
                    <form onSubmit={ajouterMedoc}>
                        <input 
                            id='qteDesire' 
                            type="text" 
                            name="qteDesire" 
                            value={qteDesire} 
                            onChange={(e) => {setQteDesire(e.target.value)}} 
                            placeholder="Quantité"
                            autoComplete='off' 
                        />
                        <button 
                            type='submit' 
                            className='bootstrap-btn valider' 
                            ref={btnAjout}
                        >
                            ➕ Ajouter
                        </button>
                    </form>
                    <div style={{textAlign: 'center'}}>
                        <button 
                            className='btn-patient' 
                            onClick={infosPatient}
                        >
                            👤 Informations patient
                        </button>
                    </div>
                    <div>
                        <div>
                            <input 
                                id='montant-reduction' 
                                type="text" 
                                name="reduction" 
                                onChange={handleChangeReduction} 
                                placeholder="Montant de réduction"
                                autoComplete='off' 
                                style={{display: reduction ? 'block' : 'none'}} 
                            />
                            <button 
                                className='bootstrap-btn' 
                                style={{ 
                                    display: reduction ? 'none' : 'inline-block', 
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                    color: 'white'
                                }}  
                                onClick={appliquerReduction}
                            >
                                💰 Réduction
                            </button>
                        </div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <div className='d-flex justify-content-center align-items-center flex-column gap-3'>
                            <CFormInput
                                style={{width: '100%', maxWidth: '300px'}}
                                type="text"
                                id="prescripteur"
                                placeholder="🔍 Rechercher un prescripteur"
                                aria-describedby="prescripteur"
                                value={prescripteurRecherche}
                                onChange={handleChangePrescripteur}
                                autoComplete='off'
                            />
                            {vueListePrescripteurs.length > 0 && (
                                <CListGroup style={{width: '100%', maxWidth: '300px'}}>
                                    {vueListePrescripteurs.map(item => (
                                        <CListGroupItem 
                                            id={`${item.id}`} 
                                            key={item.id} 
                                            onClick={choisirPrescripteur}
                                            style={{cursor: 'pointer'}}
                                        >
                                            {item.designation}
                                        </CListGroupItem>
                                    ))}
                                </CListGroup>
                            )}
                        </div>
                        {prescripteurChoisi.id !== 0 && (
                            <div style={{marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)'}}>
                                <strong>👨‍⚕️ Prescripteur:</strong> {prescripteurChoisi.designation}
                            </div>
                        )}
                        {patientChoisi.nom.length > 0 && (
                            <div style={{marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)'}}>
                                {/* <Thinking>
                                    L'utilisateur me demande de continuer exactement où je me suis arrêté. Je vois que j'étais en train de mettre à jour le JSX du composant Commande.jsx et je me suis arrêté au milieu de la section qui affiche les informations du patient. Je dois continuer à partir de là sans répéter le code précédent.
                                </Thinking> */}
                                <strong>👤 Patient:</strong> {patientChoisi.nom.toUpperCase()}
                                <br />
                                <strong>🆔 Code:</strong> {patientChoisi.code.toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
                {messageErreur && (
                    <div className='erreur-message'>
                        ⚠️ {messageErreur}
                    </div>
                )}
                <div className="details-commande">
                    <h1>🧾 Facture en cours</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>P.U</td>
                                <td>Qtés</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocCommandes.map(item => (
                                <tr key={item.id} onClick={() => retirerActe(item.id)}>
                                    <td>{extraireCode(item.designation).toUpperCase()}</td>
                                    <td>{item.prix}</td>
                                    <td>{item.qte_commander}</td>
                                    <td>{item.prix_total} FCFA</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="valider-annuler">
                        <div className="totaux">
                            <div>
                                💰 <strong>Prix total:</strong>
                                <br />
                                <span>{calculerPrixTotal()} FCFA</span>
                            </div>
                            <div>
                                🏷️ <strong>Réduction:</strong>
                                <br />
                                <span>{valeurReduction}%</span>
                            </div>
                            {parseInt(patientChoisi.type_assurance) !== 0 && (
                                <div>
                                    🏥 <strong>Assurance:</strong>
                                    <br />
                                    <span>{patientChoisi.type_assurance}%</span>
                                </div>
                            )}
                            <div>
                                💳 <strong>Net à payer:</strong>
                                <br />
                                <span>{calculerNetAPayer()} FCFA</span>
                            </div>
                        </div>
                        <button 
                            className='bootstrap-btn annuler' 
                            id='annuler-facture'
                            onClick={annulerCommande}
                        >
                            ❌ Annuler
                        </button>
                        <button 
                            className='bootstrap-btn valider' 
                            id='valider-facture' 
                            onClick={demanderConfirmation}
                        >
                            ✅ Valider
                        </button>
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
                                montantVerse={calculerNetAPayer}
                                relicat={0}
                                resteaPayer={0}
                                nomConnecte={props.nomConnecte}
                                montantFrais={montantMateriel}
                                dateJour={currentDate}
                                prescripteur={prescripteurChoisi.designation}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}