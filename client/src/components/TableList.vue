<template>
  <div class="list row">
		<v-container class="bg-surface-variant">
			<v-row no-gutters>
        <!-- Main table_id = 99 -->
        <v-card class="p-3 m-3" max-width="40%">
        <v-data-table
          :headers="headers"
          :items="tableID"
          disable-pagination
          hide-default-footer
          fixed-header
          height="75vh"
          @click:row="filterTbl"
          dense
          class="elevation-3"
					:loading = "loading"
					loader-height = "30"
					mobile-breakpoint="0"
        >
          <template v-slot:top>
            <v-toolbar flat>
            <v-toolbar-title>DATA - {{tables.length}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <export-excel :data="tables" type="xlsx" name="tables">
								<v-btn small class="btn btn-danger mt-3 ml-3" :loading="loading">
									<v-icon >mdi-download</v-icon>
								</v-btn>
							</export-excel>
              <v-btn @click="addToTable('new')" small class="mt-3">
                <v-icon class="nav-icon" small >mdi-plus</v-icon>
                פתח טבלה חדשה
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <!-- <v-icon small @click="editOne(item._id)">mdi-pencil</v-icon> -->
            <div>
              <v-icon
                small
                @click="
                  itemToEdit === item._id ? updateOne(item) : setEdit(item)
                "
              >
                {{ itemToEdit === item._id ? "mdi-floppy" : "mdi-pencil" }}
              </v-icon>
              <v-icon small @click="deleteOne(item._id)">mdi-delete</v-icon>
            </div>
          </template>
          <template v-slot:[`item.description`]="{ item }">
            <div v-if="itemToEdit === item._id">
              <v-text-field
                v-model="item.description"
                :id="`itemEdit-${item._id}`"
              />
            </div>
            <!-- <div v-else @click="setEdit(item)"> -->
            <div v-else  class="hebrew">
              <span> {{ item.description }}</span>
            </div>
          </template>
          <template v-slot:[`item.table_id`]="{ item }">
            <div v-if="itemToEdit === item._id">
              <v-text-field
                v-model="item.table_id"
                :id="`itemEdit-${item._id}`"
              />
              <!-- @blur="updateOne(item)"/> -->
            </div>
            <div v-else>
              <span> {{ item.table_id }}</span>
            </div>
          </template>
          <template v-slot:[`item.table_code`]="{ item }">
            <div v-if="itemToEdit === item._id">
              <v-text-field
                v-model="item.table_code"
                :id="`itemEdit-${item._id}`"
              />
            </div>
            <div v-else>
              <span> {{ item.table_code }}</span>
            </div>
          </template>
        </v-data-table>
        </v-card>

        <!-- second table_id = 1,2,... -->
        <v-card class="p-3 m-3" max-width="40%">
        <v-data-table
          :headers="headers"
          :items="tableCode"
          disable-pagination
          dense
          hide-default-footer
          fixed-header
          height="75vh"
          class="elevation-3"
					mobile-breakpoint="0"
          :search="search"
        >
          <template v-slot:top>
              <v-toolbar flat>
              <v-toolbar-title>{{ tableTitle ? tableTitle + ' - ' + tableCode.length: "Title" }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" class="mx-4"	label="חיפוש" clearable></v-text-field>
                <v-spacer></v-spacer>
                <v-btn v-show="newTable_id && newTable_id < 99" @click="addToTable()" small class="mt-3">
                  <v-icon class="nav-icon" small >mdi-plus</v-icon>
                  הוסף לטבלה
                </v-btn>
              </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <!-- <v-icon small @click="editOne(item._id)">mdi-pencil</v-icon> -->
            <div>
              <v-icon
                small
                @click="
                  itemToEdit === item._id ? updateOne(item) : setEdit(item)
                "
              >
                {{ itemToEdit === item._id ? "mdi-floppy" : "mdi-pencil" }}
              </v-icon>
              <v-icon small @click="deleteOne(item._id)">mdi-delete</v-icon>
            </div>
          </template>
          <template v-slot:[`item.description`]="{ item }">
            <div v-if="itemToEdit === item._id">
              <v-text-field
                v-model="item.description"
                :id="`itemEdit-${item._id}`"
              />
            </div>
            <!-- <div v-else @click="setEdit(item)"> -->
            <div v-else  class="hebrew">
              <span> {{ item.description }}</span>
            </div>
          </template>
          <template v-slot:[`item.table_id`]="{ item }">
            <div v-if="itemToEdit === item._id">
              <v-text-field
                v-model="item.table_id"
                :id="`itemEdit-${item._id}`"
              />
              <!-- @blur="updateOne(item)"/> -->
            </div>
            <div v-else>
              <span> {{ item.table_id }}</span>
            </div>
          </template>
          <template v-slot:[`item.table_code`]="{ item }">
            <div v-if="itemToEdit === item._id">
              <v-text-field
                v-model="item.table_code"
                :id="`itemEdit-${item._id}`"
              />
            </div>
            <div v-else>
              <span> {{ item.table_code }}</span>
            </div>
          </template>
        </v-data-table>
        </v-card>
      </v-row>
    </v-container>
    <table-form ref="tableForm"/>
  </div>
</template>



<script>
import { TABLE_MODEL, TABLE_HEADERS } from "../constants/constants";
import apiService from "../services/apiService";
import TableForm from './TableForm.vue';
import excel from "vue-excel-export";
import Vue from "vue";
Vue.use(excel);
export default {
  name: "table-list",
  components: { TableForm },
  data() {
    return {
      tables: [],
      tableID: [],
      tableCode: [],
      tableTitle: "",
      currInvoice: null,
      currentIndex: -1,
      search: "",
      headers: TABLE_HEADERS,
      loading: '',
      itemToEdit: "",
      tblFields: {
        id: "",
        code: "",
        description: "",
      },
      newTable_id: "",
    };
  },

  methods: {
    deleteOne(id) {
      if (window.confirm("Are you sure you want to delete one item ?")) {
        apiService
          .deleteOne({ model: TABLE_MODEL, id })
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    async retrieveTables() {
			this.loading = true
      await apiService
        .getMany({ model: TABLE_MODEL})
        .then((response) => {
          this.tables = response.data;
          this.tableID = response.data.filter((item) => item.table_id === 99);
          this.tableID.sort((a,b) => {
            return (a.table_code - b.table_code)
          })  
        })
        .catch((e) => {
          console.log(e);
        });
			this.loading = false
    },

    refreshList() {
      this.retrieveTables();
      this.currInvoice = null;
      this.currentIndex = -1;
    },

    clearForm() {
      this.$refs.form.reset();
    },

    editOne(id) {
      this.$router.push({ name: "table-details", params: { id: id } });
    },

    updateOne(item) {
      apiService
        .update(item._id, item, { model: TABLE_MODEL })
        .then((response) => {
          console.log(response.data);
          this.message = "The updateOne() updated successfully!";
        })
        .catch((e) => {
          console.log(e);
        });
      this.itemToEdit = "";
    },

    setEdit(item) {
      this.itemToEdit = item._id;
      setTimeout(() => {
        document.getElementById(`itemEdit-${item._id}`).focus();
      }, 1);
    },
    async addToTable(type) {
			if (type === 'new') {this.newTable_id = 99}
			await this.$refs.tableForm.open(this.newTable_id);
      this.newTable_id = '';
			this.retrieveTables();    
    },
    
    filterTbl(row) {
      this.tableCode = this.tables.filter(
        (item) => item.table_id === row.table_code
      );
      this.tableTitle = row.description;
      this.newTable_id = row.table_code; // used for create new record for this table_id
    },
  },

  computed: {},

  mounted() {
    this.retrieveTables();
  },
};
</script>

<style scoped>
.list {
  text-align: left;
  max-width: auto;
  margin: auto;
}
.row {
  justify-content: space-around;
  cursor: pointer;
	direction: rtl;
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
