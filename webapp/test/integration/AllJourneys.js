/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"DeviationApproval/ZDeviationApproval/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"DeviationApproval/ZDeviationApproval/test/integration/pages/SApp",
	"DeviationApproval/ZDeviationApproval/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "DeviationApproval.ZDeviationApproval.view.",
		autoWait: true
	});
});