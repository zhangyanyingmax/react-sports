# React 后台管理项目
## git操作
* 创建脚手架项目
  * 从create-react-app react-sports
  * 对里面内容进行修改，删除了不需要的内容，将/.idea写入.gitignore
  * 进行本地版本控制
      * git add .
      * git commit -m ''
* 创建了远程仓库
* 本地仓库和远程仓库关联
  * git remote add origin xxx
* 将本地代码提交到远程仓库保管
  * git push -u origin aster
* 本地开发需要新建dev分支
  * git checkout -b dev
* dev 开发完提交
  * git add .
  * git commit -m ''
  git push origin dev
* 全部开发完，合并所有分支到master
  * 先切换到master git checkout master
  * 合并分支 git merge dev
  
  
* 使用老师的仓库
  * git clone xxx
* 默认克隆的只有master,需要dev
  * 先进入仓库 cd xxx
  * git fetch origin dev:dev
  
## 配置antd 和 路由 react-router-dom
* 配置antd
  * 下载包，引入，写自定义主题配置，修改packge.json的命令
* 配置路由
  * 下载包，引入，渲染组件最外层使用Router，路由组件使用Route

## 实现 login 和 admin 页面跳转
* 使用Switch，切换组件，只匹配第一个路径，后面的不看，实现一个路由只加载一个组件

## 完成login登录
* 先实现静态页面，布局，使用antd
* 实现动态登录
  * input正则校验
  * 登录校验
  * 发送请求，代理服务器，在packge.json中添加"proxy":"http://localhost:5000",axios请求3000端口号
  * 要开启服务器

  
  