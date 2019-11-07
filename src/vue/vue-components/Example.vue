<template>
    <div class="container">
      <h1>
        Lolpack message {{ message }}
      </h1>
    </div>
</template>

<script>
export default {
  data () {
    return {
      message: null,
    }
  },
  created () {
    // Создания сообщения
    this.message = this.$store.getters.getMessage;
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    color: var(--color-primary);
  }
</style>