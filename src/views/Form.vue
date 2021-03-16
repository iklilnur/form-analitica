<template>
  <div>
    <b-container
      fluid
      v-if="isLoading"
      style="
        min-height: 100vh !important;
        background-color: #f4f7fb;
        padding-right: 0px;
        padding-left: 0px;
      "
    >
      <b-row align-v="center" style="min-height: 100vh">
        <b-col align-self="center" class="text-center">
          <b-spinner
            style="width: 3rem; height: 3rem"
            label="Large Spinner"
            v-if="isLoading"
          >
          </b-spinner>
          <p v-if="accountAlreadySubmitted">
            Akun Analitica dengan email <b>{{ loginUser.email }}</b> sudah
            pernah mengisi form ini. Kamu dapat mengganti akun Analitica lain
            jika tetap ingin mengisi form ini.
          </p>
        </b-col>
      </b-row>
    </b-container>

    <b-container
      fluid
      v-if="!isLoading"
      style="
        background-color: #f4f7fb;
        padding-bottom: 50px;
        padding-right: 0px;
        padding-left: 0px;
      "
    >
      <section
        id="logo"
        class="vc_row pb-150 main-footer"
        style="background-color: #4d4e84; background-repeat: repeat"
      >
        <div class="container">
          <div class="row text-center pt-5" id="logo">
            <div class="col text-center">
              <img
                class="text-center"
                src="../assets/golden-ticket-logo-bismillah-fix-alhamdulillah2.png"
                style="width: 100%; max-width: 400px"
              />
            </div>
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container -->
      </section>

      <section id="form">
        <b-row
          style="background-color: #f4f7fb"
          class="w-100 py-5 p-md-5"
          align-v="center"
        >
          <b-col md="12">
            <b-card
              class="p-sm-1 p-md-5 mx-sm-1 mx-md-auto"
              style="
                margin-top: -12%;
                box-shadow: 0px 0px 10px 0px rgb(59 115 197 / 25%);
                max-width: 700px;
                border-radius: 3em;
              "
            >
              <b-form v-if="!accountAlreadySubmitted" @submit="onSubmit">
                <b-row v-for="f in form.segments" :key="f.name">
                  <b-col cols="12" class="text-left">
                    <!-- Type HeaderText -->
                    <h4
                      class="text-center mt-3 mb-5"
                      v-if="f.type == 'HeaderText'"
                    >
                      {{ f.text }}
                    </h4>

                    <!-- Type DescriptionText -->
                    <p
                      class="text-justify mt-3 mb-3"
                      v-else-if="f.type == 'DescriptionText'"
                    >
                      {{ f.text }}
                    </p>

                    <!-- Type LinkText -->
                    <a
                      v-else-if="f.type == 'LinkText'"
                      class="mb-3 mt-3"
                      :href="f.link"
                    >
                      {{ f.text }}
                    </a>

                    <!-- Type Divider -->
                    <hr
                      v-else-if="f.type == 'Divider'"
                      class="w-100 mb-4 mt-4"
                    />

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
                      :label="f.isRequired == true ? f.label + ' *' : f.label"
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
                      :label="f.isRequired == true ? f.label + ' *' : f.label"
                      :label-for="f.name"
                    >
                      <b-form-datepicker
                        :id="f.name"
                        v-model="newEntry[f.name]"
                        :required="f.isRequired"
                      >
                      </b-form-datepicker>
                    </b-form-group>

                    <!-- Type SingleCheckBox -->
                    <b-form-checkbox-group
                      v-else-if="f.type == 'SingleCheckBox'"
                      :options="[f.text]"
                      :id="f.name"
                      :checked="[]"
                      v-model="dummySingleCheckBox[f.name]"
                      :required="true"
                    >
                    </b-form-checkbox-group>

                    <!-- Type DynamicDropdown -->
                    <b-form-group
                      v-else-if="f.type == 'DynamicDropdown'"
                      class="mb-sm-2 mb-md-3"
                      :label="f.isRequired == true ? f.label + ' *' : f.label"
                      :label-for="f.name"
                    >
                      <b-form-select
                        :id="f.name"
                        v-model="newEntry[f.name]"
                        :options="
                          f.target ? f.options[newEntry[f.target]] : f.options
                        "
                        :required="f.isRequired"
                        :disabled="newEntry[f.target] == '' ? true : false"
                      >
                      </b-form-select>
                    </b-form-group>

                    <!-- Type pFileUpload -->
                    <b-form-group
                      v-else-if="f.type == 'pFileUpload'"
                      class="mb-sm-2 mb-md-3"
                      :label="f.isRequired == true ? (f.label + f.multipleLabel + ' *') : (f.label + f.multipleLabel)"
                      :label-for="f.name"
                    >
                      <p style="font-size:16px;">
                        Format ( {{ f.fTypesLabel }} )
                      </p>
                      <p style="font-size:12px; line-height: 1.3em;">
                          <b>
                            Apabila file tidak bisa diupload/ditekan, 
                            silahkan klik tombol “…” dipojok kanan atas 
                            aplikasi dan buka di browser lain.
                          </b>
                      </p>

                      <vue-dropzone
                        v-if="f.isMultiple"
                        :ref="f.name"
                        :id="f.name"
                        :options="f.fOptions"
                      ></vue-dropzone>
                      <b-form-file
                        v-else
                        v-model="dummyFile[f.name]"
                        :id="f.name"
                        :state="Boolean(dummyFile[f.name])"
                        :accept="f.fTypes"
                        :required="f.isRequired"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."
                      ></b-form-file>
                    </b-form-group>

                    <!-- Type Text Field -->
                    <b-form-group
                      v-else
                      class="mb-sm-2 mb-md-4"
                      :label="f.isRequired == true ? f.label + ' *' : f.label"
                      :label-for="f.name"
                    >
                      <b-form-input
                        :id="f.name"
                        v-model="newEntry[f.name]"
                        :type="textFormTypes[`${f.type}`]"
                        :placeholder="f.placeholder ? f.placeholder : ''"
                        :required="f.isRequired"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <p class="mt-5" style="font-size: 14px">
                  <b><i>Note </i>: * artinya wajib diisi.</b>
                </p>
                <hr class="w-100" />
                <center>
                  <p class="error-message" v-if="errorMessage !== ''">
                    {{ errorMessage }}
                  </p>
                  <button class="button-submit mt-3" type="submit">
                    Submit
                    <b-spinner
                      style="height: 16px; width: 16px"
                      class="ml-2"
                      v-show="isSubmittingForm"
                    >
                    </b-spinner>
                  </button>
                </center>
              </b-form>
              <b-card-text class="text-center" v-else>
                Akun kamu sudah terdaftar pada tryout ini. Silahkan cek di
                aplikasi Analitica kamu.
              </b-card-text>
            </b-card>
          </b-col>
          <b-col class="text-center mt-5 p-5" cols="12">
            <hr style="max-width: 800px; background-color: black" />
            <b
              >Jika terdapat pertanyaan, silahkan bertanya pada narahubung kami
              atau melalui: </b
            ><br />
            <a href="https://t.me/joinchat/Hwf24kqljuZmRGRF" target="_blank">
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
      </section>
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
        <hr class="w-100" />
        <center>
          <p class="error-message" v-if="errorModal !== ''">{{ errorModal }}</p>
          <button class="button-submit mt-3" type="submit">
            Login
            <b-spinner
              style="height: 16px; width: 16px"
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
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
    >
      <div>
        Akun Analitica dengan email <b>{{ loginUser.email }}</b> sudah pernah
        mengisi form ini. Kamu dapat mengganti akun Analitica lain jika tetap
        ingin mengisi form ini.
      </div>

      <hr class="w-100" />
      <center>
        <button
          class="button-submit mt-3"
          @click="
            modal.modalNotAvailable = false;
            modal.modalLogin = true;
          "
        >
          Ganti Akun Lain
          <b-spinner
            style="height: 16px; width: 16px"
            class="ml-2"
            v-if="isSubmitting"
          >
          </b-spinner>
        </button>
      </center>
    </b-modal>

    <footer id="contact" class="main-footer pt-80">
      <section class="pb-10">
        <div class="container">
          <div class="row">
            <div class="lqd-column col-md-5">
              <h6
                class="mt-0 mb-1 font-size-14 text-uppercase font-weight-bold ltr-sp-2 text-secondary"
              >
                Analitica
              </h6>
              <h2 class="mt-0 text-white font-size-2-5x lh-13">
                Platform Tryout Online Terbaik
              </h2>
              <p class="mb-60">
                Platform Edukasi yang dirancang khusus untuk persiapan ujian
                seperti UTBK SBMPTN, Ujian Mandiri, Kedinasan, CPNS dan
                Olimpiade.
              </p>
            </div>
            <div class="lqd-column col-md-7">
              <p
                class="font-size-18 lh-13 text-white"
                style="text-align: right !important"
              >
                Green Semanggi Mangroove C-14,<br />
                Wonorejo Timur, Wonorejo,<br />
                Rungkut, Surabaya<br />
              </p>
              <p
                class="font-size-18 lh-13"
                style="
                  color: #fff;
                  font-weight: 300 !important;
                  text-align: right;
                "
              >
                cs@analitica.id <br />
                +62 851-5696-9463 <br />
                <a
                  href="https://docs.google.com/document/d/1oFV5O2_OM2OVpljmkEwf80fZQsUpGVyPp5K5hH5rsCY/edit?usp=drivesdk"
                  target="_blank"
                >
                  Syarat dan Ketentuan </a
                ><br />
                <a
                  href="https://docs.google.com/document/d/1NZ9916B6QNibTPOxc9PwTk8_CymYF6YJoK6X8sQlXpM/edit?usp=drivesdk"
                  target="_blank"
                >
                  Kebijakan Privasi
                </a>
              </p>

              <ul
                class="social-icon scheme-white social-icon-md"
                style="text-align: right"
              >
                <li>
                  <a
                    href="https://www.instagram.com/analitica.id/"
                    target="_blank"
                    ><i class="fa fa-instagram"></i
                  ></a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/analitica.id"
                    target="_blank"
                    ><i class="fa fa-facebook"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.twitter.com/analitica_id" target="_blank"
                    ><i class="fa fa-twitter"></i
                  ></a>
                </li>

                <li>
                  <a href="https://blog.analitica.id" target="_blank"
                    ><i class="fa fa-wordpress"></i
                  ></a>
                </li>
              </ul>
            </div>
            <!-- /.col-md-3 -->

            <!-- /.col-md-8 col-md-offset-1 -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container -->
      </section>

      <section class="pt-35 pb-35" style="background-color: #060742">
        <div class="container">
          <div class="row d-flex flex-wrap align-items-center">
            <div
              class="lqd-column col-md-4 text-center text-md-left mb-4 mb-md-0"
            >
              <ul class="lqd-custom-menu reset-ul inline-nav font-size-14">
                <li><a href="#">Dokumen Press Rilis</a></li>
                <li>
                  <a
                    href="https://api.whatsapp.com/send/?phone=6285156969463&text&app_absent=0"
                    >Kontak</a
                  >
                </li>
                <li>
                  <a
                    href="https://docs.google.com/document/d/1oFV5O2_OM2OVpljmkEwf80fZQsUpGVyPp5K5hH5rsCY/edit?usp=drivesdk"
                    >Syarat dan Ketentuan</a
                  >
                </li>
              </ul>
            </div>
            <!-- /.col-md-4 -->

            <div class="lqd-column col-md-4 text-center mb-4 mb-md-0">
              <figure>
                <img
                  src="https://jtvgoldenticket.analitica.id/assets/img/logo/logo-analitica-light.png"
                  alt="Analitica"
                />
              </figure>
            </div>
            <!-- /.col-md-4 -->

            <div class="lqd-column col-md-4 text-center text-md-right">
              <p class="my-0">
                <span style="font-size: 15px">© 2021 Analitica</span>
              </p>
            </div>
            <!-- /.col-md-4 text-md-right -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container -->
      </section>
    </footer>
  </div>
