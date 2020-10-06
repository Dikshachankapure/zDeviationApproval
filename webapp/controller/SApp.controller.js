sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("DeviationApproval.ZDeviationApproval.controller.SApp", {
		onInit: function () {
		/*	if (!this._oDialogDeviationApproval) {
				this._oDialogDeviationApproval = sap.ui.xmlfragment("DeviationApproval.ZDeviationApproval.fragments.DeviationApproval", this);
				this._oDialogDeviationApproval.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialogDeviationApproval.open();*/
		},

		/*	OnGo: function (oEvent) {
			this._oDialogDeviationApproval.close();
			if (this._oDialogDeviationApproval) {
				this._oDialogDeviationApproval.destroy();
				this._oDialogDeviationApproval = null; // make it falsy so that it can be created next time
			}
		},*/
	});
});