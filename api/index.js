// 引入依赖
require('dotenv').config(); // 确保在顶部引入，以便加载 .env 文件
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // 引入 pg 库的 Pool 对象

// --- 数据库连接配置 ---
// Pool 是管理数据库连接的推荐方式
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // 从环境变量读取数据库连接字符串
});

// --- Express 应用设置 ---
const app = express();
app.use(cors());
app.use(express.json());

// --- API 路由 ---
const apiRouter = express.Router();

// GET /todos - 获取所有待办事项
apiRouter.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json({ message: "列表获取成功 (来自 PostgreSQL)", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

// GET /todos/:id - 获取单个待办事项
apiRouter.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "待办事项未找到" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

// POST /todos - 创建新待办事项
apiRouter.post('/todos', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "description 不能为空" });
  }
  try {
    const result = await pool.query(
      'INSERT INTO todos (description) VALUES ($1) RETURNING *',
      [description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

// PUT /todos/:id - 更新待办事项
apiRouter.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { description, done } = req.body;
    // 构建动态的 UPDATE 查询
    const fields = [];
    const values = [];
    let queryIndex = 1;

    if (description !== undefined) {
        fields.push(`description = $${queryIndex++}`);
        values.push(description);
    }
    if (done !== undefined) {
        fields.push(`done = $${queryIndex++}`);
        values.push(done);
    }
    if (fields.length === 0) {
        return res.status(400).json({ message: "没有任何需要更新的字段" });
    }
    values.push(id); // 最后一个参数是 WHERE 子句的 id

    const queryString = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
    
    try {
        const result = await pool.query(queryString, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "待办事项未找到" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "服务器内部错误" });
    }
});

// DELETE /todos/:id - 删除待办事项
apiRouter.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "待办事项未找到" });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "服务器内部错误" });
    }
});


// 将所有路由挂载到 /api 路径下
app.use('/api', apiRouter);

// 导出 app 实例
module.exports = app;