<template lang="pug">
  div(v-if="note" transition="modal" class="backdrop" @click="dismissModal")
    form(class="edit-note" @submit.prevent="update" @click.stop="")
      input(name="title" v-model="note.title" placeholder="Title")

      textarea(name="content" v-model="note.content" placeholder="Text goes here..." rows="8")

      button(type="button" @click="remove")
        i(class="fa fa-trash-o" aria-hidden="true")
      button(type="submit") Done
</template>
<script>
import noteRepository from '../../data/NoteRepository'
export default {
  props: ['note'],
  methods: {
    remove () {
      noteRepository.remove(this.note, (err) => {
        if (err) return this.$dispatch('alert', {type: 'error', message: 'Failed to remove note'})
        this.dismissModal()
      })
    },
    update () {
      noteRepository.update(this.note, (err) => {
        if (err) return this.$dispatch('alert', {type: 'error', message: 'Failed to update note'})
        this.dismissModal()
        this.$dispatch('alert', {type: 'success', message: 'Note was successfully updated'})
      })
    },
    dismissModal () {
      this.note = null
    }
  }
}
</script>
<style lang="sass">
.backdrop
  position: fixed
  left: 0
  top: 0
  right: 0
  bottom: 0
  background: rgba(50,50,50,0.8)

.edit-note
  position: relative
  width: 480px
  max-width: 100%
  margin: 25vh auto 0
  background: #fff
  padding: 15px
  border-radius: 2px
  box-shadow: 0 1px 50px #555

  input, textarea
    width: 100%
    max-width: 100%
    border: none
    padding: 4px
    outline: none
    font-size: 1.2em

  button[type=submit]
    font-size: 18px
    float: right
    background: #41b883
    color: #fff
    border: none
    border-radius: 3px
    opacity: 1
    cursor: pointer
    padding: 4px 6px
    margin: 0

  button
    background: none
    border: none
    font-size: 20px
    opacity: 0.6
    cursor: pointer
    transition: opacity .5s
    margin: 0 4px 0 0

    &:hover, &:focus
      opacity: 1


/* modal transition */
.modal-transition
  transition: opacity .3s ease
  opacity: 1

  form
    transition: transform .3s ease

.modal-enter, .modal-leave
  opacity: 0

  form
    -webkit-transform: scale(1.1)
    transform: scale(1.1)

</style>
