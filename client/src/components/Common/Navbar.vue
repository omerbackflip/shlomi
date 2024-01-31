<template>
    <nav class="no-print">
        <v-app-bar app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <div class="db-text">
                <div v-if="isMobile()"> {{local ? 'L' : 'P'}}                   </div>
                <div v-else>            {{local ? 'Local Host' : 'Production'}} </div>
            </div>
            <!-- <export-excel :fetch="fetchData" type="xlsx" name="all-data">
                <v-btn x-small class="btn btn-danger" :loading="loading">
                    <v-icon small>mdi-download</v-icon>
                </v-btn>
            </export-excel> -->
            <v-spacer></v-spacer>
            <v-btn-toggle v-if="isTicketsList" v-model="ticketStatus" @change="onFilterChange" group >
                <v-btn text value="Open"     elevation='3' small> פתוח </v-btn>
                <v-btn text value="Checked"  elevation='3' small> נבדק </v-btn>
                <v-btn text value="Fixed"    elevation='3' small> תוקן </v-btn>
                <v-btn text value="ALL"    elevation='3' small> הכל </v-btn>
            </v-btn-toggle>
            <v-select v-if="isTicketsList" :items="years" v-model="ticketYear" @change="onFilterChange" label="Year"/>
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

import SpecificServiceEndPoints from "../../services/specificServiceEndPoints";
import { isMobile } from '../../constants/constants';

export default {
    data() {
        return {
            isMobile,
            drawer: false,
            local: false,
            production: false,
            loading: false,
            links: [
                {icon: 'mdi-briefcase-check', text: 'כרטיסי תיקון', route: '/'},
                {icon: 'mdi-account-multiple-check', text: 'לקוחות', route: '/customers'},
                {icon: 'mdi-account-multiple-check', text: 'לקוחות2', route: '/customers2'},
                {icon: 'mdi-file-table-box-multiple', text: 'טבלאות', route: '/tables'},
                {icon: 'mdi-cash-multiple', text: 'יבוא נתונים', route: '/import'},
                {icon: 'mdi-cash-multiple', text: 'ספר טלפונים', route: '/phones'},
            ],
            dialog: false,
            ticketStatus: 'Open',
            ticketYear: '',
            years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
                    2016, 2015, 2014, 2013, 2012, 2011, 2010,
                    2009, 2008, 2007, 2006],
        }
    },
    methods:{
        navigate(link) {
            this.drawer = !this.drawer
            if(link && link.route) {
                if (this.$router.history.current.fullPath != link.route) {
                    this.$router.push({ path: link.route });
                }
            } else {
                link.onClick();
            }
        },
        onFilterChange(filter) {
            if (filter) { // to avoide case when filetr is "undefine" (when dobule select)
                let type = isNaN(filter) ? "STATUS" : "YEAR"
                if (type === "YEAR") {
                    this.ticketStatus = null
                } else this.ticketYear=''; // un-select the status
                this.$root.$emit('filterChange',filter, type);
            }
        },
        async getDatabaseInformation() {
            try {
                const response = await SpecificServiceEndPoints.getDbInfo();
                if(response && response.data && response.data.success) {
                    const { local, production } = response.data;
                    this.local = local;
                    this.production = production;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // async fetchData(){
        //     this.loading = true;
        //     const response = await apiService.getMany({model:TICKET_MODEL})
        //     this.loading = false;
        //     return response.data;
        // },
    },
    mounted() {
        this.getDatabaseInformation();
    },
    computed: {
        isTicketsList() {
            return this.$route.name === 'ticket-list';
        },
        isCustomerList() {
            return this.$route.name === 'customers-list';
        },
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
     
    .v-input {
        margin-bottom: 20px !important;
        margin-left: 20px !important;
        max-width: 5rem !important;   
    }

    .db-text{
        /* margin-left: 100px; */
        margin-top: 3px;
        border: 1px solid white;
        padding: 4px;
        border-radius: 4px;
        font-size: 14px;
    }

</style>


