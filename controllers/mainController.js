const Product = require('../models/products');

const mainController = {
    addProduct: async (req, res) => {
        res.render('add_product', {title: "Add Product"});
    },

    
};



module.exports = mainController;
