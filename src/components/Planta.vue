<template>
  <v-layout wrap>
    <v-flex xs12 lg10>
      <v-img class="printBG" :src="require(`../assets/${nivel}.jpg`)" contain max-height="800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMid"
          width="100%"
          viewBox="0 0 1600 938"
        >
          <defs>
            <pattern
              id="hachura"
              width="5"
              height="5"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" style="stroke:orange; stroke-width:3"></line>
            </pattern>
          </defs>
          <rect
            v-for="vaga in vagas"
            :key="vaga.numero"
            :x="vaga.x"
            :y="vaga.y"
            :width="vaga.width"
            :height="vaga.height"
            :class="{'vaga-hl': highLighted==vaga.numero, 'vaga-ocupada': vaga.ap }"
            opacity="0"
            fill="url(#hachura)"
            @mouseover="onMouseover(vaga.numero)"
            @mouseleave="onMouseover(0)"
            @click="showDialog(vaga)"
          ></rect>
          <text
            v-for="vaga  in vagas"
            :key="'v'+vaga.numero"
            :x="vaga.x + (vaga.width/2)"
            :y="vaga.y + (vaga.height/2)"
            class="txt-ap"
            dy="1rem"
          >{{vaga.ap || ""}}</text>
        </svg>
      </v-img>
    </v-flex>
    <v-flex xs12 lg2>
      <v-data-table hide-actions :items="vagas" :headers="headers" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td
            class="text-xs-center"
            :class="{'hl': highLighted==props.item.numero}"
            @mouseover="onMouseover(props.item.numero)"
            @mouseleave="onMouseover(0)"
            @click="showDialog(props.item)"
          >{{ props.item.numero }}</td>
          <td class="text-xs-center">{{props.item.ap}}</td>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="dialog" max-width="320px">
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogHeadline}}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <v-select
                  v-model="dialogAp"
                  :items="unidades"
                  label="Escolha um apartamento da lista..."
                  solo
                  clearable
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click="save">{{dialogConfirmText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import config from "../assets/firebaseConfig";
firebase.initializeApp(config);
firebase.auth().signInAnonymously();
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
export default {
  props: {
    nivel: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      highLighted: "",
      todasAsVagas: [],
      unidades: [],
      dialog: false,
      headers: [
        {
          text: "Vaga",
          align: "center",
          sortable: false,
          value: "vaga"
        },
        { text: "Apto", value: "ap", align: "center", sortable: false }
      ],
      editandoVaga: 0,
      dialogHeadline: "",
      dialogConfirmText: "",
      dialogAp: ""
    };
  },
  computed: {
    vagas() {
      return this.todasAsVagas.filter(vaga => vaga.nivel === this.nivel);
    }
  },
  methods: {
    liberaVaga() {
      this.dialogAp = null;
    },
    onMouseover(ev) {
      this.highLighted = ev;
    },
    showDialog(ev) {
      this.editandoVaga = ev.numero;
      if (ev.ap === null) {
        this.dialogConfirmText = "Reservar";
        this.dialogHeadline = `Reservar vaga ${ev.numero}?`;
      } else {
        this.dialogConfirmText = "Alterar";
        this.dialogHeadline = `Alterar vaga ${ev.numero}?`;
        this.dialogAp = ev.ap;
      }
      this.dialog = true;
    },
    closeDialog() {
      this.dialogConfirmText = "";
      this.dialogHeadline = "";
      this.editandoVaga = 0;
      this.dialogAp = "";
      this.dialog = false;
    },
    save() {
      if (typeof this.dialogAp === "undefined") {
        this.dialogAp = null;
      }
      db.doc(`projetos/prudente/vagas/${this.editandoVaga}`)
        .update({ ap: this.dialogAp })
        .then(() => {
          console.log("Document successfully updated!");
          this.closeDialog();
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
  },
  created() {
    db.doc("projetos/prudente")
      .get()
      .then(doc => {
        this.unidades = doc.data().unidades;
      });
    db.doc("projetos/prudente")
      .collection("vagas")
      .onSnapshot(snap => {
        this.todasAsVagas = [];
        snap.forEach(doc => {
          let newItem = doc.data();
          newItem.numero = doc.id;
          this.todasAsVagas.push(newItem);
        });
      });
  }
};
</script>

<style>
svg {
  max-height: 800px;
}
td {
  transition: background 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  will-change: background;
}
td.hl {
  background: rgba(0, 128, 0, 0.4);
  cursor: pointer;
}
td {
  height: 18px !important;
}
.printBG {
  -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
  color-adjust: exact !important;
}
.select-ap {
  padding: 0;
  margin: 0;
}
.txt-ap {
  text-anchor: middle;
  font-family: "Arial";
  font-size: 2rem;
}
.vaga-hl {
  fill: green;
  font-weight: bold;
  background: #bebebe;
  opacity: 0.4;
  cursor: pointer;
}
.vaga-ocupada {
  opacity: 0.8;
}
@media print {
  .flex.xs12.lg10 {
    flex-basis: 84%;
    max-width: 84%;
    margin-left: 2em;
  }
  .flex.xs12.lg2 {
    flex-basis: 10%;
    max-width: 10%;
  }
  table.v-table tbody td {
    font-size: 10px !important;
    padding: 0 8px 0 !important;
  }
  td {
    height: 10px !important;
    overflow: hidden;
  }
  table.v-table thead th:first-child {
    padding: 0 4px 0;
  }
  table.v-table thead tr {
    height: 18px;
  }
  table.v-table tbody {
    overflow: hidden;
  }
  tr {
    overflow: hidden;
  }
  .v-table__overflow {
    overflow-x: hidden !important;
  }
}
</style>
