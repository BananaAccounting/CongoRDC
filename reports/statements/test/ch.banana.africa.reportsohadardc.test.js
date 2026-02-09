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
// @includejs = ../ch.banana.africa.reportsohadardc.js


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

TestMonoReportsOhadaRDC.prototype.testImport = function () {
    Test.logger.addText("This test will tests the BananaApp balancesheet_rdc.js");

    var banDoc = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
    var startDate = banDoc.info("AccountingDataBase","OpeningDate");
    var endDate = banDoc.info("AccountingDataBase","ClosureDate");

    Test.assert(banDoc, "File ac2 not found");

    
}