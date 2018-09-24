$.fn.laravelValidator = function (options) {
    /*
     * Check if element is a form
     */
    var $form = $(this);
    if (!$form.is('form')) {
        console.error('The selector does not points to a <form> element');
        return false;
    }

    /*
     * Display and hidden input error messages
     */
    var hideInputErrorMessages = function () {
        /*
         * <span class="help-block">:message</span>
         * .has-error
         */
        $form.find('.has-error').each(function () {
            $(this).removeClass('has-error');
        });
        $form.find('.help-block').each(function () {
            $(this).hide();
        });
    };

    var showInputErrorMessages = function (field, errors) {
        // check if input exists, if not, a notify error is displayed
        var $form_group = $form.find('[name="' + field + '"]');
        if ($form_group.length === 0) {
            alertify.notify(errors.join('<br>'), 'error');
            return;
        }

        //add the class has-error to .form-group
        while ($form_group.hasClass('form-group') === false) {
            $form_group = $form_group.parent();
        }
        $form_group.addClass('has-error');

        // create element span.has-error if not exists
        if (errors.length > 0) {
            var $html_errors = errors.length === 1 ? errors.join() : '<ul><li>' + errors.join('</li><li>') + '</li></ul>';
            if ($form_group.find('.help-block').length === 0) {
                $form_group.find('[name="' + field + '"]').after('<span class="help-block">' + $html_errors + '</span>');
            } else {
                $form_group.find('.help-block').html($html_errors).show();
            }
        }

    };

    /*
     * Ajax methods
     */
    var ajaxBeforeSend = function (jqXHR, settings) {
        $form.LoadingOverlay("show");
        hideInputErrorMessages();
    };
    var ajaxSuccess = function (data, textStatus, jqXHR) {
        /*
         * The success show some feedback
         */
        if (data.hasOwnProperty('type')) {
            var type = data[data.type];

            /*
             * *****************
             * JavaScript
             * *****************
             * E.g.
             * <code>
             *  return response()->json([
             *       'type' => 'javascript',
             *       'javascript' => "alert('alert displayed')",
             *   ]);
             * </code>
             */
            if (data.type === 'javascript') {
                (new Function(type))();
            }


            /*
             * *****************
             * Alert
             * *****************
             * E.g.
             * <code>
             *  return response()->json([
             *       'type' => 'alert', //required to identify
             *       'alert' => [
             *           'title' => 'Header', //optional
             *           'message' => '<p>HTML allowed<p>', //required
             *           
             *           // Check documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
             *           'callback'=> 'alertify.success('Ok');',  //optional
             *       ],
             *   ]);
             * </code>
             */
            if (data.type === 'alert') {

                alertify.alert(
                        type.hasOwnProperty('title') ? type.title : '',
                        type.message,
                        type.hasOwnProperty('callback') ? new Function(type.callback) : function () {},
                        );
            }

            /*
             * *****************
             * Notify
             * *****************
             * E.g.
             * <code>
             *  return response()->json([
             *       'type' => 'notify',
             *       'notify' => [
             *           'message' => '<p>HTML allowed<p>',
             *           'type' => 'warning', // warning, success, message, error
             *           'wait'=> 5,
             *           
             *           // Check documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
             *           'callback'=> 'console.log('dismissed');'
             *       ],
             *   ]);
             * </code>
             */
            if (data.type === 'notify') {
                alertify.notify(
                        type.message,
                        type.type,
                        type.hasOwnProperty('wait') ? type.wait : 5,
                        type.hasOwnProperty('callback') ? new Function(type.callback) : function () {},
                        );
            }

            /*
             * *****************
             * Bootstrap v3.3.7 Modal
             * *****************
             * E.g.
             * <code>
             *  return response()->json([
             *       'type' => 'bs3.modal',
             *       'bs3.modal' => [
             *          'title'=> 'Modal title',
             *          'content'=> '<p>HTML allowed<p>',
             *          'closeIcon'=> true, // default: true
             *          'closeButton'=> true, // default: true
             *          'buttons'=> [
             *              [
             *                  'text'=> 'I agree', 
             *                  'id'=> uniqid(), 
             *                  
             *                  // Check documentation https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
             *                  'click'=> "alert('You did agree with terms!');",
             *              ],
             *          ],
             *       ],
             *   ]);
             * </code>
             */
            if (data.type === 'bs3.modal') {
                /* 
                 * Code $.utils and $.fn.dialogue from
                 * https://stackoverflow.com/a/40184066/4830771
                 */
                $.utils = {
                    createUUID: function ()
                    {
                        var d = new Date().getTime();
                        if (window.performance && typeof window.performance.now === "function")
                        {
                            d += performance.now(); //use high-precision timer if available
                        }
                        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
                        {
                            var r = (d + Math.random() * 16) % 16 | 0;
                            d = Math.floor(d / 16);
                            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                        });
                        return uuid;
                    }
                };
                $.fn.dialogue = function (options) {
                    var defaults = {
                        title: "", content: $("<p />"),
                        closeIcon: false,
                        id: $.utils.createUUID(),
                        open: function () { },
                        buttons: []
                    };
                    var settings = $.extend(true, {}, defaults, options);

                    // create the DOM structure
                    var $modal = $("<div />").attr("id", settings.id).attr("role", "dialog").addClass("modal fade")
                            .append($("<div />").addClass("modal-dialog")
                                    .append($("<div />").addClass("modal-content")
                                            .append($("<div />").addClass("modal-header")
                                                    .append($("<h4 />").addClass("modal-title").text(settings.title)))
                                            .append($("<div />").addClass("modal-body")
                                                    .append(settings.content))
                                            .append($("<div />").addClass("modal-footer")
                                                    )
                                            )
                                    );
                    $modal.shown = false;
                    $modal.dismiss = function () {
                        // loop until its shown
                        // this is only because you can do $.fn.alert("utils.js makes this so easy!").dismiss(); in which case it will try to remove it before its finished rendering
                        if (!$modal.shown)
                        {
                            window.setTimeout(function ()
                            {
                                $modal.dismiss();
                            }, 50);
                            return;
                        }

                        // hide the dialogue
                        $modal.modal("hide");
                        // remove the blanking
                        $modal.prev().remove();
                        // remove the dialogue
                        $modal.empty().remove();

                        $("body").removeClass("modal-open");
                    };

                    if (settings.closeIcon)
                        $modal.find(".modal-header").prepend($("<button />").attr("type", "button").addClass("close").html("&times;").click(function () {
                            $modal.dismiss();
                        }));

                    // add the buttons
                    var $footer = $modal.find(".modal-footer");
                    for (var i = 0; i < settings.buttons.length; i++) {
                        (function (btn) {
                            $footer.prepend($("<button />")
                                    .attr($.extend({}, {
                                        class: "btn btn-default",
                                        id: $.utils.createUUID(),
                                        type: 'button'
                                    }, btn.attr))
                                    .html(btn.text)
                                    .click(function () {
                                        btn.click($modal);
                                    }));
                        })(settings.buttons[i]);
                    }

                    settings.open($modal);

                    $modal.on('shown.bs.modal', function (e) {
                        $modal.shown = true;
                    });
                    // show the dialogue
                    $modal.modal("show");

                    return $modal;
                };

                var dialogue_settings = {
                    attr: {
                        id: $.utils.createUUID(),
                        class: 'btn btn-primary'
                    },
                    title: type.title,
                    content: $(type.content),
                    closeIcon: type.hasOwnProperty('closeIcon') ? type.closeIcon : true,
                    buttons: []
                };
                if (type.hasOwnProperty('id')) {
                    dialogue_settings.id = type.id;
                }
                if (type.hasOwnProperty('closeButton') && type.closeButton) {
                    dialogue_settings.buttons.push({
                        text: "Fechar",
                        id: $.utils.createUUID(),
                        click: new Function('$modal', '$modal.dismiss();')
                    });
                }
                if (type.hasOwnProperty('buttons') && type.buttons.constructor === Array) {
                    type.buttons.forEach(function (value) {
                        dialogue_settings.buttons.push({
                            text: value.text,
                            attr: value.hasOwnProperty('attr') ? value.attr : {class: "btn btn-default", id: $.utils.createUUID(), type: 'button'},
                            click: value.hasOwnProperty('click') ? new Function('$modal', value.click) : new Function('$modal', '$modal.dismiss();')
                        });
                    });
                }
                $.fn.dialogue(dialogue_settings);
            }
        }
    };
    var ajaxError = function (jqXHR, textStatus, errorThrown, d, e) {
        var status = Number.parseInt(jqXHR.status);
        if (status === 422) {
            var data = jqXHR.responseJSON;
            var notification = alertify.notify(data.message === 'The given data was invalid.' ? 'Os dados informados são inválidos' : data.message, 'error');
            $.each(data.errors, showInputErrorMessages);
        } else {
            alertify.alert('HTTP ERROR ' + jqXHR.status, jqXHR.statusText);
        }
    };
    var ajaxComplete = function (event, jqXHR, ajaxOptions) {
        $form.LoadingOverlay("hide");
    };

    // Initial ajax settings
    var init_options = {
        url: $form.attr('action') === undefined ? location.href : $form.attr('action'),
        data: $form.serializeArray(),
        method: $form.attr('method') === undefined ? 'POST' : $form.attr('method'),
        headers: {
            'X-CSRF-TOKEN': (function ($form) {
                if ($('meta[name="csrf-token"]').attr('content') === undefined) {
                    if ($form.find('[name="_token"]').length > 0) {
                        return $form.find('[name="_token"]').val();
                    } else {
                        return '';
                    }
                } else {
                    return $('meta[name="csrf-token"]').attr('content');
                }
            }($form)),
            Accept: 'application/json',
            dataType: 'json',
        },
        //cache: false,
        beforeSend: ajaxBeforeSend,
        success: ajaxSuccess,
        error: ajaxError,
        complete: ajaxComplete
    };

    var options = typeof options === 'object' ? options : {};

    // SUBMISSÃO DO FORMULÁRIO
    $form.on('submit', function (e) {
        e.preventDefault();
        var config = $.extend({}, init_options, {data: $(this).serializeArray()}, options);
        $.ajax(config);
    });
};
