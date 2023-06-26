/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { ListRenderer } from "@web/views/list/list_renderer";

patch(ListRenderer.prototype, "tfs_tree_double_header", {
    setup() {
        this._super.apply();
        this.double_header = this.get_renderHeader();
    },

    get_renderHeader: function(){
        let log = false;
        let note;
        for (note in this.allColumns){
            let options = this.allColumns[note].options;
            if (options){
                if (options.colspan > 0){
                    log = true;
                }
            }
        }
        return log;
    }
});