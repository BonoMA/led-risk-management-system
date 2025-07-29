# GitHub Pages 部署指南

## 概述
本指南将帮助您将LED风险管理系统部署到GitHub Pages，使其可以通过互联网访问。

## 部署步骤

### 1. 创建GitHub仓库
1. 登录GitHub账户
2. 点击右上角的"+"号，选择"New repository"
3. 仓库名称设置为：`led-risk-management-system`
4. 选择"Public"（公开）
5. 不要初始化README文件
6. 点击"Create repository"

### 2. 上传代码到GitHub
在本地项目目录中执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: LED Risk Management System"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/led-risk-management-system.git

# 推送到GitHub
git push -u origin main
```

### 3. 启用GitHub Pages
1. 在GitHub仓库页面，点击"Settings"标签
2. 在左侧菜单中找到"Pages"
3. 在"Source"部分，选择"GitHub Actions"
4. 系统会自动使用我们配置的GitHub Actions工作流

### 4. 配置GitHub Actions
项目已经包含了`.github/workflows/deploy.yml`文件，它会：
- 在每次推送到main分支时自动构建
- 将构建结果部署到GitHub Pages

### 5. 访问部署的网站
部署完成后，您可以通过以下URL访问系统：
```
https://你的用户名.github.io/led-risk-management-system/
```

## 功能特性

### 用户注册系统
- 新用户可以通过注册页面申请账户
- 管理员可以审批用户注册申请
- 支持不同角色：Inputter、Approver、Administrator

### 事件管理
- 新建事件自动提交L1审批
- 审批员可以进行事件审批
- 支持事件编辑和删除

### 数据持久化
- 使用localStorage存储数据
- 支持数据导入导出
- 数据在浏览器中持久保存

## 系统角色说明

### Inputter (录入员)
- 可以创建新事件
- 可以编辑自己创建的事件
- 可以查看自己部门的事件

### Approver (审批员)
- 可以审批L1级别的事件
- 可以查看自己部门的事件
- 可以管理IAM项目

### Administrator (管理员)
- 可以审批所有级别的申请
- 可以管理所有用户
- 可以查看所有数据
- 可以管理用户注册申请

## 演示账户
系统包含以下演示账户：
- 张三 (Inputter) - EMP001
- 李四 (Approver) - EMP002  
- 王五 (Administrator) - EMP003

## 注意事项

1. **数据存储**：当前版本使用localStorage存储数据，数据仅保存在用户浏览器中
2. **安全性**：这是一个演示系统，生产环境需要添加更多安全措施
3. **浏览器兼容性**：建议使用现代浏览器（Chrome、Firefox、Safari、Edge）
4. **移动端支持**：系统已适配移动端，但建议在桌面端使用以获得最佳体验

## 故障排除

### 部署失败
1. 检查GitHub Actions日志
2. 确保所有依赖都已正确安装
3. 检查构建输出是否有错误

### 页面无法访问
1. 确认GitHub Pages已启用
2. 检查仓库设置中的Pages配置
3. 等待几分钟让部署完成

### 功能异常
1. 清除浏览器缓存
2. 检查浏览器控制台是否有错误
3. 确认使用的是HTTPS协议访问

## 后续改进建议

1. **后端集成**：添加真实的后端API和数据库
2. **用户认证**：实现更安全的用户认证系统
3. **数据备份**：添加云端数据备份功能
4. **通知系统**：添加邮件通知功能
5. **审计日志**：添加详细的操作日志
6. **多语言支持**：添加英文等其他语言支持

## 联系支持
如果在部署过程中遇到问题，请：
1. 检查GitHub Actions日志
2. 查看浏览器控制台错误信息
3. 确认所有步骤都已正确执行