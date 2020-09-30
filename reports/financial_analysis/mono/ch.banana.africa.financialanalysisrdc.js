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
// @id = ch.banana.africa.financialanalysisrdc
// @api = 1.0
// @pubdate = 2020-06-24
// @publisher = Banana.ch SA
// @description = Financial Analysis Report Monocurrency (OHADA - RDC) [BETA]
// @description.fr = Analyse Financière Mono-devise (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
   Resume:
   =======
   
   This BananaApp creates a financial analysis report for DRC.

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

   var report = createFinancialAnalysisReport(current, dateForm.selectionStartDate, dateForm.selectionEndDate);
   var stylesheet = createStyleSheet();
   Banana.Report.preview(report, stylesheet);
}

function createFinancialAnalysisReport(current, startDate, endDate, report) {
   
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
   var report = Banana.Report.newReport("Analyse Financière");
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
  report.addParagraph("ANALYSE FINANCIÈRE","bold center");
  report.addParagraph(" ", "");

  // Apply financial table style
  var table = financialTable(report, "finTable");

  var tableRow = table.addRow();
  tableRow.addCell("SIGLE", "bold center", 2).setStyleAttributes("font-size:10pt");
  tableRow.addCell("LIBELLÉ", "bold center", 6).setStyleAttributes("font-size:10pt");
  tableRow.addCell("FORMULE", "bold center", 9).setStyleAttributes("font-size:10pt");
  tableRow.addCell("RÉSULTAT", "bold center", 3).setStyleAttributes("font-size:10pt");

  var tableRow = table.addRow();
  tableRow.addCell("Analyse financière par la méthode des flux de fonds", "bold center", 17);
  tableRow.addCell("En valeur de flux", "bold center", 3);

  /* FRN */
  var result_FRN = calculate_FRN(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("FRN", "bold", 2);
  tableRow.addCell("Fonds de Roulement Net", "", 6);
  tableRow.addCell("(Ressources Stables) - (Actifs Immobilisés Nets)", "", 9);
  tableRow.addCell(formatValues(result_FRN), "center", 3);

  /* FRP */
  var result_FRP = calculate_FRP(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("FRP", "bold", 2);
  tableRow.addCell("Fonds de Roulement Propre", "", 6);
  tableRow.addCell("(Capitaux Propres) - (Actifs Immobilisés Nets)", "", 9);
  tableRow.addCell(formatValues(result_FRP), "center", 3);

  /* FRE */
  var result_FRE = calculate_FRE(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("FRE", "bold", 2);
  tableRow.addCell("Fonds de Roulement Étranger", "", 6);
  tableRow.addCell("Dettes financières", "", 9);
  tableRow.addCell(formatValues(result_FRE), "center", 3);

  /* BFRG */
  var result_BFRG = calculate_BFRG(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("BFRG", "bold", 2);
  tableRow.addCell("Besoin en Fonds de Roulement Global", "", 6);
  tableRow.addCell("(Actif circulant) - (Passif circulant)", "", 9);
  tableRow.addCell(formatValues(result_BFRG), "center", 3);

  /* BFRE */
  var result_BFRE = calculate_BFRE(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("BFRE", "bold", 2);
  tableRow.addCell("Besoin en Fonds de Roulement d'Exploitation", "", 6);
  tableRow.addCell("(Actif circulant d'exploitation) - (Passif circulant d'exploitation)", "", 9);
  tableRow.addCell(formatValues(result_BFRE), "center", 3);

  /* BFHAO */
  var result_BFHAO = calculate_BFHAO(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("BFHAO", "bold", 2);
  tableRow.addCell("Besoin en Fonds de Roulement Hors Activité Ordinaire", "", 6);
  tableRow.addCell("(Actif circulant HAO) - (Passif circulant HAO)", "", 9);
  tableRow.addCell(formatValues(result_BFHAO), "center", 3);

  /* TN */
  var result_TN = calculate_TN(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("TN", "bold", 2);
  tableRow.addCell("Trésorerie Nette", "", 6);
  tableRow.addCell("(Trésorerie-Actif) - (Trésorerie-Passif)", "", 9);
  tableRow.addCell(formatValues(result_TN), "center", 3);

  var tableRow = table.addRow();
  tableRow.addCell("Analyse de la structure financière par la méthode des ratios", "bold center", 20);

  /* RCAFR */
  var result_RCAFR = calculate_RCAFR(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RCAFR", "bold", 2);
  tableRow.addCell("Ratio de couverture des actifs fixes par les ressources stables","", 6);
  tableRow.addCell("(Ressources stables)/(Actifs Immobilisés)","", 9);
  tableRow.addCell(formatValues(result_RCAFR), "center", 3);

  /* RCAFC */
  var result_RCAFC = calculate_RCAFC(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RCAFC", "bold", 2);
  tableRow.addCell("Ratio de couverture des actifs fixes par les capitaux propres","", 6);
  tableRow.addCell("(Capitaux Propres)/(Actifs Immobilisés)","", 9);
  tableRow.addCell(formatValues(result_RCAFC), "center", 3);

  /* RBFRG */
  var result_RBFRG = calculate_RBFRG(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RBFRG", "bold", 2);
  tableRow.addCell("Ratio de couverture de besoin en fonds de roulement global", "", 6);
  tableRow.addCell("FRN/BFRG", "", 9);
  tableRow.addCell(formatValues(result_RBFRG), "center", 3);

  /* RS */
  var result_RS = calculate_RS(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RS", "bold", 2);
  tableRow.addCell("Ratio de solvabilité","", 6);
  tableRow.addCell("(Passif Total)/(Dettes Totales)","", 9);
  tableRow.addCell(formatValues(result_RS), "center", 3);

  /* RIF */
  var result_RIF = calculate_RIF(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RIF", "bold", 2);
  tableRow.addCell("Ratio d'indépendance financière ou autonomie financière","", 6);
  tableRow.addCell("(Capitaux Propres)/(Passif Total)","", 9);
  tableRow.addCell(formatValues(result_RIF), "center", 3);

  /* RDF */
  var result_RDF = calculate_RDF(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RDF", "bold", 2);
  tableRow.addCell("Ratio de dépendance financière","", 6);
  tableRow.addCell("(Capitaux Propres)/(Actifs Immobilisés)","", 9);
  tableRow.addCell(formatValues(result_RDF), "center", 3);

  /* RLG */
  var result_RLG = calculate_RLG(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RLG", "bold", 2);
  tableRow.addCell("Ratio de liquidité générale","", 6);
  tableRow.addCell("(Actif Circulant + Trésorerie Actif)/(Passif Circulant + Trésorerie Passif)","", 9);
  tableRow.addCell(formatValues(result_RLG), "center", 3);

  /* RLR */
  var result_RLR = calculate_RLR(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RLR", "bold", 2);
  tableRow.addCell("Ratio de liquidité restreinte ou réduite","", 6);
  tableRow.addCell("(Créances + Trésorerie Actif)/(Passif Circulant + Trésorerie Passif)","", 9);
  tableRow.addCell(formatValues(result_RLR), "center", 3);

  /* RLI */
  var result_RLI = calculate_RLI(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RLI", "bold", 2);
  tableRow.addCell("Ratio de liquidité immédiate","", 6);
  tableRow.addCell("(Trésorerie Actif)/(Passif Circulant + Trésorerie Passif)","", 9);
  tableRow.addCell(formatValues(result_RLI), "center", 3);

  var tableRow = table.addRow();
  tableRow.addCell("Ratio de la Rentabilité", "bold center", 17);
  tableRow.addCell("Valeur en %", "bold center", 3);

  /* RA */
  var result_RA = calculate_RA(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RA", "bold", 2);
  tableRow.addCell("Rentabilité de l'activité","", 6);
  tableRow.addCell("(Résultat d'Exploitation * 100)/(Chiffre d'affaire HT)","", 9);
  tableRow.addCell(formatValues(result_RA), "center", 3);

  /* TM */
  var result_TM = calculate_TM(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("TM", "bold", 2);
  tableRow.addCell("Taux de marque ou Taux de Marge Commerciale","", 6);
  tableRow.addCell("(Marge Commerciale * 100)/(Vente des Marchandies HT)","", 9);
  tableRow.addCell(formatValues(result_TM), "center", 3);

  /* ROI */
  var result_ROI = calculate_ROI(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("ROI", "bold", 2);
  tableRow.addCell("Rentabilité économique ou Return on Investment (ROI)","", 6);
  tableRow.addCell("(Résultat d'Exploitation * 100)/(Totat Actif)","", 9);
  tableRow.addCell(formatValues(result_ROI), "center", 3);

  /* RCP */
  var result_RCP = calculate_RCP(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RCP", "bold", 2);
  tableRow.addCell("Rentabilité des capitaux propres","", 6);
  tableRow.addCell("(Résultat net de l'exercice * 100)/(Capitaux propres)","", 9);
  tableRow.addCell(formatValues(result_RCP), "center", 3);

  /* RCS */
  var result_RCS = calculate_RCS(current, currentStartDate, currentEndDate);
  var tableRow = table.addRow();
  tableRow.addCell("RCS", "bold", 2);
  tableRow.addCell("Rentabilité du capital social ou capital initial","", 6);
  tableRow.addCell("(Résultat net de l'exercice * 100)/(Capital Social)","", 9);
  tableRow.addCell(formatValues(result_RCS), "center", 3);

  return report;
}

/* Calculate FRN */
function calculate_FRN(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=DF,balance)
         + getAmount(Gr=47841,balance)
         + getAmount(Gr=47842,balance)
         + (-1)getAmount(Gr=47941,balance)
         + (-1)getAmount(Gr=47942,balance)
      }
      -
      {
         + getAmount(Gr=AZ,balance)
         + getAmount(Gr=4782,balance)
         + (-1)getAmount(Gr=4792,balance)
      }
   */
   var grDF = getAmount(banDoc, 'Gr=DF', 'balance', startDate, endDate);
   var gr47841 = getAmount(banDoc, 'Gr=47841', 'balance', startDate, endDate);
   var gr47842 = getAmount(banDoc, 'Gr=47842', 'balance', startDate, endDate);
   var gr47941 = getAmount(banDoc, 'Gr=47941', 'balance', startDate, endDate);
   var gr47942 = getAmount(banDoc, 'Gr=47942', 'balance', startDate, endDate);
   var grAZ = getAmount(banDoc, 'Gr=AZ', 'balance', startDate, endDate);
   var gr4782 = getAmount(banDoc, 'Gr=4782', 'balance', startDate, endDate);
   var gr4792 = getAmount(banDoc, 'Gr=4792', 'balance', startDate, endDate);
   var res_a = 0;
   res_a = Banana.SDecimal.add(res_a, Banana.SDecimal.invert(grDF));
   res_a = Banana.SDecimal.add(res_a, gr47841);
   res_a = Banana.SDecimal.add(res_a, gr47842);
   res_a = Banana.SDecimal.add(res_a, Banana.SDecimal.invert(gr47941));
   res_a = Banana.SDecimal.add(res_a, Banana.SDecimal.invert(gr47942));
   var res_b = 0;
   res_b = Banana.SDecimal.add(res_b, grAZ);
   res_b = Banana.SDecimal.add(res_b, gr4782);
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(gr4792));
   var res = 0;
   res = Banana.SDecimal.subtract(res_a, res_b);
   return res;
}

/* Calculate FRP */
function calculate_FRP(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=CP,balance)
      }
      -
      {
         + getAmount(Gr=AZ,balance)
         + getAmount(Gr=4782,balance)
         + (-1)getAmount(Gr=4792,balance)
      }
   */
   var grCP = getAmount(banDoc, 'Gr=CP', 'balance', startDate, endDate);
   var grAZ = getAmount(banDoc, 'Gr=AZ', 'balance', startDate, endDate);
   var gr4782 = getAmount(banDoc, 'Gr=4782', 'balance', startDate, endDate);
   var gr4792 = getAmount(banDoc, 'Gr=4792', 'balance', startDate, endDate);
   var res_a = 0;
   res_a = Banana.SDecimal.invert(grCP);
   var res_b = 0;
   res_b = Banana.SDecimal.add(res_b, grAZ);
   res_b = Banana.SDecimal.add(res_b, gr4782);
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(gr4792));
   var res = 0;
   res = Banana.SDecimal.subtract(res_a, res_b);
   return res;
}

/* Calculate FRE */
function calculate_FRE(banDoc, startDate, endDate) {
   /*
      + (-1)getAmount(Gr=DD,balance)
      + getAmount(Gr=47841,balance)
      + getAmount(Gr=47842,balance)
      + (-1)getAmount(Gr=47941,balance)
      + (-1)getAmount(Gr=47942,balance)
   */
   var grDD = getAmount(banDoc, 'Gr=DD', 'balance', startDate, endDate);
   var gr47841 = getAmount(banDoc, 'Gr=47841', 'balance', startDate, endDate);
   var gr47842 = getAmount(banDoc, 'Gr=47842', 'balance', startDate, endDate);
   var gr47941 = getAmount(banDoc, 'Gr=47941', 'balance', startDate, endDate);
   var gr47942 = getAmount(banDoc, 'Gr=47942', 'balance', startDate, endDate);
   var res = 0;
   res = Banana.SDecimal.add(res, Banana.SDecimal.invert(grDD));
   res = Banana.SDecimal.add(res, gr47841);
   res = Banana.SDecimal.add(res, gr47842);
   res = Banana.SDecimal.add(res, Banana.SDecimal.invert(gr47941));
   res = Banana.SDecimal.add(res, Banana.SDecimal.invert(gr47942));
   return res;
}

/* Calculate BFRG */
function calculate_BFRG(banDoc, startDate, endDate) {
   /*
      {
         + getAmount(Gr=BK, balance)
         + getAmount(Gr=4781, balance)
         + getAmount(Gr=4783, balance)
      }
      -
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
      }
   */
   var grBK = getAmount(banDoc, 'Gr=BK', 'balance', startDate, endDate);
   var gr4781 = getAmount(banDoc, 'Gr=4781', 'balance', startDate, endDate);
   var gr4783 = getAmount(banDoc, 'Gr=4783', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var res_a = 0;
   res_a = Banana.SDecimal.add(res_a, grBK);
   res_a = Banana.SDecimal.add(res_a, gr4781);
   res_a = Banana.SDecimal.add(res_a, gr4783);
   var res_b = 0;
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(grDP));
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(gr4791));
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(gr4793));
   var res = 0;
   res = Banana.SDecimal.subtract(res_a, res_b);
   return res;
}

/* Calculate BFRE */
function calculate_BFRE(banDoc, startDate, endDate) {
   /*
      {
         + getAmount(Gr=BK, balance)
         + getAmount(Gr=4781, balance)
         + getAmount(Gr=4783, balance)
         - getAmount(Gr=BA, balance)
      }
      - 
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
         - (-1)getAmount(Gr=DH, balance)
      }
   */
   var grBK = getAmount(banDoc, 'Gr=BK', 'balance', startDate, endDate);
   var gr4781 = getAmount(banDoc, 'Gr=4781', 'balance', startDate, endDate);
   var gr4783 = getAmount(banDoc, 'Gr=4783', 'balance', startDate, endDate);
   var grBA = getAmount(banDoc, 'Gr=BA', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var grDH = getAmount(banDoc, 'Gr=DH', 'balance', startDate, endDate);
   var res_a = 0;
   res_a = Banana.SDecimal.add(res_a, grBK);
   res_a = Banana.SDecimal.add(res_a, gr4781);
   res_a = Banana.SDecimal.add(res_a, gr4783);
   res_a = Banana.SDecimal.subtract(res_a, grBA);
   var res_b = 0;
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(grDP));
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(gr4791));
   res_b = Banana.SDecimal.add(res_b, Banana.SDecimal.invert(gr4793));
   res_b = Banana.SDecimal.subtract(res_b, Banana.SDecimal.invert(grDH));
   var res = 0;
   res = Banana.SDecimal.subtract(res_a, res_b);
   return res;
}

/* Calculate BFHAO */
function calculate_BFHAO(banDoc, startDate, endDate) {
   /*
      + getAmount(Gr=BA, balance)
      - (-1)getAmount(Gr=DH, balance)
   */
   var grBA = getAmount(banDoc, 'Gr=BA', 'balance', startDate, endDate);
   var grDH = getAmount(banDoc, 'Gr=DH', 'balance', startDate, endDate);
   var res = 0;
   res = Banana.SDecimal.add(res, grBA);
   res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(grDH));
   return res;
}

/* Calculate TN */
function calculate_TN(banDoc, startDate, endDate) {
   /*
      + getAmount(Gr=BT, balance)
      - (-1)getAmount(Gr=DT, balance)
   */
   var grBT = getAmount(banDoc, 'Gr=BT', 'balance', startDate, endDate);
   var grDT = getAmount(banDoc, 'Gr=DT', 'balance', startDate, endDate);
   var res = 0;
   res = Banana.SDecimal.add(res, grBT);
   res = Banana.SDecimal.subtract(res, Banana.SDecimal.invert(grDT));
   return res;
}

/* Calculate RCAFR */
function calculate_RCAFR(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=DF, balance)
         + getAmount(Gr=47841, balance)
         + getAmount(Gr=47842, balance)
         + (-1)getAmount(Gr=47941, balance)
         + (-1)getAmount(Gr=47942, balance)
      }
      :
      {
         + getAmount(Gr=AZ, balance)
         + getAmount(Gr=4782, balance)
         + (-1)getAmount(Gr=4792, balance)
      }
      N: Numerator
      D: Denominator
   */
   var grDF = getAmount(banDoc, 'Gr=DF', 'balance', startDate, endDate);
   var gr47841 = getAmount(banDoc, 'Gr=47841', 'balance', startDate, endDate);
   var gr47842 = getAmount(banDoc, 'Gr=47842', 'balance', startDate, endDate);
   var gr47941 = getAmount(banDoc, 'Gr=47941', 'balance', startDate, endDate);
   var gr47942 = getAmount(banDoc, 'Gr=47942', 'balance', startDate, endDate);
   var grAZ = getAmount(banDoc, 'Gr=AZ', 'balance', startDate, endDate);
   var gr4782 = getAmount(banDoc, 'Gr=4782', 'balance', startDate, endDate);
   var gr4792 = getAmount(banDoc, 'Gr=4792', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grDF));
   res_N = Banana.SDecimal.add(res_N, gr47841);
   res_N = Banana.SDecimal.add(res_N, gr47842);
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr47941));
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr47942));
   var res_D = 0;
   res_D = Banana.SDecimal.add(res_D, grAZ);
   res_D = Banana.SDecimal.add(res_D, gr4782);
   res_D = Banana.SDecimal.add(res_D, gr4792);
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RCAFC */
function calculate_RCAFC(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=CP, balance)
      }
      :
      {
         + getAmount(Gr=AZ, balance)
         + getAmount(Gr=4782, balance)
         + (-1)getAmount(Gr=4792, balance)
      }
      N: Numerator
      D: Denominator
   */
   var grCP = getAmount(banDoc, 'Gr=CP', 'balance', startDate, endDate);
   var grAZ = getAmount(banDoc, 'Gr=AZ', 'balance', startDate, endDate);
   var gr4782 = getAmount(banDoc, 'Gr=4782', 'balance', startDate, endDate);
   var gr4792 = getAmount(banDoc, 'Gr=4792', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grCP));
   var res_D = 0;
   res_D = Banana.SDecimal.add(res_D, grAZ);
   res_D = Banana.SDecimal.add(res_D, gr4782);
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4792));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RBFRG */
function calculate_RBFRG(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=DF, balance)
         - getAmount(Gr=AZ, balance)
      }
      :
      {
         {
            + getAmount(Gr=BK, balance)
            + getAmount(Gr=4781, balance)
            + getAmount(Gr=4783, balance)
         }
         -
         {
            + (-1)getAmount(Gr=DP, balance)
            + (-1)getAmount(Gr=4791, balance)
            + (-1)getAmount(Gr=4793, balance)
         }
      }
   */
   var grDF = getAmount(banDoc, 'Gr=DF', 'balance', startDate, endDate);
   var grAZ = getAmount(banDoc, 'Gr=AZ', 'balance', startDate, endDate); 
   var grBK = getAmount(banDoc, 'Gr=BK', 'balance', startDate, endDate);
   var gr4781 = getAmount(banDoc, 'Gr=4781', 'balance', startDate, endDate);
   var gr4783 = getAmount(banDoc, 'Gr=4783', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grDF));
   res_N = Banana.SDecimal.subtract(res_N, grAZ);
   var res_D_a = 0;
   res_D_a = Banana.SDecimal.add(res_D_a, grBK);
   res_D_a = Banana.SDecimal.add(res_D_a, gr4781);
   res_D_a = Banana.SDecimal.add(res_D_a, gr4783);
   var res_D_b = 0;
   res_D_b = Banana.SDecimal.add(res_D_b, Banana.SDecimal.invert(grDP));
   res_D_b = Banana.SDecimal.add(res_D_b, Banana.SDecimal.invert(gr4791));
   res_D_b = Banana.SDecimal.add(res_D_b, Banana.SDecimal.invert(gr4793));
   var res_D = 0;
   res_D = Banana.SDecimal.subtract(res_D_a, res_D_b);
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RS */
function calculate_RS(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=DZ, balance)
      }
      :
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
         + (-1)getAmount(Gr=DD, balance)
         + getAmount(Gr=47841, balance)
         + getAmount(Gr=47842, balance)
         + (-1)getAmount(Gr=47941, balance)
         + (-1)getAmount(Gr=47942, balance)
      }
   */
   var grDZ = getAmount(banDoc, 'Gr=DZ', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var grDD = getAmount(banDoc, 'Gr=DD', 'balance', startDate, endDate);
   var gr47841 = getAmount(banDoc, 'Gr=47841', 'balance', startDate, endDate);
   var gr47842 = getAmount(banDoc, 'Gr=47842', 'balance', startDate, endDate);
   var gr47941 = getAmount(banDoc, 'Gr=47941', 'balance', startDate, endDate);
   var gr47942 = getAmount(banDoc, 'Gr=47942', 'balance', startDate, endDate);
   var res_N = 0
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grDZ));
   var res_D = 0;
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDP));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4791));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4793));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDD));
   res_D = Banana.SDecimal.add(res_D, gr47841);
   res_D = Banana.SDecimal.add(res_D, gr47842);
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr47941));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr47942));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RIF */
function calculate_RIF(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=CP, balance)
      }
      :
      {
         + (-1)getAmount(Gr=DZ, balance)
      }
   */
   var grCP = getAmount(banDoc, 'Gr=CP', 'balance', startDate, endDate);
   var grDZ = getAmount(banDoc, 'Gr=DZ', 'balance', startDate, endDate);
   var res_N = 0;
   var res_D = 0;
   var res = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grCP));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDZ));
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RDF */
function calculate_RDF(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
         + (-1)getAmount(Gr=DD, balance)
         + getAmount(Gr=47841, balance)
         + getAmount(Gr=47842, balance)
         + (-1)getAmount(Gr=47941, balance)
         + (-1)getAmount(Gr=47942, balance)
      }
      :
      {
         + (-1)getAmount(Gr=DZ, balance)
      }
      N = Numerator
      D = Denominator
   */
   var grDZ = getAmount(banDoc, 'Gr=DZ', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var grDD = getAmount(banDoc, 'Gr=DD', 'balance', startDate, endDate);
   var gr47841 = getAmount(banDoc, 'Gr=47841', 'balance', startDate, endDate);
   var gr47842 = getAmount(banDoc, 'Gr=47842', 'balance', startDate, endDate);
   var gr47941 = getAmount(banDoc, 'Gr=47941', 'balance', startDate, endDate);
   var gr47942 = getAmount(banDoc, 'Gr=47942', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grDP));
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr4791));
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr4793));
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(grDD));
   res_N = Banana.SDecimal.add(res_N, gr47841);
   res_N = Banana.SDecimal.add(res_N, gr47842);
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr47941));
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr47942));
   var res_D = 0
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDZ));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RLG */
function calculate_RLG(banDoc, startDate, endDate) {
   /*
      {
         + getAmount(Gr=BK, balance)
         + getAmount(Gr=4781, balance)
         + getAmount(Gr=4783, balance)
         + getAmount(Gr=BT, balance)
      }
      :
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
         + (-1)getAmount(Gr=DT, balance)
      }
      N = Numerator
      D = Denominator
   */
   var grBK = getAmount(banDoc, 'Gr=BK', 'balance', startDate, endDate);
   var gr4781 = getAmount(banDoc, 'Gr=4781', 'balance', startDate, endDate);
   var gr4783 = getAmount(banDoc, 'Gr=4783', 'balance', startDate, endDate);
   var grBT = getAmount(banDoc, 'Gr=BT', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var grDT = getAmount(banDoc, 'Gr=DT', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, grBK);
   res_N = Banana.SDecimal.add(res_N, gr4781);
   res_N = Banana.SDecimal.add(res_N, gr4783);
   res_N = Banana.SDecimal.add(res_N, grBT);
   var res_D = 0;
   res_D = Banana.SDecimal.add(res_D, grDP);
   res_D = Banana.SDecimal.add(res_D, gr4791);
   res_D = Banana.SDecimal.add(res_D, gr4793);
   res_D = Banana.SDecimal.add(res_D, grDT);
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RLR */
function calculate_RLR(banDoc, startDate, endDate) {
   /*
      {
         + getAmount(Gr=BA, total)
         + getAmount(Gr=BG, total)
         + getAmount(Gr=4781, total)
         + getAmount(Gr=4783, total)
         + getAmount(Gr=BT, total)
      }
      :
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
         + (-1)getAmount(Gr=DT, balance)
      }
      N = Numerator
      D = Denominator
   */
   var grBA = getAmount(banDoc, 'Gr=BA', 'total', startDate, endDate);
   var grBG = getAmount(banDoc, 'Gr=BG', 'total', startDate, endDate);
   var gr4781 = getAmount(banDoc, 'Gr=4781', 'total', startDate, endDate);
   var gr4783 = getAmount(banDoc, 'Gr=4783', 'total', startDate, endDate);
   var grBT = getAmount(banDoc, 'Gr=BT', 'total', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var grDT = getAmount(banDoc, 'Gr=DT', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, grBA);
   res_N = Banana.SDecimal.add(res_N, grBG);
   res_N = Banana.SDecimal.add(res_N, gr4781);
   res_N = Banana.SDecimal.add(res_N, gr4783);
   res_N = Banana.SDecimal.add(res_N, grBT);
   var res_D = 9;
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDP));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4791));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4793));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDT));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RLI */
function calculate_RLI(banDoc, startDate, endDate) {
   /*
      {
         + getAmount(Gr=BT, balance)
      }
      :
      {
         + (-1)getAmount(Gr=DP, balance)
         + (-1)getAmount(Gr=4791, balance)
         + (-1)getAmount(Gr=4793, balance)
         + (-1)getAmount(Gr=DT, balance)
      }
      N = Numerator
      D = Denominator
   */
   var grBT = getAmount(banDoc, 'Gr=BT', 'balance', startDate, endDate);
   var grDP = getAmount(banDoc, 'Gr=DP', 'balance', startDate, endDate);
   var gr4791 = getAmount(banDoc, 'Gr=4791', 'balance', startDate, endDate);
   var gr4793 = getAmount(banDoc, 'Gr=4793', 'balance', startDate, endDate);
   var grDT = getAmount(banDoc, 'Gr=DT', 'balance', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, grBT);
   var res_D = 9;
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDP));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4791));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(gr4793));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grDT));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RA */
function calculate_RA(banDoc, startDate, endDate) {
   /*
      {
         + (-1)getAmount(Gr=135, total)
      }
      :
      {
         + (-1)getAmount(Gr=TA, total)
         + (-1)getAmount(Gr=TB, total)
         + (-1)getAmount(Gr=TC, total)
         + (-1)getAmount(Gr=TD, total)
      }
   */
   var gr135 = getAmount(banDoc, 'Gr=135', 'total', startDate, endDate);
   var grTA = getAmount(banDoc, 'Gr=TA', 'total', startDate, endDate);
   var grTB = getAmount(banDoc, 'Gr=TB', 'total', startDate, endDate);
   var grTC = getAmount(banDoc, 'Gr=TC', 'total', startDate, endDate);
   var grTD = getAmount(banDoc, 'Gr=TD', 'total', startDate, endDate);
   var res_N = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr135));
   res_N = Banana.SDecimal.multiply(res_N, '100');
   var res_D = 0;
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grTA));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grTB));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grTC));
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grTD));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate TM */
function calculate_TM(banDoc, startDate, endDate) {
   /*
      { + (-1)getAmount(Gr=132, total) }
      :
      { + (-1)getAmount(Gr=TA, total) }
   */
   var gr132 = getAmount(banDoc, 'Gr=132', 'total', startDate, endDate);
   var grTA = getAmount(banDoc, 'Gr=TA', 'total', startDate, endDate);
   var res_N = 0;
   var res_D = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr132));
   res_N = Banana.SDecimal.multiply(res_N, '100');
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grTA));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate ROI */
function calculate_ROI(banDoc, startDate, endDate) {
   /*
      { + (-1)getAmount(Gr=135, total) }
      :
      { + getAmount(Gr=BZ, balance) }
   */
   var gr135 = getAmount(banDoc, 'Gr=135', 'total', startDate, endDate);
   var grBZ = getAmount(banDoc, 'Gr=BZ', 'balance', startDate, endDate);
   var res_N = 0;
   var res_D = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr135));
   res_N = Banana.SDecimal.multiply(res_N, '100');
   res_D = Banana.SDecimal.add(res_D, grBZ);
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RCP */
function calculate_RCP(banDoc, startDate, endDate) {
   /*
      { + (-1)getAmount(Gr=131, total) }
      :
      { + (-1)getAmount(Gr=CP, total) }
   */
   var gr131 = getAmount(banDoc, 'Gr=131', 'total', startDate, endDate);
   var grCP = getAmount(banDoc, 'Gr=CP', 'balance', startDate, endDate);
   var res_N = 0;
   var res_D = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr131));
   res_N = Banana.SDecimal.multiply(res_N, '100');
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grCP));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
   return res;
}

