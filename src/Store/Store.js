import { configureStore, createSlice } from '@reduxjs/toolkit'
import { config } from '../config'
import axios from 'axios'



export const userReducer = createSlice({
    name:'user',
    initialState: {},
    reducers: {
        setLogguedUser: (state, action) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})
export const rutasReducer = createSlice({
    name:'rutas',
    initialState: [],
    reducers: {
        setRutasObj: (state, action) => {
            return [
                ...action.payload
            ]
        }
    }
})
export const rutasHomeReducer = createSlice({
    name:'rutasHome',
    initialState: [],
    reducers: {
        setHomeRutas: (state, action) => {
            return [
                ...action.payload
            ]
        }
    }
})

export const postsHomeReducer = createSlice({
    name:'postsHome',
    initialState: [],
    reducers: {
        setPostsHome: (state, action) => {
            return [
                ...action.payload
            ]
        }
    }
})
export const tutorialState = createSlice({
    name:'tutorial',
    initialState: false,
    reducers: {
        setTutorialState: (state, action) => {
            return action.payload
            
        }
    }
})
export const blogState = createSlice({
    name:'blog',
    initialState: false,
    reducers: {
        setBlogState: (state, action) => {
            return action.payload
            
        }
    }
})

export const store = configureStore({
    reducer: {
        user: userReducer.reducer,
        rutasHome: rutasHomeReducer.reducer,
        rutas: rutasReducer.reducer,
        posts: postsHomeReducer.reducer,
        tutorial: tutorialState.reducer,
        blog: blogState.reducer
    }
})

export const getRutasHome = () => {
    const urlRutasHome = `${config.apiUrl}/rutas/limit/3`

    axios.get(urlRutasHome)
        .then((response) => {
            if(response.error) {
                  console.log('error')
            } else {
                store.dispatch(rutasHomeReducer.actions.setHomeRutas(response.data))
            }
                                    
        }) 
        .catch(error => console.log('Error getting rutas: ', error))
}
export const getRutas = () => {
    const urlRutasHome = `${config.apiUrl}/rutas`

    axios.get(urlRutasHome)
        .then((response) => {
            if(response.error) {
                  console.log('error')
            } else {
                store.dispatch(rutasReducer.actions.setRutasObj(response.data))
            }
                                    
        }) 
        .catch(error => console.log('Error getting rutas: ', error))
}
export const getHomePosts = () => {
    const homePosts = `${config.apiUrl}/pages`
    axios.get(homePosts)
        .then((response) => {
            if(response.error) {
                  console.log('error')
            } else {
                store.dispatch(postsHomeReducer.actions.setPostsHome(response.data))
            }
                                    
        }) 
        .catch(error => console.log('Error getting blog posts: ', error))
}



