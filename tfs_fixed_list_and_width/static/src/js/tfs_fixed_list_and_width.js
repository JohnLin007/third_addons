odoo.define('tfs_fixed_list_and_width.fields_width', function (require) {
    "use strict";


    var ListRenderer = require('web.ListRenderer');
    var colspan;


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
                    if (th.style.colspan){
                        colspan = true
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
                datetime: '210px',
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

        _freezeColumnWidths: function () {
            if (!this.columnWidths && this.el.offsetParent === null) {
                // there is no record nor widths to restore or the list is not visible
                // -> don't force column's widths w.r.t. their label
                return;
            }
            const thElements = [...this.el.querySelectorAll('table thead th')];
            if (!thElements.length) {
                return;
            }
            const table = this.el.getElementsByClassName('o_list_table')[0];
            let columnWidths = this.columnWidths;

            if (!columnWidths || !columnWidths.length) { // no column widths to restore
                // Set table layout auto and remove inline style to make sure that css
                // rules apply (e.g. fixed width of record selector)
                table.style.tableLayout = 'auto';

                thElements.forEach(th => {
                    th.style.width = null;
                    th.style.maxWidth = null;
                });

                // Resets the default widths computation now that the table is visible.
                this._computeDefaultWidths();

                // Squeeze the table by applying a max-width on largest columns to
                // ensure that it doesn't overflow
                columnWidths = this._squeezeTable();
            }

            thElements.forEach((th, index) => {
                // Width already set by default relative width computation
                if (!th.style.width) {
                    if (!columnWidths[index]){
                        th.style.width =th.style.minWidth;
                    }else{
                        th.style.width = `${columnWidths[index]}px`;
                    }
                }
            });
            // Set the table layout to fixed
            if (colspan || this.state.context.tableLayout){
                table.style.tableLayout = 'auto';
            }else{
                table.style.tableLayout = 'flex';
            }

        },

        _computeDefaultWidths: function () {
            const isListEmpty = !this._hasVisibleRecords(this.state);
            const relativeWidths = [];
            this.columns.forEach(column => {
                const th = this._getColumnHeader(column);
                if (th.offsetParent === null) {
                    relativeWidths.push(false);
                } else {
                    const width = this._getColumnWidth(column);
                    if (width.match(/[a-zA-Z]/)) { // absolute width with measure unit (e.g. 100px)
                        if (isListEmpty) {
                            th.style.width = width;
                        } else {
                            // If there are records, we force a min-width for fields with an absolute
                            // width to ensure a correct rendering in edition
                            th.style.minWidth = width;
                        }
                        relativeWidths.push(false);
                    } else { // relative width expressed as a weight (e.g. 1.5)
                        relativeWidths.push(parseFloat(width, 10));
                    }
                }
            });

            // Assignation of relative widths
            if (isListEmpty) {
                const totalWidth = this._getColumnsTotalWidth(relativeWidths);
                for (let i in this.columns) {
                    if (relativeWidths[i]) {
                        const th = this._getColumnHeader(this.columns[i]);
                        if (totalWidth >= 7){
                            th.style.width = '100px';
                        }else{
                            th.style.width = (relativeWidths[i] / totalWidth * 100) + '%';
                        }
                    }
                }
                // Manualy assigns trash icon header width since it's not in the columns
                const trashHeader = this.el.getElementsByClassName('o_list_record_remove_header')[0];
                if (trashHeader) {
                    trashHeader.style.width = '32px';
                }
            }
        },
    });



});