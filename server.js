const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
console.log(mongoose.version);
//connexion à la base de données
let db = mongoose.connect('mongodb://localhost:27017/mercibabeth',{useNewUrlParser: true,useUnifiedTopology:true});
mongoose.connection.on("error",function() {
  console.log("Erreur de connexion à la base de données");
})
mongoose.connection.on("open",function() {
  console.log("Connexion réussie");
})
//schémas et modèle
let produitSchema = mongoose.Schema({
  nom_produit: String,
  nom_producteur: String,
  prix: Number,
  categorie: String,
  description: String,
  publication: String,
  mis_en_avant: String,
  reference: String,
  stock: Number,
  unite: String,
  image: String
})

let Produit = mongoose.model("Produit",produitSchema);
//routes
//afficher page d'accueil
app.get('/',function(req,res){
      res.render('index');
})

//afficher page rayons
app.get('/rayons/:nom_rayon',function(req,res){
    let name = req.params.nom_rayon;
//variable de tri pour mettre en premier les produits dont le champ mis_en_avant est à "oui" (après "non" dans l'ordre alphabétique).
    let mysort = {mis_en_avant:-1};
    Produit.find({publication:"oui",categorie:name},function(err,rayon){
        console.log(name);
        console.log(rayon);
        res.render('rayons',{rayon:rayon})
    }).sort(mysort)
})

//afficher page tous nos produits
app.get('/tous_nos_produits',function(req,res){
//tri comme pour le find précédent
  let mysort = {mis_en_avant:-1};
  Produit.find({publication:"oui"},function(err,selection){
    console.log(selection);
    res.render('tous_nos_produits',{selection:selection});
  }).sort(mysort)
})

//affichage page admin
app.get('/admin',function(req,res){
    res.render('admin');
})

//afficher autres pages
app.get('/qui-est-babeth',function(req,res){
    res.render('qui-est-babeth');
})

app.get('/adherer',function(req,res){
    res.render('adherer');
})

app.get('/oubli-motdepasse',function(req,res){
    res.render('oubli-motdepasse');
})

app.get('/cgv',function(req,res){
    res.render('cgv');
})

app.get('/mentions-legales',function(req,res){
    res.render('mentions-legales');
})

app.get('/contact',function(req,res){
    res.render('contact');
})

//gestion du formulaire d'ajout de produits
app.post('/ajout',function(req,res){
  let publie = req.body.ajout_publication;
  if (publie == "on") {
    publie = "oui";
  }
  else {
    publie = "non";
  };

  let avant = req.body.ajout_avant;
  if (avant == "on") {
    avant = "oui";
  }
  else {
    avant = "non";
  };

  let cat = req.body.ajout_categorie;

  let nouveau = new Produit ({nom_produit:req.body.ajout_nom});
  nouveau.nom_producteur = req.body.ajout_producteur;
  nouveau.prix = req.body.ajout_prix;
  nouveau.categorie = cat;
  nouveau.description = req.body.ajout_description;
  nouveau.reference = req.body.ajout_reference;
  nouveau.stock = req.body.ajout_stock;
  nouveau.unite = req.body.ajout_unite;
  nouveau.TVA = req.body.ajout_tva;
  nouveau.image = req.body.ajout_image;
  nouveau.publication = publie;
  nouveau.mis_en_avant = avant;
  //sauvegarder dans la bdd
  nouveau.save();
  console.log(nouveau);
  res.redirect('/rayons/'+ cat)
})




//Gérer erreurs 404
app.use(function(req,res){
  res.setHeader('Content-Type','text/plain');
  res.status(404).send('Page non trouvée. Essaye autre chose !');
})

//port écouté
app.listen(3000);
