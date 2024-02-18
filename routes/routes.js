const express = require('express');
const router =  express.Router();
const User = require('../models/users');
const Products = require('../models/products');

const multer = require('multer');
const fs = require('fs');
const mainController = require('../controllers/mainController');

// Image upload
var storage = multer.diskStorage({
    destination: function(req, ftle, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

// Insert usertabase
router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});

// GEt all user route
router.get('/', async (req, res) => {
    try {
        // Fetch data from MongoDB using Mongoose
        const users = await User.find();

        // Pass the data to the index page
        res.render('index', { users, title: 'User List' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get("/add", (req, res) => {
    res.render('add_users', {title: "Add User"});
});

// Edit user
router.get("/edit/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            res.redirect('/');
        } else {
            res.render("edit_users", {
                title: "Edit User",
                user: user,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user data
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        const result = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });
        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Delete user data
router.get("/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findByIdAndDelete(id);

        req.session.message = {
            type: 'success',
            message: 'User data deleted successfully',
        };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});


// For products

// Call a view file
router.get("/add-products", mainController.addProduct);

// To add products
  router.post('/add-product', upload, (req, res) => {
    const products = new Products({
        p_name: req.body.p_name,
        p_id: req.body.p_id,
        price: req.body.price,
    });
    products.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            res.redirect("/");
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});




module.exports = router;