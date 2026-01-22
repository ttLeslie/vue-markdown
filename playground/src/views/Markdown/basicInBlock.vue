<template>
  <AgentMarkdown
    :content="content"
    :md-options="{
      breaks: true,
      html: true,
    }"
    :sanitize="true"
  >
    <template #HtmlDiv="{ tagName, attrs }">
      <div
        v-if="attrs[0]['data-type'] === 'code'"
        style="
          display: flex;
          flex-direction: column;
          width: 300px;
          padding: 20px;
          background: linear-gradient(109deg, #fff 45.34%, #f7f3ff 102.43%);
          border: 1px solid #0000000f;
          border-radius: 4px;
        "
      >
        <div class="top">{{ attrs[0]['data-title'] }}</div>
        <div class="bottom" style="font-size: 12px; color: rgb(0 0 0 / 30%)">
          创建时间：{{ attrs[0]['data-time'] }}
        </div>
      </div>
    </template>
  </AgentMarkdown>
</template>
<script setup lang="ts">
import { AgentMarkdown } from '~/agent-markdown-vue';

const content = `
根据你的要求，我调整了代码结构:
<div data-type="code" data-title="javascript快速排序的示例" data-title="javascript快速排序的示例" data-time="2023-08-01" data-content="function quickSort(arr) {
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
}"></div>
`;
</script>
