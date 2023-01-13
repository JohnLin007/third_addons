odoo.define('tfs_form_update_buttons.update_buttons', function (require) {
    "use strict";


    var FormController = require('web.FormController');


    FormController.include({
        reload() {
            return this._super.apply(this, arguments).then(res => {
                const resIds = this.model.localIdsToResIds([this.handle]);
                this._updateControlPanel();
                if (this.mode == 'edit' && typeof(resIds[0])=="number"){
                    this._setMode('readonly')
                    this.updateButtons()
                }
            })
        },
    });


});