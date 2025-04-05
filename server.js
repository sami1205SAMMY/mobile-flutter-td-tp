const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// === Fonctions utilitaires ===

// Produits
const loadProduits = () => JSON.parse(fs.readFileSync('produits.json', 'utf8'));
const saveProduits = (data) => fs.writeFileSync('produits.json', JSON.stringify(data, null, 2));

// Commandes
const loadCommandes = () => JSON.parse(fs.readFileSync('commandes.json', 'utf8'));
const saveCommandes = (data) => fs.writeFileSync('commandes.json', JSON.stringify(data, null, 2));

// === ROUTES ===

// Accueil
app.get('/', (req, res) => {
  res.send('API Backend fonctionne !');
});

// 🔹 GET /products
app.get('/products', (req, res) => {
  const produits = loadProduits();
  res.json(produits);
});

// 🔹 POST /products
app.post('/products', (req, res) => {
  const produits = loadProduits();
  const newProduct = req.body;
  produits.push(newProduct);
  saveProduits(produits);
  res.status(201).send('Produit ajouté');
});

// 🔹 GET /orders
app.get('/orders', (req, res) => {
  const commandes = loadCommandes();
  res.json(commandes);
});

// 🔹 POST /orders - création intelligente
app.post('/orders', (req, res) => {
  const produits = loadProduits();
  const commandes = loadCommandes();
  const { produitsCommandes } = req.body;

  if (!produitsCommandes || produitsCommandes.length === 0) {
    return res.status(400).json({ error: 'CommandeVideException' });
  }

  let total = 0;
  let produitsFinal = [];

  for (const item of produitsCommandes) {
    const produit = produits.find(p => p.nom === item.nom);
    if (!produit || produit.stock < item.quantite) {
      return res.status(400).json({ error: `StockInsuffisantException: ${item.nom}` });
    }

    produit.stock -= item.quantite;

    produitsFinal.push({
      nom: produit.nom,
      quantite: item.quantite,
      prix: produit.prix
    });

    total += produit.prix * item.quantite;
  }

  const nouvelleCommande = {
    id: commandes.length + 1,
    produits: produitsFinal,
    total
  };

  commandes.push(nouvelleCommande);
  saveCommandes(commandes);
  saveProduits(produits);

  res.status(201).json({ message: 'Commande ajoutée', commande: nouvelleCommande });
});

// 🟢 Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur API démarré sur http://localhost:${port}`);
});
