  METHOD /iwbep/if_mgw_appl_srv_runtime~changeset_process.

    DATA:
      lv_operation_counter  TYPE i VALUE 0,
      lr_context            TYPE REF TO /iwbep/cl_mgw_request,
      lr_entry_provider     TYPE REF TO /iwbep/if_mgw_entry_provider,
      lr_message_container  TYPE REF TO /iwbep/if_message_container,
      lr_entity_data        TYPE REF TO data,
      ls_context_details    TYPE /iwbep/if_mgw_core_srv_runtime=>ty_s_mgw_request_context,
      ls_changeset_response LIKE LINE OF ct_changeset_response,
      ls_entity             TYPE zcl_zgwewm_endereca_mpc=>ts_enderec,
      lv_msg                TYPE bapi_msg,
      lv_type_error         TYPE char1 VALUE `E`,
      lv_type_success       TYPE char1 VALUE `S`,
      lv_tabix              TYPE sy-tabix,
      lv_procty             TYPE char4 VALUE `9999`,
      lv_owner_role         TYPE char2 VALUE `BP`.

    DATA(lr_container) = mo_context->get_message_container( ). "tratar mensagens


    DATA:
      lv_uname    TYPE sy-uname,
      lt_conf     TYPE /scwm/to_conf_tt,
      lt_conf_exc TYPE /scwm/tt_conf_exc,
      ls_conf     LIKE LINE OF lt_conf,
      ls_conf_exc LIKE LINE OF lt_conf_exc,
      lt_bapiret  TYPE  bapirettab,
      ls_bapiret  LIKE LINE OF lt_bapiret,
      lt_create   TYPE /scwm/tt_to_create_int,
      ls_create   LIKE LINE OF lt_create.

    lv_uname = sy-uname.

    FIELD-SYMBOLS:
        <fs_ls_changeset_request>  LIKE LINE OF it_changeset_request.

    LOOP AT it_changeset_request ASSIGNING <fs_ls_changeset_request>.
      lr_context          ?= <fs_ls_changeset_request>-request_context.
      lr_entry_provider    = <fs_ls_changeset_request>-entry_provider.
      lr_message_container = <fs_ls_changeset_request>-msg_container.
      ls_context_details   = lr_context->get_request_details( ).


      "--------------------------------------------------------------
      " Confirmar
      "--------------------------------------------------------------
      IF ls_context_details-function-name = `Confirmar`.

        lv_uname = sy-uname.

        "teste
        IF sy-uname = 'BTP_USER' ##USER_OK.
          lv_uname = 'TCGK1001964'.
        ENDIF.

        SELECT lgnum
          FROM /scwm/user
          INTO @ls_entity-Orilgnum
         WHERE uname = @lv_uname
         ORDER BY PRIMARY KEY.
        ENDSELECT.

        "P/ LOTE1 do App
        IF ls_context_details-parameters[ name = `OriLt1Tanum` ]-value <> ''.

          ls_conf-tanum = ls_context_details-parameters[ name = `OriLt1Tanum` ]-value.
          ls_conf-nista = ls_context_details-parameters[ name = `DesVsolm` ]-value.
          ls_conf-altme = ls_context_details-parameters[ name = `DesAltme` ]-value.
          INSERT ls_conf INTO TABLE lt_conf.

          ls_conf_exc-tanum   = ls_context_details-parameters[ name = `OriLt1Tanum` ]-value.
          ls_conf_exc-exccode = ls_context_details-parameters[ name = `AjusExcecao` ]-value.
          INSERT ls_conf_exc INTO TABLE lt_conf_exc.

          "P/ LOTE2 do App
        ELSEIF ls_context_details-parameters[ name = `OriLt2Tanum` ]-value <> ''.
          ls_conf-tanum = ls_context_details-parameters[ name = `OriLt2Tanum` ]-value.
          ls_conf-nista = ls_context_details-parameters[ name = `DesVsolm` ]-value.
          ls_conf-altme = ls_context_details-parameters[ name = `DesAltme` ]-value.
          INSERT ls_conf INTO TABLE lt_conf.

          ls_conf_exc-tanum   = ls_context_details-parameters[ name = `OriLt2Tanum` ]-value.
          ls_conf_exc-exccode = ls_context_details-parameters[ name = `AjusExcecao` ]-value.
          INSERT ls_conf_exc INTO TABLE lt_conf_exc.
        ENDIF.

        CALL FUNCTION '/SCWM/TO_CONFIRM'
          EXPORTING
            iv_lgnum       = ls_entity-orilgnum
            iv_qname       = lv_uname
            iv_update_task = abap_true
            iv_commit_work = abap_false
            it_conf        = lt_conf
            it_conf_exc    = lt_conf_exc
          IMPORTING
            et_bapiret     = lt_bapiret.

        ls_changeset_response-operation_no = <fs_ls_changeset_request>-operation_no.
        INSERT ls_changeset_response INTO TABLE ct_changeset_response.

        "MSG Teste
