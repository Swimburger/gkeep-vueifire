
import Firebase from 'firebase'
import EventEmitter from 'events'

// firebase reference to the notes
const ref = new Firebase('https://gkeep-vueifire2.firebaseio.com/notes')
// extend EventEmitter so user of NoteRepository can react to our own defined events (ex: noteRepository.on('added'))
class NoteRepository extends EventEmitter {
  constructor () {
    super()
    this.attachFirebaseListeners()
  }
  // creates a note
  create ({title = '', content = ''}, onComplete) {
    ref.push({title, content}, onComplete)
  }
  // updates a note
  update ({key, title = '', content = ''}, onComplete) {
    ref.child(key).update({title, content}, onComplete) // key is used to find the child, a new note object is made without the key, to prevent key being inserted in Firebase
  }
  // removes a note
  remove ({key}, onComplete) {
    ref.child(key).remove(onComplete)
  }
  snapshotToNote (snapshot) {
    // we will need the key often, so we always want to have the key included in the note
    let key = snapshot.key()
    let note = snapshot.val()
    note.key = key
    return note
  }
  /**
   * Finds the index of the note inside the array
   *
   * @param  {object[]} notes to search note in
   * @param  {string} key to find notes index
   * @return {number} return the index
   */
  findIndex (notes, key) {
    return notes.findIndex(note => note.key === key)
  }
  find (notes, key) {
    return notes.find(note => note.key === key)
  }
  attachFirebaseListeners () {
    // attach listeners to Firebase
    ref.on('child_added', this._onAdded, this)
    ref.on('child_removed', this._onRemoved, this)
    ref.on('child_changed', this._onChanged, this)
  }
  detachFirebaseListeners () {
    // dettach listeners from Firebase
    ref.off('child_added', this._onAdded, this)
    ref.off('child_removed', this._onRemoved, this)
    ref.off('child_changed', this._onChanged, this)
  }
  _onAdded (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('added', note)
  }
  _onRemoved (oldSnapshot) {
    let note = this.snapshotToNote(oldSnapshot)
    this.emit('removed', note)
  }
  _onChanged (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('changed', note)
  }
}
const noteRepository = new NoteRepository()
export default noteRepository
