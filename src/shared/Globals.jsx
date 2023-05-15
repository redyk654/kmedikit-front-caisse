export function extraireCode (designation) {
    const codes = ['RX', 'LAB', 'MA', 'MED', 'CHR', 'CO', 'UPEC', 'SP', 'CA'];
    let designation_extrait = '';

    codes.forEach(item => {
        if(designation.indexOf(item) === 0) {
            designation_extrait =  designation.slice(item.length + 1);
        } else if (designation.toUpperCase().indexOf('ECHO') === 0)  {
            designation_extrait = designation;
        }
    });

    if (designation_extrait === '') designation_extrait = designation;

    return designation_extrait.toUpperCase();
}

export function afficherSexe (sexe) {
    let val;
    switch(sexe) {
        case 'h':
            val = 'homme';
            break;
        case 'f':
            val = 'femme';
            break;
        default:
            val = 'non renseigné'
    }

    return val.toUpperCase();
}

export function afficherAge (age) {
    if (parseInt(age) > 1) 
        return age + "ans"
    else
        return "non renseigné"
}

export const ROLES = {
    caissier: "caissier",
    admin: "admin",
    regisseur: "regisseur",
    secretaire: "secretaire",
}

export const SEXES = {
    h: 'h',
    f: 'f'
}