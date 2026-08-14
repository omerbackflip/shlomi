<template>
  <div class="price-list-page" dir="rtl">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2">
          <v-card class="elevation-3">
            <v-data-table
              :headers="groupHeaders"
              :items="deviceGroups"
              :loading="groupsLoading"
              :sort-by="['table_code']"
              :item-class="groupRowClass"
              disable-pagination
              hide-default-footer
              fixed-header
              height="72vh"
              dense
              mobile-breakpoint="0"
              class="clickable-table"
              @click:row="selectGroup"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>קבוצת מכשירים</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-chip small>{{ deviceGroups.length }}</v-chip>
                </v-toolbar>
              </template>
              <template v-slot:no-data>
                לא נמצאו קבוצות מכשירים
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="12" md="10">
          <v-card class="elevation-3">
            <v-data-table
              :headers="partHeaders"
              :items="parts"
              :loading="partsLoading"
              :search="search"
              :sort-by="['partId']"
              disable-pagination
              hide-default-footer
              fixed-header
              height="72vh"
              dense
              mobile-breakpoint="0"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>
                    {{ selectedGroup ? selectedGroup.description : 'בחר קבוצת מכשירים' }}
                  </v-toolbar-title>
                  <v-chip v-if="selectedGroup" small class="mr-2">{{ parts.length }}</v-chip>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    label="חיפוש"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    hide-details
                    class="parts-search"
                  />
                  <v-btn
                    color="primary"
                    small
                    class="mr-3"
                    :disabled="!selectedGroup"
                    @click="openCreateDialog"
                  >
                    <v-icon small right>mdi-plus</v-icon>
                    הוסף חלק
                  </v-btn>
                </v-toolbar>
              </template>

              <template v-slot:[`header.customerPriceWithVat`]="{ header }">
                <div class="price-column-header">
                  <span>{{ header.text }}</span>
                  <small>כולל מעמ</small>
                </div>
              </template>
              <template v-slot:[`header.labPrice`]="{ header }">
                <div class="price-column-header">
                  <span>{{ header.text }}</span>
                  <small>כולל מעמ</small>
                </div>
              </template>
              <template v-slot:[`header.companyPrice`]="{ header }">
                <div class="price-column-header">
                  <span>{{ header.text }}</span>
                  <small>כולל מעמ</small>
                </div>
              </template>

              <template v-slot:[`item.labPrice`]="{ item }">
                {{ formatPriceWithVat(item.labPrice) }}
              </template>
              <template v-slot:[`item.customerPriceWithVat`]="{ item }">
                {{ formatPriceWithVat(item.customerPrice) }}
              </template>
              <template v-slot:[`item.companyPrice`]="{ item }">
                {{ formatPriceWithVat(item.companyPrice) }}
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="ml-2" @click.stop="openEditDialog(item)">mdi-pencil</v-icon>
                <v-icon small color="error" @click.stop="deletePart(item)">mdi-delete</v-icon>
              </template>
              <template v-slot:no-data>
                {{ selectedGroup ? 'לא נמצאו חלקים לקבוצה זו' : 'בחר קבוצת מכשירים' }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialogOpen" max-width="650px" persistent>
      <v-card dir="rtl">
        <v-card-title>קבוצת מכשירים:  {{partForm.itemCode}} - {{ selectedGroup.description }} </v-card-title>
        <v-card-text>
          <v-alert v-if="formError" type="error" dense text>{{ formError }}</v-alert>
          <v-form>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  :value="partForm.itemCode"
                  label="קוד קבוצה"
                  disabled
                />
              </v-col>
              <v-col cols="6"></v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="partForm.partId"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                  label="מספר חלק"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="partForm.description"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                  label="תיאור"
                />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="partForm.customerPrice"
                  @input="updatePriceIncludingVat('customerPrice', 'customerPriceWithVat')"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                  label="מחיר ללקוח לפני מעמ"
                />
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="partForm.labPrice"
                  @input="updatePriceIncludingVat('labPrice', 'labPriceWithVat')"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                  label="מחיר מעבדה לפני מעמ"
                />
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="partForm.companyPrice"
                  @input="updatePriceIncludingVat('companyPrice', 'companyPriceWithVat')"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                  label="מחיר חברה לפני מעמ"
                />
              </v-col>
              <v-col cols="12" sm="3" class="pt-0">
                <v-text-field
                  v-model="partForm.customerPriceWithVat"
                  label="מחיר ללקוח כולל מעמ"
                  @input="updatePriceBeforeVat('customerPriceWithVat', 'customerPrice')"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                />
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="12" sm="3" class="pt-0">
                <v-text-field
                  v-model="partForm.labPriceWithVat"
                  label="מחיר מעבדה כולל מעמ"
                  @input="updatePriceBeforeVat('labPriceWithVat', 'labPrice')"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                />
              </v-col>
              <v-col cols="1"></v-col>
              <v-col cols="12" sm="3" class="pt-0">
                <v-text-field
                  v-model="partForm.companyPriceWithVat"
                  label="מחיר חברה כולל מעמ"
                  @input="updatePriceBeforeVat('companyPriceWithVat', 'companyPrice')"
                  @focus="$event.target.select()"
                  @mouseup.prevent
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="partForm.remark"
                  label="הערה"
                  rows="2"
                  auto-grow
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :disabled="saving" @click="closeDialog">ביטול</v-btn>
          <v-btn color="primary" :loading="saving" @click="savePart">
            שמור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarOpen" :timeout="3000">
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbarOpen = false">סגור</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import apiService from '../services/apiService';
import { PRICE_LIST_PARTS_MODEL, TABLE_IDS, TABLE_MODEL } from '../constants/constants';

const emptyPart = () => ({
  itemCode: null,
  partId: '',
  description: '',
  customerPrice: '',
  customerPriceWithVat: '',
  labPrice: '',
  labPriceWithVat: '',
  companyPrice: '',
  companyPriceWithVat: '',
  remark: '',
});

export default {
  name: 'price-list-parts',
  data() {
    return {
      deviceGroups: [],
      selectedGroup: null,
      parts: [],
      vatRate: null,
      search: '',
      groupsLoading: false,
      partsLoading: false,
      partsRequestId: 0,
      dialogOpen: false,
      editingPartId: null,
      partForm: emptyPart(),
      formError: '',
      saving: false,
      message: '',
      snackbarOpen: false,
      groupHeaders: [
        { text: 'קוד', value: 'table_code', width: '25%', class: 'primary white--text' },
        { text: 'קבוצת מכשירים', value: 'description', class: 'primary white--text' },
      ],
      partHeaders: [
        { text: 'מספר חלק', value: 'partId', width: '3%', class: 'primary white--text' },
        { text: 'תיאור', value: 'description', width: '28%', class: 'primary white--text' },
        { text: 'לקוח', value: 'customerPriceWithVat', width: '5%', sortable: false, class: 'primary white--text' },
        { text: 'מעבדה', value: 'labPrice', width: '5%', sortable: false, class: 'primary white--text' },
        { text: 'חברה', value: 'companyPrice', width: '5%', sortable: false, class: 'primary white--text' },
        { text: 'הערה', value: 'remark', width: '48%', class: 'primary white--text' },
        { text: 'פעולות', value: 'actions', width: '6%', sortable: false, class: 'primary white--text' },
      ],
    };
  },
  methods: {
    async loadVatRate() {
      try {
        const response = await apiService.clientGetEntities(TABLE_MODEL, {
          filter: { table_id: TABLE_IDS.VAT_RATE },
        });
        const vatRecord = response.data && response.data[0];
        const vatRate = vatRecord && Number(vatRecord.table_code);
        if (!Number.isFinite(vatRate)) throw new Error('VAT rate was not found');
        this.vatRate = vatRate;
        if (this.dialogOpen) this.updateAllPricesIncludingVat();
      } catch (error) {
        this.vatRate = null;
        this.showMessage(this.getErrorMessage(error, 'טעינת המע"מ נכשלה'));
      }
    },
    async loadDeviceGroups() {
      this.groupsLoading = true;
      try {
        const response = await apiService.clientGetEntities(TABLE_MODEL, {
          filter: { table_id: 1 },
          sort: { table_code: 1 },
        });
        this.deviceGroups = response.data;
        if (this.deviceGroups.length) await this.selectGroup(this.deviceGroups[0]);
      } catch (error) {
        this.showMessage(this.getErrorMessage(error, 'טעינת קבוצות המכשירים נכשלה'));
      } finally {
        this.groupsLoading = false;
      }
    },
    async selectGroup(group) {
      if (!group || (this.selectedGroup && this.selectedGroup._id === group._id)) return;
      this.selectedGroup = group;
      this.search = '';
      await this.loadParts(group.table_code);
    },
    async loadParts(itemCode) {
      const requestId = ++this.partsRequestId;
      this.partsLoading = true;
      try {
        const response = await apiService.clientGetEntities(PRICE_LIST_PARTS_MODEL, {
          filter: { itemCode },
          sort: { partId: 1 },
        });
        if (requestId === this.partsRequestId) this.parts = response.data;
      } catch (error) {
        if (requestId === this.partsRequestId) {
          this.parts = [];
          this.showMessage(this.getErrorMessage(error, 'טעינת החלפים נכשלה'));
        }
      } finally {
        if (requestId === this.partsRequestId) this.partsLoading = false;
      }
    },
    groupRowClass(group) {
      return this.selectedGroup && group._id === this.selectedGroup._id ? 'selected-group' : '';
    },
    openCreateDialog() {
      this.editingPartId = null;
      this.partForm = { ...emptyPart(), itemCode: this.selectedGroup.table_code };
      this.openDialog();
    },
    openEditDialog(part) {
      this.editingPartId = part._id;
      this.partForm = {
        itemCode: part.itemCode,
        partId: part.partId,
        description: part.description,
        customerPrice: part.customerPrice,
        customerPriceWithVat: '',
        labPrice: part.labPrice,
        labPriceWithVat: '',
        companyPrice: part.companyPrice,
        companyPriceWithVat: '',
        remark: part.remark || '',
      };
      this.updateAllPricesIncludingVat();
      this.openDialog();
    },
    openDialog() {
      this.formError = '';
      this.dialogOpen = true;
    },
    closeDialog() {
      this.dialogOpen = false;
      this.formError = '';
    },
    async savePart() {
      this.saving = true;
      this.formError = '';
      const payload = {
        itemCode: Number(this.partForm.itemCode),
        partId: Number(this.partForm.partId),
        description: this.partForm.description.trim(),
        customerPrice: Number(this.partForm.customerPrice),
        labPrice: Number(this.partForm.labPrice),
        companyPrice: Number(this.partForm.companyPrice),
        remark: (this.partForm.remark || '').trim(),
      };

      try {
        if (this.editingPartId) {
          await apiService.updateEntity({ _id: this.editingPartId }, payload, { model: PRICE_LIST_PARTS_MODEL });
        } else {
          await apiService.create(payload, { model: PRICE_LIST_PARTS_MODEL });
        }
        this.closeDialog();
        await this.loadParts(this.selectedGroup.table_code);
        this.showMessage('החלק נשמר בהצלחה');
      } catch (error) {
        this.formError = this.getErrorMessage(error, 'שמירת החלק נכשלה');
      } finally {
        this.saving = false;
      }
    },
    async deletePart(part) {
      if (!window.confirm(`למחוק את החלק "${part.description}"?`)) return;
      try {
        await apiService.deleteOne({ model: PRICE_LIST_PARTS_MODEL, id: part._id });
        await this.loadParts(this.selectedGroup.table_code);
        this.showMessage('החלק נמחק בהצלחה');
      } catch (error) {
        this.showMessage(this.getErrorMessage(error, 'מחיקת החלק נכשלה'));
      }
    },
    formatPrice(value) {
      if (value === null || value === undefined || value === '') return '';
      const price = Number(value);
      if (!Number.isFinite(price) || price === 0) return '';
      return new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }).format(price);
    },
    formatPriceWithVat(priceBeforeVat) {
      const price = Number(priceBeforeVat);
      if (!Number.isFinite(price) || price === 0 || !Number.isFinite(this.vatRate)) return '';
      return new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })
        .format(price * (1 + this.vatRate / 100));
    },
    updatePriceIncludingVat(priceField, priceWithVatField) {
      const price = this.partForm[priceField];
      if (price === null || price === undefined || price === '') {
        this.partForm[priceWithVatField] = '';
        return;
      }

      const numericPrice = Number(price);
      if (!Number.isFinite(numericPrice) || !Number.isFinite(this.vatRate)) return;
      this.partForm[priceWithVatField] = this.roundPrice(
        numericPrice * (1 + this.vatRate / 100)
      );
    },
    updatePriceBeforeVat(priceWithVatField, priceField) {
      const priceWithVat = this.partForm[priceWithVatField];
      if (priceWithVat === null || priceWithVat === undefined || priceWithVat === '') {
        this.partForm[priceField] = '';
        return;
      }

      const numericPrice = Number(priceWithVat);
      if (!Number.isFinite(numericPrice) || !Number.isFinite(this.vatRate)) return;
      this.partForm[priceField] = this.roundPrice(
        numericPrice / (1 + this.vatRate / 100)
      );
    },
    updateAllPricesIncludingVat() {
      this.updatePriceIncludingVat('customerPrice', 'customerPriceWithVat');
      this.updatePriceIncludingVat('labPrice', 'labPriceWithVat');
      this.updatePriceIncludingVat('companyPrice', 'companyPriceWithVat');
    },
    roundPrice(value) {
      return Math.round((value + Number.EPSILON) * 100) / 100;
    },
    getErrorMessage(error, fallback) {
      if (error && error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('duplicate key')) return 'מספר החלק כבר קיים בקבוצה זו';
        return error.response.data.message;
      }
      return fallback;
    },
    showMessage(message) {
      this.message = message;
      this.snackbarOpen = true;
    },
  },
  mounted() {
    this.loadVatRate();
    this.loadDeviceGroups();
  },
};
</script>

<style scoped>
.price-list-page {
  text-align: right;
}

.clickable-table {
  cursor: pointer;
}

.parts-search {
  max-width: 240px;
}

.price-column-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;
}

.price-column-header small {
  display: block;
  margin-top: 3px;
  font-size: 10px;
  font-weight: 400;
}

::v-deep .selected-group {
  background-color: #e3f2fd !important;
  font-weight: 600;
}

::v-deep .v-data-table td,
::v-deep .v-data-table th {
  text-align: right !important;
}

@media (max-width: 959px) {
  .parts-search {
    max-width: 160px;
  }
}
</style>
