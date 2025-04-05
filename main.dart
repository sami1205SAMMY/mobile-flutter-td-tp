import 'dart:convert';
import 'package:http/http.dart' as http;

void main() async {
  await passerCommande([
    {
      'nom': 'Pain au chocolat',
      'quantite': 2
    },
    {
      'nom': 'Brioche',
      'quantite': 1
    }
  ]);

  await getCommandes(); // Pour vérifier après
}



  


Future<void> getProduits() async {
  final url = Uri.parse('http://localhost:3000/products');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    List produits = jsonDecode(response.body);
    print('📦 Liste des produits :');
    for (var p in produits) {
      print('→ ${p['nom']} : ${p['prix']} dh | Stock : ${p['stock']}');
    }
  } else {
    print('Erreur lors de la récupération des produits.');
  }
}
Future<void> ajouterProduit(String nom, double prix, int stock, String categorie) async {
  final url = Uri.parse('http://localhost:3000/products');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'nom': nom,
      'prix': prix,
      'stock': stock,
      'categorie': categorie,
    }),
  );

  if (response.statusCode == 201) {
    print('✅ Produit "$nom" ajouté avec succès !');
  } else {
    print('❌ Échec de l\'ajout du produit.');
  }
}
Future<void> getCommandes() async {
  final url = Uri.parse('http://localhost:3000/orders');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    List commandes = jsonDecode(response.body);
    print('\n🧾 Liste des commandes :');

    for (var commande in commandes) {
      print('→ Commande #${commande['id']} - Total : ${commande['total']} dh');
      for (var p in commande['produits']) {
        print('   • ${p['nom']} x ${p['quantite']} @ ${p['prix']} dh');
      }
    }
  } else {
    print('❌ Erreur lors de la récupération des commandes.');
  }
}

Future<void> passerCommande(List<Map<String, dynamic>> produitsCommandes) async {
  final url = Uri.parse('http://localhost:3000/orders');

  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'produitsCommandes': produitsCommandes
    }),
  );

  if (response.statusCode == 201) {
    print('✅ Commande créée avec succès !');
  } else {
    print('❌ Erreur lors de la création de la commande.');
    print(response.body);
  }
}
