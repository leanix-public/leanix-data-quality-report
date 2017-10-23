import Vue from 'vue'
import App from './App'
import apolloProvider from './apollo'

new Vue({ el: '#report', apolloProvider, render: h => h(App) })
