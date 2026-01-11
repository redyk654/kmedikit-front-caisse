import React, { useEffect, useState, useRef } from 'react';
import './GestionFactures.css';
import ReactToPrint from 'react-to-print';
import FactureEnreg from '../Facture/FactureEnreg';
import { mois, extraireCode, nomDns } from "../../shared/Globals";
import { CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { cilReload, cilXCircle } from '@coreui/icons';

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

export default function GestionFactures() {
    const componentRef = useRef();

    const [factures, setFactures] = useState([]);
    const [factureSauvegarde, setfactureSauvegarde] = useState([]);
    const [factureSelectionne, setfactureSelectionne] = useState([]);
    const [listePrescripteurs, setlistePrescripteurs] = useState([]);
    const [prescripteurSelectionne, setprescripteurSelectionne] = useState([]);
    const [isModifierPrescripteur, setisModifierPrescripteur] = useState(false);
    const [detailsFacture, setdetailsFacture] = useState([]);
    const [effet, seteffet] = useState(false);
    const [effet2, seteffet2] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        getPrescrpteurs();
        // Récupération des factures
        setIsLoadingData(true);
        setFactures([]);
        setfactureSauvegarde([]);
        
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}gestion_factures.php`);

        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setFactures(result);
                setfactureSauvegarde(result);
                setIsLoadingData(false);
            } else {
                console.error(req.status + " " + req.statusText);
            }
        });
        
        req.addEventListener("error", function () {
            console.error("Erreur réseau");
        });

        req.send();
    }, [effet]);


    const getPrescrpteurs = () => {
        // Récupération des prescripteurs
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}gestion_prescripteurs.php?liste`);
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                setlistePrescripteurs(result);
                // console.log(JSON.parse(req.responseText));
            }
        });
        req.addEventListener("error", function () {
            console.error("Erreur réseau lors de la récupération des prescripteurs");
        });
        req.send();
    }

    useEffect(() => {
        if (factureSelectionne.length > 0) {
            // Récupération des détails de la facture selectionnée
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}gestion_factures.php?id=${factureSelectionne[0].id}`);
    
            req.addEventListener('load', () => {
                const result = JSON.parse(req.responseText);
                setdetailsFacture(result);
            });

            req.send();
        }
    }, [effet2, factureSelectionne]);

    const afficherInfos = (e) => {
        // Affichage des informations de la facture selectionnée
        setfactureSelectionne(factures.filter(item => (item.id == e.target.id)));
        setisModifierPrescripteur(false);
        seteffet2(!effet2);
    }

    const filtrerListe = (e) => {
        // filter la liste des factures selon le nom du patient ou l'identifiant de la facture
        const val = e.target.value.toUpperCase().trim();
        if (val.length > 0) {
            setFactures(factureSauvegarde.filter(item => (
                item.patient.toUpperCase().includes(val) || 
                item.id.toString().toUpperCase().includes(val)
            )));
        } else {
            setFactures(factureSauvegarde);
        }
    }

    // Fonction utilitaire pour calculer le prix réel d'un acte en tenant compte de la réduction
    const calculerPrixReel = (acte) => {
        const prixTotal = parseFloat(acte.prix_total);
        const reduction = parseFloat(acte.reduction) || 0;
        return prixTotal * (1 - reduction / 100);
    };
  
    // Fonction unifiée pour gérer l'annulation ou la restauration d'un acte
    const gererActe = async (idFacture, designation, nouvelleValeurStatut) => {
        try {
            // Trouver l'acte concerné
            const acte = detailsFacture.find(item => item.designation === designation);
            if (!acte) return;

            // Vérifier si l'état a changé pour éviter des opérations inutiles
            if (parseInt(acte.statu_acte) === nouvelleValeurStatut) return;

            // Envoyer la mise à jour au serveur
            const data = new FormData();
            data.append('id_facture', idFacture);
            data.append('designation', designation);

            const response = await fetch(`${nomDns}annuler_acte.php?statu_acte=${nouvelleValeurStatut}`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut');

            // Mettre à jour l'état local
            const updatedDetails = detailsFacture.map(item =>
                item.designation === designation ? { ...item, statu_acte: nouvelleValeurStatut } : item
            );
            setdetailsFacture(updatedDetails);

            // 🔥 Recalculer le net à payer en fonction des actes non annulés
            recalculerNetAPayer(idFacture, updatedDetails);

        } catch (error) {
            console.error("Erreur lors de la gestion de l'acte:", error);
        }
    };
  
    // Nouvelle fonction pour recalculer le net à payer sur toute la facture
    const recalculerNetAPayer = async (idFacture, detailsFactureActuels) => {
        try {
            // Filtrer les actes qui ne sont PAS annulés (statu_acte !== 1)
            const actesNonAnnules = detailsFactureActuels.filter(acte => acte.statu_acte !== 1);

            // Calculer le net à payer total
            const nouveauNetAPayer = actesNonAnnules
            .reduce((total, acte) => total + calculerPrixReel(acte), 0)
            .toFixed(2); // 🔥 Éviter les erreurs d'arrondi

            // Mettre à jour la base de données
            await majNetAPayer(idFacture, nouveauNetAPayer);

        } catch (error) {
            console.error("Erreur lors du recalcul du net à payer:", error);
        }
    };
  
    // Met à jour le montant à payer dans la base de données et dans l'état local
    const majNetAPayer = async (idFacture, nouveauNetAPayer) => {
        try {
            const data = new FormData();
            data.append('id_facture', idFacture);
            data.append('nouveau_net_a_payer', nouveauNetAPayer);

            const response = await fetch(`${nomDns}annuler_acte.php?maj_net_a_payer`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour du montant');

            // Mise à jour locale du montant à payer
            if (factureSelectionne.length > 0) {
                setfactureSelectionne([{ ...factureSelectionne[0], a_payer: nouveauNetAPayer }]);
                seteffet(prev => !prev); // Déclencher un rafraîchissement
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour du montant:", error);
        }
    };

    // Modifier le prescripteur de la facture
    const modifierPrescripteur = () => {
        // console.log(isModifierPrescripteur, prescripteurSelectionne);
        
        const data = new FormData();
        data.append('id_fac', factureSelectionne[0].id);
        data.append('prescripteur', prescripteurSelectionne);
        // console.log(data);
        
        
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}update_prescrpteur.php?modifier_prescripteur`);
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.responseText);
                // console.log(req.responseText);
                
                if (result.success) {
                    factureSelectionne[0].prescripteur = listePrescripteurs.filter(p => p.id == prescripteurSelectionne)[0]?.designation;
                    setisModifierPrescripteur(false);
                    seteffet(!effet); // Déclencher un rafraîchissement
                    seteffet2(!effet2); // Rafraîchir les détails de la facture
                    alert("Prescripteur modifié avec succès");
                } else {
                    alert("Erreur lors de la modification du prescripteur");
                }
            } else {
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            console.error("Erreur réseau lors de la modification du prescripteur");
        });
        req.send(data);
    }

    // Fonctions d'annulation et de restauration
    const annulerActe = (idFacture, designation) => gererActe(idFacture, designation, 1);
    const restaurerActe = (idFacture, designation) => gererActe(idFacture, designation, 0);
  
    return (
        <div className="container-facture">
            <div className="liste-medoc">
                <p className="search-zone">
                    <input type="text" placeholder="Nom patient" onChange={filtrerListe} />
                </p>
                <h3>{'Factures'}</h3>
                <ul>
                    {!isLoadingData ? 
                        factures.length > 0 ? 
                            factures.map(item => (
                                <li id={item.id} key={item.id} onClick={afficherInfos}>{item.patient}</li>
                            )) : 
                            <div className='text-center'>Aucune donnée disponible</div>
                        : 
                        <div className='text-center fw-bold'>Chargement...</div>
                    }
                </ul>
            </div>
            <div className="details">
                <h3>Détails facture</h3>
                <div style={{textAlign: 'center', paddingTop: 10}}>
                    <div>
                        <div>Facture N°<span style={{color: '#038654', fontWeight: 700}}>{factureSelectionne.length > 0 && factureSelectionne[0].id}</span></div>
                    </div>
                    <div>
                        <div>Le <strong>{factureSelectionne.length > 0 && mois(factureSelectionne[0].date_heure.substring(0, 10))}</strong> à <strong>{factureSelectionne.length > 0 && factureSelectionne[0].date_heure.substring(11)}</strong></div>
                    </div>
                    <div style={{marginTop: 5}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].patient}</span></div>
                    <div style={{marginTop: 5}}>code patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].code_patient}</span></div>
                    <div style={{marginTop: 5}}>
                        prescripteur : 
                        {isModifierPrescripteur ?
                        <>
                            <select
                                defaultChecked={factureSelectionne.length > 0 && factureSelectionne[0].prescripteur ? factureSelectionne[0].prescripteur : ''}
                                value={prescripteurSelectionne}
                                onChange={(e) => {
                                    setprescripteurSelectionne(e.target.value);
                                }}
                                style={{marginLeft: 10, padding: 5, borderRadius: 5, border: '1px solid #ccc'}}
                            >
                                <option value="">Sélectionner un prescripteur</option>
                                {listePrescripteurs.map((prescripteur, index) => (
                                    <option value={prescripteur.id}>
                                        {prescripteur.designation}
                                    </option>
                                ))}
                            </select>
                            <button onClick={modifierPrescripteur}>Enregistrer les modifications</button>
                        </>
                        :
                        <>
                            <span style={{fontWeight: '600', marginTop: '15px'}}>{factureSelectionne.length > 0 && factureSelectionne[0].prescripteur ? factureSelectionne[0].prescripteur : 'null'}</span>
                            <button onClick={() => setisModifierPrescripteur(true)}>modifier</button>
                        </>
                        }
                    </div>
                    {factureSelectionne.length > 0 && factureSelectionne[0].assurance.toUpperCase() !== "aucune".toUpperCase() ? 
                        <div>couvert par : <strong>{factureSelectionne[0].assurance.toUpperCase()}</strong></div> : null}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '100%'}}>
                        <table style={table_styles}>
                            <thead>
                                <tr>
                                    <th style={table_styles1}>Désignation</th>
                                    <th>Pu</th>
                                    <th>Qtés</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailsFacture.map(item => (
                                    <tr key={item.id}>
                                        <td style={table_styles1}>
                                            {extraireCode(item.designation)}
                                            {parseInt(item.statu_acte) ? <CBadge color='danger'>annulé</CBadge> : null}  
                                        </td>
                                        <td style={table_styles2}>{item.prix}</td>
                                        <td style={table_styles2}>{item.qte}</td>
                                        <td style={table_styles2}>{item.prix_total}</td>
                                        <td>
                                            {parseInt(item.statu_acte) ? 
                                                (<CIcon
                                                    onClick={() => restaurerActe(item.id_facture, item.designation)}
                                                    icon={cilReload}
                                                    className="text-success"
                                                    role="button"
                                                    size='lg'
                                                />) : 
                                                (<CIcon
                                                    onClick={() => annulerActe(item.id_facture, item.designation)}
                                                    icon={cilXCircle}
                                                    className="text-danger"
                                                    role="button"
                                                    size='lg'
                                                />)
                                            }
                                        </td>
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
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'block'}}>
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