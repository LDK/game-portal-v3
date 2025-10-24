import { configureStore } from '@reduxjs/toolkit'
import type { Action } from '@reduxjs/toolkit'
import type { User } from '../types/user'

interface CounterState {
  value: number
}

// An example slice reducer function that shows how a Redux reducer works inside.
// We'll replace this soon with real app logic.
function counterReducer(state: CounterState = { value: 0 }, action: Action) {
  switch (action.type) {
    // Handle actions here
    default: {
      return state
    }
  }
}

function userReducer(state: User | null = null, action: Action) {
  switch (action.type) {
    // Handle user-related actions here
    default: {
      return state
    }
  }
}

export const store = configureStore({
  // Pass in the root reducer setup as the `reducer` argument
  reducer: {
    // Declare that `state.counter` will be updated by the `counterReducer` function
    counter: counterReducer,
    user: userReducer,
  }
})
