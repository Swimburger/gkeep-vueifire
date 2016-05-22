import Firebase from 'firebase'
import EventEmitter from 'events'

class AuthRepository extends EventEmitter {
  constructor () {
    super()
    this.ref = new Firebase('https://gkeep-vueifire3.firebaseio.com/')
  }
  attachFirebaseListeners () {
    this.ref.onAuth(this.onAuth, this)
  }
  detachFirebaseListeners () {
    this.ref.offAuth(this.onAuth, this)
  }
  onAuth (authData) {
    if (authData) {
      this.emit('authed', authData)
    } else {
      this.emit('unauthed')
    }
  }
  getAuth () {
    return this.ref.getAuth()
  }
  signInWithPassword (credentials) {
    return this.ref.authWithPassword(credentials)
  }
  signUpWithPassword (credentials) {
    return this.ref.createUser(credentials) // this will create a Firebase user for authentication, this is separate from our own user objects
  }
  signInWithProvider (provider, callback) {
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
  }
  signOut () {
    this.ref.unauth()
  }
}
export default new AuthRepository() // this instance will be shared across imports
