//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
var multer  = require('multer')



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, 'minegocio-' + Date.now() + "_" + file.originalname)
  }
});

var upload = multer({ storage: storage })

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Localhost
mongoose.connect("mongodb://localhost:27017/mitienda", {useNewUrlParser: true, useUnifiedTopology: true});
//Cloud Atlas
//mongoose.connect("mongodb+srv://charlie:Pum45Un4m@cluster0-s0xif.mongodb.net/todolistDB", {useNewUrlParser: true});

console.log(__dirname);


const tiendasSchema = {
  name: String,
  description: String,
  phone: String,
  whatsapp: String,
  imagen: String,
  status: String 
};

const Tienda = mongoose.model("Tienda", tiendasSchema);

// const tienda1 = new Tienda ({
//   name: "El Infiernito",
//   description: "Bar con vista al mar.",
//   phone: "12345",
//   whatspp: "67890",
//   imagen: "ninjutsu.png",
//   status: "aprobado"
// });

// const defaultTiendas = [tienda1];

const listSchema = {
  name: String,
  tiendas: [tiendasSchema]
};

const List = mongoose.model("List", listSchema);

// const list = new List({
//   name: "Cuajimalpa",
//   tiendas: defaultTiendas
// });
// list.save();

app.get("/", function(req, res) {

  res.redirect("/cuajimalpa");

});

app.get("/altanegocio", function(req, res) {

  res.render("altanegocio");

});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
          res.redirect("/");
      } else{
        //Show an existing list
        res.render("tiendas", {listTitle: foundList.name, newListTiendas: foundList.tiendas});
      }
    } 
  });
});


app.post("/altanegocio",  upload.single('avatar'), function (req, res, next) {
  
  console.log(req.file);
  console.log(req.file.filename);
  console.log(req.body.list);
  
  //next();

  const tiendaName = req.body.nombre;
  const tiendaDescription = req.body.descripcion;
  const tiendaPhone = req.body.telefono;
  const tiendaMobile = req.body.celular;
  const tiendaList = req.body.list;
  const tiendaMenu = req.file.filename;

  const tienda = new Tienda ({
    name: tiendaName,
    description: tiendaDescription,
    phone: tiendaPhone,
    whatsapp: tiendaMobile,
    imagen: tiendaMenu,
    status: "aprobado"
  });

  List.findOne({name: tiendaList}, function(err, foundList){
    if(!err){
        foundList.tiendas.push(tienda);
        foundList.save();
        res.redirect("/" + tiendaList);
      } else{
        console.log(err);
        
      }
  });
  


});

app.post("/delete", function(req, res){
  
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
