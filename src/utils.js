

export function arrayMaxIndex(array) {
    return array.indexOf(Math.max.apply(null, array));
};