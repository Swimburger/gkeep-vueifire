<template>
  <div class="notes" v-el:notes>
      <note
        v-for="note in notes"
        :note="note"
        >
      </note>
  </div>
</template>
<script>
import Firebase from 'firebase'
import Masonry from 'masonry-layout'
import Note from './Note'
export default {
  components: {
    Note
  },
  data () {
    return {
      notes: []
    }
  },
  ready () {
    let masonry = new Masonry(this.$els.notes, {
      itemSelector: '.note',
      columnWidth: 240,
      gutter: 16,
      fitWidth: true
    })
    let firebase = new Firebase('https://gkeep-vueifire.firebaseio.com/')
    firebase.child('notes').on('child_added', (snapshot) => {
      let note = snapshot.val()
      this.notes.unshift(note)
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
