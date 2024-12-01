import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { GlobalState } from '../../GlobalState'
import Login from './auth/Login'
import Welcome from './auth/Welcome'
import Loading from './utils/loading/Loading'
import NotFound from './utils/not_found/NotFound'
import Form from './visitor/Form'

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin


    return (
        <Switch>
            {/* <Route path="/" exact component={Products} /> */}
            {/* <Route path="/detail/:id" exact component={DetailProduct} /> */}

            <Route path="/" exact component={isLogged ? Welcome : Login} />
            <Route path="/welcome" exact component={isAdmin ? Welcome : Loading} />
            {/* <Route path="/visitor-info" exact component={isAdmin ? VisitorInfo : NotFound} /> */}
            <Route path="/visitor" exact component={isAdmin ? Form : Loading} />
            
            
            {/* <Route path="/category" exact component={isAdmin ? Categories : NotFound} />
            <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFound} />
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFound} />

            <Route path="/history" exact component={isLogged ? OrderHistory : NotFound} />
            <Route path="/history/:id" exact component={isLogged ? OrderDetails : NotFound} />

            <Route path="/cart" exact component={Cart} /> */}


            <Route path="*" exact component={NotFound} />
        </Switch>
    )
}

export default Pages
