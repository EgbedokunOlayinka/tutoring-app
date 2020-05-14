const Category = require('../models/category');
const Subject = require('../models/subject');


exports.createCategories = (req,res,next) => {
    const { name } = req.body;
    const arr = ['Primary', 'JSS', 'SSS'];

    if(!name) {
        res.status(400).send('Name field required');
    }

    if(arr.includes(name)==false) {
        res.status(400).send('Category can only be Primary, JSS or SSS');
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
    .catch(err=>console.log(err))
};

exports.showCategory = (req,res,next) => {
    let id = req.params.id;
    Category.findOne({_id:id})
    .then((category)=>{
        res.send(category);
    })
    .catch(err=>console.log(err))
};

exports.updateCategory = (req,res,next) => {
    let id = req.params.id;
    let { name } = req.body;

    Category.findByIdAndUpdate(id, {name:name})
    .then((category) => {
        if(category){
            return res.send('Category updated successfully');
        } else {
            res.status(404).send('Category not found');
        }
        
    })
    .catch(err=>console.log(err))
};


exports.deleteCategory = (req,res,next) => {
    let categoryId = req.params.id;

    Category.findById(categoryId)
    .then((category)=>{
        if(!category) {
            res.status(404).send('Category not found')
        } else {
            category.remove((err)=>{
                if(!err) {
                    Subject.deleteMany({category: categoryId})
                    .then(()=>{
                        res.send(category);
                    })
                } else {
                    console.log(err)
                }
            }) 
        }
        
    })
}



