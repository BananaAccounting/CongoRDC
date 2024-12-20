// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.africa.reportsohadardcmulticurrency
// @api = 1.0
// @pubdate = 2020-08-24
// @publisher = Banana.ch SA
// @description = Balance Sheet, Profit/Loss Statement, Cash Flow Multicurrency
// @description.fr = Bilan, Compte de résultat, Tableau des flux de tresorerie Multi-devise
// @task = app.command
// @doctype = 100.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = balancesheetmulticurrency.inc
// @includejs = profitlossmulticurrency.inc
// @includejs = cashflowmulticurrency.inc


//balancesheet_multicurrency/ch.banana.africa.balancesheetrdcmulticurrency.js
//profitloss_multicurrency/ch.banana.africa.profitlossmulticurrency.js
//cashflow_multicurrency/ch.banana.africa.cashflowrdcmulticurrency.js

function exec() {
  
      /* CURRENT year file: the current opened document in Banana */
      var current = Banana.document;
      if (!current) {
          return "@Cancel";
      }
  
    var userParam = initUserParam();
    var savedParam = current.getScriptSettings();
    if (savedParam && savedParam.length > 0) {
        userParam = JSON.parse(savedParam);
        userParam = verifyUserParam(userParam);
      }

      // If needed show the settings dialog to the user
    if (!options || !options.useLastSettings) {
        userParam = settingsDialog(); // From properties
    }
  
    if (!userParam) {
      return "@Cancel";
    }

    var fileNumber = current.info("Base","FileTypeNumber");

    // Check if the file is multicurrency
    if (Number(fileNumber) === 120 || Number(fileNumber) === 130) {
        
    } else {
      current.addMessage("Cette extension ne fonctionne qu'en mode multi-devise. \nVeuillez vous assurer que votre fichier est multi-devise.");
      return;
    }
  
      /* PREVIOUS year file: Return the previous year document.
         If the previous year is not defined or it is not found it returns null */
      var previous = Banana.document.previousYear();
  
      var report = Banana.Report.newReport("Bilan, Compte de résultat, Tableau des flux de tresorerie Multi-devise (OHADA - RDC) [BETA]");
      
      /* 1. Balance Sheet report */
      createBalanceSheetMulticurrencyReport(current, userParam.selectionStartDate, userParam.selectionEndDate, userParam, report);
      report.addPageBreak();
      
      /* 2. Profit/Loss Statement report */
      createProfitLossStatementReportMulticurrency(current, previous, userParam.selectionStartDate, userParam.selectionEndDate, userParam, report);
      report.addPageBreak();
  
      /* 3. Cash Flow report */
      createCashFlowReportMulticurrency(current, previous, userParam.selectionStartDate, userParam.selectionEndDate, userParam, report);
  
      var stylesheet = createStyleSheet(userParam);
      Banana.Report.preview(report, stylesheet);
  
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
    currentParam.defaultvalue = 'Rapports comptables multi-devise';
    currentParam.readValue = function() {
        userParam.title = this.value;
    }
    convertedParam.data.push(currentParam);
  
    var currentParam = {};
    currentParam.name = 'currency';
    currentParam.title = 'Devise';
    currentParam.type = 'string';
    currentParam.value = userParam.currency ? userParam.currency : 'CDF';
    currentParam.defaultvalue = 'CDF';
    currentParam.readValue = function() {
        userParam.currency = this.value;
    }
    convertedParam.data.push(currentParam);
  
    var currentParam = {};
    currentParam.name = 'exchangerate';
    currentParam.title = 'Change';
    currentParam.type = 'string';
    currentParam.value = userParam.exchangerate ? userParam.exchangerate : '';
    currentParam.defaultvalue = '';
    currentParam.readValue = function() {
        userParam.exchangerate = this.value;
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
    currentParam.name = 'amounts_column_width';
    currentParam.title = 'Largeur des colonnes montants (valeur par défaut 15)';
    currentParam.type = 'string';
    currentParam.value = userParam.amounts_column_width ? userParam.amounts_column_width : '15';
    currentParam.defaultvalue = '15';
    currentParam.tooltip = "Ajuster la largeur des colonnes contenant des montants";
    currentParam.readValue = function() {
        userParam.amounts_column_width = this.value;
    }
    convertedParam.data.push(currentParam);
  
    return convertedParam;
  }
  
  function initUserParam() {
    var userParam = {};
    userParam.title = "Rapports comptables multi-devise";
    userParam.currency = 'CDF';
    userParam.exchangerate = "";
    userParam.amounts_column_width = '15';
    
    return userParam;
  }

  function verifyUserParam(userParam) {
    if (!userParam.title) {
      userParam.title = '';
    }
    if (!userParam.currency) {
      userParam.currency = 'CDF';
    }
    if (!userParam.exchangerate) {
      userParam.exchangerate = '';
    }
    return userParam;
  }

  function parametersDialog(userParam) {
    userParam = verifyUserParam(userParam);
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

  function createStyleSheet(userParam) {
    var stylesheet = Banana.Report.newStyleSheet();
 
    stylesheet.addStyle("@page", "margin:20mm 10mm 10mm 20mm;") 
    stylesheet.addStyle("body", "font-family:Helvetica; font-size:9pt");
    stylesheet.addStyle(".bold", "font-weight:bold;");
    stylesheet.addStyle(".right", "text-align:right;");
    stylesheet.addStyle(".center", "text-align:center");
 
    style = stylesheet.addStyle(".blackCell");
    style.setAttribute("background-color", "black");
    style.setAttribute("color","white");
 
    style = stylesheet.addStyle(".greyCell");
    style.setAttribute("background-color", "#C0C0C0");
 
    style = stylesheet.addStyle(".blueCell");
    style.setAttribute("background-color", "#b7c3e0");
 
    /* table */
    var tableStyle = stylesheet.addStyle(".table");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".c1", "");
    stylesheet.addStyle(".c2", "");
    stylesheet.addStyle("table.table td", "");
    
    var tableStyle = stylesheet.addStyle(".tableActiveBalanceSheet");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".col1", "width:4%");
    stylesheet.addStyle(".col2", "width:31%");
    stylesheet.addStyle(".col3", "width:5%");
    stylesheet.addStyle(".col4", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle(".col5", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle(".col6", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle(".col7", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle("table.tableActiveBalanceSheet td", "padding-bottom:2px;padding-top:5px");
 
    var tableStyle = stylesheet.addStyle(".tablePassiveBalanceSheet");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".pCol1", "width:5%");
    stylesheet.addStyle(".pCol2", "width:60%");
    stylesheet.addStyle(".pCol3", "width:5%");
    stylesheet.addStyle(".pCol4", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle(".pCol5", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle("table.tablePassiveBalanceSheet td", "border:thin solid black;padding-bottom:2px;padding-top:5px");
 
    var tableStyle = stylesheet.addStyle(".tableProfitLossStatement");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".plCol1", "width:5%");
    stylesheet.addStyle(".plCol2", "width:53%");
    stylesheet.addStyle(".plCol3", "width:5%");
    stylesheet.addStyle(".plCol4", "width:7%");
    stylesheet.addStyle(".plCol5", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle(".plCol6", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle("table.tableProfitLossStatement td", "border:thin solid black;padding-bottom:1px;padding-top:3px");
 
    var tableStyle = stylesheet.addStyle(".tableCashFlow");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".col1", "width:5%");
    stylesheet.addStyle(".col2", "width:60%");
    stylesheet.addStyle(".col3", "width:5%");
    stylesheet.addStyle(".col4", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle(".col5", "width:"+ userParam.amounts_column_width +"%");
    stylesheet.addStyle("table.tableCashFlow td", "border:thin solid black;padding-bottom:2px;padding-top:5px");
 
    return stylesheet;
 }
  
  