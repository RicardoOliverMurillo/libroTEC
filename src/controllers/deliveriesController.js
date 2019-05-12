const Deliveries = require('../models/deliveries');

exports.createDelivery = async (req, res) => {
    const delivery = new Deliveries(req.body);
    await delivery.save((err, delivery)=>{
        if(err) console.log(err);
        res.send({delivery})
    })
}

exports.getDeliveries = async (req, res) => {
    const deliveries = await Deliveries.find();
    res.render('AgentViews/deliveriesListView', {deliveries});
}

exports.deleteDelivery = async (req, res) => {
    const { id } = req.params;
    await Deliveries.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.send("deleted");
        }
    });
}

exports.findDelivery = async (req,res)=>{
    const {id} = req.params;
    await Deliveries.findById({_id : id}, (err, delivery)=>{
        if (err){
            console.log(err);
        } else{
            res.send({delivery});
        }
    });
}

exports.updateDelivery = async (req, res) => {
    const { id } = req.params;
    await Deliveries.update({_id : id}, req.body, (err, delivery)=>{
        if(err) console.log(err);
        res.send('updated')
    })
}