# coding:utf-8
{
    'name': "中国省市区县",
    'author': "tianjin-suifeng",
    'category':'Base',
    'company': 'Personal Studio',
    'maintainer': 'Personal Studio',
    "version": "14.0.1.0",
    'summary': """预设中国的省、市、区县数据""",
    'website': """www.tfsodoo.com""",
    'depends': ['base'],
    'description': """预设中国的省、市、区县数据""",
    'data': [
        'security/ir.model.access.csv',
        'security/base.province.csv',
        'security/base.city.csv',
        'security/base.county.csv',
        'views/tfs_address.xml'
    ],
    'images': ['static/img.png'],
    'qweb': [],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,

}
