function departmentAnswer(data) {

    const items = data.local.filter(
        item => item.type === "department"
    );

    if (!items.length) {
        return null;
    }

    return items
        .slice(0, 20)
        .map(
            item =>
                `${item.name} — ${item.faculty}`
        )
        .join("\n");
}


function staffAnswer(data) {

    const items = data.local.filter(
        item => item.type === "staff"
    );

    if (!items.length) {
        return null;
    }

    return items
        .slice(0, 20)
        .map(
            item =>
                `${item.name} — ${item.designation} — ${item.department}`
        )
        .join("\n");
}


function programmeAnswer(data) {

    const items = data.local.filter(
        item => item.type === "programme"
    );

    if (!items.length) {
        return null;
    }

    return items
        .slice(0, 20)
        .map(
            item =>
                `${item.name} — ${item.level} — ${item.department}`
        )
        .join("\n");
}


function noticeAnswer(data) {

    const items = data.local.filter(
        item => item.type === "notice"
    );

    if (!items.length) {
        return null;
    }

    return items
        .slice(0, 10)
        .map(
            item =>
                `${item.title} — ${item.date}`
        )
        .join("\n");
}


async function generateAnswer(question, data) {

    const q = question.toLowerCase();


    if (
        q.includes("department") ||
        q.includes("faculty")
    ) {

        const answer = departmentAnswer(data);

        if (answer) {
            return `AU Departments\n\n${answer}`;
        }
    }


    if (
        q.includes("staff") ||
        q.includes("hod") ||
        q.includes("professor")
    ) {

        const answer = staffAnswer(data);

        if (answer) {
            return `AU Staff / HOD Information\n\n${answer}`;
        }
    }


    if (
        q.includes("course") ||
        q.includes("programme")
    ) {

        const answer = programmeAnswer(data);

        if (answer) {
            return `AU Programmes\n\n${answer}`;
        }
    }


    if (
        q.includes("notice") ||
        q.includes("notification") ||
        q.includes("circular")
    ) {

        const answer = noticeAnswer(data);

        if (answer) {
            return `AU Notices\n\n${answer}`;
        }
    }


    if (data.live.length) {

        return (
            `I found relevant public AU information.\n\n` +
            data.live[0].text.slice(0, 1800)
        );

    }


    return (
        "I couldn't find enough verified public information " +
        "to answer that question. Try asking with a specific " +
        "department, course, staff member, notice or examination topic."
    );

}


module.exports = {
    generateAnswer
};
