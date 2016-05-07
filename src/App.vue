<template>
  <div>
    <create-note-form></create-note-form>
    <notes></notes>
    <update-modal :note.sync="selectedNote"></update-modal>
  </div>
</template>
<script>
import Notes from './components/notes/Index'
import CreateNoteForm from './components/notes/Create'
import UpdateModal from './components/notes/UpdateModal'
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
<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
html{
  position: relative;
  min-height: 100%;
  font-family: sans-serif;
}
body{
  background: #eee;
  min-height: 100%;
}
body > div{
  padding: 16px 16px 50px;
  min-height: 100vh;
  background: #eee;
  position: relative;
  margin-bottom: 50px;
  z-index: 1;
  box-shadow: 0 2px 5px #111;
}
footer{
  background: #333;
  color: #fff;
  text-align: center;
  padding: 12px 0 10px;
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
}
footer a{
  color: #e03c3c;
}
footer .fa-heart{
  margin: 0 10px 0 0;
}
footer iframe{
  position: relative;
  top: 4px;
}
</style>
