import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'; // package to perform routing in react app
import Home from './Components/Home';
import Filter from './Components/Filter';
import Details from './Components/Details';
import Header from './Components/Header';
import NotFound from './Components/notFound';


const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/restaurantsearchpage" component={Filter} />
                <Route exact path="/restaurantdetailspage" component={Details} />
                <Route component={NotFound} />
            </Switch>
                 
        </BrowserRouter>
    )
}

//<Route path='*' exact component={NotFound} />  
export default Router;