<template>
    <v-layout>
      <v-flex xs12>
        <v-img
          :src="require(`../assets/${imageFile}`)"
          contain
          max-height="800"
        ></v-img>
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  props: {
    imageFile: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>
