sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zsewmender.controller.View1", {
            onInit: function () {

                //Messagez
                let oMessageManager = sap.ui.getCore().getMessageManager();
                let oView = this.getView();
                oView.setModel(oMessageManager.getMessageModel(), "messagez");

                // WIZARD
                this._wizard = this.byId("CreateProductWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");
                
                // this.getView().byId("_id_wizard").setShowNextButton(false);  //Hides Next Button
                this._wizard.setShowNextButton(false);

                this.model = new JSONModel();
                this.model.setData({
                    loteInput1State: "None",
                    loteInput2State: "None"
                });

                this.getView().setModel(this.model);

                this.model.setProperty("/navApiEnabled", true);

                //Parte 1
                this.model.setProperty("/LoteInput1", "");
                this.model.setProperty("/LoteInput2", "");
                this.model.setProperty("/OriLoteInput2Visible", false);
                this.model.setProperty("/OriMatMonfiguravel", false);
                this.model.setProperty("/OriMatnr", "");
                this.model.setProperty("/OriVbeln", "");
                this.model.setProperty("/OriKunnr", "");
                this.model.setProperty("/OriLgnum", "");
                // this.model.setProperty("/OriPlant", "");
                this.model.setProperty("/OriCharg", "");

                //Parte 2
                this.model.setProperty("/OriLargura", "");
                this.model.setProperty("/OriDiametro", "");
                this.model.setProperty("/OriDiametroInt", "");
                this.model.setProperty("/OriMaquina", "");
                this.model.setProperty("/OriQualidade", "");
                this.model.setProperty("/OriMotivoQualid", "");
                this.model.setProperty("/OriLgtyp", "");
                this.model.setProperty("/OriLgpla", "");
                this.model.setProperty("/OriCat", "");
                this.model.setProperty("/OriMatid", "");
                this.model.setProperty("/OriStgeLoc", "");
                this.model.setProperty("/DesLgnum", "");
                this.model.setProperty("/DesVlpla", "");
                this.model.setProperty("/DesNltyp", "");
                this.model.setProperty("/DesNlber", "");
                this.model.setProperty("/DesNlpla", "");
                this.model.setProperty("/DesVsolm", 0);
                this.model.setProperty("/DesAltme", "");

                this.model.setProperty("/DesEntitled", "");
                this.model.setProperty("/DesOwner", "");
                this.model.setProperty("/DesQuant", 0);
                this.model.setProperty("/DesStockDocCat", "");
                this.model.setProperty("/DesStockDocNo", "");
                this.model.setProperty("/DesStockItmNo", "");
                this.model.setProperty("/DesUnit", "");

                //Campos dependentes de Lote1 ou Lote2
                this.model.setProperty("/OriLt1Charg", "");
                this.model.setProperty("/OriLt2Charg", "");
                this.model.setProperty("/OriLt1Tanum", "");
                this.model.setProperty("/OriLt2Tanum", "");
                this.model.setProperty("/OriLt1Batchid", "");
                this.model.setProperty("/OriLt2Batchid", "");

                //Ajustado
                this.model.setProperty("/AjusNlpla", "");
                this.model.setProperty("/AjusNlplaVisivel", false);
                
                this.model.setProperty("/AjusExcecao", "");
                this.model.setProperty("/AjusExcecaoVisivel", false);
                // this.model.setProperty("/AjusVisivel", false);

                //Mensagem Retornada da BAPI
                this.model.setProperty("/MsgType", "");
                this.model.setProperty("/MsgID", "");
                this.model.setProperty("/MsgNumber", "");
                this.model.setProperty("/Msg", "");

                this.model.setProperty("/handleWizardSubmitEnabled", true);
                this.model.setProperty("/handleWizardSubmitText", "Confirmar"); 

                

            },
            //----------------------------------------------------------------
            // WIZARD
            //----------------------------------------------------------------

            setProductType: function (evt) {
                var productType = evt.getSource().getTitle();
                this.model.setProperty("/productType", productType);
                this.byId("ProductStepChosenType").setText(
                "Chosen product type: " + productType
                );
                this._wizard.validateStep(this.byId("ProductTypeStep"));
            },

            setProductTypeFromSegmented: function (evt) {
                var productType = evt.getParameters().item.getText();
                this.model.setProperty("/productType", productType);
                this._wizard.validateStep(this.byId("ProductTypeStep"));
            },



            optionalStepActivation: function () {
                MessageToast.show("This event is fired on activate of Step3.");
            },

            optionalStepCompletion: function () {
                MessageToast.show(
                "This event is fired on complete of Step3. You can use it to gather the information, and lock the input data."
                );
            },

            loteActivate: function () {
                // this.model.setProperty("/navApiEnabled", true);
            },

            loteComplete: function () {
                // this.model.setProperty("/navApiEnabled", false);
            },

            enderecActivate: function () {
                // this.model.setProperty("/navApiEnabled", true);
            },

            enderecComplete: function () {
                // this.model.setProperty("/navApiEnabled", false);
            },

            goFrom1to2: function () {
                this._wizard.goToStep(this.byId("OrigemDestino"));

            },

            scrollFrom4to2: function () {
                this._wizard.goToStep(this.byId("ProductInfoStep"));
            },

            goFrom4to3: function () {
                if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
                this._wizard.previousStep();
                }
            },

            goFrom4to5: function () {
                if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
                this._wizard.nextStep();
                }
            },

            wizardCompletedHandler: function () {
                this._oNavContainer.to(this.byId("wizardReviewPage"));
            },

            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },

            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            editStepThree: function () {
                this._handleNavigationToStep(2);
            },

            editStepFour: function () {
                this._handleNavigationToStep(3);
            },

            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },

            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                    this._handleNavigationToStep(0);
                    this._wizard.discardProgress(this._wizard.getSteps()[0]);
                    }
                }.bind(this),
                });
            },

            _setEmptyValue: function (sPath) {
                this.model.setProperty(sPath, "n/a");
            },

            handleWizardCancel: function () {
                this._handleMessageBoxOpen(
                "Quer cancelar?",
                "warning"
                );
            },



            additionalInfoValidation: function () {

                //validar Lote 1
                let loteInput1 = this.byId("LoteInput1").getValue();
                if (loteInput1.length == 10 && !isNaN(loteInput1)) {

                    this.model.setProperty("/loteInput1State", "None");

                    //Se validação mínima do lote 1 é ok, vamos ler dados no SAP.
                    this.getDadosParte1();

                } else {
                    this.model.setProperty("/loteInput1State", "Error");
                }

                // //validar Lote 2
                // if (this.isGetDadosParte1JaExecutada()) {

                //     let loteInput2 = this.byId("LoteInput2").getValue();

                //     if (this.isValidacaoBasicaLote2Ok(loteInput1, loteInput2)) {
                //         this.model.setProperty("/loteInput2State", "None");
                //         this.getDadosParte2('', loteInput2);
                //     } else {
                //         this.model.setProperty("/loteInput2State", "Error");
                //     }
                // }

                // //validar Lote 2
                // let loteInput2 = this.byId("LoteInput2").getValue();
                // if (loteInput2.length == 0 || loteInput2.length == 10) {
                //     if (loteInput2.length == 10) {
                //         if (!isNaN(loteInput2)) {
                //             this.model.setProperty("/loteInput2State", "None");

                //         }
                        
                //         if (loteInput1 && loteInput2) {
                //             if (loteInput1 === loteInput2) {
                //                 this.model.setProperty("/loteInput2State", "Error");
                //                 this._SetMessage1("","", "", "Lotes estão iguais", "error"); 
                //             }
                //         }
                //     }
                // } else {
                //     this.model.setProperty("/loteInput2State", "Error");
                // }

            },

            additionalInfoValidationLote1: function () {

                //validar Lote 1
                let loteInput1 = this.byId("LoteInput1").getValue();
                if (loteInput1.length == 10 && !isNaN(loteInput1)) {

                    this.model.setProperty("/loteInput1State", "None");

                    //Se validação mínima do lote 1 é ok, vamos ler dados no SAP.
                    this.getDadosParte1();

                } else {
                    this.model.setProperty("/loteInput1State", "Error");
                }
            },

            additionalInfoValidationLote2: function () {

                let loteInput1 = this.byId("LoteInput1").getValue();

                //validar Lote 2
                if (this.isGetDadosParte1JaExecutada()) {

                    let loteInput2 = this.byId("LoteInput2").getValue();

                    if (this.isValidacaoBasicaLote2Ok(loteInput1, loteInput2)) {
                        this.model.setProperty("/loteInput2State", "None");
                        this.getDadosParte2('', loteInput2);
                    } else {
                        this.model.setProperty("/loteInput2State", "Error");
                    }
                }
            },

            additionalInfoValidationAjuste: function () {

                let DesLgnum   = this.byId("DesLgnum").getText();
                let AjusNlplaScreen = this.byId("AjusNlpla").getValue();

                let DesNlpla    = this.model.getProperty("/DesNlpla");
                let OriLgtyp    = this.model.getProperty("/OriLgtyp");
                // let AjusNlplaModel   = this.model.getProperty("/AjusNlpla");

                if (DesLgnum) {
                    //Se é processo de Confirm
                    this.model.setProperty("/AjusExcecaoVisivel", true);
                } else {
                    
                }

                if  (AjusNlplaScreen != '' && 
                     DesNlpla  != '' &&
                     AjusNlplaScreen != DesNlpla &&
                     AjusNlplaScreen.length > 6) {
                    this.model.setProperty("/AjusExcecaoVisivel", true);
                } else {
                    this.model.setProperty("/AjusExcecaoVisivel", false);
                }

            },
        
            isGetDadosParte1JaExecutada(){
                let oriMatnr = this.model.getProperty("/OriMatnr");

                if (oriMatnr) {
                    return true;
                } else {
                    return false;
                    
                }
            },

            isValidacaoBasicaLote2Ok: function(loteInput1, loteInput2){

                if (loteInput2.length == 0) {
                    this.model.setProperty("/loteInput2State", "None");
                    return false;
                
                } else if (loteInput2.length == 10) {
                
                    if (!isNaN(loteInput2)) {
                        this.model.setProperty("/loteInput2State", "None");
                    } else {
                        this.model.setProperty("/loteInput2State", "Error");
                        return false;
                    }
                    
                    if (loteInput1 && loteInput1.length === 10 && loteInput2) {
                        if (loteInput1 === loteInput2) {
                            this.model.setProperty("/loteInput2State", "Error");
                            this._SetMessage1("","", "", "error", "Lotes estão iguais"); 
                            return false;
                        }
                    }

                } else {
                    this.model.setProperty("/loteInput2State", "Error");
                    return false;
                }


            },

            getDadosParte1: function () {
                //--------------------------------------------------------
                // Buscar Dados Básicos Matnr, OV, MatConfigurável.
                //--------------------------------------------------------

                let loteInput1 = this.byId("LoteInput1").getValue();

                let sUrlServico = "/sap/opu/odata/sap/ZGWEWM_ENDERECA_SRV/";
                let sChaveLote = `/LoteSet(LoteInput1='` + loteInput1 + `',LoteInput2='')`;
                let oModel = new sap.ui.model.odata.v2.ODataModel(sUrlServico);

                oModel.read(sChaveLote, {
                    success: function (oDados, oResponse) {
                        // this.model.setProperty("/LoteInput1", oDados.LoteInput1);
                        // this.model.setProperty("/LoteInput2", oDados.LoteInput2);

                        this.model.setProperty("/OriMatnr", oDados.OriMatnr);
                        this.model.setProperty("/OriVbeln", oDados.OriVbeln);
                        this.model.setProperty("/OriKunnr", oDados.OriKunnr);
                        this.model.setProperty("/OriLgnum", oDados.OriLgnum);
                        
                        this.model.setProperty("/OriLoteInput2Visible", oDados.OriLoteInput2Visible);
                        this.model.setProperty("/OriMatConfiguravel", oDados.OriMatConfiguravel);

                        if (!oDados.OriMatConfiguravel) {
                            // limpar lote 2, se não for mat. configurável
                            this.model.setProperty("/LoteInput2", "");
                        }

                        //adicionar no Massage Manager
                        sap.ui.getCore().getMessageManager().removeAllMessages();

                        this.getDadosParte2(oDados.LoteInput1, '');



                    }.bind(this),
                    error: function (oError) {
                        //adicionar no Massage Manager
                        sap.ui.getCore().getMessageManager().removeAllMessages();
                        this._SetMessage1("","", oError, "", ""); 
                    }.bind(this),
                });
            },

            getDadosParte2: function (loteInput1, loteInput2) {

                // let loteInput1 = '';
                // let loteInput2 = '';
                
                let sUrlServico = '';
                let sChaveLote = '';
                let oModel = '';

                //-----------------------------------------------------------
                // BUSCAR p/ LOTE 1
                //-----------------------------------------------------------
                // loteInput1 = this.byId("LoteInput1").getValue();

                sUrlServico = "/sap/opu/odata/sap/ZGWEWM_ENDERECA_SRV/";
                oModel = new sap.ui.model.odata.v2.ODataModel(sUrlServico);

                if (loteInput1) {
                    sChaveLote = `/EnderecSet(LoteInput1='` + loteInput1 + `',LoteInput2='')`;

                    oModel.read(sChaveLote, {
                        success: function (oDados, oResponse) {
    
                            // this.model.setProperty("/LoteInput1", oDados.LoteInput1);
                            // this.model.setProperty("/LoteInput2", oDados.LoteInput2);
    
                            this.model.setProperty("/OriLargura",       oDados.OriLargura);
                            this.model.setProperty("/OriDiametro",      oDados.OriDiametro);
                            this.model.setProperty("/OriDiametroInt",   oDados.OriDiametroInt);
                            this.model.setProperty("/OriMaquina",       oDados.OriMaquina);
                            this.model.setProperty("/OriQualidade",     oDados.OriQualidade);
                            this.model.setProperty("/OriMotivoQualid",  oDados.OriMotivoQualid);
                            this.model.setProperty("/OriLgtyp",         oDados.OriLgtyp);
                            this.model.setProperty("/OriLgpla",         oDados.OriLgpla);
                            this.model.setProperty("/OriCat",           oDados.OriCat);
                            this.model.setProperty("/OriMatid",         oDados.OriMatid);
    
                            this.model.setProperty("/OriStgeLoc",       oDados.OriStgeLoc);
                            this.model.setProperty("/DesLgnum",         oDados.DesLgnum);
                            this.model.setProperty("/DesVlpla",         oDados.DesVlpla);
                            this.model.setProperty("/DesNltyp",         oDados.DesNltyp);
                            this.model.setProperty("/DesNlber",         oDados.DesNlber);
                            this.model.setProperty("/DesNlpla",         oDados.DesNlpla);
                            this.model.setProperty("/DesVsolm",         oDados.DesVsolm);
                            this.model.setProperty("/DesAltme",         oDados.DesAltme);
                            
                            this.model.setProperty("/DesEntitled",      oDados.DesEntitled);
                            this.model.setProperty("/DesOwner",         oDados.DesOwner);
                            this.model.setProperty("/DesQuant",         oDados.DesQuant);
                            this.model.setProperty("/DesStockDocCat",   oDados.DesStockDocCat);
                            this.model.setProperty("/DesStockDocNo",    oDados.DesStockDocNo);
                            this.model.setProperty("/DesStockItmNo",    oDados.DesStockItmNo);
                            this.model.setProperty("/DesUnit",          oDados.DesUnit);
    
                            //Campos ligados a lote1
                            this.model.setProperty("/OriLt1Batchid",       oDados.OriLt1Batchid);
                            this.model.setProperty("/OriLt1Charg",         oDados.OriLt1Charg);
                            this.model.setProperty("/OriLt1Tanum",         oDados.OriLt1Tanum);
    
                            //Ajustado
                            //é BAPI Confirmar?
                            if (oDados.DesLgnum) {
                                this.model.setProperty("/AjusNlpla",        oDados.DesNlpla);
                                this.model.setProperty("/AjusNlplaVisivel", true);
                                this.model.setProperty("/AjusVisivel",      "");
                                this.model.setProperty("/AjusExcecaoVisivel", false);
    
                                //Definir text do botão confirmar
                                this.model.setProperty("/handleWizardSubmitText", "Confirmar"); 
    
    
                            //Definir alguns campos da tela
                            //é BAPI Criar?
                            } else {
                                if ( (oDados.OriLgtyp != '9010') &&
                                     (oDados.OriLgtyp != '9020') ) {
                                    this.model.setProperty("/AjusNlpla", oDados.DesNlpla);
                                    this.model.setProperty("/AjusNlplaVisivel", true);
                                    this.model.setProperty("/AjusExcecaoVisivel", false);
                                }
    
                                //Definir text do botão criar
                                this.model.setProperty("/handleWizardSubmitText", "Criar"); 
    
                            }
    
                            //Mostrar NEXT button
                            // Apenas se tiver pelo menos um dado importante na tela
                            if (oDados.OriLgpla) {
                                this._wizard.setShowNextButton(true); 
    
                                //Caso não precise de lote2, 
                                //Navegar automaticamente p/ passo 2
                                let OriMatConfiguravel = this.model.getProperty("/OriMatConfiguravel");
                                if (!OriMatConfiguravel) {
                                    this._wizard.nextStep();
                                }
                            } else {
                                //Dados de lote pesquisado são inválidos p/ o app
                                this._SetMessage1("","", "", "Dados do lote 1 pesquisado são inválidos", "error");
                            }
    
                        }.bind(this),
                        error: function (oError) {
                            
                            this._SetMessage1("","", oError, "", ""); 
                        }.bind(this),
                    });
                }
                
            


                //-----------------------------------------------------------
                // BUSCAR p/ LOTE 2
                //-----------------------------------------------------------
                
                loteInput1 = loteInput1 != '' ? loteInput1 : this.byId("LoteInput1").getValue();

                if (loteInput1 && loteInput2) {

                    if (this.isValidacaoBasicaLote2Ok(loteInput1, loteInput2)){
                        sChaveLote = `/EnderecSet(LoteInput1='',LoteInput2='` + loteInput2 + `')`;

                        oModel.read(sChaveLote, {
                            success: function (oDados, oResponse) {
        
                                //Campos ligados a lote2                        
                                this.model.setProperty("/OriLt2Batchid",       oDados.OriLt2Batchid);
                                this.model.setProperty("/OriLt2Charg",         oDados.OriLt2Charg);
                                this.model.setProperty("/OriLt2Tanum",         oDados.OriLt2Tanum);
        
                                //Navegar automaticamente p/ passo 2
                                this._wizard.nextStep();
        
                            }.bind(this),
                            error: function (oError) {
                                this._SetMessage1("","", oError, "", ""); 
                            }.bind(this),
                        });
                    }

                }
            
            
            },

            isValidacaoBasicaLote2Ok: function(loteInput1, loteInput2){

                if (loteInput2.length == 0) {
                    this.model.setProperty("/loteInput2State", "None");
                    return false;
                
                } else if (loteInput2.length == 10) {
                
                    if (!isNaN(loteInput2)) {
                        this.model.setProperty("/loteInput2State", "None");
                    } else {
                        this.model.setProperty("/loteInput2State", "Error");
                        return false;
                    }
                    
                    if (loteInput1 && loteInput1.length === 10 && loteInput2) {
                        if (loteInput1 != loteInput2) {
                            return true;
                        } else {
                            this.model.setProperty("/loteInput2State", "Error");
                            this._SetMessage1("","", "", "Lotes estão iguais", "error"); 
                            return false;
                        }
                    }

                } else {
                    this.model.setProperty("/loteInput2State", "Error");
                    return false;
                }


            },

            handleWizardSubmit: function () {

                sap.ui.getCore().getMessageManager().removeAllMessages();

                let loteAtual = ``;
                let loteInput1 = this.byId("LoteInput1").getValue();
                let loteInput2 = this.byId("LoteInput2").getValue();

                //var. aux. p/ msg dentro da bapi
                let loteAtual1 = loteInput1;
                let loteAtual2 = loteInput2;

                //Popup
                let sMessage = "Tem certeza?";
                let sMessageBoxType = "confirm";

                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {

                        if (oAction === MessageBox.Action.NO) {
                            return;
                        }
                        

                        let DesLgnum   = this.byId("DesLgnum").getText();
                        
                        //--------------------------------------------------------------
                        //Chamar BAPI Confirmar
                        //--------------------------------------------------------------
                        if (DesLgnum) {

                            //Ler campos para Confirm
                            //ler na view
                            let ajusExcecao = this.byId("AjusExcecao").getValue();

                            //Ler no view.model
                            let OriLgnum    = this.model.getProperty("/OriLgnum");
                            let DesVsolm    = this.model.getProperty("/DesVsolm");
                            let DesAltme    = this.model.getProperty("/DesAltme");

                            let OriLt1Tanum = "";
                            let OriLt2Tanum = "";

                            let sUrlServico = "/sap/opu/odata/sap/ZGWEWM_ENDERECA_SRV";
                            let sAction = "/Confirmar";
                            let oModel = new sap.ui.model.odata.v2.ODataModel(sUrlServico);
                            
                            for (let cont = 1; cont <= 2; cont++) {
                                if (cont === 1) {
                                    //p/lote1
                                    loteAtual = loteInput1;
                                    loteAtual1 = loteInput1;
                                    loteAtual2 = '';
                                    OriLt1Tanum = this.model.getProperty("/OriLt1Tanum");
                                    OriLt2Tanum = "";
                                } else if (cont === 2) {
                                    //p/lote2
                                    if (!loteInput2) {
                                        //Erro lote 2 vazio
                                        return;
                                    }
                                    loteAtual = loteInput2;
                                    loteAtual1 = '';
                                    loteAtual2 = loteInput2;
                                    OriLt1Tanum = "";
                                    OriLt2Tanum = this.model.getProperty("/OriLt2Tanum");
                                }
                                oModel.callFunction(
                                    sAction, {
                                        method:"POST",
                                        urlParameters: {
                                            AjusExcecao: ajusExcecao,
                                            DesVsolm: DesVsolm,
                                            DesAltme: DesAltme,
                                            Msg:"",
                                            MsgID:"",
                                            MsgNumber:"",
                                            MsgType:"",
                                            OriLgnum: OriLgnum,
                                            OriLt1Tanum: OriLt1Tanum,
                                            OriLt2Tanum: OriLt2Tanum,
                                            LoteInput1: loteAtual1,
                                            LoteInput2: loteAtual2
                                        },
                                        success: function(oData,response){
                                            this._SetMessage1(oData,response, "", "success"); 


                                        }.bind(this),
                                        error: function(oError)
                                        {
                                            this._SetMessage1("","", oError, "", ""); 


                                        }.bind(this)
                                    }
                                );
                            }


                        
                        //--------------------------------------------------------------
                        //Chamar BAPI Criar
                        //--------------------------------------------------------------
                        } else {
                            
                            if (!loteInput1) {
                                //Erro lote 1 vazio
                                this._SetMessage1("","", "", "Lote 1 está vazio!", "error");
                                return;
                            }
                            let AjusNlpla       = this.model.getProperty("/AjusNlpla");
                            let DesEntitled     = this.model.getProperty("/DesEntitled");
                            let DesOwner        = this.model.getProperty("/DesOwner");
                            let DesQuant        = this.model.getProperty("/DesQuant");
                            let DesStockDocCat  = this.model.getProperty("/DesStockDocCat");
                            let DesStockDocNo   = this.model.getProperty("/DesStockDocNo");
                            let DesStockItmNo   = this.model.getProperty("/DesStockItmNo");
                            let DesUnit         = this.model.getProperty("/DesUnit");
                            let DesVlpla        = this.model.getProperty("/DesVlpla");
                            let Msg             = this.model.getProperty("/Msg");
                            let MsgID           = this.model.getProperty("/MsgID");
                            let MsgNumber       = this.model.getProperty("/MsgNumber");
                            let MsgType         = this.model.getProperty("/MsgType");
                            let OriCat          = this.model.getProperty("/OriCat");
                            let OriLgnum        = this.model.getProperty("/OriLgnum");
                            let OriLgpla        = this.model.getProperty("/OriLgpla");
                            let OriLt1Batchid   = "";
                            let OriLt2Batchid   = "";
                            let OriMatid        = this.model.getProperty("/OriMatid");

                            let sUrlServico = "/sap/opu/odata/sap/ZGWEWM_ENDERECA_SRV";
                            let sAction = "/Criar";
                            let oModel = new sap.ui.model.odata.v2.ODataModel(sUrlServico);
                            
                            for (let cont = 1; cont <= 2; cont++) {
                                if (cont === 1) {
                                    //p/ lote1
                                    loteAtual           = loteInput1;
                                    loteAtual1          = loteInput1;
                                    loteAtual2          = '';
                                    OriLt1Batchid       = this.model.getProperty("/OriLt1Batchid");
                                    OriLt2Batchid       = '00000000-0000-0000-0000-000000000000';
                                } else if (cont === 2){
                                    //p/ lote2
                                    loteAtual           = loteInput2;
                                    loteAtual1          = '';
                                    loteAtual2          = loteInput2;
                                    OriLt1Batchid       = '00000000-0000-0000-0000-000000000000';
                                    OriLt2Batchid       = this.model.getProperty("/OriLt2Batchid");

                                    if (!loteInput2) {
                                        //Erro lote 2 vazio
                                        return;
                                    }
                                }
                                if (OriLt1Batchid === '00000000-0000-0000-0000-000000000000' &&
                                    OriLt2Batchid === '00000000-0000-0000-0000-000000000000') {
                                    // Erro para chamar BAPI criar
                                    this._SetMessage1("", "", "BAPI Criar, Erro de variável em sua chamada.", "error"); 
                                    return;
                                }
                                oModel.callFunction(
                                    sAction, {
                                        method:"POST",
                                        urlParameters: {
                                            AjusNlpla       : AjusNlpla,
                                            DesEntitled     : DesEntitled,
                                            DesOwner        : DesOwner,
                                            DesQuant        : DesQuant,
                                            DesStockDocCat  : DesStockDocCat,
                                            DesStockDocNo   : DesStockDocNo,
                                            DesStockItmNo   : DesStockItmNo,
                                            DesUnit         : DesUnit,
                                            DesVlpla        : DesVlpla,
                                            Msg             : Msg,
                                            MsgID           : MsgID,
                                            MsgNumber       : MsgNumber,
                                            MsgType         : MsgType,
                                            OriCat          : OriCat,
                                            OriLgnum        : OriLgnum,
                                            OriLgpla        : OriLgpla,
                                            OriLt1Batchid   : OriLt1Batchid,
                                            OriLt2Batchid   : OriLt2Batchid,
                                            OriMatid        : OriMatid,
                                            LoteInput1      : loteAtual1,
                                            LoteInput2      : loteAtual2

                                        },
                                        success: function(oData,response){
                                            this._SetMessage1(oData,response, "", "", "success"); 



                                        }.bind(this),
                                        error: function(oError)
                                        {
                                            this._SetMessage1("", "", oError, "", ""); 

                                            

                                        }.bind(this)
                                    }
                                );
                            }
                        }
                    }.bind(this),
                });
            },

            _SetMessage1: function (oData, oResponse, oError, sMsgAdd, sMsgAddType) {


                //----------------------------------------------------------
                //Quando Sucesso
                //----------------------------------------------------------
                if (oData && oResponse) {
                    
                    let sMsgCode    = "";
                    let sMsg        = "";
                    let sMsgType    = "";
                    let sMsgTarget  = "";

                    // MSG c/ model messagez
                    if (oResponse.headers["sap-message"]) {
                        sMsgCode    = JSON.parse(oResponse.headers["sap-message"]).code;
                        sMsg        = sMsgAdd != '' ? sMsgAdd + `-` + JSON.parse(oResponse.headers["sap-message"]).message : JSON.parse(oResponse.headers["sap-message"]).message;
                        sMsgType    = JSON.parse(oResponse.headers["sap-message"]).severity;
                        sMsgTarget  = JSON.parse(oResponse.headers["sap-message"]).target;    
                    } else {
                        sMsgCode    = "";
                        sMsg        = "Dados inválidos";
                        sMsgType    = "";
                        sMsgTarget  = "";
                    }

                    // MSG simples:
                    // MessageBox.success(sMsg);

                    // MSG c/ model messagez
                    let oMessageZSucesso = new sap.ui.core.message.Message({
                        message: sMsg,
                        type: sap.ui.core.MessageType.Success,
                        target: sMsgTarget,
                        processor: this.getView().getModel()
                    });

                    //adicionar no Message Manager
                    // sap.ui.getCore().getMessageManager().removeAllMessages();

                     //adicionar no Message Manager
                    //ORIGINAL
                    // sap.ui.getCore().getMessageManager().addMessages(oMessageZSucesso);    

                    //Teste remove msg
                    let aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
                    let sMessage = aMessages.filter(function (mItem) {
                        return mItem.message === oMessageZSucesso.message;
                    });
                    // sap.ui.getCore().getMessageManager().removeMessages(sMessage);
                    if (!sMessage) {
                        sap.ui.getCore().getMessageManager().addMessages(oMessageZSucesso);        
                    }


                    
                }

                //----------------------------------------------------------
                //Quando ERRO
                //----------------------------------------------------------
                if (oError) {

                    try {
                        let sMsgCode    = JSON.parse(oError.responseText).error.code.length < 7 ? JSON.parse(oError.responseText).error.code : "";
                        let sMsg        = sMsgAdd != '' ? sMsgAdd + sMsgCode + `-` + JSON.parse(oError.responseText).error.message.value : sMsgCode + `-` + JSON.parse(oError.responseText).error.message.value;
                        let sMsgType    = JSON.parse(oError.responseText).error.innererror.errordetails[0].severity ? JSON.parse(oError.responseText).error.innererror.errordetails[0].severity : "";
                        let sMsgTarget  = JSON.parse(oError.responseText).error.innererror.errordetails[0].target ? JSON.parse(oError.responseText).error.innererror.errordetails[0].target : "";
    
                        // MessageBox.error(sMsg);
    
                        // MSG c/ model messagez
                        let oMessageZErro = new sap.ui.core.message.Message({
                            message: sMsg,
                            type: sap.ui.core.MessageType.Error,
                            target: sMsgTarget,
                            processor: this.getView().getModel()
                        });
    
                        //adicionar no Message Manager
                        //ORIGINAL
                        // sap.ui.getCore().getMessageManager().addMessages(oMessageZErro);    

                        //Teste remove msg
                        let aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
                        let sMessage = aMessages.filter(function (mItem) {
                            return mItem.message === oMessageZErro.message;
                        });
                        // sap.ui.getCore().getMessageManager().removeMessages(sMessage);
                        if (!sMessage) {
                            sap.ui.getCore().getMessageManager().addMessages(oMessageZErro);        
                        }
                        


                    } catch (error) {
                        MessageBox.error('Erro técnico ao chamar o SAP');
                    }

                }

                if (!oData && !oResponse && !oError && sMsgAdd && sMsgAddType) {

                    // MSG c/ model messagez
                    let sMsgCode    = "";
                    let sMsg        = sMsgAdd;
                    let sMsgType    = sMsgAddType == 'error' ? sap.ui.core.MessageType.Error : sap.ui.core.MessageType.Success;
                    let sMsgTarget  = "";
                    
                    // MSG simples
                    // MessageBox.error(sMsg);

                    // instanciar messagez
                    let oMessageZGenerica = new sap.ui.core.message.Message({
                        message: sMsg,
                        type: sMsgType,
                        target: sMsgTarget,
                        processor: this.getView().getModel()
                    });

                    //adicionar no Message Manager
                    sap.ui.getCore().getMessageManager().addMessages(oMessageZGenerica);
                }


            },
            // método para instanciar o fragment
            _getMessagePopover: function () {
                var oView = this.getView();
    
                // cria popover
                // se não tem instância, criar a instância
                if (!this._pMessagePopover) {
                    this._pMessagePopover = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "zsewmender.view.MessagePopover",
                    }).then(function (oMessagePopover) {
                        oView.addDependent(oMessagePopover);
                        return oMessagePopover;
                    });
                }
                // se ja existe a instancia, retornar a instancia criada
                return this._pMessagePopover;
            },

            onMessagePopoverPress: function (oEvent) {
                var oSourceControl = oEvent.getSource();
                this._getMessagePopover().then(function (oMessagePopover) {
                  oMessagePopover.openBy(oSourceControl);
                });
            },

            productWeighStateFormatter: function (val) {
                return isNaN(val) ? "Error" : "None";
            },

            discardProgress: function () {
                this._wizard.discardProgress(this.byId("ProductTypeStep"));

                var clearContent = function (content) {
                for (var i = 0; i < content.length; i++) {
                    if (content[i].setValue) {
                    content[i].setValue("");
                    }

                    if (content[i].getContent) {
                    clearContent(content[i].getContent());
                    }
                }
                };

                this.model.setProperty("/productWeightState", "Error");
                this.model.setProperty("/productNameState", "Error");
                clearContent(this._wizard.getSteps());
            }
        });
    });
