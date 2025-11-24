const express = require('express');
const cors = require('cors');

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(cors({origin:'*'}))

//routes
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log("server running on port 3000")
});
