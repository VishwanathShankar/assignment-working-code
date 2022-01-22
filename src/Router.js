import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'; // package to perform routing in react app
import Home from './Components/Home';
import Filter from './Components/Filter';
import Details from './Components/Details';
import Header from './Components/Header';

const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Route exact path="/" component={Home} />
            <Route path="/restaurantsearchpage" component={Filter} />
            <Route path="/restaurantdetailspage" component={Details} />
        </BrowserRouter>
    )
}

export default Router;