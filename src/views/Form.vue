<template>
  <div>
    <b-navbar class="p-3" style="border-bottom:solid 1px rgb(200,200,200)" variant="faded" type="light">
        <center style="width:100%">
            <b-navbar-brand>
                <img src="../assets/logo-analitica-black.png" alt="Analitica Logo" style="max-height:40px">
            </b-navbar-brand>
        </center>
    </b-navbar>

    <b-container fluid v-if="isLoading" style="min-height: 100vh !important;background-color: rgba(236, 0, 140, 0.2);padding-right:0px; padding-left:0px;">
        <b-row align-v="center" style="min-height: 100vh">
            <b-col align-self="center" class="text-center">
                <b-spinner 
                    style="width: 3rem; height: 3rem;" 
                    label="Large Spinner"
                    v-if="isLoading"
                >
                </b-spinner>
            </b-col>
        </b-row>
    </b-container>

    <b-container 
        fluid 
        v-if="!isLoading"
        style="background-color: rgba(236, 0, 140, 0.2); padding-bottom: 50px; padding-right:0px; padding-left:0px;"
        >
        <b-row class="w-100 py-5 p-md-5" align-v="center">
            <b-col class="px-5 pt-sm-3 pb-sm-3 pt-md-5 pb-md-5 text-center" cols="12">
                <img src="../assets/golden-ticket-logo-fix.png" style="width: 100%;max-width: 400px">
            </b-col>
            <b-col md="12">
                <b-card
                    class="p-sm-1 p-md-5 mx-sm-1 mx-md-auto"
                    style="max-width:700px"
                >
                    <b-form @submit="onSubmit">
                        <b-row v-for="f in form.segments" :key="f.name">
                            <b-col cols="12" class="text-left">
                                <!-- Type HeaderText -->
                                <h4 
                                    class="text-center mb-5"
                                    v-if="f.type == 'HeaderText'"
                                    >
                                    {{ f.text }}
                                </h4>

                                <!-- Type DescriptionText -->
                                <p 
                                    class="text-justify mb-3"
                                    v-else-if="f.type == 'DescriptionText'">
                                    {{ f.text }}
                                </p>

                                <!-- Type Divider -->
                                <hr v-else-if="f.type == 'Divider'" class="w-100 mb-4 mt-4">

                                <!-- Login Analitica -->
                                <b-form-group 
                                    v-else-if="f.type == 'AnaliticaAccount' && loginRequired"
                                    class="mb-sm-2 mb-md-3"
                                    label="Akun Analitica *"
                                    label-for="analitica-account"
                                    >
                                    <p
                                        v-if="currentUser == ''"
                                        class="button-submit w-100 text-center"
                                        @click="modal.modalLogin = true"
                                    >
                                        Login Akun Analitica
                                    </p>
                                    <b-form-input
                                        v-else
                                        id="analitica-account"
                                        v-model="currentEmail"
                                        type="email"
                                        :placeholder="currentEmail"
                                        disabled
                                    ></b-form-input>
                                    <p
                                        v-if="currentUser !== ''"
                                        class="button-submit mt-2"
                                        @click="modal.modalLogin = true"
                                    >
                                        Ganti Akun Analitica
                                    </p>
                                </b-form-group>

                                <!-- Type MultipleChoice (Radio) -->
                                <b-form-group 
                                    v-else-if="f.type == 'MultipleChoice'"
                                    class="mb-sm-2 mb-md-3"
                                    :label="(f.isRequired==true) ? f.label+' *' : f.label"  
                                    :label-for="f.name"
                                    >
                                    <b-form-radio-group
                                        :id="f.name"
                                        v-model="newEntry[f.name]"
                                        :options="f.options"
                                        :required="f.isRequired"
                                    ></b-form-radio-group>
                                </b-form-group>

                                <!-- Type DateField -->
                                <b-form-group 
                                    v-else-if="f.type == 'DateField'"
                                    class="mb-sm-2 mb-md-3"
                                    :label="(f.isRequired==true) ? f.label+' *' : f.label"  
                                    :label-for="f.name"
                                    >
                                    <b-form-datepicker 
                                        :id="f.name" 
                                        v-model="newEntry[f.name]" 
                                        :required="f.isRequired"
                                        >
                                    </b-form-datepicker>
                                </b-form-group>
                                

                                <!-- Type DynamicDropdown -->
                                <b-form-group 
                                    v-else-if="f.type == 'DynamicDropdown'"
                                    class="mb-sm-2 mb-md-3"
                                    :label="(f.isRequired==true) ? f.label+' *' : f.label"  
                                    :label-for="f.name"
                                    >
                                    <b-form-select 
                                        :id="f.name"
                                        v-model="newEntry[f.name]" 
                                        :options="(f.target) ? f.options[newEntry[f.target]] : f.options"
                                        :required="f.isRequired"
                                        :disabled="(newEntry[f.target] == '') ? true : false"
                                        >
                                    </b-form-select>
                                </b-form-group>

                                <!-- Type pFileUpload -->
                                <b-form-group 
                                    v-else-if="f.type == 'pFileUpload'"
                                    class="mb-sm-2 mb-md-3"
                                    :label="(f.isRequired==true) ? f.label+' *' : f.label" 
                                    :label-for="f.name"
                                    >
                                    <p>Format ( {{ f.fTypes }} )</p>
                                    <b-form-file
                                        v-model="dummyFile[f.name]"
                                        :id="f.name"
                                        :state="Boolean(dummyFile[f.name])"
                                        :accept="f.fTypes"
                                        :required="f.isRequired"
                                        :multiple="f.isMultiple"
                                        placeholder="Choose a file or drop it here..."
                                        drop-placeholder="Drop file here..."
                                        ></b-form-file>
                                </b-form-group>

                                <!-- Type Text Field -->
                                <b-form-group 
                                    v-else 
                                    class="mb-sm-2 mb-md-4"
                                    :label="(f.isRequired==true) ? f.label+' *' : f.label" 
                                    :label-for="f.name"
                                    >
                                    <b-form-input
                                        :id="f.name"
                                        v-model="newEntry[f.name]"
                                        :type="textFormTypes[`${f.type}`]"
                                        :placeholder="(f.placeholder) ? f.placeholder : ''"
                                        :required="f.isRequired"
                                    ></b-form-input>
                                </b-form-group>

                            </b-col>
                        </b-row>
                        <b class="mt-5" style="font-size:14px"><i>Note </i>: * artinya wajib diisi.</b>
                        <hr class="w-100">
                        <center>
                            <p class="error-message" v-if="errorMessage !== ''">{{ errorMessage }}</p>
                            <button
                                class="button-submit mt-3"
                                type="submit"
                            >
                                Submit
                                <b-spinner 
                                    style="height: 16px; width: 16px;"
                                    class="ml-2"
                                    v-show="isSubmittingForm"
                                >
                                </b-spinner>
                            </button>
                        </center>
                    </b-form>
                </b-card>
            </b-col>
            <b-col class="text-center mt-5 p-5" cols="12">
                <hr style="max-width: 800px; background-color: black">
                <b>Jika terdapat pertanyaan, silahkan bertanya pada narahubung kami atau melalui: </b><br>
                <a
                    href="https://t.me/joinchat/Hwf24kqljuZmRGRF"
                    target="_blank"
                >
                    <b-button
                        size="lg"
                        class="mt-3"
                        variant="info"
                        style="border-radius: 20px"
                    >
                        Grup Telegram
                    </b-button>
                </a>
            </b-col>
        </b-row>
    </b-container>

    <b-container fluid class="footer">
        <!-- footer -->
        <b-row class="p-md-5 py-5">
            <b-col md="2"></b-col>
            <b-col cols="12" md="4" class="text-left">
                <p style="font-size: 14px">
                    Green Semanggi Mangroove C-14, <br>
                    Wonorejo Timur, Wonorejo, <br>
                    Rungkut, Surabaya
                </p>
            </b-col>
            <b-col cols="12" md="4" class="text-md-right">
                <p style="font-size: 14px">
                    cs@analitica.id<br>
                    +62 851-5696-9463<br>
                    <a 
                        href="https://docs.google.com/document/d/1oFV5O2_OM2OVpljmkEwf80fZQsUpGVyPp5K5hH5rsCY/edit?usp=drivesdk"
                        target="_blank"
                        class="normal-link"
                        >
                        Syarat dan Ketentuan
                    </a><br>
                    <a 
                        href="https://docs.google.com/document/d/1NZ9916B6QNibTPOxc9PwTk8_CymYF6YJoK6X8sQlXpM/edit?usp=drivesdk"
                        target="_blank"
                        class="normal-link"
                        >
                        Kebijakan Privasi
                    </a>
                </p>
            </b-col>
            <b-col md="2"></b-col>
        </b-row>
        <b-row class="px-md-5 pb-5">
            <b-col md="2"></b-col>
            <b-col cols="12" md="4" class="text-left">
                <img class="mb-2" src="../assets/logo-analitica-black.png" alt="Analitica Logo" style="max-height:40px"><br>
                <p>© 2021 Analitica. All Rights Reserved.</p>
            </b-col>
            <b-col cols="12" md="4" class="text-md-right">
                <a href="https://www.instagram.com/analitica.id/" target="_blank">
                    <b-icon class="mr-3 icon-media" icon="instagram"></b-icon>
                </a>
                <a href="https://www.facebook.com/analitica.id" target="_blank">
                    <b-icon class="mr-3 icon-media" icon="facebook"></b-icon>
                </a>
                <a href="https://twitter.com/analitica_id" target="_blank">
                    <b-icon class="icon-media" icon="twitter"></b-icon>
                </a>
            </b-col>
            <b-col md="2"></b-col>
        </b-row>
    </b-container>

    <!-- Modal Login -->
    <b-modal 
        centered 
        v-model="modal.modalLogin" 
        id="modal-login"
        title="Login Akun Analitica"
        hide-footer
        >
        <b-form @submit="login">
            <b-form-group 
                class="mb-sm-2 mb-md-4"
                label="Email" 
                label-for="email-analitica"
                >
                <b-form-input
                    id="email-analitica"
                    v-model="loginUser.email"
                    type="email"
                    placeholder="Isi email akun Analitica disini.."
                    :required="true"
                ></b-form-input>
            </b-form-group>
            <b-form-group 
                class="mb-sm-2 mb-md-4"
                label="Password" 
                label-for="password-analitica"
                >
                <b-form-input
                    id="password-analitica"
                    v-model="loginUser.password"
                    type="password"
                    placeholder="Isi password akun disini.."
                    :required="true"
                ></b-form-input>
            </b-form-group>
            <hr class="w-100">
            <center>
                <p class="error-message" v-if="errorModal !== ''">{{ errorModal }}</p>
                <button
                    class="button-submit mt-3"
                    type="submit"
                >
                    Login 
                    <b-spinner 
                        style="height: 16px; width: 16px;"
                        class="ml-2"
                        v-show="isSubmitting"
                    >
                    </b-spinner>
                </button>
            </center>
        </b-form>
    </b-modal>

    <!-- Modal Account Not Available -->
    <b-modal 
        centered 
        v-model="modal.modalNotAvailable" 
        id="modal-account-not-available"
        title="Peringatan"
        hide-footer
        >
        <div>
            Akun Analitica dengan email <b>{{ loginUser.email }}</b> sudah 
            pernah mengisi form ini. Kamu dapat mengganti akun
            Analitica lain jika tetap ingin mengisi form ini.
        </div>

        <hr class="w-100">
        <center>
            <button
                class="button-submit mt-3"
                @click="modal.modalNotAvailable = false; modal.modalLogin = true;"
            >
                Ganti Akun Lain
                <b-spinner 
                    style="height: 16px; width: 16px;"
                    class="ml-2"
                    v-if="isSubmitting"
                >
                </b-spinner>
            </button>
        </center>
    </b-modal>

  </div>
