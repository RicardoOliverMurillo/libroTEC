const Library = require('../models/libraries');

exports.createLibrary = async (req, res) => {
    const library = new Library(req.body);
    await library.save((err, library)=>{
        if(err) console.log(err);
        res.redirect ("/libraries")
    })
}

exports.getLibraries = async (req, res) => {
    const library = await Library.find();
    res.render("AdminViews/librariesView", {library});
}

exports.deleteLibrary = async (req, res) => {
    const { id } = req.params;
    await Library.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/libraries");
        }
    });
}

exports.findLibrary = async (req,res)=>{
    const {id} = req.params;
    await Library.findById({_id : id}, (err, library)=>{
        if (err){
            console.log(err);
        } else{
            res.render("AdminViews/updateLibraryView",{library});
        }
    });
}

exports.updateLibrary = async (req, res) => {
    const { id } = req.params;
    await Library.update({_id : id}, req.body, (err, book)=>{
        if(err) console.log(err);
        res.redirect("/libraries")
    })
}