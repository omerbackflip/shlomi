<template>
  <v-app>
    <Navbar/>
    <v-main>
      <router-view/>
    </v-main>

  </v-app>
</template>

<script>
import Navbar from './components/Common/Navbar.vue';
  export default {
    name: "app",
    components: { Navbar },
    data(){
      return {

      }
    }
  }
  
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px;  */
}

.theme--dark.v-app-bar.v-toolbar.v-sheet {
    background-color: #99480d;
}
.v-application .primary {
    background-color: #63300c !important;
    border-color: #b15f25 !important;
}

#app > div > nav > nav {
    background-color: #63300c !important;
    border-color: #b15f25 !important;
}
.p-3{
	padding: 12px;
}

.m-3{
	margin: 12px;
}

@media print {
    .no-print {
        display: none;
    }
}

</style>
