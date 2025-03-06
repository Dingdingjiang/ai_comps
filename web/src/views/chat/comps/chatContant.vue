<template>
  <div>
    <markdownBox :initValue="content"></markdownBox>
  </div>
</template>

<script>
import markdownBox from './markdown.vue'

export default {
  components: { markdownBox },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
