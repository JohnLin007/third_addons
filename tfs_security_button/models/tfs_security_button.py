from odoo import api, fields, models, exceptions
from lxml import etree


class ResGroups(models.Model):
    _inherit = 'res.groups'

    button_groups = fields.Many2many('tfs.view.button', 'groups_button_rel', 'groups_id', 'button_id', '按钮权限')

    @api.model
    def create(self, values):
        res = super(ResGroups, self).create(values)
        if res.button_groups:
            res._add_button_groups(res.button_groups)
        return res

    def write(self, values):
        for recode in self:
            old_button = recode.button_groups
            super(ResGroups, recode).write(values)
            end_button = recode.button_groups
            if 'button_groups' in values:
                if old_button:
                    recode._delete_button_groups(old_button)
                if end_button:
                    recode._add_button_groups(end_button)
        return True

    def unlink(self):
        if self.button_groups:
            self._delete_button_groups(self.button_groups)
        return super(ResGroups, self).unlink()

    def _add_button_groups(self, buttons):
        for recode in self:
            group_xml_id = self.env['ir.model.data'].sudo().search([('res_id', '=', recode.id), ('model', '=', 'res.groups')],
                                                            limit=1)
            if not group_xml_id:
                group_name = recode._export_rows([['id']])[0][0]
            else:
                if group_xml_id:
                    group_name = '%s.%s' % (group_xml_id.module, group_xml_id.name)
                else:
                    raise exceptions.ValidationError("群组处于新建创建，请先保存群组，然后再编辑权限")
            for button in buttons:
                doc = etree.fromstring(button.view_id.arch_base)
                button_xpath = doc.xpath("//button[@name='%s']" % button.button_name)
                for line in button_xpath:
                    if line.get('groups'):
                        if not group_name in line.get('groups'):
                            line.set('groups', '%s,%s' % (line.get('groups'), group_name))
                    else:
                        line.set('groups', group_name)
                button.view_id.sudo().write({'arch': etree.tostring(doc, encoding='unicode')})

    def _delete_button_groups(self, buttons):
        for recode in self:
            group_xml_id = self.env['ir.model.data'].sudo().search([('res_id', '=', recode.id), ('model', '=', 'res.groups')],
                                                            limit=1)
            if group_xml_id:
                group_name = '%s.%s' % (group_xml_id.module, group_xml_id.name)
            else:
                raise exceptions.ValidationError("群组处于新建创建，请先保存群组，然后再编辑权限")
            for button in buttons:
                doc = etree.fromstring(button.view_id.arch_base)
                button_xpath = doc.xpath("//button[@name='%s']" % button.button_name)
                for line in button_xpath:
                    if line.get('groups'):
                        if group_name in line.get('groups'):
                            new_groups = line.get('groups').replace(group_name, '').replace(',,', ',')
                            if new_groups:
                                if new_groups[-1] == ',':
                                    new_groups = new_groups[:-1]
                                if new_groups[0] == ',':
                                    new_groups = new_groups[1:]
                                if new_groups:
                                    line.set('groups', new_groups)
                                else:
                                    line.attrib.pop('groups')
                            else:
                                line.attrib.pop('groups')
                button.view_id.sudo().write({'arch': etree.tostring(doc, encoding='unicode')})


class TfsViewButton(models.Model):
    _name = 'tfs.view.button'
    _description = '按钮'
    _order = 'model_id'

    name = fields.Char('按钮名称')
    button_name = fields.Char('方法名')
    model_id = fields.Many2one('ir.model', '模型')
    model = fields.Char('模型名称', related='model_id.model', store=True)
    view_id = fields.Many2one('ir.ui.view', '视图')
    groups = fields.Many2many('res.groups', 'groups_button_rel', 'button_id', 'groups_id', '权限')


class IrUiView(models.Model):
    _inherit = 'ir.ui.view'

    button_ids = fields.One2many('tfs.view.button', 'view_id', '按钮')

    @api.constrains('arch_base')
    def _compute_buttons(self):
        button_list = []
        for recode in self:
            button_dict = {}
            doc = etree.fromstring(recode.arch_base).xpath("//button")
            if doc:
                for address_node in doc:
                    if address_node.tag == 'button' and address_node.get('string'):
                        button_dict[address_node.get('name')] = address_node.get('string')
            for line in recode.button_ids:
                if line.button_name in button_dict:
                    line.name = button_dict[line.button_name]
                    del button_dict[line.button_name]
                else:
                    line.unlink()
            if button_dict:
                for button_name, name in button_dict.items():
                    model_id = self.env['ir.model'].search([('model', '=', recode.model)], limit=1)
                    button_list.append({
                        'name': name,
                        'button_name': button_name,
                        'model_id': model_id.id,
                        'view_id': recode.id
                    })
        if button_list:
            self.env['tfs.view.button'].create(button_list)
