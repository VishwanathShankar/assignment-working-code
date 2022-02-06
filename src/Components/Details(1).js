import React from 'react';      // Importing React to create Component
import axios from 'axios';      // Importing axios to make API Calls
import { Carousel } from 'react-responsive-carousel';     // Importing Carousal for Image Carousal
import Modal from 'react-modal';                          // Importing Modal for Creating Pop-Out 
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../Styles/details.css';
import queryString from 'query-string';

// Image Gallery Modal style object which adds pop-out effect, adds margin, background color and sets height and width of the poped out window
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '15px',
        backgroundColor: 'white',
        border: 'solid 2px brown',
        zIndex: '50'
    }
};

class Details extends React.Component {
    constructor() {
        super();
        // Initializing state in component's constructor
        this.state = {
            restaurant: {},
            items: [],
            restaurantId: undefined,
            loginModalIsOpen: false,
            orderModalIsOpen: false,
            detailModelsOpen: false,
            subTotal: 0,
            Name: '',
            Mobile: '',
            Address: ''
        }
    }

    componentDidMount() {
        // Capturing the Restaurant Id from URL and making API Call to fetch the details of specific restaurant by it's Id
        const queryParams = queryString.parse(this.props.location.search);
        const restaurantId = queryParams.restaurant;
        axios({
            method: 'GET',
            url: `http://20.127.128.75:6503/api/getResById/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ restaurant: res.data.restaurant, restaurantId: restaurantId }))
            .catch(err => console.log(err))
    }

    handleGallery = () => {
        // setState to open the modal
        this.setState({ loginModalIsOpen: true });
    }

    handleClose = () => {
        // setState to close the modal
        this.setState({ loginModalIsOpen: false });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {

        return fetch(`http://20.127.128.75:6503/api/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    makePayment = () => {
        const { subTotal } = this.state;
        this.getData({ amount: subTotal, email: 'abc@gmail.com' }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information)
        })
    }

    makeOrder = () => {
        const { restaurantId } = this.state;
        axios({
            method: 'GET',
            url: `http://20.127.128.75:6503/api/getItemsbyrestaurant/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ items: res.data.itemsList, orderModalIsOpen: true }))
            .catch(err => console.log(err))
    }

    handlefooditemclose = () => {
        this.setState({ orderModalIsOpen: false })
    }

    openDetailsWindow = () => {
        this.setState({ detailModelsOpen: true, orderModalIsOpen: false })
    }

    addItems = (index, operationType) => {
        let total = 0;
        let items = [...this.state.items];
        let item = { ...items[index] };
        if (operationType == 'add') {
            item.qty = item.qty + 1;
        } else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ items, subTotal: total });
    }

    handleChange = (event, state) => {
        this.setState({
            [state]: event.target.value
        })
    }

    render() {
        const { restaurant, loginModalIsOpen, orderModalIsOpen, detailModelsOpen, items, subTotal, Name, Mobile, Address } = this.state;
        return (
            <div>
                {/* Checking the restaurant availability -- If present will show the details else empty page */}
                { restaurant != null ?
                    < React.Fragment >
                        <div>
                            {/* Showcasing the First Image and rest will be showed in the Carousal  */}
                            {restaurant.thumb && <img src={require('../' + restaurant.thumb[0])} width="100%" height="500px" />}
                            <button class="gallery-button" onClick={this.handleGallery}>Click to see Image Gallery</button>
                        </div>
                        <button className="btn btn-danger" style={{ float: 'right', margin: '25px' }} onClick={this.makeOrder}>Place Online Order</button>
                        {/* Showing 2 Tabs on screen as Overview and Contact with details in respective sections*/}
                        <div class="heading">{restaurant.name}</div>
                        <div class="tabs">
                            {/* Tab-1 */}
                            <div class="tab">
                                <input type="radio" id="tab-1" name="tab-group-1" checked />
                                <label for="tab-1">Overview</label>

                                <div class="content">
                                    <div class="about">About the place</div>
                                    <div class="head">Cuisine</div>
                                    <div class="value">{restaurant.cuisine && restaurant.cuisine.map((item) => item.name + ', ')}</div>
                                    <div class="head">Average Cost</div>
                                    <div class="value">&#8377; {restaurant.min_price}</div>
                                </div>
                            </div>
                            {/* Tab-2 */}
                            <div class="tab">
                                <input type="radio" id="tab-2" name="tab-group-1" />
                                <label for="tab-2">Contact</label>
                                <div class="content">
                                    <div class="head">Phone Number</div>
                                    <div class="value">{restaurant.contact_number}</div>
                                    <div class="head">{restaurant.name}</div>
                                    <div class="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                                </div>
                            </div>
                        </div>
                        {/* Modal within which we will show the carousal of Images*/}
                        <Modal
                            isOpen={loginModalIsOpen}
                            style={customStyles}
                        >
                            <div>
                                <button className="btn btn-sm btn-warning" style={{ float: 'right' }} onClick={this.handleClose}>Close</button>
                                {/* Carousel of Images with all dynamic images coming from server*/}
                                <Carousel showThumbs={false}>
                                    {restaurant && restaurant.thumb && restaurant.thumb.map((item) => {
                                        return <div>
                                            <img src={require('../' + item)} />
                                        </div>
                                    })}
                                </Carousel>
                            </div>
                        </Modal>
                        <Modal
                            isOpen={orderModalIsOpen}
                            style={customStyles}>

                            <div >
                                <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={this.handlefooditemclose}></div>
                                <h3 className="restaurant-name">{restaurant.name}</h3>
                                {items.map((item, index) => {
                                    return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                        <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                            <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                    <span className="card-body">
                                                        <h5 className="item-name">{item.name}</h5>
                                                        <h5 className="item-name">&#8377;{item.price}</h5>
                                                        <p className="card-text">{item.description}</p>
                                                    </span>
                                                </div>
                                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={require(`../${item.image}`)} />
                                                    {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                        <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })}
                                <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>
                                    <div className="row">
                                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 subtotal" style={{ paddingLeft: '26px' }}>Subtotal</div>
                                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 subtotal">&#8377;{subTotal}</div>
                                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4"><button className="btn btn-danger" style={{ marginLeft: '30px' }} onClick={this.openDetailsWindow}>Pay Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <Modal
                            isOpen={detailModelsOpen}
                            style={customStyles}>

                            <div >
                                <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={this.handledetailsmodeclose}></div>
                                <h3 className="restaurant-name">{restaurant.name}</h3>
                                <table className="table table-border table-striped table-hover">
                                    <tr>
                                        <td>
                                            <label>Name : </label>
                                        </td>
                                        <td>
                                            <input type="text" className=" mhinput" value={Name} onChange={(event) => this.handleChange(event, 'Name')} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Mobile No : </label>
                                        </td>
                                        <td>
                                            <input type="text" className=" mhinput" value={Mobile} onChange={(event) => this.handleChange(event, 'Mobile')} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Address : </label>
                                        </td>
                                        <td>
                                            <textarea rows="10" cols="22" value={Address} style={{ height: '80px' }} className=" mhinput" onChange={(event) => this.handleChange(event, 'Address')} />
                                        </td>
                                    </tr>
                                </table>
                                <button className="btn btn-danger" style={{ float: 'right' }} onClick={this.makePayment}>PROCEED</button>
                            </div>
                        </Modal>
                    </React.Fragment> : null
                }
            </div>
        )
    }
}

export default Details;  // exporting the component