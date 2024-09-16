import React, { useEffect, useState, useContext, useRef } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import RecetteG from '../ImprimerRecette/RecetteG';
import { extraireCode, mois, nomDns, nomServeurNode, recupererDateJour, recupererHeureJour } from '../../shared/Globals';
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

    const date_e = new Date('2025-05-26');
    const date_j = new Date();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([])
    const [dateJour, setdateJour] = useState('');
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

        if (date_j.getTime() <= date_e.getTime()) {
            
        } else {
            // setTimeout(() => {
            //     props.setConnecter(false);
            //     props.setOnglet(1);
            // }, 6000);
        }
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
                sethistorique(result);
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

    return (
        <section className="historique">
            <h1>Historique des services médicaux</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
                            <p>
                                <label htmlFor="">Du : </label>
                                <input id='date-d-hist' type="date" ref={date_select1} />
                                <input type="time" ref={heure_select1} />
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input id='date-f-hist' type="date" ref={date_select2} />
                                <input id='heure-f-listing' type="time" ref={heure_select2} />
                            </p>
                        <button className='bootstrap-btn valider' onClick={rechercherHistorique}>rechercher</button>
                        <div>Total : <span style={{fontWeight: '700'}}>{recetteTotal ? total + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div>Recette : <span style={{fontWeight: '700'}}>{recetteTotal ? recetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                        {/* <div>Dette : <span style={{fontWeight: '700'}}>{dette ? dette + ' Fcfa' : '0 Fcfa'}</span></div> */}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>qte</td>
                                <td>Pu</td>
                                <td>Pt</td>
                                <td>Caissier</td>
                                <td>Date</td>
                                <td>Heure</td>
                                {/* <td>Patient</td> */}
                                <td>Réduc</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {extraireCode(item.designation)}
                                        {parseInt(item.statu_acte) ? <CBadge color='danger'>annulé</CBadge> : null}  
                                    </td>
                                    <td>{item.qte}</td>
                                    <td>{item.prix}</td>
                                    <td>{item.prix_total}</td>
                                    <td>{item.caissier}</td>
                                    <td>{mois(item.date_fait)}</td>
                                    <td>{item.heure_fait}</td>
                                    {/* <td>{item.patient}</td> */}
                                    <td style={{fontWeight: '700'}}>{parseInt(item.reduction) > 0 ? '-' + item.reduction + ' %': 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* <div style={{textAlign: 'center'}}>
                    <ReactToPrint
                        trigger={() => <button className='bootstrap-btn' style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                        content={() => componentRef.current}
                    />
                </div> */}
            </div>
            <div style={{display: 'none'}}>
                <RecetteG
                    ref={componentRef}
                    dateDepart={dateDepart}
                    dateFin={dateFin}
                    recetteTotal={recetteTotal}
                />
            </div>
        </section>
    )
}
