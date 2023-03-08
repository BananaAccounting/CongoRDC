// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
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


// @id = ch.banana.africa.profitlossfromtable.test
// @api = 1.0
// @pubdate = 2021-3-6
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.africa.profitlossfromtable.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.africa.profitlossfromtable.js
// @timeout = -1



// Register test case to be executed
Test.registerTestCase(new ReportProfitLossFromTableTest());

// Here we define the class, the name of the class is not important
function ReportProfitLossFromTableTest() {

}

// This method will be called at the beginning of the test case
ReportProfitLossFromTableTest.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
ReportProfitLossFromTableTest.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
ReportProfitLossFromTableTest.prototype.init = function() {

}

// This method will be called after every test method is executed
ReportProfitLossFromTableTest.prototype.cleanup = function() {

}

ReportProfitLossFromTableTest.prototype.testBananaExtension = function() {

	/**
	 * Test 1 with all groups balances
	*/

	var banDoc = Banana.application.openDocument("file:script/../test/testcases/template_simplified_ohada_cdf.ac2");
	Test.assert(banDoc);

	var userParam = {};
  	userParam.selectionStartDate = "2020-01-01";
  	userParam.selectionEndDate = "2020-12-31";
  	userParam.title = "COMPTE DE RÉSULTAT 2020";
	userParam.logo = false;
	userParam.logoname = 'Logo';
	userParam.printheader = false;
	userParam.printtitle = true;
	userParam.title = '';
	userParam.column = 'Gr1';
	userParam.compattastampa = false;

    let fileName = "file:script/../test/testcases/groupement_ohada.ac2";
	var reportStructure = createReportStructureProfitLossFromTable(fileName);

	const bReport = new BReport(banDoc, userParam, reportStructure);
	bReport.validateGroups(userParam.column);
	bReport.loadBalances();
	bReport.calculateTotals(["currentAmount", "previousAmount"]);
	bReport.formatValues(["currentAmount", "previousAmount"]);
	bReport.excludeEntries();

	var report = printprofitlossstatement(banDoc, userParam, bReport, "");
	Test.logger.addReport("Test 1: compte de résultat", report);

}