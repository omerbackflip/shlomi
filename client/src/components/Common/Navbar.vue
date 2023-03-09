<template>
    <nav>
        <v-app-bar app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>-Shlomi-</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" class="primary text-left ">
            <v-list class="ml-1">
                <v-list-item v-for="link in links" :key="link.text" router @click="navigate(link)">
                    <v-list-item-action>
                        <v-icon class="white--text">{{link.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{link.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

    </nav>
    
</template>

<script>

export default {
    data() {
        return {
            drawer: false,
            links: [
                {icon: 'mdi-briefcase-check', text: 'Tickets', route: '/'},
                {icon: 'mdi-account-multiple-check', text: 'Customers', route: '/customers'},
                {icon: 'mdi-file-table-box-multiple', text: 'Tables', route: '/tables'},
                {icon: 'mdi-cash-multiple', text: 'Import Data', route: '/import'},
            ],
            dialog: false,
        }
    },
    methods:{
        navigate(link) {
            if(link && link.route) {
                if (this.$router.history.current.fullPath != link.route) {
                    this.$router.push({ path: link.route });
                }
            } else {
                link.onClick();
            }
        },
    },
    computed: {
    }
}
</script>

<style scoped>
 
    .cursor-pointer{
        cursor: pointer ;
    }

    .v-input__slot {
      max-width: 100px;
      max-height: 60px;
    }

    .v-toolbar__content{
        height: 70px !important;
        padding-right: 1px !important;
        padding-left: 1px !important;
    }

    .v-application p {
        margin-bottom: 4px;
    }
    .v-select{
        width: 20% !important;
        max-width: 20% !important;
        margin-top: 34px !important;
    }

    .nav-icon{
        background: #FFF;
        color: #0d6efd !important;
        border-radius: 4px;
    }

    @media screen
    and (min-width: 350px)
    and (max-width: 768px) {
        .summary{
            font-size: 10px;
        }
        .v-select{
            width: 30% !important;
            max-width: 50% !important;
            margin-top: 34px !important;
        }
    }

    .text-left{
        text-align: left !important;
    }
     

</style>


