<template>
  <div class="list row">
		<v-container class="bg-surface-variant">
			<v-row no-gutters>
        <v-col>
        <v-data-table
          :headers="headers"
          :items="phones"
          :search="search"
          disable-pagination
          hide-default-footer
          fixed-header
          height="75vh"
          dense
          class="elevation-3 hebrew"
					:loading = "loading"
					loader-height = "30"
					mobile-breakpoint="0"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>DATA - {{phones.length}}</v-toolbar-title>
              <v-spacer></v-spacer>
							<v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field>
              <v-spacer></v-spacer>
              <v-btn @click="updatePhone()" small class="mt-3">
                <v-icon class="nav-icon" small >mdi-plus</v-icon>
                Add Phone
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <phone-form ref="phoneForm"/>
  </div>
</template>

<script>
import { PHONE_MODEL, PHONE_HEADERS  } from "../constants/constants";
import apiService from "../services/apiService";
import PhoneForm from './PhoneForm.vue';

export default {
  name: "phone-list",
  components: { PhoneForm },
  data() {
    return {
      phones: [],
      tableID: [],
      tableCode: [],
      tableTitle: "",
      currInvoice: null,
      currentIndex: -1,
      search: "",
      headers: PHONE_HEADERS,
      loading: '',
      itemToEdit: "",
      tblFields: {
        id: "",
        code: "",
        description: "",
      },
      fldRules: [(v) => !!v || "Field is required"],
    };
  },

  methods: {

    async retrievePhones() {
			this.loading = true
      await apiService
        .getMany({ model: PHONE_MODEL})
        .then((response) => {
          this.phones = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
			this.loading = false
    },

    async updatePhone(item) {
			let newPhone = item ? false : true;
			await this.$refs.phoneForm.open(item, newPhone);
			this.retrieveTables();    
    },

  },

  computed: {},

  mounted() {
    this.retrievePhones();
  },
};
</script>

<style>
.list {
  text-align: right;
  max-width: auto;
  margin: auto;
}
.mr-2{
  margin-right: 15px;
}
.title {
  border: 5px solid rgb(197, 100, 31);
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
.hebrew {
  direction: rtl;
  text-align: right;
}
</style>
