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
// @id = ch.banana.africa.cashflowrdcmulticurrency.test
// @api = 1.0
// @pubdate = 2020-08-24
// @publisher = Banana.ch SA
// @description = [Test] Cash Flow Multi-devise RDC
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.cashflowrdcmulticurrency.js

// Register this test case to be executed
Test.registerTestCase(new TestCashflowRDCMulticurrency());

// Define the test class, the name of the class is not important
function TestCashflowRDCMulticurrency() {
}

// This method will be called at the beginning of the test case
TestCashflowRDCMulticurrency.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestCashflowRDCMulticurrency.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestCashflowRDCMulticurrency.prototype.init = function() {
}

// This method will be called after every test method is executed
TestCashflowRDCMulticurrency.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestCashflowRDCMulticurrency.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(banDoc, "File ac2 not found");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");
   
   var userParam = {};
   userParam.title = "Bilan Multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";
   
   // These methods verify that the two parameters are equals
   Test.assertIsEqual(Number(calculate_ZA(banDoc, startDate, endDate, userParam)), Number("4742.34"));
   Test.assertIsEqual(Number(calculate_FA(banDoc, startDate, endDate, userParam)), Number("9231.06"));
   Test.assertIsEqual(Number(calculate_FB(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FC(banDoc, startDate, endDate, userParam)), Number("10296.26"));
   Test.assertIsEqual(Number(calculate_FD(banDoc, startDate, endDate, userParam)), Number("25220.52"));
   Test.assertIsEqual(Number(calculate_FE(banDoc, startDate, endDate, userParam)), Number("25285.72"));
   Test.assertIsEqual(Number(calculate_FF(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FG(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FH(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FI(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FJ(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FK(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FL(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FM(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FN(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FO(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FP(banDoc, startDate, endDate, userParam)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FQ(banDoc, startDate, endDate, userParam)), Number("0.00"));
   
   var tot_BF = calculate_tot_BF(
      calculate_FB(banDoc, startDate, endDate, userParam),
      calculate_FC(banDoc, startDate, endDate, userParam),
      calculate_FD(banDoc, startDate, endDate, userParam),
      calculate_FE(banDoc, startDate, endDate, userParam));
   Test.assertIsEqual(Number(tot_BF), Number("60802.50"));
   
   var tot_ZB = calculate_tot_ZB(
      calculate_FA(banDoc, startDate, endDate, userParam),
      calculate_FB(banDoc, startDate, endDate, userParam),
      calculate_FC(banDoc, startDate, endDate, userParam),
      calculate_FD(banDoc, startDate, endDate, userParam),
      calculate_FE(banDoc, startDate, endDate, userParam));
   Test.assertIsEqual(Number(tot_ZB), Number("-1000.00"));

   var tot_ZC = calculate_tot_ZC(
      calculate_FF(banDoc, startDate, endDate, userParam),
      calculate_FG(banDoc, startDate, endDate, userParam),
      calculate_FH(banDoc, startDate, endDate, userParam),
      calculate_FI(banDoc, startDate, endDate, userParam),
      calculate_FJ(banDoc, startDate, endDate, userParam));
   Test.assertIsEqual(Number(tot_ZC), Number("0.00"));

   var tot_ZD = calculate_tot_ZD(
      calculate_FK(banDoc, startDate, endDate, userParam),
      calculate_FL(banDoc, startDate, endDate, userParam),
      calculate_FM(banDoc, startDate, endDate, userParam),
      calculate_FN(banDoc, startDate, endDate, userParam));
   Test.assertIsEqual(Number(tot_ZD), Number("0.00"));

   var tot_ZE = calculate_tot_ZE(
      calculate_FO(banDoc, startDate, endDate, userParam),
      calculate_FP(banDoc, startDate, endDate, userParam),
      calculate_FQ(banDoc, startDate, endDate, userParam));
   Test.assertIsEqual(Number(tot_ZE), Number("0.00"));

   var tot_ZF = calculate_tot_ZF(tot_ZD,tot_ZE);
   Test.assertIsEqual(Number(tot_ZF), Number("0.00"));

   var tot_ZG = calculate_tot_ZG(tot_ZB,tot_ZC,tot_ZF);
   Test.assertIsEqual(Number(tot_ZG), Number("-1000.00"));

   var tot_ZH = calculate_tot_ZH(tot_ZG,calculate_ZA(banDoc, startDate, endDate, userParam));
   Test.assertIsEqual(Number(tot_ZH), Number("3742.34"));

}

TestCashflowRDCMulticurrency.prototype.testBananaApptestBananaExtensions = function() {
   Test.logger.addText("This test will tests the BananaApp cashflowrdcmulticurrency.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(currentDocument, "Current year file ac2 not found");

   var startDate = currentDocument.info("AccountingDataBase","OpeningDate");
   var endDate = currentDocument.info("AccountingDataBase","ClosureDate");

   var userParam = {};
   userParam.title = "Bilan Multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   var previousDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2019.ac2");
   Test.assert(previousDocument, "Previous year file ac2 not found");
   
   // Add the report content text to the result txt file
   var report = createCashFlowReportMulticurrency(currentDocument, previousDocument, startDate, endDate, userParam);
   Test.logger.addReport("Report Cash Flow RDC", report);

}
