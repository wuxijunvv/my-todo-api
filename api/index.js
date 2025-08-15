// 导入 express 模块
const express = require('express');

// 创建 express 应用实例
const app = express();

// 添加中间件，用于解析请求体中的 JSON 数据
app.use(express.json());

// 模拟数据库
let mockTodos = [
  { id: 1, description: "部署到 Vercel", done: false },
  { id: 2, description: "连接我的小程序", done: false },
];

// API 1: (GET) 获取所有待办事项
app.get('/api/todos', (req, res) => {
  res.json({ message: "列表获取成功 (来自 Vercel)", data: mockTodos });
});

// API 2: (GET) 获取单个待办事项
app.get('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const foundTodo = mockTodos.find(todo => todo.id === todoId);
  if (foundTodo) {
    res.json(foundTodo);
  } else {
    res.status(404).json({ message: "待办事项未找到" });
  }
});

// API 3: (POST) 创建一个新的待办事项
app.post('/api/todos', (req, res) => {
  const newTodoData = req.body;
  if (!newTodoData.description) {
    return res.status(400).json({ message: "description 不能为空" });
  }
  const newTodo = {
    id: mockTodos.length > 0 ? Math.max(...mockTodos.map(t => t.id)) + 1 : 1,
    description: newTodoData.description,
    done: false
  };
  mockTodos.push(newTodo);
  res.status(201).json(newTodo);
});

// API 4: (PUT) 更新一个已有的待办事项
app.put('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updates = req.body;
  const todoIndex = mockTodos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    mockTodos[todoIndex] = { ...mockTodos[todoIndex], ...updates };
    res.json(mockTodos[todoIndex]);
  } else {
    res.status(404).json({ message: "待办事项未找到" });
  }
});

// API 5: (DELETE) 删除一个待办事项
app.delete('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = mockTodos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    mockTodos.splice(todoIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "待办事项未找到" });
  }
});

// 关键改动：将 app 实例导出，以供 Vercel 调用
module.exports = app;

// 注意：app.listen() 方法已被移除