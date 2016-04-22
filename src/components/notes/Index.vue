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
import * as NoteRepository from '../../data/NoteRepository'
export default {
  components: {
    Note
  },
  data () {
    return {
      notes: NoteRepository.notes
    }
  },
  methods: {
    selectNote (note) {
      this.$dispatch('note.selected', note)
    }
  },
  ready () {
    let masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    NoteRepository.events.on('*', () => {
      this.$nextTick(() => { // the new note hasn't been rendered yet, but in the nextTick, it will be rendered
        masonry.reloadItems()
        masonry.layout()
      })
    })
  }
}
</script>
<style>
.notes{
    margin: 0 auto;
}
</style>