</template>

<script>

import firebase from '../plugins/firebase.js'

export default {
    name: 'Form',
    data(){
        return{
            query: [],
            form: "",
            fid: "",
            newEntry: {},
            dummyFile: [],
            textFormTypes:{
                "EmailField":"email",
                "TextField":"text",
            },
            isLoading: true,
            errorMessage: "",
            errorModal: "",
            loginRequired: false,
            currentUser: "",
            currentEmail: "",
            modal:{
                modalLogin: false,
                modalNotAvailable: false,
            },
            loginUser:{
                email: "",
                password: "",
            },
            isSubmitting: false,
            isMobile: false,
            isSubmittingForm: false,
        }
    },
    methods:{
        async onSubmit(event){
            const vm = this;
            const createFormResponse = firebase.app().functions('asia-southeast2').httpsCallable('createFormResponse');

            event.preventDefault()

            console.log(vm.newEntry)

            if(
                vm.currentUser == '' || 
                !vm.currentUser || 
                vm.currentEmail == '' || 
                !vm.currentEmail &&
                vm.loginRequired == true){
                vm.errorMessage = "Form ini mengharuskan kamu untuk login akun Analitica."
            }
            else{
                vm.isSubmittingForm = true;

                await createFormResponse({
                        entry: vm.newEntry,
                        fid: vm.fid,
                        uid: vm.currentUser.uid,
                    })
                    .then(() => {
                        if(vm.isMobile){
                            window.location.href="http://web.analitica.id/download"
                        }
                        else{
                            window.location.href="https://web.analitica.id/"
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        vm.isSubmittingForm = false;
                        vm.errorMessage = err;
                    })
            }

        },
        async login(event){
            const vm = this;
            const checkFormAvailability = firebase.app().functions('asia-southeast2').httpsCallable('checkFormAvailability');
            vm.errorModal = "";

            event.preventDefault();

            vm.isSubmitting = true;
            vm.errorModal = "";

            firebase.auth().signInWithEmailAndPassword(vm.loginUser.email, vm.loginUser.password)
                .then(async (userCredential) => {
                    // Signed in
                    var user = userCredential.user;

                    await checkFormAvailability({
                        uid: user.uid,
                        fid: vm.fid
                    })
                    .then(res => {
                        vm.isSubmitting = false;
                        
                        console.log(res.data)
                        if(res.data == 'notAvailable'){
                            vm.modal.modalLogin = false;
                            vm.modal.modalNotAvailable = true;
                        }
                        else{
                            vm.modal.modalLogin = false;
                            vm.errorMessage = "";
                            vm.currentUser = user;
                            vm.currentEmail = user.email;
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    vm.isSubmitting = false;
                    console.log(errorCode)

                    if(errorCode == 'auth/user-not-found'){
                        vm.errorModal = "Akun tersebut tidak ditemukan.";
                    }
                    else if(errorCode == 'auth/wrong-password'){
                        vm.errorModal = "Password salah.";
                    }
                    else if(errorCode == 'auth/too-many-requests'){
                        vm.errorModal = "Terlalu banyak percobaan login yang gagal, coba beberapa saat lagi."
                    }
                });
        }
    },
    async beforeMount(){
        const vm = this;
        const db = firebase.firestore();
        const MobileDetect = require('mobile-detect');
        const checkAnaliticaUser = firebase.app().functions('asia-southeast2').httpsCallable('checkAnaliticaUser');

        let md = new MobileDetect(window.navigator.userAgent);

        vm.query = vm.$route.query;
        vm.fid = vm.$route.params.fid;

        //checking for mobile/tablet
        if(md.mobile() || md.phone() || md.tablet() || md.is('iPhone')){
            vm.isMobile = true;
        }
        else{
            vm.isMobile = false;
        }


        await db.collection('sources/analitica/forms').doc(vm.fid)
                .get()
                .then(doc => {
                    console.log(doc.data())
                    vm.form = doc.data();
                })
                .catch(err => {
                    console.log(err)
                })
            
        vm.loginRequired = vm.form.loginRequired;

        vm.form.segments.forEach(f => {
            if(
                f.type !== 'HeaderText' && 
                f.type !== 'DescriptionText' && 
                f.type !== 'pFileUpload' && 
                f.type !== 'AnaliticaAccount' &&
                f.type !== 'Divider'
                ){
                vm.$set(vm.newEntry, f.name, "");
            }
            if(f.type == 'pFileUpload'){
                let fTypes = '';
                vm.$set(vm.dummyFile, f.name, []);
                
                f.fileTypes.forEach(ft => {
                    let type = '.'+ft.toLowerCase();
                    let type2 = '.'+ft.toUpperCase();
                    fTypes = fTypes + type + ', ' + type2 + ', ';
                })

               f.fTypes = fTypes;
            }
            Object.keys(vm.query).forEach(async q => {
                if(q == f.name){
                    vm.newEntry[f.name] = vm.query[q];
                }
            })
        })

        if(vm.query["uid"]){
            await checkAnaliticaUser({
                uid: vm.query["uid"]
            })
                .then(res => {
                    if(res.data.msg == "exists"){
                        vm.currentUser = res.data.data;
                        vm.currentEmail = vm.currentUser.email;
                    }
                    else{
                        console.log(res.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        
        vm.isLoading = false;
    }
}
</script>
<style>
    html, body, h1, h2, h3, h4, h5{
        font-family: 'Poppins', sans-serif !important;
    }
    .button-submit{
        background-color: #ec008c;
        color:white;
        border: solid 0px;
        padding: 10px;
        width: 200px;
        border-radius: 10px;
        cursor: pointer;
    }
    .row{
        margin-left: 0px !important;
        margin-right: 0px !important;
    }
    .footer{
        bottom: 0 !important;
        padding-top: 60px;
        border-top:solid 1px rgb(200,200,200);
    }
    .icon-media{
        font-size:22px;
        color: rgb(40,40,40);
        transition: 0.3s;
    }

    .icon-media:hover{
        color: #EC008C;
        text-decoration: none;
        transition: 0.3s;
    }

    .normal-link{
        color: rgb(40,40,40);
        transition: 0.3s;
        text-decoration: underline;
    }

    .normal-link:hover{
        color: #EC008C;
        transition: 0.3s;
    }

    .error-message{
        color: rgba(200,0,0);
    }
</style>
