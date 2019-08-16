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
  * git push -u origin master
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
  
* 优化axios请求方法
  * 使用axios实例对象，提前制定好一些基本路径，响应时间（一般在5-10秒）
  * 通过process.env.NODE_ENV判断当前是开发环境还是生产环境，设置不同的baseURL
  * 使用实例对象发送请求，设置拦截器（中间件），使请求成功的then方法只显示成功的数据，catch方法值返回失败的错误信息
  * 使请求失败一定进入catch方法，那么要使用promise.reject方法，创建一个失败的promise对象
  * 再封装一个登陆方法，暴露出去
  
## 登录完成页面跳转到admin
* 编程式跳转
  * this.props.history.replace('更换的路径')
  * 使用于非render方法中的函数
  * 如果在render方法中使用，返回值是undefined，会报错
* 路由跳转
  * <Redirect to="更换的路径" />；
  * 适用于render方法
  * 如果使用在非render方法中，会认为只是个组件，不会解析，直接跳过
  
## 防止用户直接访问admin页面
* 先判断用户是否登录过，判断是否有用户数据，
  * 登录成功，将数据同时存储在 内存、本地
    * 内存存储：
      * 优点：读写速度快
      * 缺点：刷新页面就没有了
    * 本地存储：
      * 优点：持久化存储
      * 缺点：读写速度慢
  * 所以，数据要同时存储在内存即本地
* 判断是否有用户数据
  * 先在内存中查找
    * 有：直接使用
    * 没有：
      * 去本地查找：
        * 有
          * 验证数据是否合法，使用验证方法，发送验证请求
            * render不会等待异步代码，需要定义状态来实现
          * 再保存到内存，再使用
        * 没有：去登录

## 登录成功跳转admin页面，完成admin基础页面布局
* antd使用layout布局
* 动态生成菜单
  * 完善刷新页面保留原页面状态
    * 保持选中项
    * 展开菜单
* 优化动态方法，将菜单生成放在constructor中，只创建一次，减少渲染次数


  
  