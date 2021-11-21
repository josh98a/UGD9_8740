<template>
  <v-main class="list">
    <h3 class="text-h3" font-weight-medium mb-5> Courses </h3>
   
   <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details>
          </v-text-field>

        <v-spacer></v-spacer>

        <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
     
      </v-card-title>
      <v-data-table :headers="headers" :items="courses" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small @click="deleteHandler(item.id)"> delete </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Course</span>
        </v-card-title>
        <v-card-text>
            <v-container>
              <v-text-field v-model="form.nama_kelas" label="nama kelas" required></v-text-field>
              <v-text-field v-model="form.kode" label="kode" required></v-text-field>
              <v-text-field v-model="form.biaya_pendaftaran" label="biaya pendaftaran" required></v-text-field>
              <v-text-field v-model="form.kapasitas" label="kapasitas" required></v-text-field>
            </v-container>
        </v-card-text>
        <v-card-action>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-action>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Anda Yakin ingin menghapus kelas ini?</v-card-text>
        <v-card-action>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Save </v-btn>
        </v-card-action>
      </v-card>
    </v-dialog>

     <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }} </v-snackbar>   
  </v-main>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
         { text: "Nama Kelas", align: "start", sortable: true, value: "nama_kelas"},
         { text: "Kode", value: "kode"},
         { text: "Biaya Pendaftaran", value: "biaya_pendaftaran"},
         { text: "Kapasitas", value: "kapasitas"},
         { text: "Actions", value: "actions"},
      ],
        course: new FormData,
        courses: [],
        form: {
            nama_kelas: null,
            kode: null,
            biaya_pendaftaran: null,
            kapasitas: null,
        },
        deletedId: '',
        editId: ''
    };
  },

  methods: {

    setForm(){
      if(this.inputType !== 'Tambah'){
        this.update();
      }else{
        this.save();
      }
    },

    readData() {
      var url = this.$api + '/course';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer' + localStorage.getItem('token')
        }

      }).then(response => {
          this.courses = response.data.data;
      })
    },

    save() {
      this.course.append('nama_kelas', this.form.nama_kelas);
      this.course.append('kode', this.form.kode);
      this.course.append('biaya_pendaftaran', this.form.biaya_pendaftaran);
      this.course.append('kapasitas', this.form.kapasitas);

      var url = this.$api + '/course/'
      this.load = true;
      this.$http.post(url, this.course, {
        headers: {
           'Authorization' : 'Bearer' + localStorage.getItem('token'),
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = true;
        this.close();
        this.readData();
        this.resetForm();

      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;

      });
    },

    update() {
      let newData ={
        nama_kelas : this.form.nama_kelas,
        kode: this.form.kode,
        biaya_pendaftaran : this.form.biaya_pendaftaran,
        kapasitas : this.form.kapasitas
      };
      var url = this.$api + '/course/' + this.editId;
      this.load = true;
      this.$http.put(url, newData, {
        headers: {
          'Authorization' : 'Bearer' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = false;
        this.close();
        this.readData();
        this.resetForm();
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = 'red';
        this.snackbar = true;
        this.load = false;
      });
    },

    deleteData() {
      var url = this.$api + '/course/' + this.deleteId;
      this.load = true;
      this.$http.delete(url, {
        headers: {
          'Authorization': 'Bearer' + localStorage.getITem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
        this.snackbar = true;
        this.load = false;
        this.close();
        this.readData();
        this.resetForm();
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = 'red';
        this.snackbar = true;
        this.load = false;
      });
    },

    editHandler(item) {
      this.inputType = 'Ubah';
      this.editId = item.id;
      this.form.nama_kelas = item.nama_kelas;
      this.form.kode = item.kode;
      this.form.biaya_pendaftaran = item.biaya_pendaftaran;
      this.form.kapasitas = item.kapasitas;
      this.dialog = true;
    },

    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
      
    },

    close() {
      this.dialog = false;
      this.inputType = 'Tambah';
      this.dialogConfirm = false;
      this.readData();
    },

    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = 'Tambah';
    },

    resetForm() {
      this.form = { 
        nama_kelas: null,
        kode: null, 
        biaya_pendaftaran: null,
        kapasitas: null
      
      };
    },
  },

  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>
