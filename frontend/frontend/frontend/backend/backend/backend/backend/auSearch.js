const { crawlAU } = require("./auCrawler");

const departments = require("./data/departments.json");
const staff = require("./data/staff.json");
const programmes = require("./data/programmes.json");
const notices = require("./data/notices.json");


function words(text) {

    return String(text)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(word => word.length > 2);

}


function scoreText(text, keywords) {

    const lower = String(text)
        .toLowerCase();

    let score = 0;

    for (const word of keywords) {

        if (lower.includes(word)) {
            score++;
        }

    }

    return score;

}


async function searchAU(question) {

    const keywords = words(question);


    const local = [
        ...departments,
        ...staff,
        ...programmes,
        ...notices
    ];


    const localResults = local
        .map(item => ({
            item: item,
            score: scoreText(
                JSON.stringify(item),
                keywords
            )
        }))
        .filter(item => item.score > 0)
        .sort(
            (a, b) => b.score - a.score
        )
        .slice(0, 10);


    let live = {
        verified: false,
        homepage: "",
        pages: []
    };


    try {

        live = await crawlAU();

    } catch (error) {

        console.error(
            "Live search error:",
            error.message
        );

    }


    const liveResults = (live.pages || [])
        .map(page => ({
            ...page,
            score: scoreText(
                page.text,
                keywords
            )
        }))
        .filter(
            page => page.score > 0
        )
        .sort(
            (a, b) => b.score - a.score
        )
        .slice(0, 8);


    return {

        verified: live.verified,

        local: localResults.map(
            result => result.item
        ),

        live: liveResults,

        homepage: live.homepage || ""

    };

}


module.exports = {
    searchAU
};
