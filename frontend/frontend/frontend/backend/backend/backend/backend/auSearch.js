const {
    crawlAU
} = require("./auCrawler");

function normalize(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function scoreText(text, query) {
    const source = normalize(text);
    const words = normalize(query)
        .split(" ")
        .filter(Boolean);

    let score = 0;

    for (const word of words) {
        if (source.includes(word)) {
            score++;
        }
    }

    return score;
}

async function searchAU(query) {
    const data = await crawlAU();

    if (!data.verified) {
        return {
            success: false,
            message:
                "AU public information could not be fetched right now.",
            results: []
        };
    }

    const results = [];

    for (const page of data.pages) {
        const score = scoreText(
            page.text,
            query
        );

        if (score > 0) {
            results.push({
                score,
                url: page.url,
                text: page.text
            });
        }
    }

    results.sort(
        (a, b) => b.score - a.score
    );

    return {
        success: true,
        query,
        results: results
            .slice(0, 5)
            .map(item => ({
                url: item.url,
                text: item.text.slice(
                    0,
                    5000
                )
            }))
    };
}

module.exports = {
    searchAU
};
