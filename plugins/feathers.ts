/* eslint-disable no-console */

import auth from '@feathersjs/authentication-client'
import { $fetch } from 'ohmyfetch'
import rest from '@feathersjs/rest-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import { feathers } from '@feathersjs/feathers'
import { OhMyFetch, setupFeathersPinia } from 'feathers-pinia'

export default defineNuxtPlugin(async (_nuxtApp) => {
  // Creating the Feathers client in a plugin avoids stateful data and
  // prevents information from leaking between user sessions.
  const api = feathers()
  const { defineStore } = setupFeathersPinia({
    ssr: !!process.server,
    clients: { api },
    idField: '_id',
    // customize every store
    state: () => ({}),
    getters: {},
    actions: {},
  })

  const host = import.meta.env.VITE_MYAPP_API_URL as string || 'http://localhost:3030'

  console.log('')
  console.log('in feathers plugin')

  // Use Rest on the server
  // Check process.server so the code can be tree shaken out of the client build.
  if (process.server)
    api.configure(rest(host).fetch($fetch, OhMyFetch))

  // Switch to Socket.io on the client
  else
    api.configure(socketio(io(host, { transports: ['websocket'] })))

  api.configure(auth())

  return {
    provide: { api, defineStore },
  }
})
