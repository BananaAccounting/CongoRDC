// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//  http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.africa.minprofitloss
// @api = 1.0
// @pubdate = 2021-01-22
// @publisher = Banana.ch SA
// @description = 2. Compte de résultat (SMT)
// @task = app.command
// @doctype = 100.100;110.100;130.100
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @includejs = reportstructure.js
// @includejs = breport.js
// @includejs = errors.js


/*

   

*/


var BAN_VERSION = "10.0.1";
var BAN_EXPM_VERSION = "";


//Main function
function exec(string) {

   //Check if we are on an opened document
   if (!Banana.document) {
      return;
   }

   //Check the banana version
   var isCurrentBananaVersionSupported = bananaRequiredVersion(BAN_VERSION, BAN_EXPM_VERSION);
   if (!isCurrentBananaVersionSupported) {
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

   /**
    * 1. Loads the report structure
    */
   var reportStructure = createReportStructureProfitLoss();

   /**
    * 2. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   const bReport = new BReport(Banana.document, userParam, reportStructure);
   bReport.validateGroups(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount"]);
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   /**
    * 3. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printprofitlossstatement(Banana.document, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);

   Banana.Report.preview(report, stylesheet);
}

function printprofitlossstatement(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Compte de résultat");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));

   var company = banDoc.info("AccountingDataBase","Company");
   var address1 = banDoc.info("AccountingDataBase","Address1");
   var zip = banDoc.info("AccountingDataBase","Zip");
   var city = banDoc.info("AccountingDataBase","City");
   var state = banDoc.info("AccountingDataBase","State");
   var email = banDoc.info("AccountingDataBase","Email");

   
   /**************************************************************************************
   * COMPTE DE RÉSULTAT
   **************************************************************************************/
    var table = report.addTable("table");
    var column1 = table.addColumn("column1");
    var column2 = table.addColumn("column2");
    var column3 = table.addColumn("column3");

    var tableRow = table.addRow(); 
    tableRow.addCell(company, "bold", 1);
    tableRow.addCell("Exercice clos le " + Banana.Converter.toLocaleDateFormat(endDate), "", 2);
    tableRow = table.addRow();
    tableRow.addCell(address1 + " - " + city + " - " + state, "", 1);
    tableRow.addCell("Durée (en mois) " + months, "", 2);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("COMPTE DE RÉSULTAT AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

    // Profit & Loss table
   var table = report.addTable("table-profit-loss");
   var columnProfitLoss1 = table.addColumn("column-profit-loss1");
   var columnProfitLoss2 = table.addColumn("column-profit-loss2");
   var columnProfitLoss3 = table.addColumn("column-profit-loss3");
   var columnProfitLoss4 = table.addColumn("column-profit-loss4");
   var columnProfitLoss5 = table.addColumn("column-profit-loss5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5).setStyleAttributes("border:thin solid white");
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5).setStyleAttributes("border-left:thin solid white;border-right:thin solid white");

   tableRow = table.addRow();
   tableRow.addCell("Nº","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-bottom:thin solid white;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("RUBRIQUES","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-bottom:thin solid white;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NOTE","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-bottom:thin solid white;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid white;padding-bottom:2px;padding-top:5px;padding-left:77px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   
   tableRow = table.addRow();
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + currentYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE " + previousYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* 10 */   
   tableRow = table.addRow();
   tableRow.addCell("10", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("10"), "align-left", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("10"), "align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell(Banana.SDecimal.invert(bReport.getObjectValue("10", "currentAmount")), "align-right", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell(Banana.SDecimal.invert(bReport.getObjectValue("10", "previousAmount")), "align-right", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");

   /* 11 */
   tableRow = table.addRow();
   tableRow.addCell("11", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("11"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("11"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(Banana.SDecimal.invert(bReport.getObjectValue("11", "currentAmount")), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(Banana.SDecimal.invert(bReport.getObjectValue("11", "previousAmount")), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 4 */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("4"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("4"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(Banana.SDecimal.invert(bReport.getObjectValue("4", "currentAmount")), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(Banana.SDecimal.invert(bReport.getObjectValue("4", "previousAmount")), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 12 */
   tableRow = table.addRow();
   tableRow.addCell("12", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("12"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("12"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("12"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("12"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 13 */
   tableRow = table.addRow();
   tableRow.addCell("13", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("13"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("13"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("13"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("13"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   
   /* 14 */
   tableRow = table.addRow();
   tableRow.addCell("14", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("14"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("14"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("14"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("14"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   
   /* 15 */
   tableRow = table.addRow();
   tableRow.addCell("15", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("15"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("15"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("15"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("15"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 16 */
   tableRow = table.addRow();
   tableRow.addCell("16", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("16"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("16"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("16"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("16"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 17 */
   tableRow = table.addRow();
   tableRow.addCell("17", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("17"), "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("17"), "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("17"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("17"), "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 3 */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("3"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("3"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("3"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("3"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* 00 */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("00"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("00"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("00"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("00"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("- Variation des stocks N / N-1", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("2", "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("- Variation des créances N / N-1", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("3", "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("+ Variation des dettes d'exploitation N / N-1", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("3", "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* 18 */
   tableRow = table.addRow();
   tableRow.addCell("18", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("18"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("18"), "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("18"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("18"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   /* */
   tableRow = table.addRow();
   tableRow.addCell(" ", "align-left", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(" ", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(" ", "align-center", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(" ", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");
   tableRow.addCell(" ", "align-right", 1).setStyleAttributes("padding-bottom:4px;padding-top:5px");

   /* */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell("RÉSULTAT EXERCICE (G = C-D+E-F)", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell("G", "align-center", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold;padding-bottom:4px;padding-top:5px");

   
   //checkResults(banDoc, startDate, endDate);



   //addFooter(report);
   return report;
}

/**************************************************************************************
*
* Functions that calculate the data for the report
*
**************************************************************************************/
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

function checkResults(banDoc, startDate, endDate) {
}

function addFooter(report) {
   report.getFooter().addClass("footer");
   report.getFooter().addText("- ", "");
   report.getFooter().addFieldPageNr();
   report.getFooter().addText(" -", "");
}


/**************************************************************************************
 * Styles
 **************************************************************************************/
function setCss(banDoc, repStyleObj, userParam) {
   var textCSS = "";
   var file = Banana.IO.getLocalFile("file:script/profitlossstatement.css");
   var fileContent = file.read();
   if (!file.errorString) {
      Banana.IO.openPath(fileContent);
      //Banana.console.log(fileContent);
      textCSS = fileContent;
   } else {
      Banana.console.log(file.errorString);
   }
   // Parse the CSS text
   repStyleObj.parse(textCSS);
}


/**************************************************************************************
 * Functions to manage the parameters
 **************************************************************************************/
function convertParam(userParam) {

   var convertedParam = {};
   convertedParam.version = '1.0';
   convertedParam.data = [];

   var currentParam = {};
   currentParam.name = 'logo';
   currentParam.title = "Imprimer le logo de l'en-tête";
   currentParam.type = 'bool';
   currentParam.value = userParam.logo ? true : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function() {
      userParam.logo = this.value;
   }
   convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'logoname';
   currentParam.title = 'Nom du logo (Logo Imposé -> Personnalisation)';
   currentParam.type = 'string';
   currentParam.value = userParam.logoname ? userParam.logoname : 'Logo';
   currentParam.defaultvalue = 'Logo';
   currentParam.readValue = function() {
     userParam.logoname = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'printheader';
   currentParam.title = "Imprimer le texte de l'en-tête de la page (Proprieté fichier -> Adresse)";
   currentParam.type = 'bool';
   currentParam.value = userParam.printheader ? true : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function() {
    userParam.printheader = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'printtitle';
   currentParam.title = 'Imprimer le titre';
   currentParam.type = 'bool';
   currentParam.value = userParam.printtitle ? true : false;
   currentParam.defaultvalue = true;
   currentParam.readValue = function() {
    userParam.printtitle = this.value;
   }
   convertedParam.data.push(currentParam);

   // var currentParam = {};
   // currentParam.name = 'title';
   // currentParam.title = 'Testo titolo (vuoto = testo predefinito)';
   // currentParam.type = 'string';
   // currentParam.value = userParam.title ? userParam.title : '';
   // currentParam.defaultvalue = '';
   // currentParam.readValue = function() {
   //    userParam.title = this.value;
   // }
   // convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'column';
   currentParam.title = "Colonne de regroupement (Nom XML de la colonne)";
   currentParam.type = 'string';
   currentParam.value = userParam.column ? userParam.column : 'Gr';
   currentParam.defaultvalue = 'Gr';
   currentParam.readValue = function() {
      userParam.column = this.value;
   }
   convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'decimals';
   currentParam.title = 'Enlever les décimales';
   currentParam.type = 'bool';
   currentParam.value = userParam.decimals ? userParam.decimals : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function() {
      userParam.decimals = this.value;
   }
   convertedParam.data.push(currentParam);

   return convertedParam;
}

function initUserParam() {
   var userParam = {};
   userParam.logo = false;
   userParam.logoname = 'Logo';
   userParam.printheader = false;
   userParam.printtitle = true;
   userParam.title = '';
   userParam.column = 'Gr';
   return userParam;
}

function parametersDialog(userParam) {
   if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
      var dialogTitle = "Parametri";
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
   var userParam = initUserParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam && savedParam.length > 0) {
      userParam = JSON.parse(savedParam);
   }

   //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
   var docStartDate = Banana.document.startPeriod();
   var docEndDate = Banana.document.endPeriod();

   //A dialog window is opened asking the user to insert the desired period. By default is the accounting period
   var selectedDates = Banana.Ui.getPeriod('', docStartDate, docEndDate,
      userParam.selectionStartDate, userParam.selectionEndDate, userParam.selectionChecked);

   //We take the values entered by the user and save them as "new default" values.
   //This because the next time the script will be executed, the dialog window will contains the new values.
   if (selectedDates) {
      userParam["selectionStartDate"] = selectedDates.startDate;
      userParam["selectionEndDate"] = selectedDates.endDate;
      userParam["selectionChecked"] = selectedDates.hasSelection;
   } else {
      //User clicked cancel
      return null;
   }

   userParam = parametersDialog(userParam); // From propertiess
   if (userParam) {
      var paramToString = JSON.stringify(userParam);
      Banana.document.setScriptSettings(paramToString);
   }

   return userParam;
}


/**************************************************************************************
 * Check the banana version
 **************************************************************************************/
function bananaRequiredVersion(requiredVersion, expmVersion) {
   if (expmVersion) {
      requiredVersion = requiredVersion + "." + expmVersion;
   }
   if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
      Banana.application.showMessages();
      Banana.document.addMessage(getErrorMessage(ID_ERR_VERSION));
      return false;
   }
   else {
      if (Banana.application.license) {
         if (Banana.application.license.licenseType === "advanced") {
            return true;
         }
         else {
            Banana.application.showMessages();
            Banana.document.addMessage(getErrorMessage(ID_ERR_LICENCE_ADVANCED));           
            return false;
         }
      }
   }
}
