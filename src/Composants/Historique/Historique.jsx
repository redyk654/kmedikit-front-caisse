import React, { useEffect, useState, useContext, useRef } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import RecetteG from '../ImprimerRecette/RecetteG';
import { extraireCode, mois, nomDns } from '../../shared/Globals';
import { CBadge } from '@coreui/react';

export default function Historique(props) {

    let date_select = useRef();
    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();
    const componentRef = useRef();

    const date_e = new Date('2023-12-19');
    const date_j = new Date();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([])
    const [dateJour, setdateJour] = useState('');
    const [recetteTotal, setRecetteTotal] = useState(false);
    const [dette, setDette] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [search, setSearch] = useState(false);

    useEffect(() => {
        // Récupération des médicaments dans la base via une requête Ajax
        if (date_j.getTime() <= date_e.getTime()) {
            
        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 6000);
        }
    }, []);

    useEffect(() => {

        if (dateDepart.length > 0 && dateFin.length > 0) {
            startChargement();
            let dateD = dateDepart;
            let dateF = dateFin;

            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}recuperer_services_fait.php?dateD=${dateD}&dateF=${dateF}`);

            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                sethistorique(result);
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

    }, [dateDepart, dateFin, search]);

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
                                <input type="date" ref={date_select1} />
                                <input type="time" ref={heure_select1} />
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input type="date" ref={date_select2} />
                                <input type="time" ref={heure_select2} />
                            </p>
                        <button className='bootstrap-btn valider' onClick={rechercherHistorique}>rechercher</button>
                        <div>Recette total : <span style={{fontWeight: '700'}}>{recetteTotal ? recetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                        <div>Dette : <span style={{fontWeight: '700'}}>{dette ? dette + ' Fcfa' : '0 Fcfa'}</span></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>Prix</td>
                                <td>Caissier</td>
                                <td>Le</td>
                                <td>À</td>
                                {/* <td>Patient</td> */}
                                <td>Reduction</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {extraireCode(item.designation)}
                                        {parseInt(item.statu_acte) ? <CBadge color='danger'>annulé</CBadge> : null}  
                                    </td>
                                    <td>{item.prix}</td>
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
                <div style={{textAlign: 'center'}}>
                    <ReactToPrint
                        trigger={() => <button className='bootstrap-btn' style={{color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                        content={() => componentRef.current}
                    />
                </div>
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
