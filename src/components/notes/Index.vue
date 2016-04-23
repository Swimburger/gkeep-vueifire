<template>
  <div class="notes" v-el:notes>
    <note
      v-for="note in notes"
      :note="note"
      v-on:click="selectNote(note)"
      id="note{{note.key}}"
      >
    </note>
  </div>
</template>
<script>
import Masonry from 'masonry-layout'
import Note from './Note'
import noteRepository from '../../data/NoteRepository'
export default {
  components: {
    Note
  },
  data () {
    return {
      search: '',
      notes: []
    }
  },
  methods: {
    selectNote ({key, title, content}) {
      this.$dispatch('note.selected', {key, title, content}) // pass in a copy to prevent edits on the note in the array
    },
    findNoteElementByKey (key) {
      return this.$el.querySelector(`#note${key}`)
    }
  },
  ready () {
    this.$watch('notes', (newValue, oldValue) => {
      console.log(newValue)
      console.log(oldValue)
      this.$nextTick(() => {
        this.masonry.reloadItems()
        this.masonry.layout()
      })
    })
    this.masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    noteRepository.on('added', (note) => {
      this.notes.unshift(note)
      this.$nextTick(() => { // the new note hasn't been rendered yet, but in the nextTick, it will be rendered
        this.masonry.prepended(this.findNoteElementByKey(note.key))
        this.masonry.layout()
      })
    })
    noteRepository.on('changed', ({key, title, content}) => {
      let note = noteRepository.find(this.notes, key) // get specific note from the notes in our VM by key
      note.title = title
      note.content = content
      this.$nextTick(() => {
        this.masonry.layout()
      })
    })
    noteRepository.on('removed', ({key}) => {
      let note = noteRepository.find(this.notes, key) // get specific note from the notes in our VM by key
      this.masonry.once('removeComplete', () => {
        this.notes.$remove(note) // remove note from notes array after the animation of the removal is done!
      })
      this.masonry.remove(this.findNoteElementByKey(key)) // remove element from Masonry items
      this.masonry.layout() // rerender without the element
    })
  }
}
</script>
<style>
.notes{
  margin: 0 auto;
}
</style>
