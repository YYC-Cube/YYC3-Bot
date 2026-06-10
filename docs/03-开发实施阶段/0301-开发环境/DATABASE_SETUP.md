# 数据库配置指南

## 当前配置

您的 YYC³ 平台已配置以下数据库连接：

- **主机**: localhost
- **端口**: 3306
- **数据库名**: yyc3_yy
- **用户名**: yyc3_sas
- **密码**: yyc3_sas

## 快速开始

### 1. 确认 MySQL 服务运行

\`\`\`bash
# 检查 MySQL 服务状态
mysql --version

# 登录 MySQL
mysql -u yyc3_sas -p
# 输入密码: yyc3_sas
\`\`\`

### 2. 初始化数据库表结构

项目中包含了多个 SQL 脚本用于创建必要的数据表：

\`\`\`bash
# 执行所有数据库初始化脚本
mysql -u yyc3_sas -p yyc3_yy < scripts/create-knowledge-base-tables.sql
mysql -u yyc3_sas -p yyc3_yy < scripts/create-privacy-tables.sql
\`\`\`

或者在 MySQL 命令行中：

\`\`\`sql
USE yyc3_yy;
SOURCE scripts/create-knowledge-base-tables.sql;
SOURCE scripts/create-privacy-tables.sql;
\`\`\`

### 3. 验证数据库连接

创建一个测试脚本验证连接：

\`\`\`javascript
// test-db-connection.js
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'yyc3_sas',
      password: 'yyc3_sas',
      database: 'yyc3_yy'
    });
    
    console.log('✅ 数据库连接成功！');
    
    const [rows] = await connection.execute('SELECT DATABASE() as db');
    console.log('当前数据库:', rows[0].db);
    
    await connection.end();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
  }
}

testConnection();
\`\`\`

运行测试：

\`\`\`bash
node test-db-connection.js
\`\`\`

## 数据库表结构

### 核心表

1. **knowledge_base** - 知识库文档
2. **knowledge_categories** - 知识分类
3. **support_tickets** - 客服工单
4. **privacy_settings** - 隐私设置
5. **data_processing_logs** - 数据处理日志
6. **ai_usage_logs** - AI 使用日志

### 查看表结构

\`\`\`sql
-- 查看所有表
SHOW TABLES;

-- 查看特定表结构
DESCRIBE knowledge_base;
DESCRIBE privacy_settings;
DESCRIBE ai_usage_logs;
\`\`\`

## 常见问题

### 连接被拒绝

如果遇到 "Connection refused" 错误：

\`\`\`bash
# 启动 MySQL 服务
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL
\`\`\`

### 权限问题

如果遇到权限错误，确保用户有足够权限：

\`\`\`sql
-- 以 root 用户登录
mysql -u root -p

-- 授予权限
GRANT ALL PRIVILEGES ON yyc3_yy.* TO 'yyc3_sas'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### 字符集问题

确保数据库使用 UTF-8 字符集：

\`\`\`sql
-- 检查字符集
SHOW VARIABLES LIKE 'character_set%';

-- 修改数据库字符集
ALTER DATABASE yyc3_yy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

## 生产环境配置

在生产环境中，请：

1. **更改默认密码**
   \`\`\`sql
   ALTER USER 'yyc3_sas'@'localhost' IDENTIFIED BY 'strong_password_here';
   \`\`\`

2. **限制远程访问**
   \`\`\`sql
   -- 只允许本地连接
   CREATE USER 'yyc3_sas'@'localhost' IDENTIFIED BY 'password';
   \`\`\`

3. **启用 SSL 连接**
   \`\`\`bash
   # 在 .env.local 中添加
   DATABASE_URL=mysql://yyc3_sas:password@localhost:3306/yyc3_yy?ssl=true
   \`\`\`

4. **定期备份**
   \`\`\`bash
   # 备份数据库
   mysqldump -u yyc3_sas -p yyc3_yy > backup_$(date +%Y%m%d).sql
   
   # 恢复数据库
   mysql -u yyc3_sas -p yyc3_yy < backup_20240101.sql
   \`\`\`

## 性能优化

### 添加索引

\`\`\`sql
-- 为常用查询字段添加索引
CREATE INDEX idx_category ON knowledge_base(category_id);
CREATE INDEX idx_user ON ai_usage_logs(user_id);
CREATE INDEX idx_created ON support_tickets(created_at);
\`\`\`

### 查询优化

\`\`\`sql
-- 分析慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
\`\`\`

## 监控和维护

### 检查数据库大小

\`\`\`sql
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'yyc3_yy'
GROUP BY table_schema;
\`\`\`

### 清理旧数据

\`\`\`sql
-- 清理 30 天前的日志
DELETE FROM ai_usage_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM data_processing_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
\`\`\`

## 支持

如遇到数据库相关问题，请查看：
- MySQL 官方文档: https://dev.mysql.com/doc/
- 项目 GitHub Issues
- 联系技术支持团队
