<template>
  <div class="notes" v-el:notes>
    <note
      v-for="note in notes"
      :note="note"
      v-on:click="selectNote(note)"
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
      notes: []
    }
  },
  methods: {
    selectNote ({key, title, content}) {
      // notify listeners that user selected a note
      // pass in a copy of the note to prevent edits on the original note in the array
      this.$dispatch('note.selected', {key, title, content})
    }
  },
  watch: {
    'notes': { // watch the notes array for changes
      handler () {
        this.masonry.reloadItems()
        this.masonry.layout()
      },
      deep: true // we also want to watch changed inside individual notes
    }
  },
  ready () {
    noteRepository.detachFirebaseListeners()
    this.masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    noteRepository.on('value', (note) => {
      let index = noteRepository.findIndex(this.notes, note.key)
      if (index !== -1) {
        this.$set(`notes[${index}].title`, note.title)
        this.$set(`notes[${index}].content`, note.content)
        this.$set(`notes[${index}].sharedWith`, note.sharedWith)
      } else {
        this.notes.unshift(note) // add the note to the beginning of the array
      }
    })
    noteRepository.on('removed', (key) => {
      let note = noteRepository.find(this.notes, key) // get specific note from the notes in our VM by key
      this.notes.$remove(note) // remove note from notes array
    })
    noteRepository.attachFirebaseListeners()
  }
}
</script>
<style>
.notes{
  margin: 0 auto;
}
</style>
