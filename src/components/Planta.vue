<template>
  <v-layout wrap>
    <v-flex xs12 lg10>
      <v-img
        :src="require(`../assets/${nivel}.jpg`)"
        contain
        max-height="800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMid" width="100%"
        viewBox="0 0 1600 938">
          <defs>
            <pattern id="hachura" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" style="stroke:orange; stroke-width:3" />
            </pattern>
          </defs>
          <rect v-for="vaga in vagas" :key="vaga.numero"
            :x="vaga.x" :y="vaga.y" :width="vaga.width" :height="vaga.height"
            class="vaga" :class="{'vaga-hl': highLighted==vaga.numero, 'vaga-ocupada': vaga.ap }"
            opacity="0" fill="url(#hachura)"
            @mouseover="onMouseover(vaga.numero)" @mouseleave="onMouseover(0)"
          />
          <text v-for="vaga  in vagas" :key="'v'+vaga.numero"
            :x="vaga.x + (vaga.width/2)" :y="vaga.y + (vaga.height/2)"
            class="txt-ap" dy="1rem"
          >
            {{vaga.ap || ""}}
          </text>
        </svg>
      </v-img>
    </v-flex>
    <v-flex xs12 lg2>
      <v-data-table hide-actions hide-headers
          :items="vagas"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.numero }}</td>
            <td class="text-xs-right">
              {{props.item.ap}}
            </td>
          </template>
        </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { db } from "../main";
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
      unidades: []
    };
  },
  computed: {
    vagas() {
      return this.todasAsVagas.filter(vaga => vaga.nivel === this.nivel);
    }
  },
  methods: {
    onMouseover(ev) {
      this.highLighted = ev;
    }
  },
  mounted() {
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
  height: 18px !important;
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
}
.vaga-ocupada {
  opacity: 0.8;
}
</style>
