<template lang="pug">
  form(class="auth-form" @submit.prevent="wantsToSignUp ? signUpWithPassword() : signInWithPassword()")
    h1 {{wantsToSignUp ? 'Sign up' : 'Sign in'}}

    div
      label(for="email") Email
      input(type="email" name="email" id="email" placeholder="Email" required v-model="email")

    div
      label(for="password") Password
      input(type="password" name="password" id="password" required v-model="password" placeholder="Password")

    div(v-show="wantsToSignUp")
      label(for="confirm-password") Confirm Password
      input(type="password" name="confirm-password" id="confirm-password" v-model="confirmPassword" placeholder="Confirm Password")

    div(v-show="!wantsToSignUp" class="clearfix btn-group")
      button(type="submit") Sign in
      button(type="button" @click="wantsToSignUp = true") Sign up

    div(v-show="wantsToSignUp")
      button(type="submit" class="signup-submit") Sign up

    hr

    div(class="social-providers")
      a(href="#" @click.prevent="signInWithProvider('facebook')")
        i(class="fa fa-facebook-square" aria-hidden="true")
      a(href="#" @click.prevent="signInWithProvider('twitter')")
        i(class="fa fa-twitter-square" aria-hidden="true")
      a(href="#" @click.prevent="signInWithProvider('google')")
        i(class="fa fa-google-plus-square" aria-hidden="true")
      a(href="#" @click.prevent="signInWithProvider('github')")
        i(class="fa fa-github-square" aria-hidden="true")
</template>
<script>
import Auth from 'src/data/Auth'
export default {
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      wantsToSignUp: false
    }
  },
  methods: {
    signUpWithPassword () {
      if (this.password === this.confirmPassword) {
        Auth.signUpWithPassword({
          email: this.email,
          password: this.password
        })
          .then((userData) => this.signInWithPassword())                                              // signIn
          .then(() => this.$dispatch('alert', {type: 'success', message: 'Signed up successfully'}))  // let user know everything was successful
          .catch((error) => this.$dispatch('alert', {type: 'error', message: error.message}))         // tell the user an error occurred
      }
    },
    signInWithPassword () {
      return Auth.signInWithPassword({
        email: this.email,
        password: this.password
      })
        .then((userData) => {
          this.$dispatch('alert', {type: 'success', message: 'Signed in successfully'})
          this.onSignedIn()
          return userData
        })
        .catch((error) => this.$dispatch('alert', {type: 'error', message: error.message})) // tell the user an error occurred
    },
    signInWithProvider (provider) {
      Auth.signInWithProvider(provider, (error, authData) => {
        if (error) this.$dispatch('alert', {type: 'error', message: error.message})
        this.onSignedIn()
      })
    },
    onSignedIn () {
      this.$router.go({name: 'notes'})
    }
  }
}
</script>
<style lang="sass">
.auth-form
  width: 480px
  max-width: 100%
  margin: 25vh auto 15px
  background: #fff
  padding: 15px
  border-radius: 2px
  box-shadow: 0 1px 5px #ccc

  h1
    font-weight: 300

  > div
    margin-top: 15px

  input
    height: 32px
    border: none
    border-bottom: 2px solid #bbb

    &:focus
      border-bottom-color: #555

  label, input
    display: block
    width: 100%

  button
    font-size: 18px
    background: #fff
    border: 1px solid #41b883
    padding: 4px 6px
    margin: 0
    border-radius: 3px

  .btn-group
    button
      border-radius: 3px 0 0 3px
      width: 50%
      float: left
      button + button
        border-radius: 0 3px 3px 0
        border-left: none

  .signup-submit
    width: 100%

  hr
    margin-top: 20px

  .social-providers
    text-align: center

    a
      color: #41b883
      font-size: 36px
      padding: 4px

</style>
