# LED 风险管理系统

这是一个基于BRD.md要求开发的LED（损失事件数据库）风险管理系统原型。该系统实现了完整的操作风险管理功能，包括事件报告、审批流程、IAM管理等。

## 功能特性

### 核心功能
- **事件管理**: 完整的事件输入、编辑、查看功能
- **审批流程**: 支持两级审批流程（L1和L2）
- **IAM管理**: 问题和行动计划管理
- **角色权限**: 支持Inputter、Approver、Administrator三种角色
- **仪表板**: 实时统计和可视化展示

### 用户角色
1. **Inputter (输入者)**
   - 创建和编辑事件
   - 查看自己创建的事件
   - 管理IAM项目

2. **Approver (审批者)**
   - 审批L1级别的事件
   - 查看部门事件
   - 生成报告

3. **Administrator (管理员)**
   - 完整系统访问权限
   - 审批L2级别的事件
   - 系统配置管理

## 技术栈

- **前端**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **路由**: React Router DOM

## 安装和运行

### 前置要求
- Node.js 16+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

## 使用说明

### 登录系统
系统提供了三个演示用户：

1. **张三 (EMP001)** - Inputter角色
2. **李四 (EMP002)** - Approver角色  
3. **王五 (EMP003)** - Administrator角色

您也可以使用任意员工ID登录，系统会自动分配Inputter角色。

### 主要功能

#### 1. 事件管理
- 创建新事件：点击"新建事件"按钮
- 查看事件列表：在"事件列表"页面
- 编辑事件：点击事件行中的编辑按钮
- 审批事件：根据角色权限进行审批

#### 2. IAM管理
- 创建IAM项目：点击"新建IAM项目"按钮
- 管理行动计划：设置目标日期、负责人、进度等
- 跟踪状态：查看项目完成情况

#### 3. 仪表板
- 查看统计信息：总事件数、开放事件、损失统计等
- 图表展示：按月份和原因统计的事件分布

## 项目结构

```
src/
├── components/          # React组件
│   ├── Dashboard.tsx   # 仪表板
│   ├── IncidentForm.tsx # 事件表单
│   ├── IncidentList.tsx # 事件列表
│   ├── IAMManagement.tsx # IAM管理
│   ├── Layout.tsx      # 布局组件
│   └── Login.tsx       # 登录组件
├── context/            # React上下文
│   └── AuthContext.tsx # 认证上下文
├── data/              # 模拟数据
│   └── mockData.ts    # 模拟数据文件
├── types/             # TypeScript类型定义
│   └── index.ts       # 类型定义
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 功能实现对照

### FR-LED-001: 事件输入表单 ✅
- 完整的表单验证
- 必填字段检查
- 日期关系验证
- 数值验证

### FR-WF-001: 审批流程 ✅
- 两级审批机制
- 状态管理
- 权限控制

### FR-MON-001: 监控功能 ✅
- 实时统计
- 图表展示
- 数据筛选

### FR-NOT-001: 通知功能 ✅
- 模拟邮件通知
- 状态变更提醒

## 开发说明

### 添加新功能
1. 在`src/components/`中创建新组件
2. 在`src/types/index.ts`中定义类型
3. 在`src/data/mockData.ts`中添加模拟数据
4. 更新路由配置

### 样式定制
- 使用Tailwind CSS类名
- 自定义样式在`src/index.css`中定义
- 组件级样式使用CSS模块或内联样式

### 数据管理
- 当前使用模拟数据
- 可以轻松替换为真实API
- 支持本地存储扩展

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。 