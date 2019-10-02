# Rapports comptables pour OHADA-RDC

L'App Banana [Rapports comptables (OHADA - RDC)](https://www.banana.ch/apps/fr/node/9093) crée un rapport avec les trois documents suivants
* Bilan
* Compte de Résultat 
* Flux de Trésorerie

L'application a été développée en suivant les documentations spécifiques OHADA-RDC :
* [Documentation concernant le Bilan](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/balancesheet/balancesheet_documentation.pdf)
* [Documentation concernant le Compte de Résultat](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/profitlossstatement/profitlosstatement_documentation.pdf)
* [Documentation concernant le Flux de Trésorerie](https://github.com/BananaAccounting/CongoRDC/blob/master/reports/statements/cashflow/cashflow_documentation.pdf)

Dans la documentation, la syntaxe utilisée pour spécifier les données à utiliser est **{compte/groupe,colonne}**, où:
* **compte/groupe**: indique le compte ou le groupe du tableau Comptes dans Banana (les groupes commencent avec **Gr=**) ;
* **colonne**: indique le type de données (Ouverture, Débit, Crédit, Total(débit-crédit)) du tableau Comptes dans Banana ;
* **(-1)**: indique que la valeur doit être inversée. Si positif, inverse à une valeur négative, si négatif, inverse à une valeur positive.

Fichiers JavaScript :
* [Fichier JavaScript Bilan](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/balancesheet/ch.banana.africa.balancesheetrdc.js)
* [Fichier JavaScript Compte de Résultat](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/profitlossstatement/ch.banana.africa.profitlossstatementrdc.js)
* [Fichier JavaScript Flux de Trésorerie](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/cashflow/ch.banana.africa.cashflowrdc.js)


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

Le fichier de l'année précédente n'est utilisé que pour le rapport des flux de trésorerie.
Il est facultatif : si le fichier de l'année précédente est sélectionné, il est utilisé pour calculer puis insérer dans le rapport les données dans la colonne EXERCICE N-1. Si aucun fichier n'est sélectionné, la colonne EXERCICE N-1 sera vide.

## Comment cela fonctionne

### Installer le BananaApp:
* Démarrer Banana Comptabilité.
* Installer le BananaApp **Rapports Comptables (OHADA - RDC)**. Consulter la documentation [Menu Apps](https://www.banana.ch/doc9/fr/node/4727).

### Run the BananaApp:
* Open your accounting file with Banana.
* In Banana select from the **menu Apps** the BananaApp **Accounting Reports (OHADA - RDC)** then **Balance Sheet, Profit/Loss Statement, Cash Flow**.
* Check the results.

Active Balance Sheet Report example:
![Active Balance Sheet Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/balancesheet/images/balancesheet_active_report.png)

Passive Balance Sheet Report example:
![Passive Balance Sheet Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/balancesheet/images/balancesheet_passive_report.png)

Profit/Loss Statement Report example:
![Profit/Loss Statement Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/profitlossstatement/images/profitlossstatement_report.png)

Cash Flow Report example:
![Cash Flow Report Example](https://raw.githubusercontent.com/BananaAccounting/CongoRDC/master/reports/statements/cashflow/images/banana_report.png)

# Releases history
2019-09-23
* Update Banana Accounting file .ac2 templates.
* Update Cash Flow, changed all formulas using only groups. Accounts are not used anymore.

2019-05-27
* Update Cash Flow, changed FH,FJ,FO and FQ formulas.

2019-05-21
* Update Cash Flow, changed FD,FE,FG,FH,FK,FL and FO formulas.

2019-04-01
* Update Cash Flow, changed FD and FE formulas

2019-02-15
* Update Cash Flow, changed FD,FF,FG and FN formulas.
* Changed header information on the reports.

2019-02-11
* Update Cash Flow, changed FD,FJ,FK and FE formulas.
* Added company and address information on the reports.

2019-01-21
* Update Cash Flow, changed ZC formula.

2019-01-14
* Update Cash Flow with new formulas.