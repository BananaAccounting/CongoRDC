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
// @id = ch.banana.africa.balancesheetrdcmulticurrency.test
// @api = 1.0
// @pubdate = 2020-08-23
// @publisher = Banana.ch SA
// @description = [Test] Bilan Multi-devise
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.balancesheetrdcmulticurrency.js


// Register this test case to be executed
Test.registerTestCase(new TestBalanceSheetMulticurrencyRDC());

// Define the test class, the name of the class is not important
function TestBalanceSheetMulticurrencyRDC() {
}

// This method will be called at the beginning of the test case
TestBalanceSheetMulticurrencyRDC.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestBalanceSheetMulticurrencyRDC.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestBalanceSheetMulticurrencyRDC.prototype.init = function() {
}

// This method will be called after every test method is executed
TestBalanceSheetMulticurrencyRDC.prototype.cleanup = function() {
}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestBalanceSheetMulticurrencyRDC.prototype.testVerifyMethods = function() {
   Test.logger.addText("The object Test defines methods to verify conditions.");

   var banDoc = Banana.application.openDocument("file:script/../test/testcases/testfile.ac2");
   Test.assert(banDoc, "File ac2 not found");
   var startDate = banDoc.info("AccountingDataBase","OpeningDate");
   var endDate = banDoc.info("AccountingDataBase","ClosureDate");

   var userParam = {};
   userParam.title = "Bilan Multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   /*
      Active Balance Sheet tests
   */
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AE-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AE-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AE','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AE','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AF-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AF-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AF','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AF','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AG-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AG-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AG','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AG','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AH-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AH-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AH','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AH','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AJ-1','balance',startDate,endDate,userParam), 10000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AJ-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AJ','balance',startDate,endDate,userParam), 10000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AJ','opening',startDate,endDate,userParam), 10000.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AK-1','balance',startDate,endDate,userParam), 15000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=AK-2','balance',startDate,endDate,userParam), 300.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AK','balance',startDate,endDate,userParam), 14700.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AK','opening',startDate,endDate,userParam), 14700.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AL-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AL-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AL','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AL','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AM-1','balance',startDate,endDate,userParam), 6000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=AM-2','balance',startDate,endDate,userParam), 1200.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AM','balance',startDate,endDate,userParam), 4800.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AM','opening',startDate,endDate,userParam), 4800.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AN-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AN-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AN','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AN','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AP-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AP-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AP','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AP','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AR-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AR-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AR','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AR','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AS-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AS-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AS','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AS','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AE-1|AF-1|AG-1|AH-1|AJ-1|AK-1|AL-1|AM-1|AN-1|AP-1|AR-1|AS-1','balance',startDate,endDate,userParam), 31000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=AE-2|AF-2|AG-2|AH-2|AJ-2|AK-2|AL-2|AM-2|AN-2|AP-2|AR-2|AS-2','balance',startDate,endDate,userParam), 1500.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AZ','balance',startDate,endDate,userParam), 29500.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=AZ','opening',startDate,endDate,userParam), 29500.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BA-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BA-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BA','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BA','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BB-1','balance',startDate,endDate,userParam), 25102.29);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BB-2','balance',startDate,endDate,userParam), 0);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BB','balance',startDate,endDate,userParam), 25102.29);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BB','opening',startDate,endDate,userParam), 14806.03);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BH-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BH-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BH','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BH','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BI-1','balance',startDate,endDate,userParam), 44490.60);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BI-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BI','balance',startDate,endDate,userParam), 44490.60);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BI','opening',startDate,endDate,userParam), 22718.36);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BJ-1','balance',startDate,endDate,userParam), 5517.25);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BJ-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BJ','balance',startDate,endDate,userParam), 5517.25);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BJ','opening',startDate,endDate,userParam), 2068.97);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BA-1|BB-1|BH-1|BI-1|BJ-1','balance',startDate,endDate,userParam), 75110.14);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BA-2|BB-2|BH-2|BI-2|BJ-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BK','balance',startDate,endDate,userParam), 75110.14);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BK','opening',startDate,endDate,userParam), 39593.36);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BQ-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BQ-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BQ','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BQ','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BR-1','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BR-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BR','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BR','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BS-1','balance',startDate,endDate,userParam), 3742.34);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BS-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BS','balance',startDate,endDate,userParam), 3742.34);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BS','opening',startDate,endDate,userParam), 4742.34);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BQ-1|BR-1|BS-1','balance',startDate,endDate,userParam), 3742.34);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BQ-2|BR-2|BS-2','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BT','balance',startDate,endDate,userParam), 3742.34);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BT','opening',startDate,endDate,userParam), 4742.34);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BU','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(1*getAmount(banDoc,'Gr=BU','opening',startDate,endDate,userParam), 0.00);

   var AZ1_exerciceN = getAmount(banDoc,'Gr=AE-1|AF-1|AG-1|AH-1|AJ-1|AK-1|AL-1|AM-1|AN-1|AP-1|AR-1|AS-1','balance',startDate,endDate,userParam);
   var BK1_exerciceN = getAmount(banDoc,'Gr=BA-1|BB-1|BG-1|BH-1|BI-1|BJ-1','balance',startDate,endDate,userParam);
   var BT1_exerciceN = getAmount(banDoc,'Gr=BQ-1|BR-1|BS-1','balance',startDate,endDate,userParam);
   var BU_exerciceN = getAmount(banDoc,'Gr=BU','balance',startDate,endDate,userParam);
   Test.assertIsEqual(1*calculate_BZ(AZ1_exerciceN,BK1_exerciceN,BT1_exerciceN,BU_exerciceN), 109852.48);

   var AZ2_exerciceN = getAmount(banDoc,'Gr=AE-2|AF-2|AG-2|AH-2|AJ-2|AK-2|AL-2|AM-2|AN-2|AP-2|AR-2|AS-2','balance',startDate,endDate,userParam);
   var BK2_exerciceN = getAmount(banDoc,'Gr=BA-2|BB-2|BG-2|BH-2|BI-2|BJ-2','balance',startDate,endDate,userParam);
   var BT2_exerciceN = getAmount(banDoc,'Gr=BQ-2|BR-2|BS-2','balance',startDate,endDate,userParam);
   //var BU_exerciceN = getAmount(banDoc,'Gr=BU','balance',startDate,endDate);
   Test.assertIsEqual(-1*calculate_BZ(AZ2_exerciceN,BK2_exerciceN,BT2_exerciceN), 1500.00);

   var AZ_exerciceN = getAmount(banDoc,'Gr=AZ','balance',startDate,endDate,userParam);
   var BK_exerciceN = getAmount(banDoc,'Gr=BK','balance',startDate,endDate,userParam);
   var BT_exerciceN = getAmount(banDoc,'Gr=BT','balance',startDate,endDate,userParam);
   var BU_exerciceN = getAmount(banDoc,'Gr=BU','balance',startDate,endDate,userParam);
   Test.assertIsEqual(1*calculate_BZ(AZ_exerciceN,BK_exerciceN,BT_exerciceN,BU_exerciceN), 108352.48);

   var AZ_exerciceN1 = getAmount(banDoc,'Gr=AZ','opening',startDate,endDate,userParam);
   var BK_exerciceN1 = getAmount(banDoc,'Gr=BK','opening',startDate,endDate,userParam);
   var BT_exerciceN1 = getAmount(banDoc,'Gr=BT','opening',startDate,endDate,userParam);
   var BU_exerciceN1 = getAmount(banDoc,'Gr=BU','opening',startDate,endDate,userParam);
   Test.assertIsEqual(1*calculate_BZ(AZ_exerciceN1,BK_exerciceN1,BT_exerciceN1,BU_exerciceN1), 73835.70);


   /*
      Passive Balance Sheet tests
   */
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CA','balance',startDate,endDate,userParam), 27000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CA','opening',startDate,endDate,userParam), 27000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CB','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CB','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CD','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CD','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CE','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CE','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CF','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CF','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CG','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CG','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CH','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CH','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CJ','balance',startDate,endDate,userParam), 28861.75);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CJ','opening',startDate,endDate,userParam), 19630.69);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CL','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CL','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CM','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CM','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CP','balance',startDate,endDate,userParam), 55861.75);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=CP','opening',startDate,endDate,userParam), 46630.69);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DA','balance',startDate,endDate,userParam), 8000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DA','opening',startDate,endDate,userParam), 8000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DB','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DB','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DC','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DC','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DD','balance',startDate,endDate,userParam), 8000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DD','opening',startDate,endDate,userParam), 8000.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DF','balance',startDate,endDate,userParam), 63861.75);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DF','opening',startDate,endDate,userParam), 54630.69);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DH','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DH','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DI','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DI','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DJ','balance',startDate,endDate,userParam), 44490.73);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DJ','opening',startDate,endDate,userParam), 19205.01);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DK','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DK','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DM','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DM','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DN','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DN','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DP','balance',startDate,endDate,userParam), 44490.73);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DP','opening',startDate,endDate,userParam), 19205.01);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DQ','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DQ','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DR','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DR','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DT','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DT','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DV','balance',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DV','opening',startDate,endDate,userParam), 0.00);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DZ','balance',startDate,endDate,userParam), 108352.48);
   Test.assertIsEqual(-1*getAmount(banDoc,'Gr=DZ','opening',startDate,endDate,userParam), 73835.70);

}

TestBalanceSheetMulticurrencyRDC.prototype.testBananaExtensions = function() {
   Test.logger.addText("This test will tests the BananaApp balancesheetrdcmulticurrency.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/testfile.ac2");
   Test.assert(currentDocument, "File ac2 not found");

   var startDate = currentDocument.info("AccountingDataBase","OpeningDate");
   var endDate = currentDocument.info("AccountingDataBase","ClosureDate");

   var userParam = {};
   userParam.title = "Bilan Multi-devise";
   userParam.currency = "USD";
   userParam.exchangerate = "";

   // Add the report content text to the result txt file
   var report = createBalanceSheetMulticurrencyReport(currentDocument,startDate,endDate,userParam);
   Test.logger.addReport("Report Balance Sheet Multicurrency RDC", report);

}