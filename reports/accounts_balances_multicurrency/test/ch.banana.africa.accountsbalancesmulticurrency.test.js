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
// @id = ch.banana.africa.accountsbalancesmulticurrency.test
// @api = 1.0
// @pubdate = 2020-03-13
// @publisher = Banana.ch SA
// @description = [Test] Balance des comptes
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.accountsbalancesmulticurrency.js

// Register this test case to be executed
Test.registerTestCase(new TestAccountsBalancesMulticurrency());

// Define the test class, the name of the class is not important
function TestAccountsBalancesMulticurrency() {
}

// This method will be called at the beginning of the test case
TestAccountsBalancesMulticurrency.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestAccountsBalancesMulticurrency.prototype.cleanupTestCase = function() {
}

// This method will be called before every test method is executed
TestAccountsBalancesMulticurrency.prototype.init = function() {
}

// This method will be called after every test method is executed
TestAccountsBalancesMulticurrency.prototype.cleanup = function() {
}

TestAccountsBalancesMulticurrency.prototype.testBananaExtensions = function() {
   Test.logger.addText("This test will tests the Banana Extension accountsbalancesmulticurrency.js");
   
   var currentDocument = Banana.application.openDocument("file:script/../test/testcases/testfile_2020.ac2");
   Test.assert(currentDocument, "File ac2 not found");

   var currentStartDate  = currentDocument.info("AccountingDataBase","OpeningDate");
   var currentEndDate = currentDocument.info("AccountingDataBase","ClosureDate");
   
   // TEST 1
   var userParam = {};
   userParam.title = "Balance des comptes";
   userParam.currency = "CDF";
   userParam.exchangerate = "";
   userParam.amount_columns_width = "15%";
   userParam.margins = "10mm 10mm 10mm 10mm";
   var form = getAccounts(currentDocument,userParam.currency);
   var report = createAccountsBalancesReport(currentDocument, currentStartDate, currentEndDate, form, userParam);
   Test.logger.addReport("TEST 1 - Report Accounts Balances", report);

   //TEST 2
   var userParam = {};
   userParam.title = "Balance des comptes";
   userParam.currency = "USD";
   userParam.exchangerate = "";
   userParam.amount_columns_width = "15%";
   userParam.margins = "10mm 10mm 10mm 10mm";
   var form = getAccounts(currentDocument,userParam.currency);
   var report = createAccountsBalancesReport(currentDocument, currentStartDate, currentEndDate, form, userParam);
   Test.logger.addReport("TEST 2 - Report Accounts Balances", report);

   //TEST 3
   var userParam = {};
   userParam.title = "Balance des comptes";
   userParam.currency = "USD";
   userParam.exchangerate = "1.00";
   userParam.amount_columns_width = "15%";
   userParam.margins = "10mm 10mm 10mm 10mm";
   var form = getAccounts(currentDocument,userParam.currency);
   var report = createAccountsBalancesReport(currentDocument, currentStartDate, currentEndDate, form, userParam);
   Test.logger.addReport("TEST 3 - Report Accounts Balances", report);
}
