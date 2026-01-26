<template>
  <AgentMarkdown
    :content="content"
    :md-options="{
      breaks: true,
      html: true,
    }"
    :inline-tags="['badge', 'tag']"
    :sanitize="true"
  >
    <template #HtmlBadge="{ content, attrs }">
      <span class="badge" :style="{ backgroundColor: attrs[0]?.color || '#007bff' }">
        {{ content || attrs[0]?.text || 'Badge' }}
      </span>
    </template>
    <template #HtmlTag="{ content, attrs }">
      <span class="tag" :style="{ color: attrs[0]?.color || '#28a745' }">
        #{{ content || attrs[0]?.text || 'Tag' }}
      </span>
    </template>
  </AgentMarkdown>
</template>

<script setup lang="ts">
import { AgentMarkdown } from 'agent-markdown-vue';

const content = `
# 自定义行内标签示例

通过 \`inlineTags\` prop 可以添加自定义的行内标签，这些标签会被解析为行内标签，可以通过对应的插槽进行自定义渲染。

## 示例 1: Badge 标签

这是一个 <badge color="#ff6b6b" text="重要">重要</badge> 的提示，这里还有一个 <badge color="#4ecdc4" text="信息">信息</badge> 标签。

## 示例 2: Tag 标签

你可以使用 <tag color="#28a745" text="Vue">Vue</tag>、<tag color="#61dafb" text="React">React</tag> 或 <tag color="#f7df1e" text="JavaScript">JavaScript</tag> 标签来标记技术栈。

## 默认行内标签

默认支持的行内标签包括：span、a、strong、em、br、img、input、label、code、mark、small、sup、sub、q、card 等。

通过添加自定义行内标签，你可以扩展 markdown 的功能，实现更多自定义的交互组件。
`;
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 8px;
  margin: 0 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: white;
  border-radius: 12px;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  margin: 0 2px;
  font-size: 12px;
  font-weight: 500;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
