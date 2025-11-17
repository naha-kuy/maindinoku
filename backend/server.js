// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // biar bisa baca file .env

const { supabase } = require('./models'); // ambil Supabase client dari models/index.js
const routes = require('./routes'); // ambil routes
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Serve static frontend (kalau ada hasil build frontend di folder public)
app.use('/', express.static(path.join(__dirname, 'public')));

// Debug: cek environment variables
console.log('Database Type: Supabase (PostgreSQL)');
console.log('Supabase URL: https://tpkcideriipovmjluzbx.supabase.co');
console.log('Supabase Key:', process.env.SUPABASE_KEY ? 'Set' : 'Not set (using default)');

async function start() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('players').select('count').limit(1);
    
    if (error) {
      console.error('❌ Unable to connect to Supabase:', error.message);
    } else {
      console.log('✅ Supabase connected');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err.message);
  }
}

start();
