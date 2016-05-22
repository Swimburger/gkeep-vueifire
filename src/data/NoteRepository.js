import Firebase from 'firebase'
import EventEmitter from 'events'

// extend EventEmitter so user of NoteRepository can react to our own defined events (ex: noteRepository.on('added'))
class NoteRepository extends EventEmitter {
  constructor () {
    super()
    // firebase reference to the notes
    this.ref = new Firebase('https://gkeep-vueifire3.firebaseio.com') // will have same result as new Firebase('https://resplendent-heat-896.firebaseio.com/').child('notes')
    this.notesRef = this.ref.child('notes')
    this.userNotesRef = this.ref.child('userNotes')
    // this.attachFirebaseListeners()
  }
  // creates a note
  create ({title = '', content = ''}) {
    let promises = []

    let createdBy = this.ref.getAuth().uid
    let createdNoteRef = this.notesRef.push({title, content, createdBy})
    promises.push(createdNoteRef)
    let noteKey = createdNoteRef.key()
    promises.push(
      this.addNoteToUser(noteKey, createdBy) // adds notekey to users notes
    )

    return Promise.all(promises)
  }
  // updates a note
  update ({key, title = '', content = '', sharedWith = {}}) {
    let promises = []

    promises.push(
      this.notesRef.child(key).update({title, content, sharedWith}) // key is used to find the child, a new note object is made without the key, to prevent key being inserted in Firebase
    )
    // new Firebase(`https://...firebaseio.com/notes/${key}`).update(...)
    for (let uid in sharedWith) {
      promises.push(
        this.addNoteToUser(key, uid) // add note to the users that note is shared with
      )
    }

    return Promise.all(promises)
  }
  // removes a note
  remove ({key, createdBy, sharedWith}) {
    let promises = []

    promises.push(
      this.notesRef.child(key).remove()
    )
    promises.push(
      this.removeNoteFromUser(key, createdBy)
    )
    for (let uid in sharedWith) {
      promises.push(
        this.removeNoteFromUser(key, uid) // add note to the users that note is shared with
      )
    }

    return Promise.all(promises)
  }
  addNoteToUser (noteKey, uid) { // these are notes that are createdByUser or sharedWithUser
    let userAddingNoteUid = this.ref.getAuth().uid
    return this.userNotesRef.child(`${uid}/${noteKey}`).set(userAddingNoteUid)
  }
  removeNoteFromUser (noteKey, uid, onComplete) {
    return this.userNotesRef.child(`${uid}/${noteKey}`).remove()
  }
  // attach listeners to Firebase
  attachFirebaseListeners () {
    let authedUid = this.ref.getAuth().uid
    this.userNotesRef.child(authedUid).on('child_added', this.onUserNoteAdded, this)
    this.userNotesRef.child(authedUid).on('child_removed', this.onUserNoteAdded, this)
  }
  // dettach listeners from Firebase
  detachFirebaseListeners () {
    this.userNotesRef.off('child_added', this.onUserNoteAdded, this)
    this.userNotesRef.off('child_removed', this.onUserNoteAdded, this)
  }
  onUserNoteAdded (snapshot) {
    let noteKey = snapshot.key()
    this.notesRef.child(noteKey).on('value', (snapshot) => {
      console.log('got value of note', snapshot.val())
      let val = snapshot.val()
      if (val !== null) {
        this.onValue(snapshot)
      } else {
        this.onRemoved(snapshot.key())
      }
    })
  }
  onUserNoteRemoved (snapshot) {
    console.log('userNoteRemoved', snapshot.val())
    this.onRemoved(snapshot.val())
  }
  onValue (snapshot) {
    // process data
    let note = this.snapshotToNote(snapshot)
    // propagate event outwards with note
    this.emit('value', note)
  }
  onRemoved (key) {
    this.emit('removed', key)
  }
  // processes the snapshots to consistent note with key
  snapshotToNote (snapshot) {
    // we will need the key often, so we always want to have the key included in the note
    let key = snapshot.key()
    let note = snapshot.val()
    note.key = key
    return note
  }
  // Finds the index of the note inside the array by looking for its key
  findIndex (notes, key) {
    return notes.findIndex(note => note.key === key)
  }
  // Finds the note inside the array by looking for its key
  find (notes, key) {
    return notes.find(note => note.key === key)
  }
}
export default new NoteRepository() // this instance will be shared across imports
