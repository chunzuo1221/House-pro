<template>
  <div class="profile-page">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h1 class="text-center">Profile page</h1>
        <form @submit.prevent="saveProfile" class="form-horizontal">
          <div class="form-group">
            <label for="email" class="col-sm-3 control-label">Email</label>
            <div class="col-sm-7">
              <input type="email" name="email" id="email" readonly v-model="user.email" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label for="name" class="col-sm-3 control-label">First Name</label>
            <div class="col-sm-7">
              <input type="text" name="name" id="givenName" v-model="user.givenName" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label for="name" class="col-sm-3 control-label">Last Name</label>
            <div class="col-sm-7">
              <input type="text" name="name" id="familyName" v-model="user.familyName" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">Gender</label>
            <div class="col-sm-6">
              <label class="radio col-sm-4">
                <input type="radio" :checked="user.gender=='male'" v-model="user.gender" name="gender" value="male" data-toggle="radio" />
                <span class="gender-label">Male</span>
              </label>
              <label class="radio col-sm-4">
                <input type="radio" :checked="user.gender=='female'" v-model="user.gender" name="gender" value="female" data-toggle="radio" />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="col-sm-3 control-label">Day of Birth</label>
            <div class="col-sm-7">
              <el-date-picker
                v-model="user.birthdate"
                type="date"
                placeholder="Pick a day"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="alert alert-danger" v-if="errors.profile">{{errors.profile}}</div>
          <div class="alert alert-info" v-if="success.profile">Profile has been updated</div>
          <div class="form-group">
            <div class="col-sm-offset-3 col-sm-4">
              <button type="submit" class="btn btn btn-primary">
                <i class="fas fa-pencil-alt fa-sm"></i>Update Profile</button>
            </div>
          </div>
        </form>
        <div class="page-header">
          <h3>Change Password</h3>
        </div>
        <form @submit.prevent="changePassword" class="form-horizontal">
          <div class="form-group" :class="{'has-error': errors.changePassword.oldPassword}">
            <label for="oldPassword" class="col-sm-3 control-label">Old Password</label>
            <div class="col-sm-7">
              <input type="password" v-model="passwordForm.oldPassword" name="oldPassword" id="oldPassword" class="form-control" />
            </div>
          </div>
          <div class="form-group" :class="{'has-error': errors.changePassword.newPassword}">
            <label for="newPassword" class="col-sm-3 control-label">New Password</label>
            <div class="col-sm-7">
              <input type="password" v-model="passwordForm.newPassword" name="newPassword" id="newPassword" class="form-control"
              />
            </div>
          </div>
          <div class="alert alert-danger" v-if="errors.changePassword">{{errors.changePassword}}</div>
          <div class="alert alert-info" v-if="success.changePassword">Password has been changed</div>
          <div class="form-group">
            <div class="col-sm-offset-3 col-sm-4">
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-lock fa-sm"></i>Change Password</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { UPDATE_PROFILE, CHANGE_PASSWORD } from '@/store/action-types'
import moment from 'moment'

export default {
  name: 'Profile',
  data () {
    return {
      success: {
        profile: false,
        changePassword: false
      },
      errors: {
        profile: false,
        changePassword: false
      },
      passwordForm: {
        oldPassword: '',
        newPassword: ''
      },
      user: {
        email: '',
        givenName: '',
        familyName: '',
        gender: '',
        birthdate: new Date()
      }
    }
  },
  mounted () {
    this.user.email = this.userInfo.email
    this.user.givenName = this.userInfo.givenName
    this.user.familyName = this.userInfo.familyName
    this.user.gender = this.userInfo.gender
    const birthdate = moment(this.userInfo.birthdate)
    if (birthdate.isValid()) {
      this.user.birthdate = birthdate.toDate()
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    async saveProfile () {
      try {
        const birthdate = this.user.birthdate.toISOString()
        await this.$store.dispatch(UPDATE_PROFILE, {
          ...this.user,
          birthdate: birthdate.substring(0, birthdate.indexOf('T'))
        })
        this.success.profile = true
      } catch (error) {
        this.errors.profile = JSON.stringify(error)
      }
    },
    async changePassword () {
      try {
        await this.$store.dispatch(CHANGE_PASSWORD, this.passwordForm)
        this.success.changePassword = true
        this.errors.changePassword = false
      } catch (error) {
        this.success.changePassword = false
        this.errors.changePassword = error.message
      }
    }
  }
}
</script>

<style scoped>
label span {
  color: inherit;
}
.btn-danger {
  background-color: #d9534f !important;
  border-color: #d43f3a !important;
}
.form-control[readonly] {
  background: #eee !important;
}
.form-control[readonly]:focus {
  box-shadow: none;
}
</style>