*        lt_bapiret = VALUE bapirettab(
*        ( type = 'E' message = `lote ` && ls_create-batchid )
*        ).

        "Retornar mensagem
        SORT lt_bapiret BY type.
        READ TABLE lt_bapiret INTO ls_bapiret WITH KEY type = lv_type_error.
        IF sy-subrc = 0.
          lv_tabix = sy-tabix.
          "ERRO
          LOOP AT lt_bapiret INTO ls_bapiret FROM lv_tabix.
            ls_entity-msgtype   = ls_bapiret-type.
            ls_entity-msgid     = ls_bapiret-id.
            ls_entity-msgnumber = ls_bapiret-number.
            ls_entity-msg       = ls_bapiret-message.

            "MSG Erro p/ o frontend
            IF ls_entity-LoteInput1 IS NOT INITIAL.
              lv_msg = ls_entity-LoteInput1 && `-` && ls_bapiret-message.
            ELSE.
              lv_msg = ls_entity-LoteInput2 && `-` && ls_bapiret-message.
            ENDIF.

            lr_container->add_message_text_only(
              iv_msg_type               = lv_type_error
              iv_msg_text               = lv_msg
              iv_is_leading_message     = abap_true
              iv_add_to_response_header = abap_true ).
*            EXIT.
          ENDLOOP.

          IF lr_container IS NOT INITIAL.
            RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
              EXPORTING
                message_container = lr_container.
          ENDIF.
        ELSE.
          SORT lt_bapiret BY type.
          READ TABLE lt_bapiret INTO ls_bapiret WITH KEY type = lv_type_success.
          IF sy-subrc = 0.
            lv_tabix = sy-tabix.
            "SUCESSO
            LOOP AT lt_bapiret INTO ls_bapiret FROM lv_tabix.
              ls_entity-msgtype   = ls_bapiret-type.
              ls_entity-msgid     = ls_bapiret-id.
              ls_entity-msgnumber = ls_bapiret-number.
              ls_entity-msg       = ls_bapiret-message.

              "MSG Sucesso p/ frontend
              IF ls_entity-LoteInput1 IS NOT INITIAL.
                lv_msg = ls_entity-LoteInput1 && `-` && ls_bapiret-message.
              ELSE.
                lv_msg = ls_entity-LoteInput2 && `-` && ls_bapiret-message.
              ENDIF.
              lr_container->add_message_text_only(
                iv_msg_type               = lv_type_success
                iv_msg_text               = lv_msg
                iv_is_leading_message     = abap_true
                iv_add_to_response_header = abap_true ).
*              EXIT.
            ENDLOOP.
          ENDIF.
        ENDIF.

        "RETORNAR resultado p/ o Frontend
        copy_data_to_ref(
          EXPORTING
            is_data = ls_entity
          CHANGING
            cr_data = ls_changeset_response-entity_data ).



        "--------------------------------------------------------------
        " CRIAR
        "--------------------------------------------------------------
      ELSEIF ls_context_details-function-name = `Criar`.

        IF ls_context_details-parameters[ name = `OriLt1Batchid` ]-value <> '00000000000000000000000000000000'.

          TRY .
              ls_create-procty        = `9999`.
              ls_create-matid         = ls_context_details-parameters[ name = `OriMatid` ]-value.
              ls_create-batchid       = ls_context_details-parameters[ name = `OriLt1Batchid` ]-value.
              ls_create-anfme         = ls_context_details-parameters[ name = `DesQuant` ]-value.
              ls_create-altme         = ls_context_details-parameters[ name = `DesUnit` ]-value.
              ls_create-vlpla         = ls_context_details-parameters[ name = `OriLgpla` ]-value.
              ls_create-owner         = ls_context_details-parameters[ name = `DesOwner` ]-value.
              ls_create-owner_role    = `BP`.
              ls_create-entitled      = ls_context_details-parameters[ name = `DesEntitled` ]-value.
              ls_create-entitled_role = `BP`.
              ls_create-single_to     = abap_true.
              ls_create-cat           = ls_context_details-parameters[ name = `OriCat` ]-value.
              ls_create-stock_doccat  = ls_context_details-parameters[ name = `DesStockDocCat` ]-value.
              ls_create-stock_docno   = ls_context_details-parameters[ name = `DesStockDocNo` ]-value.
              ls_create-stock_itmno   = ls_context_details-parameters[ name = `DesStockItmNo` ]-value.
              ls_create-squit         = abap_true.
              ls_create-nlpla         = ls_context_details-parameters[ name = `AjusNlpla` ]-value.
              INSERT ls_create INTO TABLE lt_create.
            CATCH cx_root.

          ENDTRY.

        ELSEIF ls_context_details-parameters[ name = `OriLt2Batchid` ]-value <> '00000000000000000000000000000000'.

          TRY .
              ls_create-procty        = `9999`.
              ls_create-matid         = ls_context_details-parameters[ name = `OriMatid` ]-value.
              ls_create-batchid       = ls_context_details-parameters[ name = `OriLt2Batchid` ]-value.
              ls_create-anfme         = ls_context_details-parameters[ name = `DesQuant` ]-value.
              ls_create-altme         = ls_context_details-parameters[ name = `DesUnit` ]-value.
              ls_create-vlpla         = ls_context_details-parameters[ name = `OriLgpla` ]-value.
              ls_create-owner         = ls_context_details-parameters[ name = `DesOwner` ]-value.
              ls_create-owner_role    = `BP`.
              ls_create-entitled      = ls_context_details-parameters[ name = `DesEntitled` ]-value.
              ls_create-entitled_role = `BP`.
              ls_create-single_to     = abap_true.
              ls_create-cat           = ls_context_details-parameters[ name = `OriCat` ]-value.
              ls_create-stock_doccat  = ls_context_details-parameters[ name = `DesStockDocCat` ]-value.
              ls_create-stock_docno   = ls_context_details-parameters[ name = `DesStockDocNo` ]-value.
              ls_create-stock_itmno   = ls_context_details-parameters[ name = `DesStockItmNo` ]-value.
              ls_create-squit         = abap_true.
              ls_create-nlpla         = ls_context_details-parameters[ name = `AjusNlpla` ]-value.
              INSERT ls_create INTO TABLE lt_create.
            CATCH cx_root.
              IF lr_container IS NOT INITIAL.
                "MSG Erro p/ o frontend
                lv_msg = `Erro de parâmetro da BAPI Criar`.
                lr_container->add_message_text_only(
                  iv_msg_type               = 'E'
                  iv_msg_text               = lv_msg
                  iv_is_leading_message     = 'X'
                  iv_add_to_response_header = 'X' ).

                RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
                  EXPORTING
                    message_container = lr_container.
              ENDIF.
          ENDTRY.

        ENDIF.


        CALL FUNCTION '/SCWM/TO_CREATE'
          EXPORTING
            iv_lgnum       = ls_entity-orilgnum
            iv_commit_work = abap_false
            it_create      = lt_create
          IMPORTING
            et_bapiret     = lt_bapiret.

        ls_changeset_response-operation_no = <fs_ls_changeset_request>-operation_no.
        INSERT ls_changeset_response INTO TABLE ct_changeset_response.

        "MSG Teste
