import React, { useEffect, useState, useContext, useRef } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { extraireCode, formaterNombre, mois, nomDns, nomServeurNode, recupererDateJour, recupererHeureJour } from '../../shared/Globals';
import { CBadge } from '@coreui/react';
import { io } from 'socket.io-client';

const socket = io.connect(`${nomServeurNode}`);


export default function Historique(props) {

    let date_select = useRef();
    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();
    const componentRef = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, setHistorique] = useState([])
    const [historiqueSauvegarde, setHistoriqueSauvegarde] = useState([])
    const [recetteTotal, setRecetteTotal] = useState(false);
    const [total, setTotal] = useState(0)
    const [dette, setDette] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [search, setSearch] = useState(false);

    useEffect(() => {
        
        recupererDateJour('date-d-hist');
        recupererDateJour('date-f-hist');
        recupererHeureJour('heure-f-listing');
    }, []);

    useEffect(() => {
        socket.on('actualiser_historique', () => {
            recupererHeureJour('heure-f-listing');
            setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
            setSearch(!search);
            execRechercherHistorique();
        });
  
      }, [socket])

    useEffect(() => {
        execRechercherHistorique();
    }, [dateDepart, dateFin, search]);

    const execRechercherHistorique = () => {
        if (dateDepart.length > 0 && dateFin.length > 0) {
            startChargement();
            let dateD = dateDepart;
            let dateF = dateFin;

            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recuperer_services_fait.php?dateD=${dateD}&dateF=${dateF}`);

            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setHistorique(result);
                setHistoriqueSauvegarde(result);
                calculerTotal(result);
                stopChargement();

                const req2 = new XMLHttpRequest();
                req2.open('GET', `${nomDns}recuperer_services_fait.php?dateD=${dateD}&dateF=${dateF}&recette=oui`);
                req2.onload = () => {
                    const result = JSON.parse(req2.responseText)[0];
                    let recette = 0;
                    recette = parseInt(result.recette) - parseInt(result.dette);
                    setRecetteTotal(recette);
                    setDette(parseInt(result.dette));
                }
                req2.send();

            });

            req.send();
        }
    }

    const calculerTotal = (result) => {
        const total = result.reduce((acc, curr) => acc + parseInt(curr.prix_total), 0);
        setTotal(total);
    }

    const rechercherHistorique = () => {
        setSearch(!search);
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
    }

    const filtrerListe = (e) => {
        // filter la liste des factures selon le nom du patient ou l'identifiant de la facture
        const val = e.target.value.toUpperCase().trim();
        if (val.length > 0) {
            setHistorique(historiqueSauvegarde.filter(item => (
                item.designation.toUpperCase().includes(val)
            )));
        } else {
            setHistorique(historiqueSauvegarde);
        }
    }

    return (
        <section className="listing-section">
            <h1>Journal des activités de la caisse</h1>
            <div className="listing-container">
                <div className="entete-historique">
                    <div className="form-controls">
                        <div className="form-group">
                            <p>
                                <label>Du :</label>
                                <div className="date-time-group">
                                    <input id='date-d-hist' type="date" ref={date_select1} />
                                    <input type="time" ref={heure_select1} />
                                </div>
                            </p>
                            <p>
                                <label>Au :</label>
                                <div className="date-time-group">
                                    <input id='date-f-hist' type="date" ref={date_select2} />
                                    <input id='heure-f-listing' type="time" ref={heure_select2} />
                                </div>
                            </p>
                        </div>
                        <div className="totaux-info">
                            <div>
                                <span>Total : </span>
                                <span>{recetteTotal ? formaterNombre(total) + ' Fcfa' : '0 Fcfa'}</span>
                            </div>
                            <div>
                                <span>Recette : </span>
                                <span>{recetteTotal ? formaterNombre(recetteTotal) + ' Fcfa' : '0 Fcfa'}</span>
                            </div>
                        </div>
                    </div>
                    <button className='bootstrap-btn valider' onClick={rechercherHistorique}>Rechercher</button>
                </div>
                <div className="search-zone text-center" style={{margin: '1rem 0'}}>
                    <input className='' type="text" placeholder="Rechercher un acte..." onChange={filtrerListe} />
                </div>
                <div className="table-commandes">
                    <table role="table" aria-label="Journal des activités de la caisse">
                        <thead>
                            <tr>
                                <td></td>
                                <td className='px-3'>Désignation</td>
                                <td>qte</td>
                                <td>Pu</td>
                                <td>Pt</td>
                                <td>Caissier</td>
                                <td>Date</td>
                                <td>Heure</td>
                                <td>Réduc</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 ? historique.map(item => (
                                <tr key={item.id}>
                                    <td className='px-3'>
                                        {extraireCode(item.designation)}
                                        {parseInt(item.statu_acte) ? <CBadge color='danger'>annulé</CBadge> : null}
                                    </td>
                                    <td>{item.qte}</td>
                                    <td>{item.prix}</td>
                                    <td>{item.prix_total}</td>
                                    <td>{item.caissier}</td>
                                    <td>{mois(item.date_fait)}</td>
                                    <td>{item.heure_fait}</td>
                                    <td style={{fontWeight: '700'}}>{parseInt(item.reduction) > 0 ? '-' + item.reduction + ' %': 0}</td>
                                </tr>
                            )) : (
                                <tr className="empty-row">
                                    <td colSpan={8} className='fw-bold'>Aucune donnée correspondante</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
