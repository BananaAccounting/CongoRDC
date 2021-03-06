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
// @id = ch.banana.africa.balancesheetfromtable
// @api = 1.0
// @pubdate = 2021-02-26
// @publisher = Banana.ch SA
// @description = 2. Bilan (à partir du tableau)
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
   var reportStructure = createReportStructureBalanceFromTable();

   /**
    * 2. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   const bReport = new BReport(Banana.document, userParam, reportStructure);
   bReport.validateGroups(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount"]);
   bReport.excludeEntries();
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   /**
    * 3. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printBalanceSheet(Banana.document, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);
   Banana.Report.preview(report, stylesheet);
}

function printRow(userParam, bReport, table, gr, styleColumnDescription, styleColumnAmount) {
   
   var note = bReport.getObjectNote(gr);
   
   
   tableRow = table.addRow();
   // tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " " + styleIndentLevel, 1);
   if(bReport.getObjectType(gr) === 'total') {
      tableRow.addCell(gr, styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      if (note) {
         tableRow.addCell(note, styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      } else {
         tableRow.addCell(" ", "bottom-line", 1).setStyleAttributes("background-color: #C0C0C0");
      }
   } else {
      tableRow.addCell(gr, styleColumnDescription, 1);
      tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription, 1);
      if (note) {
         tableRow.addCell(note, styleColumnDescription, 1);
      } else {
         tableRow.addCell(" ", "bottom-line", 1);
      }
   }
   
   if (bReport.getObjectType(gr) === 'group' || bReport.getObjectType(gr) === 'total') { //do not print amounts for title types
      if(bReport.getObjectType(gr) === 'total') {
         tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
         tableRow.addCell(bReport.getObjectPreviousAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      } else {
         tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount, 1);
         tableRow.addCell(bReport.getObjectPreviousAmountFormatted(gr), styleColumnAmount, 1);
      }         
   } 
}

function printBalanceSheet(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Bilan");
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
   * ACTIVE
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
   tableRow.addCell("BILAN ACTIF AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

   // Active balancesheet table
   var table = report.addTable("table-active-balancesheet");
   var columnActive1 = table.addColumn("column-active1");
   var columnActive2 = table.addColumn("column-active2");
   var columnActive3 = table.addColumn("column-active3");
   var columnActive4 = table.addColumn("column-active4");
   var columnActive5 = table.addColumn("column-active5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 7);

   tableRow = table.addRow();
   tableRow.addCell("REF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AD */
   printRow(userParam, bReport, table, "AD", "description-groups", "amount-groups-totals");
   /* AE */
   printRow(userParam, bReport, table, "AE", "description-groups", "amount-groups");
   /* AF */
   printRow(userParam, bReport, table, "AF", "description-groups", "amount-groups");
   /* AG */
   printRow(userParam, bReport, table, "AG", "description-groups", "amount-groups");
   /* AH */
   printRow(userParam, bReport, table, "AH", "description-groups", "amount-groups");
   /* AI */
   printRow(userParam, bReport, table, "AI", "description-groups", "amount-groups-totals");
   /* AJ */
   printRow(userParam, bReport, table, "AJ", "description-groups", "amount-groups");
   /* AK */
   printRow(userParam, bReport, table, "AK", "description-groups", "amount-groups");
   /* AL */
   printRow(userParam, bReport, table, "AL", "description-groups", "amount-groups");
   /* AM */
   printRow(userParam, bReport, table, "AM", "description-groups", "amount-groups");
   /* AN */
   printRow(userParam, bReport, table, "AN", "description-groups", "amount-groups");
   /* AP */
   printRow(userParam, bReport, table, "AP", "description-groups", "amount-groups");
   /* AQ */
   printRow(userParam, bReport, table, "AQ", "description-groups", "amount-groups-totals");
   /* AR */
   printRow(userParam, bReport, table, "AR", "description-groups", "amount-groups");
   /* AS */
   printRow(userParam, bReport, table, "AS", "description-groups", "amount-groups");
   /* AZ */
   printRow(userParam, bReport, table, "AZ", "description-groups", "amount-groups-totals");
   /* BA */
   printRow(userParam, bReport, table, "BA", "description-groups", "amount-groups");
   /* BB */
   printRow(userParam, bReport, table, "BB", "description-groups", "amount-groups");
   /* BG */
   printRow(userParam, bReport, table, "BG", "description-groups", "amount-groups");
   /* BH */
   printRow(userParam, bReport, table, "BH", "description-groups", "amount-groups");
   /* BI */
   printRow(userParam, bReport, table, "BI", "description-groups", "amount-groups");
   /* BJ */
   printRow(userParam, bReport, table, "BJ", "description-groups", "amount-groups");
   /* BK */
   printRow(userParam, bReport, table, "BK", "description-groups", "amount-groups-totals");
   /* BQ */
   printRow(userParam, bReport, table, "BQ", "description-groups", "amount-groups");
   /* BR */
   printRow(userParam, bReport, table, "BR", "description-groups", "amount-groups");
   /* BS */
   printRow(userParam, bReport, table, "BS", "description-groups", "amount-groups");
   /* BT */
   printRow(userParam, bReport, table, "BT", "description-groups", "amount-groups-totals");
   /* BU */
   printRow(userParam, bReport, table, "BU", "description-groups", "amount-groups");
   /* BZ */
   printRow(userParam, bReport, table, "BZ", "description-groups", "amount-groups-totals");
   
   report.addPageBreak();

   /**************************************************************************************
   * PASSIVE
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
   tableRow.addCell("BILAN PASSIF AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

   // Passive balancesheet table
   var table = report.addTable("table-passive-balancesheet");
   var columnActive1 = table.addColumn("column-passive1");
   var columnActive2 = table.addColumn("column-passive2");
   var columnActive3 = table.addColumn("column-passive3");
   var columnActive4 = table.addColumn("column-passive4");
   var columnActive5 = table.addColumn("column-passive5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5);

   tableRow = table.addRow();
   tableRow.addCell("REF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("PASSIF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear,"bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear, "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("","",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET" + currentYear,"bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET" + previousYear, "bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* CA */
   printRow(userParam, bReport, table, "CA", "description-groups", "amount-groups");
   /* CB */
   printRow(userParam, bReport, table, "CB", "description-groups", "amount-groups");
   /* CD */
   printRow(userParam, bReport, table, "CD", "description-groups", "amount-groups");
   /* CE */
   printRow(userParam, bReport, table, "CE", "description-groups", "amount-groups");
   /* CF */
   printRow(userParam, bReport, table, "CF", "description-groups", "amount-groups");
   /* CG */
   printRow(userParam, bReport, table, "CG", "description-groups", "amount-groups");
   /* CH */
   printRow(userParam, bReport, table, "CH", "description-groups", "amount-groups");
   /* CJ */
   printRow(userParam, bReport, table, "CJ", "description-groups", "amount-groups");
   /* CL */
   printRow(userParam, bReport, table, "CL", "description-groups", "amount-groups");
   /* CM */
   printRow(userParam, bReport, table, "CM", "description-groups", "amount-groups");
   /* CP */
   printRow(userParam, bReport, table, "CP", "description-groups", "amount-groups-totals");
   /* DA */
   printRow(userParam, bReport, table, "DA", "description-groups", "amount-groups");
   /* DB */
   printRow(userParam, bReport, table, "DB", "description-groups", "amount-groups");
   /* DC */
   printRow(userParam, bReport, table, "DC", "description-groups", "amount-groups");
   /* DD */
   printRow(userParam, bReport, table, "DD", "description-groups", "amount-groups-totals");
   /* DF */
   printRow(userParam, bReport, table, "DF", "description-groups", "amount-groups-totals");
   /* DH */
   printRow(userParam, bReport, table, "DH", "description-groups", "amount-groups");
   /* DI */
   printRow(userParam, bReport, table, "DI", "description-groups", "amount-totals");
   /* DJ */
   printRow(userParam, bReport, table, "DJ", "description-groups", "amount-groups");
   /* DK */
   printRow(userParam, bReport, table, "DK", "description-groups", "amount-groups");
   /* DM */
   printRow(userParam, bReport, table, "DM", "description-groups", "amount-groups");
   /* DN */
   printRow(userParam, bReport, table, "DN", "description-groups", "amount-groups");
   /* DP */
   printRow(userParam, bReport, table, "DP", "description-groups", "amount-groups-totals");
   /* DQ */
   printRow(userParam, bReport, table, "DQ", "description-groups", "amount-groups");
   /* DR */
   printRow(userParam, bReport, table, "DR", "description-groups", "amount-groups");
   /* DT */
   printRow(userParam, bReport, table, "DT", "description-groups", "amount-groups-totals");
   /* DV */
   printRow(userParam, bReport, table, "DV", "description-groups", "amount-groups");
   /* DZ */
   printRow(userParam, bReport, table, "DZ", "description-groups", "amount-groups-totals");

   //checkResults(banDoc, startDate, endDate);



   addFooter(report);
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

   /* total Actif */
   var objA = banDoc.currentBalance("Gr=A", startDate, endDate);
   currentA = objA.balance;

   /* total Passif */
   var objP = banDoc.currentBalance("Gr=P", startDate, endDate);
   currentP = objP.balance;

   var res0 = Banana.SDecimal.add(currentA, currentP);
   if (res0 !== "0") {
      Banana.document.addMessage("Différence entre l'actif et le passif.");
   }
}

