import React from 'react';             // Importing React to create a component
import '../Styles/search.css';         // Importing css file for external styles
import axios from 'axios';             // Importing axios to make API Calls within the component
import queryString from 'query-string';// Importing query-string package to parse the values from URL's query string 

class Filter extends React.Component {
    constructor() {
        super();
        // Initializing the state required within the component
        this.state = {
            restaurantList: [],
            locationList: [],
            pageCount: [],
            location: undefined,
            cuisine: [],
            mealtype: undefined,
            hcost: undefined,
            lcost: undefined,
            page: 1,
            sort: 1
        }
    }

    componentDidMount() {
        /* componentDidMount function to capture the values from URL,
            and then make an API Call to filter the data in UI */

        // Capturing the values from query string and parsing it to fetch individual keys from URL
        const queryParams = queryString.parse(this.props.location.search);
        const location_id = queryParams.area;
        const mealtype_id = queryParams.mealtype;

        const { sort, page } = this.state;

        // Creating an Object to pass as an input param to Filter API Call
        let filterObj = {
            location_id: location_id,
            mealtype_id: mealtype_id,
            sort: sort,
            page: page
        };

        // Making Filter API Call 
        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => this.setState({
                restaurantList: res.data.restaurant,
                pageCount: res.data.pageCount,
                mealtype: mealtype_id,
                location: location_id
            }))
            .catch(err => console.log(err))

        // Making location API Call to bind the values in location dropdown
        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/cityList',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ locationList: res.data.city }))
            .catch(err => console.log(err))
    }

    handleClick = (itemId) => {
        // Routing to URL using history object
        this.props.history.push(`/restaurantdetailspage/?restaurant=${itemId}`);
    }

    handleLocationChange = (event) => {
        /* This function will be invoked on location value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const area = event.target.value.split('-')[0];
        const city = event.target.value.split('-')[1];
        const { cuisine, mealtype, hcost, lcost, page, sort } = this.state;

        // making the input object for filter API basis changed location
        let filterObj = {
            location_id: area,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/restaurantsearchpage?area=${area}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => this.setState({ restaurantList: res.data.restaurant, pageCount: res.data.pageCount, location: area }))
            .catch(err => console.log(err))
    }

    handlePageChange = (pageNumber) => {
        /* This function will be invoked on pagination value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const page = pageNumber;
        const { location, cuisine, mealtype, hcost, lcost, sort } = this.state;

        // making the input object for filter API basis changed pagination
        let filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/restaurantsearchpage?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => this.setState({ restaurantList: res.data.restaurant, pageCount: res.data.pageCount, page: page }))
            .catch(err => console.log(err))
    }

    handleCuisineChange = (cuisineId) => {
        /* This function will be invoked on cuisine value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { cuisine, location, mealtype, hcost, lcost, sort, page } = this.state;

        // pushing and poping the cuisines values from array
        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        }
        else {
            var index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }

        // making the input object for filter API basis changed cuisine
        let filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/restaurantsearchpage?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => this.setState({ restaurantList: res.data.restaurant, pageCount: res.data.pageCount, cuisine: cuisine }))
            .catch(err => console.log(err))
    }

    onSortChange = (sort) => {
        /* This function will be invoked on sort radio button value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { location, cuisine, lcost, hcost, mealtype, page } = this.state;

        // making the input object for filter API basis changed sort option
        let filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: Number(sort),
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/restaurantsearchpage?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => this.setState({ restaurantList: res.data.restaurant, sort: Number(sort), pageCount: res.data.pageCount }))
            .catch(err => console.log(err))
    }

    handleCostChange = (lcost, hcost) => {
        /* This function will be invoked on cost filter value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { location, cuisine, mealtype, sort, page } = this.state;

        // making the input object for filter API basis changed cost
        let filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/restaurantsearchpage?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => this.setState({
                restaurantList: res.data.restaurant,
                lcost: Number(lcost),
                hcost: Number(hcost),
                pageCount: res.data.pageCount
            }))
            .catch(err => console.log(err))
    }

    render() {
        const { restaurantList, locationList, pageCount, sort } = this.state;
        return (
            <div>
                <div id="myId" className="heading-filter">Breakfast Places in Delhi</div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3 col-md-3 col-lg-3">
                            <div className="filter-options">
                                <span className="glyphicon glyphicon-th-list toggle-span" data-toggle="collapse"
                                    data-target="#demo"></span>
                                <div id="demo" className="collapse show">
                                    <div className="filter-heading">Filters</div>
                                    <div className="Select-Location">Select Location</div>
                                    <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                                        <option>Select</option>
                                        {locationList.map((item) => {
                                            return <option value={`${item.location_id}-${item.city_id}`}>{`${item.name}, ${item.city}`}</option>
                                        })}
                                    </select>
                                    <div className="Cuisine">Cuisine</div>
                                    <div>
                                        <input type="checkbox" value="1" onChange={() => this.handleCuisineChange(1)} />
                                        <span className="checkbox-items">North Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                        <span className="checkbox-items">South Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                        <span className="checkbox-items">Chineese</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                        <span className="checkbox-items">Fast Food</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                        <span className="checkbox-items">Street Food</span>
                                    </div>
                                    <div className="Cuisine">Cost For Two</div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                        <span className="checkbox-items">Less than &#8377; 500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                        <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                        <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                        <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                                        <span className="checkbox-items">&#8377; 2000 +</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 10000)} />
                                        <span className="checkbox-items">All</span>
                                    </div>
                                    <div className="Cuisine">Sort</div>
                                    <div>
                                        <input type="radio" name="sort" checked={sort == 1} onChange={() => this.onSortChange(1)} />
                                        <span className="checkbox-items">Price low to high</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="sort" checked={sort == -1} onChange={() => this.onSortChange(-1)} />
                                        <span className="checkbox-items">Price high to low</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="col-sm-9 col-md-9 col-lg-9 scroll">
                                {restaurantList.length > 0 ? restaurantList.map((item) => {
                                    return <div className="Item" onClick={() => this.handleClick(item._id)}>
                                        <div className="row pl-1">
                                            <div className="col-sm-4 col-md-4 col-lg-4">
                                                <img className="img" src={require('../Assets/breakfast.jpg')} />
                                            </div>
                                            <div className="col-sm-8 col-md-8 col-lg-8">
                                                <div className="rest-name">{item.name}</div>
                                                <div className="res-location">{item.locality}</div>
                                                <div className="rest-address">{item.city}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row padding-left">
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                <div className="rest-address">CUISINES : {item.cuisine.map((item) => item.name + ', ')}</div>
                                                <div className="rest-address">COST FOR TWO : {item.min_price} </div>
                                            </div>
                                        </div>
                                    </div>
                                }) : <div className="noData"> No Data Found</div>}
                            </div>
                            {pageCount.length >= 1 && <div className="pagination">
                                <a href="#">&laquo;</a>
                                {pageCount.map((item) => {
                                    return < a href="#">{item}</a>
                                })}
                                <a href="#">&raquo;</a>
                            </div>}
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Filter;