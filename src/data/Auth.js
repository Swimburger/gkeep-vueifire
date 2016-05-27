import Firebase from 'firebase'

export default {
  ref: new Firebase('https://gkeep-vueifire3.firebaseio.com/'),
  // calls callback when user signs in or out
  onAuth (authCallback) {
    this.ref.onAuth(authCallback)
  },
  // get's authenticated user
  getAuth () {
    return this.ref.getAuth()
  },
  signInWithPassword (credentials) {
    return this.ref.authWithPassword(credentials)
  },
  signUpWithPassword (credentials) {
    return this.ref.createUser(credentials) // this will create a Firebase user for authentication, this is separate from our own user objects
  },
  signInWithProvider (provider, callback) {
    // provider => 'google', 'facebook', 'github', ...
    this.ref.authWithOAuthPopup(provider, (error, authData) => {
      if (error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          // fall-back to browser redirects, and pick up the session
          // automatically when we come back to the origin page
          this.ref.authWithOAuthRedirect(provider, (error) => {
            if (callback) callback(error, authData)
          })
        }
      } else if (authData) {
        if (callback) callback(null, authData)
      }
    })
  },
  signOut () {
    this.ref.unauth()
  }
}
