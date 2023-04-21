odoo.define('tfs_invisible_active.invisible_active', function (require) {
    "use strict";

    var ListController = require('web.ListController');
    var FormController = require('web.FormController');
    var core = require('web.core');
    var Dialog = require('web.Dialog');
    var BasicController = require('web.BasicController');
    var pyUtils = require('web.py_utils');
    var _t = core._t;

    FormController.include({
        _onButtonClicked: function (ev) {
            // stop the event's propagation as a form controller might have other
            // form controllers in its descendants (e.g. in a FormViewDialog)
            ev.stopPropagation();
            var self = this;
            var def;

            this._disableButtons();

            function saveAndExecuteAction () {
                return self.saveRecord(self.handle, {
                    stayInEdit: true,
                }).then(function () {
                    // we need to reget the record to make sure we have changes made
                    // by the basic model, such as the new res_id, if the record is
                    // new.
                    var record = self.model.get(ev.data.record.id);
                    return self._callButtonAction(attrs, record);
                });
            }
            function SaveAndNotify(msg_name) {
                return self.saveRecord(self.handle, {
                    stayInEdit: true,
                }).then(function () {
                    var record = self.model.get(ev.data.record.id);
                    return record;
                });
            }
            var attrs = ev.data.attrs;
            if (attrs.context){
                const context = pyUtils.eval('context', attrs.context);
                context['tfs_edit'] = self.mode
                attrs.context = context
            }else{
                attrs['context'] = {'tfs_edit':self.mode}
            }
            if (attrs.confirm) {
                def = new Promise(function (resolve, reject) {
                    Dialog.confirm(self, attrs.confirm, {
                        confirm_callback: () => {
                            self.do_action({type: 'ir.actions.act_window_close'});
                            saveAndExecuteAction();
                        },
                    }).on("closed", null, resolve);
                });
            } else if (attrs.special === 'cancel') {
                def = this._callButtonAction(attrs, ev.data.record);
            } else if (attrs.context.tfs_select_create) {
                def = SaveAndNotify(attrs.name);
            } else if (!attrs.special || attrs.special === 'save') {
                // save the record but don't switch to readonly mode
                def = saveAndExecuteAction();
            } else {
                console.warn('Unhandled button event', ev);
                return;
            }

            // Kind of hack for FormViewDialog: button on footer should trigger the dialog closing
            // if the `close` attribute is set
            def.then(function () {
                self._enableButtons();
                if (attrs.close) {
                    self.trigger_up('close_dialog');
                }
            }).guardedCatch(this._enableButtons.bind(this));
        },
        _getActionMenuItems: function (state) {
            if (!this.hasActionMenus || this.mode === 'edit') {
                return null;
            }
            const props = this._super(...arguments);
            const activeField = this.model.getActiveField(state);
            const otherActionItems = [];
            if (this.archiveEnabled && activeField in state.data) {
                if (state.data[activeField]) {
                    otherActionItems.push({
                        description: _t("Archive"),
                        callback: () => {
                            Dialog.confirm(this, _t("Are you sure that you want to archive this record?"), {
                                confirm_callback: () => this._toggleArchiveState(true),
                            });
                        },
                    });
                }
            }
            if (this.activeActions.create && this.activeActions.duplicate) {
                otherActionItems.push({
                    description: _t("Duplicate"),
                    callback: () => this._onDuplicateRecord(this),
                });
            }
            return Object.assign(props, {
                items: Object.assign(this.toolbarActions, { other: otherActionItems }),
            });
        },
        _onDiscard: function () {
            this._disableButtons();
            this._discardChanges()
                .then(this._enableButtons.bind(this))
                .guardedCatch(this._enableButtons.bind(this));
            if (this.initialState.context.tfs_action){
                this.do_action(this.initialState.context.tfs_action,
                {clear_breadcrumbs: true}
                )
            }
        },
    });
    BasicController.include({
        _deleteRecords: function (ids) {
            var self = this;
            function doIt() {
                return self.model
                    .deleteRecords(ids, self.modelName)
                    .then(self._onDeletedRecords.bind(self, ids));
            }
            if (this.confirmOnDelete) {
                const message = ids.length > 1 ?
                                _t("Are you sure you want to delete these records?") :
                                _t("Are you sure you want to delete this record?");
                Dialog.confirm(this, message, {
                    confirm_callback: () => {
                        self.do_action({type: 'ir.actions.act_window_close'});
                        doIt();
                    },
                });
            } else {
                doIt();
            }
        },
    });

    ListController.include({
        _getActionMenuItems: function (state) {
            if (!this.hasActionMenus || !this.selectedRecords.length) {
                return null;
            }
            const props = this._super(...arguments);
            const otherActionItems = [];
            var export_invisible = state.getContext().export_invisible
            if (this.isExportEnable && !export_invisible) {
                otherActionItems.push({
                    description: _t("Export"),
                    callback: () => this._onExportData()
                });
            }
            var active_invisible = state.getContext().active_invisible
            if (this.archiveEnabled && !active_invisible) {
                otherActionItems.push({
                    description: _t("Archive"),
                    callback: () => {
                        Dialog.confirm(this, _t("Are you sure that you want to archive all the selected records?"), {
                            confirm_callback: () => {
                                this.do_action({type: 'ir.actions.act_window_close'});
                                this._toggleArchiveState(true);
                            },
                        });
                    }
                }, {
                    description: _t("Unarchive"),
                    callback: () => {
                        this.do_action({type: 'ir.actions.act_window_close'});
                        this._toggleArchiveState(false);
                    },
                });
            }
            if (this.activeActions.delete) {
                otherActionItems.push({
                    description: _t("Delete"),
                    callback: () => this._onDeleteSelectedRecords()
                });
            }
            return Object.assign(props, {
                items: Object.assign({}, this.toolbarActions, { other: otherActionItems }),
                context: state.getContext(),
                domain: state.getDomain(),
                isDomainSelected: this.isDomainSelected,
            });
        },
    });
});