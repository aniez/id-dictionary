var config = require("../acceptanceTestConfig");
// to tell package where it is routed
config.idDictionaryUrl = config.url + "/id-dictionary";
module.exports = config;