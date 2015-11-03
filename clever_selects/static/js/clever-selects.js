jQuery(window).load(function() {
    jQuery.fn.loadChildChoices = function(child, load_first) {
//        if (chained_id.indexOf('__prefix__') != -1) {
//            chained_id = chained_id.replace('__prefix__', jQuery(this).attr('name').split('-')[1]);
//            jQuery(this).attr('chained_id', chain<F3><F4><F3><F4>ed_id);
//        }

        var valuefield = child;
        var ajax_url = valuefield.attr('ajax_url');
        var empty_label = valuefield.attr('empty_label') || '--------';
        if(load_first && valuefield.val()){
            valuefield.parent().append('<input type="hidden" value="'+valuefield.val()+'" id="hidden_'+valuefield.attr("id")+'">');
            return true;
        }

//        console.log(ajax_url);
//        console.log({
//            field: valuefield.attr('name'),
//            parent_field: jQuery(this).attr('name'),
//            parent_value: jQuery(this).val(),
//            empty_label: empty_label
//        });

        jQuery.get(
            ajax_url,
            {
                field: valuefield.attr('name'),
                parent_field: jQuery(this).attr('name'),
                parent_value: jQuery(this).val()
            },
            function(j) {
                var options = '';
//                if(j.length > 1) {
                    options += '<option value="">' + empty_label + '</option>';
//                }
                for (var i = 0; i < j.length; i++) {
                    if(jQuery('#hidden_'+valuefield.attr('id')) && jQuery('#hidden_'+valuefield.attr('id')).val() == j[i][0]){
                        options += '<option value="' + j[i][0] + '" selected>' + j[i][1] + '</option>';
                    }else{
                        options += '<option value="' + j[i][0] + '">' + j[i][1] + '</option>';
                    }
                }
                if(j.length < 1){
                    if(valuefield.parent().parent().parent().hasClass('grp-row')){
                        valuefield.parent().parent().parent().hide();
                    }else{
                        valuefield.parent().parent().parent().parent().hide();
                    }
                }
                else{
                    if(valuefield.parent().parent().parent().hasClass('grp-row')){
                        valuefield.parent().parent().parent().show();
                    }else{
                        valuefield.parent().parent().parent().parent().show();
                    }
                }
                valuefield.html(options);
                valuefield.trigger('change');
                valuefield.trigger("liszt:updated"); // support for chosen versions < 1.0.0
                valuefield.trigger("chosen:updated"); // support for chosen versions >= 1.0.0
            },
            "json"
        );
    };

    jQuery.fn.loadAllChainedChoices = function(load_first) {
        var chained_ids = jQuery(this).attr('chained_ids').split(",");

        for (var i = 0; i < chained_ids.length; i++) {
            var chained_id = chained_ids[i];

            jQuery(this).loadChildChoices(jQuery('#' + chained_id), load_first);
        }
    };

    jQuery('.chained-parent-field').loadAllChainedChoices(true);
    jQuery('.chained-parent-field').change(function() {
        jQuery(this).loadAllChainedChoices();
    });
//    }).change(); # Use change only if really necessary. Be aware of using it in POST requests!
});
