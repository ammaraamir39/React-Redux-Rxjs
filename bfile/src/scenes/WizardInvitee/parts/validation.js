const Validation = (wizard) => {
    let errors = [];
    if (wizard.page === 1) {
        if (wizard.first_name === '')       errors.push('First name missing.');
        if (wizard.last_name === '')        errors.push('Last name missing.');
        if (wizard.phone === '')            errors.push('Phone missing.');
    }

    if (errors.length === 0) {
        return { success: true }
    } else {
        return { success: false, errors }
    }
}

export default Validation;
