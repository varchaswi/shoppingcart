var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productCard = new Schema({
    imgLink:{type:String ,required:true},
    title:{type:String ,required:true},
    price:{type:Number,required:true},
    description:{type:String ,required:true},
});

module.exports = mongoose.model('Product',productCard);