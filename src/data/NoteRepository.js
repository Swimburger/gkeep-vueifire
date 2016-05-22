
import Firebase from 'firebase'
import EventEmitter from 'events'

// extend EventEmitter so user of NoteRepository can react to our own defined events (ex: noteRepository.on('added'))
class NoteRepository extends EventEmitter {
  get uid () {
    return this.ref.getAuth().uid
  }
  get notesRef () {
    return this.ref.child(`users/${this.uid}/notes`)
  }
  constructor () {
    super()
    // firebase reference to the notes
    this.ref = new Firebase('https://gkeep-vueifire3.firebaseio.com') // will have same result as new Firebase('https://resplendent-heat-896.firebaseio.com/').child('notes')
  }
  // creates a note
  create ({title = '', content = ''}, onComplete) {
    this.notesRef.push({title, content}, onComplete)
  }
  // updates a note
  update ({key, title = '', content = ''}, onComplete) {
    this.notesRef.child(key).update({title, content}, onComplete) // key is used to find the child, a new note object is made without the key, to prevent key being inserted in Firebase
    // new Firebase(`https://gkeep-vueifire2.firebaseio.com/notes/${key}`).update(...)
  }
  // removes a note
  remove ({key}, onComplete) {
    this.notesRef.child(key).remove(onComplete)
  }
  // attach listeners to Firebase
  attachFirebaseListeners () {
    this.notesRef.on('child_added', this.onAdded, this)
    this.notesRef.on('child_removed', this.onRemoved, this)
    this.notesRef.on('child_changed', this.onChanged, this)
  }
  // dettach listeners from Firebase
  detachFirebaseListeners () {
    this.notesRef.off('child_added', this.onAdded, this)
    this.notesRef.off('child_removed', this.onRemoved, this)
    this.notesRef.off('child_changed', this.onChanged, this)
  }
  onAdded (snapshot) {
    // process data
    let note = this.snapshotToNote(snapshot)
    // propagate event outwards with note
    this.emit('added', note)
  }
  onRemoved (oldSnapshot) {
    let note = this.snapshotToNote(oldSnapshot)
    this.emit('removed', note)
  }
  onChanged (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('changed', note)
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
