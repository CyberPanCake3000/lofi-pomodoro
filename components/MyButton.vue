<template>
  <button @click="clickHandler">{{ label }}</button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    }
  },
  methods: {
    clickHandler() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #2c3e50;
}
</style>
