<template>
  <div>
    <markdownBox theme="gitHub" :initValue="code" :markedOptions="options"></markdownBox>
    <MarkdownPreview style="text-align: left;" :initialValue="code"></MarkdownPreview>
  </div>
</template>

<script>
import markdownBox from './markdown.vue'

import { MarkdownPreview } from 'vue-meditor'
export default {
  components: { markdownBox, MarkdownPreview },
  data() {
    return {
      code: `以下是一个 Semi 代码的使用示例：\n\`\`\`jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n\`\`\`\n`,
      options: {
        html: true,
        typographer: true,
        linkify: true,
        breaks: true,
      }
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped></style>
