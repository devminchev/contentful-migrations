export const setField = (obj, fieldName, locale, value) => {
    if (obj[fieldName] && obj[fieldName][locale]) {
        obj[fieldName][locale] = value;
    } else {
        obj[fieldName] = {
            [locale]: value
        }
    }
}
