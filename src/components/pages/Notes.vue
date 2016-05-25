<template>
  <div>
    <create-note-form></create-note-form>
    <notes></notes>
    <update-modal :note.sync="selectedNote"></update-modal>
  </div>
</template>
<script>
import Notes from 'src/components/notes/Index'
import CreateNoteForm from 'src/components/notes/Create'
import UpdateModal from 'src/components/notes/UpdateModal'
export default {
  components: {
    Notes,
    CreateNoteForm,
    UpdateModal
  },
  data () {
    return {
      selectedNote: null
    }
  },
  events: {
    'note.selected': function (note) {
      this.selectedNote = note
    }
  }
}
</script>
