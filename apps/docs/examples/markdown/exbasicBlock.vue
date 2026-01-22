<template>
  <AgentMarkdown :content="content" :md-options="{ breaks: true, html: true }" :sanitize="true">
    <template #HtmlDiv="{ tagName, attrs }">
      <div v-if="tagName === 'div' && attrs[0]['data-type'] === 'code'" class="code-block">
        <div class="top">{{ attrs[0]['data-title'] }}</div>
        <div class="bottom">创建时间：{{ attrs[0]['data-time'] }}</div>
      </div>
    </template>
  </AgentMarkdown>
</template>

<script setup lang="ts">
import { AgentMarkdown } from 'agent-markdown-vue';
const content = `
根据你的要求，我调整了代码结构：
<div data-type="code" data-title="javascript快速排序的示例" data-time="2023-08-01" data-content="function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[0];
  const left = [];
  const right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}">  </div>
`;
</script>
