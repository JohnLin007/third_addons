# coding:utf-8

{
    'name': "配置按钮权限",
    'author': "tianjin-suifeng",
    'category':'Base',
    'company': 'Personal Studio',
    'maintainer': 'Personal Studio',
    "version": "14.0.1.0",
    'summary': """按钮的权限改成配置项""",
    'website': """www.tfsodoo.com""",
    'depends': ['web'],
    'description': """
        将按钮权限改成配置项，在群组中增加按钮权限页签
        联系方式：
            QQ：979581151
            电话/微信：18866404823
    """,
    'data': [
        'views/tfs_security_button.xml',
        'security/ir.model.access.csv',
    ],
    'images': ['static/img.png'],
    'qweb': [],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,
    'post_init_hook': '_account_post_init',


}
