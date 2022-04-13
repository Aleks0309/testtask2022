<template>
  <div class="get-wrapper position-relative" id="singup">
    <h1>Working with POST request</h1>
    <form action="" method="post" @submit.prevent="submitData" class="needs-validation form-wrapper mx-auto mb-0" novalidate>

      <div class="form-group">
        <input
            type="text" class="f-control" id="uname" placeholder="Your name" required autocomplete="off"
            v-model="uname"
            :class="{ 'is-invalid': ($v.uname.$dirty && !$v.uname.required) || ($v.uname.$dirty && !$v.uname.minLength) || ($v.uname.$dirty && !$v.uname.maxLength) || ($v.uname.$dirty && !$v.uname.alpha)  }"
        >
        <div class="invalid-feedback w-auto">
          Please provide a valid name.(only latters)
        </div>
      </div>

      <div class="form-group">
        <input
            type="email" class="f-control" id="uemail" placeholder="Email" required autocomplete="off"
            v-model.trim="uemail"
            :class="{ 'is-invalid': ($v.uemail.$dirty && !$v.uemail.required) || ($v.uemail.$dirty && !$v.uemail.email) }"
        >
        <div class="invalid-feedback w-auto">
          Please provide a valid email.
        </div>
      </div>

      <div class="form-group">
        <the-mask
            :mask="['+380#########']"
            class="f-control" id="uphone" placeholder="Phone" aria-describedby="phoneHelp" required autocomplete="off"
            v-model="enterPhone"
            @input="putPhone"
            :class="{ 'is-invalid': ($v.uphone.$dirty && !$v.uphone.required) || ($v.uphone.$dirty && !$v.uphone.minLength)}"
        />
        <div class="invalid-feedback w-auto">
          Please provide a valid phone. +38 (XXX) XXX - XX - XX
        </div>
      </div>

      <div class="positions text-left">
        <div style="margin-bottom: 8px">
          <span>Select your positions</span>
        </div>
        <div
            class="pos"
            v-for="position in POSITIONS"
            :key="position.id"
        >
          <input
              type="radio" :id="position.id" name="pos" :value="position.id"
              v-model="uposition"
          >
          <label :for="position.id">{{ position.name }}</label>
        </div>
        <small
            class="invalid"
            v-if="$v.uposition.$dirty && !$v.uposition.required"
        >
          Select one position</small>
      </div>

      <div class="u-photo text-left" :class="{ 'photo-invalid': ($v.photo.$dirty && !$v.photo.required) || ($v.fileSize.$dirty && !$v.fileSize.maxValue) || ($v.fileType.$dirty && !$v.fileType.isJpg) }">
        <label for="u-photo">{{ fileName }}</label>
        <input
            type="file" name="u-photo" id="u-photo" @change="getFile"
        >
      </div>

      <button type="submit" style="display: none"></button>
      <div class="mybutton mx-auto" style="margin-top: 45px" @click="sendForm">Sign up</div>

    </form>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import { email, required, minLength, maxLength, alpha, maxValue } from "vuelidate/lib/validators";
import { isJpg } from "@/validators";

export default {
  name: "PostRequest",
  data: () => ({
    uname: "",
    uemail: "",
    code: "+380",
    enterPhone:"",
    uphone: "",
    uposition: '',
    photo: "",
    fileName: "Upload your photo",
    fileSize: "",
    fileType: ""
  }),
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    uname: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(60),
      alpha,
    },
    uemail: { required, email },
    uphone: { required, minLength: minLength(13) },
    uposition: { required },
    photo: { required },
    fileSize: {
      required,
      maxValue: maxValue(5242880)
    },
    fileType: { isJpg },
  },
  computed: {
    ...mapGetters([
      'POSITIONS',
      'TOKEN'
    ])
  },
  methods: {
    ...mapActions([
      'GET_POSITIONS_FROM_API',
      'GET_TOKEN_FROM_API',
      'POST_USER_TO_API'
    ]),
    putPhone(){
      if(this.enterPhone){
        this.uphone = this.code + this.enterPhone
      }
    },
    getFile(){
      let file = document.querySelector('#u-photo').files[0];
      this.photo = file;
      this.fileName = file.name;
      this.fileSize = file.size;
      this.fileType = file.type;
    },
    async submitData(){
      if (this.$v.$invalid){
        this.$v.$touch()
        console.log('error')
        return
      }
      const getToken = await this.GET_TOKEN_FROM_API();
      const formData = {
        name: this.uname,
        email: this.uemail,
        phone: this.uphone,
        position_id: this.uposition,
        token: getToken.data.token
      }
      await this.POST_USER_TO_API(formData)
    },
    sendForm() {
      document.querySelector('button[type="submit"]').click()
    }
  },
  mounted() {
    this.GET_POSITIONS_FROM_API();
  }
}
</script>

<style lang="scss">

  .form-wrapper{
    max-width: 380px;
    margin: 50px 0;
  }

  .invalid{
    margin-top: 0.25rem;
    font-size: 80%;
    color: #dc3545;
    position: absolute;
    text-align: left;
  }

  //Form style

  .f-control{
    display: block;
    width: 100%;
    height: auto;
    padding: 14px 16px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:focus {
      color: #495057;
      background-color: #fff;
      outline: 0;
    }
  }
  .f-control.is-invalid {
    border-color: #dc3545;
    padding-right: calc(1.5em + 0.75rem);
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  //radioButton
  .pos {
    display: flex;
    align-items: center;
    position: relative;
    label{
      height: 25px;
      cursor: pointer;
      &:before{
        content: "";
        display: inline-block;
        position: relative;
        top: 5px;
        margin: 0 12px 0 0;
        width: 20px;
        height: 20px;
        border-radius: 11px;
        border: 1px solid #D0CFCF;
        background-color: transparent;
      }
    }
    input[type='radio']{
      display: none !important;
    }
  }
  .pos input[type=radio]:checked + label:after {
    content: "";
    border-radius: 11px;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 50%;
    transform: translateY(-70%);
    left: 5px;
    display: block;
    background: #00BDD3;
  }
  .pos input[type=radio]:checked + label:before {
    border-color: #00BDD3;
  }

  //Download photo

  .u-photo{
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
    label {
      height: 54px;
      cursor: pointer;
      position: relative;
      width: calc(100% - 83px);
      color: #7E7E7E;
      border: 1px solid #D0CFCF;
      border-left: none;
      box-sizing: border-box;
      border-radius: 0 4px 4px 0;
      font-size: 16px;
      line-height: 26px;
      padding: 14px 16px;
      &:before {
        content: "Upload";
        height: 54px;
        width: 83px;
        color: #000;
        position: absolute;
        top: -1px;
        right: 100%;
        font-size: 16px;
        line-height: 26px;
        padding: 14px 16px;
        border: 1px solid #000;
        border-radius: 4px 0 0 4px;
        box-sizing: border-box;
      }
    }
    input{
      display: none;
    }
  }

  .photo-invalid{
    label{
      border: 1px solid #dc3545;
      &:before{
        border: 1px solid #dc3545;
      }
    }
  }



</style>