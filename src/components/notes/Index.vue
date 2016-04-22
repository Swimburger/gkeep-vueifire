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
import * as NoteRepository from '../../data/NoteRepository'
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
      this.$dispatch('note.selected', {key, title, content}) // pass in a copy to prevent edits on the note in the array
    },
    findNoteByKey (key) {
      return this.notes.find((note) => {
        return note.key === key
      })
    },
    findNoteIndexByKey (key) {
      return this.notes.findIndex((note) => {
        return note.key === key
      })
    },
    findNoteElementByKey (key) {
      return this.$el.querySelector(`#note${key}`)
    }
  },
  ready () {
    this.masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    NoteRepository.events.on('added', (note) => {
      this.notes.unshift(note)
      this.$nextTick(() => { // the new note hasn't been rendered yet, but in the nextTick, it will be rendered
        this.masonry.prepended(this.findNoteElementByKey(note.key))
        this.masonry.layout()
      })
    })
    NoteRepository.events.on('changed', ({key, title, content}) => {
      let note = this.findNoteByKey(key)
      note.title = title
      note.content = content
      this.$nextTick(() => {
        this.masonry.layout()
      })
    })
    NoteRepository.events.on('removed', ({key}) => {
      let note = this.findNoteByKey(key)
      this.masonry.once('removeComplete', () => {
        this.notes.$remove(note)
      })
      this.masonry.remove(this.findNoteElementByKey(key))
      this.masonry.layout()
    })
  }
}
</script>
<style>
.notes{
  margin: 0 auto;
}
</style>
