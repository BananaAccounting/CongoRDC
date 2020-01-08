// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.africa.accountsbalances
// @api = 1.0
// @pubdate = 2020-01-07
// @publisher = Banana.ch SA
// @description = Balance des comptes [BETA]
// @description.fr = Balance des comptes [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
 *  This Banana Extension creates a report with balances for each account:
 *  - opening balances (debit/credit)
 *  - movements balances (debit/credit)
 *  - closing balances (debit/credit)
 */

function exec() {

  // CURRENT year file: the current opened document in Banana */
  var current = Banana.document;
  if (!current) {
    return "@Cancel";
  }

  var userParam = initUserParam();
  var savedParam = Banana.document.getScriptSettings();
  if (savedParam && savedParam.length > 0) {
    userParam = JSON.parse(savedParam);
  }

  // If needed show the settings dialog to the user
  if (!options || !options.useLastSettings) {
    userParam = settingsDialog(); // From properties
  }

  if (!userParam) {
    return "@Cancel";
  }

  var form = getAccounts(current);
  var report = createAccountsBalancesReport(current, userParam.selectionStartDate, userParam.selectionEndDate, form, userParam);
  var stylesheet = createStyleSheet(userParam);
  Banana.Report.preview(report, stylesheet);
}

/**************************************************************************************
* Functions that create the report
**************************************************************************************/
function createAccountsBalancesReport(current, currentStartDate, currentEndDate, form, userParam) {

  // var currentStartDate = current.info("AccountingDataBase","OpeningDate");
  // var currentEndDate = current.info("AccountingDataBase","ClosureDate");
  var currentYear = Banana.Converter.toDate(currentStartDate).getFullYear();
  var previousYear = currentYear-1;
  var company = current.info("AccountingDataBase","Company");
  var address = current.info("AccountingDataBase","Address1");
  var city = current.info("AccountingDataBase","City");
  var state = current.info("AccountingDataBase","State");
  var months = monthDiff(Banana.Converter.toDate(currentEndDate), Banana.Converter.toDate(currentStartDate));
  var fiscalNumber = current.info("AccountingDataBase","FiscalNumber");
  var vatNumber = current.info("AccountingDataBase","VatNumber");

  if (!report) {
    var report = Banana.Report.newReport("Balance des comptes");
  }

  // Header of the report
  var table = report.addTable("table");
  var col1 = table.addColumn("c1");
  var col2 = table.addColumn("c2");
  var tableRow;
  tableRow = table.addRow();
  tableRow.addCell(company,"bold",1);
  tableRow.addCell("Exercice clos le " + Banana.Converter.toLocaleDateFormat(currentEndDate), "",1);
  tableRow = table.addRow();
  tableRow.addCell(address + " - " + city + " - " + state, "", 1);
  tableRow.addCell("Durée (en mois) " + months, "", 1);   

  report.addParagraph(" ", "");
  report.addParagraph(" ", "");
  report.addParagraph(" ", "");
  report.addParagraph(userParam.title,"bold center");
  report.addParagraph(" ", "");

  // Table with cash flow data
  var table = report.addTable("tableActiveBalanceSheet");
  var col1 = table.addColumn("col1");
  var col2 = table.addColumn("col2");
  var col3 = table.addColumn("col3");
  var col4 = table.addColumn("col4");
  var col5 = table.addColumn("col5");
  var col6 = table.addColumn("col6");
  var col7 = table.addColumn("col7");
  var col8 = table.addColumn("col8");
  var col9 = table.addColumn("col9");
  var tableRow;

  var totalAmountOpeningDebit = "";
  var totalAmountOpeningCredit = "";
  var totalAmountMovementDebit = "";
  var totalAmountMovementCredit = "";
  var totalAmountClosureDebit = "";
  var totalAmountClosureCredit = "";

  tableRow = table.addRow();
  tableRow.addCell("Réf","bold center borderTop borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("N° des comptes","bold center borderTop borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Intitulés Comptes","bold center borderTop borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Soldes à l'ouverture","bold center borderTop borderLeft borderRight paddingBottom paddingTop",2);
  tableRow.addCell("Mouvement","bold center borderTop borderLeft borderRight paddingBottom paddingTop",2);
  tableRow.addCell("Soldes à la clôture","bold center borderTop borderLeft borderRight paddingBottom paddingTop",2);

  tableRow = table.addRow();
  tableRow.addCell("","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Débiteur ","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Créditeur ","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Débit ","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Crédit ","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Débiteur ","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell("Créditeur ","bold center borderBottom borderLeft borderRight paddingBottom paddingTop",1);

  var len = form.length;
  for (var i = 0; i < len; i++) {
    
    var amountOpeningDebit = "";
    var amountOpeningCredit = "";
    var amountMovementDebit = "";
    var amountMovementCredit = "";
    var amountClosureDebit = "";
    var amountClosureCredit = "";

    /* Opening amounts: debit if > 0; credit if < 0*/
    var tmpOpening = getAmount(current, form[i].account,'opening', currentStartDate, currentEndDate);
    if (Banana.SDecimal.sign(tmpOpening) > 0) {
       amountOpeningDebit = tmpOpening;
    } 
    else if (Banana.SDecimal.sign(tmpOpening) < 0) {
       amountOpeningCredit = Banana.SDecimal.abs(tmpOpening);
    }

    /* Movements */
    var transTab = current.currentCard(form[i].account, currentStartDate, currentEndDate);
    var tmpMovementBalance = "";
    for (var j = 0; j < transTab.rowCount; j++) {
       var tRow = transTab.row(j);
       amountMovementDebit = tRow.value("JDebitAmountAccountCurrency");
       amountMovementCredit = tRow.value("JCreditAmountAccountCurrency");
       tmpMovementBalance = tRow.value("JBalanceAccountCurrency");
    }
    if (Banana.SDecimal.sign(tmpMovementBalance) > 0) {
       amountClosureDebit = tmpMovementBalance;
    }
    else if (Banana.SDecimal.sign(tmpMovementBalance) < 0) {
       amountClosureCredit = Banana.SDecimal.abs(tmpMovementBalance);
    }

    tableRow = table.addRow();
    tableRow.addCell(form[i].gr,"borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(form[i].account,"right borderLeft borderRight paddingBottom paddingTop",1);
    // if(userParam.characters_number > 0 && form[i].description.length > userParam.characters_number) {
    //    tableRow.addCell(form[i].description.substring(0,userParam.characters_number),"borderLeft borderRight paddingBottom paddingTop",1);
    // } else {
    //    tableRow.addCell(form[i].description,"borderLeft borderRight paddingBottom paddingTop",1);
    // }
    tableRow.addCell(form[i].description,"borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(formatValues(amountOpeningDebit),"right borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(formatValues(amountOpeningCredit),"right borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(formatValues(amountMovementDebit),"right borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(formatValues(amountMovementCredit),"right borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(formatValues(amountClosureDebit),"right borderLeft borderRight paddingBottom paddingTop",1);
    tableRow.addCell(formatValues(amountClosureCredit),"right borderLeft borderRight paddingBottom paddingTop",1);

    /* Calculate totals */
    totalAmountOpeningDebit = Banana.SDecimal.add(totalAmountOpeningDebit, amountOpeningDebit);
    totalAmountOpeningCredit = Banana.SDecimal.add(totalAmountOpeningCredit, amountOpeningCredit);
    totalAmountMovementDebit = Banana.SDecimal.add(totalAmountMovementDebit, amountMovementDebit);
    totalAmountMovementCredit = Banana.SDecimal.add(totalAmountMovementCredit, amountMovementCredit);
    totalAmountClosureDebit = Banana.SDecimal.add(totalAmountClosureDebit, amountClosureDebit);
    totalAmountClosureCredit = Banana.SDecimal.add(totalAmountClosureCredit, amountClosureCredit);

  }

  /* Totals */
  tableRow = table.addRow();
  tableRow.addCell("","",1);
  tableRow.addCell("","",1);
  tableRow.addCell("","",1);
  tableRow.addCell(formatValues(totalAmountOpeningDebit),"right bold borderTop borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell(formatValues(totalAmountOpeningCredit),"right bold borderTop borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell(formatValues(totalAmountMovementDebit),"right bold borderTop borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell(formatValues(totalAmountMovementCredit),"right bold borderTop borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell(formatValues(totalAmountClosureDebit),"right bold borderTop borderBottom borderLeft borderRight paddingBottom paddingTop",1);
  tableRow.addCell(formatValues(totalAmountClosureCredit),"right bold borderTop borderBottom borderLeft borderRight paddingBottom paddingTop",1);

  /* Check results */
  if (Banana.SDecimal.compare(totalAmountOpeningDebit, totalAmountOpeningCredit) != 0) {
    Banana.document.addMessage("Soldes à l'ouverture débiteur/crediteur différents");
  }
  if (Banana.SDecimal.compare(totalAmountMovementDebit, totalAmountMovementCredit) != 0) {
    Banana.document.addMessage("Soldes des mouvements débit/credit différents");
  }
  if (Banana.SDecimal.compare(totalAmountClosureDebit, totalAmountClosureCredit) != 0) {
    Banana.document.addMessage("Soldes à la clôture débiteur/crediteur différents");
  }

  /* Footer */
  report.getFooter().addClass("footer");
  report.getFooter().addParagraph(" ", "");
  report.getFooter().addParagraph(" ", "");
  report.getFooter().addText(" - " , "footer");
  report.getFooter().addFieldPageNr();
  report.getFooter().addText(" - " , "footer");

  return report;
}

function getAccounts(banDoc) {
  var form = [];
  var accountsTable = banDoc.table("Accounts");
  var accountsTableRows = accountsTable.rowCount;

  for (var i = 0; i < accountsTableRows; i++) {
    var tRow = accountsTable.row(i);
    var account = tRow.value("Account");
    var description = tRow.value("Description");
    var gr = tRow.value("Gr");
    var bclass = tRow.value("BClass");

    if (account && account.substring(0,1) !== "." && account.substring(0,1) !== "," && account.substring(0,1) !== ";" && account.substring(0,1) !== ":") {
       form.push({
          "gr" : gr,
          "account" : account,
          "description" : description,
          "bclass" : bclass
       });
    }
  }

  form.sort(function(a, b){
    return a.account-b.account;
  })

  return form;
}

function monthDiff(d1, d2) {
  if (d2 < d1) { 
    var dTmp = d2;
    d2 = d1;
    d1 = dTmp;
  }
  var months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth(); //+1
  months += d2.getMonth();

  if (d1.getDate() <= d2.getDate()) {
    months += 1;
  }
  return months;
}

function getAmount(banDoc,account,property,startDate,endDate) {
  var currentBal = banDoc.currentBalance(account,startDate,endDate)
  var value = currentBal[property];
  return value;
}

function formatValues(value) {
  if (!value || value === "0" || value == null) {
    value = "0";
  }
  return Banana.Converter.toLocaleNumberFormat(value);
}

/**************************************************************************************
* Functions to manage the parameters
**************************************************************************************/
function convertParam(userParam) {

  var convertedParam = {};
  convertedParam.version = '1.0';
  convertedParam.data = [];

  var currentParam = {};
  currentParam.name = 'title';
  currentParam.title = 'Titre';
  currentParam.type = 'string';
  currentParam.value = userParam.title ? userParam.title : '';
  currentParam.defaultvalue = 'Balance des comptes';
  currentParam.readValue = function() {
      userParam.title = this.value;
  }
  convertedParam.data.push(currentParam);

  // var currentParam = {};
  // currentParam.name = 'characters_number';
  // currentParam.title = 'Nombre de caractères pour la description';
  // currentParam.type = 'string';
  // currentParam.value = userParam.characters_number ? userParam.characters_number : '41';
  // currentParam.defaultvalue = '41';
  // currentParam.readValue = function() {
  //     userParam.characters_number = this.value;
  // }
  // convertedParam.data.push(currentParam);

  var currentParam = {};
  currentParam.name = 'amount_columns_width';
  currentParam.title = 'Largeur des colonnes montants (défaut 15%)';
  currentParam.type = 'string';
  currentParam.value = userParam.amount_columns_width ? userParam.amount_columns_width : '15%';
  currentParam.defaultvalue = '15%';
  currentParam.readValue = function() {
      userParam.amount_columns_width = this.value;
  }
  convertedParam.data.push(currentParam);

  var currentParam = {};
  currentParam.name = 'margins';
  currentParam.title = 'Marges (haut, droite, bas, gauche)';
  currentParam.type = 'string';
  currentParam.value = userParam.margins ? userParam.margins : '10mm 10mm 10mm 10mm';
  currentParam.defaultvalue = '10mm 10mm 10mm 10mm';
  currentParam.readValue = function() {
      userParam.margins = this.value;
  }
  convertedParam.data.push(currentParam);

  return convertedParam;
}

function initUserParam() {
  var userParam = {};
  userParam.title = "Balance des comptes";
  //userParam.characters_number = "41";
  userParam.amount_columns_width = "15%";
  userParam.margins = "10mm 10mm 10mm 10mm";
  return userParam;
}

function parametersDialog(userParam) {
  if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
      var dialogTitle = "Paramètres";
      var convertedParam = convertParam(userParam);
      var pageAnchor = 'dlgSettings';
      if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
          return null;
      }
      
      for (var i = 0; i < convertedParam.data.length; i++) {
          // Read values to userParam (through the readValue function)
          convertedParam.data[i].readValue();
      }
      
      //  Reset reset default values
      userParam.useDefaultTexts = false;
  }

  return userParam;
}

function settingsDialog() {
  var scriptform = initUserParam();
  var savedParam = Banana.document.getScriptSettings();
  if (savedParam && savedParam.length > 0) {
      scriptform = JSON.parse(savedParam);
  }

  //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
  var docStartDate = Banana.document.startPeriod();
  var docEndDate = Banana.document.endPeriod();   
  
  //A dialog window is opened asking the user to insert the desired period. By default is the accounting period
  var selectedDates = Banana.Ui.getPeriod('', docStartDate, docEndDate, 
     scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);
      
  //We take the values entered by the user and save them as "new default" values.
  //This because the next time the script will be executed, the dialog window will contains the new values.
  if (selectedDates) {
      scriptform["selectionStartDate"] = selectedDates.startDate;
      scriptform["selectionEndDate"] = selectedDates.endDate;
      scriptform["selectionChecked"] = selectedDates.hasSelection;    
  } else {
      //User clicked cancel
      return null;
  }

  scriptform = parametersDialog(scriptform); // From propertiess
  if (scriptform) {
      var paramToString = JSON.stringify(scriptform);
      Banana.document.setScriptSettings(paramToString);
  }
  
  return scriptform;
}

/**************************************************************************************
* Function for the styles
**************************************************************************************/
function createStyleSheet(userParam) {
  var stylesheet = Banana.Report.newStyleSheet();

  stylesheet.addStyle("@page", "margin:"+userParam.margins);
  stylesheet.addStyle("body", "font-family:Helvetica; font-size:8pt");
  stylesheet.addStyle(".bold", "font-weight:bold;");
  stylesheet.addStyle(".right", "text-align:right;");
  stylesheet.addStyle(".center", "text-align:center");
  stylesheet.addStyle(".footer", "font-size:8pt;text-align:center");

  stylesheet.addStyle(".borderTop","border-top:thin solid black;");
  stylesheet.addStyle(".borderBottom","border-bottom:thin solid black;");
  stylesheet.addStyle(".borderLeft","border-left:thin solid black;");
  stylesheet.addStyle(".borderRight","border-right:thin solid black;");
  stylesheet.addStyle(".paddingBottom","padding-bottom:2px;");
  stylesheet.addStyle(".paddingTop","padding-top:5px");

  /* table for header */
  var tableStyle = stylesheet.addStyle(".table");
  tableStyle.setAttribute("width", "100%");
  stylesheet.addStyle(".c1", "");
  stylesheet.addStyle(".c2", "");
  stylesheet.addStyle("table.table td", "");

  /* table for data */
  var tableStyle = stylesheet.addStyle(".tableActiveBalanceSheet");
  tableStyle.setAttribute("width", "100%");
  stylesheet.addStyle(".col1", "width:5%");
  stylesheet.addStyle(".col2", "width:7%");
  stylesheet.addStyle(".col3", "width:40%");
  stylesheet.addStyle(".col4", "width:"+userParam.amount_columns_width);
  stylesheet.addStyle(".col5", "width:"+userParam.amount_columns_width);
  stylesheet.addStyle(".col6", "width:"+userParam.amount_columns_width);
  stylesheet.addStyle(".col7", "width:"+userParam.amount_columns_width);
  stylesheet.addStyle(".col8", "width:"+userParam.amount_columns_width);
  stylesheet.addStyle(".col9", "width:"+userParam.amount_columns_width);
  stylesheet.addStyle("table.tableActiveBalanceSheet td", "padding-bottom:2px;padding-top:5px");

  return stylesheet;
}