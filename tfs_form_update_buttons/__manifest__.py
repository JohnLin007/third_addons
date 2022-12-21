# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': '点击按钮自动刷新页面编辑状态',
    'author': "tianjin-suifeng",
    'category':'Base',
    'company': 'Personal Studio',
    'maintainer': 'Personal Studio',
    "version": "14.0.1.0",
    'summary': """点击按钮自动更新页面编辑状态""",
    'website': """www.tfsodoo.com""",
    'depends': ['web'],
    'description': """
        1：点击按钮自动刷新页面编辑状态
        联系方式：
            QQ：979581151
            电话/微信：18866404823
    """,
    'data': [
        'views/tfs_form_update_buttons.xml',
    ],
    'images': ['static/img.gif'],
    'qweb': [],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,
}
