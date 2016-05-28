<template>
  <div class="notes" v-el:notes>
    <note
      v-for="note in filteredNotes"
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
      notes: [],
      searchQuery: ''
    }
  },
  methods: {
    selectNote ({key, title, content}) {
      // notify listeners that user selected a note
      // pass in a copy of the note to prevent edits on the original note in the array
      this.$dispatch('note.selected', {key, title, content})
    }
  },
  computed: {
    filteredNotes () {
      return this.notes.filter((note) => {
        if (this.searchQuery) return (note.title.indexOf(this.searchQuery) !== -1 || note.content.indexOf(this.searchQuery) !== -1) // returns truthy if query is found in title or content
        return true
      })
    }
  },
  watch: {
    'filteredNotes': { // watch the notes array for changes
      handler () {
        this.$nextTick(() => {
          this.masonry.reloadItems()
          this.masonry.layout()
        })
      },
      deep: true // we also want to watch changed inside individual notes
    }
  },
  events: {
    'search': function (searchQuery) {
      this.searchQuery = searchQuery
    }
  },
  ready () {
    this.masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    noteRepository.on('added', (note) => {
      this.notes.unshift(note) // add the note to the beginning of the array
    })
    noteRepository.on('changed', ({key, title, content}) => {
      let note = noteRepository.find(this.notes, key) // get specific note from the notes in our VM by key
      note.title = title
      note.content = content
    })
    noteRepository.on('removed', ({key}) => {
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
