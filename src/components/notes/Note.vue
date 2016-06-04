<template lang="pug">
  div(class="note" v-bind:class="[size]")
    h1 {{note.title}}
    pre {{note.content}}
    button(type="button" @click.stop="remove")
      i(class="fa fa-trash-o" aria-hidden="true")
    button(class="edit" type="button")
      i(class="fa fa-pencil" aria-hidden="true")
</template>
<script>
import noteRepository from '../../data/NoteRepository'
export default {
  props: ['note'],
  computed: {
    size () {
      let length = this.note.content.length
      if (length < 500) {
        return 'small'
      }
      return 'medium'
    }
  },
  methods: {
    remove () {
      noteRepository.remove(this.note, (err) => {
        if (err) return this.$dispatch('alert', {type: 'error', message: 'Failed to remove note'})
      })
    }
  }
}
</script>
<style lang="sass">
.note
  background: #fff
  border-radius: 2px
  box-shadow: 0 2px 5px #ccc
  padding: 10px
  margin: 8px 0
  width: 240px; /* collumn size */
  transition: box-shadow .5s
  cursor: default

  &.medium
    width: 496px /* medium = (col * 2) + gutter | 496px = (240px * 2) + 16px */

  h1
    font-size: 1.1em
    margin-bottom: 6px
    word-wrap: break-word

  pre
    font-size: 1.1em
    margin-bottom: 10px
    white-space: pre-wrap
    word-wrap: break-word
    font-family: inherit

  button
    background: none
    border: none
    font-size: 20px
    opacity: 0
    cursor: pointer
    transition: opacity .5s
    margin: 0 4px 0 0

  button.edit
    float: right

  &:hover, &:focus
    box-shadow: 0 2px 10px #999

    button
      opacity: 0.6

  button:hover, button:focus
    opacity: 1

</style>
