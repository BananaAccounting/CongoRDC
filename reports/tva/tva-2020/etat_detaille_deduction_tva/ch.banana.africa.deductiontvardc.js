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
// @id = ch.banana.africa.deductiontvardc
// @api = 1.0
// @pubdate = 2020-07-03
// @publisher = Banana.ch SA
// @description = VAT Deduction Details (OHADA - RDC) [BETA]
// @description.fr = Etat Détaillé des Déductions de TVA (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a VAT deduction details report for RDC.

*/


function exec() {

    var dateForm = getPeriodSettings("Select Date");
    
    if (!dateForm) {
       return;
    }
 
    //CURRENT year file: the current opened document in Banana */
    var current = Banana.document;
    if (!current) {
       return "@Cancel";
    }    
 
    // Create the VAT report for the selected period
    var report = createVATDeductionDetailsReport(current, dateForm.selectionStartDate, dateForm.selectionEndDate);
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}

/**************************************************************************************
*
* Function that creates and prints the VAT report
*
**************************************************************************************/
function createVATDeductionDetailsReport(current, startDate, endDate, report) {
    // Accounting period for the current year file
   var currentStartDate = startDate;
   var currentEndDate = endDate;
   if(!startDate) {
      currentStartDate = current.info("AccountingDataBase","OpeningDate");
   }
   if(!endDate) {
      currentEndDate = current.info("AccountingDataBase","ClosureDate");
   }
   var currentYear = Banana.Converter.toDate(currentStartDate).getFullYear();
   var company = current.info("AccountingDataBase","Company");
   var address = current.info("AccountingDataBase","Address1");
   var city = current.info("AccountingDataBase","City");
   var state = current.info("AccountingDataBase","State");
   var fiscalNumber = current.info("AccountingDataBase","FiscalNumber");
   var vatNumber = current.info("AccountingDataBase","VatNumber"); 
   var phoneNumber = current.info("AccountingDataBase","Phone");
   var email = current.info("AccountingDataBase","Email");
   
   var month = Banana.Converter.toDate(currentEndDate).getMonth() + 1;
   var currentMonth = getMonthString(month);
   var today = new Date(); // The day the report will be generated

   // Extract data from journal
   var journal = VatGetJournal(current, currentStartDate, currentEndDate);

   if (!report) {
    var report = Banana.Report.newReport("VAT Deduction Details Report");
    }


    // Header of the report
   
   var table = report.addTable("table");
   var tableRow = table.addRow();
   tableRow.addCell("RÉPUBLIQUE DÉMOCRATIQUE DU CONGO", "bold",20).setStyleAttributes("font-size:12px");   

   tableRow = table.addRow();
   tableRow.addCell("MINISTÈRE DES FINANCES", "bold", 20).setStyleAttributes("font-size:12px");

   tableRow = table.addRow();   
   tableRow.addCell("DIRECTION GÉNÉRALE DES IMPÔTS", "", 20).setStyleAttributes("font-size:13px");

   tableRow = table.addRow();
   tableRow.addCell("", "", 20);
   tableRow = table.addRow();
   tableRow.addCell("", "", 20);
   tableRow = table.addRow();
   tableRow.addCell("", "", 20);

   var table = styleTable(report, "tableNoBorder");
   tableRow = table.addRow();
   tableRow.addCell("", "", 2);
   cell_in = tableRow.addCell("", "", 16);

   // Apply style to table
   var insideTable = cell_in.addTable("inTable");
   cell_in.setStyleAttributes("border-top:thin solid black; border-left:thin solid black; border-right:thin solid black; border-bottom:thin solid black");

   row_in = insideTable.addRow();
   row_in.addCell("", "", 2);
   row_in = insideTable.addRow();
   row_in.addCell("ÉTAT DÉTAILLÉ DES DÉDUCTIONS DE TVA", "center bold", 16).setStyleAttributes("font-size:15px");
   row_in = insideTable.addRow();
   row_in.addCell("Mois de réalisation des opérations: " + currentMonth, "center bold", 16).setStyleAttributes("font-size:11px");
   row_in = insideTable.addRow();
   row_in.addCell("(à joindre obligatoirement à la déclaration mensuelle à la taxe sur la valeur ajoutée)", "center", 16).setStyleAttributes("font-size:10px");

   table = styleTable(report, "tableNoBorder");
   tableRow = table.addRow();
   tableRow.addCell("", "", 20);
   tableRow = table.addRow();
   tableRow.addCell("", "", 20);

   /* I. IDENTIFICATION */
   tableRow = table.addRow();
   tableRow.addCell("I. IDENTIFICATION DU REDEVABLE", "bold", 20).setStyleAttributes("padding-left:2em;font-size:11px");
   tableRow = table.addRow();
   tableRow.addCell("", "", 20);

   table = styleTable(report, "deductTable");
   tableRow = table.addRow();
   tableRow.addCell("Nom ou raison sociale: " + company, "", 8).setStyleAttributes("padding-left:5px;font-size:9px");
   tableRow.addCell("NUMÉRO IMPÔT", "", 3).setStyleAttributes("font-size:9px");
   if(fiscalNumber[0]) {
      tableRow.addCell(fiscalNumber[0], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[1]) {
      tableRow.addCell(fiscalNumber[1], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[2]) {
      tableRow.addCell(fiscalNumber[2], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[3]) {
      tableRow.addCell(fiscalNumber[3], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[4]) {
      tableRow.addCell(fiscalNumber[4], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[5]) {
      tableRow.addCell(fiscalNumber[5], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[6]) {
      tableRow.addCell(fiscalNumber[6], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[7]) {
      tableRow.addCell(fiscalNumber[7], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }
   if(fiscalNumber[8]) {
      tableRow.addCell(fiscalNumber[8], "center" , 1).setStyleAttributes("font-size:9px");
   } else {
      tableRow.addCell("", "", 1);
   }

   table = report.addTable("tableDetails");
   tableRow = table.addRow();
   tableRow.addCell("Sigle : ", "", 2).setStyleAttributes("font-size:9px;padding-left:5px;border-left:thin solid black");
   tableRow.addCell("Adresse postale : ", "", 3).setStyleAttributes("font-size:9px;padding-left:5px;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black");
   
   tableRow = table.addRow();
   tableRow.addCell("Adresse physique : " + address, "", 2).setStyleAttributes("font-size:7px;padding-left:5px;border-left:thin solid black");
   tableRow.addCell("Nº Téléphone : " + phoneNumber, "", 3).setStyleAttributes("font-size:9px;padding-left:5px;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 2).setStyleAttributes("font-size:9px;padding-left:5px;border-left:thin solid black");
   tableRow.addCell("Fax : ", "", 3).setStyleAttributes("font-size:9px;border-left:thin solid black;padding-left:5px;border-right:thin solid black;border-bottom:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 2).setStyleAttributes("font-size:9px;padding-left:5px;border-left:thin solid black;border-bottom:thin solid black");
   tableRow.addCell("E-mail : " + email, "", 3).setStyleAttributes("font-size:9px;padding-left:5px;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5);

   /* II. DEDUCTIONS */
   tableRow = table.addRow();
   tableRow.addCell("II. DÉDUCTIONS OPÉRÉES", "bold", 5).setStyleAttributes("padding-left:2em;font-size:11px");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5);

   tableRow = table.addRow();
   tableRow.addCell("", "", 5).setStyleAttributes("border-left:thin solid black; border-top:thin solid black; border-right:thin solid black");

   /* 1. Achats locaux */
   tableRow = table.addRow();
   tableRow.addCell("1. Achats locaux de biens et services", "bold", 5).setStyleAttributes("padding-left:5px;font-size:11px;border-left:thin solid black;border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5).setStyleAttributes("border-left:thin solid black; border-bottom:thin solid black; border-right:thin solid black");

   table = styleTable(report, "tableNoBorder");

   tableRow = table.addRow();
   tableRow.addCell("Nom ou raison sociale du", "center", 5).setStyleAttributes("border-left:thin solid black");
   tableRow.addCell("Numéro Impôt du fournisseur", "center", 5).setStyleAttributes("border-left:thin solid black");
   tableRow.addCell("Facture", "center", 5).setStyleAttributes("border-left:thin solid black;border-bottom:thin solid black");
   tableRow.addCell("Montant de la TVA payée", "center", 5).setStyleAttributes("border-left:thin solid black;border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("fournisseur ou du prestataire", "center", 5).setStyleAttributes("border-left:thin solid black");
   tableRow.addCell("ou du prestataire", "center", 5).setStyleAttributes("border-left:thin solid black");
   tableRow.addCell("Nº de la facture", "center", 2).setStyleAttributes("border-left:thin solid black");
   tableRow.addCell("Date", "center", 3).setStyleAttributes("border-left:thin solid black");
   tableRow.addCell("", "center", 5).setStyleAttributes("border-left:thin solid black;border-right:thin solid black");

   table = styleTable(report, "deductTable");

   details = getLocalTransactionDetails(current, currentStartDate, currentEndDate);
   /* Row 1 */
   tableRow = table.addRow();
   if (details[0]) {
      var supplier = getSupplierName(details[0].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[0].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[0].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[0].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 2 */
   tableRow = table.addRow();
   if (details[1]) {
      var supplier = getSupplierName(details[1].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[1].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[1].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[1].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 3 */
   tableRow = table.addRow();
   if (details[2]) {
      var supplier = getSupplierName(details[2].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[2].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[2].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[2].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 4 */
   tableRow = table.addRow();
   if (details[3]) {
      var supplier = getSupplierName(details[3].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[3].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[3].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[3].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 5 */
   tableRow = table.addRow();
   if (details[4]) {
      var supplier = getSupplierName(details[4].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[4].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[4].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[4].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 6 */
   tableRow = table.addRow();
   if (details[5]) {
      var supplier = getSupplierName(details[5].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[5].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[5].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[5].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 7 */
   tableRow = table.addRow();
   if (details[6]) {
      var supplier = getSupplierName(details[6].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[6].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[6].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[6].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 8 */
   tableRow = table.addRow();
   if (details[7]) {
      var supplier = getSupplierName(details[7].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[7].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[7].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[7].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 9 */
   tableRow = table.addRow();
   if (details[8]) {
      var supplier = getSupplierName(details[8].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[8].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[8].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[8].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 10 */
   tableRow = table.addRow();
   if (details[9]) {
      var supplier = getSupplierName(details[9].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[9].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[9].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[9].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   /* Row 11 */
   tableRow = table.addRow();
   if (details[10]) {
      var supplier = getSupplierName(details[10].docinvoice, journal.suppliers);
      tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[10].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(details[10].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(details[10].amount), "center", 5).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 5);
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 5);
   }

   if (details[11]) {
      var index = 11;
      while(index < details.length) {
         tableRow = table.addRow();
         var supplier = getSupplierName(details[index].docinvoice, journal.suppliers);
         tableRow.addCell(supplier.name, "center", 5).setStyleAttributes("font-size:8pt");
         tableRow.addCell(supplier.vatnumber, "center", 5).setStyleAttributes("font-size:8pt");
         tableRow.addCell(details[index].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
         tableRow.addCell(details[index].date, "center", 3).setStyleAttributes("font-size:8pt");
         tableRow.addCell(formatNumber(details[index].amount), "center", 5).setStyleAttributes("font-size:8pt");
         index++;
      }
   } 

   table = report.addTable("tableDetails");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5).setStyleAttributes("border-left:thin solid black;border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("2. Importations", "bold", 5).setStyleAttributes("padding-left:5px;font-size:11px;border-left:thin solid black;border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5).setStyleAttributes("border-left:thin solid black; border-bottom:thin solid black; border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5).setStyleAttributes("border-left:thin solid black;border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("Déclaration de la mise à la consommation", "center", 5).setStyleAttributes("font-size:9px;border-left:thin solid black;border-right:thin solid black");

   tableRow = table.addRow();
   tableRow.addCell("", "", 5).setStyleAttributes("border-left:thin solid black;border-right:thin solid black");

   table = styleTable(report, "deductTable");

   tableRow = table.addRow();
   tableRow.addCell("Nº de la déclaration", "center", 2).setStyleAttributes("font-size:9pt");
   tableRow.addCell("Date", "center", 3).setStyleAttributes("font-size:9pt");
   tableRow.addCell("Montant de la TVA payée", "center", 15).setStyleAttributes("font-size:9pt");

   var importDetails = getImportTransactionDetails(current, currentStartDate, currentEndDate);

   /* Row 1 */
   tableRow = table.addRow();
   if (importDetails[0]) {
      tableRow.addCell(importDetails[0].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(importDetails[0].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(importDetails[0].amount), "center", 15).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 15);
   }

   /* Row 2 */
   tableRow = table.addRow();
   if (importDetails[1]) {
      tableRow.addCell(importDetails[1].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(importDetails[1].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(importDetails[1].amount), "center", 15).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 15);
   }

   /* Row 3 */
   tableRow = table.addRow();
   if (importDetails[2]) {
      tableRow.addCell(importDetails[2].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(importDetails[2].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(importDetails[2].amount), "center", 15).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 15);
   }

   /* Row 4 */
   tableRow = table.addRow();
   if (importDetails[3]) {
      tableRow.addCell(importDetails[3].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(importDetails[3].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(importDetails[3].amount), "center", 15).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 15);
   }

   /* Row 5 */
   tableRow = table.addRow();
   if (importDetails[4]) {
      tableRow.addCell(importDetails[4].docinvoice, "center", 2).setStyleAttributes("font-size:8pt");
      tableRow.addCell(importDetails[4].date, "center", 3).setStyleAttributes("font-size:8pt");
      tableRow.addCell(formatNumber(importDetails[4].amount), "center", 15).setStyleAttributes("font-size:8pt");
   } else {
      tableRow.addCell("", "center", 2);
      tableRow.addCell("", "center", 3);
      tableRow.addCell("", "center", 15);
   }

   table = styleTable(report, "tableNoBorder");

   tableRow = table.addRow();
   tableRow.addCell("", "", 7);
   tableRow.addCell("Fait à " + city, "bold", 6).setStyleAttributes("font-size:11px");
   tableRow.addCell(", le " + formatDate(today), "bold", 5).setStyleAttributes("font-size:11px");

   tableRow = table.addRow();
   tableRow.addCell("Sceau de l'Entreprise", "bold", 20).setStyleAttributes("padding-left:5px;font-size:11px");

   tableRow = table.addRow();
   tableRow.addCell("", "", 20);

   tableRow = table.addRow();
   
   tableRow.addCell("", "", 8);
   tableRow.addCell("Nom et qualité du signataire", "bold", 13).setStyleAttributes("font-size:11px");
   
   
   return report;
}

/**************************************************************************************
*
* Functions that retrieve and format values from Banana
*
**************************************************************************************/

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

function styleTable(report, style) {
    var table = report.addTable(style);
    var col1 = table.addColumn("colTable1");
    col1.setStyleAttributes("width:5%");
    var col2 = table.addColumn("colTable2");
    col2.setStyleAttributes("width:5%");
    var col3 = table.addColumn("colTable3");
    col3.setStyleAttributes("width:5%");
    var col4 = table.addColumn("colTable4");
    col4.setStyleAttributes("width:5%");
    var col5 = table.addColumn("colTable5");
    col5.setStyleAttributes("width:5%");
    var col6 = table.addColumn("colTable6");
    col6.setStyleAttributes("width:5%");
    var col7 = table.addColumn("colTable7");
    col7.setStyleAttributes("width:5%");
    var col8 = table.addColumn("colTable8");
    col8.setStyleAttributes("width:5%");
    var col9 = table.addColumn("colTable9");
    col9.setStyleAttributes("width:5%");
    var col10 = table.addColumn("colTable10");
    col10.setStyleAttributes("width:5%");
    var col11 = table.addColumn("colTable11");
    col11.setStyleAttributes("width:5%");
    var col12 = table.addColumn("colTable12");
    col12.setStyleAttributes("width:5%");
    var col13 = table.addColumn("colTable13");
    col13.setStyleAttributes("width:5%");
    var col14 = table.addColumn("colTable14");
    col14.setStyleAttributes("width:5%");
    var col15 = table.addColumn("colTable15");
    col15.setStyleAttributes("width:5%");
    var col16 = table.addColumn("colTable16");
    col16.setStyleAttributes("width:5%");
    var col17 = table.addColumn("colTable17");
    col17.setStyleAttributes("width:5%");
    var col18 = table.addColumn("colTable18");
    col18.setStyleAttributes("width:5%");
    var col19 = table.addColumn("colTable19");
    col19.setStyleAttributes("width:5%");
    var col20 = table.addColumn("colTable20");
    col20.setStyleAttributes("width:5%");
    return table;
 }

/**************************************************************************************
*
* Format functions 
*
**************************************************************************************/

function formatNumber(amount, convZero) {

	return Banana.Converter.toLocaleNumberFormat(amount, 2, convZero);
}

function formatDate(date) {
   month = '' + (date.getMonth() + 1);
       day = '' + date.getDate();
       year = date.getFullYear();

   if (month.length < 2) 
       month = '0' + month;
   if (day.length < 2) 
       day = '0' + day;

   return [day, month, year].join('/');
}

function getMonthString(month) {
    if (!month) {
       return;
    }
    switch (month) {
       case 1: return "JANVIER";
       case 2: return "FÉVRIER";
       case 3: return "MARS";
       case 4: return "AVRIL";
       case 5: return "MAI";
       case 6: return "JUIN";
       case 7: return "JUILLET";
       case 8: return "AOÛT";
       case 9: return "SEPTEMBRE";
       case 10: return "OCTOBRE";
       case 11: return "NOVEMBRE";
       case 12: return "DÉCEMBRE";
       default: return;
    }
 }

 /* Function that returns the lines from the journal as an array */
function VatGetJournal(banDoc, startDate, endDate) {

	var journal = banDoc.journalCustomersSuppliers(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL); // Get all transactions
   var len = journal.rowCount;
	var transactions = []; //Array that will contain all the lines of the transactions
   var suppliers = {}; //List of invoices with suppliers information
   
   var tableAccounts = banDoc.table("Accounts");

	for (var i = 0; i < len; i++) {

		var line = {};
		var tRow = journal.row(i);

		if (tRow.value("JDate") >= startDate && tRow.value("JDate") <= endDate) {

			line.date = tRow.value("JDate");
			line.account = tRow.value("JAccount");
			line.vatcode = tRow.value("JVatCodeWithoutSign");
			line.doc = tRow.value("Doc");
			line.docInvoice = tRow.value("DocInvoice");
            line.description = tRow.value("Description");
            line.isvatoperation = tRow.value("JVatIsVatOperation");
            line.debitaccount = tRow.value("JDebitAmount");
            line.creditaccount = tRow.value("JCreditAmount");
            line.segment = tRow.value("JSegment3");
            //in JInvoiceRowCustomerSupplier the following values are available: 1=Customer, 2=Supplier
            if (tRow.value('JInvoiceRowCustomerSupplier') == "2") {
                var supplierId = tRow.value("JAccount");
                var supplierDescription = tRow.value("JAccountDescription");
                if (supplierId) {
                  var tabRow = tableAccounts.findRowByValue("Account", supplierId);
                    if (!suppliers.hasOwnProperty(supplierId)) {
                        suppliers[supplierId] = {};
                        suppliers[supplierId].description = supplierDescription;
                        suppliers[supplierId].invoices = [];
                        
                        if (tabRow) {
                           suppliers[supplierId].vatnumber = tabRow.value("VatNumber");
                        }
                        if (line.docInvoice)
                            suppliers[supplierId].invoices.push(line.docInvoice);
                    }
                    else {
                        if (line.docInvoice)
                            suppliers[supplierId].invoices.push(line.docInvoice);
                    }
                }
            }

			//We take only the rows with a VAT code and then we convert values from base currency to CHF
			if (line.isvatoperation) {

				line.vattaxable = tRow.value("JVatTaxable");
				line.vatamount = tRow.value("VatAmount");
				line.vatposted = tRow.value("VatPosted");
				line.amount = tRow.value("JAmount");
                line.vatextrainfo = tRow.value("VatExtraInfo");
                line.docinvoice = tRow.value('DocInvoice'); // Not displaying in .sbaa file
                line.roworigin = tRow.value("JRowOrigin");

				transactions.push(line);
         }
		}
    }
   
    var journal = {};
    journal.transactions = transactions;
    journal.suppliers = suppliers;
    return journal;
}

function getTransactionDetails(banDoc, startDate, endDate){
   var journal =  VatGetJournal(banDoc, startDate, endDate); // Get all transactions from the journal
   
   var rowsDetails = [];
   for (var i = 0; i < journal.transactions.length; i++) {
      var tRowCode = journal.transactions[i].vatcode;
      var gr1Code = VatGetVatCodesForGr1(banDoc, tRowCode); // Get the Gr1 VAT codes

      // Only take transactions with Gr1 deductible VAT codes 
      /**
       * 11 : Immobilisations (déductible)
       * 12 : Marchandises (déductible)
       * 13 : Matières premières (déductible)
       * 14 : Autres biens et services (déductible)
       * */
      if (gr1Code[0] === '11' || gr1Code[0] === '12' || gr1Code[0] === '13' || gr1Code[0] === '14') {
         rowsDetails.push(journal.transactions[i]);
      }
   }
   return rowsDetails;
}

function getLocalTransactionDetails(banDoc, startDate, endDate) {
   var details = getTransactionDetails(banDoc, startDate, endDate);
   var localDetails = [];
   for (var i = 0; i < details.length; i++) {
      // If VAT extra info is null, get local transactions
      if(!details[i].vatextrainfo) {
         localDetails.push(details[i]);
      }
   }
   return localDetails;
}

function getImportTransactionDetails(banDoc, startDate, endDate) {
   var details = getTransactionDetails(banDoc, startDate, endDate);
   var importDetails = [];
   for (var i = 0; i < details.length; i++) {
      if(details[i].vatextrainfo) {
         importDetails.push(details[i]);
      }
   }
   return importDetails;
}

function getSupplierName(docInvoice, suppliers) {
   var supplier = {};
   supplier.id = "";
   supplier.name = "";
   supplier.vatnumber = "";
   if (docInvoice.length > 0) {
      for (var obj in suppliers) {
         var invoices = suppliers[obj].invoices;
         if (invoices.indexOf(docInvoice.toString()) >= 0) {
            supplier.id = obj;
            supplier.name = suppliers[obj].description;
            supplier.vatnumber = suppliers[obj].vatnumber;
            break;
         }
      }
      //vat number you can get from table accounts looking for accountId
   }
   return supplier;
}

function getSuppliers(banDoc, startDate, endDate) {
   var invoicesSuppliers = banDoc.invoicesSuppliers();
   var len = invoicesSuppliers.rowCount;
   var suppliers = [];

   for (var i = 0; i < len; i++) {
      var line = {};
      var row = invoicesSuppliers.row(i);
      var idSupplier = row.value("CounterpartyId");
      var idInvoice = row.value("Invoice");
      var date = row.value("Date");

      if (idSupplier.length > 0 && idInvoice.length > 0) {
         if (date >= startDate && date <= endDate) {
            suppliers.push(row);
         }
         
      }

      // if (JSON.parse(invoicesSuppliers.row(i).toJSON()).ObjectType === 'Counterparty')         
      //       suppliers.push(JSON.parse(JSON.parse(invoicesSuppliers.row(i).toJSON()).ObjectJSonData).Counterparty);

      // if(JSON.parse(invoicesSuppliers.row(i).toJSON()).ObjectType === 'InvoiceDocument')
      //    suppliers.push(JSON.parse(JSON.parse(invoicesSuppliers.row(i).toJSON()).ObjectJSonData));

      // if (row.value("Date") >= startDate && row.value("Date") <= endDate) {
      //    line.date = row.value("Date");
      //    line.description = row.value("Description");
      //    line.invoice = row.value("Invoice");
      //    line.roworigin = row.value("JRowOrigin");
      //    line.objecttype = row.value("ObjectType");
      //    line.tableorigin = row.value("JTableOrigin");
      //    line.account = row.value()

         // We only take rows from the transactions table
         // suppliers.push(row);
      // }
   }
   
   return suppliers;
}

/* Return and array with all the VAT Codes 
*  belonging to the same group (grCodes) , can include different values separated by ";"
*  in the indicate colums, usually "Gr1"           */
function VatGetVatCodesForGr(banDoc, grCodes, grColumn) {

	var str = [];
	if (!grCodes || !banDoc || !banDoc.table("VatCodes")) {
		return str;
	}
	var table = banDoc.table("VatCodes");

	if (!grColumn) {
		grColumn = "Gr1";
	}

	/* Can have multiple values */
	var arrayGrCodes = grCodes.split(';');

	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);

		//If Gr1 column contains other characters (in this case ";") we know there are more values
		//We have to split them and take all values separately
		//If there are only alphanumeric characters in Gr1 column we know there is only one value
		var arrCodeString = tRow.value(grColumn).split(";");
		for (var j = 0; j < arrayGrCodes.length; j++) {
			if (arrayContains(arrCodeString, arrayGrCodes[j])) {
				var vatCode = tRow.value('VatCode');
				if (!arrayContains(str, vatCode)) {
					str.push(vatCode);
				}
			}
		}
	}

	//Return the array
	return str;
}

function arrayContains(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === value) {
			return true;
		}
	}
	return false;
}

/* returns an array with all the gr1 codes for the given vat code 
*  Gr1 code can be separated by ";"                */
function VatGetVatCodesForGr1(banDoc, vatCode) {
	var str = [];
	var table = banDoc.table("VatCodes");
	if (table === undefined || !table) {
		return str;
	}
	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		var gr1 = tRow.value("Gr1");
		var vatcode = tRow.value("VatCode");

		if (gr1 && vatcode === vatCode) {
			var code = gr1.split(";");
			for (var j = 0; j < code.length; j++) {
				if (code[j]) {
					str.push(code[j]);
				}
			}
		}
	}
	return str;
}

 /**************************************************************************************
*
* Period Settings 
*
**************************************************************************************/

/* The main purpose of this function is to allow the user to enter the accounting period desired and saving it for the next time the script is run
Every time the user runs of the script he has the possibility to change the date of the accounting period */
function getPeriodSettings(param) {

	//The formeters of the period that we need
	var scriptform = {
		"selectionStartDate": "",
		"selectionEndDate": "",
		"selectionChecked": "false"
	};

	//Read script settings
	var data = Banana.document.getScriptSettings();

	//Check if there are previously saved settings and read them
	if (data.length > 0) {
		try {
			var readSettings = JSON.parse(data);

			//We check if "readSettings" is not null, then we fill the formeters with the values just read
			if (readSettings) {
				scriptform = readSettings;
			}
		} catch (e) {}
	}

	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = Banana.document.startPeriod();
	var docEndDate = Banana.document.endPeriod();

	//A dialog window is opened asking the user to insert the desired period. By default is the accounting period
	var selectedDates = Banana.Ui.getPeriod(param.reportName, docStartDate, docEndDate,
			scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);

	//We take the values entered by the user and save them as "new default" values.
	//This because the next time the script will be executed, the dialog window will contains the new values.
	if (selectedDates) {
		scriptform["selectionStartDate"] = selectedDates.startDate;
		scriptform["selectionEndDate"] = selectedDates.endDate;
		scriptform["selectionChecked"] = selectedDates.hasSelection;

		//Save script settings
		var formToString = JSON.stringify(scriptform);
		var value = Banana.document.setScriptSettings(formToString);
	} else {
		//User clicked cancel
		return;
	}
	return scriptform;
}

/**************************************************************************************
*
* Styles
*
**************************************************************************************/

function createStyleSheet() {
    var stylesheet = Banana.Report.newStyleSheet();
 
    stylesheet.addStyle("@page", "margin:10mm 10mm 10mm 10mm");
    stylesheet.addStyle("body", "font-family:Helvetica; font-size:8pt");
    stylesheet.addStyle(".bold", "font-weight:bold;");
    stylesheet.addStyle(".right", "text-align:right;");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".italic", "font-style:italic");
 
    style = stylesheet.addStyle(".blackCell");
    style.setAttribute("background-color", "black");
    style.setAttribute("color","white");
 
    style = stylesheet.addStyle(".greyCell");
    style.setAttribute("background-color", "#A0A0A0");
 
    style = stylesheet.addStyle(".darkGreyCell");
    style.setAttribute("background-color", "#505050");
 
    style = stylesheet.addStyle(".lightGreyCell");
    style.setAttribute("background-color", "#DFDFDF");
 
    style = stylesheet.addStyle(".logostyle");
    style.setAttribute("padding-top", "0em");
    style.setAttribute("padding-left", "3em");
 
    /* table */
    var tableStyle = stylesheet.addStyle(".table");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".c1", "");
    stylesheet.addStyle(".c2", "");
    stylesheet.addStyle(".c3", "");
    stylesheet.addStyle(".c4", "");  
    stylesheet.addStyle("table.table td", "");
 
    // Inside header table
    var tableStyle = stylesheet.addStyle(".inTable");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle("table.table.inTable td", "border:thin solid black");
 
    // VAT declaration table
    var tableStyle = stylesheet.addStyle(".deductTable");
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("font-size", "9pt");
    stylesheet.addStyle(".colTable1", "");
    stylesheet.addStyle(".colTable2", "");
    stylesheet.addStyle(".colTable3", "");
    stylesheet.addStyle(".colTable4", "");
    stylesheet.addStyle(".colTable5", "");
    stylesheet.addStyle(".colTable6", "");
    stylesheet.addStyle(".colTable7", "");
    stylesheet.addStyle(".colTable8", "");
    stylesheet.addStyle(".colTable9", "");
    stylesheet.addStyle(".colTable10", "");
    stylesheet.addStyle(".colTable11", "");
    stylesheet.addStyle(".colTable12", "");
    stylesheet.addStyle(".colTable13", "");
    stylesheet.addStyle(".colTable14", "");
    stylesheet.addStyle(".colTable15", "");
    stylesheet.addStyle(".colTable16", "");
    stylesheet.addStyle(".colTable17", "");
    stylesheet.addStyle(".colTable18", "");
    stylesheet.addStyle(".colTable19", "");
    stylesheet.addStyle(".colTable20", "");
    stylesheet.addStyle("table.deductTable td", "border:thin solid black");

    // VAT declaration table
    var tableStyle = stylesheet.addStyle(".tableNoBorder");
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("font-size", "9pt");
    stylesheet.addStyle(".colTable1", "");
    stylesheet.addStyle(".colTable2", "");
    stylesheet.addStyle(".colTable3", "");
    stylesheet.addStyle(".colTable4", "");
    stylesheet.addStyle(".colTable5", "");
    stylesheet.addStyle(".colTable6", "");
    stylesheet.addStyle(".colTable7", "");
    stylesheet.addStyle(".colTable8", "");
    stylesheet.addStyle(".colTable9", "");
    stylesheet.addStyle(".colTable10", "");
    stylesheet.addStyle(".colTable11", "");
    stylesheet.addStyle(".colTable12", "");
    stylesheet.addStyle(".colTable13", "");
    stylesheet.addStyle(".colTable14", "");
    stylesheet.addStyle(".colTable15", "");
    stylesheet.addStyle(".colTable16", "");
    stylesheet.addStyle(".colTable17", "");
    stylesheet.addStyle(".colTable18", "");
    stylesheet.addStyle(".colTable19", "");
    stylesheet.addStyle(".colTable20", "");
    stylesheet.addStyle("table.tableNoBorder td", "");
 
    var tableStyle = stylesheet.addStyle(".tableDetails");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".col1", "width:20%");
    stylesheet.addStyle(".col2", "width:20%");
    stylesheet.addStyle(".col3", "width:20%");
    stylesheet.addStyle(".col4", "width:20%");
    stylesheet.addStyle(".col5", "width:20%");
    stylesheet.addStyle("table.tableDetails td", "");
 
    return stylesheet;
 }
