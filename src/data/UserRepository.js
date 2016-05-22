
import Firebase from 'firebase'

class UserRepository {
  constructor () {
    this.ref = new Firebase('https://gkeep-vueifire3.firebaseio.com')
    this.usersRef = this.ref.child('users')
    this.userNamesToUidsRef = this.ref.child('userNameToUid') // inspired on https://gist.github.com/katowulf/6479129
  }
  createUser (user) {
    return this.usersRef.child(user.uid).set(user)
      .then(() => this.userNamesToUidsRef.child(user.userName).set(user.uid))
  }
  getUserByUid (uid) {
    // returning the result of the once-function because it return a promise
    // you can either use Firebase with a callback style, or promise style
    return this.usersRef.child(uid).once('value')
  }
  getUidByUsername (userName) {
    // we don't allow users to read contents of other users, so we need a way to get the uids to be able to share notes
    return this.userNamesToUidsRef.child(userName).once('value')
  }
  createUserNameToUidPair (userName, uid) {
    return this.userNamesToUidsRef.child(userName).set(uid)
  }
}
export default new UserRepository() // this instance will be shared across imports
