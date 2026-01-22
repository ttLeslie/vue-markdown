<!-- basicBlock.vue -->
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
According to your requirements, I've adjusted the code structure:
<div data-type="code" data-title="Example of JavaScript Quick Sort" data-time="2023-08-01" data-content="function quickSort(arr) {
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
}"> </div>
`;
</script>

<style scoped>
.code-block {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  cursor: pointer;
  background: linear-gradient(109deg, #fff 45.34%, #f7f3ff 102.43%);
  border: 1px solid #0000000f;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.code-block:hover {
  border-color: #d8c3fa;
  box-shadow: 0 4px 12px rgb(156 39 176 / 8%);
  transform: translateY(-2px);
}

.code-block .top {
  margin-bottom: 8px;
  color: #333;
}

.code-block .bottom {
  margin-top: auto;
  font-size: 12px;
  color: rgb(0 0 0 / 30%);
}

html.dark .code-block {
  background: #2d2d2d;
  border: 1px solid #444;
}

html.dark .code-block .top {
  color: #e0e0e0;
}

html.dark .code-block .bottom {
  color: rgb(255 255 255 / 50%);
}

html.dark .code-block:hover {
  border-color: #6b46c1;
  box-shadow: 0 4px 12px rgb(107 70 193 / 20%);
}
</style>
