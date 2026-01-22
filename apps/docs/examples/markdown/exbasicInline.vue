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
