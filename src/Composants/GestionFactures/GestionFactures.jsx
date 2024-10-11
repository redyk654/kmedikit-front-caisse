import React, { useEffect, useState, useRef } from 'react';
import './GestionFactures.css';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';
import FactureEnreg from '../Facture/FactureEnreg';
import { mois, extraireCode, nomDns, ROLES } from "../../shared/Globals";
import { CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilReload, cilXCircle } from '@coreui/icons';

// const socket = io.connect('http://serveur:3010');

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

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    width: '50%',
    marginTop: '15px',
    fontSize: '15px'
}


export default function GestionFactures(props) {

    const componentRef = useRef();

    const [factures, setFactures] = useState([]);
    const [factureSauvegarde, setfactureSauvegarde] = useState([]);
    const [factureSelectionne, setfactureSelectionne] = useState([]);
    const [detailsFacture, setdetailsFacture] = useState([]);
    const [effet, seteffet] = useState(false);
    const [effet2, seteffet2] = useState(false);
    const [supp, setSupp] =  useState(true);
    const [modalReussi, setModalReussi] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [visible, setVisible] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        // Récupération des factures
        setIsLoadingData(true);
        setFactures([])
        setfactureSauvegarde([]);
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}gestion_factures.php`);

        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                const result = JSON.parse(req.responseText);
                setFactures(result);
                setfactureSauvegarde(result);
                setIsLoadingData(false);
            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            console.error("Erreur réseau");
        });

        req.send();
    }, [effet])

    useEffect(() => {
        if (factureSelectionne.length > 0) {
            // Récupération des détails de la facture selectionnée
            const req = new XMLHttpRequest();
    
            req.open('GET', `${nomDns}gestion_factures.php?id=${factureSelectionne[0].id}`);
    
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
                // console.log(detailsFacture);
                
                fermerModalConfirmation();
            });

            req.send();
        }

    }, [effet2])

    // useEffect(() => {
    //     socket.on('acte_supprime', () => {
    //         seteffet(!effet);
    //         setdetailsFacture([]);
    //     })
    // }, [socket])

    const afficherInfos = (e) => {
        // Affichage des informations de la facture selectionnée
        setfactureSelectionne(factures.filter(item => (item.id == e.target.id)))
        seteffet2(!effet2);
    }

     const filtrerListe = (e) => {
        // filter la liste des factures selon le nom du patient ou l'identifiant de la facture
        const val = e.target.value.toUpperCase().trim();
        if (val.length > 0) {
            setFactures(factureSauvegarde.filter(item => (item.patient.toUpperCase().includes(val) || item.id.toString().toUpperCase().includes(val))));
        } else {
            setFactures(factureSauvegarde);
        }
    }

    const supprimerFacture = () => {
        document.querySelector('.valider').disabled = true;
        document.querySelector('.supp').disabled = true;
        // Suppression d'une facture
        const data = new FormData();
        data.append('id', factureSelectionne[0].id);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}supprimer_facture.php`);
        
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setModalConfirmation(false);
                setSupp(true);
                setModalReussi(true);
            }
        });

        req.send(data);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        seteffet(!effet);
        setfactureSelectionne([]);
        setdetailsFacture([]);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }

    const annulerActe = (idFacture, designation) => {
        // mettre à jour le statut de l'acte dans la vue
        let acte = detailsFacture.filter(item => (item.designation === designation));
        acte = {...acte[0], statu_acte: 1};
        let filterDetailsFacture = detailsFacture.filter(item => (item.designation !== designation));
        filterDetailsFacture.push(acte);
        
        // mettre à jour le statut de l'acte dans la base de données
        const data = new FormData();
        data.append('id_facture', idFacture);
        data.append('designation', designation);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}annuler_acte.php?statu_acte=1`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setdetailsFacture(filterDetailsFacture);
                let nouveauNetAPayer = parseInt(factureSelectionne[0].a_payer) - (parseInt(acte.prix_total) - (parseInt(acte.prix_total) * (parseInt(acte.reduction) / 100)));
                majNetAPayer(idFacture, nouveauNetAPayer);
            }
        });

        req.send(data);
    }

    const majNetAPayer = (idFacture, nouveauNetAPayer) => {
        const data = new FormData();
        data.append('id_facture', idFacture);
        data.append('nouveau_net_a_payer', nouveauNetAPayer);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}annuler_acte.php?maj_net_a_payer`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setfactureSelectionne([{...factureSelectionne[0], a_payer: nouveauNetAPayer}]);
                seteffet(!effet);
                // socket.emit('suppression_acte');
            }
        });

        req.send(data);
    }

    const restaurerActe = (idFacture, designation) => {

        // mettre à jour le statut de l'acte dans la vue
        let acte = detailsFacture.filter(item => (item.designation === designation));
        acte = {...acte[0], statu_acte: 0};
        let filterDetailsFacture = detailsFacture.filter(item => (item.designation !== designation));
        filterDetailsFacture.push(acte);
        
        // mettre à jour le statut de l'acte dans la base de données
        const data = new FormData();
        data.append('id_facture', idFacture);
        data.append('designation', designation);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}annuler_acte.php?statu_acte=0`);

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                setdetailsFacture(filterDetailsFacture);
                let nouveauNetAPayer = parseInt(factureSelectionne[0].a_payer) + (parseInt(acte.prix_total) - (parseInt(acte.prix_total) * (parseInt(acte.reduction) / 100)));
                majNetAPayer(idFacture, nouveauNetAPayer);
            }
        });

        req.send(data);
    }

    return (
        <div className="container-facture">
            <div className="liste-medoc">

                <p className="search-zone">
                    <input type="text" placeholder="Nom patient" onChange={filtrerListe} />
                </p>
                <h3>{'Factures'}</h3>
                <ul>
                    {!isLoadingData ? factures.length > 0 ? factures.map(item => (
                        <li id={item.id} key={item.id} onClick={afficherInfos}>{item.patient}</li>
                    )) : 
                    <div className='text-center'>Aucune donnée disponible</div>
                    : <div className='text-center fw-bold'>Chargement...</div>}
                </ul>
            </div>
            <div className="details">
                <h3>Détails facture</h3>
                <div style={{textAlign: 'center', paddingTop: 10}}>
                    <div>
                        <div>Facture N°<span style={{color: '#038654', fontWeight: 700}}>{factureSelectionne.length > 0 && factureSelectionne[0].id}</span></div>
                    </div>
                    <div>
                        <div>Le <strong>{factureSelectionne.length > 0 && mois(factureSelectionne[0].date_heure.substring(0, 10))}</strong> à <strong>{factureSelectionne.length > 0 && factureSelectionne[0].date_heure.substring(11, )}</strong></div>
                    </div>
                    <div style={{marginTop: 5}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].patient}</span></div>
                    <div style={{marginTop: 5}}>code patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].code_patient}</span></div>
                    {factureSelectionne.length > 0 && factureSelectionne[0].assurance.toUpperCase() !== "aucune".toUpperCase() ? <div>couvert par : <strong>{factureSelectionne[0].assurance.toUpperCase()}</strong></div> : null}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '100%'}}>
                        <table style={table_styles}>
                            <thead>
                                <th style={table_styles1}>Désignation </th>
                                <td>Pu</td>
                                <td>Qtés</td>
                                <td>Total</td>
                            </thead>
                            <tbody>
                                {detailsFacture.map(item => (
                                    <tr key={item.id}>
                                        <td style={table_styles1} role="button" onClick={() => setVisible(true)}>
                                            {extraireCode(item.designation)}
                                            {parseInt(item.statu_acte) ? <CBadge color='danger'>annulé</CBadge> : null}  
                                        </td>
                                        <td style={table_styles2}>{item.prix}</td>
                                        <td style={table_styles2}>{item.qte}</td>
                                        <td style={table_styles2}>{item.prix_total}</td>
                                        {(
                                            // props.role.toUpperCase() === ROLES.admin.toUpperCase()) && (
                                            <td>
                                                {parseInt(item.statu_acte) ? 
                                                (<CIcon
                                                    onClick={() => restaurerActe(item.id_facture, item.designation)}
                                                    icon={cilReload}
                                                    className="text-success"
                                                    role="button"
                                                    size='lg'
                                                />) : 
                                                (
                                                    <CIcon
                                                        onClick={() => annulerActe(item.id_facture, item.designation)}
                                                        icon={cilXCircle}
                                                        className="text-danger"
                                                        role="button"
                                                        size='lg'
                                                    />
                                                )
                                                }
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-4'>
                        <div>Net à payer <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].a_payer + ' Fcfa'}</span></div>
                    </div>
                    <div>
                        <div>Réduction <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].reduction + ' %'}</span></div>
                    </div>
                    <div>
                        <div>Reste à payer <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].reste_a_payer + ' Fcfa'}</span></div>
                    </div>
                    <div>
                        <div>Caissier <span style={{fontWeight: 700, color: '#038654'}}>{factureSelectionne.length > 0 && factureSelectionne[0].caissier.toUpperCase()}</span></div>
                    </div>
                    <div style={{display: `${'flex'}`, justifyContent: 'center'}}>
                        <div style={{display: `${'block'}`}}>
                            <ReactToPrint
                                trigger={() => <button className='bootstrap-btn valider' style={{color: '#f1f1f1', height: '5vh', width: '15vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                                content={() => componentRef.current}
                            />
                        </div>
                    </div>
                    <div>
                        {factureSelectionne.length > 0 && (
                            <div style={{display: 'none'}}>
                                <FactureEnreg
                                    ref={componentRef}
                                    detailsFacture={detailsFacture}
                                    idFacture={factureSelectionne[0].id}
                                    patient={factureSelectionne[0].patient}
                                    codePatient={factureSelectionne[0].code_patient}
                                    prixTotal={factureSelectionne[0].prix_total}
                                    reduction={factureSelectionne[0].reduction}
                                    aPayer={factureSelectionne[0].a_payer}
                                    montantVerse={0}
                                    relicat={factureSelectionne[0].relicat}
                                    assurance={factureSelectionne[0].assurance}
                                    type_assurance={factureSelectionne[0].type_assurance}
                                    resteaPayer={factureSelectionne[0].reste_a_payer}
                                    date={factureSelectionne[0].date_heure}
                                    nomConnecte={factureSelectionne[0].caissier}
                                    montantFrais={factureSelectionne[0].frais}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
