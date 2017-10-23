/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {Platform} from 'react-native'
import { NativeRouter, Route, Link, AndroidBackButton, Switch, Redirect } from 'react-router-native'
import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'
import reducer from './store/reducers'
import Home from './components/home'
import Room from './components/room'


const store = createStore(combineReducers(reducer))

export default () => (
  <Provider store={store}>
    <NativeRouter>
      {
        Platform.select({
          android: (
            <AndroidBackButton>
              {routes}
            </AndroidBackButton>
          ),
          ios: routes
        })
      }
    </NativeRouter>
  </Provider>
)

const routes = (
  <Switch>
    <Route exact  path='/' component={Home} />
    <Route path='/room/:room' component={Room} />
  </Switch>
)
