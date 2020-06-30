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
// @id = ch.banana.africa.prifitlossstatementrdc
// @api = 1.0
// @pubdate = 2019-12-06
// @publisher = Banana.ch SA
// @description = Profit/Loss Statement Report (OHADA - RDC) [BETA]
// @description.fr = Compte de résultat (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a Profit & Loss Statement report for RDC.

*/

function exec() {

   var dateForm = getPeriodSettings("Select Date");
   if (!dateForm) {
      return;
   }

   // CURRENT year file: the current opened document in Banana */
   var current = Banana.document;
   if (!current) {
      return "@Cancel";
   }

   // PREVIOUS year file: Return the previous year document.
   // If the previous year is not defined or it is not foud it returns null */
   var previous = Banana.document.previousYear();

   var report = createProfitLossStatementReport(current, previous, dateForm.selectionStartDate, dateForm.selectionEndDate);
   var stylesheet = createStyleSheet();
   Banana.Report.preview(report, stylesheet);
}


/**************************************************************************************
*
* Function that create the report
*
**************************************************************************************/
function createProfitLossStatementReport(current, previous, startDate, endDate, report) {

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
   var previousYear = currentYear-1;
   var company = current.info("AccountingDataBase","Company");
   var address = current.info("AccountingDataBase","Address1");
   var city = current.info("AccountingDataBase","City");
   var state = current.info("AccountingDataBase","State");
   var months = monthDiff(Banana.Converter.toDate(currentEndDate), Banana.Converter.toDate(currentStartDate));
   var fiscalNumber = current.info("AccountingDataBase","FiscalNumber");
   var vatNumber = current.info("AccountingDataBase","VatNumber");

   if (previous) {
      // Accounting period for the previous year file
      var previousStartDate = previous.info("AccountingDataBase","OpeningDate");
      var previousEndDate = previous.info("AccountingDataBase","ClosureDate");
      var previousYear = Banana.Converter.toDate(previousStartDate).getFullYear();
   }

   if (!report) {
      var report = Banana.Report.newReport("Compte de résultat");
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
   report.addParagraph("COMPTE DE RESULTAT AU 31 DECEMBRE " + currentYear,"bold center");
   report.addParagraph(" ", "");

   // Table with cash flow data
   var table = report.addTable("tableProfitLossStatement");
   var col1 = table.addColumn("plCol1");
   var col2 = table.addColumn("plCol2");
   var col3 = table.addColumn("plCol3");
   var col4 = table.addColumn("plCol4");
   var col5 = table.addColumn("plCol5");
   var col6 = table.addColumn("plCol6");
   var tableRow;
   
   tableRow = table.addRow();
   tableRow.addCell("REF","bold center",1);
   tableRow.addCell("LIBELLES","bold center",1);
   tableRow.addCell("", "bold center", 1);
   tableRow.addCell("Note","bold center",1);
   var cell = tableRow.addCell("","bold center",1);
   cell.addParagraph("EXERCICE AU 31/12/" + currentYear,"center");
   cell.addParagraph(" ", "");
   cell.addParagraph("NET", "");
   var cell = tableRow.addCell("","bold center",1);
   cell.addParagraph("EXERCICE AU 31/12/" + previousYear,"center");
   cell.addParagraph(" ", "");
   cell.addParagraph("NET", "");

   /* Row 1: TA */
   var TA_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TA','balance',currentStartDate,currentEndDate));
   var TA_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TA','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TA","",1);
   tableRow.addCell("Ventes de marchandises","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TA_exerciceN),"right",1);
   tableRow.addCell(formatValues(TA_exerciceN1),"right",1);

   /* Row 2: RA */
   var RA_exerciceN = getAmount(current,'Gr=RA','balance',currentStartDate,currentEndDate);
   var RA_exerciceN1 = getAmount(previous,'Gr=RA','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RA","",1);
   tableRow.addCell("Achats de marchandises","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("22","",1);
   tableRow.addCell(formatValues(RA_exerciceN),"right",1);
   tableRow.addCell(formatValues(RA_exerciceN1),"right",1);

   /* Row 3: RB */
   var RB_exerciceN = getAmount(current,'Gr=RB','balance',currentStartDate,currentEndDate);
   var RB_exerciceN1 = getAmount(previous,'Gr=RB','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RB","",1);
   tableRow.addCell("Variation de stocks de marchandises","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("6","",1);
   tableRow.addCell(formatValues(RB_exerciceN),"right",1);
   tableRow.addCell(formatValues(RB_exerciceN1),"right",1);

   /* Row 4: XA */
   var XA_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=132','balance',currentStartDate,currentEndDate));
   var XA_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=132','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XA","greyCell bold",1);
   tableRow.addCell("MARGE COMMERCIALE (Somme TA à RB)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XA_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XA_exerciceN1),"right greyCell bold",1);

   /* Row 5: TB */
   var TB_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TB','balance',currentStartDate,currentEndDate));
   var TB_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TB','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TB","",1);
   tableRow.addCell("Ventes de produits fabriqués","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TB_exerciceN),"right",1);
   tableRow.addCell(formatValues(TB_exerciceN1),"right",1);

   /* Row 6: TC */
   var TC_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TC','balance',currentStartDate,currentEndDate));
   var TC_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TC','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TC","",1);
   tableRow.addCell("Travaux, services vendus","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TC_exerciceN),"right",1);
   tableRow.addCell(formatValues(TC_exerciceN1),"right",1);

   /* Row 7: TD */
   var TD_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TD','balance',currentStartDate,currentEndDate));
   var TD_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TD','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TD","",1);
   tableRow.addCell("Produits accessoires","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TD_exerciceN),"right",1);
   tableRow.addCell(formatValues(TD_exerciceN1),"right",1);

   /* Row 8: XB 
      TA + TB + TC + TD
   */
   var XB_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TA|TB|TC|TD','balance',currentStartDate,currentEndDate));
   var XB_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TA|TB|TC|TD','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XB","greyCell bold",1);
   tableRow.addCell("CHIFFRE D'AFFAIRES (A + B + C + D)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XB_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XB_exerciceN1),"right greyCell bold",1);

   /* Row 9: TE */
   var TE_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TE','balance',currentStartDate,currentEndDate));
   var TE_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TE','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TE","",1);
   tableRow.addCell("Production stockée (ou déstockage)","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("6","",1);
   tableRow.addCell(formatValues(TE_exerciceN),"right",1);
   tableRow.addCell(formatValues(TE_exerciceN1),"right",1);

   /* Row 9: TF */
   var TF_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TF','balance',currentStartDate,currentEndDate));
   var TF_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TF','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TF","",1);
   tableRow.addCell("Production immobilisée","",1);
   tableRow.addCell("","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TF_exerciceN),"right",1);
   tableRow.addCell(formatValues(TF_exerciceN1),"right",1);

   /* Row 10: TG */
   var TG_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TG','balance',currentStartDate,currentEndDate));
   var TG_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TG','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TG","",1);
   tableRow.addCell("Subventions d’exploitation","",1);
   tableRow.addCell("","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TG_exerciceN),"right",1);
   tableRow.addCell(formatValues(TG_exerciceN1),"right",1);

   /* Row 10: TH */
   var TH_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TH','balance',currentStartDate,currentEndDate));
   var TH_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TH','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TH","",1);
   tableRow.addCell("Autres produits","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("21","",1);
   tableRow.addCell(formatValues(TH_exerciceN),"right",1);
   tableRow.addCell(formatValues(TH_exerciceN1),"right",1);

   /* Row 10: TI */
   var TI_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TI','balance',currentStartDate,currentEndDate));
   var TI_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TI','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TI","",1);
   tableRow.addCell("Transferts de charges d'exploitation","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("12","",1);
   tableRow.addCell(formatValues(TI_exerciceN),"right",1);
   tableRow.addCell(formatValues(TI_exerciceN1),"right",1);

   /* Row 11: RC */
   var RC_exerciceN = getAmount(current,'Gr=RC','balance',currentStartDate,currentEndDate);
   var RC_exerciceN1 = getAmount(previous,'Gr=RC','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RC","",1);
   tableRow.addCell("Achats de matières premières et fournitures liées","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("22","",1);
   tableRow.addCell(formatValues(RC_exerciceN),"right",1);
   tableRow.addCell(formatValues(RC_exerciceN1),"right",1);

   /* Row 12: RD */
   var RD_exerciceN = getAmount(current,'Gr=RD','balance',currentStartDate,currentEndDate);
   var RD_exerciceN1 = getAmount(previous,'Gr=RD','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RD","",1);
   tableRow.addCell("Variation de stocks de matières premières et fournitures liées","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("6","",1);
   tableRow.addCell(formatValues(RD_exerciceN),"right",1);
   tableRow.addCell(formatValues(RD_exerciceN1),"right",1);

   /* Row 13: RE */
   var RE_exerciceN = getAmount(current,'Gr=RE','balance',currentStartDate,currentEndDate);
   var RE_exerciceN1 = getAmount(previous,'Gr=RE','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RE","",1);
   tableRow.addCell("Autres achats","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("22","",1);
   tableRow.addCell(formatValues(RE_exerciceN),"right",1);
   tableRow.addCell(formatValues(RE_exerciceN1),"right",1);

   /* Row 14: RF */
   var RF_exerciceN = getAmount(current,'Gr=RF','balance',currentStartDate,currentEndDate);
   var RF_exerciceN1 = getAmount(previous,'Gr=RF','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RF","",1);
   tableRow.addCell("Variation de stocks d’autres approvisionnements","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("6","",1);
   tableRow.addCell(formatValues(RF_exerciceN),"right",1);
   tableRow.addCell(formatValues(RF_exerciceN1),"right",1);

   /* Row 15: RG */
   var RG_exerciceN = getAmount(current,'Gr=RG','balance',currentStartDate,currentEndDate);
   var RG_exerciceN1 = getAmount(previous,'Gr=RG','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RG","",1);
   tableRow.addCell("Transports","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("23","",1);
   tableRow.addCell(formatValues(RG_exerciceN),"right",1);
   tableRow.addCell(formatValues(RG_exerciceN1),"right",1);

   /* Row 16: RH */
   var RH_exerciceN = getAmount(current,'Gr=RH','balance',currentStartDate,currentEndDate);
   var RH_exerciceN1 = getAmount(previous,'Gr=RH','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RH","",1);
   tableRow.addCell("Services extérieurs","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("24","",1);
   tableRow.addCell(formatValues(RH_exerciceN),"right",1);
   tableRow.addCell(formatValues(RH_exerciceN1),"right",1);

   /* Row 17: RI */
   var RI_exerciceN = getAmount(current,'Gr=RI','balance',currentStartDate,currentEndDate);
   var RI_exerciceN1 = getAmount(previous,'Gr=RI','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RI","",1);
   tableRow.addCell("Impôts et taxes","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("25","",1);
   tableRow.addCell(formatValues(RI_exerciceN),"right",1);
   tableRow.addCell(formatValues(RI_exerciceN1),"right",1);

   /* Row 18: RJ */
   var RJ_exerciceN = getAmount(current,'Gr=RJ','balance',currentStartDate,currentEndDate);
   var RJ_exerciceN1 = getAmount(previous,'Gr=RJ','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RJ","",1);
   tableRow.addCell("Autres charges","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("26","",1);
   tableRow.addCell(formatValues(RJ_exerciceN),"right",1);
   tableRow.addCell(formatValues(RJ_exerciceN1),"right",1);

   /* Row 19: XC */
   var XC_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=133','balance',currentStartDate,currentEndDate));
   var XC_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=133','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XC","greyCell bold",1);
   tableRow.addCell("VALEUR AJOUTEE (XB+RA+RB) + (somme TE à RJ)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XC_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XC_exerciceN1),"right greyCell bold",1);

   /* Row 20: RK */
   var RK_exerciceN = getAmount(current,'Gr=RK','balance',currentStartDate,currentEndDate);
   var RK_exerciceN1 = getAmount(previous,'Gr=RK','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RK","",1);
   tableRow.addCell("Charges de personnel","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("27","",1);
   tableRow.addCell(formatValues(RK_exerciceN),"right",1);
   tableRow.addCell(formatValues(RK_exerciceN1),"right",1);

   /* Row 21: XD */
   var XD_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=134','balance',currentStartDate,currentEndDate));
   var XD_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=134','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XD","greyCell bold",1);
   tableRow.addCell("EXCEDENT BRUT D'EXPLOITATION (XC+RK)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("28","greyCell bold",1);
   tableRow.addCell(formatValues(XD_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XD_exerciceN1),"right greyCell bold",1);

   /* Row 22: TJ */
   var TJ_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TJ','balance',currentStartDate,currentEndDate));
   var TJ_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TJ','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TJ","",1);
   tableRow.addCell("Reprises d’amortissements, provisions et dépréciations","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("28","",1);
   tableRow.addCell(formatValues(TJ_exerciceN),"right",1);
   tableRow.addCell(formatValues(TJ_exerciceN1),"right",1);

   /* Row 23: RL */
   var RL_exerciceN = getAmount(current,'Gr=RL','balance',currentStartDate,currentEndDate);
   var RL_exerciceN1 = getAmount(previous,'Gr=RL','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RL","",1);
   tableRow.addCell("Dotations aux amortissements, aux provisions et dépréciations","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("3C&28 ","",1);
   tableRow.addCell(formatValues(RL_exerciceN),"right",1);
   tableRow.addCell(formatValues(RL_exerciceN1),"right",1);

   /* Row 24: XE */
   var XE_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=135','balance',currentStartDate,currentEndDate));
   var XE_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=135','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XE","greyCell bold",1);
   tableRow.addCell("RESULTAT D'EXPLOITATION (XD+TJ+RL)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XE_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XE_exerciceN1),"right greyCell bold",1);

   /* Row 25: TK */
   var TK_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TK','balance',currentStartDate,currentEndDate));
   var TK_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TK','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TK","",1);
   tableRow.addCell("Revenus financiers et assimilés","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("29","",1);
   tableRow.addCell(formatValues(TK_exerciceN),"right",1);
   tableRow.addCell(formatValues(TK_exerciceN1),"right",1);

   /* Row 26: TL */
   var TL_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TL','balance',currentStartDate,currentEndDate));
   var TL_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TL','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TL","",1);
   tableRow.addCell("Reprises de provisions  et dépréciations financières","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("28","",1);
   tableRow.addCell(formatValues(TL_exerciceN),"right",1);
   tableRow.addCell(formatValues(TL_exerciceN1),"right",1);

   /* Row 27: TM */
   var TM_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TM','balance',currentStartDate,currentEndDate));
   var TM_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TM','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TM","",1);
   tableRow.addCell("Transferts de charges financières","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("12","",1);
   tableRow.addCell(formatValues(TM_exerciceN),"right",1);
   tableRow.addCell(formatValues(TM_exerciceN1),"right",1);

   /* Row 28: RM */
   var RM_exerciceN = getAmount(current,'Gr=RM','balance',currentStartDate,currentEndDate);
   var RM_exerciceN1 = getAmount(previous,'Gr=RM','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RM","",1);
   tableRow.addCell("Frais financiers et charges assimilées","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("29","",1);
   tableRow.addCell(formatValues(RM_exerciceN),"right",1);
   tableRow.addCell(formatValues(RM_exerciceN1),"right",1);

   /* Row 29: RN */
   var RN_exerciceN = getAmount(current,'Gr=RN','balance',currentStartDate,currentEndDate);
   var RN_exerciceN1 = getAmount(previous,'Gr=RN','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RN","",1);
   tableRow.addCell("Dotations aux provisions et aux dépréciations financières","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("3C&28","",1);
   tableRow.addCell(formatValues(RN_exerciceN),"right",1);
   tableRow.addCell(formatValues(RN_exerciceN1),"right",1);

   /* Row 30: XF */
   var XF_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=136','balance',currentStartDate,currentEndDate));
   var XF_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=136','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XF","greyCell bold",1);
   tableRow.addCell("RESULTAT FINANCIER (somme TK à RN)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XF_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XF_exerciceN1),"right greyCell bold",1);

   /* Row 31: XG */
   var XG_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=137','balance',currentStartDate,currentEndDate));
   var XG_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=137','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XG","greyCell bold",1);
   tableRow.addCell("RESULTAT DES ACTIVITES ORDINAIRES (XE+XF)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XG_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XG_exerciceN1),"right greyCell bold",1);

   /* Row 32: TN */
   var TN_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TN','balance',currentStartDate,currentEndDate));
   var TN_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TN','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TN","",1);
   tableRow.addCell("Produits des cessions d'immobilisations","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("3D","",1);
   tableRow.addCell(formatValues(TN_exerciceN),"right",1);
   tableRow.addCell(formatValues(TN_exerciceN1),"right",1);

   /* Row 33: TO */
   var TO_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=TO','balance',currentStartDate,currentEndDate));
   var TO_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=TO','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("TO","",1);
   tableRow.addCell("Autres Produits HAO","",1);
   tableRow.addCell("+","",1);
   tableRow.addCell("30","",1);
   tableRow.addCell(formatValues(TO_exerciceN),"right",1);
   tableRow.addCell(formatValues(TO_exerciceN1),"right",1);

   /* Row 34: RO */
   var RO_exerciceN = getAmount(current,'Gr=RO','balance',currentStartDate,currentEndDate);
   var RO_exerciceN1 = getAmount(previous,'Gr=RO','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RO","",1);
   tableRow.addCell("Valeurs comptables des cessions d'immobilisations","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("3D","",1);
   tableRow.addCell(formatValues(RO_exerciceN),"right",1);
   tableRow.addCell(formatValues(RO_exerciceN1),"right",1);

   /* Row 35: RP */
   var RP_exerciceN = getAmount(current,'Gr=RP','balance',currentStartDate,currentEndDate);
   var RP_exerciceN1 = getAmount(previous,'Gr=RP','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RP","",1);
   tableRow.addCell("Autres Charges HAO","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("30","",1);
   tableRow.addCell(formatValues(RP_exerciceN),"right",1);
   tableRow.addCell(formatValues(RP_exerciceN1),"right",1);

   /* Row 36: XH */
   var XH_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=138','balance',currentStartDate,currentEndDate));
   var XH_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=138','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XH","greyCell bold",1);
   tableRow.addCell("RESULTAT HORS ACTIVITES ORDINAIRES (somme TN à RP)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XH_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XH_exerciceN1),"right greyCell bold",1);

   /* Row 37: RQ */
   var RQ_exerciceN = getAmount(current,'Gr=RQ','balance',currentStartDate,currentEndDate);
   var RQ_exerciceN1 = getAmount(previous,'Gr=RQ','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RQ","",1);
   tableRow.addCell("Participation des travailleurs","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("30","",1);
   tableRow.addCell(formatValues(RQ_exerciceN),"right",1);
   tableRow.addCell(formatValues(RQ_exerciceN1),"right",1);

   /* Row 38: RS */
   var RS_exerciceN = getAmount(current,'Gr=RS','balance',currentStartDate,currentEndDate);
   var RS_exerciceN1 = getAmount(previous,'Gr=RS','balance',previousStartDate,previousEndDate);
   tableRow = table.addRow();
   tableRow.addCell("RS","",1);
   tableRow.addCell("Impôts sur le résultat","",1);
   tableRow.addCell("-","",1);
   tableRow.addCell("","",1);
   tableRow.addCell(formatValues(RS_exerciceN),"right",1);
   tableRow.addCell(formatValues(RS_exerciceN1),"right",1);

   /* Row 39: XI */
   var XI_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=131','balance',currentStartDate,currentEndDate));
   var XI_exerciceN1 = Banana.SDecimal.invert(getAmount(previous,'Gr=131','balance',previousStartDate,previousEndDate));
   tableRow = table.addRow();
   tableRow.addCell("XI","greyCell bold",1);
   tableRow.addCell("RESULTAT NET (XG+XH+RQ+RS)","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(XI_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(XI_exerciceN1),"right greyCell bold",1);

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

/***************************************************************************************************************** 
*
* The main purpose of this function is to allow the user to enter the accounting period desired and saving it 
* for the next time the script is run.
* Every time the user runs of the script he has the possibility to change the date of the accounting period 
*
******************************************************************************************************************/
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

   stylesheet.addStyle("@page", "margin:10mm 10mm 10mm 20mm;") 
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

   var tableStyle = stylesheet.addStyle(".tableProfitLossStatement");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".plCol1", "width:5%");
   stylesheet.addStyle(".plCol2", "width:53%");
   stylesheet.addStyle(".plCol3", "width:5%");
   stylesheet.addStyle(".plCol4", "width:7%");
   stylesheet.addStyle(".plCol5", "width:15%");
   stylesheet.addStyle(".plCol6", "width:15%");
   stylesheet.addStyle("table.tableProfitLossStatement td", "border:thin solid black;padding-bottom:1px;padding-top:3px");

   return stylesheet;
}
