import React from 'react';
import { extraireCode, mois } from '../../shared/Globals';


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
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
        <div className='border border-dark' style={{textAlign: 'center', width: '250px',}}>
            <h3 style={{color: 'black', background: 'none', marginBottom: '10px'}}>Caisse</h3>
            <div style={{marginTop: 2}}>
                Facture N°
                <span style={{fontWeight: '600', marginTop: '15px', letterSpacing: '1px', color: 'black'}}>
                    {props.idFacture}
                </span>
            </div>
            <div style={{marginTop: '3px'}}>
                Le <strong>{props.date ? mois(props.date.substring(0, 10)) : 
                mois((new Date().toLocaleDateString()))}
                </strong> à <strong>{props.date ? props.date.substring(11, 19) : 
                (new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</strong>
            </div>
            <div style={{marginTop: 2, textTransform: 'capitalize'}}>
                patient : 
                <span style={{fontWeight: '600', marginTop: '15px', color: 'black'}}>
                    {props.patient}
                </span>
            </div>
            <div style={{marginTop: 2, textTransform: 'capitalize'}}>Code patient : 
                <span style={{fontWeight: '600', marginTop: '10px', letterSpacing: '2px', color: 'black'}}>
                    {props.codePatient.toUpperCase()}
                </span>
            </div>
            {props.assurance.toUpperCase() !== "aucune".toUpperCase() ? (
                <div style={{marginTop: 3}}>
                    couvert par : 
                    <span style={{fontWeight: '600', marginTop: '15px'}}>
                        {props.assurance.toUpperCase()}
                    </span>
                </div>
            ) : null}
            <div style={{textAlign: 'center', marginBottom: 15}}>
                <table style={table_styles}>
                    <thead>
                        <th style={table_styles1}>Désignation</th>
                        <th style={table_styles2}>Prix</th>
                    </thead>
                    <tbody>
                        {props.medocCommandes.map(item => (
                            <tr>
                                <td style={table_styles1}>{extraireCode(item.designation)}</td>
                                <td style={table_styles2}>{item.prix}</td>
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
                    <div>Montant versé</div>
                    <div>Relicat</div>
                    <div>Reste à payer</div>
                </div>
                <div style={{ lineHeight: '11px'}}>
                    <div><strong>{props.prixTotal() + ' Fcfa'}</strong></div>
                    {/* <div><strong>{props.montantFrais + ' Fcfa'}</strong></div> */}
                    <div><strong>{props.reduction + ' %'}</strong></div>
                    {/* <div><strong>{props.type_assurance + ' %'}</strong></div> */}
                    <div><strong>{props.aPayer() + ' Fcfa'}</strong></div>
                    <div><strong>{props.montantVerse + ' Fcfa'}</strong></div>
                    <div><strong>{props.relicat() + ' Fcfa'}</strong></div>
                    <div><strong>{props.resteaPayer() + ' Fcfa'}</strong></div>
                </div>
            </div>
            <div style={{marginTop: '15px', textAlign: 'right', paddingRight: '30px'}}>Caissier : <span style={{fontWeight: '600', marginTop: '15px', textTransform: 'capitalize'}}>{props.nomConnecte.toUpperCase()}</span></div>
            <div style={{fontStyle: 'italic', marginTop: '9px'}}> Bonne Guérison !!!</div>
        </div>
    </div>
  )
}
