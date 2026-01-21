const CATEGORY_RANGES = {
    'NEWS': { start: 101, end: 199 },
    'SPORTS': { start: 201, end: 299 },
    'LOTTERY': { start: 301, end: 399 },
    'TV': { start: 401, end: 499 },
    'WEATHER': { start: 501, end: 599 },
    'JOBS': { start: 601, end: 699 },
    'HOROSCOPE': { start: 701, end: 799 },
    'FINANCE': { start: 801, end: 899 },
    'MISC': { start: 901, end: 999 }
};

export const getOccupiedPageNumbers = (pages) => {
    if (!Array.isArray(pages)) return [];
    return pages.map(page => page.pageNumber).filter(num => num !== null && num !== undefined);
};

export const getFirstFreePageNumber = (pages, startRange = 101, endRange = 999) => {
    const occupied = getOccupiedPageNumbers(pages);

    for (let num = startRange; num <= endRange; num++) {
        if (!occupied.includes(num)) {
            return num;
        }
    }

    return null;
};

export const getFirstFreePageNumberForCategory = (pages, category) => {
    if (!category || !CATEGORY_RANGES[category]) {
        return getFirstFreePageNumber(pages);
    }

    const range = CATEGORY_RANGES[category];
    return getFirstFreePageNumber(pages, range.start, range.end);
};

export const getCategoryRange = (category) => {
    return CATEGORY_RANGES[category] || { start: 101, end: 999 };
};

export const hasTemplateCreatedPage = (pages, templateId) => {
    if (!Array.isArray(pages) || !templateId) return false;
    return pages.some(page => page.template && page.template.id === templateId);
};

export const getPageNumberByTemplateId = (pages, templateId) => {
    if (!Array.isArray(pages) || !templateId) return null;

    const page = pages.find(page => page.template && page.template.id === templateId);
    return page ? page.pageNumber : null;
};

export const isValidPageNumber = (pageNumber, min = 101, max = 999) => {
    const num = parseInt(pageNumber, 10);
    return !isNaN(num) && num >= min && num <= max;
};

export const isPageNumberOccupied = (pages, pageNumber) => {
    const occupied = getOccupiedPageNumbers(pages);
    return occupied.includes(parseInt(pageNumber, 10));
};