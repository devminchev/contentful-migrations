const enUSRegex = /\[ *en-US *\]/i;
const enCARegex = /\[ *en-CA *\]/i;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export {
    enUSRegex,
    enCARegex,
    delay
};
