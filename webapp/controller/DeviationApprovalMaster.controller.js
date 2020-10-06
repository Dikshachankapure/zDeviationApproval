sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'DeviationApproval/ZDeviationApproval/utils/Formatter',
	'sap/ui/model/Filter',
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/routing/History"
], function (Controller, Formatter, Filter, MessageToast, MessageBox, JSONModel, History) {
	"use strict";

	return Controller.extend("DeviationApproval.ZDeviationApproval.controller.DeviationApprovalMaster", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf DeviationApproval.ZDeviationApproval.view.DeviationApprovalMaster
		 */
		onInit: function () {

			if (!this._oDialogDeviationApproval) {
				this._oDialogDeviationApproval = sap.ui.xmlfragment("DeviationApproval.ZDeviationApproval.fragments.DeviationApproval", this);
				this._oDialogDeviationApproval.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialogDeviationApproval.open();
			var that = this;

			this._UserID = sap.ushell.Container.getService("UserInfo").getId();
		//		this._UserID = "PURCHASESIG1";

			this._Flag = "false";

		},
		OnGo: function (oEvent) {

			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);

			var PONo = sap.ui.getCore().byId("idDevAppPO");
			var that = this;
			if (PONo.getValue() === "") {
				MessageToast.show(" Please Enter Purchase Order No ");
				return false;
			} else {
				oModel.read("/POSig1CheckSet(PO_NO='" + PONo.getValue() + "',UserID='" + this._UserID + "')", {
					success: function (odata, oResponse) {

						if (odata.ValidSig1 === true) {
							that.OnPODeviationApproval();
						} else if (odata.Sig2Appr === true && odata.ValidSig1 === false) {
							var smsgA =
								"Deviation approval for this purchase order is not possible.Signatory2 has already approved this purchase order. ";
							MessageBox.confirm(smsgA, {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Confirm",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (sAction) {
									if (sAction === "OK") {}
								}
							});
						} else if (odata.ValidSig1 === false) {
							var smsg = "You are not the right signatory1 for this purchase order. ";
							MessageBox.confirm(smsg, {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Confirm",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (sAction) {
									if (sAction === "OK") {}
								}
							});
						}

					},
					error: function (oError) {
						//	MessageBox.error("Error : " + oError);
					}

				});

			}

		},
		OnCancelDeviationApv: function (oEvent) {
		//	var oList = this.getView().byId("listPO");
		//	oList.setModel(null);
			this._oDialogDeviationApproval.close();
			if (this._oDialogDeviationApproval) {
				this._oDialogDeviationApproval.destroy();
				this._oDialogDeviationApproval = null;
			}
		},
		OnPODeviationApproval: function () {

			var oModel = this.getView().getModel();
			var oList = this.getView().byId("listPO");
			var PONo = sap.ui.getCore().byId("idDevAppPO").getValue();
			var filters = [];

			var values = {
				results: []

			};

			oModel.read("/PODeviationDetailsSet('" + PONo + "')", {
				success: function (odata, oResponse) {
					var oModelData = new sap.ui.model.json.JSONModel();

					values.results.push(odata);
					oModelData.setData(values);
					oList.setModel(oModelData);
				},
				error: function () {
					//	MessageBox.error("error");
				}

			});
			this._oDialogDeviationApproval.close();
			if (this._oDialogDeviationApproval) {
				this._oDialogDeviationApproval.destroy();
				this._oDialogDeviationApproval = null; // make it falsy so that it can be created next time
			}

		},

		attachUpdateFinished: function (oEvent) {

			var oList = this.getView().byId("listPO");
			var aItems = oEvent.getSource().getItems();
			var TempPONo = this.getView().byId("txtTemPO");

			var TempPONoSelectionChange = this.getView().byId("txtTemPOSelctionChange");

			if (this._Flag === "false") {
				if (aItems.length > 0) {
					oEvent.getSource().getItems()[0].setSelected(true);
					oEvent.getSource().getItems()[0].firePress();
					//	var poTemp = oEvent.getSource().getSelectedItem().getTitle();
					//	TempPONo.setText(poTemp);
					this._Flag = "true";
				}

			} else if (this._Flag === "true") {
				if (aItems.length > 0) {

					for (var i = 0; i < aItems.length; i++) {
						if (oEvent.getSource().getItems()[i].getTitle() === TempPONoSelectionChange.getText()) {
							aItems[i].setSelected(true);
							aItems[i].firePress();
							//	this._Flag = "false";
							break;

						} else {
							oEvent.getSource().getItems()[0].setSelected(true);
							oEvent.getSource().getItems()[0].firePress();

						}
					}
				}
			}

		},

		onSelectionChange: function (e) {

			var oList = this.getView().byId("listPO");
			var aItems = oList.getItems();
			var PoNo = e.getParameters().listItem.getTitle();
			var Sid = this.getView().sId;

			var TempPONoSelectionChange = this.getView().byId("txtTemPOSelctionChange");
			TempPONoSelectionChange.setText(PoNo);

			this.getRouter().navTo("DeviationApprovalDetail", {
				PO_No: PoNo,
				Sid : Sid
			});

			if (this._prevSelect) {
				this._prevSelect.$().css('background-color', '');

			}
			var item = e.getParameter('listItem');
			item.$().css('background-color', '#D3D3D3');

			this._prevSelect = item;

		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onListItemPress: function (oEvent) {

			var objEdit = oEvent.getSource().getBindingContext().getObject();
			var Sid = this.getView().sId;

			this.getRouter().navTo("DeviationApprovalDetail", {
				PO_No: objEdit.PO_NO,
				Sid : Sid
			});

		},
		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			var oFilter = new sap.ui.model.Filter({
				// two filters
				filters: [
					new sap.ui.model.Filter("PO_No", sap.ui.model.FilterOperator.Contains, sQuery), // filter for value 1
				]
			});
			var oBinding = this.byId("listPO").getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		handleOpenDialog: function (oEvent) {
			if (!this._oDialogDeviationApproval) {
				this._oDialogDeviationApproval = sap.ui.xmlfragment("DeviationApproval.ZDeviationApproval.fragments.DeviationApproval", this);
				this._oDialogDeviationApproval.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialogDeviationApproval.open();
		},
		handleConfirm: function (oEvent) {
			var query = oEvent.getSource().getSelectedFilterItems();
			var oBinding = this.byId("listPO").getBinding("items");
			if (query.length > 0) {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("PO_Status", sap.ui.model.FilterOperator.EQ, query[0].getText()), // filter for value 1
					]
				});
				oBinding.filter(oFilter);
			} else {
				oBinding.filter([]);
			}
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf DeviationApproval.ZDeviationApproval.view.DeviationApprovalMaster
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf DeviationApproval.ZDeviationApproval.view.DeviationApprovalMaster
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf DeviationApproval.ZDeviationApproval.view.DeviationApprovalMaster
		 */
		//	onExit: function() {
		//
		//	}

	});

});