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
    background-color: #1371ce;
}
.v-application .primary {
    background-color: #1e0571 ;
    border-color: #1976d2 ;
}

#app > div > nav > nav {
    background-color: #1e0571 ;
    border-color: #1976d2 ;
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
