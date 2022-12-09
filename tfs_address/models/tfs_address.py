from odoo import api, fields, models

class base_address_province(models.Model):
    _name = 'base.province'
    _description = '省份'

    name = fields.Char(u'省份')

class base_address_city(models.Model):
    _name = 'base.city'
    _description = '城市'

    name = fields.Char(u'城市')
    province_id = fields.Many2one('base.province',u'所属省份')

class base_address_county(models.Model):
    _name = 'base.county'
    _description = '区县'

    name = fields.Char(u'区县')
    city_id = fields.Many2one('base.city',u'所属城市')

class Company(models.Model):
    _inherit = "res.company"

    province_id = fields.Many2one('base.province', u'省')
    city_id = fields.Many2one('base.city', u'市')
    county_id = fields.Many2one('base.county', u'区')
    address = fields.Char(u'详细地址')


