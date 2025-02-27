<template>
  <div class="home">
    <Chat></Chat>
  </div>
</template>

<script>
// @ is an alias to /src
import Chat from '@/views/chat/ChatView.vue';

export default {
  name: 'HomeView',
  components: {
    Chat
  }
}
</script>
