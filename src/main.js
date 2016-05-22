import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import NotesPage from './components/pages/Notes'
import AuthPage from './components/pages/Auth'
import authRepository from './data/AuthRepository'

Vue.use(VueRouter)

let app = Vue.extend({
  components: { App }
})

let router = new VueRouter()

router.map({
  '/notes': {
    name: 'notes',
    component: NotesPage,
    auth: true // this route requires the user to be signed in
  },
  '/auth': {
    name: 'auth',
    component: AuthPage
  }
})

router.alias({
  '/': '/notes'
})

router.beforeEach(function (transition) {
  if (transition.to.auth && !authRepository.getAuth()) {
    transition.redirect('/auth')
  } else {
    transition.next()
  }
})

router.start(app, 'body')
