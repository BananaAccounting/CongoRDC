// Copyright [2025] [Banana.ch SA - Lugano Switzerland]
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

// @id = ch.banana.drcongo.import.rawbank
// @api = 1.0
// @pubdate = 2025-11-04
// @publisher = Banana.ch SA
// @description = Rawbank - Import account statement .csv (Banana+ Advanced)
// @description.it = Rawbank - Importa estratto conto .csv (Banana+ Advanced)
// @description.en = Rawbank - Import account statement .csv (Banana+ Advanced)
// @description.de = Rawbank - Importieren Sie das Kontoauszugsformat .csv (Banana+ Advanced)
// @description.fr = Rawbank - Importer le relevé de compte .csv (Banana+ Advanced)
// @doctype = *
// @docproperties =
// @task = import.transactions
// @outputformat = transactions.simple
// @inputdatasource = openfiledialog
// @inputencoding = latin1
// @inputfilefilter = Text files (*.txt *.csv);;All files (*.*)
// @inputfilefilter.de = Text (*.txt *.csv);;Alle Dateien (*.*)
// @inputfilefilter.fr = Texte (*.txt *.csv);;Tous (*.*)
// @inputfilefilter.it = Testo (*.txt *.csv);;Tutti i files (*.*)
// @timeout = -1
// @includejs = import.utilities.js

/**
 * Parse the data and return the data to be imported as a tab separated file.
 */
