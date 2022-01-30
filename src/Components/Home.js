import React from 'react';
import '../Styles/home.css';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';
import axios from 'axios';
import { Link } from "react-router-dom";


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: [],
            routeUrl: ''
        }
    }

    componentDidMount() {

        sessionStorage.setItem('area', undefined);
        sessionStorage.setItem('city', undefined);
        this.setState({
            routeUrl: "restaurantdetailspage"
        });

        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/cityList',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ locations: res.data.city }))
            .catch(err => console.log(err))


        axios({
            method: 'GET',
            url: ' http://localhost:6503/api/mealtype',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => this.setState({ mealtypes: response.data.mealtype }))
            .catch(err => console.log(err))
    }

    render() {
        const { locations, mealtypes, routeUrl } = this.state;
        const newURL = "/" + routeUrl + "?testQueryparm=Vishwanath"
        return (
            <React.Fragment>
                <Link to={newURL}>Dynamic URL</Link>
                <div></div>
                <Link to="/restaurantsearchpage?testKey=testValue&mealtype=1&area=&city=">restaurantsearchpage</Link>
                <Wallpaper locations={locations} />
                <QuickSearch mealtypes={mealtypes} />
            </React.Fragment>
        )
    }
}

export default Home;