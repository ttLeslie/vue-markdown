# Markdown 组件架构图

```mermaid
graph TB
    subgraph "导出层"
        A[index.ts<br/>导出入口] --> B[Markdown/index.ts<br/>AgentMarkdown组件]
    end

    subgraph "核心组件"
        B --> C[MarkdownRenderer.vue<br/>主渲染组件]
    end

    subgraph "数据处理层"
        C --> D[tokens-to-tree.ts<br/>Token转组件树]
        D --> E[createVNode.ts<br/>Token转VNode]
    end

    subgraph "工具层"
        E --> F[utils.ts<br/>工具函数]
        D --> F
        C --> F
    end

    subgraph "类型定义"
        G[types.ts<br/>类型定义] --> D
        G --> E
        G --> C
    end

    subgraph "外部依赖"
        H[markdown-it<br/>Markdown解析器] --> C
        I[@mdit/plugin-katex<br/>数学公式插件] --> C
        J[markdown-it-emoji<br/>表情插件] --> C
        K[dompurify<br/>HTML净化] --> E
        L[vue<br/>Vue框架] --> C
        L --> E
    end

    subgraph "数据流"
        M[Markdown文本] --> C
        C --> N[MarkdownIt解析]
        N --> O[Tokens数组]
        O --> D
        D --> P[组件树<br/>RendererToken[]]
        P --> E
        E --> Q[VNode数组]
        Q --> R[渲染到DOM]
    end

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#e8f5e9
    style E fill:#e8f5e9
    style F fill:#f3e5f5
    style G fill:#fce4ec
```

## 组件说明

### 1. 导出层

- **index.ts**: 组件库的导出入口，统一导出 Markdown 相关组件和类型
- **Markdown/index.ts**: 使用 `withInstall` 包装 MarkdownRenderer，导出为 `AgentMarkdown` 组件

### 2. 核心组件

- **MarkdownRenderer.vue**:
  - 接收 Markdown 文本内容
  - 配置 MarkdownIt 解析器（支持 katex、emoji 插件）
  - 将解析后的 tokens 转换为组件树
  - 通过 createVNode 生成 VNode
  - 处理链接点击事件

### 3. 数据处理层

- **tokens-to-tree.ts**:

  - 将 MarkdownIt 解析的 tokens 转换为结构化的组件树
  - 处理标签的嵌套关系（开标签、闭标签、自闭合标签）
  - 设置每个节点的 ComponentType

- **createVNode.ts**:
  - 将组件树中的每个节点转换为 Vue VNode
  - 支持多种节点类型：文本、代码块、数学公式、图片、HTML等
  - 支持插槽（slots）自定义渲染
  - 支持 HTML 净化（sanitize）

### 4. 工具层

- **utils.ts**:
  - 提供属性提取、HTML 转义/反转义
  - 标签补全（generateClosingTag、generateClosingBlockTag）
  - 其他辅助函数

### 5. 类型定义

- **types.ts**:
  - ExtendedToken: 扩展的 Token 类型
  - TagToken: 标签类型的 Token
  - RendererToken: 渲染器可用的 Token 类型
  - FenceInfo: 代码块信息类型
  - 支持的语言列表

## 数据流转过程

1. **输入**: Markdown 文本字符串
2. **解析**: MarkdownIt 将文本解析为 tokens 数组
3. **转换**: tokens-to-tree 将 tokens 转换为组件树结构
4. **渲染**: createVNode 将组件树节点转换为 Vue VNode
5. **输出**: 渲染到 DOM 的 HTML 结构
