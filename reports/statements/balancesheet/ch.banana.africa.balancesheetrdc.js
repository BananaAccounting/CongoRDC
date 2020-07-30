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
// @id = ch.banana.africa.balancesheetrdc
// @api = 1.0
// @pubdate = 2019-02-15
// @publisher = Banana.ch SA
// @description = Balance sheet Report (OHADA - RDC) [BETA]
// @description.fr = Bilan (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a Balance sheet report for RDC.
   - Active Balance sheet
   - Passive Balance sheet

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

   var report = createBalanceSheetReport(current, dateForm.selectionStartDate, dateForm.selectionEndDate);
   var stylesheet = createStyleSheet();
   Banana.Report.preview(report, stylesheet);
}


/**************************************************************************************
*
* Function that create the report
*
**************************************************************************************/
function createBalanceSheetReport(current, startDate, endDate, report) {

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

   if (!report) {
      var report = Banana.Report.newReport("Bilan");
   }

   /*******************************************************************************************
   *  Active Balance sheet
   *******************************************************************************************/
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
   report.addParagraph("BILAN ACTIF AU 31 DECEMBRE " + currentYear,"bold center");
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
   var tableRow;

   tableRow = table.addRow();
   tableRow.addCell("REF","bold center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF","bold center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note","bold center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear,"bold center",3).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear,"bold center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("","bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("BRUT " + currentYear,"bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("AMORT et DEPREC.","bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 1: AD */
   var AD1_exerciceN = getAmount(current,'Gr=AE-1|AF-1|AG-1|AH-1','balance',currentStartDate,currentEndDate);
   var AD2_exerciceN = getAmount(current,'Gr=AE-2|AF-2|AG-2|AH-2','balance',currentStartDate,currentEndDate);
   var AD_exerciceN = getAmount(current,'Gr=AE|AF|AG|AH','balance',currentStartDate,currentEndDate);
   var AD_exerciceN1 = getAmount(current,'Gr=AE|AF|AG|AH','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AD","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("IMMOBILISATIONS INCORPORELLES","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("3","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AD1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AD2_exerciceN)),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AD_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AD_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 2: AE */
   var AE1_exerciceN = getAmount(current,'Gr=AE-1','balance',currentStartDate,currentEndDate);
   var AE2_exerciceN = getAmount(current,'Gr=AE-2','balance',currentStartDate,currentEndDate);
   var AE_exerciceN = getAmount(current,'Gr=AE','balance',currentStartDate,currentEndDate);
   var AE_exerciceN1 = getAmount(current,'Gr=AE','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AE","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Frais de développement et de prospection","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AE1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AE2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AE_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AE_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 3: AF */
   var AF1_exerciceN = getAmount(current,'Gr=AF-1','balance',currentStartDate,currentEndDate);
   var AF2_exerciceN = getAmount(current,'Gr=AF-2','balance',currentStartDate,currentEndDate);
   var AF_exerciceN = getAmount(current,'Gr=AF','balance',currentStartDate,currentEndDate);
   var AF_exerciceN1 = getAmount(current,'Gr=AF','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AF","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Brevets, licences, logiciels, et  droits similaires","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AF1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AF2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AF_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AF_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 4: AG */
   var AG1_exerciceN = getAmount(current,'Gr=AG-1','balance',currentStartDate,currentEndDate);
   var AG2_exerciceN = getAmount(current,'Gr=AG-2','balance',currentStartDate,currentEndDate);
   var AG_exerciceN = getAmount(current,'Gr=AG','balance',currentStartDate,currentEndDate);
   var AG_exerciceN1 = getAmount(current,'Gr=AG','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AG","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Fonds commercial et droit au bail","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AG1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AG2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AG_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AG_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 5: AH */
   var AH1_exerciceN = getAmount(current,'Gr=AH-1','balance',currentStartDate,currentEndDate);
   var AH2_exerciceN = getAmount(current,'Gr=AH-2','balance',currentStartDate,currentEndDate);
   var AH_exerciceN = getAmount(current,'Gr=AH','balance',currentStartDate,currentEndDate);
   var AH_exerciceN1 = getAmount(current,'Gr=AH','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AH","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Autres immobilisations incorporelles","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AH1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AH2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AH_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AH_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 6: AI */
   var AI1_exerciceN = getAmount(current,'Gr=AJ-1|AK-1|AL-1|AM-1|AN-1|AP-1','balance',currentStartDate,currentEndDate);
   var AI2_exerciceN = getAmount(current,'Gr=AJ-2|AK-2|AL-2|AM-2|AN-2|AP-2','balance',currentStartDate,currentEndDate);
   var AI_exerciceN = getAmount(current,'Gr=AJ|AK|AL|AM|AN|AP','balance',currentStartDate,currentEndDate);
   var AI_exerciceN1 = getAmount(current,'Gr=AJ|AK|AL|AM|AN|AP','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AI","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("IMMOBILISATIONS CORPORELLES","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("3","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AI1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AI2_exerciceN)),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AI_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AI_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   
   /* Row 7: AJ */
   var AJ1_exerciceN = getAmount(current,'Gr=AJ-1','balance',currentStartDate,currentEndDate);
   var AJ2_exerciceN = getAmount(current,'Gr=AJ-2','balance',currentStartDate,currentEndDate);
   var AJ_exerciceN = getAmount(current,'Gr=AJ','balance',currentStartDate,currentEndDate);
   var AJ_exerciceN1 = getAmount(current,'Gr=AJ','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AJ","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Terrains (1) dont Placement en  Net......./.......","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AJ1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AJ2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AJ_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AJ_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 8: AK */
   var AK1_exerciceN = getAmount(current,'Gr=AK-1','balance',currentStartDate,currentEndDate);
   var AK2_exerciceN = getAmount(current,'Gr=AK-2','balance',currentStartDate,currentEndDate);
   var AK_exerciceN = getAmount(current,'Gr=AK','balance',currentStartDate,currentEndDate);
   var AK_exerciceN1 = getAmount(current,'Gr=AK','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AK","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Bâtiments (1) dont Placement en  Net......./.......","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AK1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AK2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AK_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AK_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 9: AL */
   var AL1_exerciceN = getAmount(current,'Gr=AL-1','balance',currentStartDate,currentEndDate);
   var AL2_exerciceN = getAmount(current,'Gr=AL-2','balance',currentStartDate,currentEndDate);
   var AL_exerciceN = getAmount(current,'Gr=AL','balance',currentStartDate,currentEndDate);
   var AL_exerciceN1 = getAmount(current,'Gr=AL','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AL","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Aménagements, agencements et installations","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AL1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AL2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AL_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AL_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 10: AM */
   var AM1_exerciceN = getAmount(current,'Gr=AM-1','balance',currentStartDate,currentEndDate);
   var AM2_exerciceN = getAmount(current,'Gr=AM-2','balance',currentStartDate,currentEndDate);
   var AM_exerciceN = getAmount(current,'Gr=AM','balance',currentStartDate,currentEndDate);
   var AM_exerciceN1 = getAmount(current,'Gr=AM','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AM","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Matériel, mobilier et actifs biologiques","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AM1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AM2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AM_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AM_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 11: AN */
   var AN1_exerciceN = getAmount(current,'Gr=AN-1','balance',currentStartDate,currentEndDate);
   var AN2_exerciceN = getAmount(current,'Gr=AN-2','balance',currentStartDate,currentEndDate);
   var AN_exerciceN = getAmount(current,'Gr=AN','balance',currentStartDate,currentEndDate);
   var AN_exerciceN1 = getAmount(current,'Gr=AN','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AN","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Matériel de transport","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AN1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AN2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AN_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AN_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 12: AP */
   var AP1_exerciceN = getAmount(current,'Gr=AP-1','balance',currentStartDate,currentEndDate);
   var AP2_exerciceN = getAmount(current,'Gr=AP-2','balance',currentStartDate,currentEndDate);
   var AP_exerciceN = getAmount(current,'Gr=AP','balance',currentStartDate,currentEndDate);
   var AP_exerciceN1 = getAmount(current,'Gr=AP','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AP","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Avances et acomptes versés sur immobilisations","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("3","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AP1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AP2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AP_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AP_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 13: AQ */
   var AQ1_exerciceN = getAmount(current,'Gr=AR-1|AS-1','balance',currentStartDate,currentEndDate);
   var AQ2_exerciceN = getAmount(current,'Gr=AR-2|AS-2','balance',currentStartDate,currentEndDate);
   var AQ_exerciceN = getAmount(current,'Gr=AR|AS','balance',currentStartDate,currentEndDate);
   var AQ_exerciceN1 = getAmount(current,'Gr=AR|AS','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AQ","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("IMMOBILISATIONS FINANCIERES","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("4","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AQ1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AQ2_exerciceN)),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AQ_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AQ_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   
   /* Row 14: AR */
   var AR1_exerciceN = getAmount(current,'Gr=AR-1','balance',currentStartDate,currentEndDate);
   var AR2_exerciceN = getAmount(current,'Gr=AR-2','balance',currentStartDate,currentEndDate);
   var AR_exerciceN = getAmount(current,'Gr=AR','balance',currentStartDate,currentEndDate);
   var AR_exerciceN1 = getAmount(current,'Gr=AR','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AR","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Titres de participation","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AR1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AR2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AR_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AR_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 15: AS */
   var AS1_exerciceN = getAmount(current,'Gr=AS-1','balance',currentStartDate,currentEndDate);
   var AS2_exerciceN = getAmount(current,'Gr=AS-2','balance',currentStartDate,currentEndDate);
   var AS_exerciceN = getAmount(current,'Gr=AS','balance',currentStartDate,currentEndDate);
   var AS_exerciceN1 = getAmount(current,'Gr=AS','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AS","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Autres immobilisations financières","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AS1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AS2_exerciceN)),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AS_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AS_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 16: AZ */
   var AZ1_exerciceN = getAmount(current,'Gr=AE-1|AF-1|AG-1|AH-1|AJ-1|AK-1|AL-1|AM-1|AN-1|AP-1|AR-1|AS-1','balance',currentStartDate,currentEndDate);
   var AZ2_exerciceN = getAmount(current,'Gr=AE-2|AF-2|AG-2|AH-2|AJ-2|AK-2|AL-2|AM-2|AN-2|AP-2|AR-2|AS-2','balance',currentStartDate,currentEndDate);
   //var AZ1_exerciceN = calculate_AZ(AE1_exerciceN,AF1_exerciceN,AG1_exerciceN,AH1_exerciceN,AJ1_exerciceN,AK1_exerciceN,AL1_exerciceN,AM1_exerciceN,AN1_exerciceN,AP1_exerciceN,AR1_exerciceN,AS1_exerciceN);
   //var AZ2_exerciceN = calculate_AZ(AE2_exerciceN,AF2_exerciceN,AG2_exerciceN,AH2_exerciceN,AJ2_exerciceN,AK2_exerciceN,AL2_exerciceN,AM2_exerciceN,AN2_exerciceN,AP2_exerciceN,AR2_exerciceN,AS2_exerciceN);
   var AZ_exerciceN = getAmount(current,'Gr=AZ','balance',currentStartDate,currentEndDate);
   var AZ_exerciceN1 = getAmount(current,'Gr=AZ','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("AZ","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("TOTAL ACTIF IMMOBILISE","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AZ1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(AZ2_exerciceN)),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AZ_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(AZ_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 17: BA */
   var BA1_exerciceN = getAmount(current,'Gr=BA-1','balance',currentStartDate,currentEndDate);
   var BA2_exerciceN = getAmount(current,'Gr=BA-2','balance',currentStartDate,currentEndDate);
   var BA_exerciceN = getAmount(current,'Gr=BA','balance',currentStartDate,currentEndDate);
   var BA_exerciceN1 = getAmount(current,'Gr=BA','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BA","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF CIRCULANT HAO","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("5","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BA1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BA2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BA_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BA_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 18: BB */
   var BB1_exerciceN = getAmount(current,'Gr=BB-1','balance',currentStartDate,currentEndDate);
   var BB2_exerciceN = getAmount(current,'Gr=BB-2','balance',currentStartDate,currentEndDate);
   var BB_exerciceN = getAmount(current,'Gr=BB','balance',currentStartDate,currentEndDate);
   var BB_exerciceN1 = getAmount(current,'Gr=BB','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BB","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("STOCKS ET ENCOURS","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("6","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BB1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BB2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BB_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BB_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 19: BG */
   tableRow = table.addRow();
   tableRow.addCell("BG","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("CREANCES ET EMPLOIS ASSIMILES ","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 20: BH */
   var BH1_exerciceN = getAmount(current,'Gr=BH-1','balance',currentStartDate,currentEndDate);
   var BH2_exerciceN = getAmount(current,'Gr=BH-2','balance',currentStartDate,currentEndDate);
   var BH_exerciceN = getAmount(current,'Gr=BH','balance',currentStartDate,currentEndDate);
   var BH_exerciceN1 = getAmount(current,'Gr=BH','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BH","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Fournisseurs avances versées ","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("17","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BH1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BH2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BH_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BH_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 21: BI */
   var BI1_exerciceN = getAmount(current,'Gr=BI-1','balance',currentStartDate,currentEndDate);
   var BI2_exerciceN = getAmount(current,'Gr=BI-2','balance',currentStartDate,currentEndDate);
   var BI_exerciceN = getAmount(current,'Gr=BI','balance',currentStartDate,currentEndDate);
   var BI_exerciceN1 = getAmount(current,'Gr=BI','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BI","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Clients ","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("7","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BI1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BI2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BI_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BI_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 22: BJ */
   var BJ1_exerciceN = getAmount(current,'Gr=BJ-1','balance',currentStartDate,currentEndDate);
   var BJ2_exerciceN = getAmount(current,'Gr=BJ-2','balance',currentStartDate,currentEndDate);
   var BJ_exerciceN = getAmount(current,'Gr=BJ','balance',currentStartDate,currentEndDate);
   var BJ_exerciceN1 = getAmount(current,'Gr=BJ','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BJ","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Autres créances","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("8","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BJ1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BJ2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BJ_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BJ_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 23: BK */
   var BK1_exerciceN = getAmount(current,'Gr=BA-1|BB-1|BH-1|BI-1|BJ-1','balance',currentStartDate,currentEndDate);
   var BK2_exerciceN = getAmount(current,'Gr=BA-2|BB-2|BH-2|BI-2|BJ-2','balance',currentStartDate,currentEndDate);
   var BK_exerciceN = getAmount(current,'Gr=BK','balance',currentStartDate,currentEndDate);
   var BK_exerciceN1 = getAmount(current,'Gr=BK','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BK","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("TOTAL ACTIF CIRCULANT","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BK1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BK2_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BK_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BK_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 24: BQ */
   var BQ1_exerciceN = getAmount(current,'Gr=BQ-1','balance',currentStartDate,currentEndDate);
   var BQ2_exerciceN = getAmount(current,'Gr=BQ-2','balance',currentStartDate,currentEndDate);
   var BQ_exerciceN = getAmount(current,'Gr=BQ','balance',currentStartDate,currentEndDate);
   var BQ_exerciceN1 = getAmount(current,'Gr=BQ','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BQ","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Titres de placement","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("9","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BQ1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BQ2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BQ_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BQ_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 25: BR */
   var BR1_exerciceN = getAmount(current,'Gr=BR-1','balance',currentStartDate,currentEndDate);
   var BR2_exerciceN = getAmount(current,'Gr=BR-2','balance',currentStartDate,currentEndDate);
   var BR_exerciceN = getAmount(current,'Gr=BR','balance',currentStartDate,currentEndDate);
   var BR_exerciceN1 = getAmount(current,'Gr=BR','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BR","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Valeurs à encaisser","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("10","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BR1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BR2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BR_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BR_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 26: BS */
   var BS1_exerciceN = getAmount(current,'Gr=BS-1','balance',currentStartDate,currentEndDate);
   var BS2_exerciceN = getAmount(current,'Gr=BS-2','balance',currentStartDate,currentEndDate);
   var BS_exerciceN = getAmount(current,'Gr=BS','balance',currentStartDate,currentEndDate);
   var BS_exerciceN1 = getAmount(current,'Gr=BS','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BS","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Banques, chèques postaux, caisse et assimilés","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("11","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BS1_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BS2_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BS_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BS_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 27: BT */
   var BT1_exerciceN = getAmount(current,'Gr=BQ-1|BR-1|BS-1','balance',currentStartDate,currentEndDate);
   var BT2_exerciceN = getAmount(current,'Gr=BQ-2|BR-2|BS-2','balance',currentStartDate,currentEndDate);
   var BT_exerciceN = getAmount(current,'Gr=BT','balance',currentStartDate,currentEndDate);
   var BT_exerciceN1 = getAmount(current,'Gr=BT','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BT","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("TOTAL TRESORERIE-ACTIF","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BT1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BT2_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BT_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BT_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 28: BU */
   var BU_exerciceN = getAmount(current,'Gr=BU','balance',currentStartDate,currentEndDate);
   var BU_exerciceN1 = getAmount(current,'Gr=BU','opening',currentStartDate,currentEndDate);
   tableRow = table.addRow();
   tableRow.addCell("BU","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Ecart de conversion-Actif","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("12","",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BU_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BU_exerciceN),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BU_exerciceN1),"right",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");

   /* Row 29: BZ */
   var BZ1_exerciceN = calculate_BZ(AZ1_exerciceN,BK1_exerciceN,BT1_exerciceN,BU_exerciceN);
   var BZ2_exerciceN = calculate_BZ(AZ2_exerciceN,BK2_exerciceN,BT2_exerciceN);
   var BZ_exerciceN = calculate_BZ(AZ_exerciceN,BK_exerciceN,BT_exerciceN,BU_exerciceN);
   var BZ_exerciceN1 = calculate_BZ(AZ_exerciceN1,BK_exerciceN1,BT_exerciceN1,BU_exerciceN1);
   tableRow = table.addRow();
   tableRow.addCell("BZ","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("TOTAL GENERAL","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BZ1_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(BZ2_exerciceN)),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BZ_exerciceN),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(BZ_exerciceN1),"right greyCell bold",1).setStyleAttributes("border:thin solid black;padding-bottom:2px;padding-top:5px");




   report.addPageBreak();

   /*******************************************************************************************
   *  Passive Balance sheet
   *******************************************************************************************/
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
   report.addParagraph("BILAN PASSIF AU 31 DECEMBRE " + currentYear,"bold center");
   report.addParagraph(" ", "");

   // Table with cash flow data
   var table = report.addTable("tablePassiveBalanceSheet");
   var col1 = table.addColumn("pCol1");
   var col2 = table.addColumn("pCol2");
   var col3 = table.addColumn("pCol3");
   var col4 = table.addColumn("pCol4");
   var col5 = table.addColumn("pCol5");
   var tableRow;
   
   tableRow = table.addRow();
   tableRow.addCell("REF","bold center",1);
   tableRow.addCell("PASSIF","bold center",1);
   tableRow.addCell("Note","bold center",1);
   var cell = tableRow.addCell("","bold",1);
   cell.addParagraph("EXERCICE AU 31/12/" + currentYear,"center");
   cell.addParagraph(" ", "");
   cell.addParagraph("NET", "center");
   var cell = tableRow.addCell("","bold",1);
   cell.addParagraph("EXERCICE AU 31/12/" + previousYear,"center");
   cell.addParagraph(" ", "");
   cell.addParagraph("NET", "center");

   //tableRow.addCell("EXERCICE AU 31/12/" + currentYear,"greyCell bold",1);
   //tableRow.addCell("EXERCICE AU 31/12/" + previousYear,"greyCell bold",1);

   /* Row 1: CA */
   var CA_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CA','balance',currentStartDate,currentEndDate));
   var CA_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CA','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CA","",1);
   tableRow.addCell("Capital","",1);
   tableRow.addCell("13","",1);
   tableRow.addCell(formatValues(CA_exerciceN),"right",1);
   tableRow.addCell(formatValues(CA_exerciceN1),"right",1);

   /* Row 2: CB */
   var CB_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CB','balance',currentStartDate,currentEndDate));
   var CB_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CB','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CB","",1);
   tableRow.addCell("Apporteurs capital non appelé (-)","",1);
   tableRow.addCell("13","",1);
   tableRow.addCell(formatValues(CB_exerciceN),"right",1);
   tableRow.addCell(formatValues(CB_exerciceN1),"right",1);

   /* Row 3: CD */
   var CD_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CD','balance',currentStartDate,currentEndDate));
   var CD_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CD','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CD","",1);
   tableRow.addCell("Primes liées au capital social","",1);
   tableRow.addCell("14","",1);
   tableRow.addCell(formatValues(CD_exerciceN),"right",1);
   tableRow.addCell(formatValues(CD_exerciceN1),"right",1);

   /* Row 4: CE */
   var CE_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CE','balance',currentStartDate,currentEndDate));
   var CE_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CE','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CE","",1);
   tableRow.addCell("Ecarts de réévaluation","",1);
   tableRow.addCell("3e","",1);
   tableRow.addCell(formatValues(CE_exerciceN),"right",1);
   tableRow.addCell(formatValues(CE_exerciceN1),"right",1);

   /* Row 5: CF */
   var CF_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CF','balance',currentStartDate,currentEndDate));
   var CF_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CF','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CF","",1);
   tableRow.addCell("Réserves indisponibles","",1);
   tableRow.addCell("14","",1);
   tableRow.addCell(formatValues(CF_exerciceN),"right",1);
   tableRow.addCell(formatValues(CF_exerciceN1),"right",1);

   /* Row 6: CG */
   var CG_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CG','balance',currentStartDate,currentEndDate));
   var CG_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CG','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CG","",1);
   tableRow.addCell("Réserves libres","",1);
   tableRow.addCell("14","",1);
   tableRow.addCell(formatValues(CG_exerciceN),"right",1);
   tableRow.addCell(formatValues(CG_exerciceN1),"right",1);

   /* Row 7: CH */
   var CH_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CH','balance',currentStartDate,currentEndDate));
   var CH_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CH','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CH","",1);
   tableRow.addCell("Report à nouveau (+ ou -)","",1);
   tableRow.addCell("14","",1);
   tableRow.addCell(formatValues(CH_exerciceN),"right",1);
   tableRow.addCell(formatValues(CH_exerciceN1),"right",1);

   /* Row 8: CJ */
   var CJ_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CJ','balance',currentStartDate,currentEndDate));
   var CJ_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CJ','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CJ","",1);
   tableRow.addCell("Résultat net de l'exercice (bénéfice + ou perte -)","",1);
   tableRow.addCell("","",1);
   tableRow.addCell(formatValues(CJ_exerciceN),"right",1);
   tableRow.addCell(formatValues(CJ_exerciceN1),"right",1);

   /* Row 9: CL */
   var CL_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CL','balance',currentStartDate,currentEndDate));
   var CL_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CL','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CL","",1);
   tableRow.addCell("Subventions d'investissement","",1);
   tableRow.addCell("15","",1);
   tableRow.addCell(formatValues(CL_exerciceN),"right",1);
   tableRow.addCell(formatValues(CL_exerciceN1),"right",1);

   /* Row 10: CM */
   var CM_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CM','balance',currentStartDate,currentEndDate));
   var CM_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CM','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CM","",1);
   tableRow.addCell("Provisions réglementées","",1);
   tableRow.addCell("15","",1);
   tableRow.addCell(formatValues(CM_exerciceN),"right",1);
   tableRow.addCell(formatValues(CM_exerciceN1),"right",1);

   /* Row 11: CP */
   var CP_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=CP','balance',currentStartDate,currentEndDate));
   var CP_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=CP','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("CP","greyCell bold",1);
   tableRow.addCell("TOTAL CAPITAUX PROPRES ET RESSOURCES ASSIMILEES","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(CP_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(CP_exerciceN1),"right greyCell bold",1);

   /* Row 12: DA */
   var DA_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DA','balance',currentStartDate,currentEndDate));
   var DA_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DA','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DA","",1);
   tableRow.addCell("Emprunts et dettes financières diverses","",1);
   tableRow.addCell("16","",1);
   tableRow.addCell(formatValues(DA_exerciceN),"right",1);
   tableRow.addCell(formatValues(DA_exerciceN1),"right",1);

   /* Row 13: DB */
   var DB_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DB','balance',currentStartDate,currentEndDate));
   var DB_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DB','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DB","",1);
   tableRow.addCell("Dettes de location acquisition","",1);
   tableRow.addCell("16","",1);
   tableRow.addCell(formatValues(DB_exerciceN),"right",1);
   tableRow.addCell(formatValues(DB_exerciceN1),"right",1);

   /* Row 14: DC */
   var DC_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DC','balance',currentStartDate,currentEndDate));
   var DC_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DC','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DC","",1);
   tableRow.addCell("Provisions pour risques et charges","",1);
   tableRow.addCell("16","",1);
   tableRow.addCell(formatValues(DC_exerciceN),"right",1);
   tableRow.addCell(formatValues(DC_exerciceN1),"right",1);

   /* Row 15: DD */
   var DD_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DD','balance',currentStartDate,currentEndDate));
   var DD_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DD','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DD","greyCell bold",1);
   tableRow.addCell("TOTAL DETTES FINANCIERES ET RESSOURCES ASSIMILEES","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(DD_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(DD_exerciceN1),"right greyCell bold",1);

   /* Row 16: DF */
   var DF_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DF','balance',currentStartDate,currentEndDate));
   var DF_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DF','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DF","greyCell bold",1);
   tableRow.addCell("TOTAL RESSOURCES STABLES","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(DF_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(DF_exerciceN1),"right greyCell bold",1);

   /* Row 17: DH */
   var DH_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DH','balance',currentStartDate,currentEndDate));
   var DH_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DH','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DH","",1);
   tableRow.addCell("Dettes circulantes HAO","",1);
   tableRow.addCell("5","",1);
   tableRow.addCell(formatValues(DH_exerciceN),"right",1);
   tableRow.addCell(formatValues(DH_exerciceN1),"right",1);

   /* Row 18: DI */
   var DI_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DI','balance',currentStartDate,currentEndDate));
   var DI_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DI','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DI","",1);
   tableRow.addCell("Clients, avances reçues","",1);
   tableRow.addCell("7","",1);
   tableRow.addCell(formatValues(DI_exerciceN),"right",1);
   tableRow.addCell(formatValues(DI_exerciceN1),"right",1);

   /* Row 19: DJ */
   var DJ_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DJ','balance',currentStartDate,currentEndDate));
   var DJ_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DJ','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DJ","",1);
   tableRow.addCell("Fournisseurs d'exploitation","",1);
   tableRow.addCell("17","",1);
   tableRow.addCell(formatValues(DJ_exerciceN),"right",1);
   tableRow.addCell(formatValues(DJ_exerciceN1),"right",1);

   /* Row 20: DK */
   var DK_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DK','balance',currentStartDate,currentEndDate));
   var DK_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DK','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DK","",1);
   tableRow.addCell("Dettes fiscales et sociales","",1);
   tableRow.addCell("18","",1);
   tableRow.addCell(formatValues(DK_exerciceN),"right",1);
   tableRow.addCell(formatValues(DK_exerciceN1),"right",1);

   /* Row 21: DM */
   var DM_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DM','balance',currentStartDate,currentEndDate));
   var DM_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DM','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DM","",1);
   tableRow.addCell("Autres dettes","",1);
   tableRow.addCell("19","",1);
   tableRow.addCell(formatValues(DM_exerciceN),"right",1);
   tableRow.addCell(formatValues(DM_exerciceN1),"right",1);

   /* Row 22: DN */
   var DN_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DN','balance',currentStartDate,currentEndDate));
   var DN_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DN','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DN","",1);
   tableRow.addCell("Provisions pour risques à court terme","",1);
   tableRow.addCell("19","",1);
   tableRow.addCell(formatValues(DN_exerciceN),"right",1);
   tableRow.addCell(formatValues(DN_exerciceN1),"right",1);

   /* Row 23: DP */
   var DP_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DP','balance',currentStartDate,currentEndDate));
   var DP_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DP','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DP","greyCell bold",1);
   tableRow.addCell("TOTAL PASSIF CIRCULANT","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(DP_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(DP_exerciceN1),"right greyCell bold",1);

   /* Row 24: DQ */
   var DQ_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DQ','balance',currentStartDate,currentEndDate));
   var DQ_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DQ','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DQ","",1);
   tableRow.addCell("Banques, crédits d'escompte","",1);
   tableRow.addCell("20","",1);
   tableRow.addCell(formatValues(DQ_exerciceN),"right",1);
   tableRow.addCell(formatValues(DQ_exerciceN1),"right",1);

   /* Row 25: DR */
   var DR_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DR','balance',currentStartDate,currentEndDate));
   var DR_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DR','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DR","",1);
   tableRow.addCell("Banques, établissements financiers et crédits de trésorerie","",1);
   tableRow.addCell("20","",1);
   tableRow.addCell(formatValues(DR_exerciceN),"right",1);
   tableRow.addCell(formatValues(DR_exerciceN1),"right",1);

   /* Row 26: DT */
   var DT_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DT','balance',currentStartDate,currentEndDate));
   var DT_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DT','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DT","greyCell bold",1);
   tableRow.addCell("TOTAL TRESORERIE-PASSIF","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(DT_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(DT_exerciceN1),"right greyCell bold",1);

   /* Row 27: DV */
   var DV_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DV','balance',currentStartDate,currentEndDate));
   var DV_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DV','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DV","",1);
   tableRow.addCell("Ecart de conversion-Passif","",1);
   tableRow.addCell("12","",1);
   tableRow.addCell(formatValues(DV_exerciceN),"right",1);
   tableRow.addCell(formatValues(DV_exerciceN1),"right",1);

   /* Row 28: DZ */
   var DZ_exerciceN = Banana.SDecimal.invert(getAmount(current,'Gr=DZ','balance',currentStartDate,currentEndDate));
   var DZ_exerciceN1 = Banana.SDecimal.invert(getAmount(current,'Gr=DZ','opening',currentStartDate,currentEndDate));
   tableRow = table.addRow();
   tableRow.addCell("DZ","greyCell bold",1);
   tableRow.addCell("TOTAL GENERAL","greyCell bold",1);
   tableRow.addCell("","greyCell bold",1);
   tableRow.addCell(formatValues(DZ_exerciceN),"right greyCell bold",1);
   tableRow.addCell(formatValues(DZ_exerciceN1),"right greyCell bold",1);

   /* Check active and passive net balance at 31.12 */
   if (BZ_exerciceN !== DZ_exerciceN) {
      Banana.document.addMessage("Bilan: Le solde net du l'actif au 31.12." + currentYear + " (BZ) diffère du solde net du passif au 31.12." + currentYear + " (DZ).");
   }

   /* Check active and passive opening net balance */
   if (BZ_exerciceN1 !== DZ_exerciceN1) {
      Banana.document.addMessage("Bilan: Le solde net de l'actif au 31.12." + previousYear + " (BZ) diffère du solde net du passif au 31.12." + previousYear + " (DZ).");
   }

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

function calculate_BZ(AZ,BK,BT,BU) {
   var res = "";
   res = Banana.SDecimal.add(res,AZ);
   res = Banana.SDecimal.add(res,BK);
   res = Banana.SDecimal.add(res,BT);
   res = Banana.SDecimal.add(res,BU);
   return res;
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
   
   var tableStyle = stylesheet.addStyle(".tableActiveBalanceSheet");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".col1", "width:4%");
   stylesheet.addStyle(".col2", "width:31%");
   stylesheet.addStyle(".col3", "width:5%");
   stylesheet.addStyle(".col4", "width:15%");
   stylesheet.addStyle(".col5", "width:15%");
   stylesheet.addStyle(".col6", "width:15%");
   stylesheet.addStyle(".col7", "width:15%");
   //stylesheet.addStyle("table.tableActiveBalanceSheet td", "border:thin solid black;padding-bottom:2px;padding-top:5px");
   stylesheet.addStyle("table.tableActiveBalanceSheet td", "padding-bottom:2px;padding-top:5px");

   var tableStyle = stylesheet.addStyle(".tablePassiveBalanceSheet");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".pCol1", "width:5%");
   stylesheet.addStyle(".pCol2", "width:60%");
   stylesheet.addStyle(".pCol3", "width:5%");
   stylesheet.addStyle(".pCol4", "width:15%");
   stylesheet.addStyle(".pCol5", "width:15%");
   stylesheet.addStyle("table.tablePassiveBalanceSheet td", "border:thin solid black;padding-bottom:2px;padding-top:5px");

   return stylesheet;
}
