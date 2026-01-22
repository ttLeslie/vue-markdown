<template>
  <AgentMarkdown
    :content="content"
    :md-options="{
      breaks: true,
      html: true,
    }"
    :sanitize="true"
  >
    <template #HtmlSpan="{ tagName, attrs }">
      <span v-if="tagName === 'span' && attrs[0]['data-type'] === 'quote'" class="quote-tag">{{
        attrs[0]['data-title']
      }}</span>
    </template>
  </AgentMarkdown>
</template>

<script setup lang="ts">
import { AgentMarkdown } from 'agent-markdown-vue';

const content = `
Subway Line 6 links attractions like Tiger Hill, the Humble Administrator's Garden, and Pingjiang Road. It is recommended to give it priority. <span data-type="quote" data-title="Suzhou Municipal People's Government" data-content="Travel and Transportation Guide for the Ancient City during the 'May Day' Holiday"> </span>. Suzhou Subway Line 6 is in the central area of Suzhou, connecting Suzhou Center, Tiger Hill, the Humble Administrator's Garden, and Pingjiang Road.
11<br>11
`;
</script>
<style scoped>
.quote-tag {
  padding: 0.2rem 0.4rem;
  font-size: 10px;
  color: #00000080;
  cursor: pointer;
  background-color: #0000000f;
  border-radius: 4px;
  transition: all 0.3s ease; /* 过渡动画 */
}

.quote-tag:hover {
  color: #000000b3; /* 文字颜色加深 */
  background-color: #0000001a; /* 背景色加深 */
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%); /* 增加阴影 */
  transform: translateY(-1px); /* 轻微上移 */
}
</style>
