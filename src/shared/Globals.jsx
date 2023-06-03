export function extraireCode (designation) {
    let designation_extrait = '';
    const codes = ['RX ', 'LAB ', 'MA ', 'MED ', 'CHR ', 'CO ', 'UPEC ', 'SP ', 'CA '];

    codes.forEach(item => {
        if(designation.indexOf(item) === 0) {
            designation_extrait =  designation.slice(item.length);
        } else if (designation.toUpperCase().indexOf('ECHO') === 0)  {
            designation_extrait = designation;
        }
    });

    if (designation_extrait === '') designation_extrait = designation;

    return designation_extrait.toUpperCase();
}

export const ServiceExiste = "Ce service existe déjà";	