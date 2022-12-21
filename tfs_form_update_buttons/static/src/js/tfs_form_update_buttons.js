odoo.define('tfs_form_update_buttons.update_buttons', function (require) {
    "use strict";


    var FormController = require('web.FormController');


    FormController.include({
        reload() {
            return this._super.apply(this, arguments).then(res => {
                this._updateControlPanel();
                if (this.mode == 'edit'){
                    this.mode = 'readonly';
                    this.updateButtons()
                }
            })
        },
    });


});