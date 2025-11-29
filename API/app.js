require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const auth = require('./middleware/auth');

//middleware
app.use(express.json());
app.use(cors());
app.use(cors({origin:'*'}))

// Rutas públicas
app.use('/auth', require('./routes/auth')); // login y verify accesibles

// Rutas protegidas: requieren token
app.use('/products', auth, require('./routes/products'));
app.use('/cart', auth, require('./routes/cart'));
app.use('/users', auth, require('./routes/users'));

app.listen(3000, () => {
    console.log("server running on port 3000")
});
