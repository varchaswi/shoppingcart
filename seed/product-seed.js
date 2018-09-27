var Product = require('../models/product');

var mongoose = require('mongoose');

var mongoDB = 'mongodb://super:1supers@ds153732.mlab.com:53732/testtutor';

mongoose.connect(mongoDB,{ useNewUrlParser: true });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var products = [new Product({
    imgLink:'http://www.fashiontrends.pk/wp-content/uploads/2011/07/Beautifully-Enameled-Kurki-Bangle.jpg',
    price:12,
    description:'Beautifully-Enameled-Kurki-Bangle',
    title:'Golden Horse'
}),
    new Product({
    imgLink:'http://n1.sdlcdn.com/imgs/a/1/4/Luxor-Floral-Golden-Kundan-Designer-SDL404057545-1-7e782.jpg',
    price:12,
    description:'Floral-Kundan-Designer',
    title:'Golden Flower'
}),
    new Product({
    imgLink:'http://www.grtjewels.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/g/b/gb_31_1/dazzling-sameena-gold-bangles-31.jpg',
    price:12,
    description:'A must have',
    title:'Dazzling-sameena'
})];

db.once('open', function() {
    // we're connected!
    console.log("open");
    var done = 0;
  for(var i = 0; i < products.length;i++){
      products[i].save(function(err,result){
          done++;
          if(done === products.length){
             exit();          
          }
      });
  }
  });

function exit(){
    mongoose.connection.close();
}