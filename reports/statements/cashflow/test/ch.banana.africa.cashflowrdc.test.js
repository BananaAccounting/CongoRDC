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
// @pubdate = 2019-10-09
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

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");
   
   // These methods verify that the two parameters are equals
   Test.assertIsEqual(Number(calculate_ZA(banDoc, startDate, endDate)), Number("267862400.00"));
   Test.assertIsEqual(Number(calculate_FA(banDoc, startDate, endDate)), Number("2065000.00"));
   Test.assertIsEqual(Number(calculate_FB(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FC(banDoc, startDate, endDate)), Number("1085000.00"));
   Test.assertIsEqual(Number(calculate_FD(banDoc, startDate, endDate)), Number("1422800.00"));
   Test.assertIsEqual(Number(calculate_FE(banDoc, startDate, endDate)), Number("826400.00"));
   Test.assertIsEqual(Number(calculate_FF(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FG(banDoc, startDate, endDate)), Number("4640000.00"));
   Test.assertIsEqual(Number(calculate_FH(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FI(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FJ(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FK(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FL(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FM(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FN(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FO(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FP(banDoc, startDate, endDate)), Number("0.00"));
   Test.assertIsEqual(Number(calculate_FQ(banDoc, startDate, endDate)), Number("0.00"));
   
   var tot_BF = calculate_tot_BF(
      calculate_FB(banDoc, startDate, endDate),
      calculate_FC(banDoc, startDate, endDate),
      calculate_FD(banDoc, startDate, endDate),
      calculate_FE(banDoc, startDate, endDate));
   Test.assertIsEqual(Number(tot_BF), Number("3334200.00"));
   
   var tot_ZB = calculate_tot_ZB(
      calculate_FA(banDoc, startDate, endDate),
      calculate_FB(banDoc, startDate, endDate),
      calculate_FC(banDoc, startDate, endDate),
      calculate_FD(banDoc, startDate, endDate),
      calculate_FE(banDoc, startDate, endDate));
   Test.assertIsEqual(Number(tot_ZB), Number("383600.00"));

   var tot_ZC = calculate_tot_ZC(
      calculate_FF(banDoc, startDate, endDate),
      calculate_FG(banDoc, startDate, endDate),
      calculate_FH(banDoc, startDate, endDate),
      calculate_FI(banDoc, startDate, endDate),
      calculate_FJ(banDoc, startDate, endDate));
   Test.assertIsEqual(Number(tot_ZC), Number("-4640000.00"));

   var tot_ZD = calculate_tot_ZD(
      calculate_FK(banDoc, startDate, endDate),
      calculate_FL(banDoc, startDate, endDate),
      calculate_FM(banDoc, startDate, endDate),
      calculate_FN(banDoc, startDate, endDate));
   Test.assertIsEqual(Number(tot_ZD), Number("0.00"));

   var tot_ZE = calculate_tot_ZE(
      calculate_FO(banDoc, startDate, endDate),
      calculate_FP(banDoc, startDate, endDate),
      calculate_FQ(banDoc, startDate, endDate));
   Test.assertIsEqual(Number(tot_ZE), Number("0.00"));

   var tot_ZF = calculate_tot_ZF(tot_ZD,tot_ZE);
   Test.assertIsEqual(Number(tot_ZF), Number("0.00"));

   var tot_ZG = calculate_tot_ZG(tot_ZB,tot_ZC,tot_ZF);
   Test.assertIsEqual(Number(tot_ZG), Number("-4256400.00"));

   var tot_ZH = calculate_tot_ZH(tot_ZG,calculate_ZA(banDoc, startDate, endDate));
   Test.assertIsEqual(Number(tot_ZH), Number("263606000.00"));

}

TestCashflowRDC.prototype.testBananaApps = function() {
   Test.logger.addText("This test will tests the BananaApp cashflow_rdc.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
   Test.assert(currentDocument, "Current year file ac2 not found");

   var previousDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2019.ac2");
   Test.assert(previousDocument, "Previous year file ac2 not found");
   
   // Add the report content text to the result txt file
   var report = createCashFlowReport(currentDocument, previousDocument);
   Test.logger.addReport("Report Cash Flow RDC", report);

}
