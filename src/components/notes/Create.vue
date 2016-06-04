<template lang="pug">
  form.create-note(@submit.prevent="createNote")
    input(name="title" v-model="title" placeholder="Title")
    textarea(name="content" v-model="content" placeholder="Text goes here..." rows="3")
    button(type="submit") +
</template>
<script>
import noteRepository from '../../data/NoteRepository'

export default {
  data () {
    return {
      title: '',
      content: ''
    }
  },
  methods: {
    createNote () {
      if (this.title.trim() || this.content.trim()) {
        noteRepository.create({title: this.title, content: this.content}, (err) => {
          if (err) return this.$dispatch('alert', {type: 'error', message: 'Failed to create note'})
          this.title = ''
          this.content = ''
          this.$dispatch('alert', {type: 'success', message: 'Note was successfully created'})
        })
      }
    }
  }
}
</script>
<style lang="sass">
.create-note
  position: relative
  width: 480px
  max-width: 100%
  margin: 30px auto
  background: #fff
  padding: 15px
  border-radius: 2px
  box-shadow: 0 1px 5px #ccc

  input, textarea
    width: 100%
    max-width: 100%
    border: none
    padding: 4px
    outline: none
    font-size: 1.2em

  button
    position: absolute
    right: 18px
    bottom: -18px
    background: #41b883
    color: #fff
    border: none
    border-radius: 50%
    width: 36px
    height: 36px
    box-shadow: 0 1px 3px rgba(0,0,0,0.3)
    cursor: pointer
    outline: none

</style>
