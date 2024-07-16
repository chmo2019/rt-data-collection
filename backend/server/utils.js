const tryParseJson = (str) => {
    try {
        JSON.parse(str.toString());
    } catch (e) {
        return false;
    }
    return JSON.parse(str.toString());
}

module.exports.tryParseJson = tryParseJson;