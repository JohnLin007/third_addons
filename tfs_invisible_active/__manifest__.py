# coding:utf-8

{
    'name': "隐藏归档按钮、将编辑状态传到后台、confirm弹窗确认报错快速关闭",
    'author': "tianjin-suifeng",
    'category':'Base',
    'company': 'Personal Studio',
    'maintainer': 'Personal Studio',
    "version": "14.0.1.0",
    'summary': """隐藏归档按钮、将编辑状态传到后台、confirm弹窗确认报错快速关闭""",
    'website': """www.tfsodoo.com""",
    'depends': ['web'],
    'description': """
        1：在context中添加{active_invisible:True}参数可以隐藏归档按钮，添加{export_invisible:True}参数可以隐藏导出按钮
        2：将当前页面是只读还是编辑状态通过context传到后台，参数为tfs_edit
        3：confirm的确认弹窗，点击确认后如果弹出错误提示，仍然可以关闭当前的确认弹窗
        联系方式：
            QQ：979581151
            电话/微信：18866404823
    """,
    'data': [
        'views/tfs_invisible_active.xml',
    ],
    'images': ['static/img.png'],
    'qweb': [],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,

}
