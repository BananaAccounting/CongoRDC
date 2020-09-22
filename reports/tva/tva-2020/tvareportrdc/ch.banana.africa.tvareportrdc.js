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
// @id = ch.banana.africa.tvareportrdc
// @api = 1.0
// @pubdate = 2020-06-27
// @publisher = Banana.ch SA
// @description = VAT Declaration (OHADA - RDC) [BETA]
// @description.fr = Taxe sur la valeur ajoutée TVA (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a VAT declaration for RDC.

*/

var param = {};

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
   var report = createVATDeclaration( current, dateForm.selectionStartDate, dateForm.selectionEndDate);
   var stylesheet = createStyleSheet();
   Banana.Report.preview(report, stylesheet);
}

/**************************************************************************************
*
* Function that creates and prints the VAT report
*
**************************************************************************************/
function createVATDeclaration(current, startDate, endDate, report) {

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

   // Extract data from journal and calculate balances
   var transactions = VatGetJournal(current, currentStartDate, currentEndDate);

   if (!report) {
      var report = Banana.Report.newReport("VAT Report");
   }

   // Header of the report
   var table = report.addTable("table");

   var col1 = table.addColumn("c1");
   col1.setStyleAttributes("width:25%");
   var col2 = table.addColumn("c2");
   col2.setStyleAttributes("width:25%");
   var col3 = table.addColumn("c3");
   col3.setStyleAttributes("width:25%");
   var col4 = table.addColumn("c4");
   col4.setStyleAttributes("width:25%");
   
   
   tableRow = table.addRow();
   tableRow.addCell("RÉPUBLIQUE DÉMOCRATIQUE DU CONGO", "",4);   

   tableRow = table.addRow();
   tableRow.addCell("MINISTÈRE DES FINANCES", "", 4);

   tableRow = table.addRow();
   tableRow.addImage("tvareportrdc/images/logo.jpg", "1.9cm", "1.9cm", "logostyle");
   cell_in = tableRow.addCell("", "", 2);

   var insideTable = cell_in.addTable("inTable");
   cell_in.setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black");

   row_in = insideTable.addRow();
   row_in.addCell("", "", 5);
   row_in = insideTable.addRow();
   row_in.addCell("DÉCLARATION DE LA TAXE SUR LA VALEUR AJOUTÉE", "center bold", 1).setStyleAttributes("border-top:thin solid black");
   row_in = insideTable.addRow();
   row_in.addCell("Mois de (2): " + currentMonth, "center bold", 1).setStyleAttributes("border-left:thin solid black");
   row_in = insideTable.addRow();
   row_in.addCell("(à souscrire obligatoirement au plus tard le 15 du mois suivant)", "center bold", 1);
   row_in = insideTable.addRow();
   row_in.addCell("", "center bold", 1);

   tableRow = table.addRow();
   tableRow.addCell("SERVICE (1):", "", 4);

   tableRow = table.addRow();
   tableRow.addCell("", "", 4);

   // VAT table
   var table = report.addTable("vatTable");
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
   
   var tableRow = table.addRow();
   tableRow.addCell("I. IDENTIFICATION DU REDEVABLE (3)", "bold", 11).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 9);

   tableRow = table.addRow();
   tableRow.addCell("Nom ou Raison sociale: " + company, "",8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("NUMÉRO IMPÔT", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell(fiscalNumber, "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("Sigle:", "", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Adresse Postale:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("Adresse Physique:", "", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Nº téléphone:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell(phoneNumber, "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(address, "", 8).setStyleAttributes("border-top:thin black solid;border-bottom:0px black solid");
   tableRow.addCell("Fax:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(state, "", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("E-mail:", "", 3).setStyleAttributes("border:thin black solid");
   tableRow.addCell(email, "", 9).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("II. OPÉRATIONS RÉALISÉES (4)", "bold", 8).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Chiffre d'affaires réalisé du mois*", "bold center", 4).setStyleAttributes("border:thin black solid;font-size:5px");
   tableRow.addCell("Chiffre d'affaires imposable du mois (a)", "bold center", 4).setStyleAttributes("border:thin black solid;font-size:5px");
   tableRow.addCell("TVA Collectée(b)=a * 16%", "bold center", 4).setStyleAttributes("border:thin black solid");

   /* Row 1: Livraisons de biens */
   tableRow = table.addRow();
   tableRow.addCell("1","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Livraisons de biens", "", 7).setStyleAttributes("border:thin black solid");
   var v1Taxable = VatGetGr1Balance(current, transactions, "1", 2, currentStartDate, currentEndDate);
   var v1Amount = VatGetGr1Balance(current, transactions, "1", 4, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a1 */
   tableRow.addCell(formatNumber(v1Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   /* b1 */
   tableRow.addCell(formatNumber(v1Amount), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 2: Prestations de services */
   tableRow = table.addRow();
   tableRow.addCell("2","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Prestations de services", "", 7).setStyleAttributes("border:thin black solid");
   var v2Taxable = VatGetGr1Balance(current, transactions, "2", 2, currentStartDate, currentEndDate);
   var v2Amount = VatGetGr1Balance(current, transactions, "2", 4, currentStartDate, currentEndDate);   
   var v2CA = VatGetGr1Balance(current, transactions, "2", 2, currentStartDate, currentEndDate);
   tableRow.addCell(formatNumber(v2CA), "center", 4).setStyleAttributes("border:thin black solid");
   /* a2 */
   tableRow.addCell(formatNumber(v2Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   /* b2 */
   tableRow.addCell(formatNumber(v2Amount), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 3: Livraisons de biens à soi-même */
   tableRow = table.addRow();
   tableRow.addCell("3","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Livraisons de biens à soi-même", "", 7).setStyleAttributes("border:thin black solid");
   var v3Taxable = VatGetGr1Balance(current, transactions, "3", 2, currentStartDate, currentEndDate);
   var v3Amount = VatGetGr1Balance(current, transactions, "3", 4, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a3 */
   tableRow.addCell(formatNumber(v3Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   /* b3 */
   tableRow.addCell(formatNumber(v3Amount), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 4: Prestations de services à soi-même */
   tableRow = table.addRow();
   tableRow.addCell("4","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Prestations de services à soi-même", "", 7).setStyleAttributes("border:thin black solid");
   var v4Taxable = VatGetGr1Balance(current, transactions, "4", 2, currentStartDate, currentEndDate);
   var v4Amount = VatGetGr1Balance(current, transactions, "4", 4, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a4 */
   tableRow.addCell(formatNumber(v4Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   /* b4 */
   tableRow.addCell(formatNumber(v4Amount), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 5: Opérations afférentes aux marchés publics à financement extérieur */
   tableRow = table.addRow();
   tableRow.addCell("5","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Opérations afférentes aux marchés publics à financement extérieur", "", 7).setStyleAttributes("border:thin black solid");
   var v5Taxable = VatGetGr1Balance(current, transactions, "5", 2, currentStartDate, currentEndDate);
   var v5Amount = VatGetGr1Balance(current, transactions, "5", 4, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a5 */
   tableRow.addCell(formatNumber(v5Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   /* b5 */
   tableRow.addCell(formatNumber(v5Amount), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 6: Exportations et opérations assimilées */
   tableRow = table.addRow();
   tableRow.addCell("6","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Exportations et opérations assimilées", "", 7).setStyleAttributes("border:thin black solid");
   var v6Taxable = VatGetGr1Balance(current, transactions, "6", 2, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a6 */
   tableRow.addCell(formatNumber(v6Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");

   /* Row 7: Opérations exonérées */
   tableRow = table.addRow();
   tableRow.addCell("7","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Opérations exonérées", "", 7).setStyleAttributes("border:thin black solid");
   var v7Taxable = VatGetGr1Balance(current, transactions, "7", 2, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a7 */
   tableRow.addCell(formatNumber(v7Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");

   /* Row 8: Opérations non imposables */
   tableRow = table.addRow();
   tableRow.addCell("8","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Opérations non imposables", "", 7).setStyleAttributes("border:thin black solid");
   var v8Taxable = VatGetGr1Balance(current, transactions, "8", 2, currentStartDate, currentEndDate);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a8 */
   tableRow.addCell(formatNumber(v8Taxable), "center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");

   /* Row 9: Total */
   tableRow = table.addRow();
   tableRow.addCell("9","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Total", "bold", 7).setStyleAttributes("border:thin black solid");
   var totalTaxable = 0;
   var totalVatAmount = 0;
   totalTaxable = Banana.SDecimal.add(totalTaxable, v1Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v2Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v3Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v4Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v5Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v6Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v7Taxable);
   totalTaxable = Banana.SDecimal.add(totalTaxable, v8Taxable);

   totalVatAmount = Banana.SDecimal.add(totalVatAmount, v1Amount);
   totalVatAmount = Banana.SDecimal.add(totalVatAmount, v2Amount);
   totalVatAmount = Banana.SDecimal.add(totalVatAmount, v3Amount);
   totalVatAmount = Banana.SDecimal.add(totalVatAmount, v4Amount);
   totalVatAmount = Banana.SDecimal.add(totalVatAmount, v5Amount);
   tableRow.addCell("", "greyCell", 4).setStyleAttributes("border:thin black solid");
   /* a9 */
   tableRow.addCell(formatNumber(totalTaxable), "center", 4).setStyleAttributes("border:thin black solid");
   /* b9 */
   tableRow.addCell(formatNumber(totalVatAmount), "center", 4).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("III. PRESTATIONS REÇUES DES PRESTATAIRES NON ÉTABLIS EN RDC", "bold", 12).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Montant des factures (c)", "bold center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("TVA Collectée(d)=c * 16%", "bold center", 4).setStyleAttributes("border:thin black solid");

   /* Row 10: Prestations reçues des prestataires non établis en RDC */
   tableRow = table.addRow();
   tableRow.addCell("10","center",1).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Prestations reçues des prestataires non établis en RDC", "", 11).setStyleAttributes("border:thin black solid");
   /* c10 */
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");
   /* d10 */
   tableRow.addCell("", "", 4).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("Prorata(5)      :    %", "bold", 7);
   tableRow.addCell(" ", "", 13);

   tableRow = table.addRow();
   tableRow.addCell("IV. DÉDUCTIONS/Taxe déductible sur:(6)", "bold", 7).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Importations (e)", "bold center", 5).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Local (f)", "bold center", 4).setStyleAttributes("border:thin black solid");
   tableRow.addCell("Total(g)=e + f", "bold center", 4).setStyleAttributes("border:thin black solid");

   /* Row 11: Immobilisations */
   tableRow = table.addRow();
   tableRow.addCell("11", "center", 1);
   tableRow.addCell("Immobilisations", "", 6).setStyleAttributes("border:thin black solid");
   var d11AmountE = VatGetGr1BalanceExtraInfo(current, transactions, "11", 3, "IMP", currentStartDate, currentEndDate);
   var d11AmountF = VatGetGr1BalanceExtraInfo(current, transactions, "11", 3, "", currentStartDate, currentEndDate);
   var total11G = 0;
   total11G = Banana.SDecimal.add(total11G, d11AmountE);
   total11G = Banana.SDecimal.add(total11G, d11AmountF);
   /* e11 */
   tableRow.addCell(formatNumber(d11AmountE), "center", 5).setStyleAttributes("border:thin black solid");
   /* f11 */
   tableRow.addCell(formatNumber(d11AmountF), "center", 4).setStyleAttributes("border:thin black solid");
   /* g11 */
   tableRow.addCell(formatNumber(total11G), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 12: Marchandises */
   tableRow = table.addRow();
   tableRow.addCell("12", "center", 1);
   tableRow.addCell("Marchandises", "", 6).setStyleAttributes("border:thin black solid");
   var d12AmountE = VatGetGr1BalanceExtraInfo(current, transactions, "12", 3, "IMP", currentStartDate, currentEndDate);
   var d12AmountF = VatGetGr1BalanceExtraInfo(current, transactions, "12", 3, "", currentStartDate, currentEndDate);
   var total12G = 0;
   total12G = Banana.SDecimal.add(total12G, d12AmountE);
   total12G = Banana.SDecimal.add(total12G, d12AmountF);
   /* e12 */
   tableRow.addCell(formatNumber(d12AmountE), "center", 5).setStyleAttributes("border:thin black solid");
   /* f12 */
   tableRow.addCell(formatNumber(d12AmountF), "center", 4).setStyleAttributes("border:thin black solid");
   /* g12 */
   tableRow.addCell(formatNumber(total12G), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 13: Matières premières */
   tableRow = table.addRow();
   tableRow.addCell("13", "center", 1);
   tableRow.addCell("Matières premières", "", 6).setStyleAttributes("border:thin black solid");
   var d13AmountE = VatGetGr1BalanceExtraInfo(current, transactions, "13", 3, "IMP", currentStartDate, currentEndDate);
   var d13AmountF = VatGetGr1BalanceExtraInfo(current, transactions, "13", 3, "", currentStartDate, currentEndDate);
   var total13G = 0;
   total13G = Banana.SDecimal.add(total13G, d13AmountE);
   total13G = Banana.SDecimal.add(total13G, d13AmountF);
   /* e13 */
   tableRow.addCell(formatNumber(d13AmountE), "center", 5).setStyleAttributes("border:thin black solid");
   /* f13 */
   tableRow.addCell(formatNumber(d13AmountF), "center", 4).setStyleAttributes("border:thin black solid");
   /* g13 */
   tableRow.addCell(formatNumber(total13G), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 14: Autres biens et services */
   tableRow = table.addRow();
   tableRow.addCell("14", "center", 1);
   tableRow.addCell("Autres biens et services", "", 6).setStyleAttributes("border:thin black solid");
   var d14AmountE = VatGetGr1BalanceExtraInfo(current, transactions, "14", 3, "IMP", currentStartDate, currentEndDate);
   var d14AmountF = VatGetGr1BalanceExtraInfo(current, transactions, "14", 3, "", currentStartDate, currentEndDate);
   var total14G = 0;
   total14G = Banana.SDecimal.add(total14G, d14AmountE);
   total14G = Banana.SDecimal.add(total14G, d14AmountF);
   /* e14 */
   tableRow.addCell(formatNumber(d14AmountE), "center", 5).setStyleAttributes("border:thin black solid");
   /* f14 */
   tableRow.addCell(formatNumber(d14AmountF), "center", 4).setStyleAttributes("border:thin black solid");
   /* g14 */
   tableRow.addCell(formatNumber(total14G), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 15: Total TVA déductible */
   tableRow = table.addRow();
   tableRow.addCell("15", "center", 1);
   tableRow.addCell("Total TVA déductible (g11+g12+g13+g14)", "", 6).setStyleAttributes("border:thin black solid");
   var total15E = 0;
   var total15F = 0;
   var total15G = 0;
   total15E = Banana.SDecimal.add(total15E, d11AmountE);
   total15E = Banana.SDecimal.add(total15E, d12AmountE);
   total15E = Banana.SDecimal.add(total15E, d13AmountE);
   total15E = Banana.SDecimal.add(total15E, d14AmountE);
   total15F = Banana.SDecimal.add(total15F, d11AmountF);
   total15F = Banana.SDecimal.add(total15F, d12AmountF);
   total15F = Banana.SDecimal.add(total15F, d13AmountF);
   total15F = Banana.SDecimal.add(total15F, d14AmountF);
   total15G = Banana.SDecimal.add(total15G, total11G);
   total15G = Banana.SDecimal.add(total15G, total12G);
   total15G = Banana.SDecimal.add(total15G, total13G);
   total15G = Banana.SDecimal.add(total15G, total14G);
   /* e15 */
   tableRow.addCell(formatNumber(total15E), "center", 5).setStyleAttributes("border:thin black solid");
   /* f15 */
   tableRow.addCell(formatNumber(total15F), "center", 4).setStyleAttributes("border:thin black solid");
   /* g15 */
   tableRow.addCell(formatNumber(total15G), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 16: Report de crédit du mois précédent */
   tableRow = table.addRow();
   tableRow.addCell("16", "center", 1);
   tableRow.addCell("Report de crédit du mois précédent (déclaration précédente, ligne 24)", "", 6).setStyleAttributes("border:thin black solid");
   var previousMonthCredit = getCredit(current, currentStartDate, currentEndDate);
   tableRow.addCell("", "lightGreyCell", 5).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "lightGreyCell", 4).setStyleAttributes("border:thin black solid");
   /* g16 */
   tableRow.addCell(formatNumber(previousMonthCredit), "center", 4).setStyleAttributes("border:thin black solid");

   /* Row 17: Montant de la TVA déductible */
   tableRow = table.addRow();
   tableRow.addCell("17", "center", 1);
   tableRow.addCell("Montant de la TVA déductible (g15+g16)", "", 6).setStyleAttributes("border:thin black solid");
   var vatAmountDeductible = 0;
   vatAmountDeductible = Banana.SDecimal.add(vatAmountDeductible, total15G);
   vatAmountDeductible = Banana.SDecimal.add(vatAmountDeductible, previousMonthCredit);
   tableRow.addCell("", "lightGreyCell", 5).setStyleAttributes("border:thin black solid");
   tableRow.addCell("", "lightGreyCell", 4).setStyleAttributes("border:thin black solid");
   /* g17 */
   tableRow.addCell(formatNumber(vatAmountDeductible), "center", 4).setStyleAttributes("border:thin black solid");

   tableRow = table.addRow();
   tableRow.addCell("V. RÉGULARISATIONS (7)", "bold", 7);
   tableRow.addCell("h", "center", 10);
   tableRow.addCell("", "", 3);

   /* Row 18: Reversement de TVA */
   tableRow = table.addRow();
   tableRow.addCell("18", "center", 1);
   tableRow.addCell("Reversement de TVA", "", 6);
   var r18Amount = VatGetGr1BalanceExtraInfo(current, transactions, "V-18", 3, "", currentStartDate, currentEndDate);
   /* h18 */
   tableRow.addCell(formatNumber(Banana.SDecimal.invert(r18Amount)), "center", 5);
   tableRow.addCell("", "darkGreyCell", 5);

   /* Row 19: Complément de déduction */
   tableRow = table.addRow();
   tableRow.addCell("19", "center", 1);
   tableRow.addCell("Complément de déduction", "", 6);
   var r19Amount = VatGetGr1BalanceExtraInfo(current, transactions, "V-19", 3, "", currentStartDate, currentEndDate);
   tableRow.addCell("", "darkGreyCell", 5);
   /* h19 */
   tableRow.addCell(formatNumber(r19Amount), "center", 5);

   /* Row 20: TVA retenue à la source par les entreprises minières */
   tableRow = table.addRow();
   tableRow.addCell("20", "center", 1);
   tableRow.addCell("TVA retenue à la source par les entreprises minières", "", 6).setStyleAttributes("font-size:6px");
   var r20Amount = VatGetGr1BalanceExtraInfo(current, transactions, "V-20", 3, "", currentStartDate, currentEndDate);
   tableRow.addCell("", "darkGreyCell", 5);
   /* h20 */
   tableRow.addCell(formatNumber(r20Amount), "center", 5);

   /* Row 21: Récupération de la TVA déductible sur marchés publics à financement extérieur */
   tableRow = table.addRow();
   tableRow.addCell("21", "center", 1);
   tableRow.addCell("Récupération de la TVA déductible sur marchés publics à financement extérieur", "", 6);
   var r21Amount = VatGetGr1BalanceExtraInfo(current, transactions, "V-21", 3, "", currentStartDate, currentEndDate);
   /* h21 */
   tableRow.addCell(formatNumber(r21Amount), "center", 5);
   tableRow.addCell("", "darkGreyCell", 5);

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 20);

   tableRow = table.addRow();
   tableRow.addCell("VI. CALCUL DE L'IMPÔT (8)", "bold", 7);
   tableRow.addCell("i", "center", 10);

   /* Row 22: TVA nette à verser */
   tableRow = table.addRow();
   tableRow.addCell("22", "center", 1);
   tableRow.addCell("TVA nette à verser (b9+d10+h18-g17-h19-h20-b5)", "", 6);
   var netVatAmount = 0;
   var vatCredit = 0;
   var sumAmount1 = 0; // b9 + d10 + h18
   var sumAmount2 = 0; // b5 + g17 + h19 + h20
   sumAmount1 = Banana.SDecimal.add(sumAmount1, totalVatAmount);
   sumAmount1 = Banana.SDecimal.add(sumAmount1, Banana.SDecimal.invert(r18Amount));
   sumAmount2 = Banana.SDecimal.add(sumAmount2, v5Amount);
   sumAmount2 = Banana.SDecimal.add(sumAmount2, vatAmountDeductible);
   sumAmount2 = Banana.SDecimal.add(sumAmount2, r19Amount);
   sumAmount2 = Banana.SDecimal.add(sumAmount2, r20Amount);
   
   if (month != 2) {
      if(sumAmount1 > sumAmount2) {
         vatCredit = "";      
         netVatAmount = Banana.SDecimal.add(netVatAmount, totalVatAmount);
         netVatAmount = Banana.SDecimal.add(netVatAmount, Banana.SDecimal.invert(r18Amount));
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, vatAmountDeductible);
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, r19Amount);
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, r20Amount);
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, v5Amount);
      } else if(sumAmount2 > sumAmount1) {
         netVatAmount = "";      
         vatCredit = Banana.SDecimal.add(vatCredit, vatAmountDeductible);
         vatCredit = Banana.SDecimal.add(vatCredit, r19Amount);
         vatCredit = Banana.SDecimal.add(vatCredit, r20Amount);
         vatCredit = Banana.SDecimal.add(vatCredit, v5Amount);
         vatCredit = Banana.SDecimal.subtract(vatCredit, totalVatAmount);
         vatCredit = Banana.SDecimal.subtract(vatCredit, Banana.SDecimal.invert(r18Amount));
      }
   } else {
      if(Number(sumAmount1) > Number(sumAmount2)) {
         vatCredit = "";      
         netVatAmount = Banana.SDecimal.add(netVatAmount, totalVatAmount);
         netVatAmount = Banana.SDecimal.add(netVatAmount, Banana.SDecimal.invert(r18Amount));
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, vatAmountDeductible);
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, r19Amount);
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, r20Amount);
         netVatAmount = Banana.SDecimal.subtract(netVatAmount, v5Amount);
      } else if(Number(sumAmount2) > Number(sumAmount1)) {
         netVatAmount = "";      
         vatCredit = Banana.SDecimal.add(vatCredit, vatAmountDeductible);
         vatCredit = Banana.SDecimal.add(vatCredit, r19Amount);
         vatCredit = Banana.SDecimal.add(vatCredit, r20Amount);
         vatCredit = Banana.SDecimal.add(vatCredit, v5Amount);
         vatCredit = Banana.SDecimal.subtract(vatCredit, totalVatAmount);
         vatCredit = Banana.SDecimal.subtract(vatCredit, Banana.SDecimal.invert(r18Amount));
         vatCredit = sumAmount2;
      }
   }
   /* i22 */
   tableRow.addCell(formatNumber(netVatAmount), "center", 5);
   tableRow.addCell("", "darkGreyCell", 5);

   /* Row 23: Crédit de TVA */
   tableRow = table.addRow();
   tableRow.addCell("23", "center", 1);
   tableRow.addCell("Crédit de TVA (g17+h19+h20+b5-b9-d10-h18)", "", 6);
   tableRow.addCell("", "darkGreyCell", 5);
   /* i23 */
   tableRow.addCell(formatNumber(vatCredit), "center", 5);

   /* Row 24: Remboursement de crédit de TVA demandé */
   tableRow = table.addRow();
   tableRow.addCell("24", "center", 1);
   tableRow.addCell("Remboursement de crédit de TVA demandé (montant figurant sur la demande de remboursement)", "", 6);
   tableRow.addCell("", "center", 5);
   tableRow.addCell("", "darkGreyCell", 5);

   /* Row 25: Crédit de TVA reportable */
   tableRow = table.addRow();
   tableRow.addCell("25", "center", 1);
   tableRow.addCell("Crédit de TVA reportable (i23-i24)", "", 6);
   tableRow.addCell("", "darkGreyCell", 5);
   tableRow.addCell("", "center", 5);

   /* Row 26: TVA sur marchés publics à financement extérieur */
   tableRow = table.addRow();
   tableRow.addCell("26", "center", 1);
   tableRow.addCell("TVA sur marchés publics à financement extérieur (case b5)", "", 6);
   /* i26 */
   tableRow.addCell(formatNumber(v5Amount), "center", 5);
   tableRow.addCell("", "greyCell", 5);

   /* Row 27: TVA POUR COMPTE DES TIERS */
   tableRow = table.addRow();
   tableRow.addCell("27", "center", 1);
   tableRow.addCell("TVA POUR COMPTE DES TIERS", "bold", 6);
   tableRow.addCell("", "center", 5);
   tableRow.addCell("", "greyCell", 5);

   /* Row 28: MONTANT À PAYER */
   tableRow = table.addRow();
   tableRow.addCell("28", "center", 1);
   tableRow.addCell("MONTANT À PAYER (i22+i26+i27)", "bold", 6);
   tableRow.addCell("", "center", 5);
   tableRow.addCell("", "greyCell", 5);

   tableRow = table.addRow();
   tableRow.addCell("MODE DE PAIEMENT (9)", "bold", 7);
   tableRow.addCell(" ", "", 13);

   tableRow = table.addRow();
   tableRow.addCell("AVIS DE CERTIFICATION", "", 7);
   tableRow.addCell("", "", 2);
   tableRow.addCell("CHÈQUE CERTIFIÉ", "", 4).setStyleAttributes("padding-left:10px");
   tableRow.addCell("", "", 2);
   tableRow.addCell("VIREMENT", "center", 3);
   tableRow.addCell("", "", 2);

   // Signature and others

   var table = report.addTable("table");

   var col1 = table.addColumn("c1");
   col1.setStyleAttributes("width:25%");
   var col2 = table.addColumn("c2");
   col2.setStyleAttributes("width:25%");
   var col3 = table.addColumn("c3");
   col3.setStyleAttributes("width:25%");
   var col4 = table.addColumn("c4");
   col4.setStyleAttributes("width:25%");

   var tableRow = table.addRow();
   tableRow.addCell("", "", 4);

   tableRow = table.addRow();
   tableRow.addCell("", "", 2);
   tableRow.addCell("Fait à       " + city, "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold");  
   tableRow.addCell(",le " + formatDate(today), "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold"); 

   tableRow = table.addRow();
   tableRow.addCell("Déclaré conforme à nos écritures,", "", 4).setStyleAttributes("padding-left:40px;font-size:6.5px;font-weight:bold");

   tableRow = table.addRow();
   tableRow.addCell("Sceau de l'entreprise", "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold");
   tableRow.addCell("Nom et qualité du signataire (10)", "", 2).setStyleAttributes("font-size:6.5px;font-weight:bold");  
   tableRow.addCell("Signature", "", 1).setStyleAttributes("font-size:6.5px;font-weight:bold"); 

   tableRow = table.addRow();
   tableRow.addCell("", "", 4);

   var table = report.addTable("vatTable");
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

   var tableRow = table.addRow();
   tableRow.addCell("VIII. RÉSERVÉ À L'ADMINISTRATION (11)", "bold", 20);

   tableRow = table.addRow();
   tableRow.addCell("Nº de la Quittance", "", 7);
   tableRow.addCell("Date de la Quittance", "", 6);
   tableRow.addCell("Cachet de l'Administration", "", 7);

   tableRow = table.addRow();
   tableRow.addCell("", "", 7);
   tableRow.addCell("", "", 6);
   tableRow.addCell("", "", 7);

   var table = report.addTable("table");

   var col1 = table.addColumn("c1");
   col1.setStyleAttributes("width:25%");
   var col2 = table.addColumn("c2");
   col2.setStyleAttributes("width:25%");
   var col3 = table.addColumn("c3");
   col3.setStyleAttributes("width:25%");
   var col4 = table.addColumn("c4");
   col4.setStyleAttributes("width:25%");

   var tableRow = table.addRow();
   tableRow.addCell("IMPORTANT", "bold italic", 20).setStyleAttributes("font-size:7px;padding-left:15px");

   tableRow = table.addRow();
   tableRow.addCell("Cette impression ne peut pas être envoyée aux services des impôts.", "bold", 20).setStyleAttributes("font-size:7px;padding-left:15px");

   tableRow = table.addRow();
   tableRow.addCell("Copier les données sur le formulaire officiel.", "bold", 20).setStyleAttributes("font-size:7px;padding-left:15px");

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

/**************************************************************************************
*
* Fromat functions 
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

/**************************************************************************************
*
* VAT functions 
*
**************************************************************************************/

/* Function that checks for all the used vat codes without Gr1 and prints a warning message */
function VatUsedVatCodeWithInappropriateGr1HaveGr1(banDoc, report) {

	// Get all the vat codes used on the Transactions table
	var usedVatCodes = VatCodeUsedInTransactions(banDoc);

	// For each code checks if on the VatCodes table there is a Gr1
	// Shows a warning message in red for all the vat codes without the Gr1
	var codesWithoutGr1 = [];

	// Save all the vat codes without Gr1 into an array
	for (var i = 0; i < usedVatCodes.length; i++) {
		var gr1 = VatGetVatCodesForGr1(banDoc, usedVatCodes[i]);
		if (!gr1) {
			codesWithoutGr1.push(usedVatCodes[i]);
		}
	}

	// Print all the warning messages
	for (var i = 0; i < codesWithoutGr1.length; i++) {
		report.addParagraph(param.checkVatCode4 + codesWithoutGr1[i] + param.checkVatCode5, "red");
	}
}

/* Function that retrieves the total vat from Banana */
function VatGetTotalFromBananaVatReport(banDoc, startDate, endDate) {
	var vatReportTable = banDoc.vatReport(startDate, endDate);
	var res = "";

	for (var i = 0; i < vatReportTable.rowCount; i++) {
		var tRow = vatReportTable.row(i);
		var group = tRow.value("Group");

		//The balance is summed in group named "_tot_"
		if (group === "_tot_") {
			res = tRow.value("VatBalance"); //VatAmount VatBalance

			// //In order to compare correctly the values we have to invert the sign of the result from Banana (if negative)
			// if (Banana.SDecimal.sign(totalFromBanana) == -1) {
			//     totalFromBanana = Banana.SDecimal.invert(totalFromBanana);
			// }
		}
	}
	return res;
}

/* checks all the vat/gr1 codes used in the transactions.
*  Add a warning message (red) to the report if codes with not appropriate Gr1 are used */
function VatUsedVatCodeWithInappropriateGr1(param, banDoc, report) {
	var usedGr1Codes = [];
	var vatCodes = VatCodeUsedInTransactions(banDoc);
	for (var i = 0; i < vatCodes.length; i++) {
		var gr1Codes = VatGetVatCodesForGr1(banDoc, vatCodes[i]);
		for (var j = 0; j < gr1Codes.length; j++) {
			usedGr1Codes.push(gr1Codes[j]);
		}
	}

	//Removing duplicates
	for (var i = 0; i < usedGr1Codes.length; i++) {
		for (var x = i + 1; x < usedGr1Codes.length; x++) {
			if (usedGr1Codes[x] === usedGr1Codes[i]) {
				usedGr1Codes.splice(x, 1);
				--x;
			}
		}
	}

	for (var j = 0; j < usedGr1Codes.length; j++) {
		if (usedGr1Codes[j] !== "1" &&
			usedGr1Codes[j] !== "1a" &&
			usedGr1Codes[j] !== "1b" &&
			usedGr1Codes[j] !== "1c" &&
			usedGr1Codes[j] !== "1d" &&
			usedGr1Codes[j] !== "1e" &&
			usedGr1Codes[j] !== "1f" &&
			usedGr1Codes[j] !== "1g" &&
			usedGr1Codes[j] !== "2" &&
			usedGr1Codes[j] !== "3" &&
			usedGr1Codes[j] !== "4" &&
			usedGr1Codes[j] !== "5" &&
			usedGr1Codes[j] !== "6" &&
			usedGr1Codes[j] !== "7" &&
			usedGr1Codes[j] !== "8" &&
			usedGr1Codes[j] !== "9" &&
			usedGr1Codes[j] !== "10" &&
			usedGr1Codes[j] !== "11" &&
			usedGr1Codes[j] !== "12" &&
			usedGr1Codes[j] !== "13" &&
			usedGr1Codes[j] !== "14" &&
			usedGr1Codes[j] !== "xxx" &&
			usedGr1Codes[j] !== "") {
			report.addParagraph("VAT code " + " '" + usedGr1Codes[j] + "' " + " invalid", "red");
		}
	}
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

/* Returns an array with all the vat codes used in the Transactions table */
function VatCodeUsedInTransactions(banDoc) {
	var str = [];
	var table = banDoc.table("Transactions");
	if (table === undefined || !table) {
		return str;
	}
	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		var vatRow = tRow.value("VatCode");

		if (vatRow) {
			var code = vatRow.split(";");
			for (var j = 0; j < code.length; j++) {
				if (code[j]) {
					str.push(code[j]);
				}
			}
		}
	}
	//Removing duplicates
	for (var i = 0; i < str.length; i++) {
		for (var x = i + 1; x < str.length; x++) {
			if (str[x] === str[i]) {
				str.splice(x, 1);
				--x;
			}
		}
	}
	//Return the array
	return str;
}

/* Function that returns the lines from the journal as an array */
function VatGetJournal(banDoc, startDate, endDate) {

	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	var len = journal.rowCount;
	var transactions = []; //Array that will contain all the lines of the transactions

	for (var i = 0; i < len; i++) {

		var line = {};
		var tRow = journal.row(i);

		if (tRow.value("JDate") >= startDate && tRow.value("JDate") <= endDate) {

			line.date = tRow.value("JDate");
			line.account = tRow.value("JAccount");
			line.vatcode = tRow.value("JVatCodeWithoutSign");
			line.doc = tRow.value("Doc");
			line.description = tRow.value("Description");
			line.isvatoperation = tRow.value("JVatIsVatOperation");
			

			//We take only the rows with a VAT code and then we convert values from base currency to CHF
			if (line.isvatoperation) {

				line.vattaxable = tRow.value("JVatTaxable");
				line.vatamount = tRow.value("VatAmount");
				line.vatposted = tRow.value("VatPosted");
				line.amount = tRow.value("JAmount");
				line.vatextrainfo = tRow.value("VatExtraInfo");

				transactions.push(line);
			}
		}
	}
	return transactions;
}

/* Sums the vat amounts for the specified vat code and period retrieved from transactions (converted journal's lines)
Returns an object containing {vatTaxable, vatPosted, vatAmount} 
extraInfo is "*" for all or a specific value, inclusive void 
*/
function VatGetVatCodesBalanceExtraInfo(transactions, vatCodes, vatExtraInfo, startDate, endDate) {

	var sDate = Banana.Converter.toDate(startDate);
	var eDate = Banana.Converter.toDate(endDate);
	var vattaxable = "";
	var vatposted = "";
	var vatamount = "";
	var currentBal = {};

		for (var i = 0; i < transactions.length; i++) {
         var row = transactions[i];
         var tDate = Banana.Converter.toDate(row.date);
			if (tDate >= sDate && tDate <= eDate) {
            for (var j = 0; j < vatCodes.length; j++) {
				if (vatCodes[j] === row.vatcode) {
					if (vatExtraInfo === "*" || vatExtraInfo === row.vatextrainfo) { // The VatExtraInfo column is not used
						vattaxable = Banana.SDecimal.add(vattaxable, row.vattaxable);
						vatposted = Banana.SDecimal.add(vatposted, row.vatposted);
						vatamount = Banana.SDecimal.add(vatamount, row.vatamount);
					}
					
				}
			}
		}
	}
   currentBal.vatTaxable = vattaxable;
   currentBal.vatPosted = vatposted;
   currentBal.vatAmount = vatamount;
   return currentBal;
}

/* Retrieve the Vat value for a specific gr1 Codes
*  grCodes can be more then one, sepatated by ";"
*  vatClass determines the return value  */
function VatGetGr1Balance(banDoc, transactions, grCodes, vatClass, startDate, endDate) {

   return VatGetGr1BalanceExtraInfo(banDoc, transactions, grCodes, vatClass, "*", startDate, endDate);
   
}


/* Retrieve the Vat value for a specific gr1 Codes
*  grCodes can be more then one, sepatated by ";"
*  vatClass determines the return value  
*  extraInfo is "*" for all or a specific value, inclusive void */
function VatGetGr1BalanceExtraInfo(banDoc, transactions, grCodes, vatClass, vatExtraInfo, startDate, endDate) {

	var vatCodes = VatGetVatCodesForGr(banDoc, grCodes, 'Gr1');

	//Sum the vat amounts for the specified vat code and period
	var currentBal = VatGetVatCodesBalanceExtraInfo(transactions, vatCodes, vatExtraInfo, startDate, endDate);

	//The "vatClass" decides which value to use
	if (vatClass == "1") {
		// Recoverable VAT Taxable (VAT netto)
		return currentBal.vatTaxable;
	} else if (vatClass == "2") {
		// Due  VAT Taxable
		return Banana.SDecimal.invert(currentBal.vatTaxable);
	} else if (vatClass == "3") {
		// Recoverable VAT posted (VAT Amount)
		return currentBal.vatPosted;
	} else if (vatClass == "4") {
		// Due  VAT posted  (VAT Amount)
		return Banana.SDecimal.invert(currentBal.vatPosted);
	} else if (vatClass == "5") {
		// Recoverable VAT gross amount (VAT taxable + VAT amount)
		return Banana.SDecimal.add(currentBal.vatTaxable, currentBal.vatAmount);
	} else if (vatClass == "6") {
		// Due VAT gross amount (VAT taxable + VAT amount)
		return Banana.SDecimal.invert(Banana.SDecimal.add(currentBal.vatTaxable, currentBal.vatAmount));
	}
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

/* Get report de credit from the transactions journal */
function getCredit(banDoc, startDate, endDate) {
   return getAmount(banDoc, "Gr=4449","balance", startDate, endDate);
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

   stylesheet.addStyle("@page", "margin:1mm 5mm 1mm 5mm;border:2px black solid");
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
   var tableStyle = stylesheet.addStyle(".vatTable");
   tableStyle.setAttribute("width", "100%");
   tableStyle.setAttribute("font-size", "6.5");
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
   stylesheet.addStyle("table.vatTable td", "border:thin solid black;padding-top:2px;padding-bottom:2px");

   var tableStyle = stylesheet.addStyle(".tableCashFlow");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".col1", "width:5%");
   stylesheet.addStyle(".col2", "width:60%");
   stylesheet.addStyle(".col3", "width:5%");
   stylesheet.addStyle(".col4", "width:15%");
   stylesheet.addStyle(".col5", "width:15%");
   stylesheet.addStyle("table.tableCashFlow td", "border:thin solid black;padding-bottom:2px;padding-top:5px");

   return stylesheet;
}
