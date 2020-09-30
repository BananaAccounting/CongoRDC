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
// @id = ch.banana.africa.financialanalysisrdc.test
// @api = 1.0
// @pubdate = 2020-06-29
// @publisher = Banana.ch SA
// @description = [Test] Financial Analysis
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.financialanalysisrdc.js

// Register this test case to be executed
Test.registerTestCase(new TestFinancialAnalysis());

// Define the test class, the name of the class is not important
function TestFinancialAnalysis() {
}

// This method will be called at the beginning of the test case
TestFinancialAnalysis.prototype.initTestCase = function() {
    this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestFinancialAnalysis.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestFinancialAnalysis.prototype.init = function() {
}

// This method will be called after every test method is executed
TestFinancialAnalysis.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can define as many test methods as you need

TestFinancialAnalysis.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");

   // These methods verify that the two parameters are equals
   Test.assertIsEqual(Number(calculate_FRN(banDoc, startDate, endDate)), Number("420559800.00"));
   Test.assertIsEqual(Number(calculate_FRP(banDoc, startDate, endDate)), Number("72964800.00"));
   Test.assertIsEqual(Number(calculate_FRE(banDoc, startDate, endDate)), Number("347595000.00"));
   Test.assertIsEqual(Number(calculate_BFRG(banDoc, startDate, endDate)), Number("113126920.00"));
   Test.assertIsEqual(Number(calculate_BFRE(banDoc, startDate, endDate)), Number("185410920.00"));
   Test.assertIsEqual(Number(calculate_BFHAO(banDoc, startDate, endDate)), Number("-72284000.00"));
   Test.assertIsEqual(Number(calculate_TN(banDoc, startDate, endDate)), Number("294932880.00"));
   Test.assertIsEqual(Number(calculate_RCAFR(banDoc, startDate, endDate)), Number("2.45"));
   Test.assertIsEqual(Number(calculate_RCAFC(banDoc, startDate, endDate)), Number("1.25"));
   Test.assertIsEqual(Number(calculate_RBFRG(banDoc, startDate, endDate)), Number("3.65"));
   Test.assertIsEqual(Number(calculate_RS(banDoc, startDate, endDate)), Number("1.36"));
   Test.assertIsEqual(Number(calculate_RIF(banDoc, startDate, endDate)), Number("0.27"));
   Test.assertIsEqual(Number(calculate_RDF(banDoc, startDate, endDate)), Number("0.74"));
   Test.assertIsEqual(Number(calculate_RLG(banDoc, startDate, endDate)), Number("-1.63"));
   Test.assertIsEqual(Number(calculate_RLR(banDoc, startDate, endDate)), Number("0.65"));
   Test.assertIsEqual(Number(calculate_RLI(banDoc, startDate, endDate)), Number("0.46"));
   Test.assertIsEqual(Number(calculate_RA(banDoc, startDate, endDate)), Number("36.97"));
   Test.assertIsEqual(Number(calculate_TM(banDoc, startDate, endDate)), Number("37.82"));
   Test.assertIsEqual(Number(calculate_ROI(banDoc, startDate, endDate)), Number("9.17"));
   Test.assertIsEqual(Number(calculate_RCP(banDoc, startDate, endDate)), Number("34.73"));
   Test.assertIsEqual(Number(calculate_RCS(banDoc, startDate, endDate)), Number("93.38"));
}

TestFinancialAnalysis.prototype.testBananaApps = function() {
   Test.logger.addText("This test will tests the BananaApp financialanalysisrdc.js");

   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
   Test.assert(currentDocument, "Current year file ac2 not found");

   // Add the report content text to the result txt file
   var report = createFinancialAnalysisReport(currentDocument);
   Test.logger.addReport("Report Financial Analysis RDC", report);
}