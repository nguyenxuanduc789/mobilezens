const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const concentDb = require('./config/db');
const JokesRouter = require('./routes/Jokesroutes');
concentDb();
app.use(cors());
app.use('/jokes/getallcontent', JokesRouter);
app.listen(port, () => console.log(`App listening at http://192.168.164.1:${port}`));

