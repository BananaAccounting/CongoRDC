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
// @id = ch.banana.africa.reportsohadardc.test
// @api = 1.0
// @pubdate = 2026-02-05
// @publisher = Banana.ch SA
// @description = [Test] Balance Sheet, Profit/Loss Statement, Cash Flow Mono-currency
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../balancesheet/ch.banana.africa.balancesheetrdc.js
// @includejs = ../profitlossstatement/ch.banana.africa.profitlossstatementrdc.js
// @includejs = ../cashflow/ch.banana.africa.cashflowrdc.js


// Register this test case to be executed
Test.registerTestCase(new TestMonoReportsOhadaRDC());

// Define the test class, the name of the class is not important
function TestMonoReportsOhadaRDC() {
}

// This method will be called at the beginning of the test case
TestMonoReportsOhadaRDC.prototype.initTestCase = function () {
   this.testLogger = Test.logger;
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestMonoReportsOhadaRDC.prototype.cleanupTestCase = function () {

}

// This method will be called before every test method is executed
TestMonoReportsOhadaRDC.prototype.init = function () {

}

// This method will be called after every test method is executed
TestMonoReportsOhadaRDC.prototype.cleanup = function () {

}

TestMonoReportsOhadaRDC.prototype.testBananaApps = function () {
    Test.logger.addText("This test will tests the BananaApp balancesheet_rdc.js");

    var currentDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
    Test.assert(currentDocument, "Current year file ac2 not found");

    var previousDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2019.ac2");
    Test.assert(previousDocument, "Previous year file ac2 not found");

    var startDate = currentDocument.info("AccountingDataBase", "OpeningDate");
    var endDate = currentDocument.info("AccountingDataBase", "ClosureDate");

    var stylesheet = createStyleSheet();

    var report = Banana.Report.newReport("Bilan, Compte de résultat, Tableau des flux de tresorerie Mono-devise (OHADA - RDC) [BETA]");

    /* 1. Balance Sheet report */
    createBalanceSheetReport(currentDocument, startDate, endDate, stylesheet, report);
    report.addPageBreak();

    /* 2. Profit/Loss Statement report */
    createProfitLossStatementReport(currentDocument, previousDocument, startDate, endDate, report);
    report.addPageBreak();

    /* 3. Cash Flow report */
    createCashFlowReport(currentDocument, previousDocument, startDate, endDate, report);

    Test.logger.addReport("Report Balance Sheet, Profit/Loss Statement, Cash Flow Mono-currency", report);

    
}