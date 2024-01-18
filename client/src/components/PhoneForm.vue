<template>
    <v-dialog
        v-model="dialog"
        width="500"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="cancel"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                {{!phone ? 'New' : 'Update'}} Phone
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>

                   <v-row class="p-3 overflow-hidden">
                        <v-col cols="6">
                            <v-text-field v-model="phone.fullName" label="שם מלא"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="phone.address" label="כתובת"></v-text-field>
                        </v-col>         
                    </v-row>
                    <v-row class="p-3 overflow-hidden">
                        <v-col cols="3">
                            <v-text-field v-model="phone.phone1" label="טלפון 1"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="phone.phone2" label="טלפון 2"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="phone.phone3" label="טלפון 3"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field v-model="phone.phone4" label="טלפון 4"></v-text-field>
                        </v-col>       
                    </v-row>
                    <v-row class="p-3 overflow-hidden">
                        <v-col cols="6">
                            <v-text-field v-model="phone.remark" label="הערה"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <!-- <v-text-field v-model="phone.phoneType" label="קיבוץ"></v-text-field> -->
                            <v-combobox v-model="phone.phoneType" :items="phoneTypeList" label="קיבוץ" />
                        </v-col>
         
                    </v-row>
            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
                <v-btn :disabled = "!phone.fullName" color="primary" text @click="submitPhone()"> Submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { PHONE_MODEL, TABLE_MODEL } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "phone-form",
    data() {
        return {
            phone: {},
			dialog: false,
            resolve: null,  
			showMessage: false,
            newPhone: false,
			message: '',
            options: {
                color: "grey lighten-3",
                width: 500,
                zIndex: 200,
            },
            phoneTypeList: [],
        };
    },
    methods: {
        async submitPhone() {
			try {
				if(this.newPhone) {
					await apiService.create({...this.phone} , {model:PHONE_MODEL});
				} else {
					await apiService.update(this.phone._id , { ...this.phone } , {model:PHONE_MODEL});
				}
                this.dialog = false;
                this.resolve(true);
			} catch (error) {
				console.log(error);
			}
		},
        open(phone, newPhone) {
            this.newPhone = newPhone;
            this.phone = newPhone ? {} : {...phone};
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },
        async getPhoneTypeList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 7} );
            this.phoneTypeList = response.data.map((item) => {
                return (item.description)
            });
        },
    },
    mounted() {
		this.getPhoneTypeList();
	},
};
</script>

<style scoped>
.overflow-hidden{
    overflow: hidden;
    direction: rtl;
    text-align: right;
}

</style>