Rapports comptables multi-devise OHADA RDC

L'App Banana Rapports comptables multi-devise (OHADA - RDC)crée un rapport avec les trois documents suivants: 
* Bilan Multi-devise
* Compte de Résultat Multi-devise
* Flux de Trésorerie Multi-devise

L'application a été développée en suivant les documentations spécifiques OHADA-RDC :
* [Documentation concernant le Bilan](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/balancesheet/balancesheet_documentation.pdf)
* [Documentation concernant le Compte de Résultat](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/profitlossstatement/profitlosstatement_documentation.pdf)
* [Documentation concernant le Flux de Trésorerie](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/cashflow/cashflow_documentation.pdf)


Dans la documentation, la syntaxe utilisée pour spécifier les données à utiliser est **{compte/groupe,colonne}**, où:
* **compte/groupe**: indique le compte ou le groupe du tableau Comptes dans Banana (les groupes commencent avec **Gr=**) ;
* **colonne**: indique le type de données (Ouverture, Débit, Crédit, Total(débit-crédit)) du tableau Comptes dans Banana ;
* **(-1)**: indique que la valeur doit être inversée. Si positif, inverse à une valeur négative, si négatif, inverse à une valeur positive.

Fichiers JavaScript :


## Configurations fichier Banana Comptabilité
Dans Banana sélectionnez dans le menu **Fichier** la commande **Propriétés...**
### Adresse
* Sélectionnez la section **Adresse**.
* Insérez le **nom de la société** dans le champ Société.
* Insérez le **Désignation du numéro de l'entité** dans le champ Numéro fiscal.
* Insérez le **Numéro d'identification** dans le champ Numéro de TVA.

Les données insérées seront utilisées pour remplir l'en-tête du rapport.

### Options
* Sélectionnez la section **Options**.
* Insérez le **fichier de l'année précédente**. 

**N.B. :** 
Le fichier de l'année précédente doit aussi être multi-devise.
Le fichier de l'année précédente n'est utilisé que pour le rapport des flux de trésorerie.
Il est facultatif : si le fichier de l'année précédente est sélectionné, il est utilisé pour calculer puis insérer dans le rapport les données dans la colonne EXERCICE N-1. Si aucun fichier n'est sélectionné, la colonne EXERCICE N-1 sera vide.

## Comment cela fonctionne?

