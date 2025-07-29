# LED风险管理系统

基于React + TypeScript的全面风险管理系统，支持事件管理、用户审批和数据统计。

## 功能特性

- ✅ 用户注册和审批系统
- ✅ 事件管理（创建、编辑、删除）
- ✅ 审批流程（L1审批）
- ✅ 数据持久化（localStorage）
- ✅ 角色权限控制
- ✅ 年份筛选（支持全部年份）
- ✅ 响应式UI设计

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

## 快速开始

### 本地开发
```bash
npm install
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 演示账户

- **Inputter**: EMP001 (张三)
- **Approver**: EMP002 (李四)  
- **Administrator**: EMP003 (王五)

## 在线访问

访问地址：https://BonoMA.github.io/led-risk-management-system/

## 项目结构

```
src/
├── components/     # React组件
├── context/       # React Context
├── data/          # 模拟数据
├── services/      # 服务层
├── types/         # TypeScript类型定义
└── App.tsx        # 主应用组件
```

## 部署状态

✅ 代码已成功推送到GitHub
🔄 GitHub Actions正在配置中 