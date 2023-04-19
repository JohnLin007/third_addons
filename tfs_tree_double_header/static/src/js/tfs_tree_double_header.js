odoo.define('tfs_tree_double_header.double_header', function (require) {
    "use strict";


    var ListRenderer = require('web.ListRenderer');

    ListRenderer.include({
        _renderHeader: function () {
            var log;
            let note;
            var $thead;
            for (note in this.columns){
                const attrs = this.columns[note].attrs;
                if (attrs.options){
                    var options = eval("(" + attrs.options.replace(/True/g,true).replace(/False/g,false) + ")")
                    if (options.colspan > 0){
                        log = true;
                    }
                }
            }
            var $tr = $('<tr>')

            if (!log){
                $tr.append(_.map(this.columns, this._renderHeaderCell.bind(this)));
                if (this.hasSelectors) {
                    $tr.prepend(this._renderSelector('th'));
                }
                $thead = $('<thead>').append($tr);
            }else{
                var $row = $('<tr>')
                var row_num = 0;
                var colspan = 0;
                var colstring='';
                for (note in this.columns){
                    var th = this._renderHeaderCell(this.columns[note])
                    const attrs = this.columns[note].attrs;
                    if (attrs.options){
                        var options = eval("(" + attrs.options.replace(/True/g,true).replace(/False/g,false) + ")")
                        if (options.colspan > 0){
                            row_num = options.colspan;
                            colspan = options.colspan;
                            colstring = options.colstring
                        }
                    }
                    if (row_num > 0){
                        if (row_num == colspan){
                            var row_th = $('<th>').attr('colspan',colspan).append('<span>'+colstring+'</span>');
                            row_th[0].style['text-align'] = "center";
                            row_th[0].style['width'] = attrs.width;
                            row_th[0].style['colspan'] = colspan;
                            $row.append(row_th)
                        }
                        $tr.append(th)
                        row_num -= 1
                    }else{
                        th.attr('rowspan',2);
                        th[0].style['vertical-align'] = "inherit";
                        $row.append(th);
                    }
                }
                if (this.hasSelectors) {
                    var first_th = this._renderSelector('th');
                    first_th.attr('rowspan',2)
                    first_th[0].style['vertical-align'] = "inherit";
                    $row.prepend(first_th);
                }
                $thead = $('<thead>').append($row).append($tr);
            }
            if (this.addTrashIcon) {
                $thead.find('tr').append($('<th>', {class: 'o_list_record_remove_header'}));
            }
            return $thead

        },
    })

});