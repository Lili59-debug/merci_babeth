const express = require('express');
const app = express();
const mongoose = require("mongoose");
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
    Produit.find({categorie:name},function(err,rayon){
        console.log(name);
        console.log(rayon);
        res.render('rayons',{rayon:rayon})
    }).sort(mysort)
})

//afficher page tous nos produits
app.get('/tous_nos_produits',function(req,res){
//tri comme pour le find précédent
  let mysort = {mis_en_avant:-1};
  Produit.find({},function(err,selection){
    console.log(selection);
    res.render('tous_nos_produits',{selection:selection});
  }).sort(mysort)
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

//Gérer erreurs 404
app.use(function(req,res){
  res.setHeader('Content-Type','text/plain');
  res.status(404).send('Page non trouvée. Essaye autre chose !');
})

//port écouté
app.listen(3000);
