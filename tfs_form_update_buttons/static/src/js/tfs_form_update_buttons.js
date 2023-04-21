odoo.define('tfs_form_update_buttons.update_buttons', function (require) {
    "use strict";


    var FormController = require('web.FormController');
    FormController.include({
        saveRecord: async function () {
            var self = this;
            const changedFields = await this._super(...arguments);
            if (this.mode == 'edit' && !this.renderer.state.context.tfs_button) {
                if (this.__parentedParent.dialogClass) {
                    // 获取到当前数据的Class类
                    let parentNode = this.__parentedParent.__parentedParent
                    // 如果有_setValue方法的时候
                    if (parentNode._setValue && parentNode.viewType === 'list') {
                        console.log("w")
                        // 做一次setValue，完成一次onChange时间，当我点击保存的时候，让form里的tree视图刷新成新数据
                        // 方式1 这个处理方法可以兼并丢弃
                        // parentNode._setValue(parentNode.value.daa)
                        // 方式2 这个处理方法可以直接保存数据，不能兼并丢弃
                        if ($('.tab-content .tab-pane.active .oe_edit_only [name=button_sure_create]')) {
                            $('.tab-content .tab-pane.active .oe_edit_only [name=button_sure_create]').click()
                        }
                    }
                    return changedFields
                } else {
                    this._setMode('readonly')
                }
            } else {
                return changedFields
            }
        }
    });


});