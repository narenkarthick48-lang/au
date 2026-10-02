const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");


function loadJSON(file) {

    try {

        const filePath = path.join(
            DATA_DIR,
            file
        );

        return JSON.parse(
            fs.readFileSync(
                filePath,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            `Unable to load ${file}:`,
            error.message
        );

        return [];

    }
}


function getDepartments() {
    return loadJSON("departments.json");
}


function getStaff() {
    return loadJSON("staff.json");
}


function getProgrammes() {
    return loadJSON("programmes.json");
}


function getNotices() {
    return loadJSON("notices.json");
}


module.exports = {
    getDepartments,
    getStaff,
    getProgrammes,
    getNotices
};
