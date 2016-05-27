<template>
  <header v-if="user">
    <input placeholder="Search" v-model="searchQuery" debounce="500">
    <div>
      <span>{{user.userTitle}}</span>
      <img :src="user.imageUrl" alt="{{user.userTitle}}"/>
      <i class="fa fa-sign-out" aria-hidden="true" v-on:click="signOut"></i>
    </div>
  </header>
</template>
<script>
import Auth from 'src/data/Auth'
export default {
  data () {
    return {
      user: null,
      searchQuery: ''
    }
  },
  watch: {
    'searchQuery': function () {
      this.$dispatch('search', this.searchQuery)
    }
  },
  methods: {
    processUser (authed) {
      console.log(authed)
      if (authed === null) {
        this.user = null
        return
      }
      switch (authed.provider) {
        case 'password':
          this.user = {
            userTitle: authed.password.email,
            imageUrl: authed.password.profileImageURL
          }
          break
        default:
          this.user = {
            userTitle: authed[authed.provider].displayName,
            imageUrl: authed[authed.provider].profileImageURL
          }
          break
      }
    },
    signOut () {
      Auth.signOut()
      this.$router.go('auth')
    }
  },
  ready () {
    Auth.onAuth(this.processUser) // processUser everytime auth state changes (signs in or out)
    this.processUser(Auth.getAuth()) // processUser in case user is already signed in
  }
}
</script>
<style>
header{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1;
  height: 50px;
  background: #333;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,.4);
}
header input {
  display: block;
  width: 480px;
  margin: 0 auto;
  height: 30px;
  border: none;
  padding: 0 16px;
  border-radius: 2px;
}
header span {
  padding: 15px;
  color: #fff;
  position: absolute;
  right: 95px;
  top: 1px;
}
header img {
  width: 35px;
  height: 35px;
  border-radius: 20px;
  position: absolute;
  right: 60px;
  top: 8px;
}
header i.fa {
  position: absolute;
  display: block;
  color: #fff;
  right: 15px;
  top: 13px;
  font-size: 25px;
  cursor: pointer;
}
@media screen and (max-width: 1200px) {
  header span{
    display: none;
  }
}
@media screen and (max-width: 720px) {
  header input{
    width: calc(100% - 64px);
    margin: 0 0 0 16px;
  }
  header span, header img {
    display: none;
  }
}
</style>
