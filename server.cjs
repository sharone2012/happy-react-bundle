'use strict';
require('dotenv').config();

const express = require('express');

const searchHandler   = require('./api/organism-search.cjs');
const researchHandler = require('./api/research-organism.cjs');
const insertHandler   = require('./api/insert-organism.cjs');

const app  = express();
const PORT = process.env.PORT || 3001;

// Parse JSON bodies — cap at 1 MB
app.use(express.json({ limit: '1mb' }));

// API routes
app.post('/api/organism-search',   searchHandler);
app.post('/api/research-organism', researchHandler);
app.post('/api/insert-organism',   insertHandler);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() })
);

app.listen(PORT, '127.0.0.1', () =>
  console.log('CFI API server listening on 127.0.0.1:' + PORT)
);
