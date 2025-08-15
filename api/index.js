const express = require('express');
const app = express();
app.use(express.json());

let mockTodos = [
  { id: 1, description: "成功部署到 Vercel！", done: false },
  { id: 2, description: "连接我的小程序", done: false },
];

// API 1: (GET) 获取所有待办事项 - 路径改回 /todos
app.get('/todos', (req, res) => {
  res.json({ message: "列表获取成功 (来自 Vercel)", data: mockTodos });
});

// API 2: (GET) 获取单个待办事项 - 路径改回 /todos/:id
app.get('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const foundTodo = mockTodos.find(todo => todo.id === todoId);
  if (foundTodo) { res.json(foundTodo); } 
  else { res.status(404).json({ message: "待办事项未找到" }); }
});

// API 3: (POST) 创建一个新的待办事项 - 路径改回 /todos
app.post('/todos', (req, res) => {
  const newTodoData = req.body;
  if (!newTodoData.description) { return res.status(400).json({ message: "description 不能为空" }); }
  const newTodo = { id: mockTodos.length > 0 ? Math.max(...mockTodos.map(t => t.id)) + 1 : 1, description: newTodoData.description, done: false };
  mockTodos.push(newTodo);
  res.status(201).json(newTodo);
});

// API 4: (PUT) 更新一个已有的待办事项 - 路径改回 /todos/:id
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updates = req.body;
  const todoIndex = mockTodos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) { mockTodos[todoIndex] = { ...mockTodos[todoIndex], ...updates }; res.json(mockTodos[todoIndex]); } 
  else { res.status(404).json({ message: "待办事项未找到" }); }
});

// API 5: (DELETE) 删除一个待办事项 - 路径改回 /todos/:id
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = mockTodos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) { mockTodos.splice(todoIndex, 1); res.status(204).send(); } 
  else { res.status(404).json({ message: "待办事项未找到" }); }
});

// 导出 app 实例
module.exports = app;