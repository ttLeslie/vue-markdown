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
地铁 6 号线串联虎丘、拙政园、平江路等景点，建议优先使用<span data-type="quote" data-title="苏州市人民政府" data-content="“五一”假期，古城旅游交通出行攻略"> </span> 。苏州地铁 6 号线在苏州中心区域，连接了苏州中心、虎丘、拙政园、平江路等景点。
换行<br>换行
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
