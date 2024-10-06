import React from 'react';
import { styleEntete } from './Globals';
import logo from '../images/logo_hdj.png';

export default function EnteteHopital() {
  return (
    <div style={{textTransform: 'uppercase', padding: '', marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{ lineHeight: '20px'}}>
            <div style={styleEntete}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
            <div style={styleEntete}><strong>Ministere de la sante publique</strong></div>
            <div style={styleEntete}><strong>Delegation regionale du Littoral</strong></div>
            <div style={styleEntete}><strong>District sante de Japoma</strong></div>
            <div style={styleEntete}><strong>Hôpital de District de Japoma</strong></div>
            <div style={{...styleEntete, lineHeight: '12px'}}>
                <strong>
                    B.P 7051 <br />
                    Tel: 695 19 38 35
                </strong>
            </div>
        </div>
        <div style={{paddingTop: '80px'}}>
            <img src={logo} alt="" width={60} height={60} />
        </div>
        <div style={{ lineHeight: '20px'}}>
            <div style={styleEntete}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
            <div style={styleEntete}><strong>Minister of Public Health</strong></div>
            <div style={styleEntete}><strong>Littoral regional delegation</strong></div>
            <div style={styleEntete}><strong>Health District of Japoma</strong></div>
            <div style={styleEntete}><strong>District Hospital of Japoma</strong></div>
            <div style={{...styleEntete, lineHeight: '12px'}}>
                <strong>
                    B.P 7051 <br />
                    Tel: 695 19 38 35
                </strong>
            </div>
        </div>
    </div>
  )
}