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
// @id = ch.banana.africa.tvareportrdc.test
// @api = 1.0
// @pubdate = 2019-10-14
// @publisher = Banana.ch SA
// @description = VAT Declaration (OHADA - RDC) [BETA]
// @description.fr = Taxe sur la valeur ajoutée TVA (OHADA - RDC) [BETA]
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.africa.tvareportrdc.js

// Register this test case to be executed
Test.registerTestCase(new TestVatReportRDC());

// Define the test class, the name of the class is not important
function TestVatReportRDC() {
}

// This method will be called at the beginning of the test case
TestVatReportRDC.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
TestVatReportRDC.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestVatReportRDC.prototype.init = function() {

}

// This method will be called after every test method is executed
TestVatReportRDC.prototype.cleanup = function() {

}

// Generate the expected (correct) file
TestVatReportRDC.prototype.testBananaApp = function() {
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
TestVatReportRDC.prototype.report_test = function(banDoc, startDate, endDate, reportName) {
    var vatReport = createVATDeclaration(banDoc, startDate, endDate);
    Test.logger.addReport(reportName, vatReport);
}

// Function that creates the table for the test
TestVatReportRDC.prototype.table_test = function(banDoc, tableName) {
    if (banDoc) {
        var table = banDoc.table("VatCodes");
        Test.logger.addTable(tableName, table, ["Group","VatCode","Description","Gr","Gr1","IsDue","AmountType","VatRate","VatRateOnGross","VatAccount"]);
    }
}