/* Calculate RCS */
function calculate_RCS(banDoc, startDate, endDate) {
   /*
      { + (-1)getAmount(Gr=131, total) }
      :
      { + (-1)getAmount(Gr=CA, total) }
   */
   var gr131 = getAmount(banDoc, 'Gr=131', 'total', startDate, endDate);
   var grCA = getAmount(banDoc, 'Gr=CA', 'balance', startDate, endDate);
   var res_N = 0;
   var res_D = 0;
   res_N = Banana.SDecimal.add(res_N, Banana.SDecimal.invert(gr131));
   res_N = Banana.SDecimal.multiply(res_N, '100');
   res_D = Banana.SDecimal.add(res_D, Banana.SDecimal.invert(grCA));
   var res = 0;
   res = Banana.SDecimal.divide(res_N, res_D, {'decimals':2});
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

function financialTable(report, style) {
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
   stylesheet.addStyle("body", "font-family:Helvetica; font-size:9pt");
   stylesheet.addStyle(".bold", "font-weight:bold;");
   stylesheet.addStyle(".right", "text-align:right;");
   stylesheet.addStyle(".center", "text-align:center");
   stylesheet.addStyle(".italic", "font-style:italic");

   /* table for header */
   var tableStyle = stylesheet.addStyle(".table");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".c1", "");
   stylesheet.addStyle(".c2", "");
   stylesheet.addStyle("table.table td", "");

    /* table */
   var tableStyle = stylesheet.addStyle(".table");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".c1", "");
   stylesheet.addStyle(".c2", "");
   stylesheet.addStyle(".c3", "");
   stylesheet.addStyle(".c4", "");  
   stylesheet.addStyle("table.table td", "");

   /* Financial table */
   var tableStyle = stylesheet.addStyle(".finTable");
   tableStyle.setAttribute("width", "100%");
   tableStyle.setAttribute("font-size", "9");
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
   stylesheet.addStyle("table.finTable td", "border:normal solid black;padding-top:2px;padding-bottom:2px");

   return stylesheet;
}