*        lt_bapiret = VALUE bapirettab(
*        ( type = 'E' message = `lote ` && ls_create-batchid )
*        ).

        "Retornar mensagem
        SORT lt_bapiret BY type.
        READ TABLE lt_bapiret INTO ls_bapiret WITH KEY type = lv_type_error.
        IF sy-subrc = 0.
          lv_tabix = sy-tabix.
          "ERRO
          LOOP AT lt_bapiret INTO ls_bapiret FROM lv_tabix.
            ls_entity-msgtype   = ls_bapiret-type.
            ls_entity-msgid     = ls_bapiret-id.
            ls_entity-msgnumber = ls_bapiret-number.
            ls_entity-msg       = ls_bapiret-message.

            "MSG Erro p/ o frontend
            IF ls_entity-LoteInput1 IS NOT INITIAL.
              lv_msg = ls_entity-LoteInput1 && `-` && ls_bapiret-message.
            ELSE.
              lv_msg = ls_entity-LoteInput2 && `-` && ls_bapiret-message.
            ENDIF.

            lr_container->add_message_text_only(
              iv_msg_type               = lv_type_error
              iv_msg_text               = lv_msg
              iv_is_leading_message     = abap_true
              iv_add_to_response_header = abap_true ).
*            EXIT.
          ENDLOOP.

          IF lr_container IS NOT INITIAL.
            RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
              EXPORTING
                message_container = lr_container.
          ENDIF.
        ELSE.
          SORT lt_bapiret BY type.
          READ TABLE lt_bapiret INTO ls_bapiret WITH KEY type = lv_type_success.
          IF sy-subrc = 0.
            lv_tabix = sy-tabix.
            "SUCESSO
            LOOP AT lt_bapiret INTO ls_bapiret FROM lv_tabix.
              ls_entity-msgtype   = ls_bapiret-type.
              ls_entity-msgid     = ls_bapiret-id.
              ls_entity-msgnumber = ls_bapiret-number.
              ls_entity-msg       = ls_bapiret-message.

              "MSG Sucesso p/ frontend
              IF ls_entity-LoteInput1 IS NOT INITIAL.
                lv_msg = ls_entity-LoteInput1 && `-` && ls_bapiret-message.
              ELSE.
                lv_msg = ls_entity-LoteInput2 && `-` && ls_bapiret-message.
              ENDIF.
              lr_container->add_message_text_only(
                iv_msg_type               = lv_type_success
                iv_msg_text               = lv_msg
                iv_is_leading_message     = abap_true
                iv_add_to_response_header = abap_true ).
*              EXIT.
            ENDLOOP.
          ENDIF.
        ENDIF.

        "RETORNAR resultado p/ o Frontend
        copy_data_to_ref(
          EXPORTING
            is_data = ls_entity
          CHANGING
            cr_data = ls_changeset_response-entity_data ).



      ENDIF."Criar

    ENDLOOP.

*    IF lr_container IS NOT INITIAL AND lv_ocorreu_erro = abap_true.
*      RAISE EXCEPTION TYPE /iwbep/cx_mgw_busi_exception
*        EXPORTING
*          message_container = lr_container.
*    ENDIF.
  ENDMETHOD.
