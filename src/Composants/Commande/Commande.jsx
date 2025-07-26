import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
import './Commande.css';
import { ContextChargement } from '../../Context/Chargement';
import { extraireCode, CATEGORIES, nomDns, ServiceExiste, nomServeurNode, getDateTime, CATEGORIES_RUBRIQUES, formaterNombre } from '../../shared/Globals';
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
import { cilList, cilPlus, cilUser, cilMoney, cilCheckCircle, cilXCircle, cilSave, cilFolderOpen, cilHospital, cilTag, cilCreditCard, cilFile, cilPen } from '@coreui/icons';

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

const customStylesModalEditerPatient = {
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

const customStylesModalPatient = {
    content: {
        top: '48%',
        left: '53vw',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
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

    // ... existing code ... (all state variables and functions remain the same)
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
    const [montantMateriel, setMontantMateriel] = useState(0);
    const [option, setoption] = useState('');
    const [reduction, setreduction] = useState(false);
    const [valeurReduction, setvaleurReduction] = useState(0);
    const [montantVerse, setMontantVerse] = useState('');
    const [idFacture, setidFacture] = useState('');
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
    // Nouveaux états pour les calculs
    const [prixTotal, setPrixTotal] = useState(0);
    const [netAPayer, setNetAPayer] = useState(0);

    const vueListePrescripteurs = prescripteurRecherche.length > 0 ? listePrescripteurs.filter(item => item.designation.toLowerCase().includes(prescripteurRecherche.toLowerCase())) : [];

    const {designation, prix} = autreState;
    const { code, nom, age, sexe, quartier, assurance, type_assurance } = nouveauPatient;

    // ... existing code ... (all functions remain exactly the same)
    const execGetDateTime = async () => {
        const dateTime = await getDateTime();
        setCurrentDate(dateTime.date);
    }

    useEffect(() => {
        if (date_j.getTime() <= date_e.getTime()) {
            // ... existing code ...
        } else {
            // ... existing code ...
        }
    }, []);

    useEffect(() => {
        const d = new Date();

        if (rerender || !rerender) {
            setRerender(false);
            startChargement();
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recuperer_services.php`);

            req.addEventListener("load", () => {
                if (req.status >= 200 && req.status < 400) {
                    const result = JSON.parse(req.responseText);
                    const temp = result
                        .filter(item => item.designation.toLowerCase().includes("mortuaire"))

                    ajouterQteActesMorgue(temp);                            
                    setActesMorgue(temp);

                    setListeMedoc(result);
                    setListeMedocSauvegarde(result);
                    stopChargement();
                    document.querySelector('.recherche').value = "";
                    document.querySelector('.recherche').focus();
                    fetchPrescripteurs();
                } else {
                    console.error(req.status + " " + req.statusText);
                }
            });
            req.addEventListener("error", function () {
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

    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
        setQteDesire(1);
        document.querySelector('#qteDesire').focus();
    }

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

    const ajouterMedoc = (e) => {
        e.preventDefault();
        const verif_rubrique = CATEGORIES_RUBRIQUES.filter(item => item == medocSelect[0].categorie || item == medocSelect[0].rubrique);
        if (verif_rubrique.length > 0 && prescripteurChoisi.id == 0) {
            setHasPrescripteur(true);
        }
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
        return Math.floor((1 + Math.random()) * 0x1000000000000)
               .toString(32)
               .substring(1).toUpperCase();
    }

    const actualisationHistorique = () => {
        // ... existing code ...
    }

    const enregisterFacture = (id) => {
        const data = new FormData();
        montantMateriel === 500 ? data.append('frais_materiel', 500) : data.append('frais_materiel', 0);
        data.append('id', id);
        data.append('caissier', props.nomConnecte);
        data.append('nom_patient', patientChoisi.nom);
        data.append('code_patient', patientChoisi.code);
        data.append('prix_total', prixTotal); // Utilise l'état
        data.append('net_a_payer', netAPayer); // Utilise l'état
        data.append('montant_verse', netAPayer); // Utilise l'état
        data.append('reduction', valeurReduction);
        data.append('relicat', 0);
        data.append('reste_a_payer', 0);
        data.append('assurance', patientChoisi.assurance);
        data.append('type_assurance', patientChoisi.type_assurance);
        data.append('statu', statu);
        data.append('id_prescripteur', prescripteurChoisi.id);
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}index.php?enregistrer_facture`);
        req.addEventListener('load', () => {
            setMessageErreur('');
            execGetDateTime();
            actualisationHistorique();
            setModalReussi(true);
            fermerModalConfirmation();
        });
        req.addEventListener("error", function () {
            setMessageErreur('Erreur réseau');
        });
        setTimeout(() => {       
            req.send(data);
        }, props.delayLoad);
    }

    const validerCommande = () => {
       const id = idUnique();
       setidFacture(id);
       if(medocCommandes.length > 0) {
            let i = 0;
            document.querySelector('#valider-facture').disabled = true;
            document.querySelector('#annuler-facture').disabled = true;
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
                const req2 = new XMLHttpRequest();
                req2.open('POST', `${nomDns}index.php?enreg_historique_service`);
                req2.addEventListener('load', () => {
                    if (req2.status >= 200 && req2.status < 400) {
                        setMessageErreur('');
                        i++;
                        if (medocCommandes.length === i) {
                            enregisterFacture(id);
                        }
                    }
                });
                req2.addEventListener("error", function () {
                    setMessageErreur('Erreur réseau');
                });
                req2.send(data2);
            })
        } else {
            setModalReussi(true);
            fermerModalConfirmation();
        }
    }

    const appliquerReduction = (e) => {
        setreduction(true);
    }

    const demanderConfirmation = () => {
        if (medocCommandes.length === 0) {
            setMessageErreur('Veuillez ajouter au moins un service avant de valider la facture');
            return;
        }
        if (patientChoisi.code.length === 0) {
            setMessageErreur('Veuillez sélectionner un patient avant de valider la facture');
            return;
        }
        // if (prescripteurChoisi.id === 0 && hasPrescripteur) {
        //     setMessageErreur('Veuillez sélectionner un prescripteur avant de valider la facture');
        //     return;
        // }
        validerCommande();
    }

    const infosPatient = () => {
        ouvrirModalPatient();
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}index.php?tous_les_patient`);
        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setlistePatient(result);
        });
        req.addEventListener("error", function () {
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
                    <CIcon onClick={fermerModalPatient} icon={cilX} size='lg' className='text-bg-light' role='button' />
                    <h2 style={{color: '#fff', textAlign: 'center'}}>informations du patient</h2>
                    <div className="modal-patient-container">
                            <ModalPatient
                                patient={patient}
                                filtrerPatient={filtrerPatient}
                                stylePatient={stylePatient}
                                listePatient={listePatient}
                                selectionnePatient={selectionnePatient}
                                ouvrirEditerPatient={ouvrirEditerPatient}
                            />

                            <AfficherPatient 
                                patientChoisi={patientChoisi} 
                                fermerModalPatient={fermerModalPatient}
                            />
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

    const handleChangePatient = (e) => {
        setNouveauPatient({...nouveauPatient, [e.target.name]: e.target.value});
    }

    const creerCodePatient = () => {
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

    useEffect(() => {
    // Calcul du prix total
    const total = medocCommandes.reduce((sum, curr) => sum + parseInt(curr.prix_total || 0), 0) + parseInt(montantMateriel || 0);
    setPrixTotal(total);

    // Calcul du net à payer
    let net = total * ((100 - parseInt(patientChoisi.type_assurance || 0)) / 100);
    if (!isNaN(valeurReduction) && valeurReduction > 0) {
        net = net - (net * parseFloat(valeurReduction) / 100);
    }
    setNetAPayer(isNaN(net) ? 0 : parseInt(net));
    }, [medocCommandes, montantMateriel, valeurReduction, patientChoisi.type_assurance]);

    const BROUILLON_KEY = 'facture_brouillon';

    const chargerBrouillon = () => {
        const brouillon = localStorage.getItem(BROUILLON_KEY);
        if (brouillon) {
            try {
                const data = JSON.parse(brouillon);
                setMedocCommandes(data.medocCommandes || []);
                setPatientChoisi(data.patientChoisi || detailsDuPatient);
                setPrescripteurChoisi(data.prescripteurChoisi || prescripteurDefault);
                setvaleurReduction(data.valeurReduction || 0);
                setMontantMateriel(data.montantMateriel || 0);
                setidFacture(data.idFacture || '');
                setCurrentDate(data.currentDate || '');
                // setMessageErreur('Brouillon chargé !');
                      // Force le recalcul immédiat
                const total = data.medocCommandes.reduce((sum, curr) => sum + parseInt(curr.prix_total || 0), 0) + parseInt(data.montantMateriel || 0);
                setPrixTotal(total);
                
                let net = total * ((100 - parseInt(data.patientChoisi?.type_assurance || 0)) / 100);
                if (!isNaN(data.valeurReduction) && data.valeurReduction > 0) {
                    net = net - (net * parseFloat(data.valeurReduction) / 100);
                }
                setNetAPayer(isNaN(net) ? 0 : parseInt(net));
            } catch (e) {
                setMessageErreur('Brouillon corrompu');
                localStorage.removeItem(BROUILLON_KEY);
            }
        } else {
            setMessageErreur('Aucun brouillon trouvé');
        }
    };

    const enregistrerBrouillon = () => {
        const brouillon = {
            medocCommandes,
            patientChoisi,
            prescripteurChoisi,
            valeurReduction,
            montantMateriel,
            idFacture,
            currentDate
        };
        localStorage.setItem(BROUILLON_KEY, JSON.stringify(brouillon));
        annulerCommande();
        setMessageErreur('Facture enregistrée en brouillon !');
    };

    return (
        <section className="commande">
            {/* ... existing modals ... */}
            <Modal
                isOpen={modalEditerPatient}
                style={customStylesModalEditerPatient}
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
                style={customStylesModalPatient}
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
                />
            </Modal>
            {/* Refactored layout starts here */}
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
                        <CIcon icon={cilPlus} size="lg" style={{marginRight: 8}} />
                        Nouveau service
                    </button>
                </div>
                
                <div className="liste-medoc">
                    <h1>
                        <CIcon icon={cilList} size="lg" style={{marginRight: 8}} />
                        Liste des actes
                    </h1>
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
                <div className="compact-header">
                    <div className="service-details">
                        <h1>
                            {medocSelect ? (
                                <>
                                    <CIcon icon={cilFile} size="lg" style={{marginRight: 8}} />
                                    Détails du service
                                </>
                            ) : (
                                <>
                                    <CIcon icon={cilPen} size="lg" style={{marginRight: 8}} />
                                    Sélectionnez un service
                                </>
                            )}
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
                                        <p>{formaterNombre(item.prix)} FCFA</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="controls-container">
                        <form onSubmit={ajouterMedoc} className="quantity-form">
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
                        
                        <div className="patient-controls">
                            <button 
                                className='btn-patient' 
                                onClick={infosPatient}
                            >
                                <CIcon icon={cilUser} size="lg" style={{marginRight: 8}} />
                                Informations patient
                            </button>
                            
                            <div className="reduction-control">
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
                                    <CIcon icon={cilTag} size="lg" style={{marginRight: 8}} />
                                    Réduction
                                </button>
                            </div>
                        </div>
                        
                        <div className="prescripteur-container">
                            <CFormInput
                                type="text"
                                id="prescripteur"
                                placeholder="🔍 Rechercher un prescripteur"
                                aria-describedby="prescripteur"
                                value={prescripteurRecherche}
                                onChange={handleChangePrescripteur}
                                autoComplete='off'
                            />
                            {vueListePrescripteurs.length > 0 && (
                                <CListGroup>
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
                    </div>
                    
                    
                </div>
                
                {messageErreur && (
                    <div className='erreur-message'>
                        ⚠️ {messageErreur}
                    </div>
                )}
                
                <div className="details-commande">
                    <h1>🧾 Facture en cours</h1>
                    <div className="info-badges">
                        {prescripteurChoisi.id !== 0 && (
                            <div className="info-badge prescripteur">
                                <strong>
                                    <CIcon icon={cilUser} size="lg" style={{marginRight: 8}} />
                                    Prescripteur:
                                </strong> {prescripteurChoisi.designation}
                            </div>
                        )}
                        {patientChoisi.nom.length > 0 && (
                            <div className="info-badge patient">
                                <strong>
                                    <CIcon icon={cilUser} size="lg" style={{marginRight: 8}} />
                                    Patient:
                                </strong> {patientChoisi.nom.toUpperCase()}
                                <br />
                                <strong>
                                    <CIcon icon={cilTag} size="lg" style={{marginRight: 8}} />
                                    Code:
                                </strong> {patientChoisi.code.toUpperCase()}
                            </div>
                        )}
                    </div>
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
                                    <td>{formaterNombre(item.prix)}</td>
                                    <td>{item.qte_commander}</td>
                                    <td>{formaterNombre(item.prix_total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="valider-annuler">
                        <div className="totaux">
                            <div>
                                <CIcon icon={cilMoney} size="lg" style={{marginRight: 8}} />
                                <strong>Prix total:</strong>
                                <br />
                                <span>
                                    {formaterNombre(prixTotal)} FCFA
                                </span>
                            </div>
                            <div>
                                <CIcon icon={cilTag} size="lg" style={{marginRight: 8}} />
                                <strong>Réduction:</strong>
                                <br />
                                <span>{valeurReduction}%</span>
                            </div>
                            {parseInt(patientChoisi.type_assurance) !== 0 && (
                                <div>
                                    <CIcon icon={cilHospital} size="lg" style={{marginRight: 8}} />
                                    <strong>Assurance:</strong>
                                    <br />
                                    <span>{patientChoisi.type_assurance}%</span>
                                </div>
                            )}
                            <div>
                                <CIcon icon={cilCreditCard} size="lg" style={{marginRight: 8}} />
                                <strong>Net à payer:</strong>
                                <br />
                                <span>
                                    {formaterNombre(netAPayer)} FCFA
                                </span>
                            </div>
                        </div>
                        <div className='action-buttons'>
                            <button 
                                className='bootstrap-btn valider' 
                                id='valider-facture' 
                                onClick={demanderConfirmation}
                            >
                                <CIcon icon={cilCheckCircle} size="lg" style={{marginRight: 8}} />
                                Valider
                            </button>
                            <button 
                                className='bootstrap-btn annuler' 
                                id='annuler-facture'
                                onClick={annulerCommande}
                            >
                                <CIcon icon={cilXCircle} size="lg" style={{marginRight: 8}} />
                                Annuler
                            </button>
                            <button
                                className='bootstrap-btn'
                                onClick={enregistrerBrouillon}
                                type="button"
                                style={{background: 'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)'}}
                            >
                                <CIcon icon={cilSave} size="lg" style={{marginRight: 8}} />
                                Enregistrer en brouillon
                            </button>
                            <button
                                className='bootstrap-btn'
                                type="button"
                                style={{background: 'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)'}}
                                onClick={chargerBrouillon}
                            >
                                <CIcon icon={cilFolderOpen} size="lg" style={{marginRight: 8}} />
                                Charger le brouillon
                            </button>
                        </div>
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
                                prixTotal={prixTotal}
                                reduction={valeurReduction}
                                aPayer={netAPayer}
                                montantVerse={netAPayer}
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