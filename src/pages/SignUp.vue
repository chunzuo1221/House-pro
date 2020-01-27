<template>
  <div class="sign-up">
    <div class="mb-1 row">
      <div class="col-sm-5 side-img">
      </div>
      <div class="col-sm-7 pt-3 pb-1 pull-right">
        <div><a class="close" href="javascript:;" @click="onCloseClicked">×</a></div>
        <div class="text-center mt-3">
          <img src="/static/images/logo-housepro-white.png" alt="" class="logo2 pb-1">
        </div>
        <div class="top-border-line dark-blue-color pt-2 big-font pl-1">
          The HousePro Property Analysis Dashboard provides a suite of tool and reports that will allow you to gain a deeper insight into the property locations you are interested in, including:
        </div>
        <div class="ml-3 dark-blue-color big-font mt-2">
          <ul>
            <li>Insights into the proximity of local services</li>
            <li>Property Comparisons</li>
            <li>Access to Land and House Reports</li>
          </ul>
        </div>
        <div class="text-center">
          <button class="btn btn-sucess btn-sing-up" @click.prevent="openRegister">SIGN-UP HERE(IT'S FREE!)</button>
        </div>
        <div class="text-center">
          <img src="/static/images/surrounding_icon.png" class="mt-1" alt="">
        </div>
        <div class="top-border-line dark-blue-color mt-2 text-center">
          <span>Already have an account?</span>
        </div>
        <div class="text-center">
          <button class="btn btn-sucess btn-login" @click.prevent="openLogin">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cognito from '@/api/cognito'

export default {
  name: 'SignUp',
  methods: {
    onCloseClicked () {
      this.$emit('close')
    },
    openLogin () {
      Cognito.login()
    },
    openRegister () {
      Cognito.signUp()
    }
  }
}
</script>
<style scoped>
.sign-up {
  margin-right: 15px;
}
.sign-up .logo2{
  min-height: 50px;
}
.sign-up .close {
  position: absolute;
  top: 10px;
  right: 20px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  cursor: pointer;
}
.sign-up .close:hover {
  color: orange;
}
.sign-up .side-img {
  height: 100%;
  position: absolute;
  background-image: url("/static/images/side_map.jpg");
}
.btn-sing-up {
  font-size: 20px;
  font-weight: 600;
  border-radius: 0px;
}
.btn-login {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 70px;
  padding-right: 70px;
  margin-top: 8px;
  border-radius: 0px;
}
.dark-blue-color {
  color: #528EC1;
}
.top-border-line {
  border-top: solid 3px #528ec1;
}
.big-font {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
}
ul, ol {
  margin-bottom: 15px;
}
</style>
