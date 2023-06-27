import React from 'react';
import { styleEntete } from './Globals';

export default function EnteteHopital() {
  return (
    <div style={{color: 'black', textTransform: 'uppercase', padding: '10px -200px', fontSize: 5, marginBottom: '12px', width: '120%', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{ lineHeight: '20px'}}>
            <div style={styleEntete}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
            <div style={styleEntete}><strong>Ministere de la sante publique</strong></div>
            <div style={styleEntete}><strong>Delegation regionale du Littoral</strong></div>
            <div style={styleEntete}><strong>District sante de Mbanga</strong></div>
            <div style={styleEntete}><strong>Hôpital de District de Mbanga</strong></div>
            <div style={styleEntete}>
                <strong>
                    B.P. 29 Mbanga <br />
                    Tel: 243 53 62 60 / 243 53 62 61 <br />
                    hdmbanga@yahoo.com
                </strong>
            </div>
        </div>
        <div style={{ lineHeight: '20px'}}>
            <div style={styleEntete}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
            <div style={styleEntete}><strong>Ministry of Public Health</strong></div>
            <div style={styleEntete}><strong>Littoral regional delegation</strong></div>
            <div style={styleEntete}><strong>Health District of Mbanga</strong></div>
            <div style={styleEntete}><strong>District Hospital of Mbanga</strong></div>
            <div style={styleEntete}>
                <strong>
                    P.O BOX 29 Mbanga <br />
                    Tel: 243 53 62 60 / 243 53 62 61 <br />
                    hdmbanga@yahoo.com
                </strong>
            </div>
        </div>
    </div>
  )
}
