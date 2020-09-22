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
// @id = ch.banana.africa.tvardc
// @api = 1.0
// @pubdate = 2020-07-01
// @publisher = Banana.ch SA
// @description = VAT Report, VAT Deduction Details Report
// @description.fr = Déclaration de la TVA, Etat détaillé des déductions de la TVA
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ch.banana.africa.tvareportrdc.js
// @includejs = ch.banana.africa.deductiontvardc.js



function exec() {

    var dateForm = getPeriodSettings("Select Date");
     if (!dateForm) {
        return;
     }
  
      /* CURRENT year file: the current opened document in Banana */
      var current = Banana.document;
      if (!current) {
          return "@Cancel";
      }
  
      var report = Banana.Report.newReport("Déclaration TVA, Etat Détaillé des Déductions de TVA - RDC [BETA]");
      
      /* 1. VAT report */
      createVATDeclaration(current, dateForm.selectionStartDate, dateForm.selectionEndDate, report);
      report.addPageBreak();
      
      /* 2. VAT Deductions Details Report */
      createVATDeductionDetailsReport(current, dateForm.selectionStartDate, dateForm.selectionEndDate, report);
  
      var stylesheet = createStyleSheet();
      Banana.Report.preview(report, stylesheet);
  
  }

  function createStyleSheet() {
    var stylesheet = Banana.Report.newStyleSheet();
 
    stylesheet.addStyle("@page", "margin:1mm 5mm 1mm 5mm;border:2px black solid");
   stylesheet.addStyle("body", "font-family:Helvetica; font-size:8pt");
   stylesheet.addStyle(".bold", "font-weight:bold;");
   stylesheet.addStyle(".right", "text-align:right;");
   stylesheet.addStyle(".center", "text-align:center");
   stylesheet.addStyle(".italic", "font-style:italic");

   style = stylesheet.addStyle(".blackCell");
   style.setAttribute("background-color", "black");
   style.setAttribute("color","white");

   style = stylesheet.addStyle(".greyCell");
   style.setAttribute("background-color", "#A0A0A0");

   style = stylesheet.addStyle(".darkGreyCell");
   style.setAttribute("background-color", "#505050");

   style = stylesheet.addStyle(".lightGreyCell");
   style.setAttribute("background-color", "#DFDFDF");

   style = stylesheet.addStyle(".logostyle");
   style.setAttribute("padding-top", "0em");
   style.setAttribute("padding-left", "3em");

   /* table */
   var tableStyle = stylesheet.addStyle(".table");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".c1", "");
   stylesheet.addStyle(".c2", "");
   stylesheet.addStyle(".c3", "");
   stylesheet.addStyle(".c4", "");  
   stylesheet.addStyle("table.table td", "");

   // Inside header table
   var tableStyle = stylesheet.addStyle(".inTable");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle("table.table.inTable td", "border:thin solid black");

   // VAT declaration table
   var tableStyle = stylesheet.addStyle(".vatTable");
   tableStyle.setAttribute("width", "100%");
   tableStyle.setAttribute("font-size", "6.5");
   stylesheet.addStyle(".colTable1", "");
   stylesheet.addStyle(".colTable2", "");
   stylesheet.addStyle(".colTable3", "");
   stylesheet.addStyle(".colTable4", "");
   stylesheet.addStyle(".colTable5", "");
   stylesheet.addStyle(".colTable6", "");
   stylesheet.addStyle(".colTable7", "");
   stylesheet.addStyle(".colTable8", "");
   stylesheet.addStyle(".colTable9", "");
   stylesheet.addStyle(".colTable10", "");
   stylesheet.addStyle(".colTable11", "");
   stylesheet.addStyle(".colTable12", "");
   stylesheet.addStyle(".colTable13", "");
   stylesheet.addStyle(".colTable14", "");
   stylesheet.addStyle(".colTable15", "");
   stylesheet.addStyle(".colTable16", "");
   stylesheet.addStyle(".colTable17", "");
   stylesheet.addStyle(".colTable18", "");
   stylesheet.addStyle(".colTable19", "");
   stylesheet.addStyle(".colTable20", "");
   stylesheet.addStyle("table.vatTable td", "border:thin solid black;padding-top:2px;padding-bottom:2px");

   // VAT declaration table
   var tableStyle = stylesheet.addStyle(".tableNoBorder");
   tableStyle.setAttribute("width", "100%");
   tableStyle.setAttribute("font-size", "9");
   stylesheet.addStyle(".colTable1", "");
   stylesheet.addStyle(".colTable2", "");
   stylesheet.addStyle(".colTable3", "");
   stylesheet.addStyle(".colTable4", "");
   stylesheet.addStyle(".colTable5", "");
   stylesheet.addStyle(".colTable6", "");
   stylesheet.addStyle(".colTable7", "");
   stylesheet.addStyle(".colTable8", "");
   stylesheet.addStyle(".colTable9", "");
   stylesheet.addStyle(".colTable10", "");
   stylesheet.addStyle(".colTable11", "");
   stylesheet.addStyle(".colTable12", "");
   stylesheet.addStyle(".colTable13", "");
   stylesheet.addStyle(".colTable14", "");
   stylesheet.addStyle(".colTable15", "");
   stylesheet.addStyle(".colTable16", "");
   stylesheet.addStyle(".colTable17", "");
   stylesheet.addStyle(".colTable18", "");
   stylesheet.addStyle(".colTable19", "");
   stylesheet.addStyle(".colTable20", "");
   stylesheet.addStyle("table.tableNoBorder td", "");

   var tableStyle = stylesheet.addStyle(".deductTable");
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("font-size", "9pt");
    stylesheet.addStyle(".colTable1", "");
    stylesheet.addStyle(".colTable2", "");
    stylesheet.addStyle(".colTable3", "");
    stylesheet.addStyle(".colTable4", "");
    stylesheet.addStyle(".colTable5", "");
    stylesheet.addStyle(".colTable6", "");
    stylesheet.addStyle(".colTable7", "");
    stylesheet.addStyle(".colTable8", "");
    stylesheet.addStyle(".colTable9", "");
    stylesheet.addStyle(".colTable10", "");
    stylesheet.addStyle(".colTable11", "");
    stylesheet.addStyle(".colTable12", "");
    stylesheet.addStyle(".colTable13", "");
    stylesheet.addStyle(".colTable14", "");
    stylesheet.addStyle(".colTable15", "");
    stylesheet.addStyle(".colTable16", "");
    stylesheet.addStyle(".colTable17", "");
    stylesheet.addStyle(".colTable18", "");
    stylesheet.addStyle(".colTable19", "");
    stylesheet.addStyle(".colTable20", "");
    stylesheet.addStyle("table.deductTable td", "border:thin solid black");

   var tableStyle = stylesheet.addStyle(".tableDetails");
   tableStyle.setAttribute("width", "100%");
   stylesheet.addStyle(".col1", "width:20%");
   stylesheet.addStyle(".col2", "width:20%");
   stylesheet.addStyle(".col3", "width:20%");
   stylesheet.addStyle(".col4", "width:20%");
   stylesheet.addStyle(".col5", "width:20%");
   stylesheet.addStyle("table.tableDetails td", "");
 
    return stylesheet;
 }

  /***************************************************************************************************************** 
*
* The main purpose of this function is to allow the user to enter the accounting period desired and saving it 
* for the next time the script is run.
* Every time the user runs of the script he has the possibility to change the date of the accounting period 
*
******************************************************************************************************************/
function getPeriodSettings(param) {

	//The formeters of the period that we need
	var scriptform = {
		"selectionStartDate": "",
		"selectionEndDate": "",
		"selectionChecked": "false"
	};

	//Read script settings
	var data = Banana.document.getScriptSettings();

	//Check if there are previously saved settings and read them
	if (data.length > 0) {
		try {
			var readSettings = JSON.parse(data);

			//We check if "readSettings" is not null, then we fill the formeters with the values just read
			if (readSettings) {
				scriptform = readSettings;
			}
		} catch (e) {}
	}

	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = Banana.document.startPeriod();
	var docEndDate = Banana.document.endPeriod();

	//A dialog window is opened asking the user to insert the desired period. By default is the accounting period
	var selectedDates = Banana.Ui.getPeriod(param.reportName, docStartDate, docEndDate,
			scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);

	//We take the values entered by the user and save them as "new default" values.
	//This because the next time the script will be executed, the dialog window will contains the new values.
	if (selectedDates) {
		scriptform["selectionStartDate"] = selectedDates.startDate;
		scriptform["selectionEndDate"] = selectedDates.endDate;
		scriptform["selectionChecked"] = selectedDates.hasSelection;

		//Save script settings
		var formToString = JSON.stringify(scriptform);
		var value = Banana.document.setScriptSettings(formToString);
	} else {
		//User clicked cancel
		return;
	}
	return scriptform;
}