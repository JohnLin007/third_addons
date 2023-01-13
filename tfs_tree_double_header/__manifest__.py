# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'tree上增加双层表头',
    'author': "tianjin-suifeng",
    'category':'Base',
    'company': 'Personal Studio',
    'maintainer': 'Personal Studio',
    "version": "14.0.1.0",
    'summary': """""",
    'website': """www.tfsodoo.com""",
    'depends': ['web'],
    'description': """
        1：在tree视图字段上加上属性 options="{'colspan':3,'colstring':'双层表头名称'}"
        其中colspan：表示合并几个字段，colstring：表示合并后的单元格显示内容
        联系方式：
            QQ：979581151
            电话/微信：18866404823
    """,
    'data': [
        'views/tfs_tree_double_header.xml',
    ],
    'images': ['static/img.png'],
    'qweb': [],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,
}
