sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast',
	'sap/m/UploadCollectionParameter',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/ui/core/Fragment',
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, MessageToast, UploadCollectionParameter, Dialog, Button, Fragment, History) {
	"use strict";

	return Controller.extend("DeviationApproval.ZDeviationApproval.controller.DeviationApprovalDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf DeviationApproval.ZDeviationApproval.view.DeviationApprovalDetail
		 */
		onInit: function (oEvent) {
			this._UserID = sap.ushell.Container.getService("UserInfo").getId();
		//	this._UserID = "PURCHASESIG1";
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("DeviationApprovalDetail").attachPatternMatched(this._onEditMatched, this);

			var oUploadCollection = this.getView().byId('UploadCollection');
			oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/POAttachmentsSet");

			/*	var filters = [];

				var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
				filters.push(oUserID);

				var Pocount;
				var oApproveButton = this.getView().byId("btnApprove");

				oModel.read("/MyPOListSet", {
					filters: filters,
					success: function (odata, oResponse) {
						Pocount = odata.results.length;

						if (Pocount > 0) {
							oApproveButton.setEnabled(true);
						}else {
								oApproveButton.setVisible(false);
						}

					},
					error: function () {
						//	MessageBox.error("error");
					},

				});*/

			/*	var ImageDMS = this.getView().byId('imgDMS');
				ImageDMS.setSrc(window.location.protocol + window.location.hostname + ":" + window.location.port +
					"/sap/bc/ui5_ui5/sap/zpoapproval/Images/dms.JPG");*/
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		RefreshMasterList: function () {

			var oModel = this.getView().getModel();
			var oSidPOList = this.getView().byId("idViewForPOList");
			var sid = oSidPOList.getText();

			var oList = sid + "--listPO";
			var oList1 = sap.ui.getCore().byId(oList);
		//	var oList1 = sap.ui.getCore().byId("__xmlview1--listPO");
		//	var oList2 = sap.ui.getCore().byId("__xmlview0--listPO");
		//	var oList3 = sap.ui.getCore().byId("__xmlview3--listPO");


			var filters = [];

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			filters.push(oUserID);
			var oModelData = new sap.ui.model.json.JSONModel();
			var POCoverNote = this.getView().byId("idFrame");
			var POQueryHistory = this.getView().byId("tblQueryHistory");
			var POQueryComments = this.getView().byId("tblComments");

			var oApproveButton = this.getView().byId("btnApprove");

			var PurchaseNo = this.getView().byId("PurOrdNo");
			var PODescription = this.getView().byId("PurOrdDesc");
			var POOrderInti = this.getView().byId("PurOrdInt");

			var vendor = this.getView().byId("PurOrdVendor");
			var Plant = this.getView().byId("idPlant");
			var DocType = this.getView().byId("PurDocType");

			var orderdate = this.getView().byId("PurOrdDt");
			var PoStatus = this.getView().byId("PurOrdSts");

			var Attachments = this.getView().byId("UploadCollection");
			var attachmentTitle = this.getView().byId("attachmentTitle");

			var that = this;

			var Pocount;
			var txtPONOOB = this.getView().byId("objcmp");
			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {
					Pocount = odata.results.length;
					if (oList1 !== undefined) {
						if (Pocount > 0) {
							oModelData.setData(odata);
							oList1.setModel(oModelData);
							that.handleIconTabBarSelect();

						} else {
							oModelData.setData(odata);
							oList1.setModel(oModelData);
							txtPONOOB.setTitle("");

							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							Plant.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							oApproveButton.setEnabled(false);
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");

							Attachments.setModel(null);

						}
					}/* else if (oList2 !== undefined) {
						if (Pocount > 0) {

							oModelData.setData(odata);
							oList2.setModel(oModelData);

							that.handleIconTabBarSelect();

						} else {
							oModelData.setData(odata);
							oList2.setModel(oModelData);
							txtPONOOB.setTitle("");

							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							Plant.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							oApproveButton.setEnabled(false);
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");

							Attachments.setModel(null);

						}
					}
					else if (oList3 !== undefined) {
						if (Pocount > 0) {

							oModelData.setData(odata);
							oList3.setModel(oModelData);

							that.handleIconTabBarSelect();

						} else {
							oModelData.setData(odata);
							oList3.setModel(oModelData);
							txtPONOOB.setTitle("");

							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							Plant.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							oApproveButton.setEnabled(false);
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");

							Attachments.setModel(null);

						}
					}*/

				},
				error: function () {
					//	MessageBox.error("error");
				},

			});

		},

		handleNavButtonPress: function (oEvent) {
			this.getRouter().navTo("FirstPage", {}, true);
		},

		_onEditMatched: function (oEvent) {

			var that = this;
			var oParameters = oEvent.getParameters();
			var oModel = this.getView().getModel();

			var txtPONOOB = this.getView().byId("objcmp");
			var txtPO_Status = this.getView().byId("objPrice");

			var oApproveButton = this.getView().byId("btnApprove");
			var oSidPOList = this.getView().byId("idViewForPOList");

			if (oParameters.arguments.PO_No !== "" || oParameters.arguments.PO_No !== null) {

				this.PO_No = oParameters.arguments.PO_No;
				this.SID = oParameters.arguments.Sid;


				txtPONOOB.setTitle(this.PO_No);
				oSidPOList.setText(this.SID);
				oApproveButton.setVisible(true);

				that.handleIconTabBarSelect();

			}

		},

		onUploadComplete: function (oEvent) {

			var that = this;
			that.OnPressAttachments();
		},

		// Before Upload Attachments
		onBeforeUploadStarts: function (oEvent) {

			var Attachments = this.getView().byId("UploadCollection");

			var PO = this.getView().byId("objcmp").getTitle();
			// Header Slug

			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			var oCustomerHeaderPONo = new sap.m.UploadCollectionParameter({
				name: "PO_NO",
				value: PO
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderPONo);

			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;

			var sToken = oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
			Attachments.setBusy(true);

		},
		onFilenameLengthExceed: function (oEvent) {
			var smsg = "Filename Length should be less than 35 characters";
			MessageBox.confirm(smsg, {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function (sAction) {
					if (sAction === "OK") {}
				}
			});
		},

		onFileDeleted: function (oEvent) {

			var documnentId = oEvent.getParameter("documentId");
			this.deleteItemById(documnentId);
		},

		deleteItemById: function (sItemToDeleteId) {

			var that = this;
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);

			var oPONo = this.getView().byId("objcmp").getTitle();

			oModel.setHeaders({
				"X-Requested-With": "X",
				"DocumentID": sItemToDeleteId
			});

			oModel.remove("/POAttachmentsSet('" + oPONo + "')", {

				method: "DELETE",
				success: function (odata, oResponse) {
					MessageBox.success("Attachment Deleted Successfully", {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						onClose: function (oAction) {
							that.OnPressAttachments();
						}
					});

				},

				error: function (err) {
					MessageBox.error("error");
				}
			});

			//	this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},
		getAttachmentTitleText: function () {

			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		SelectDialogPressApprove: function (oEvent) {

			if (!this._PressoDialog) {
				this._PressoDialog = sap.ui.xmlfragment("DeviationApproval.ZDeviationApproval.fragments.Approve", this);
				this._PressoDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PressoDialog);
			this._PressoDialog.open();
			var PoApprovalComments = sap.ui.getCore().byId("idComments");
			PoApprovalComments.setValue(null);
			//To get the Value In Title Of Dialog

			var oPONo = this.getView().byId("objcmp").getTitle();
			var TitleApprove = "Purchase Order No: " + oPONo + " - Approve";
			this._PressoDialog.setTitle(TitleApprove);
		},

		OnCancelApprove: function (oEvent) {
			this._PressoDialog.close();
			if (this._PressoDialog) {
				this._PressoDialog.destroy();
				this._PressoDialog = null; // make it falsy so that it can be created next time
			}
		},

		GetClock24hrs: function () {

			var result = "";
			var d = new Date();
			
			var nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds();
			if (nhour === 0) {
				nhour = 24;
			}   else if (nhour >= 24) {
				nhour = nhour - 24;
			}

			if (nhour <= 9) {
				nhour = "0" + nhour;
			}
			if (nmin <= 9) {
				nmin = "0" + nmin;
			}
			if (nsec <= 9) {
				nsec = "0" + nsec;
			}
			result = nhour + ":" + nmin + ":" + nsec;
			return result;
		},

		_GetCuurentDate: function (CurrDate) {
			var currentDate = new Date();
			var day = currentDate.getDate();
			var month = currentDate.getMonth() + 1;
			var year = currentDate.getFullYear();
			if (day < 10) {
				day = "0" + parseInt(currentDate.getDate());
			}
			if (month < 10) {
				month = "0" + parseInt(currentDate.getMonth() + 1);
			}
			CurrDate = day + "-" + month + "-" + year;
			//	CurrDate = day + "-" + month + "-" + year;
			return CurrDate;
		},

		OnSubmitApproval: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();
			var po = this.getView().byId("objcmp").getTitle();
			var PoApprovalDate = that._GetCuurentDate();
			var PoApprovalTime = that.GetClock24hrs();
			var PoStatus = "DEV";
			var PoApprovalComments = sap.ui.getCore().byId("idComments");

			if (PoApprovalComments.getValue() === "") {
				MessageToast.show("Please Fill Comments");
				return false;
			} else {
				var oItems = {};
				var that = this;
				oItems.PO = po;
				oItems.UserName = this._UserID;
				oItems.POApprovalDate = PoApprovalDate;
				oItems.POApprovalTime = PoApprovalTime;
				oItems.POStatus = PoStatus;
				oItems.POApprovalComments = PoApprovalComments.getValue();

				oModel.setHeaders({
					"X-Requested-With": "X"
				});

				oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {
						var smsg = "PO " + po + " has been Successfully Approved";
						that.OnCancelApprove();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {
									that.RefreshMasterList();
								}
							}
						});

					},
					error: function (oError) {
						//	MessageBox.error("Error : " + oError);
					}

				});
			}

		},

		handleIconTabBarSelect: function () {

			var that = this;
			var iconTab = this.getView().byId("idIconTabBarNoIcons");
			if (iconTab.getSelectedKey() === "CoverNote") {
				that.OnPressCoverNote();
			} else if (iconTab.getSelectedKey() === "Attachments") {
				that.OnPressAttachments();

			} else if (iconTab.getSelectedKey() === "QueryHistory") {
				that.OnPressQueryHistory();
			} else if (iconTab.getSelectedKey() === "Comments") {
				that.OnPressPOComment();
			} else if (iconTab.getSelectedKey() === "General") {
				that.OnPressGeneralTab();
			}

		},

		OnPressCoverNote: function () {
			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oHtml = this.getView().byId("idFrame");
			var sRead = "/SelectedPOContentSet('" + PONo + "')/$value";

			oModel.read(sRead, {
				success: function (oData, oResponse) {
					if (oResponse.body !== "") {
						var pdfURL = oResponse.requestUri;
						oHtml.setContent("<iframe src=" + pdfURL + " width='100%' height='600px'></iframe>");
						oHtml.setVisible(true);
					} else {
						oHtml.setVisible(false);
					}
				},
				error: function () {
					//	MessageBox.error("Cover Note Read Failed");
				}
			});
		},
		OnPressAttachments: function () {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var that = this;
			var Attachments = this.getView().byId("UploadCollection");
			var OUserId = this._UserID;
			var oText, oDocumentDate, day, month, year, Hours, Minutes, Seconds, final;
			var attachmentTitle = this.getView().byId("attachmentTitle");
			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
			filters.push(oPOH);
			Attachments.setBusy(true);

			if (PONo !== "") {
				oModel.read("/POAttachmentsSet", {
					filters: filters,
					success: function (odata, oResponse) {
						var oModelData = new sap.ui.model.json.JSONModel();
						oModelData.setData(odata);
						Attachments.setModel(oModelData);
						Attachments.setBusy(false);

						if (Attachments.getItems().length > 0) {
							for (var i = 0; i < Attachments.getItems().length; i++) {
								if (Attachments.getItems()[i].getAttributes()[0].getTitle() === OUserId) {
									Attachments.getItems()[i].setEnableDelete(true);
								} else {
									Attachments.getItems()[i].setEnableDelete(false);
								}
								// Attachments.getItems()[i].getStatuses()[0].getText();
								oText = Attachments.getItems()[i].getStatuses()[0].getText().substring(0, 13);
								year = Attachments.getItems()[i].getStatuses()[0].getText().substring(13, 17);
								month = Attachments.getItems()[i].getStatuses()[0].getText().substring(17, 19);
								day = Attachments.getItems()[i].getStatuses()[0].getText().substring(19, 21);

								Hours = Attachments.getItems()[i].getStatuses()[0].getText().substring(21, 24);
								Minutes = Attachments.getItems()[i].getStatuses()[0].getText().substring(24, 26);
								Seconds = Attachments.getItems()[i].getStatuses()[0].getText().substring(26, 28);

								final = oText + day + "-" + month + "-" + year + " " + Hours + ":" + Minutes + ":" + Seconds;
								Attachments.getItems()[i].getStatuses()[0].setText(final);
							}
						}
						attachmentTitle.setText(that.getAttachmentTitleText());

					},
					error: function () {
						//	MessageBox.error("error");
					}
				});
			} else {
				Attachments.setModel(null);
				Attachments.setBusy(false);
				Attachments.setUploadEnabled(false);

				attachmentTitle.setText("Uploaded(" + 0 + ") ");

			}

		},
		OnPressQueryHistory: function () {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oTableHistory = this.getView().byId("tblQueryHistory");

			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
			filters.push(oPOH);

			oModel.read("/POQueryHistorySet", {
				filters: filters,
				success: function (odata, oResponse) {

					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oTableHistory.setModel(oModelData);

				},
				error: function () {
					//	MessageBox.error("error");
				}
			});

		},
		OnPressPOComment: function () {
			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oTable = this.getView().byId("tblComments");

			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO", "EQ", PONo);
			filters.push(oPOH);
			oModel.read("/POCommentsSet", {
				filters: filters,
				success: function (odata, oResponse) {

					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oTable.setModel(oModelData);

				},
				error: function () {
					//	MessageBox.error("error");
				}
			});

		},
		OnPressGeneralTab: function () {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();

			var txtPO_No = this.getView().byId("PurOrdNo");
			var txtPODesc = this.getView().byId("PurOrdDesc");
			var txtPurOrdInt = this.getView().byId("PurOrdInt");
			var txtVendor = this.getView().byId("PurOrdVendor");
			var txtPlant = this.getView().byId("idPlant");

			var txtDocument_Type = this.getView().byId("PurDocType");
			var txtDocumentDate = this.getView().byId("PurOrdDt");
			var txtPurOrdSts = this.getView().byId("PurOrdSts");

			var DocumentDate, day, month, year, final;

			oModel.read("/PurchaseOrderGeneralSet(PO_NO='" + PONo + "')", {
				success: function (odata, oResponse) {

					txtPO_No.setText(oResponse.data.PO_NO);
					txtPODesc.setText(oResponse.data.PO_Description);
					txtPurOrdInt.setText(oResponse.data.PO_Initiator);
					txtVendor.setText(oResponse.data.Vendor);
					txtPlant.setText(oResponse.data.Plant);
					txtDocument_Type.setText(oResponse.data.Document_Type);
					txtPurOrdSts.setText(oResponse.data.PO_Status);
					if (oResponse.data.Document_Date !== null) {
						DocumentDate = oResponse.data.Document_Date;
						year = DocumentDate.substring(0, 4);
						month = DocumentDate.substring(4, 6);
						day = DocumentDate.substring(6, 8);

						final = day + "-" + month + "-" + year;
						txtDocumentDate.setText(final);

					} else {
						txtDocumentDate.setText("");
					}

				},

				error: function (e) {
					//	MessageBox.error("error");
				}

			});
		},

	});

});