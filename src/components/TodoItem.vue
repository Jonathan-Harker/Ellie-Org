<template>
    <li>
      <input type="checkbox" v-model="editedTask.completed" />
      {{ editedTask.description }}
      <input type="number" v-model="editedTask.importance" min="1" max="5" @input="updateImportance" />
      <input type="number" v-model="editedTask.urgency" min="1" max="5" @input="updateUrgency" />
      <button @click="$emit('remove')">Remove</button>
    </li>
  </template>
  
  <script>
  export default {
    props: ["task"],
    data() {
      return {
        editedTask: { ...this.task },
      };
    },
    methods: {
      updateImportance() {
        this.$emit("updateImportance", this.editedTask.importance);
      },
      updateUrgency() {
        this.$emit("updateUrgency", this.editedTask.urgency);
      },
    },
  };
  </script>
  