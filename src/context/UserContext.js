import { createContext } from 'react';
const UserContext = createContext({
    name: null,
    token: null
})

export default UserContext;