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
// @id = ch.banana.africa.profitlossstatementrdc.test
// @api = 1.0
// @pubdate = 2018-12-18
// @publisher = Banana.ch SA
// @description = [Test] Profit & Loss Statement Report (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.profitlossstatementrdc.js

// Register this test case to be executed
Test.registerTestCase(new TestProfitLossStatementRDC());

// Define the test class, the name of the class is not important
function TestProfitLossStatementRDC() {
}

// This method will be called at the beginning of the test case
TestProfitLossStatementRDC.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestProfitLossStatementRDC.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestProfitLossStatementRDC.prototype.init = function() {
}

// This method will be called after every test method is executed
TestProfitLossStatementRDC.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestProfitLossStatementRDC.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");

   var previous = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2019.ac2");
   var previousStartDate = previous.info("AccountingDataBase","OpeningDate");
   var previousEndDate = previous.info("AccountingDataBase","ClosureDate");

   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=TA','balance',startDate,endDate), 333160000.00);
   Test.assertIsEqual(-1*getAmount(previous,'Gr=TA','balance',previousStartDate,previousEndDate), 328750000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RA','balance',startDate,endDate), 218910000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RA','balance',previousStartDate,previousEndDate), 216920000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RB','balance',startDate,endDate), -11755000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RB','balance',previousStartDate,previousEndDate), -10670000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=132','balance',startDate,endDate)), 126005000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=132','balance',previousStartDate,previousEndDate)), 122500000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TB','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TB','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TC','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TC','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TD','balance',startDate,endDate)), 1500000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TD','balance',previousStartDate,previousEndDate)), 1500000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TA|TB|TC|TD','balance',startDate,endDate)), 334660000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TA|TB|TC|TD','balance',previousStartDate,previousEndDate)), 330250000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TE','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TE','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TF','balance',startDate,endDate)), 187000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TF','balance',previousStartDate,previousEndDate)), 2000000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TG','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TG','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TH','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TH','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TI','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TI','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RC','balance',startDate,endDate), 100000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RC','balance',previousStartDate,previousEndDate), 1500000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RD','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RD','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RE','balance',startDate,endDate), 40000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RE','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RF','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RF','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RG','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RG','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RH','balance',startDate,endDate), 3780600.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RH','balance',previousStartDate,previousEndDate), 3500000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RI','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RI','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RJ','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RJ','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=133','balance',startDate,endDate)), 123771400.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=133','balance',previousStartDate,previousEndDate)), 121000000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RK','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RK','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=134','balance',startDate,endDate)), 123771400.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=134','balance',previousStartDate,previousEndDate)), 121000000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TJ','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TJ','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RL','balance',startDate,endDate), 53333.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RL','balance',previousStartDate,previousEndDate), 53333.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=135','balance',startDate,endDate)), 123718067.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=135','balance',previousStartDate,previousEndDate)), 120946667.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TK','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TK','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TL','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TL','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TM','balance',startDate,endDate)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TM','balance',previousStartDate,previousEndDate)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RM','balance',startDate,endDate), 4595000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RM','balance',previousStartDate,previousEndDate), 9000000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RN','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RN','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=136','balance',startDate,endDate)), -4595000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=136','balance',previousStartDate,previousEndDate)), -9000000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=137','balance',startDate,endDate)), 119123067.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=137','balance',previousStartDate,previousEndDate)), 111946667.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TN','balance',startDate,endDate)), 29800000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TN','balance',previousStartDate,previousEndDate)), 9800000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TO','balance',startDate,endDate)), 300000.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TO','balance',previousStartDate,previousEndDate)), 300000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RO','balance',startDate,endDate), 22916267.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RO','balance',previousStartDate,previousEndDate), 2506667.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RP','balance',startDate,endDate), 250000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RP','balance',previousStartDate,previousEndDate), 250000.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=138','balance',startDate,endDate)), 6933733.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=138','balance',previousStartDate,previousEndDate)), 7343333.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RQ','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RQ','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RS','balance',startDate,endDate), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RS','balance',previousStartDate,previousEndDate), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=131','balance',startDate,endDate)), 126056800.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=131','balance',previousStartDate,previousEndDate)), 119290000.00);

}

TestProfitLossStatementRDC.prototype.testBananaApps = function() {
   Test.logger.addText("This test will tests the BananaApp profitlossstatement_rdc.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
   Test.assert(currentDocument, "current year file ac2 not found");

   var previousDocument = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2019.ac2");
   Test.assert(previousDocument, "Previous year file ac2 not found");

   // Add the report content text to the result txt file
   var report = createProfitLossStatementReport(currentDocument, previousDocument);
   Test.logger.addReport("Report Profit & Loss Statement RDC", report);

}
