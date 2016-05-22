
import Firebase from 'firebase'
import EventEmitter from 'events'
import userRepository from './UserRepository'

class AuthRepository extends EventEmitter {
  constructor () {
    super()
    this.ref = new Firebase('https://gkeep-vueifire3.firebaseio.com/')
    this.attachFirebaseListeners()
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
  getAuthedUser () {
    return userRepository.getUserByUid(this.getAuth().uid)
  }
  signInWithPassword (credentials) {
    return this.ref.authWithPassword(credentials)
  }
  singUpWithPassword (credentials) {
    return this.ref.createUser(credentials) // this will create a Firebase user for authentication, this is separate from our own user objects
  }
}
export default new AuthRepository() // this instance will be shared across imports
