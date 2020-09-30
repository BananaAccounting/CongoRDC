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
// @id = ch.banana.africa.financialanalysisrdcmulticurrency.test
// @api = 1.0
// @pubdate = 2020-08-24
// @publisher = Banana.ch SA
// @description = [Test] Financial Analysis Multicurrency
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.financialanalysisrdcmulticurrency.js

// Register this test case to be executed
Test.registerTestCase(new TestFinancialAnalysisMulticurrency());

// Define the test class, the name of the class is not important
function TestFinancialAnalysisMulticurrency() {
}

// This method will be called at the beginning of the test case
TestFinancialAnalysisMulticurrency.prototype.initTestCase = function() {
    this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestFinancialAnalysisMulticurrency.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestFinancialAnalysisMulticurrency.prototype.init = function() {
}

// This method will be called after every test method is executed
TestFinancialAnalysisMulticurrency.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can define as many test methods as you need

TestFinancialAnalysisMulticurrency.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(banDoc, "File ac2 not found");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");

   var userParam = {};
   userParam.title = "Analyse financière multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   // These methods verify that the two parameters are equals
   Test.assertIsEqual(Number(calculate_FRN(banDoc, startDate, endDate, userParam)), Number("34361.75"));
   Test.assertIsEqual(Number(calculate_FRP(banDoc, startDate, endDate, userParam)), Number("26361.75"));
   Test.assertIsEqual(Number(calculate_FRE(banDoc, startDate, endDate, userParam)), Number("8000.00"));
   Test.assertIsEqual(Number(calculate_BFRG(banDoc, startDate, endDate, userParam)), Number("30619.41"));
   Test.assertIsEqual(Number(calculate_BFRE(banDoc, startDate, endDate, userParam)), Number("30619.41"));
   Test.assertIsEqual(Number(calculate_BFHAO(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_TN(banDoc, startDate, endDate, userParam)), Number("3742.34"));
   Test.assertIsEqual(Number(calculate_RCAFR(banDoc, startDate, endDate, userParam)), Number("2.16"));
   Test.assertIsEqual(Number(calculate_RCAFC(banDoc, startDate, endDate, userParam)), Number("1.89"));
   Test.assertIsEqual(Number(calculate_RBFRG(banDoc, startDate, endDate, userParam)), Number("1.12"));
   Test.assertIsEqual(Number(calculate_RS(banDoc, startDate, endDate, userParam)), Number("2.06"));
   Test.assertIsEqual(Number(calculate_RIF(banDoc, startDate, endDate, userParam)), Number("0.52"));
   Test.assertIsEqual(Number(calculate_RDF(banDoc, startDate, endDate, userParam)), Number("0.48"));
   Test.assertIsEqual(Number(calculate_RLG(banDoc, startDate, endDate, userParam)), Number("-1.77"));
   Test.assertIsEqual(Number(calculate_RLR(banDoc, startDate, endDate, userParam)), Number("0.54"));
   Test.assertIsEqual(Number(calculate_RLI(banDoc, startDate, endDate, userParam)), Number("0.08"));
   Test.assertIsEqual(Number(calculate_RA(banDoc, startDate, endDate, userParam)), Number("-2318.47"));
   Test.assertIsEqual(Number(calculate_TM(banDoc, startDate, endDate, userParam)), Number("-2313.75"));
   Test.assertIsEqual(Number(calculate_ROI(banDoc, startDate, endDate, userParam)), Number("-453.31"));
   Test.assertIsEqual(Number(calculate_RCP(banDoc, startDate, endDate, userParam)), Number("16.52"));
   Test.assertIsEqual(Number(calculate_RCS(banDoc, startDate, endDate, userParam)), Number("34.19"));
}

TestFinancialAnalysisMulticurrency.prototype.testBananaExtensions = function() {
   Test.logger.addText("This test will tests the BananaApp financialanalysisrdcmulticurrency.js");

   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(currentDocument, "Current year file ac2 not found");

   var startDate = currentDocument.info("AccountingDataBase","OpeningDate");
   var endDate = currentDocument.info("AccountingDataBase","ClosureDate");

   var userParam = {};
   userParam.title = "Analyse financière multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   // Add the report content text to the result txt file
   var report = createFinancialAnalysisMulticurrencyReport(currentDocument, startDate, endDate, userParam);
   Test.logger.addReport("Report Financial Analysis RDC Multicurrency", report);
}