const connectToMongo=require("./db");
const cookieParser = require('cookie-parser');
const express = require('express');
var cors=require('cors')
connectToMongo();

const app = express()
const port = 5000

app.use(cookieParser())
app.use(cors())
app.use(express.json())


//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/project',require('./routes/project'))


app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})
 
