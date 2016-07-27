const Chance = require('chance')
const chance = new Chance();

function shortenUrl() {
 return chance.word({length: 2}) + '-' + chance.word() + '-' + chance.word();
}

module.exports = shortenUrl;
