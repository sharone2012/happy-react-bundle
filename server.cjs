'use strict';
require('dotenv').config();

const express = require('express');

const searchHandler   = require('./backend/api/organism-search.js');
const researchHandler = require('./backend/api/research-organism.js');
const insertHandler   = require('./backend/api/insert-organism.js');

const calcEfbDmHandler    = require('./backend/api/calc-efb-dm.js');
const calcOpdcDmHandler   = require('./backend/api/calc-opdc-dm.js');
const calcPomeDmHandler   = require('./backend/api/calc-pome-dm.js');
const calcGhHandler       = require('./backend/api/calc-gh.js');
const calcS1S2Handler     = require('./backend/api/calc-s1s2.js');
const calcNpkValueHandler = require('./backend/api/calc-npk-value.js');
const calcAgMgmtHandler   = require('./backend/api/calc-ag-management.js');

const app  = express();
const PORT = process.env.PORT || 3001;

// Parse JSON bodies — cap at 1 MB
app.use(express.json({ limit: '1mb' }));

// API routes
app.post('/api/organism-search',   searchHandler);
app.post('/api/research-organism', researchHandler);
app.post('/api/insert-organism',   insertHandler);

// Calculator routes
app.post('/api/calc/efb-dm',        calcEfbDmHandler);
app.post('/api/calc/opdc-dm',       calcOpdcDmHandler);
app.post('/api/calc/pome-dm',       calcPomeDmHandler);
app.post('/api/calc/gh',            calcGhHandler);
app.post('/api/calc/s1s2',          calcS1S2Handler);
app.post('/api/calc/npk-value',     calcNpkValueHandler);
app.post('/api/calc/ag-management', calcAgMgmtHandler);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() })
);

app.listen(PORT, '127.0.0.1', () =>
  console.log('CFI API server listening on 127.0.0.1:' + PORT)
);
