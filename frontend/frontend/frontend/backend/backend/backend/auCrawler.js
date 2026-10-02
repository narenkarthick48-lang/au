const AU_BASE = "https://www.annamalaiuniversity.ac.in/";

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "AU-Help-AI/1.0"
            }
        });

        if (!response.ok) {
            return null;
        }

        return await response.text();

    } catch (error) {
        console.error(
            "AU fetch error:",
            error.message
        );

        return null;
    }
}

function cleanText(html) {
    return String(html || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function absoluteURL(url) {
    try {
        if (!url) {
            return null;
        }

        if (url.startsWith("http://") ||
            url.startsWith("https://")) {
            return url;
        }

        if (url.startsWith("//")) {
            return "https:" + url;
        }

        if (url.startsWith("/")) {
            return new URL(
                url,
                AU_BASE
            ).href;
        }

        return new URL(
            url,
            AU_BASE
        ).href;

    } catch {
        return null;
    }
}

function isAllowedAUURL(url) {
    if (!url) {
        return false;
    }

    try {
        const parsed = new URL(url);

        return (
            parsed.hostname ===
            "www.annamalaiuniversity.ac.in"
        ) || (
            parsed.hostname ===
            "annamalaiuniversity.ac.in"
        );

    } catch {
        return false;
    }
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
            isAllowedAUURL(url) &&
            !url.includes("#") &&
            !url.toLowerCase().startsWith("javascript:")
        ) {
            links.push(url);
        }
    }

    return [
        ...new Set(links)
    ];
}

function isUsefulPage(url) {
    const lower = url.toLowerCase();

    const keywords = [
        "department",
        "faculty",
        "staff",
        "course",
        "programme",
        "program",
        "admission",
        "notice",
        "notification",
        "circular",
        "exam",
        "coe",
        "student",
        "placement",
        "research",
        "scholarship"
    ];

    return keywords.some(
        keyword => lower.includes(keyword)
    );
}

async function crawlAU() {
    const homepageHTML =
        await fetchPage(AU_BASE);

    if (!homepageHTML) {
        return {
            verified: false,
            homepage: "",
            pages: []
        };
    }

    const homepageText =
        cleanText(homepageHTML);

    const allLinks =
        extractLinks(homepageHTML);

    const usefulLinks =
        allLinks.filter(
            isUsefulPage
        );

    const selectedLinks = [
        ...new Set([
            ...usefulLinks,
            ...allLinks
        ])
    ].slice(0, 50);

    const pages = [];

    for (
        const url of selectedLinks
    ) {
        try {
            const html =
                await fetchPage(url);

            if (!html) {
                continue;
            }

            const text =
                cleanText(html);

            if (!text) {
                continue;
            }

            pages.push({
                url: url,
                text: text.slice(
                    0,
                    20000
                )
            });

        } catch (error) {
            console.error(
                "Page crawl error:",
                error.message
            );
        }
    }

    return {
        verified: true,
        homepage:
            homepageText.slice(
                0,
                20000
            ),
        pages: pages
    };
}

module.exports = {
    fetchPage,
    cleanText,
    absoluteURL,
    extractLinks,
    crawlAU
};
