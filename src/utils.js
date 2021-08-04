
export function getBaseUrl() {
    return "MASK_MODEL_URL" in process.env
        ? process.env["MASK_MODEL_URL"] 
        : 'http://localhost:8080'
}

export function arrayMaxIndex(array) {
    return array.indexOf(Math.max.apply(null, array));
};