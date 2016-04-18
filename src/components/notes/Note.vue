<template>
  <div class="note">
    <h1>{{note.title}}</h1>
    <p>{{note.content}}</p>
  </div>
</template>
<script>
export default {
  props: ['note']
}
</script>
<style>
.note{
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 5px #ccc;
  padding: 10px;
  margin: 8px 0;
  width: 240px;
}
.note h1{
  font-size: 1.1em;
  margin-bottom: 6px;
}
.note p {
  font-size: 1.1em;
  margin-bottom: 10px;
}
</style>
