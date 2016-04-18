<template>
  <div>
    <create-note-form></create-note-form>
    <notes></notes>
  </div>
</template>
<script>
import Notes from './components/notes/Index'
import Create from './components/notes/Create'
export default {
  components: {
    Notes,
    'create-note-form': Create
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
  font-family: sans-serif;
}
body{
  background: #eee;
}
</style>
