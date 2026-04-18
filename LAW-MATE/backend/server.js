const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// models are imported so sequelize can register them
require('./models/LegalQuery');
require('./models/Scheme');

const legalRoutes = require('./routes/legalRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const datasetRoutes = require('./routes/datasetRoutes');

dotenv.config({ path: __dirname + '/.env' });

const app = express();
app.use(cors());
app.use(express.json());

// basic health endpoint for debugging from the browser or curl
app.get('/api/health', (req, res) => {
  res.send('ok');
});

app.use('/api/legal', legalRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/dataset', datasetRoutes);

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ alter: true }); // alter:true for dev convenience
    console.log('Models synchronized.');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${PORT} in use, trying next port...`);
        const nextPort = Number(PORT) + 1;
        app.listen(nextPort, () => {
          console.log(`Server running on port ${nextPort}`);
        });
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Unable to start server:', err);
  }
}

start();
