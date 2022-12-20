odoo.define('tfs_fixed_list_and_width.fields_width', function (require) {
    "use strict";


    var ListRenderer = require('web.ListRenderer');


    ListRenderer.include({
        _squeezeTable: function () {
            const table = this.el.getElementsByClassName('o_list_table')[0];
            table.classList.add('o_list_computing_widths');

            const thead = table.getElementsByTagName('thead')[0];
            const thElements = [...thead.getElementsByTagName('th')];
            const columnWidths = thElements.map(th => th.offsetWidth);
            const getWidth = th => columnWidths[thElements.indexOf(th)] || 0;
            const getTotalWidth = () => thElements.reduce((tot, th, i) => tot + columnWidths[i], 0);
            const shrinkColumns = (columns, width) => {
                let thresholdReached = false;
                columns.forEach(th => {
                    const index = thElements.indexOf(th);
                    let maxWidth = columnWidths[index] - Math.ceil(width / columns.length);
                    if (th.style.minWidth){
                        maxWidth = Math.max(maxWidth, th.style.minWidth)
                    }
                    if (maxWidth < 92) { // prevent the columns from shrinking under 92px (~ date field)
                        maxWidth = 92;
                        thresholdReached = true;
                    }
                    th.style.maxWidth = `${maxWidth}px`;
                    columnWidths[index] = maxWidth;
                });
                return thresholdReached;
            };
            const sortedThs = [...thead.querySelectorAll('th:not(.o_list_button)')]
                .sort((a, b) => getWidth(b) - getWidth(a));
            const allowedWidth = table.parentNode.offsetWidth;

            let totalWidth = getTotalWidth();
            let stop = false;
            let index = 0;
            while (totalWidth > allowedWidth && !stop) {
                // Find the largest columns
                index++;
                const largests = sortedThs.slice(0, index);
                while (getWidth(largests[0]) === getWidth(sortedThs[index])) {
                    largests.push(sortedThs[index]);
                    index++;
                }

                const nextLargest = sortedThs[index]; // largest column when omitting those in largests
                const totalToRemove = totalWidth - allowedWidth;
                const canRemove = (getWidth(largests[0]) - getWidth(nextLargest)) * largests.length;
                stop = shrinkColumns(largests, Math.min(totalToRemove, canRemove));

                totalWidth = getTotalWidth();
            }

            table.classList.remove('o_list_computing_widths');

            return columnWidths;
        },

        _getColumnWidth: function (column) {
            if (column.attrs.width) {
                return column.attrs.width;
            }
            const fieldsInfo = this.state.fieldsInfo.list;
            const name = column.attrs.name;
            if (!fieldsInfo[name]) {
                // Unnamed columns get default value
                return '1';
            }
            const widget = fieldsInfo[name].Widget.prototype;
            if ('widthInList' in widget) {
                return widget.widthInList;
            }
            const field = this.state.fields[name];
            if (!field) {
                // this is not a field. Probably a button or something of unknown
                // width.
                return '1';
            }
            const fixedWidths = {
                boolean: '70px',
                date: '120px',
                datetime: '199px',
                float: '92px',
                integer: '74px',
                monetary: '104px',
            };
            let type = field.type;
            if (fieldsInfo[name].widget in fixedWidths) {
                type = fieldsInfo[name].widget;
            }
            return fixedWidths[type] || '1';
        },
    });


});