import React, { Component } from 'react';
import { extraireCode, mois } from '../../shared/Globals';

const styles = {
    // display: 'flex',
    // justifyContent: 'center',
    fontWeight: '600',
    marginTop: '7px',
    width: '100%',
    // border: '1px solid #333',
}

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 6,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 6,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 6,
    width: '100%',
    marginTop: '15px',
    fontSize: 8,
}

const styleEntete = {
    color: 'black',
    borderBottom: '1px dotted #000',
    letterSpacing: '1px'
}

export default class FactureEnreg extends Component {

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', width: '85%'}}>
                <div style={{fontSize: 8, backgroundColor: '#fff', height: '50vh', marginLeft: '315px', transform: 'rotate(90deg)'}}>
                    <div style={{textTransform: 'uppercase', padding: '10px -200px', fontSize: 5, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{ lineHeight: '20px'}}>
                            <div style={styleEntete}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
                            <div style={styleEntete}><strong>Ministere de la sante publique</strong></div>
                            <div style={styleEntete}><strong>Delegation regionale du Littoral</strong></div>
                            <div style={styleEntete}><strong>District sante de Mbanga</strong></div>
                        </div>
                        <div style={{ lineHeight: '20px'}}>
                            <div style={styleEntete}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
                            <div style={styleEntete}><strong>Minister of Public Health</strong></div>
                            <div style={styleEntete}><strong>Littoral regional delegation</strong></div>
                            <div style={styleEntete}><strong>Mbanga Health District</strong></div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                        <div style={{textAlign: 'center', width: '320px'}}>
                            <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>Caisse</h3>
                            <div style={{marginTop: 5}}>Facture N°<span style={{fontWeight: '600', marginTop: '15px', letterSpacing: '1px'}}>{this.props.idFacture}</span></div>
                            <div style={{marginTop: '5px'}}>
                                Le <strong>{this.props.date ? mois(this.props.date.substring(0, 10)) : 
                                mois((new Date().toLocaleDateString()))}
                                </strong> à <strong>{this.props.date ? this.props.date.substring(11, 19) : 
                                (new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</strong>
                            </div>
                            <div style={{marginTop: 5, textTransform: 'capitalize'}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.patient}</span></div>
                            {this.props.assurance.toUpperCase() !== "aucune".toUpperCase() ? (
                                <div style={{marginTop: 3}}>couvert par : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.assurance.toUpperCase()}</span></div>
                            ) : null}
                            <div style={{textAlign: 'center', marginBottom: 20}}>
                                <table style={table_styles}>
                                    <thead>
                                        <th style={table_styles1}>Désignation</th>
                                        <th style={table_styles2}>Prix</th>
                                    </thead>
                                    <tbody>
                                        {this.props.medocCommandes.map(item => (
                                            <tr>
                                                <td style={table_styles1}>{extraireCode(item.designation)}</td>
                                                <td style={table_styles2}>{item.prix}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between',}}>
                                <div style={{ lineHeight: '18px'}}>
                                    <div>Total</div>
                                    <div>Matériel</div>
                                    <div>Reduction</div>
                                    <div>Assurance</div>
                                    <div>Net à payer</div>
                                    <div>Montant versé</div>
                                    <div>Relicat</div>
                                    <div>Reste à payer</div>
                                </div>
                                <div style={{ lineHeight: '18px'}}>
                                    <div><strong>{this.props.prixTotal + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.montantFrais + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.reduction + ' %'}</strong></div>
                                    <div><strong>{this.props.type_assurance + ' %'}</strong></div>
                                    <div><strong>{this.props.aPayer + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.montantVerse + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.relicat + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.resteaPayer + ' Fcfa'}</strong></div>
                                </div>
                            </div>
                            <div style={{marginTop: '18px', textAlign: 'right', paddingRight: '30px'}}>Caissier : <span style={{fontWeight: '600', marginTop: '15px', textTransform: 'capitalize'}}>{this.props.nomConnecte.toUpperCase()}</span></div>
                            <div style={{fontStyle: 'italic', marginTop: '23px'}}> Bonne Guérison !!!</div>
                        </div>
                    </div>
                </div>
                <div style={{fontSize: 8, backgroundColor: '#fff', height: '50vh', marginLeft: '315px', transform: 'rotate(90deg)'}}>
                    <div style={{textTransform: 'uppercase', padding: '10px -200px', fontSize: 5, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{ lineHeight: '20px'}}>
                            <div style={styleEntete}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
                            <div style={styleEntete}><strong>Ministere de la sante publique</strong></div>
                            <div style={styleEntete}><strong>Delegation regionale du Littoral</strong></div>
                            <div style={styleEntete}><strong>District sante de Mbanga</strong></div>
                        </div>
                        <div style={{ lineHeight: '20px'}}>
                            <div style={styleEntete}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
                            <div style={styleEntete}><strong>Minister of Public Health</strong></div>
                            <div style={styleEntete}><strong>Littoral regional delegation</strong></div>
                            <div style={styleEntete}><strong>Mbanga Health District</strong></div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                        <div style={{textAlign: 'center', width: '320px'}}>
                            <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>Caisse</h3>
                            <div style={{marginTop: 5}}>Facture N°<span style={{fontWeight: '600', marginTop: '15px', letterSpacing: '1px'}}>{this.props.idFacture}</span></div>
                            <div style={{marginTop: '5px'}}>
                                Le <strong>{this.props.date ? mois(this.props.date.substring(0, 10)) : 
                                mois((new Date().toLocaleDateString()))}
                                </strong> à <strong>{this.props.date ? this.props.date.substring(11, 19) : 
                                (new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</strong>
                            </div>
                            <div style={{marginTop: 5, textTransform: 'capitalize'}}>patient : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.patient}</span></div>
                            {this.props.assurance.toUpperCase() !== "aucune".toUpperCase() ? (
                                <div style={{marginTop: 3}}>couvert par : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.assurance.toUpperCase()}</span></div>
                            ) : null}
                            <div style={{textAlign: 'center', marginBottom: 20}}>
                                <table style={table_styles}>
                                    <thead>
                                        <th style={table_styles1}>Désignation</th>
                                        <th style={table_styles2}>Prix</th>
                                    </thead>
                                    <tbody>
                                        {this.props.medocCommandes.map(item => (
                                            <tr>
                                                <td style={table_styles1}>{extraireCode(item.designation)}</td>
                                                <td style={table_styles2}>{item.prix}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between',}}>
                                <div style={{ lineHeight: '18px'}}>
                                    <div>Total</div>
                                    <div>Matériel</div>
                                    <div>Reduction</div>
                                    <div>Assurance</div>
                                    <div>Net à payer</div>
                                    <div>Montant versé</div>
                                    <div>Relicat</div>
                                    <div>Reste à payer</div>
                                </div>
                                <div style={{ lineHeight: '18px'}}>
                                    <div><strong>{this.props.prixTotal + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.montantFrais + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.reduction + ' %'}</strong></div>
                                    <div><strong>{this.props.type_assurance + ' %'}</strong></div>
                                    <div><strong>{this.props.aPayer + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.montantVerse + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.relicat + ' Fcfa'}</strong></div>
                                    <div><strong>{this.props.resteaPayer + ' Fcfa'}</strong></div>
                                </div>
                            </div>
                            <div style={{marginTop: '18px', textAlign: 'right', paddingRight: '30px'}}>Caissier : <span style={{fontWeight: '600', marginTop: '15px', textTransform: 'capitalize'}}>{this.props.nomConnecte.toUpperCase()}</span></div>
                            <div style={{fontStyle: 'italic', marginTop: '23px'}}> Bonne Guérison !!!</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
