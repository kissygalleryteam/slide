## slide

* 版本：2.0.2
* 教程：[http://gallery.kissyui.com/slide/2.0.2/guide/index.html](http://gallery.kissyui.com/slide/2.0.2/guide/index.html)
* demo：[http://gallery.kissyui.com/slide/2.0.2/demo/index.html](http://gallery.kissyui.com/slide/2.0.2/demo/index.html)

### 如何开发调试slide组件

#### 调试线上对slide的引用代码

先把git仓库checkout出来

	git clone git@gitlab.alibaba-inc.com:kg/slide.git

进入到对应的版本

	cd slide
	git checkout -b daily/2.0.2 origin/daily/2.0.2

将npm包装上

	tnpm install

之后就有了各种服务和grunt命令

1. `grunt demo`，基于slide目录开启一个服务，浏览器绑定本机IP:8080端口，访问`demo.com`
1. `grunt debug`，开启调试服务，绑定IP方法同上，访问一个引用了slide的页面，编辑源码加断点，刷新页面就可以直接进入断点
1. `grunt newbranch`，新生成一个最新版本的分支，为`x.y.(z+1)`
1. `grunt prepub`，预发
1. `grunt doc`，将`guide`里的文档发布，这个操作要在正确的分支上进行
1. `grunt publish`，正式发布


## changelog

### V3.0.0

兼容kissy5 by@修名

### V2.0.2

迁移 + bugfix


