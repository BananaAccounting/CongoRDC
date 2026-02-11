// Copyright [2026] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.africa.reportsohadardcmulticurrency.test
// @api = 1.0
// @pubdate = 2026-02-05
// @publisher = Banana.ch SA
// @description = [Test] Balance Sheet, Profit/Loss Statement, Cash Flow Multi-currency
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../balancesheet_multicurrency/ch.banana.africa.balancesheetrdcmulticurrency.js
// @includejs = ../profitloss_multicurrency/ch.banana.africa.profitlossmulticurrency.js
// @includejs = ../cashflow_multicurrency/ch.banana.africa.cashflowrdcmulticurrency.js


// Register this test case to be executed
Test.registerTestCase(new TestMultiReportsOhadaRDC());

// Define the test class, the name of the class is not important
function TestMultiReportsOhadaRDC() {
}

// This method will be called at the beginning of the test case
TestMultiReportsOhadaRDC.prototype.initTestCase = function () {
   this.testLogger = Test.logger;
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestMultiReportsOhadaRDC.prototype.cleanupTestCase = function () {

}

// This method will be called before every test method is executed
TestMultiReportsOhadaRDC.prototype.init = function () {

}

// This method will be called after every test method is executed
TestMultiReportsOhadaRDC.prototype.cleanup = function () {

}

TestMultiReportsOhadaRDC.prototype.testBananaApps = function () {
   Test.logger.addText("This test will tests the BananaApp reportsohadardcmulticurrency.js");

   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(currentDocument, "Current year file ac2 not found");

   var previousDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2019.ac2");
   Test.assert(previousDocument, "Previous year file ac2 not found");

   var startDate = currentDocument.info("AccountingDataBase", "OpeningDate");
   var endDate = currentDocument.info("AccountingDataBase", "ClosureDate");

   var userParam = {};
   userParam.title = "Rapports comptables multi-devise";
   userParam.currency = 'CDF';
   userParam.exchangerate = "";
   userParam.decimals = false;

   var stylesheet = Banana.Report.newStyleSheet();
   stylesheet.addStyle("@page", "margin:20mm 10mm 10mm 20mm;");
   stylesheet.addStyle("body", "font-family:Helvetica; font-size:9pt");
   stylesheet.addStyle(".bold", "font-weight:bold;");
   stylesheet.addStyle(".right", "text-align:right;");
   stylesheet.addStyle(".center", "text-align:center");

   var report = Banana.Report.newReport("Bilan, Compte de résultat, Tableau des flux de tresorerie Multi-devise (OHADA - RDC) [BETA]");

   /* 1. Balance Sheet Multicurrency report */
   createBalanceSheetMulticurrencyReport(currentDocument, startDate, endDate, userParam, stylesheet, report);
   report.addPageBreak();

   /* 2. Profit/Loss Statement Multicurrency report */
   createProfitLossStatementReportMulticurrency(currentDocument, previousDocument, startDate, endDate, userParam, report);
   report.addPageBreak();

   /* 3. Cash Flow Multicurrency report */
   createCashFlowReportMulticurrency(currentDocument, previousDocument, startDate, endDate, userParam, report);

   Test.logger.addReport("Report Balance Sheet, Profit/Loss Statement, Cash Flow Multi-currency", report);
}