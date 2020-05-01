const Category = require('../models/category');

exports.createCategories = (req,res,next) => {
    const { name } = req.body;

    if(!name) {
        res.status(400).send('Name field required');
    }

    Category.findOne({name})
    .then(category => {
        if(category) {
            return res.status(423).send('Category name already exists');
        }

        let newCategory = new Category({name});
        newCategory.save()
        .then(()=> {
            res.status(200).send('Category created successfully');
        })
        .catch(err=> {
            console.log(err);
        })
    })
};

exports.showCategories = (req,res,next) => {
    Category.find({})
    .then((category)=>{
        res.send(category);
    })
};


