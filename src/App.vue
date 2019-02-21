<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>ACMA</span>
        <span class="font-weight-light">Prudente de Moraes</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="print">
        <span class="mr-2">imprimir</span>
      </v-btn>
      <v-btn v-if="electron" flat @click="makePDF">
        <span class="mr-2">salvar pdf</span>
      </v-btn>
      <v-toolbar-title class="font-weight-light headline text-uppercase showInPrint">{{nivel}}</v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout justify-center>
          <v-flex xs12 class="text-xs-center">
            <v-btn-toggle v-model="nivel" mandatory>
              <v-btn flat value="subsolo1">Subsolo 1</v-btn>
              <v-btn flat value="subsolo2">Subsolo 2</v-btn>
            </v-btn-toggle>
          </v-flex>
        </v-layout>
        <Planta ref="planta" :nivel="nivel"/>
        <!--  <v-btn @click="uploadVagas">upload vagas</v-btn> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Planta from "./components/Planta";
if (process.versions) {
  var ipcRenderer = require("electron").ipcRenderer;
}
export default {
  name: "App",
  components: {
    Planta
  },
  data() {
    return {
      nivel: "subsolo1",
      printing: false,
      electron: false
    };
  },
  methods: {
    makePDF() {
      ipcRenderer.send("print-to-pdf", this.nivel);
    },
    print() {
      console.log(this.$refs.planta.$el);
      window.print();
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
  created() {
    if (ipcRenderer) {
      this.electron = true;
      ipcRenderer.on("wrote-pdf", (event, path) => {
        alert(`Arquivo salvo em ${path}. Abrirá automaticamente.`);
      });
      ipcRenderer.on("not-wrote-pdf", (event, err) => {
        alert(`Erro ao salvar arquivo (possivelmente esteja aberto).`);
      });
    }
  }
};
</script>
<style>
.showInPrint {
  display: none;
}
@media print {
  button {
    display: none !important;
  }
  main {
    padding: 18px 0 !important;
  }
  .container {
    padding: 24px 0;
  }
  .showInPrint {
    display: block;
  }
}
</style>