</template>

<script>
import vueDropzone from "vue2-dropzone";
import firebase from "../plugins/firebase.js";

export default {
  name: "Form",
  data() {
    return {
      query: [],
      form: "",
      fid: "",
      newEntry: {},
      dummyFile: {},
      dummySingleCheckBox: {},
      textFormTypes: {
        EmailField: "email",
        TextField: "text",
      },
      isLoading: true,
      errorMessage: "",
      errorModal: "",
      loginRequired: false,
      currentUser: "",
      currentEmail: "",
      modal: {
        modalLogin: false,
        modalNotAvailable: false,
      },
      loginUser: {
        email: "",
        password: "",
      },
      isSubmitting: false,
      isMobile: false,
      isSubmittingForm: false,
      accountAlreadySubmitted: false,
    };
  },
  components: {
    vueDropzone,
  },
  methods: {
    async onSubmit(event) {
      const vm = this;
      const createFormResponse = firebase
        .app()
        .functions("asia-southeast2")
        .httpsCallable("createFormResponse");

      console.log("tes");
      vm.errorMessage = "";

      event.preventDefault();

      let submitOk = true;

      vm.form.segments.forEach((f) => {
        if (f.type == "pFileUpload") {
          if (f.isMultiple == true && f.isRequired == true) {
            if (
              vm.$refs[f.name][0].getAcceptedFiles().length > 0 &&
              vm.$refs[f.name][0].getUploadingFiles().length == 0
            ) {
              submitOk = true;
            } else {
              submitOk = false;
              vm.errorMessage =
                "Terdapat file wajib yang belum diupload atau sedang proses upload.";
            }
          }
        }
      });

      if (
        vm.currentUser == "" ||
        !vm.currentUser ||
        vm.currentEmail == "" ||
        (!vm.currentEmail && vm.loginRequired == true)
      ) {
        vm.errorMessage =
          "Form ini mengharuskan kamu untuk login akun Analitica.";
      } else if (submitOk == true) {
        vm.isSubmittingForm = true;

        await createFormResponse({
          entry: vm.newEntry,
          fid: vm.fid,
          uid: vm.currentUser.uid,
        })
          .then(() => {
            if (vm.isMobile) {
              window.location.href = "http://web.analitica.id/download";
            } else {
              window.location.href = "https://web.analitica.id/";
            }
          })
          .catch((err) => {
            console.log(err);
            vm.isSubmittingForm = false;
            vm.errorMessage = err;
          });
      }
    },
    async login(event) {
      const vm = this;
      const checkFormAvailability = firebase
        .app()
        .functions("asia-southeast2")
        .httpsCallable("checkFormAvailability");
      vm.errorModal = "";

      event.preventDefault();

      vm.isSubmitting = true;
      vm.errorModal = "";

      firebase
        .auth()
        .signInWithEmailAndPassword(vm.loginUser.email, vm.loginUser.password)
        .then(async (userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log(vm.fid);

          await checkFormAvailability({
            uid: user.uid,
            fid: vm.fid,
          })
            .then((res) => {
              vm.isSubmitting = false;

              console.log(res.data);
              if (res.data == "notAvailable") {
                vm.modal.modalLogin = false;
                vm.modal.modalNotAvailable = true;
              } else {
                vm.modal.modalLogin = false;
                vm.errorMessage = "";
                vm.currentUser = user;
                vm.currentEmail = user.email;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          vm.isSubmitting = false;
          console.log(errorCode);

          if (errorCode == "auth/user-not-found") {
            vm.errorModal = "Akun tersebut tidak ditemukan.";
          } else if (errorCode == "auth/wrong-password") {
            vm.errorModal = "Password salah.";
          } else if (errorCode == "auth/too-many-requests") {
            vm.errorModal =
              "Terlalu banyak percobaan login yang gagal, coba beberapa saat lagi.";
          }
        });
    },
    cekDropzone() {
      const vm = this;
      vm.form.segments.forEach((f) => {
        if (f.type == "pFileUpload") {
          if (f.isMultiple == true) {
            console.log(vm.$refs[f.name][0]);
            console.log(vm.$refs[f.name][0].getAcceptedFiles());
          }
        }
      });
    },
  },
  async beforeMount() {
    const vm = this;
    const db = firebase.firestore();
    const MobileDetect = require("mobile-detect");
    const checkFormAvailability = firebase
      .app()
      .functions("asia-southeast2")
      .httpsCallable("checkFormAvailability");
    const checkAnaliticaUser = firebase
      .app()
      .functions("asia-southeast2")
      .httpsCallable("checkAnaliticaUser");

    let md = new MobileDetect(window.navigator.userAgent);

    vm.query = vm.$route.query;
    vm.fid = vm.$route.params.fid;

    //checking for mobile/tablet
    if (md.mobile() || md.phone() || md.tablet() || md.is("iPhone")) {
      vm.isMobile = true;
    } else {
      vm.isMobile = false;
    }

    await db
      .collection("sources/analitica/forms")
      .doc(vm.fid)
      .get()
      .then((doc) => {
        console.log(doc.data());
        vm.form = doc.data();
      })
      .catch((err) => {
        console.log(err);
      });

    vm.loginRequired = vm.form.loginRequired;

    vm.form.segments.forEach((f) => {
      if (
        f.type !== "HeaderText" &&
        f.type !== "DescriptionText" &&
        f.type !== "pFileUpload" &&
        f.type !== "AnaliticaAccount" &&
        f.type !== "Divider" &&
        f.type !== "SingleCheckBox" &&
        f.type !== "LinkText"
      ) {
        vm.$set(vm.newEntry, f.name, "");
      }
      if (f.type == "pFileUpload") {
        let fTypes = "";
        let fTypesLabel = "";
        vm.$set(vm.dummyFile, f.name, []);

        f.fileTypes.forEach((ft) => {
          let type = "." + ft.toLowerCase();
          let type2 = "." + ft.toUpperCase();
          fTypes = fTypes + type + ", " + type2 + ", ";
          fTypesLabel = fTypesLabel + type + ", ";
        });

        f.fOptions = {
          url: "https://httpbin.org/post",
          maxFilesize: f.maxSize, // MB
          addRemoveLinks: true,
          acceptedFiles: fTypes,
        };

        f.fTypes = fTypes;
        f.fTypesLabel = fTypesLabel;

        f.multipleLabel = ""

        if(f.isMultiple == true){
          f.multipleLabel = " (bisa upload lebih dari 1 file)"
        }
      }
      if (f.type == "SingleCheckBox") {
        vm.$set(vm.dummySingleCheckBox, f.name, false);
      }
      Object.keys(vm.query).forEach((q) => {
        if (q == f.name) {
          vm.newEntry[f.name] = vm.query[q];
        }
      });
    });

    if (vm.query["uid"]) {
      await checkAnaliticaUser({
        uid: vm.query["uid"],
      })
        .then(async (res) => {
          if (res.data.msg == "exists") {
            let user = res.data.data;

            await checkFormAvailability({
              uid: user.uid,
              fid: vm.fid,
            })
              .then((res) => {
                vm.isSubmitting = false;
                if (res.data == "notAvailable") {
                  vm.accountAlreadySubmitted = true;
                  vm.loginUser.email = user.email;
                } else {
                  vm.errorMessage = "";
                  vm.currentUser = user;
                  vm.currentEmail = vm.currentUser.email;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    vm.isLoading = false;
  },
};
</script>
<style>
@media screen and (max-width: 600px) {
  .card {
    margin-top: -25% !important;
  }
}
.dropzone {
  border-style: dotted !important;
  border-color: rgb(0, 195, 255) !important;
}
@font-face {
  font-family: "Glacial Indifference";
  src: url("https://analitica.dimsa.dev/goldenticket-unair/assets/fonts/GlacialIndifference-Regular.woff2")
      format("woff2"),
    url("https://analitica.dimsa.dev/goldenticket-unair/assets/fonts/GlacialIndifference-Regular.woff")
      format("woff");
  font-weight: normal;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: "Glacial Indifference";
  src: url("https://analitica.dimsa.dev/goldenticket-unair/assets/fonts/GlacialIndifference-Bold.woff2")
      format("woff2"),
    url("https://analitica.dimsa.dev/goldenticket-unair/assets/fonts/GlacialIndifference-Bold.woff")
      format("woff");
  font-weight: bold;
  font-display: swap;
  font-style: normal;
}
html,
body {
  max-width: 100vw;
}
.text-secondary {
  color: #ff546c !important;
}
h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3,
.h4,
.h5,
.h6 {
  font-weight: 700 !important;
}

body {
  font-family: Glacial Indifference !important;
  font-weight: 400 !important;
  line-height: 1.7 !important;
  font-size: 18px !important;
  color: #8b8cb3 !important;
}

.button-submit {
  background-color: #ec008c;
  color: white;
  border: solid 0px;
  padding: 10px;
  width: 200px;
  border-radius: 10px;
  cursor: pointer;
}
.row {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.footer {
  bottom: 0 !important;
  padding-top: 60px;
  border-top: solid 1px rgb(200, 200, 200);
}
.icon-media {
  font-size: 22px;
  color: rgb(40, 40, 40);
  transition: 0.3s;
}

.icon-media:hover {
  color: #ec008c;
  text-decoration: none;
  transition: 0.3s;
}

.normal-link {
  color: rgb(40, 40, 40);
  transition: 0.3s;
  text-decoration: underline;
}

.normal-link:hover {
  color: #ec008c;
  transition: 0.3s;
}

.error-message {
  color: rgba(200, 0, 0);
}
</style>
