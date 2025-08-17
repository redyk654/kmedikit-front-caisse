import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
// import '..Apercu/Apercu.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import { convertDate, extraireCode, getDateTime, nomDns, recupererDateJour, recupererHeureJour, formaterNombre, mois2 } from '../../shared/Globals';
import { CBadge, CFormSwitch } from '@coreui/react';
import ImprimerListingFactures from './ImprimerListingFactures';
import './ListingFactures.css';
import Modal from 'react-modal';


export default function ListingFactures(props) {

    const date_e = new Date('2025-09-05');
    const date_j = new Date();

    const componentRef = useRef();

    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, setHistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [total, setTotal] = useState(0);
    const [recetteTotal, setRecetteTotal] = useState(0);
    const [dette, setDette] = useState(0);
    const [dateDepart, setDateDepart] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [caissier, setCaissier] = useState('');
    const [assurance, setAssurance] = useState('non');
    const [messageErreur, setMessageErreur] = useState('');
    const [filtre, setFiltre] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Pour la modale détails facture
    const [modalFacture, setModalFacture] = useState(false);
    const [detailsFacture, setDetailsFacture] = useState([]);
    const [factureSelectionne, setFactureSelectionne] = useState(null);

    const execGetDateTime = async () => {
        const dateTime = await getDateTime();
        setCurrentDate(dateTime.date);
    }

    useEffect(() => {
        if (date_j.getTime() > date_e.getTime()) {
            setTimeout(() => {
                props.setOnglet(false);
            }, 5000);
        }
        if (dateDepart.length > 0 && dateFin.length > 0) {
            setIsLoading(true);
            let dateD = dateDepart;
            let dateF = dateFin;
            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);
            data.append('caissier', caissier.toLowerCase());
            data.append('assurance', assurance);
            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}listing_factures.php`);
            req.addEventListener('load', () => {
                execGetDateTime();
                setMessageErreur('');
                let result = JSON.parse(req.responseText);
                if (filtre) {
                    result = result.filter(item => (item.caissier.toLowerCase() === caissier.toLowerCase()));
                }
                setHistorique(result);
                // Calcul total et recette
                let t = 0;
                let recette = 0, resteAPayer = 0;
                result.forEach(item => {
                    t += parseInt(item.prix_total);
                    if (assurance === "non") {
                        if (item.assurance.toUpperCase() === "AUCUNE") {
                            recette += parseInt(item.a_payer);
                            resteAPayer += parseInt(item.reste_a_payer);
                        }
                    } else {
                        if (item.assurance.toUpperCase() !== "AUCUNE") {
                            recette += parseInt(item.a_payer);
                            resteAPayer += parseInt(item.reste_a_payer);
                        }
                    }
                });
                recette -= resteAPayer;
                setTotal(t);
                setRecetteTotal(recette);
                setDette(resteAPayer);
                setIsLoading(false);
                stopChargement();
            });
            req.addEventListener("error", function () {
                setMessageErreur('Erreur réseau');
                setIsLoading(false);
            });
            req.send(data);
        }
    }, [dateDepart, dateFin, caissier, filtre, assurance]);

    useEffect(() => {
        // Récupération des comptes

        recupererHeureDernierService();
        recupererDateJour('date-f-listing');
        recupererHeureJour('heure-f-listing');

        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_caissier.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "caissier"))
                setListeComptes(result);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, []);

    // La logique de calcul de recette/total est maintenant dans le useEffect principal


    const rechercherHistorique = () => {
        setDateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setDateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        if (filtre) {
            setCaissier(document.getElementById('caissier').value.toLowerCase());
        } else {
            setCaissier('tout');
        }
    };

    // Affichage des détails d'une facture (modale)
    const afficherFactureDetails = (facture) => {
        setFactureSelectionne(facture);
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}gestion_factures.php?id=${facture.id}`);
        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setDetailsFacture(result);
            setModalFacture(true);
        });
        req.send();
    };

    const enregistrerHeureFin = () => {
        let dateDuJour = new Date();
        
        let dateDuJourFormate = dateDuJour.getFullYear() + '-' + ('0' + (dateDuJour.getMonth() + 1)).slice(-2) + '-' + ('0' + dateDuJour.getDate()).slice(-2);
        if (dateDuJourFormate === dateFin.slice(0, 10)) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}horaire_caisse.php?heure_fin=${dateFin}`);
    
            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    console.log(req.responseText);
                }
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send();
        }
    }

    const recupererHeureDernierService = () => {
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}horaire_caisse.php?recup_heure`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.response);
                document.querySelector('#date-d-listing').value = result.date_heure.slice(0, 10);
                document.querySelector('#heure-d-listing').value = result.date_heure.slice(11, 16);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }

    return (
        <section className="listing-section">
            <h1>Listing des caissiers</h1>
            <div className="listing-container">
                <div className="entete-historique">
                    {messageErreur && (
                        <div className='erreur-message'>{messageErreur}</div>
                    )}

                    <div className="form-controls">
                        <div className="form-group">
                            <p>
                                <label>Période de recherche</label>
                                <div className="date-time-group">
                                    <input 
                                        id='date-d-listing' 
                                        type="date" 
                                        ref={date_select1}
                                        aria-label="Date de début"
                                    />
                                    <input 
                                        id='heure-d-listing' 
                                        type="time" 
                                        ref={heure_select1}
                                        aria-label="Heure de début"
                                    />
                                </div>
                            </p>
                            <p>
                                <label>Au</label>
                                <div className="date-time-group">
                                    <input 
                                        id='date-f-listing' 
                                        type="date" 
                                        ref={date_select2}
                                        aria-label="Date de fin"
                                    />
                                    <input 
                                        id='heure-f-listing' 
                                        type="time" 
                                        ref={heure_select2}
                                        aria-label="Heure de fin"
                                    />
                                </div>
                            </p>
                        </div>

                        {props.role === "admin" && (
                            <div className="form-group">
                                <p>
                                    <CFormSwitch
                                        label="Filtrer par caissier"
                                        id="formSwitchCheckDefault"
                                        checked={filtre}
                                        reverse={true}
                                        onChange={(e) => setFiltre(!filtre)}
                                    />
                                </p>
                                {filtre && (
                                    <p>
                                        <label htmlFor="caissier">Caissier</label>
                                        <select name="caissier" id="caissier" aria-label="Sélectionner un caissier">
                                            {listeComptes.map((item, index) => (
                                                <option key={index} value={item.nom_user.toLowerCase()}>
                                                    {item.nom_user.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                )}
                            </div>
                        )}

                        {props.role === "caissier" && filtre && (
                            <div className="form-group">
                                <p>
                                    <label htmlFor="caissier">Caissier</label>
                                    <select name="caissier" id="caissier" aria-label="Caissier sélectionné">
                                        <option value={props.nomConnecte.toLowerCase()}>
                                            {props.nomConnecte.toUpperCase()}
                                        </option>
                                    </select>
                                </p>
                            </div>
                        )}

                        <div className="totaux-info">
                            <div>
                                <span>Total : </span>
                                <span>{total ? (formaterNombre(total) + ' Fcfa') : '0 Fcfa'}</span>
                            </div>
                            <div>
                                <span>Recette : </span>
                                <span>{recetteTotal ? (formaterNombre(recetteTotal) + ' Fcfa') : '0 Fcfa'}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className='bootstrap-btn valider' 
                        onClick={rechercherHistorique}
                        disabled={isLoading}
                        aria-label="Rechercher l'historique"
                    >
                        {isLoading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </div>

                <div className="table-commandes">
                    <table role="table" aria-label="Liste des factures">
                        <thead>
                            <tr>
                                <td></td>
                                <td>Nbre facture</td>
                                <td>N° facture</td>
                                <td>Patient</td>
                                <td>Caissier</td>
                                <td>Montant</td>
                                <td>Heure</td>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading ? (
                                historique.length > 0 ? (
                                    historique.map((item, index) => (
                                        <tr key={item.id_fac} role="row" onClick={() => afficherFactureDetails(item)} style={{cursor: 'pointer'}}>
                                            <td>{index + 1}</td>
                                            <td>{item.id}</td>
                                            <td>{item.patient}</td>
                                            <td>{item.caissier}</td>
                                            <td>{formaterNombre(item.a_payer) + ' Fcfa'}</td>
                                            <td>
                                                {convertDate(item.date_heure?.substring(0, 10)) + ' ' + 
                                                 item.date_heure?.substring(11, 16)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="empty-row">
                                        <td colSpan={7} className='fw-bold'>Aucune donnée correspondante</td>
                                    </tr>
                                )
                            ) : (
                                <tr className="loading-row">
                                    <td colSpan={7} className='fw-bold'>Chargement en cours...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {historique.length > 0 && (
                    <div className="print-section">
                        <ReactToPrint
                            trigger={() => (
                                <button 
                                    className='print-button'
                                    aria-label="Imprimer le listing"
                                >
                                    📄 Imprimer
                                </button>
                            )}
                            content={() => componentRef.current}
                            onAfterPrint={enregistrerHeureFin}
                        />
                    </div>
                )}
            </div>

            <div style={{display: 'none'}}>
                <ImprimerListingFactures
                    ref={componentRef}
                    historique={historique}
                    recetteTotal={recetteTotal}
                    listing={assurance}
                    total={total}
                    nomConnecte={caissier}
                    dateDepart={dateDepart}
                    dateFin={dateFin}
                    dateDuJour={currentDate}
                    filtre={filtre}
                />
            </div>

            {/* MODALE DETAILS FACTURE */}
            <Modal
                isOpen={modalFacture}
                onRequestClose={() => setModalFacture(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#f8fafc',
                        borderRadius: '1rem',
                        minWidth: '420px',
                        maxWidth: '700px',
                        boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
                        padding: '2rem'
                    }
                }}
                contentLabel="Détails facture"
            >
                <h2 style={{color: '#1e293b', marginBottom: '1rem'}}>Facture N° {factureSelectionne?.id}</h2>
                <div>
                    <div>
                        {factureSelectionne && factureSelectionne.date_heure ? (
                            <div>
                                Le <strong>{mois2(factureSelectionne.date_heure.substring(0, 10))}</strong> à <strong>{factureSelectionne.date_heure.substring(11)}</strong>
                            </div>
                        ) : (
                            <div>
                                <span style={{color: '#64748b'}}>Date inconnue</span>
                            </div>
                        )}
                    </div>
                    <div style={{marginTop: 5}}>Patient : <span style={{fontWeight: '600'}}>{factureSelectionne?.patient}</span></div>
                    <div style={{marginTop: 5}}>Code patient : <span style={{fontWeight: '600'}}>{factureSelectionne?.code_patient}</span></div>
                    {factureSelectionne?.assurance?.toUpperCase() !== "AUCUNE" && (
                        <div>Couvert par : <strong>{factureSelectionne?.assurance?.toUpperCase()}</strong></div>
                    )}
                    <div style={{margin: '15px 0'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '15px', background: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 6px rgba(59,130,246,0.04)'}}>
                            <thead style={{background: '#e2e8f0'}}>
                                <tr>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Désignation</th>
                                    <th style={{padding: '8px'}}>Pu</th>
                                    <th style={{padding: '8px'}}>Qtés</th>
                                    <th style={{padding: '8px'}}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailsFacture.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{padding: '8px', textAlign: 'left'}}>
                                            {extraireCode(item.designation)}
                                            {parseInt(item.statu_acte) ? <span style={{color: '#ef4444', fontWeight: 700, marginLeft: 8}}>annulé</span> : null}
                                        </td>
                                        <td style={{padding: '8px', textAlign: 'right'}}>{item.prix}</td>
                                        <td style={{padding: '8px', textAlign: 'right'}}>{item.qte}</td>
                                        <td style={{padding: '8px', textAlign: 'right'}}>{item.prix_total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{marginTop: 10}}>Net à payer : <span style={{fontWeight: 700, color: '#038654'}}>{(factureSelectionne?.a_payer)} Fcfa</span></div>
                    <div>Réduction : <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne?.reduction} %</span></div>
                    <div>Reste à payer : <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne?.reste_a_payer} Fcfa</span></div>
                    <div>Caissier : <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne?.caissier?.toUpperCase()}</span></div>
                </div>
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <button className="bootstrap-btn annuler" onClick={() => setModalFacture(false)}>Fermer</button>
                </div>
            </Modal>
        </section>
    );
}