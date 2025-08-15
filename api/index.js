const express = require('express');
const cors = require('cors'); // 1. 引入 cors
const app = express();

app.use(cors()); // 2. 全局使用 cors 中间件
app.use(express.json());

// 模拟数据库
let mockTodos = [
  { id: 1, description: "最终成功部署到 Vercel！", done: false },
  { id: 2, description: "连接我的小程序", done: false },
];

// 定义一个基础路由，方便管理
const apiRouter = express.Router();

// 所有的 API 都挂载在 apiRouter 上
apiRouter.get('/todos', (req, res) => {
  res.json({ message: "列表获取成功 (来自 Vercel 的最终胜利)", data: mockTodos });
});

apiRouter.get('/todos/:id', (req, res) => {
  // ... (省略逻辑)
  const todoId = parseInt(req.params.id); const foundTodo = mockTodos.find(todo => todo.id === todoId); if (foundTodo) { res.json(foundTodo); } else { res.status(404).json({ message: "待办事项未找到" }); }
});

apiRouter.post('/todos', (req, res) => {
  // ... (省略逻辑)
  const newTodoData = req.body; if (!newTodoData.description) { return res.status(400).json({ message: "description 不能为空" }); } const newTodo = { id: mockTodos.length > 0 ? Math.max(...mockTodos.map(t => t.id)) + 1 : 1, description: newTodoData.description, done: false }; mockTodos.push(newTodo); res.status(201).json(newTodo);
});

apiRouter.put('/todos/:id', (req, res) => {
  // ... (省略逻辑)
  const todoId = parseInt(req.params.id); const updates = req.body; const todoIndex = mockTodos.findIndex(todo => todo.id === todoId); if (todoIndex !== -1) { mockTodos[todoIndex] = { ...mockTodos[todoIndex], ...updates }; res.json(mockTodos[todoIndex]); } else { res.status(404).json({ message: "待办事项未找到" }); }
});

apiRouter.delete('/todos/:id', (req, res) => {
  // ... (省略逻辑)
  const todoId = parseInt(req.params.id); const todoIndex = mockTodos.findIndex(todo => todo.id === todoId); if (todoIndex !== -1) { mockTodos.splice(todoIndex, 1); res.status(204).send(); } else { res.status(404).json({ message: "待办事项未找到" }); }
});

// 关键：将所有路由挂载到 /api 路径下
app.use('/api', apiRouter);

// 导出 app 实例
module.exports = app;