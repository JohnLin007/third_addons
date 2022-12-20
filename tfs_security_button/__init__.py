from odoo import api, SUPERUSER_ID
from . import models

def _account_post_init(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    view_ids = env['ir.ui.view'].search([('type','=','form')])
    view_ids._compute_buttons()

