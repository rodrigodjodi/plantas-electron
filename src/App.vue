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
            <v-btn-toggle v-model="nivel" mandatory>
              <v-btn flat value="subsolo1">
                Subsolo 1
              </v-btn>
              <v-btn flat value="subsolo2">
                Subsolo 2
              </v-btn>
            </v-btn-toggle>
          </v-flex>
        </v-layout>
        <Planta :nivel="nivel"/>
       <!--  <v-btn @click="uploadVagas">upload vagas</v-btn> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Planta from "./components/Planta";
//import { db } from "./main";
export default {
  name: "App",
  components: {
    Planta
  },
  data() {
    return {
      nivel: "subsolo1"
    };
  },
  methods: {
    makePDF() {
      alert("Não implementado!");
    },
    uploadVagas() {
      var batch = db.batch();
      vagas.forEach(vaga => {
        let ref = db.doc(`projetos/prudente/vagas/${vaga.numero}`);
        delete vaga.numero;
        batch.set(ref, vaga);
      });
      batch.commit().catch(err => {
        console.error(err);
      });
    }
  },
  created() {}
};
</script>
