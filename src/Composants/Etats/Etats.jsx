import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import './Etats.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import ImprimerEtat from './ImprimerEtat';
import { CFormSwitch, CFormSelect } from '@coreui/react';

import { genres, nomDns, recupererDateJour, recupererHeureJour } from '../../shared/Globals';

export default function Etats(props) {

    const componentRef = useRef();
    const admin = "admin";
    const date_e = new Date('2026-04-15');
    const date_j = new Date();

    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [historiqueSauvegarde, setHistoriqueSauvegarde] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [recetteReel, setRecetteReel] = useState(false);
    const [total, setTotal] = useState(false);
    const [recetteGenerique, setRecetteGenerique] = useState(0);
    const [recetteSp, setRecetteSp] = useState(0);
    const [messageErreur, setMessageErreur] = useState('');
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [search, setSearch] = useState(false);
    const [caissier, setCaissier] = useState('');
    const [filtre, setFiltre] = useState(false);
    const [non_paye, setNonPaye] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        // recupererDateJour('date-d-etats');
        recupererDateJour('date-f-etats');
        recupererHeureJour('heure-f-etats')
        recupererHeureDernierService();
        if (date_j.getTime() <= date_e.getTime()) {

        } else {
            // setTimeout(() => {
            //     props.setConnecter(false);
            //     props.setOnglet(1);
            // }, 6000);
        }
    }, []);

    // useEffect(() => {
    //     !total && sethistorique([])
    // }, [total]);

    useEffect(() => {
        startChargement();
        
        if (dateDepart.length > 0 && dateFin.length > 0) {

            let dateD = dateDepart;
            let dateF = dateFin;

            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);

            const req = new XMLHttpRequest();
            // if (props.role !== admin) {
            //     req.open('POST', `${nomDns}etats.php?vendeur=${props.nomConnecte}`);
            // } else {
                if (filtre) {
                    req.open('POST', `${nomDns}etats.php?vendeur=${caissier}`);
                } else {
                    req.open('POST', `${nomDns}etats.php`);
                }
            // }
            
            req.addEventListener('load', () => {
                setMessageErreur('');
                const result = JSON.parse(req.responseText);

                setHistoriqueSauvegarde(result);
                
                stopChargement();
                let recette = 0;
                if (result.length > 0) {
                    recupererRecetteReel(dateD, dateF);
                    // if (props.role !== admin) {
                    //     setFiltre(true);
                    //     setCaissier(props.nomConnecte);
                    //     setReload(!reload)
                    // } else {
                        let tab = result.filter(item => (item.status_vente === "payé"));
                        sethistorique(tab);
                        recette = tab.reduce((acc, curr) => acc + parseInt(curr.prix_total), 0);

                        calculerRecetteParGenre(tab);
                        setTotal(recette);
                    // }

                } else {
                    setTotal(0);
                    sethistorique([])
                }
            });

            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });

            req.send(data);
        }

    }, [dateDepart, dateFin, search, filtre, caissier]);

    const recupererRecetteReel = (dateD, dateF) => {
        // console.log("passage");
        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);

        // if (props.role !== admin) {
        //     data.append('vendeur', props.nomConnecte);
        // } else {
            data.append('vendeur', caissier);
        // }
        const req = new XMLHttpRequest();

        req.open('POST', `${nomDns}index.php?recette_reel_pharmacie`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            // console.log(req.responseText);
            setRecetteReel(result[0].recette_reel);
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);
    }

    useEffect(() => {
        if (filtre) {
            let recette = 0;
            let tab = historiqueSauvegarde.filter(item => (item.nom_vendeur.toUpperCase() === caissier.toUpperCase()));

            if (tab.length === 0) {
                sethistorique([]);
                setTotal(0);
            } else {
                if (non_paye) {
                    tab = tab.filter(item => (item.status_vente.toLowerCase() === "non payé"));
                    tab.forEach(item => {
                        recette += parseInt(item.prix_total);
                    });
                } else {
                    tab = tab.filter(item => (item.status_vente.toLowerCase() === "payé"));

                    tab.forEach(item => {
                        recette += parseInt(item.prix_total);
                    });
                    calculerRecetteParGenre(tab)

                }
                setTotal(recette);
                sethistorique(tab);
            }
        } else {
            sethistorique(historiqueSauvegarde.filter(item => (item.status_vente.toLowerCase() === "payé")));
            let recette = 0;
            let tab1 = historiqueSauvegarde.filter(item => (item.status_vente.toLowerCase() === "payé"));
            tab1.forEach(item => {
                recette += parseInt(item.prix_total);
            });

            setTotal(recette);
        }
    }, [caissier, filtre, non_paye, reload]);

    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_comptes.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "vendeur" || item.rol === "major"))
                setListeComptes(result);
                setCaissier(result[0].nom_user.toUpperCase())
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, []);

    const calculerRecetteParGenre = (tab) => {

        let recetteG = tab.reduce((acc, curr) => {
            if (genres[`${curr.genre}`] === genres.generique) {
                return acc + parseInt(curr.prix_total)
            } else {
                return acc;
            }
        }, 0)

        let recetteS = tab.reduce((acc, curr) => {
            if (genres[`${curr.genre}`] === genres.sp) {
                return acc + parseInt(curr.prix_total)
            } else {
                return acc;
            }
        }, 0)

        setRecetteGenerique(recetteG);
        setRecetteSp(recetteS);
    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        setSearch(!search);
    }

    const enregistrerHeureFin = () => {
        let dateDuJour = new Date();
        
        let dateDuJourFormate = dateDuJour.getFullYear() + '-' + ('0' + (dateDuJour.getMonth() + 1)).slice(-2) + '-' + ('0' + dateDuJour.getDate()).slice(-2);
        if (dateDuJourFormate === dateFin.slice(0, 10)) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}horaire_pharmacie.php?heure_fin=${dateFin}`);
    
            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
    
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
        req.open('GET', `${nomDns}horaire_pharmacie.php?recup_heure`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.response);
                document.querySelector('#date-d-etats').value = result.date_heure.slice(0, 10);
                document.querySelector('#heure-d-etats').value = result.date_heure.slice(11, 16);
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
            <h1>Historique des sorties de produits</h1>
            <div className="listing-container">
                <div className="entete-historique">
                    <div className="form-controls">
                        <div className="form-group">
                            <p>
                                <label>Du :</label>
                                <div className="date-time-group">
                                    <input id='date-d-etats' type="date" ref={date_select1} />
                                    <input id='heure-d-etats' type="time" ref={heure_select1} />
                                </div>
                            </p>
                            <p>
                                <label>Au :</label>
                                <div className="date-time-group">
                                    <input id='date-f-etats' type="date" ref={date_select2} />
                                    <input id='heure-f-etats' type="time" ref={heure_select2} />
                                </div>
                            </p>
                        </div>
                        <div className="form-group">
                            <p>
                                <CFormSwitch
                                    label="Filtrer par vendeur"
                                    id="formSwitchCheckDefault"
                                    checked={filtre}
                                    reverse={true}
                                    onChange={(e) => setFiltre(!filtre)}
                                />
                            </p>
                            {filtre && (
                                <p>
                                    <label htmlFor="caissier">Vendeur</label>
                                    <CFormSelect
                                        className='w-10'
                                        name="caissier"
                                        id="caissier"
                                        onChange={(e) => setCaissier(e.target.value)}
                                        value={caissier}
                                    >
                                        {listeComptes.map(item => (
                                            <option key={item.nom_user} value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                        ))}
                                    </CFormSelect>
                                </p>
                            )}
                            <p style={{display: 'none'}}>
                                <label htmlFor="non_paye">non payés : </label>
                                <input type="checkbox" id="non_paye" checked={non_paye} onChange={(e) => setNonPaye(!non_paye)} />
                            </p>
                        </div>
                        <div className="totaux-info">
                            <div>
                                <span>Génériques : </span>
                                <span>{total ? recetteGenerique + ' Fcfa' : '0 Fcfa'}</span>
                            </div>
                            <div>
                                <span>Spécialités : </span>
                                <span>{total ? recetteSp + ' Fcfa' : '0 Fcfa'}</span>
                            </div>
                            <div>
                                <span>Total : </span>
                                <span>{total ? total + ' Fcfa' : '0 Fcfa'}</span>
                            </div>
                        </div>
                    </div>
                    <button className='bootstrap-btn valider' onClick={rechercherHistorique}>Rechercher</button>
                </div>
                <div className='erreur-message'>{messageErreur}</div>
                <div className="table-commandes">
                    <table role="table" aria-label="Historique des sorties de produits">
                        <thead>
                            <tr>
                                <td></td>
                                <td>Désignation</td>
                                <td>Qte sortie</td>
                                <td>Montant</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 ? historique.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.designation}</td>
                                    <td>{item.quantite}</td>
                                    <td>{item.prix_total + ' Fcfa'}</td>
                                </tr>
                            )) : (
                                <tr className="empty-row">
                                    <td colSpan={3} className='fw-bold'>Aucune donnée correspondante</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="print-section">
                    <ReactToPrint
                        trigger={() => <button className='print-button' aria-label="Imprimer l'historique">📄 Imprimer</button>}
                        content={() => componentRef.current}
                        onAfterPrint={enregistrerHeureFin}
                    />
                </div>
            </div>
            <div style={{display: 'none'}}>
                <ImprimerEtat
                    ref={componentRef}
                    dateDepart={dateDepart}
                    dateFin={dateFin}
                    caissier={caissier}
                    historique={historique}
                    total={total}
                    recetteReel={recetteReel}
                    recetteGenerique={recetteGenerique}
                    recetteSp={recetteSp}
                    filtre={filtre}
                />
            </div>
        </section>
    )
}
