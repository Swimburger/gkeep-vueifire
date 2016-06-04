<template lang="pug">
  header(v-if="user")
    input(placeholder="Search" v-model="searchQuery" debounce="500")

    div
      span {{user.userTitle}}

      img(v-bind:src="user.imageUrl" alt="{{user.userTitle}}")

      a(href="#" @click.prevent="signOut")
        i.fa.fa-sign-out(aria-hidden="true")
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
      if (authed === null) {
        this.user = null
        return
      }
      this.user = {
        userTitle: authed[authed.provider].displayName || authed[authed.provider].email || '', // if there's no displayName, take the email, if there's no email, use an empty string
        imageUrl: authed[authed.provider].profileImageURL
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
<style lang="sass">
header
  position: fixed
  left: 0
  top: 0
  right: 0
  z-index: 1
  height: 50px
  background: #333
  padding: 10px
  box-shadow: 0 2px 5px rgba(0,0,0,.4)

  input
    display: block
    width: 480px
    margin: 0 auto
    height: 30px
    border: none
    padding: 0 16px
    border-radius: 2px

  span
    padding: 15px
    color: #fff
    position: absolute
    right: 95px
    top: 1px

  img
    width: 35px
    height: 35px
    border-radius: 20px
    position: absolute
    right: 60px
    top: 8px

  a
    position: absolute
    display: block
    color: #fff
    right: 15px
    top: 10px
    font-size: 25px
    cursor: pointer
    transition: color .2s

  a:focus, a:hover
    color: #41b883

  @media screen and (max-width: 1200px)
    span
      display: none


  @media screen and (max-width: 720px)
    input
      width: calc(100% - 64px)
      margin: 0 0 0 16px

    span, img
      display: none


</style>
