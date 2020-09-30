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
// @id = ch.banana.africa.profitlossmulticurrency.test
// @api = 1.0
// @pubdate = 2020-08-23
// @publisher = Banana.ch SA
// @description = [Test] Profit & Loss Statement Multicurrency Report (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.profitlossmulticurrency.js

// Register this test case to be executed
Test.registerTestCase(new TestProfitLossStatementRDCMulticurrency());

// Define the test class, the name of the class is not important
function TestProfitLossStatementRDCMulticurrency() {
}

// This method will be called at the beginning of the test case
TestProfitLossStatementRDCMulticurrency.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestProfitLossStatementRDCMulticurrency.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestProfitLossStatementRDCMulticurrency.prototype.init = function() {
}

// This method will be called after every test method is executed
TestProfitLossStatementRDCMulticurrency.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestProfitLossStatementRDCMulticurrency.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");

   var userParam = {};
   userParam.title = "Compte de résultat multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   var previous = Banana.application.openDocument("file:script/../test/testcases/testfile_2019.ac2");
   var previousStartDate = previous.info("AccountingDataBase","OpeningDate");
   var previousEndDate = previous.info("AccountingDataBase","ClosureDate");

   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=TA','balance',startDate,endDate,userParam), 21185.08);
   Test.assertIsEqual(-1*getAmount(previous,'Gr=TA','balance',previousStartDate,previousEndDate,userParam), 21151.97);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RA','balance',startDate,endDate,userParam), 521651.06);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RA','balance',previousStartDate,previousEndDate,userParam), 13013.81);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RB','balance',startDate,endDate,userParam), -10296.26);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RB','balance',previousStartDate,previousEndDate,userParam), -10806.02);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=132','balance',startDate,endDate,userParam)), -490169.72);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=132','balance',previousStartDate,previousEndDate,userParam)), 18944.18);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TB','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TB','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TC','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TC','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TD','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TD','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TA|TB|TC|TD','balance',startDate,endDate,userParam)), 21185.08);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TA|TB|TC|TD','balance',previousStartDate,previousEndDate,userParam)), 21151.97);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TE','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TE','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TF','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TF','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TG','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TG','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TH','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TH','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TI','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TI','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RC','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RC','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RD','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RD','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RE','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RE','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RF','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RF','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RG','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RG','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RH','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RH','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RI','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RI','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RJ','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RJ','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=133','balance',startDate,endDate,userParam)), -490169.72);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=133','balance',previousStartDate,previousEndDate,userParam)), 18944.18);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RK','balance',startDate,endDate,userParam), 1000.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RK','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=134','balance',startDate,endDate,userParam)), -491169.72);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=134','balance',previousStartDate,previousEndDate,userParam)), 18944.18);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TJ','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TJ','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RL','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RL','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=135','balance',startDate,endDate,userParam)), -491169.72);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=135','balance',previousStartDate,previousEndDate,userParam)), 18944.18);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TK','balance',startDate,endDate,userParam)), 500403.35);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TK','balance',previousStartDate,previousEndDate,userParam)), 689.08);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TL','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TL','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TM','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TM','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RM','balance',startDate,endDate,userParam), 2.57);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RM','balance',previousStartDate,previousEndDate,userParam), 2.57);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RN','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RN','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=136','balance',startDate,endDate,userParam)), 500400.78);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=136','balance',previousStartDate,previousEndDate,userParam)), 686.51);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=137','balance',startDate,endDate,userParam)), 9231.06);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=137','balance',previousStartDate,previousEndDate,userParam)), 19630.69);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TN','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TN','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=TO','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=TO','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RO','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RO','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RP','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RP','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=138','balance',startDate,endDate,userParam)), 0.00);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=138','balance',previousStartDate,previousEndDate,userParam)), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RQ','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RQ','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=RS','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(previous,'Gr=RS','balance',previousStartDate,previousEndDate,userParam), 0.00);
   Test.assertIsEqual(-1*(getAmount(banDoc,'Gr=131','balance',startDate,endDate,userParam)), 9231.06);
   Test.assertIsEqual(-1*(getAmount(previous,'Gr=131','balance',previousStartDate,previousEndDate,userParam)), 19630.69);

}

TestProfitLossStatementRDCMulticurrency.prototype.testBananaExtensions = function() {
   Test.logger.addText("This test will tests the BananaApp profitlossstatementrdcmulticurrency.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(currentDocument, "current year file ac2 not found");
   var startDate = currentDocument.info("AccountingDataBase","OpeningDate");
   var endDate = currentDocument.info("AccountingDataBase","ClosureDate");

   var previousDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2019.ac2");
   Test.assert(previousDocument, "Previous year file ac2 not found");

   var userParam = {};
   userParam.title = "Compte de résultat multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   // Add the report content text to the result txt file
   var report = createProfitLossStatementReportMulticurrency(currentDocument, previousDocument, startDate, endDate, userParam);
   Test.logger.addReport("Report Profit & Loss Statement RDC", report);

}