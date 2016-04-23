<template>
  <div v-if="note" transition="modal" class="backdrop" v-on:click="note = null">
    <form class="edit-note" v-on:submit.prevent="update(note)" v-on:click.stop="">
      <input name="title" v-model="note.title" placeholder="Title"/>
      <textarea name="content" v-model="note.content" placeholder="Text goes here..." rows="8">
      </textarea>
      <button type="button" v-on:click="remove(note)">
        <i class="fa fa-trash-o" aria-hidden="true"></i>
      </button>
      <button type="submit">Done</button>
    </form>
  </div>
</template>
<script>
import noteRepository from '../../data/NoteRepository'
export default {
  props: ['note'],
  methods: {
    remove (note) {
      noteRepository.remove(note, (err) => {
        if (err) throw err
        this.note = null
      })
    },
    update (note) {
      noteRepository.update(note, (err) => {
        if (err) throw err
        this.note = null
      })
    }
  }
}
</script>
<style>
.backdrop{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(50,50,50,0.8);
}
form.edit-note{
  position: relative;
  width: 480px;
  max-width: 100%;
  margin: 25vh auto 0;
  background: #fff;
  padding: 15px;
  border-radius: 2px;
  box-shadow: 0 1px 50px #555;
}
form.edit-note input, form.edit-note textarea{
  width: 100%;
  max-width: 100%;
  border: none;
  padding: 4px;
  outline: none;
  font-size: 1.2em;
}
form.edit-note button[type=submit]{
  font-size: 18px;
  float: right;
  background: #41b883;
  color: #fff;
  border: none;
  border-radius: 3px;
  opacity: 1;
  cursor: pointer;
  padding: 4px 6px;
  margin: 0;
}
form.edit-note button{
  background: none;
  border: none;
  font-size: 20px;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity .5s;
  margin: 0 4px 0 0;
}
form.edit-note button:hover, form.edit-note button:focus{
  opacity: 1;
}

/* modal transition */
.modal-transition{
  transition: opacity .3s ease;
  opacity: 1;
}
.modal-transition form{
  transition: transform .3s ease;
}
.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter form,
.modal-leave form {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