function addFooter(report) {
   report.getFooter().addClass("footer");
   report.getFooter().addText("- ", "");
   report.getFooter().addFieldPageNr();
   report.getFooter().addText(" -", "");
}

function setCss(banDoc, repStyleObj, userParam) {
   var textCSS = "";
   var file = Banana.IO.getLocalFile("file:script/balancesheetstyle.css");
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
   currentParam.value = userParam.column ? userParam.column : 'Gr1';
   currentParam.defaultvalue = 'Gr1';
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

   var currentParam = {};
   currentParam.name = 'import';
   currentParam.title = 'Importer les soldes';
   currentParam.type = 'string';
   currentParam.value = userParam.import ? userParam.import : '';
   currentParam.defaultvalue = '';
   currentParam.readValue = function() {
      userParam.import = this.value;
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
   userParam.column = 'Gr1';
   userParam.compactprint = false;
   userParam.stampa = true;
   return userParam;
}

function formatValuesDecimals(value,decimals) {
   if (decimals) {
     return Banana.Converter.toLocaleNumberFormat(value,0,true);
   }
   else {
     return Banana.Converter.toLocaleNumberFormat(value,2,true);
   }
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
         if (Banana.application.license.licenseType === "professional" || Banana.application.license.licenseType === "advanced") {
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
