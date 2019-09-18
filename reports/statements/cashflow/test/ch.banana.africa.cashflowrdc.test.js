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
// @id = ch.banana.africa.cashflowrdc.test
// @api = 1.0
// @pubdate = 2019-04-01
// @publisher = Banana.ch SA
// @description = [Test] Cash Flow RDC
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.cashflowrdc.js

// Register this test case to be executed
Test.registerTestCase(new TestCashflowRDC());

// Define the test class, the name of the class is not important
function TestCashflowRDC() {
}

// This method will be called at the beginning of the test case
TestCashflowRDC.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestCashflowRDC.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestCashflowRDC.prototype.init = function() {
}

// This method will be called after every test method is executed
TestCashflowRDC.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestCashflowRDC.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/accounting_2018.ac2");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");
   
   // These methods verify that the two parameters are equals
   Test.assertIsEqual(calculate_ZA(banDoc, startDate, endDate), "140.00");
   Test.assertIsEqual(calculate_FA(banDoc, startDate, endDate), "-38.00");
   Test.assertIsEqual(calculate_FB(banDoc, startDate, endDate), "3.00");
   Test.assertIsEqual(calculate_FC(banDoc, startDate, endDate), "8.00");
   Test.assertIsEqual(calculate_FD(banDoc, startDate, endDate), "-74.00");
   Test.assertIsEqual(calculate_FE(banDoc, startDate, endDate), "-36.00");
   Test.assertIsEqual(calculate_FF(banDoc, startDate, endDate), "19.00");
   Test.assertIsEqual(calculate_FG(banDoc, startDate, endDate), "4.00");
   Test.assertIsEqual(calculate_FH(banDoc, startDate, endDate), "-5.00");
   Test.assertIsEqual(calculate_FI(banDoc, startDate, endDate), "109.00");
   Test.assertIsEqual(calculate_FJ(banDoc, startDate, endDate), "10.00");
   Test.assertIsEqual(calculate_FK(banDoc, startDate, endDate), "4.00");
   Test.assertIsEqual(calculate_FL(banDoc, startDate, endDate), "13.00");
   Test.assertIsEqual(calculate_FM(banDoc, startDate, endDate), "10.00");
   Test.assertIsEqual(calculate_FN(banDoc, startDate, endDate), "5.00");
   Test.assertIsEqual(calculate_FO(banDoc, startDate, endDate), "51.00");
   Test.assertIsEqual(calculate_FP(banDoc, startDate, endDate), "");
   Test.assertIsEqual(calculate_FQ(banDoc, startDate, endDate), "47.00");
   
   var tot_BF = calculate_tot_BF(
      calculate_FB(banDoc, startDate, endDate),
      calculate_FC(banDoc, startDate, endDate),
      calculate_FD(banDoc, startDate, endDate),
      calculate_FE(banDoc, startDate, endDate));
   Test.assertIsEqual(tot_BF, "-99.00");
   
   var tot_ZB = calculate_tot_ZB(
      calculate_FA(banDoc, startDate, endDate),
      calculate_FB(banDoc, startDate, endDate),
      calculate_FC(banDoc, startDate, endDate),
      calculate_FD(banDoc, startDate, endDate),
      calculate_FE(banDoc, startDate, endDate));
   Test.assertIsEqual(tot_ZB, "-11.00");

   var tot_ZC = calculate_tot_ZC(
      calculate_FF(banDoc, startDate, endDate),
      calculate_FG(banDoc, startDate, endDate),
      calculate_FH(banDoc, startDate, endDate),
      calculate_FI(banDoc, startDate, endDate),
      calculate_FJ(banDoc, startDate, endDate));
   Test.assertIsEqual(tot_ZC, "101.00");

   var tot_ZD = calculate_tot_ZD(
      calculate_FK(banDoc, startDate, endDate),
      calculate_FL(banDoc, startDate, endDate),
      calculate_FM(banDoc, startDate, endDate),
      calculate_FN(banDoc, startDate, endDate));
   Test.assertIsEqual(tot_ZD, "2.00");

   var tot_ZE = calculate_tot_ZE(
      calculate_FO(banDoc, startDate, endDate),
      calculate_FP(banDoc, startDate, endDate),
      calculate_FQ(banDoc, startDate, endDate));
   Test.assertIsEqual(tot_ZE, "4.00");

   var tot_ZF = calculate_tot_ZF(tot_ZD,tot_ZE);
   Test.assertIsEqual(tot_ZF, "6.00");

   var tot_ZG = calculate_tot_ZG(tot_ZB,tot_ZC,tot_ZF);
   Test.assertIsEqual(tot_ZG, "96.00");

   var tot_ZH = calculate_tot_ZH(tot_ZG,calculate_ZA(banDoc, startDate, endDate));
   Test.assertIsEqual(tot_ZH, "236.00");

}

TestCashflowRDC.prototype.testBananaApps = function() {
   Test.logger.addText("This test will tests the BananaApp cashflow_rdc.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/accounting_2018.ac2");
   Test.assert(currentDocument, "Current year file ac2 not found");

   var previousDocument = Banana.application.openDocument("file:script/../test/testcases/accounting_2017.ac2");
   Test.assert(previousDocument, "Previous year file ac2 not found");
   
   // Add the report content text to the result txt file
   var report = createCashFlowReport(currentDocument, previousDocument);
   Test.logger.addReport("Report Cash Flow RDC", report);

}
