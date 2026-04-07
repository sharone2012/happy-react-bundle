'use strict';
/**
 * CFI_AddOrganism_API — CJS re-export wrapper
 * Individual handlers live in the sibling files.
 */
module.exports.searchOrganism   = require('./organism-search.js');
module.exports.researchOrganism = require('./research-organism.js');
module.exports.insertOrganism   = require('./insert-organism.js');
