# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': '锁定表头+字段宽度调整',
    'author': "tianjin-suifeng",
    'category':'Base',
    'company': 'Personal Studio',
    'maintainer': 'Personal Studio',
    "version": "14.0.1.0",
    'summary': """锁定表头+字段宽度调整""",
    'website': """www.tfsodoo.com""",
    'depends': ['web'],
    'description': """
        1：锁定表头
        2：解决时间、日期字段默认显示不全的问题
        3：解决many2one字段，width属性不生效的问题
        联系方式：
            QQ：979581151
            电话/微信：18866404823
    """,
    'data': [
        'views/tfs_fixed_list_and_width.xml',
    ],
    'images': ['static/img.png'],
    'qweb': [],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,
}
