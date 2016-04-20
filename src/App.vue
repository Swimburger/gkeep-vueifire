<template>
  <div>
    <create-note-form></create-note-form>
    <notes></notes>
  </div>
</template>
<script>
import Notes from './components/notes/Index'
import CreateNoteForm from './components/notes/Create'
export default {
  components: {
    Notes,
    CreateNoteForm
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
  min-height: 100%;
  background: #eee;
  padding-bottom: 85px;
}
body > div{
  padding: 0 16px;
}
footer{
  background: #333;
  text-align: center;
  color: #fff;
  padding: 12px 0 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
footer a{
  color: #e03c3c;
}
footer iframe{
  margin: 12px 0 0;
}
</style>
