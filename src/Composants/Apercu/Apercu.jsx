import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import '../Listing/ListingFactures.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import ImprimerHistorique from '../ImprimerHistorique/ImprimerHistorique';
import { extraireCode, formaterNombre, getDateTime, nomDns, recupererDateJour, recupererHeureJour, sauvegarderBd } from '../../shared/Globals';
import { CFormSwitch } from '@coreui/react';

export default function Apercu(props) {

    const date_e = new Date('2026-09-05');
    const date_j = new Date();

    const componentRef = useRef();
    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [total, setTotal] = useState('');
    const [recetteTotal, setRecetteTotal] = useState(false);
    const [dette, setDette] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [caissier, setCaissier] = useState('');
    const [assurance, setAssurance] = useState('non');
    const [messageErreur, setMessageErreur] = useState('');
    const [filtre, setFiltre] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const execGetDateTime = async () => {
        const dateTime = await getDateTime();
        setCurrentDate(dateTime.date);
    }

    useEffect(() => {
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

            req.open('POST', `${nomDns}apercu.php`);

            req.addEventListener('load', () => {
                execGetDateTime();
                setMessageErreur('');
                recupererRecetteTotal(data);
                const result = JSON.parse(req.responseText);
                sethistorique(result);

                let t = 0;
                result.forEach(item => {
                    t += parseInt(item.prix_total);
                })

                setTotal(t);
                stopChargement();
            });

            req.addEventListener("error", function () {
                setMessageErreur('Erreur réseau');
                setIsLoading(false);
            });

            req.send(data);
        }
    }, [dateDepart, dateFin, caissier, assurance]);

    useEffect(() => {
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
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, []);

    const recupererRecetteTotal = (data) => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}recuperer_recette.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result = JSON.parse(req.responseText);

                if (props.role.toLowerCase() === "caissier") {
                    result = result.filter(item => (item.caissier.toLowerCase() == props.nomConnecte.toLowerCase()));
                } else {
                    if (filtre) {
                        result = result.filter(item => (item.caissier.toLowerCase() == caissier.toLowerCase()));
                    }
                }

                let recette = 0, resteAPayer = 0;
                if (assurance === "non") {
                    result.forEach(item => {
                        if (item.assurance.toUpperCase() === "aucune".toUpperCase()) {
                            recette += parseInt(item.a_payer);
                            resteAPayer += parseInt(item.reste_a_payer)
                        }
                    });
                } else {
                    result.forEach(item => {
                        if (item.assurance.toUpperCase() !== "aucune".toUpperCase()) {
                            recette += parseInt(item.a_payer);
                            resteAPayer += parseInt(item.reste_a_payer)
                        }
                    });
                }
                recette -= resteAPayer
                setRecetteTotal(recette);
                setDette(resteAPayer);
                setIsLoading(false);
            }
        });

        req.addEventListener("error", function () {
            setMessageErreur('Erreur réseau');
            setIsLoading(false);
        });

        req.send(data);
    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        if (filtre) {
            setCaissier(document.getElementById('caissier').value.toLowerCase());
        } else {
            setCaissier('tout');
        }
    }

    const enregistrerHeureFin = () => {
        let dateDuJour = new Date();

        let dateDuJourFormate = dateDuJour.getFullYear() + '-' + ('0' + (dateDuJour.getMonth() + 1)).slice(-2) + '-' + ('0' + dateDuJour.getDate()).slice(-2);
        if (dateDuJourFormate === dateFin.slice(0, 10)) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}horaire_caisse.php?heure_fin=${dateFin}`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    sauvegarderBd();
                }
            });

            req.addEventListener("error", function () {
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
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }

    return (
        <section className="listing-section">
            <h1>Aperçu des services</h1>
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

                        {props.role === "caissier" && (
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
                    <table role="table" aria-label="Aperçu des services">
                        <thead>
                            <tr>
                                <td></td>
                                <td>Désignation</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading ? (
                                historique.length > 0 ? (
                                    historique.map((item, index) => (
                                        <tr key={index} role="row">
                                            <td>{extraireCode(item.designation) + ' (' + item.qte + ')'}</td>
                                            <td>{item.prix_total + ' Fcfa'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="empty-row">
                                        <td colSpan={2} className='fw-bold'>
                                            Aucune donnée correspondante
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr className="loading-row">
                                    <td colSpan={2} className='fw-bold'>
                                        Chargement en cours...
                                    </td>
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
                                    aria-label="Imprimer l'aperçu"
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
                <ImprimerHistorique
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
        </section>
    )
}
