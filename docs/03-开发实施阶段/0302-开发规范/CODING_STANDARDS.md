# YYC³ 代码规范

## 目录

- [通用规范](#通用规范)
- [TypeScript 规范](#typescript-规范)
- [React 组件规范](#react-组件规范)
- [样式规范](#样式规范)
- [API 路由规范](#api-路由规范)
- [测试规范](#测试规范)
- [Git 提交规范](#git-提交规范)

## 通用规范

### 文件命名

- **组件文件**: kebab-case，如 `ai-analytics-chat.tsx`
- **工具函数**: kebab-case，如 `data-privacy.ts`
- **类型文件**: kebab-case，如 `workflow-types.ts`
- **常量文件**: UPPER_SNAKE_CASE，如 `API_CONSTANTS.ts`

### 目录结构

\`\`\`
feature/
├── components/          # 功能组件
├── hooks/              # 自定义 Hooks
├── lib/                # 业务逻辑
├── types/              # 类型定义
└── utils/              # 工具函数
\`\`\`

### 代码组织

1. **导入顺序**:
   \`\`\`typescript
   // 1. React 和 Next.js
   import React from 'react';
   import { useRouter } from 'next/navigation';
   
   // 2. 第三方库
   import { motion } from 'framer-motion';
   import { useChat } from '@ai-sdk/react';
   
   // 3. 内部组件
   import { Button } from '@/components/ui/button';
   
   // 4. 工具函数和类型
   import { cn } from '@/lib/utils';
   import type { WorkflowStep } from '@/types';
   
   // 5. 样式
   import './styles.css';
   \`\`\`

2. **导出顺序**:
   \`\`\`typescript
   // 1. 类型导出
   export type { Props };
   
   // 2. 常量导出
   export const CONSTANT = 'value';
   
   // 3. 函数导出
   export function helper() {}
   
   // 4. 默认导出
   export default Component;
   \`\`\`

## TypeScript 规范

### 类型定义

\`\`\`typescript
// ✅ 使用 interface 定义对象类型
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ 使用 type 定义联合类型和工具类型
type Status = 'pending' | 'completed' | 'failed';
type PartialUser = Partial<User>;

// ✅ 使用泛型提高复用性
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// ❌ 避免使用 any
// const data: any = ...;

// ✅ 使用 unknown 或具体类型
const data: unknown = ...;
\`\`\`

### 类型注解

\`\`\`typescript
// ✅ 函数参数和返回值必须有类型
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 使用类型推断
const count = 10; // 自动推断为 number

// ✅ 复杂类型显式声明
const config: WorkflowConfig = {
  steps: [],
  timeout: 5000
};
\`\`\`

### 空值处理

\`\`\`typescript
// ✅ 使用可选链
const userName = user?.profile?.name;

// ✅ 使用空值合并
const displayName = userName ?? 'Anonymous';

// ✅ 类型守卫
if (user && user.email) {
  sendEmail(user.email);
}
\`\`\`

## React 组件规范

### 组件结构

\`\`\`typescript
'use client'; // 客户端组件标记

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 1. 类型定义
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
  className?: string;
}

// 2. 常量定义
const ANIMATION_DURATION = 0.3;

// 3. 组件定义
export function Component({ title, onSubmit, className }: ComponentProps) {
  // 3.1 Hooks
  const [isLoading, setIsLoading] = React.useState(false);
  
  // 3.2 派生状态
  const isDisabled = isLoading || !title;
  
  // 3.3 事件处理函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(new FormData(e.currentTarget));
    } finally {
      setIsLoading(false);
    }
  };
  
  // 3.4 渲染
  return (
    <motion.div
      className={cn('container', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATION }}
    >
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        <Button type="submit" disabled={isDisabled}>
          {isLoading ? '提交中...' : '提交'}
        </Button>
      </form>
    </motion.div>
  );
}
\`\`\`

### 组件命名

\`\`\`typescript
// ✅ 使用 PascalCase
export function DataAnalyticsChat() {}

// ✅ 使用描述性名称
export function AICustomerSupportChat() {}

// ❌ 避免缩写
// export function DACSC() {}
\`\`\`

### Props 设计

\`\`\`typescript
// ✅ 使用 interface 定义 Props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// ✅ 提供默认值
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick
}: ButtonProps) {
  // ...
}

// ✅ 使用 children 而不是 render props（除非必要）
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
\`\`\`

### Hooks 使用

\`\`\`typescript
// ✅ 自定义 Hook 以 use 开头
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// ✅ 依赖数组完整
useEffect(() => {
  fetchData(userId);
}, [userId]); // 包含所有依赖

// ❌ 避免在循环或条件中使用 Hooks
// if (condition) {
//   useEffect(() => {}, []);
// }
\`\`\`

## 样式规范

### Tailwind CSS

\`\`\`typescript
// ✅ 使用 cn 工具函数合并类名
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />

// ✅ 使用语义化类名
<div className="flex items-center justify-between gap-4" />

// ✅ 响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />

// ✅ 使用设计令牌
<div className="bg-background text-foreground" />

// ❌ 避免内联样式
// <div style={{ color: 'red' }} />
\`\`\`

### 动画

\`\`\`typescript
// ✅ 使用 Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// ✅ 定义可复用的动画变体
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.div variants={fadeInUp} />
\`\`\`

## API 路由规范

### Route Handler 结构

\`\`\`typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 1. 请求验证 Schema
const requestSchema = z.object({
  data: z.string(),
  options: z.object({
    limit: z.number().optional()
  }).optional()
});

// 2. 类型定义
type RequestBody = z.infer<typeof requestSchema>;

// 3. 业务逻辑函数
async function processData(data: string): Promise<Result> {
  // 实现逻辑
}

// 4. Route Handler
export async function POST(request: NextRequest) {
  try {
    // 4.1 解析请求体
    const body = await request.json();
    
    // 4.2 验证数据
    const validatedData = requestSchema.parse(body);
    
    // 4.3 处理业务逻辑
    const result = await processData(validatedData.data);
    
    // 4.4 返回响应
    return NextResponse.json({ data: result });
  } catch (error) {
    // 4.5 错误处理
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('[API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
\`\`\`

### 流式响应

\`\`\`typescript
import { streamText } from 'ai';

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  
  const result = streamText({
    model: 'openai/gpt-4.1',
    messages,
    onFinish: async ({ text, usage }) => {
      // 记录使用情况
      await logAIUsage({ text, usage });
    }
  });
  
  return result.toUIMessageStreamResponse();
}
\`\`\`

## 测试规范

### 单元测试

\`\`\`typescript
// component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
\`\`\`

### 集成测试

\`\`\`typescript
// api.test.ts
import { POST } from './route';

describe('POST /api/analytics', () => {
  it('returns analysis results', async () => {
    const request = new Request('http://localhost/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ messages: [...] })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data');
  });
});
\`\`\`

## Git 提交规范

### 提交消息格式

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### 类型 (type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链更新

### 示例

\`\`\`
feat(analytics): 添加数据导出功能

- 支持 CSV 和 JSON 格式导出
- 添加导出进度提示
- 优化大数据集导出性能

Closes #123
\`\`\`

## 代码审查清单

### 功能性
- [ ] 代码实现了需求
- [ ] 边界情况已处理
- [ ] 错误处理完善

### 代码质量
- [ ] 遵循代码规范
- [ ] 无重复代码
- [ ] 函数职责单一
- [ ] 变量命名清晰

### 性能
- [ ] 无不必要的重渲染
- [ ] 大数据集已优化
- [ ] 图片已优化

### 安全
- [ ] 输入已验证
- [ ] 敏感数据已脱敏
- [ ] XSS 防护

### 测试
- [ ] 单元测试覆盖
- [ ] 集成测试通过
- [ ] 手动测试完成

---

**维护者**: YYC³ 开发团队  
**最后更新**: 2024-01  
**版本**: 1.0.0
