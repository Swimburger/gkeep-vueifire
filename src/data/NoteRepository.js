
import Firebase from 'firebase'
import EventEmitter from 'events'
// firebase instance
const firebase = new Firebase('https://gkeep-vueifire2.firebaseio.com/')

// firebase reference to the notes
const notesRef = firebase.child('notes')

// export events so user of NoteRepository can react to our own defined event (ex: noteRepository.events.on('added'))
export const events = new EventEmitter()

// export an empty notes array, the NoteRepository will keep the array in sync with Firebase
export const notes = []

// creates a note
export function create ({title = '', content = ''}, onComplete) {
  notesRef.push({title, content}, onComplete)
}
// updates a note
export function update ({key, title = '', content = ''}, onComplete) {
  notesRef.child(key).update({title, content}, onComplete) // key is used to find the child, a new note object is made without the key, to prevent key being inserted in Firebase
}
// removes a note
export function remove ({key}, onComplete) {
  notesRef.child(key).remove(onComplete)
}

// attach listeners to Firebase
notesRef.on('child_added', snapshot => onAdded(snapshot))
notesRef.on('child_removed', snapshot => onRemoved(snapshot))
notesRef.on('child_changed', snapshot => onChanged(snapshot))

function onAdded (snapshot) {
  let note = snapshot.val()
  note.key = snapshot.key()
  notes.unshift(note)
  events.emit('*', note)
  events.emit('added', note)
}
function onRemoved (oldSnapshot) {
  let key = oldSnapshot.key()
  let note = notes.find((note) => {
    return note.key === key
  })
  notes.$remove(note)
  events.emit('*', note)
  events.emit('removed', note)
}
function onChanged (snapshot) {
  let note = snapshot.val()
  let key = snapshot.key()
  note.key = key
  let index = notes.findIndex((note) => {
    return note.key === key
  })
  notes[index].title = note.title
  notes[index].content = note.content
  // notes.$set(index, note)
  events.emit('*', note)
  events.emit('changed', note)
}
