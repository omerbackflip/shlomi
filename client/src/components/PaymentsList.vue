<template>
  <div class="list row">
		<v-layout class="mt-1" row wrap>
			<v-row no-gutters>
        <!-- Main table_id = 9 -->
        <v-card class="p-0 m-0" max-width="15%">
          <v-data-table
            :headers="suppliersHeaders"
            :items="suppliers"
            disable-pagination
            hide-default-footer
            fixed-header
            height="75vh"
            dense
            class="elevation-3"
            :loading = "loading"
            loader-height = "30"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-toolbar flat>
              <v-toolbar-title>רשימת ספקים</v-toolbar-title>
              </v-toolbar>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item, key) in items" :key="item.table_code" :class="key === selectedRow ? 'custom-highlight-row' : ''" 
                        @click="filterSupplier(key,item)" style="text-align: right;">
                  <td>{{ item.description }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-card>
        <!-- Payments -->
        <v-card class="p-0 m-0" max-width="42%">
          <v-data-table
            :headers="paymentHeaders"
            :items="payments"
            disable-pagination
            hide-default-footer
            fixed-header
            height="75vh"
            dense
            class="elevation-3"
            :loading = "loading"
            loader-height = "30"
            mobile-breakpoint="0"
          >
            <template v-slot:top>
              <v-toolbar flat>
              <v-toolbar-title>תשלומים - {{supplier.description}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-show="supplier.table_code" @click="addPayment()" small class="mt-3">
                  <v-icon class="nav-icon" small >mdi-plus</v-icon> פתח תשלום חדש </v-btn>
              </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <div v-show="supplier.table_code">
                <v-icon small @click="addPayment(item)"> mdi-pencil </v-icon>
                <v-icon small @click="deletePayment(item._id, item.paymentId)"> mdi-delete </v-icon>
              </div>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              <span>{{ item.date ? new Date(item.date).toLocaleDateString('en-GB') : '-'}}</span>
            </template>
            <template v-slot:[`item.amount`]="{ item }">
              <span>{{ item.amount.toLocaleString() }}</span>
            </template>
          </v-data-table>
        </v-card>
        <!-- Invoices -->
        <v-card class="p-0 m-0" max-width="42%">
        <v-data-table
          :headers="invoiceHeaders"
          :items="invoices"
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
              <v-toolbar-title>חשבוניות - {{supplier.description}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-text-field v-model="search" class="mx-4"	label="חיפוש" clearable></v-text-field>
                <v-spacer></v-spacer> -->
                <v-btn v-show="supplier.table_code" @click="addInvoice()" small class="mt-3">
                  <v-icon class="nav-icon" small >mdi-plus</v-icon> הוסף חשבונית </v-btn>
              </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div v-show="supplier.table_code">
              <v-icon small @click="addInvoice(item)"> mdi-pencil </v-icon>
              <v-icon small @click="deleteInvoice(item._id)"> mdi-delete </v-icon>
            </div>
          </template>
          <template v-slot:[`item.date`]="{ item }">
            <span>{{ item.date ? new Date(item.date).toLocaleDateString('en-GB') : '-'}}</span>
          </template>
          <template v-slot:[`item.amount`]="{ item }">
            <span>{{ item.amount.toLocaleString() }}</span>
          </template>
        </v-data-table>
        </v-card>
      </v-row>
		</v-layout>
    <payment-form ref="paymentForm"/>
    <invoice-form ref="invoiceForm"/>
  </div>
</template>



<script>
import { PAYMENT_MODEL, PAYMENT_HEADERS, INVOICE_HEADERS, INVOICE_MODEL, TABLE_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import excel from "vue-excel-export";
import Vue from "vue";
import PaymentForm from './PaymentForm.vue';
import InvoiceForm from './InvoiceForm.vue';
Vue.use(excel);
export default {
  name: "payment-list",
  components: { PaymentForm, InvoiceForm },
  data() {
    return {
      payments: [],
      payment: {},
      invoices: [],
      suppliers: [],
      supplier: {},
      selected: [],
      search: "",
      paymentHeaders: PAYMENT_HEADERS,
      invoiceHeaders: INVOICE_HEADERS,
      suppliersHeaders: [{ text: "רשימת ספקים", value: "description", class: 'primary white--text'}],
      loading: '',
      itemToEdit: "",
      tblFields: {
        id: "",
        code: "",
        description: "",
      },
      newTable_id: "",
      lastPaymentId: 0,
      selectedRow: null,
    };
  },

  methods: {
    rowSelect(idx) {
      console.dir(idx)
      this.selectedRow = idx;
    },
    
    async deletePayment(id, paymentId) {
      if (window.confirm("אשר מחיקת תשלום")) {
        await apiService.deleteOne({ model: PAYMENT_MODEL, id })
        // now, if any, delete paymentId in Invoice table 
        let delInvoiceId = await apiService.getMany({ model: INVOICE_MODEL, supplierId: this.supplier.table_code, paymentId: paymentId})
        delInvoiceId.data.map (async (item) => {
          item.paymentId = '';
          await apiService.update(item._id , {...item} , {model:INVOICE_MODEL});
          return (item)
        })
        this.refreshList();
      }
    },

    deleteInvoice(id) {
      if (window.confirm("אשר מחיקת חשבונית")) {
        apiService.deleteOne({ model: INVOICE_MODEL, id })
        this.refreshList();
      }
    },

    async retrievePayments() {
			this.loading = true
      let response = await apiService.getMany({ model: PAYMENT_MODEL, supplierId: this.supplier.table_code})
      if (response.data.length > 0) {
        this.payments = response.data.sort((a, b) => a.paymentId - b.paymentId);
        this.lastPaymentId = this.payments[this.payments.length-1].paymentId;
      } else {
        this.payments = response.data; // this to clear the table if no found
        this.lastPaymentId = 0;
      }
      let response1 = await apiService.getMany({ model: INVOICE_MODEL, supplierId: this.supplier.table_code})
      this.invoices = response1.data.sort((a, b) => a.paymentId - b.paymentId);
			this.loading = false
    },

    async retrieveSuppliers() {
			this.loading = true
      await apiService
        .getMany({ model: TABLE_MODEL, table_id: 9})
        .then((response) => {
          this.suppliers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
			this.loading = false
    },

    async retrieveInvoices() {
			this.loading = true
      let response = await apiService.getMany({ model: INVOICE_MODEL, supplierId: this.payment.supplierId})
      if (response.data.length > 0) {
        console.log(response.data)
        this.invoices = response.data.sort((a, b) => a.paymentId - b.paymentId);
        console.log(response.data)
      }
			this.loading = false
    },

    refreshList() {
      this.retrievePayments();
    },

    clearForm() {
      this.$refs.form.reset();
    },

    editOne(id) {
      this.$router.push({ name: "table-details", params: { id: id } });
    },

    async addPayment(item) {
      if (!item) {
        item = {date: new Date().toISOString().substr(0, 10), supplierId: this.supplier.table_code, paymentId: this.lastPaymentId+1}
      }
			await this.$refs.paymentForm.open(item,this.supplier.description);
			this.retrievePayments();    
    },
    
    async addInvoice(item) {
      if (!item) {
        item = {date: new Date().toISOString().substr(0, 10), supplierId: this.supplier.table_code}
      }
			await this.$refs.invoiceForm.open(item);
			this.retrieveInvoices();    
    },

    filterSupplier(key,row) {
      // console.dir(key)
      this.selectedRow = key;
      this.supplier = row;
      this.payment = {supplierId:row.table_code}
			this.retrievePayments();    
    },
  },

  computed: {},

  mounted() {
    this.retrieveSuppliers();
    this.retrievePayments();
  },
};
</script>

<style scoped>
.list {
  text-align: left;
  /* max-width: auto;
  margin: auto; */
}
.row {
  justify-content: space-around;
  cursor: pointer;
	direction: rtl;
}
.mr-2{
  margin-right: 15px;
}
.hebrew {
  direction: rtl;
  text-align: right;
}
.custom-highlight-row{
  background-color: lightgreen;
}
</style>
