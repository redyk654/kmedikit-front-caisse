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

export const MONTANTMATERIEL = 500;

export function mois (str) {

    switch(parseInt(str.substring(3, 5))) {
        case 1:
            return str.substring(0, 2) + " janvier " + str.substring(6, 10);
        case 2:
            return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
        case 3:
            return str.substring(0, 2) + " mars " + str.substring(6, 10);
        case 4:
            return str.substring(0, 2) + " avril " +  str.substring(6, 10);
        case 5:
            return str.substring(0, 2) + " mai " + str.substring(6, 10);
        case 6:
            return str.substring(0, 2) + " juin " + str.substring(6, 10);
        case 7:
            return str.substring(0, 2) + " juillet " + str.substring(6, 10);
        case 8:
            return str.substring(0, 2) + " août " + str.substring(6, 10);
        case 9:
            return str.substring(0, 2) + " septembre " + str.substring(6, 10);
        case 10:
            return str.substring(0, 2) + " octobre " + str.substring(6, 10);
        case 11:
            return str.substring(0, 2) + " novembre " + str.substring(6, 10);
        case 12:
            return str.substring(0, 2) + " décembre " + str.substring(6, 10);
    }
}