const AU_BASE = "https://www.annamalaiuniversity.ac.in/";

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "AU-Help-AI/1.0 Student Project"
            }
        });

        if (!response.ok) {
            return null;
        }

        return await response.text();

    } catch (error) {

        console.error(
            "Crawler error:",
            error.message
        );

        return null;
    }
}


function cleanText(html) {

    return String(html || "")
        .replace(
            /<script[\s\S]*?<\/script>/gi,
            " "
        )
        .replace(
            /<style[\s\S]*?<\/style>/gi,
            " "
        )
        .replace(
            /<noscript[\s\S]*?<\/noscript>/gi,
            " "
        )
        .replace(
            /<[^>]+>/g,
            " "
        )
        .replace(
            /&nbsp;/gi,
            " "
        )
        .replace(
            /&amp;/gi,
            "&"
        )
        .replace(
            /&quot;/gi,
            '"'
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}


function absoluteURL(url) {

    if (url.startsWith("http")) {
        return url;
    }

    if (url.startsWith("/")) {
        return "https://www.annamalaiuniversity.ac.in" + url;
    }

    return new URL(
        url,
        AU_BASE
    ).href;
}


function extractLinks(html) {

    const links = [];

    const regex =
        /href\s*=\s*["']([^"']+)["']/gi;

    let match;

    while (
        (match = regex.exec(html)) !== null
    ) {

        const url = absoluteURL(
            match[1]
        );

        if (
            url.startsWith(AU_BASE) &&
            !url.includes("#")
        ) {
            links.push(url);
        }
    }

    return [
        ...new Set(links)
    ];
}


async function crawlAU() {

    const html = await fetchPage(
        AU_BASE
    );

    if (!html) {

        return {
            verified: false,
            pages: []
        };

    }


    const links = extractLinks(
        html
    );

    const pages = [];


    for (
        const url of links.slice(0, 30)
    ) {

        const page = await fetchPage(
            url
        );

        if (page) {

            pages.push({
                url: url,
                text: cleanText(page)
                    .slice(0, 20000)
            });

        }
    }


    return {
        verified: true,
        homepage: cleanText(html)
            .slice(0, 20000),
        pages: pages
    };
}


module.exports = {
    fetchPage,
    cleanText,
    extractLinks,
    crawlAU
};
