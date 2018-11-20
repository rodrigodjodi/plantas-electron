<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>ACMA</span>
        <span class="font-weight-light">Prudente de Moraes</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        @click="makePDF"
      >
        <span class="mr-2">salvar pdf</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout justify-center >
          <v-flex xs12 class="text-xs-center">
            <v-btn-toggle v-model="imageFile" mandatory>
              <v-btn flat value="subsolo1.jpg">
                Subsolo 1
              </v-btn>
              <v-btn flat value="subsolo2.jpg">
                Subsolo 2
              </v-btn>
            </v-btn-toggle>
          </v-flex>
        </v-layout>
        <Planta :imageFile="imageFile"/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Planta from "./components/Planta";

export default {
  name: "App",
  components: {
    Planta
  },
  data() {
    return {
      imageFile: "subsolo1.jpg",
      unidades: [
        "101",
        "201",
        "202",
        "203",
        "204",
        "301",
        "302",
        "303",
        "304",
        "401",
        "402",
        "403",
        "404",
        "501",
        "502",
        "503",
        "504",
        "601",
        "602",
        "603",
        "604",
        "701",
        "702",
        "703",
        "704"
      ]
    };
  },
  methods: {
    makePDF() {
      alert("Não implementado!");
    }
  }
};
</script>
