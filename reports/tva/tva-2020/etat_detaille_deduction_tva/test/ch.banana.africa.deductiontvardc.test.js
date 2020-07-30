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
// @id = ch.banana.africa.deductiontvardc.test
// @api = 1.0
// @pubdate = 2020-07-21
// @publisher = Banana.ch SA
// @description = VAT Deduction Details (OHADA - RDC) [BETA]
// @description.fr = Etat Détaillé des Déductions de TVA (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.deductiontvardc.js

// Register this test case to be executed
Test.registerTestCase(new TestVATDeductionReportRDC());

// Define the test class, the name of the class is not important
function TestVATDeductionReportRDC() {
}

// This method will be called at the beginning of the test case
TestVATDeductionReportRDC.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
TestVATDeductionReportRDC.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestVATDeductionReportRDC.prototype.init = function() {

}

// This method will be called after every test method is executed
TestVATDeductionReportRDC.prototype.cleanup = function() {

}

// Generate the expected (correct) file
TestVATDeductionReportRDC.prototype.testBananaApp = function() {
    // Open the banana document
    var banDoc = Banana.application.openDocument("file:script/../test/testcases/ohada_tva_cdf_2020.ac2");
    if (!banDoc) {return;}
    Test.assert(banDoc);

    this.report_test(banDoc, "2020-01-01", "2020-12-31", "Whole year report");
    this.report_test(banDoc, "2020-01-01", "2020-06-30", "First semester report");
    this.report_test(banDoc, "2020-07-01", "2020-12-31", "Second semester report");
    this.report_test(banDoc, "2020-01-01", "2020-03-31", "First quarter report");
    this.report_test(banDoc, "2020-04-01", "2020-06-30", "Second quarter report");
    this.report_test(banDoc, "2020-07-01", "2020-09-30", "Third quarter report");
    this.report_test(banDoc, "2020-10-01", "2020-12-31", "Fourth quarter report");
    this.table_test(banDoc, "Vat codes table");
}

// Function that creates the report for the test
TestVATDeductionReportRDC.prototype.report_test = function(banDoc, startDate, endDate, reportName) {
    var vatDeductionReport = createVATDeductionDetailsReport(banDoc, startDate, endDate);
    Test.logger.addReport(reportName, vatDeductionReport);
}

// Function that creates the table for the test
TestVATDeductionReportRDC.prototype.table_test = function(banDoc, tableName) {
    if (banDoc) {
        var table = banDoc.table("VatCodes");
        Test.logger.addTable(tableName, table, ["Group","VatCode","Description","Gr","Gr1","IsDue","AmountType","VatRate","VatRateOnGross","VatAccount"]);
    }
}