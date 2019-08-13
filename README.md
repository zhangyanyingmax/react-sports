# React 后台管理项目
## git操作
* 创建脚手架项目
  * 从create-react-app react-sports
  * 对里面内容进行修改，删除了不需要的内容
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
  