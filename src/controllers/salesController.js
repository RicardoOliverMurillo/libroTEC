const Sale = require('../models/sales');

exports.createSale = async (req, res) => {
    const sale = new Sale(req.body);
    await sale.save((err, sale)=>{
        if(err) console.log(err);
        res.redirect('/sales')
    })
}

exports.getSales = async (req, res) => {
    const sales = await Sale.find();
    res.render('AdminViews/salesView', {sales});
}

exports.deleteSale = async (req, res) => {
    const { id } = req.params;
    await Sale.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/sales');
        }
    });
}

exports.findSale = async (req,res)=>{
    const {id} = req.params;
    await Sale.findById({_id : id}, (err, sale)=>{
        if (err){
            console.log(err);
        } else{
            res.render('AdminViews/updateSaleView', {sale});
        }
    });
}

exports.updateSale = async (req, res) => {
    const { id } = req.params;
    await Sale.update({_id : id}, req.body, (err)=>{
        if(err) console.log(err);
        res.redirect('/sales');
    })
}