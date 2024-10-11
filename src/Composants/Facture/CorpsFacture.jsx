import React, { useEffect, useState } from 'react';
import { extraireCode, getDateTime, mois } from '../../shared/Globals';


const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 3,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 3,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 3,
    width: '100%',
    marginTop: '5px',
    fontWeight: 'bold',
    fontSize: 8,
    color: 'black'
}

export default function CorpsFacture(props) {

  return (
    <div className='' style={{height: '35vh', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '8px',}}>
        <div style={{textAlign: 'center', width: '250px', height: '30vh'}}>
            <h3 style={{color: 'black', background: 'none', marginBottom: '10px'}}>Caisse</h3>
            <div style={{marginTop: 2}}>
                Facture N°
                <span style={{fontWeight: '600', marginTop: '15px', letterSpacing: '1px', color: 'black'}}>
                &nbsp; {props.idFacture}
                </span>
            </div>
            <div style={{marginTop: '3px'}}>
                Le <strong>{mois(props.dateJour.substring(0, 10))}
                </strong> à <strong>{props.dateJour.substring(11, 16)}</strong>
            </div>
            <div style={{marginTop: 2, textTransform: 'capitalize'}}>
                patient :
                <span style={{fontWeight: '600', marginTop: '15px', color: 'black'}}>
                    &nbsp; {props.patient.toUpperCase()}
                </span>
            </div>
            <div style={{marginTop: 2, textTransform: 'capitalize'}}>
                Code patient :
                <span style={{fontWeight: '600', marginTop: '10px', letterSpacing: '2px', color: 'black'}}>
                    &nbsp; {props.codePatient.toUpperCase()}
                </span>
            </div>
            <div style={{textAlign: 'center', marginBottom: 15}}>
                <table style={table_styles}>
                    <thead>
                        <th style={table_styles1}>Désignation</th>
                        <th style={table_styles2}>Pu</th>
                        <th style={table_styles2}>Qtés</th>
                        <th style={table_styles2}>Total</th>
                    </thead>
                    <tbody>
                        {props.medocCommandes.map(item => (
                            <tr>
                                <td style={table_styles1}>{extraireCode(item.designation)}</td>
                                <td style={table_styles2}>{item.prix}</td>
                                <td style={table_styles2}>{item.qte_commander}</td>
                                <td style={table_styles2}>{item.prix_total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between',}}>
                <div style={{ lineHeight: '11px'}}>
                    <div>Total</div>
                    {/* <div>Matériel</div> */}
                    <div>Reduction</div>
                    {/* <div>Assurance</div> */}
                    <div>Net à payer</div>
                    <div>Payé</div>
                    {/* <div>Relicat</div> */}
                    <div>Reste à payer</div>
                </div>
                <div style={{ lineHeight: '11px', color: 'black'}}>
                    <div><strong>{props.prixTotal() + ' Fcfa'}</strong></div>
                    {/* <div><strong>{props.montantFrais + ' Fcfa'}</strong></div> */}
                    <div><strong>{props.reduction.toString().substring(0, 5) + ' %'}</strong></div>
                    {/* <div><strong>{props.type_assurance + ' %'}</strong></div> */}
                    <div><strong>{props.aPayer() + ' Fcfa'}</strong></div>
                    <div><strong>{props.montantVerse() + ' Fcfa'}</strong></div>
                    {/* <div><strong>{props.relicat + ' Fcfa'}</strong></div> */}
                    <div><strong>{props.resteaPayer + ' Fcfa'}</strong></div>
                </div>
            </div>
            <div style={{marginTop: '15px', textAlign: 'right', paddingRight: '30px'}}>Caissier : <span style={{fontWeight: '600', marginTop: '15px', textTransform: 'capitalize'}}>{props.nomConnecte.toUpperCase()}</span></div>
            {props.prescripteur != "" ? (
                <div style={{marginTop: 3}}>
                    Prescripteur :
                    <span style={{fontWeight: '600', marginTop: '10px', color: 'black'}}>
                        &nbsp; {props.prescripteur.toUpperCase()}
                    </span>
                </div>
            ) : null}
            <div style={{fontStyle: 'italic', marginTop: '9px'}}> Bonne Guérison !!!</div>
        </div>
    </div>
  )
}
