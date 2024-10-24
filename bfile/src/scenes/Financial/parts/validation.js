const Validation = (wizard) => {
    let errors = [];

    if (errors.length === 0) {
        return { success: true }
    } else {
        return { success: false, errors }
    }
}

export default Validation;
