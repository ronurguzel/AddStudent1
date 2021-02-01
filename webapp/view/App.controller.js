sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/BindingMode",
	"sap/ui/core/message/Message",
	"sap/ui/core/library",
	"sap/ui/core/Fragment"
], function(Controller, JSONModel, BindingMode, Message, library, Fragment, MessageToast) {
	"use strict";

    return Controller.extend("sap.ui.demo.walkthrough.view.App", {
		onInit:function(){
			var oMessageManager, oModel1, oView1;
			//MESSAGE MANAGER MESSAGE
			oView1 = this.getView();
			oMessageManager = sap.ui.getCore().getMessageManager();
			oView1.setModel(oMessageManager.getMessageModel(), "message");
			//STUDENTS INFORMATIONS
			this.giStudentId=0;
			this.student={
				id:this.giStudentId,
				firstName:"",
				lastName:"",
				gender:0,
				genderText:"Female",
				dateOfBirth:"",
				fatherName:"",
				contactNumber:"",
				alternativeContactNumber:""
			};
			this.data={
				students:[],
				student:this.student
			};
		},
		onAfterRendering: function(){
			var oModel = new sap.ui.model.json.JSONModel(this.data);
			this.getView().setModel(oModel);
		},
		//NEW STUDENT PAGE OPEN
		onOpenDialog : function (oEvent) {
			if(!this.addstudent){
				this.addstudent = sap.ui.xmlfragment("sap.ui.demo.walkthrough.view.NewStudent",this);
				var oModel = new sap.ui.model.json.JSONModel();
				this.addstudent.setModel(oModel);	
			}
			this.student.id=this.giStudentId;
			var data= JSON.parse(JSON.stringify(this.student));
			this.addstudent.getModel().setData(data);
			this.addstudent.open();
		},
		//NEW STUDENT PAGE CLOSE
		onCloseButton: function(){
			this.addstudent.close();
		},
		//ADD STUDENT BUTTON
		onSaveButton:function(oEvent){
			var oModel =oEvent.getSource().getModel();
			var oDialogData = oModel.getData();
			var oViewData = this.getView().getModel().getData();
			//WHEN EDITING
			if(this.gbEditing){
				for(var i=0; i<oViewData.students.length>0; i++){
					var temp = oViewData.students[i];
					if(temp.id === oDialogData.id){
						temp= oDialogData;
						temp.genderText=(temp.gender)?"Male":"Female";
						oViewData.students[i] = temp;
						//MESSAGE MANAGER EDIT ALERT
						var oMessage = new Message({
							message: "The student's information was edited.",
							type: library.MessageType.Warning,
							processor: this.getView().getModel()
						});
						sap.ui.getCore().getMessageManager().addMessages(oMessage);
						break;
					}
				}
				this.gbEditing=false;
				this.getView().getModel().setData(oViewData);
				this.addstudent.close();
				return;
				}
			//WHEN ADDING
			oDialogData.genderText=(oDialogData.gender)?"Male":"Female";
			oViewData.students.push(oDialogData);
			this.getView().getModel().setData(oViewData);
			this.giStudentId++;
			this.addstudent.close();
			//MESSAGE MANAGER ADD ALERT
			var oMessage1 = new Message({
				message: "The student was added.",
				type:  library.MessageType.Success,
				processor: this.getView().getModel()
			});
			sap.ui.getCore().getMessageManager().addMessages(oMessage1);
		},
		//STUDENT EDIT BUTTON
		onEdit : function (oEvent) {
			var oCurrentStudent= oEvent.getSource().getBindingContext().getObject();
			this.addstudent.getModel().setData(oCurrentStudent);
			this.addstudent.open();
			this.gbEditing= true;
		},
		//STUDENT DELETE BUTTON
		onDelete : function(oEvent){
			var oCurrentStudent=oEvent.getSource().getBindingContext().getObject();
			var oViewData = this.getView().getModel().getData();
			for(var i = 0; i< oViewData.students.length;i++){
				var temp = oViewData.students[i];
				if(temp.id === oCurrentStudent.id){
					oViewData.students.splice(i,1);
					break;
				}
			}
			//MESSAGE MANAGER DELETE ALERT
			var oMessage = new Message({
				message: "The student was deleted.",
				type: library.MessageType.Error,
				processor: this.getView().getModel()
			});
			sap.ui.getCore().getMessageManager().addMessages(oMessage);
			this.getView().getModel().setData(oViewData);
		},
		//MESSAGE MANAGER CLEAR BUTTON
		onClearPress : function(){
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},
		//MESSAGEMANAGER OPEN BUTTON
		onMessagePopoverPress : function (oEvent1) {
			var oSourceControl = oEvent1.getSource();
			this._getMessagePopover().then(function(oMessagePopover){
				oMessagePopover.openBy(oSourceControl);
			});
		},
		//MESSAGE MANAGER FRAGMENT OPEN
		_getMessagePopover: function () {
			var oView1 = this.getView();
			if (!this._pMessagePopover) {
				this._pMessagePopover = Fragment.load({
					id: oView1.getId(),
					name: "sap.ui.demo.walkthrough.view.MessagePopover"
				}).then(function (oMessagePopover) {
					oView1.addDependent(oMessagePopover);
					return oMessagePopover;
				});
			}
			return this._pMessagePopover;
		}
		});
	},
	);