function exec(string, isTest) {

    var importUtilities = new ImportUtilities(Banana.document);
 
    if (isTest !== true && !importUtilities.verifyBananaAdvancedVersion())
       return "";
 
    let convertionParam = defineConversionParam(string);
 
    var transactions = Banana.Converter.csvToArray(string, convertionParam.separator, '"');
 
    // Rawbank Format, this format works with the header names.
    var rawbankFormat1 = new RawbankFormat1();
    let transactionsData = rawbankFormat1.getFormattedData(transactions, importUtilities);
    if (rawbankFormat1.match(transactionsData)) {
       transactions = rawbankFormat1.convert(transactionsData);
       return Banana.Converter.arrayToTsv(transactions);
    }
 
    // Format is unknow, return an error
    importUtilities.getUnknownFormatError();
 
    return "";
 }
 
 /**
  * Rawbank Format
  *
  * EXTRAIT DE COMPTE;
  * Période du;01/12/2024;au;03/11/2025;
  * ;
  * Code client;01234567;
  * Nom du client;CALL DORE NENDITODO NATE;
  * Numéro de compte;01234-01234567901-12 USD;
  * Libellé du compte;NATE V/C USD;
  * Code IBAN;CD0123456789012345678901234;
  * Date;03/11/2025;
  * 
  * 
  * ;;Solde initial (USD) : -57681,72
  * Date;Valeur;Libellé de l'opération;Débit(USD);Crédit(USD);Solde(USD);
  * 30/05/2025;29/05/2025;LIA;11,60;;-57693,32;
  * 02/06/2025;01/06/2025;NENDITODO NATE AU 31/05/25;1092,77;;-58786,09;
  * 27/06/2025;26/06/2025;LIA;11,60;;-58797,69;
  * 31/07/2025;30/07/2025;LIA;11,60;;-58809,29;
  * 19/08/2025;19/08/2025;SED MEMPES EXCINEM;1077,78;;-59887,07;
  * 19/08/2025;19/08/2025;SED MEMPES EXCINEM;45,05;;-59932,12;
 */
 function RawbankFormat1() {
 
    /** Return true if the transactions match this format */
    this.match = function (transactionsData) {
       if (transactionsData.length === 0)
          return false;
 
       for (var i = 0; i < transactionsData.length; i++) {
          var transaction = transactionsData[i];
          var formatMatched = true;
 
          if (formatMatched && transaction["Date"] && transaction["Date"].length >= 10 &&
             transaction["Date"].match(/^\d{2}\/\d{2}\/\d{4}$/))
             formatMatched = true;
          else
             formatMatched = false;
 
          if (formatMatched)
             return true;
       }
 
       return false;
    }
 
    this.convert = function (transactionsData) {
       var transactionsToImport = [];
 
       for (var i = 0; i < transactionsData.length; i++) {
          if (transactionsData[i]["Date"] && transactionsData[i]["Date"].length >= 10 &&
             transactionsData[i]["Date"].match(/^\d{2}\/\d{2}\/\d{4}$/)) {
             transactionsToImport.push(this.mapTransaction(transactionsData[i]));
          }
       }
 
       // Sort rows by date
    //    transactionsToImport = transactionsToImport.reverse();
 
       // Add header and return
       var header = [["Date", "DateValue", "Doc", "ExternalReference", "Description", "Income", "Expenses"]];
       return header.concat(transactionsToImport);
    }

    this.getFormattedData = function (inData, importUtilities) {
         var columns = importUtilities.getHeaderData(inData, 12); //array
         var rows = importUtilities.getRowData(inData, 13); //array of array
         let form = [];
   
         let convertedColumns = [];
   
         convertedColumns = convertHeaderFr(columns);
   
         //Load the form with data taken from the array. Create objects
         if (convertedColumns.length > 0) {
            importUtilities.loadForm(form, convertedColumns, rows);
            return form;
         }
   
         return [];
    }
 
    this.mapTransaction = function (transaction) {
        let mappedLine = [];
   
        mappedLine.push(Banana.Converter.toInternalDateFormat(transaction["Date"], "dd.mm.yyyy"));
        mappedLine.push(Banana.Converter.toInternalDateFormat(transaction["DateValue"], "dd.mm.yyyy"));
        mappedLine.push("");
        mappedLine.push("");
        mappedLine.push(transaction["Description"]);
        mappedLine.push(Banana.Converter.toInternalNumberFormat(transaction["Credit"], ","));
        mappedLine.push(Banana.Converter.toInternalNumberFormat(transaction["Debit"], ","));
 
        return mappedLine;
    }
 }
 
 function defineConversionParam(inData) {
 
    var inData = Banana.Converter.csvToArray(inData);
    var header = String(inData[0]);
    var convertionParam = {};
    /** SPECIFY THE SEPARATOR AND THE TEXT DELIMITER USED IN THE CSV FILE */
    convertionParam.format = "csv"; // available formats are "csv", "html"
    //get text delimiter
    convertionParam.textDelim = '"';
    // get separator
    if (header.indexOf(';') >= 0) {
       convertionParam.separator = ';';
    } else {
       convertionParam.separator = ',';
    }
 
    /** SPECIFY AT WHICH ROW OF THE CSV FILE IS THE HEADER (COLUMN TITLES)
    We suppose the data will always begin right away after the header line */
    convertionParam.headerLineStart = 12;
    convertionParam.dataLineStart = 13;
 
    /** SPECIFY THE COLUMN TO USE FOR SORTING
    If sortColums is empty the data are not sorted */
    convertionParam.sortColums = ["Date", "Doc"];
    convertionParam.sortDescending = false;
 
    return convertionParam;
 }
 
 function convertHeaderFr(columns) {
    let convertedColumns = [];
 
    for (var i = 0; i < columns.length; i++) {
        switch (columns[i]) {
            case "Date":
                convertedColumns[i] = "Date";
                break;
            case "Valeur":
                convertedColumns[i] = "DateValue";
                break;
            case "Débit(USD)":
                convertedColumns[i] = "Debit";
                break;  
            case "Crédit(USD)":
                convertedColumns[i] = "Credit";
                break;
            case "Libellé de l'opération":
                convertedColumns[i] = "Description";
                break; 
            case "Solde(USD)":
                convertedColumns[i] = "Balance";
                break;
            default:
                break;
       }
    }
 
    if (convertedColumns.indexOf("Date") < 0) {
       return [];
    }
 
    return convertedColumns;
 }