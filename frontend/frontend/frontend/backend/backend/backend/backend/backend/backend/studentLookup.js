async function lookupStudent(registerNumber) {

    const cleanRegister = String(registerNumber || "")
        .replace(/[^0-9A-Za-z-]/g, "")
        .slice(0, 30);


    if (!cleanRegister) {

        return {
            success: false,
            message: "Invalid register number."
        };

    }


    return {
        success: false,
        register_number: cleanRegister,
        message: "No publicly accessible student information was found."
    };

}


module.exports = {
    lookupStudent
};
