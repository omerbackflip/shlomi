<template>
    <nav class="no-print">
        <v-app-bar app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <div class="db-text" :style="{ backgroundColor: local ? 'red' : undefined }">
                <div v-if="isMobile()"> {{local ? 'L' : 'P'}}                   </div>
                <div v-else>            {{local ? 'Local Host' : 'Production'}} </div>
            </div>
            <v-btn v-if="!isMobile()" color="primary" dark :loading="loading" @click="runBackup" class="ml-3" small>
                <v-icon left>mdi-google-drive</v-icon>
                {{ lastUpdate }}
            </v-btn>
            <v-btn v-if="!isMobile()" small class="ml-2" :loading="loading" @click="triggerRestore">
                <v-icon left>mdi-restore</v-icon> Restore
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn-toggle v-if="isTicketsList" v-model="ticketStatus" @change="onFilterChange" group :data-state="ticketStatus">
                <v-btn value="Open" elevation='3' small class="btn-tgl"> פתוח </v-btn>
                <v-btn value="Checked" elevation='3' small class="btn-tgl"> נבדק </v-btn>
                <v-btn value="Fixed" elevation='3' small class="btn-tgl"> תוקן </v-btn>
                <v-btn value="ALL" elevation='3' small class="btn-tgl"> הכל </v-btn>
            </v-btn-toggle>
            <v-select v-if="isTicketsList" :items="years" v-model="ticketYear" @change="onFilterChange" label="Year"/>
            <v-btn x-small @click="$emit('logout')" icon>
                <v-icon small>mdi-logout</v-icon>
            </v-btn>
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
import { isMobile, ROUTE_LIST, loadTable, TABLE_IDS } from '../../constants/constants';
import { initializeGoogleOnAppLoad } from "../../../../google/frontend";

export default {
    data() {
        return {
            isMobile,
            drawer: false,
            local: false,
            production: false,
            links : ROUTE_LIST,
            dialog: false,
            ticketStatus: 'Open',
            ticketYear: '',
            // years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
            //         2016, 2015, 2014, 2013, 2012, 2011, 2010,
            //         2009, 2008, 2007, 2006]
            years: [],
            lastUpdate: [],
            loading: false,
            googleConnectMenuItem: '',
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

        async runBackup() {
            try {
                this.loading = true;
                this.lastUpdate = "creating excel...";

                const response = await SpecificServiceEndPoints.runBackup();

                if (response && response.data && response.data.file && response.data.file.filename) {
                    const filename = response.data.file.filename;
                    const match = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
                    const dateStr = match ? `${match[3]}/${match[2]}/${match[1]}` : '';

                    this.lastUpdate = "last backup : " + dateStr;

                }
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async checkGoogleConnection() {
            await initializeGoogleOnAppLoad( SpecificServiceEndPoints.getGoogleConnectionStatus, (menuItem) => {
                    this.googleConnectMenuItem = menuItem;
                }
            );
        },

        triggerRestore() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.zip';

            input.onchange = (e) => {
                const file = e.target.files[0];
                this.runRestore(file);
            };

            input.click();
        },

        async runRestore(file) {
            try {
                if (!file || !file.name || !file.name.toLowerCase().startsWith('shlomi')) {
                    alert("Restore file must start with 'shlomi'.");
                    return;
                }

                if (!confirm('This will overwrite ALL data. Continue?')) return;

                this.loading = true;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('confirm', 'YES');

                const response = await SpecificServiceEndPoints.restoreBackup(formData);

                alert('Restore completed');
                console.log(response.data);
            } catch (err) {
                console.error(err);
                alert(err?.response?.data?.message || 'Restore failed');
            } finally {
                this.loading = false;
            }
        }
    },

    async mounted() {
        this.getDatabaseInformation();
        this.years = (await loadTable(TABLE_IDS.YEARS)).map((code) => code.description).sort((a, b) => parseInt(b) - parseInt(a));
        const lastUpdateArr = (await loadTable(TABLE_IDS.LAST_BACKUP)).map((code) => code.description);
        this.lastUpdate = lastUpdateArr.length === 1 ? lastUpdateArr[0] : lastUpdateArr;
        await this.checkGoogleConnection();
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

    .btn-tgl {
        border: 2px solid transparent !important;
        border-radius: 6px;
        padding-left: 12px !important;
        padding-right: 12px !important;
        min-width: 56px;
    }

    /* default border colors per button value */
    .btn-tgl[value="Open"] { border-color: red !important; }
    .btn-tgl[value="Checked"] { border-color: #f1c40f !important; }
    .btn-tgl[value="Fixed"] { border-color: lightgreen !important; }
    .btn-tgl[value="ALL"] { border-color: #6c757d !important; }

    /* single centralized rule: style active button based on toggle's data-state */
    .v-btn-toggle[data-state="Open"] .btn-tgl[value="Open"].v-btn--active {
        background-color: red !important;
        border: 4px solid red !important;
        color: white !important;
    }
    .v-btn-toggle[data-state="Checked"] .btn-tgl[value="Checked"].v-btn--active {
        background-color: #f1c40f !important;
        border: 4px solid #f1c40f !important;
        color: #222 !important;
    }
    .v-btn-toggle[data-state="Fixed"] .btn-tgl[value="Fixed"].v-btn--active {
        background-color: lightgreen !important;
        border: 4px solid lightgreen !important;
        color: #222 !important;
    }
    .v-btn-toggle[data-state="ALL"] .btn-tgl[value="ALL"].v-btn--active {
        background-color: #6c757d !important;
        border: 4px solid #6c757d !important;
        color: white !important;
    }

</style>



