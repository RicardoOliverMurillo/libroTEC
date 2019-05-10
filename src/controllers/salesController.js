const Sale = require('../models/sales');

exports.createSale = async (req, res) => {
    const sale = new Sale(req.body);
    await sale.save((err, sale)=>{
        if(err) console.log(err);
        res.send({sale})
    })
}

exports.getSales = async (req, res) => {
    const sale = await Sale.find();
    res.send({sale});
}

exports.deleteSale = async (req, res) => {
    const { id } = req.params;
    await Sale.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.send("deleted");
        }
    });
}

exports.findSale = async (req,res)=>{
    const {id} = req.params;
    await Sale.findById({_id : id}, (err, sale)=>{
        if (err){
            console.log(err);
        } else{
            res.send({sale});
        }
    });
}

exports.updateSale = async (req, res) => {
    const { id } = req.params;
    await Sale.update({_id : id}, req.body, (err)=>{
        if(err) console.log(err);
        res.send('updated')
    })
}