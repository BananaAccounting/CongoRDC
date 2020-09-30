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
// @id = ch.banana.africa.cashflowrdcmulticurrency
// @api = 1.0
// @pubdate = 2020-08-20
// @publisher = Banana.ch SA
// @description = Cash Flow Report Multicurrency (OHADA - RDC) [BETA]
// @description.fr = Tableau des flux de tresorerie Multi-devise (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a cash flow report for RDC.

   Columns:
   7 = Opening
   8 = Debit
   9 = Credit
   11 = total (debit-credit)
*/

var exchangerate = "";

function exec() {
 
    //CURRENT year file: the current opened document in Banana */
    var current = Banana.document;
    if (!current) {
       return "@Cancel";
    }

    var userParam = initUserParam();
    var savedParam = Banana.document.getScriptSettings();
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
 
    // PREVIOUS year file: Return the previous year document.
    // If the previous year is not defined or it is not foud it returns null */
    var previous = Banana.document.previousYear();
 
    var report = createCashFlowReportMulticurrency(current, previous, userParam.selectionStartDate, userParam.selectionEndDate, userParam);
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
 }
 
 /**************************************************************************************
 *
 * Function that create the report
 *
 **************************************************************************************/
 function createCashFlowReportMulticurrency(current, previous, startDate, endDate, userParam, report) {
 
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
       var report = Banana.Report.newReport("Cash Flow Multicurrency");
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
    report.addParagraph("TABLEAU DES FLUX DE TRESORERIE","bold center");
    report.addParagraph("Devise: " + userParam.currency, "heading2 center");
    report.addParagraph(" ", "");
 
    // Table with cash flow data
    var table = report.addTable("tableCashFlow");
    var col1 = table.addColumn("col1");
    var col2 = table.addColumn("col2");
    var col3 = table.addColumn("col3");
    var col4 = table.addColumn("col4");
    var col5 = table.addColumn("col5");
    var tableRow;
    
    tableRow = table.addRow();
    tableRow.addCell("REF","bold",1);
    tableRow.addCell("LIBELLES","bold",1);
    tableRow.addCell("","bold",1);
    tableRow.addCell("EXERCICE " + currentYear,"bold",1);
    if (previous) {
       tableRow.addCell("EXERCICE " + previousYear,"bold",1);
    } else {
       tableRow.addCell("EXERCICE N-1","bold",1);
    }
 
    /* Row 1: ZA */
    ZA_exerciceN = calculate_ZA(current,currentStartDate,currentEndDate,userParam);
    if (previous){
       ZA_exerciceN1 = calculate_ZA(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZA","",1);
    tableRow.addCell("Trésorerie nette au 1er janvier (Trésorerie actif N-1 - trésorerie passif N-1)","bold blackCell",1);
    tableRow.addCell("A","center bold blackCell",1);
    tableRow.addCell(formatValues(ZA_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZA_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 2 */ 
    tableRow = table.addRow();
    tableRow.addCell("","",1);
    tableRow.addCell("Flux de trésorerie provenant des activités opérationnelles","bold",1);
    tableRow.addCell("","",1);
    tableRow.addCell("","right",1);
    tableRow.addCell("","right",1);
 
    /* Row 3: FA */
    var FA_exerciceN = calculate_FA(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FA_exerciceN1 = calculate_FA(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FA","",1);
    tableRow.addCell("Capacité d'Autofinancement Globale (CAFG)","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FA_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FA_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 4: FB */
    var FB_exerciceN = calculate_FB(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FB_exerciceN1 = calculate_FB(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FB","",1);
    tableRow.addCell("(-) Variation actif circulant HAO","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FB_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FB_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 5: FC */
    var FC_exerciceN = calculate_FC(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FC_exerciceN1 = calculate_FC(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FC","",1);
    tableRow.addCell("(-) Variation des stocks","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FC_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FC_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 6: FD */
    var FD_exerciceN = calculate_FD(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FD_exerciceN1 = calculate_FD(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FD","",1);
    tableRow.addCell("(-) Variation des créances","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FD_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FD_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 7: FE */
    var FE_exerciceN = calculate_FE(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FE_exerciceN1 = calculate_FE(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FE","",1);
    tableRow.addCell("(+) Variation du passif circulant","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FE_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FE_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
    
    /* Row 8: total */
    var exerciceN = calculate_tot_BF(FB_exerciceN,FC_exerciceN,FD_exerciceN,FE_exerciceN);
    if (previous) {
       var exerciceN1 = calculate_tot_BF(FB_exerciceN1,FC_exerciceN1,FD_exerciceN1,FE_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("","",1);
    tableRow.addCell("Variation du BF lié aux activités opérationnelles (FB+FC+FD+FE)","bold",1);
    tableRow.addCell("","",1);
    // tableRow.addCell("","",1);
    // tableRow.addCell("","",1);
    tableRow.addCell(formatValues(exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 9: total ZB */
    var ZB_exerciceN = calculate_tot_ZB(FA_exerciceN,FB_exerciceN,FC_exerciceN,FD_exerciceN,FE_exerciceN);
    if (previous) {
       var ZB_exerciceN1 = calculate_tot_ZB(FA_exerciceN1,FB_exerciceN1,FC_exerciceN1,FD_exerciceN1,FE_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZB","",1);
    tableRow.addCell("Flux de trésorerie provenant des activités opérationnelles (somme FA à FE)","bold blackCell",1);
    tableRow.addCell("B","center bold blackCell",1);
    tableRow.addCell(formatValues(ZB_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZB_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 10 */
    tableRow = table.addRow();
    tableRow.addCell("","",1);
    tableRow.addCell("Flux de trésorerie provenant des activités d'investissements ","bold greyCell",1);
    tableRow.addCell("","greyCell",1);
    tableRow.addCell("","right",1);
    tableRow.addCell("","right",1);
 
    /* Row 11: FF */
    var FF_exerciceN = calculate_FF(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FF_exerciceN1 = calculate_FF(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FF","",1);
    tableRow.addCell("(-) Décaissements liés aux acquisitions d'immobilisations incorporelles","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FF_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FF_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 12: FG */
    var FG_exerciceN = calculate_FG(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FG_exerciceN1 = calculate_FG(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FG","",1);
    tableRow.addCell("(-) Décaissements liés aux acquisitions d'immobilisations corporelles","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FG_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FG_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 13: FH */
    var FH_exerciceN = calculate_FH(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FH_exerciceN1 = calculate_FH(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FH","",1);
    tableRow.addCell("(-) Décaissements liés aux acquisitions d'immobilisations financières","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FH_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FH_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 14: FI */
    var FI_exerciceN = calculate_FI(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FI_exerciceN1 = calculate_FI(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FI","",1);
    tableRow.addCell("(+) Encaissements liés aux cessions d'immobilisations incorporelles et corporelles","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FI_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FI_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 15: FJ */
    var FJ_exerciceN = calculate_FJ(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FJ_exerciceN1 = calculate_FJ(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FJ","",1);
    tableRow.addCell("(+) Encaissements liés aux cessions d'immobilisations financières","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FJ_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FJ_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 16: total ZC */
    var ZC_exerciceN = calculate_tot_ZC(FF_exerciceN,FG_exerciceN,FH_exerciceN,FI_exerciceN,FJ_exerciceN);
    if (previous) {
       var ZC_exerciceN1 = calculate_tot_ZC(FF_exerciceN1,FG_exerciceN1,FH_exerciceN1,FI_exerciceN1,FJ_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZC","",1);
    tableRow.addCell("Flux de trésorerie provenant des activités d'investissement (somme FF à FJ)","bold blackCell",1);
    tableRow.addCell("C","center bold blackCell",1);
    tableRow.addCell(formatValues(ZC_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZC_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 17 */
    tableRow = table.addRow();
    tableRow.addCell("","",1);
    tableRow.addCell("Flux de trésorerie provenant du financement par les capitaux propres","greyCell",1);
    tableRow.addCell("","greyCell",1);
    tableRow.addCell("","right",1);
    tableRow.addCell("","right",1);
 
    /* Row 18: FK */
    var FK_exerciceN = calculate_FK(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FK_exerciceN1 = calculate_FK(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FK","",1);
    tableRow.addCell("(+) Augmentations de capital par apports nouveaux","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FK_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FK_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 19: FL */
    var FL_exerciceN = calculate_FL(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FL_exerciceN1 = calculate_FL(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FL","",1);
    tableRow.addCell("(+) Subventions d'investissement reçues","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FL_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FL_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 20: FM */
    var FM_exerciceN = calculate_FM(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FM_exerciceN1 = calculate_FM(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FM","",1);
    tableRow.addCell("(-) Prélèvements sur le capital","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FM_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FM_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 21: FN */
    var FN_exerciceN = calculate_FN(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FN_exerciceN1 = calculate_FN(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FN","",1);
    tableRow.addCell("(-) Dividendes verses","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FN_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FN_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 22: total ZD */
    var ZD_exerciceN = calculate_tot_ZD(FK_exerciceN,FL_exerciceN,FM_exerciceN,FN_exerciceN);
    if (previous) {
       var ZD_exerciceN1 = calculate_tot_ZD(FK_exerciceN1,FL_exerciceN1,FM_exerciceN1,FN_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZD","",1);
    tableRow.addCell("Flux de trésorerie provenant des capitaux propres (somme FK à FN)","bold greyCell",1);
    tableRow.addCell("D","center bold greyCell",1);
    tableRow.addCell(formatValues(ZD_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZD_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 23 */
    tableRow = table.addRow();
    tableRow.addCell("","",1);
    tableRow.addCell("Trésorerie provenant du financement par les capitaux étrangers","bold greyCell",1);
    tableRow.addCell("","greyCell",1);
    tableRow.addCell("","right",1);
    tableRow.addCell("","right",1);
 
    /* Row 24: FO */
    var FO_exerciceN = calculate_FO(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FO_exerciceN1 = calculate_FO(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FO","",1);
    tableRow.addCell("(+) Emprunts","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FO_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FO_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 25: FP */
    var FP_exerciceN = calculate_FP(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FP_exerciceN1 = calculate_FP(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FP","",1);
    tableRow.addCell("(+) Autres dettes financières","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FP_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FP_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 26: FQ */
    var FQ_exerciceN = calculate_FQ(current,currentStartDate,currentEndDate,userParam);
    if (previous) {
       var FQ_exerciceN1 = calculate_FQ(previous,previousStartDate,previousEndDate,userParam);
    }
    tableRow = table.addRow();
    tableRow.addCell("FQ","",1);
    tableRow.addCell("(-) Remboursements des emprunts et autres dettes financières","",1);
    tableRow.addCell("","",1);
    tableRow.addCell(formatValues(FQ_exerciceN,userParam.decimals),"right",1);
    if (previous) {
       tableRow.addCell(formatValues(FQ_exerciceN1,userParam.decimals),"right",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 27: ZE */
    var ZE_exerciceN = calculate_tot_ZE(FO_exerciceN,FP_exerciceN,FQ_exerciceN);
    if (previous) {
       var ZE_exerciceN1 = calculate_tot_ZE(FO_exerciceN1,FP_exerciceN1,FQ_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZE","",1);
    tableRow.addCell("Flux de trésorerie provenant des capitaux étrangers (somme FO à FQ)","bold greyCell",1);
    tableRow.addCell("E","center bold greyCell",1);
    tableRow.addCell(formatValues(ZE_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZE_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 28: ZF */
    var ZF_exerciceN = calculate_tot_ZF(ZD_exerciceN,ZE_exerciceN);
    if (previous) {
       var ZF_exerciceN1 = calculate_tot_ZF(ZD_exerciceN1,ZE_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZF","",1);
    tableRow.addCell("Flux de trésorerie provenant des activités de financement (D+E)","bold blackCell",1);
    tableRow.addCell("F","center bold blackCell",1);
    tableRow.addCell(formatValues(ZF_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZF_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 29: ZG */
    var ZG_exerciceN = calculate_tot_ZG(ZB_exerciceN,ZC_exerciceN,ZF_exerciceN);
    if (previous) {
       var ZG_exerciceN1 = calculate_tot_ZG(ZB_exerciceN1,ZC_exerciceN1,ZF_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZG","",1);
    tableRow.addCell("VARIATION DE LA TRESORERIE NETTE DE LA PERIODE (B+C+F)","bold",1);
    tableRow.addCell("G","center bold",1);
    tableRow.addCell(formatValues(ZG_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZG_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    /* Row 30: ZH */
    var ZH_exerciceN = calculate_tot_ZH(ZG_exerciceN,ZA_exerciceN);
    if (previous) {
       var ZH_exerciceN1 = calculate_tot_ZH(ZG_exerciceN1,ZA_exerciceN1);
    }
    tableRow = table.addRow();
    tableRow.addCell("ZH","",1);
    tableRow.addCell("Trésorerie nette au 31 Décembre (G+A) Contrôle : Trésorerie actif " + currentYear + " - trésorerie passif " + currentYear + " =","bold blackCell",1);
    tableRow.addCell("H","center bold blackCell",1);
    tableRow.addCell(formatValues(ZH_exerciceN,userParam.decimals),"right bold",1);
    if (previous) {
       tableRow.addCell(formatValues(ZH_exerciceN1,userParam.decimals),"right bold",1);
    } else {
       tableRow.addCell("","",1);
    }
 
    return report;
 }
 
 
 /**************************************************************************************
 *
 * Functions that calculate the data for the report
 *
 **************************************************************************************/
 
 function calculate_ZA(banDoc, startDate, endDate, userParam) {
    /*
         getAmount(Gr=BT,opening)
       - (-1)getAmount(Gr=DT,opening)
    */
    var grBT = getAmount(banDoc,'Gr=BT','opening',startDate,endDate,userParam);
    var grDT = getAmount(banDoc,'Gr=DT','opening',startDate,endDate,userParam);
    return Banana.SDecimal.subtract(grBT, Banana.SDecimal.invert(grDT));
 }
 
 function calculate_FA(banDoc, startDate, endDate, userParam) {
    /*
       + (-1)getAmount(Gr=134,total)
       + getAmount(Gr=654,total)
       - (-1)getAmount(Gr=754,total)
       + (-1)getAmount(Gr=136,total)
       + (-1)getAmount(Gr=TO,total)
       - getAmount(Gr=RP,total)
       - getAmount(Gr=RQ,total)
       - getAmount(Gr=RS,total)
    */
    var gr134 = getAmount(banDoc,'Gr=134','total',startDate,endDate,userParam);
    var gr654 = getAmount(banDoc,'Gr=654','total',startDate,endDate,userParam);
    var gr754 = getAmount(banDoc,'Gr=754','total',startDate,endDate,userParam);
    var gr136 = getAmount(banDoc,'Gr=136','total',startDate,endDate,userParam);
    var grTO = getAmount(banDoc,'Gr=TO','total',startDate,endDate,userParam);   
    var grRP = getAmount(banDoc,'Gr=RP','total',startDate,endDate,userParam);
    var grRQ = getAmount(banDoc,'Gr=RQ','total',startDate,endDate,userParam);
    var grRS = getAmount(banDoc,'Gr=RS','total',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(gr134));
    res = Banana.SDecimal.add(res,gr654);
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr754));
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(gr136));
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(grTO));   
    res = Banana.SDecimal.subtract(res,grRP);
    res = Banana.SDecimal.subtract(res,grRQ);
    res = Banana.SDecimal.subtract(res,grRS);
    return res;
 }
 
 function calculate_FB(banDoc, startDate, endDate, userParam) {
    /*
         getAmount(Gr=BA-1,total)
       - getAmount(Gr=485,total)
       - getAmount(Gr=4856,total)
    */
    var grBA1 = getAmount(banDoc,'Gr=BA-1','total',startDate,endDate,userParam);
    var gr485 = getAmount(banDoc,'Gr=485','total',startDate,endDate,userParam);
    var gr4856 = getAmount(banDoc,'Gr=4856','total',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grBA1);
    res = Banana.SDecimal.subtract(res,gr485);
    res = Banana.SDecimal.subtract(res,gr4856);
    return res;
 }
 
 function calculate_FC(banDoc, startDate, endDate, userParam) {
    /*
       getAmount(Gr=BB,total)
    */
    return getAmount(banDoc,'Gr=BB','total',startDate,endDate,userParam);
 }
 
 function calculate_FD(banDoc, startDate, endDate, userParam) {
    /* 
       + getAmount(Gr=BG,total)
       + getAmount(Gr=4781,total)
       + getAmount(Gr=4783,total)
       - getAmount(Gr=414,debit)
       - getAmount(Gr=45821,total)
       - getAmount(Gr=44941,total)
       - getAmount(Gr=4751,total)
       - getAmount(Gr=44511,debit)
       - getAmount(Gr=44512,debit)
    */   
    var grBG = getAmount(banDoc,'Gr=BG','total',startDate,endDate,userParam);
    var gr4781 = getAmount(banDoc,'Gr=4781','total',startDate,endDate,userParam);
    var gr4783 = getAmount(banDoc,'Gr=4783','total',startDate,endDate,userParam);
    var gr414 = getAmount(banDoc,'Gr=414','debit',startDate,endDate,userParam);
    var gr45821 = getAmount(banDoc,'Gr=45821','total',startDate,endDate,userParam);
    var gr44941 = getAmount(banDoc,'Gr=44941','total',startDate,endDate,userParam);
    var gr4751 = getAmount(banDoc,'Gr=4751','total',startDate,endDate,userParam);
    var gr44511 = getAmount(banDoc,'Gr=44511','debit',startDate,endDate,userParam);
    var gr44512 = getAmount(banDoc,'Gr=44512','debit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grBG);
    res = Banana.SDecimal.add(res,gr4781);
    res = Banana.SDecimal.add(res,gr4783);
    res = Banana.SDecimal.subtract(res,gr414);
    res = Banana.SDecimal.subtract(res,gr45821);
    res = Banana.SDecimal.subtract(res,gr44941);
    res = Banana.SDecimal.subtract(res,gr4751);
    res = Banana.SDecimal.subtract(res,gr44511);
    res = Banana.SDecimal.subtract(res,gr44512);
    return res;
 }
 
 function calculate_FE(banDoc, startDate, endDate, userParam) {
    /*
       + (-1)getAmount(Gr=DP,total)
       + (-1)getAmount(Gr=4791,total)
       - (-1)getAmount(Gr=4041,total)
       - (-1)getAmount(Gr=4042,total)
       - (-1)getAmount(Gr=4615,total)
       - (-1)getAmount(Gr=4616,total)
       - (-1)getAmount(Gr=4619,total)
       - (-1)getAmount(Gr=465,total)
       - (-1)getAmount(Gr=4752,total)
       - (-1)getAmount(Gr=DH,total)
       + (-1)getAmount(Gr=DA2,total)
       + (-1)getAmount(Gr=DB2,total)
       - getAmount(Gr=443412,credit)
       - getAmount(Gr=REVERS,credit)
    */
    var grDP = getAmount(banDoc,'Gr=DP','total',startDate,endDate,userParam);
    var gr4791 = getAmount(banDoc,'Gr=4791','total',startDate,endDate,userParam);
    var gr4041 = getAmount(banDoc,'Gr=4041','total',startDate,endDate,userParam);
    var gr4042 = getAmount(banDoc,'Gr=4042','total',startDate,endDate,userParam);
    var gr4615 = getAmount(banDoc,'Gr=4615','total',startDate,endDate,userParam);
    var gr4616 = getAmount(banDoc,'Gr=4616','total',startDate,endDate,userParam);
    var gr4619 = getAmount(banDoc,'Gr=4619','total',startDate,endDate,userParam);
    var gr465 = getAmount(banDoc,'Gr=465','total',startDate,endDate,userParam);
    var gr4752 = getAmount(banDoc,'Gr=4752','total',startDate,endDate,userParam);
    var grDH = getAmount(banDoc,'Gr=DH','total',startDate,endDate,userParam);
    var grDA2 = getAmount(banDoc,'Gr=DA2','total',startDate,endDate,userParam);
    var grDB2 = getAmount(banDoc,'Gr=DB2','total',startDate,endDate,userParam);
    var gr443412 = getAmount(banDoc,'Gr=443412','credit',startDate,endDate,userParam);
    var grRevers = getAmount(banDoc,'Gr=REVERS','credit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(grDP));
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(gr4791));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4041));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4042));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4615));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4616));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4619));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr465));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4752));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(grDH));
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(grDA2));
    res = Banana.SDecimal.add(res, Banana.SDecimal.invert(grDB2));
    res = Banana.SDecimal.subtract(res,gr443412);
    res = Banana.SDecimal.subtract(res,grRevers); 
    return res;
 }
 
 function calculate_FF(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=AE-1,debit)
       + getAmount(Gr=AF-1,debit)
       + getAmount(Gr=AG-1,debit)
       + getAmount(Gr=AH-1,debit)
       - getAmount(Gr=46111,credit)
       - getAmount(Gr=CE1,credit)
       + getAmount(Gr=44511,debit)
       - (-1)getAmount(Gr=DH1,total)
       - (-1)getAmount(Gr=4041,total)
       + getAmount(Gr=251,debit)
       - getAmount(Gr=251,credit)
       - getAmount(Gr=449421,credit)
       - getAmount(Gr=443411,credit)
       - getAmount(Gr=458221,credit)
    */
    var grAE1 = getAmount(banDoc,'Gr=AE-1','debit',startDate,endDate,userParam);
    var grAF1 = getAmount(banDoc,'Gr=AF-1','debit',startDate,endDate,userParam);
    var grAG1 = getAmount(banDoc,'Gr=AG-1','debit',startDate,endDate,userParam);
    var grAH1 = getAmount(banDoc,'Gr=AH-1','debit',startDate,endDate,userParam);
    var gr46111 = getAmount(banDoc,'Gr=46111','credit',startDate,endDate,userParam);
    var grCE1 = getAmount(banDoc,'Gr=CE1','credit',startDate,endDate,userParam);
    var gr44511 = getAmount(banDoc,'Gr=44511','debit',startDate,endDate,userParam);
    var grDH1 = getAmount(banDoc,'Gr=DH1','total',startDate,endDate,userParam);
    var gr4041 = getAmount(banDoc,'Gr=4041','total',startDate,endDate,userParam);  
    var gr251_d = getAmount(banDoc,'Gr=251','debit',startDate,endDate,userParam);
    var gr251_c = getAmount(banDoc,'Gr=251','credit',startDate,endDate,userParam);
    var gr449421 = getAmount(banDoc,'Gr=449421','credit',startDate,endDate,userParam);
    var gr443411 = getAmount(banDoc,'Gr=443411','credit',startDate,endDate,userParam);
    var gr458221 = getAmount(banDoc,'Gr=458221','credit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grAE1);
    res = Banana.SDecimal.add(res,grAF1);
    res = Banana.SDecimal.add(res,grAG1);
    res = Banana.SDecimal.add(res,grAH1);
    res = Banana.SDecimal.subtract(res,gr46111);
    res = Banana.SDecimal.subtract(res,grCE1);
    res = Banana.SDecimal.add(res,gr44511);
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(grDH1));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4041));   
    res = Banana.SDecimal.add(res,gr251_d);
    res = Banana.SDecimal.subtract(res,gr251_c);
    res = Banana.SDecimal.subtract(res,gr449421);
    res = Banana.SDecimal.subtract(res,gr443411);
    res = Banana.SDecimal.subtract(res,gr458221);
    return res;
 }
 
 function calculate_FG(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=AJ-1,debit)
       + getAmount(Gr=AK-1,debit)
       + getAmount(Gr=AL-1,debit)
       + getAmount(Gr=AM-1,debit)
       + getAmount(Gr=AN-1,debit)
       - getAmount(Gr=46112,credit)
       + getAmount(Gr=44512,debit)
       - (-1)getAmount(Gr=DH2,total)
       - (-1)getAmount(Gr=4042,total)
       + getAmount(Gr=252,debit)
       - getAmount(Gr=252,credit)
       - getAmount(Gr=DB1,credit)
       - getAmount(Gr=CE2,credit)
       - getAmount(Gr=449422,credit)
       - getAmount(Gr=443412,credit)
       - getAmount(Gr=REVERS,credit)
       - getAmount(Gr=458222,credit)
    */
    var grAJ1 = getAmount(banDoc,'Gr=AJ-1','debit',startDate,endDate,userParam);
    var grAK1 = getAmount(banDoc,'Gr=AK-1','debit',startDate,endDate,userParam);
    var grAL1 = getAmount(banDoc,'Gr=AL-1','debit',startDate,endDate,userParam);
    var grAM1 = getAmount(banDoc,'Gr=AM-1','debit',startDate,endDate,userParam);
    var grAN1 = getAmount(banDoc,'Gr=AN-1','debit',startDate,endDate,userParam);
    var gr46112 = getAmount(banDoc,'Gr=46112','credit',startDate,endDate,userParam);
    var gr44512 = getAmount(banDoc,'Gr=44512','debit',startDate,endDate,userParam);
    var grDH2 = getAmount(banDoc,'Gr=DH2','total',startDate,endDate,userParam);
    var gr4042 = getAmount(banDoc,'Gr=4042','total',startDate,endDate,userParam);
    var gr252_d = getAmount(banDoc,'Gr=252','debit',startDate,endDate,userParam);
    var gr252_c = getAmount(banDoc,'Gr=252','credit',startDate,endDate,userParam);
    var grDB1 = getAmount(banDoc,'Gr=DB1','credit',startDate,endDate,userParam);
    var grCE2 = getAmount(banDoc,'Gr=CE2','credit',startDate,endDate,userParam);
    var gr449422 = getAmount(banDoc,'Gr=449422','credit',startDate,endDate,userParam);
    var gr443412 = getAmount(banDoc,'Gr=443412','credit',startDate,endDate,userParam);
    var grRevers = getAmount(banDoc,'Gr=REVERS','credit',startDate,endDate,userParam);
    var gr458222 = getAmount(banDoc,'Gr=458222','credit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grAJ1);
    res = Banana.SDecimal.add(res,grAK1);
    res = Banana.SDecimal.add(res,grAL1);
    res = Banana.SDecimal.add(res,grAM1);
    res = Banana.SDecimal.add(res,grAN1);
    res = Banana.SDecimal.subtract(res,gr46112);
    res = Banana.SDecimal.add(res,gr44512);
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(grDH2));
    res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(gr4042));   
    res = Banana.SDecimal.add(res,gr252_d);
    res = Banana.SDecimal.subtract(res,gr252_c);
    res = Banana.SDecimal.subtract(res,grDB1);
    res = Banana.SDecimal.subtract(res,grCE2);
    res = Banana.SDecimal.subtract(res,gr449422);
    res = Banana.SDecimal.subtract(res,gr443412);
    res = Banana.SDecimal.subtract(res,grRevers);   
    res = Banana.SDecimal.subtract(res,gr458222);   
    return res;
 }
 
 function calculate_FH(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=AR-1,debit)
       + getAmount(Gr=AS-1,debit)
       - (-1)getAmount(Gr=4813,total)
       - getAmount(Gr=4782,credit)
       - getAmount(Gr=4792,debit)
    */
    var grAR1 = getAmount(banDoc,'Gr=AR-1','debit',startDate,endDate,userParam);
    var grAS1 = getAmount(banDoc,'Gr=AS-1','debit',startDate,endDate,userParam);
    var gr4813 = getAmount(banDoc,'Gr=4813','total',startDate,endDate,userParam);
    var gr4782 = getAmount(banDoc,'Gr=4782','credit',startDate,endDate,userParam);
    var gr4792 = getAmount(banDoc,'Gr=4792','debit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grAR1);
    res = Banana.SDecimal.add(res,grAS1);
    res = Banana.SDecimal.subtract(res,Banana.SDecimal.invert(gr4813));
    res = Banana.SDecimal.subtract(res,gr4782);
    res = Banana.SDecimal.subtract(res,gr4792);
    return res;
 }
 
 function calculate_FI(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=754,credit)
       + getAmount(Gr=821,credit)
       + getAmount(Gr=822,credit)
       - getAmount(Gr=485,total)
       - getAmount(Gr=414,total)
    */
    var gr754 = getAmount(banDoc,'Gr=754','credit',startDate,endDate,userParam);
    var gr821 = getAmount(banDoc,'Gr=821','credit',startDate,endDate,userParam);
    var gr822 = getAmount(banDoc,'Gr=822','credit',startDate,endDate,userParam);
    var gr485 = getAmount(banDoc,'Gr=485','total',startDate,endDate,userParam);
    var gr414 = getAmount(banDoc,'Gr=414','total',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,gr754);
    res = Banana.SDecimal.add(res,gr821);
    res = Banana.SDecimal.add(res,gr822);
    res = Banana.SDecimal.subtract(res,gr485);
    res = Banana.SDecimal.subtract(res,gr414);
    return res;
 }
 
 function calculate_FJ(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=826,credit)
       + getAmount(Gr=27,credit)
       - getAmount(Gr=4856,total)
       - getAmount(Gr=4782,debit)
       - getAmount(Gr=4792,debit)
    */
   var gr826 = getAmount(banDoc,'Gr=826','credit',startDate,endDate,userParam);
   var gr27 = getAmount(banDoc,'Gr=27','credit',startDate,endDate,userParam);
   var gr4856 = getAmount(banDoc,'Gr=4856','total',startDate,endDate,userParam);
   var gr4782 = getAmount(banDoc,'Gr=4782','debit',startDate,endDate,userParam);
   var gr4792 = getAmount(banDoc,'Gr=4792','debit',startDate,endDate,userParam);
   var res = 0;
   res = Banana.SDecimal.add(res,gr826);
   res = Banana.SDecimal.add(res,gr27);
   res = Banana.SDecimal.subtract(res,gr4856);
   res = Banana.SDecimal.subtract(res,gr4782);
   res = Banana.SDecimal.subtract(res,gr4792);
   return res;
 }
 
 function calculate_FK(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=4615,credit)
       + getAmount(Gr=4616,credit)
       + getAmount(Gr=467,credit)
       - getAmount(Gr=4616,debit)
    */
   var gr4615 = getAmount(banDoc,'Gr=4615','credit',startDate,endDate,userParam);
   var gr4616_c = getAmount(banDoc,'Gr=4616','credit',startDate,endDate,userParam);
   var gr467 = getAmount(banDoc,'Gr=467','credit',startDate,endDate,userParam);
   var gr4616_d = getAmount(banDoc,'Gr=4616','debit',startDate,endDate,userParam);
   var res = 0;
   res = Banana.SDecimal.add(res,gr4615);
   res = Banana.SDecimal.add(res,gr4616_c);
   res = Banana.SDecimal.add(res,gr467);
   res = Banana.SDecimal.subtract(res,gr4616_d);
   return res;
 }
 
 function calculate_FL(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=45821,credit)
       + getAmount(Gr=44941,credit)
    */
 
    var gr45821 = getAmount(banDoc,'Gr=45821','credit',startDate,endDate,userParam);
    var gr44941 = getAmount(banDoc,'Gr=44941','credit',startDate,endDate,userParam);
    
    return Banana.SDecimal.add(gr45821,gr44941);
 }
 
 function calculate_FM(banDoc, startDate, endDate, userParam) {
    /*
       getAmount(Gr=4619,debit)
    */
    return getAmount(banDoc,'Gr=4619','debit',startDate,endDate,userParam);
 }
 
 function calculate_FN(banDoc, startDate, endDate, userParam) {
    /*
       getAmount(Gr=465,debit)
    */
    return getAmount(banDoc,'Gr=465','debit',startDate,endDate,userParam);
 }
 
 function calculate_FO(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=DA1,credit)
       - getAmount(Gr=47941,debit)
       - getAmount(Gr=47841,debit)
    */
    var grDA1 = getAmount(banDoc,'Gr=DA1','credit',startDate,endDate,userParam);
    var gr47941 = getAmount(banDoc,'Gr=47941','debit',startDate,endDate,userParam);
    var gr47841 = getAmount(banDoc,'Gr=47841','debit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grDA1);
    res = Banana.SDecimal.subtract(res,gr47941);
    res = Banana.SDecimal.subtract(res,gr47841);
    return res;
 }
 
 function calculate_FP(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=DAA,credit)
       - getAmount(Gr=47942,debit)
       - getAmount(Gr=47842,debit)
    */
    var grDAA = getAmount(banDoc,'Gr=DAA','credit',startDate,endDate,userParam);
    var gr47942 = getAmount(banDoc,'Gr=47942','debit',startDate,endDate,userParam);
    var gr47842 = getAmount(banDoc,'Gr=47842','debit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grDAA);
    res = Banana.SDecimal.subtract(res,gr47942);
    res = Banana.SDecimal.subtract(res,gr47842);
    return res;
 }
 
 function calculate_FQ(banDoc, startDate, endDate, userParam) {
    /*
       + getAmount(Gr=DA1,debit)
       + getAmount(Gr=DAA,debit)
       + getAmount(Gr=DB1,debit)
       - getAmount(Gr=47841,credit)
       - getAmount(Gr=47842,credit)
       - getAmount(Gr=47941,credit)
       - getAmount(Gr=47942,credit)
    */
    var grDA1 = getAmount(banDoc,'Gr=DA1','debit',startDate,endDate,userParam);
    var grDAA = getAmount(banDoc,'Gr=DAA','debit',startDate,endDate,userParam);
    var grDB1 = getAmount(banDoc,'Gr=DB1','debit',startDate,endDate,userParam);
    var gr47841 = getAmount(banDoc,'Gr=47841','credit',startDate,endDate,userParam);
    var gr47842 = getAmount(banDoc,'Gr=47842','credit',startDate,endDate,userParam);
    var gr47941 = getAmount(banDoc,'Gr=47941','credit',startDate,endDate,userParam);
    var gr47942 = getAmount(banDoc,'Gr=47942','credit',startDate,endDate,userParam);
    var res = 0;
    res = Banana.SDecimal.add(res,grDA1);
    res = Banana.SDecimal.add(res,grDAA);
    res = Banana.SDecimal.add(res,grDB1);
    res = Banana.SDecimal.subtract(res,gr47841);
    res = Banana.SDecimal.subtract(res,gr47842);
    res = Banana.SDecimal.subtract(res,gr47941);
    res = Banana.SDecimal.subtract(res,gr47942);
    return res;
 }
 
 /* Totals */
 function calculate_tot_BF(FB,FC,FD,FE) {
    /*
       FB + FC + FD + FE
    */
    var res = 0;
    res = Banana.SDecimal.add(res,FB);
    res = Banana.SDecimal.add(res,FC);
    res = Banana.SDecimal.add(res,FD);
    res = Banana.SDecimal.add(res,FE);
    return res;
 }
 
 function calculate_tot_ZB(FA,FB,FC,FD,FE) {
    /*
       FA - FB - FC - FD + FE
    */
    var res = 0;
    res = Banana.SDecimal.add(res,FA);
    res = Banana.SDecimal.subtract(res,FB);
    res = Banana.SDecimal.subtract(res,FC);
    res = Banana.SDecimal.subtract(res,FD);
    res = Banana.SDecimal.add(res,FE);
    return res;
 }
 
 function calculate_tot_ZC(FF,FG,FH,FI,FJ) {
    /*
       - FF - FG - FH + FI + FJ
    */
    var res = 0;
    res = Banana.SDecimal.subtract(res,FF);
    res = Banana.SDecimal.subtract(res,FG);
    res = Banana.SDecimal.subtract(res,FH);
    res = Banana.SDecimal.add(res,FI);
    res = Banana.SDecimal.add(res,FJ);
    return res;
 }
 
 function calculate_tot_ZD(FK,FL,FM,FN) {
    /*
       + FK + FL - FM - FN
    */
    var res = 0;
    res = Banana.SDecimal.add(res,FK);
    res = Banana.SDecimal.add(res,FL);
    res = Banana.SDecimal.subtract(res,FM);
    res = Banana.SDecimal.subtract(res,FN);
    return res;
 }
 
 function calculate_tot_ZE(FO,FP,FQ) {
    /*
       + FO + FP - FQ
    */
    var res = 0;
    res = Banana.SDecimal.add(res,FO);
    res = Banana.SDecimal.add(res,FP);
    res = Banana.SDecimal.subtract(res,FQ);
    return res;
 }
 
 function calculate_tot_ZF(ZD,ZE) {
    /*
       ZD + ZE
    */
    var res = 0;
    res = Banana.SDecimal.add(res,ZD);
    res = Banana.SDecimal.add(res,ZE);
    return res;
 }
 
 function calculate_tot_ZG(ZB,ZC,ZF) {
    /*
       ZB + ZC + ZF
    */
    var res = 0;
    res = Banana.SDecimal.add(res,ZB);
    res = Banana.SDecimal.add(res,ZC);
    res = Banana.SDecimal.add(res,ZF);
    return res;
 }
 
 function calculate_tot_ZH(ZG,ZA) {
    /*
       ZG + ZA
    */
    var res = 0;
    res = Banana.SDecimal.add(res,ZG);
    res = Banana.SDecimal.add(res,ZA);
    return res;
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
 
 /**************************************************************************************
 *
 * Functions that retrieve and format values from Banana
 *
 **************************************************************************************/
 
function getAmount(banDoc,account,property,startDate,endDate,userParam) {
  
    var currentBal = banDoc.currentBalance(account,startDate,endDate)
    var amount = currentBal[property];
  
    // base currency CDF, currency2 = USD
    if (userParam.currency.toUpperCase() !== 'CDF' || userParam.currency.toUpperCase() !== 'USD' || 
    userParam.currency.toUpperCase() !== 'XAF' || userParam.currency.toUpperCase() !== 'EUR' ||
    userParam.currency.toUpperCase() !== 'AOA' || userParam.currency.toUpperCase() !== 'BIF' ||
    userParam.currency.toUpperCase() !== 'XOF' || userParam.currency.toUpperCase() !== 'KES' ||
    userParam.currency.toUpperCase() !== 'NGN' || userParam.currency.toUpperCase() !== 'RWF' ||
    userParam.currency.toUpperCase() !== 'ZAR' || userParam.currency.toUpperCase() !== 'TZS' ||
    userParam.currency.toUpperCase() !== 'UGX' || userParam.currency.toUpperCase() !== 'ZMW') {
  
      if (userParam.exchangerate) {
        exchangerate = userParam.exchangerate;
      }
  
      if (Banana.SDecimal.isZero(exchangerate)) {
        exchangerate = banDoc.exchangeRate(userParam.currency).exchangeRate;
      }
  
      var tmp = 0;
      if (!Banana.SDecimal.isZero(exchangerate)) {
        tmp = Banana.SDecimal.divide(1,exchangerate);
      }
      
      var res = Banana.SDecimal.multiply(amount,tmp);
      amount = res;
    }
  
    return amount;
}
 
function formatValues(value,decimals) {
    if (decimals) {
      return Banana.Converter.toLocaleNumberFormat(value,0,true);
    }
    else {
      return Banana.Converter.toLocaleNumberFormat(value,2,true);
    }
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
    currentParam.defaultvalue = 'Tableau des flux de trésorerie multi-devise';
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
  
    return convertedParam;
  }
  
  function initUserParam() {
    var userParam = {};
    userParam.title = "Tableau des flux de trésorerie multi-devise";
    userParam.currency = 'CDF';
    userParam.exchangerate = "";
    
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
 
    /* table */
    var tableStyle = stylesheet.addStyle(".table");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle(".c1", "");
    stylesheet.addStyle(".c2", "");
    stylesheet.addStyle("table.table td", "");
 
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
 