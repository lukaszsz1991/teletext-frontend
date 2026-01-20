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

    return null; // No free numbers available
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