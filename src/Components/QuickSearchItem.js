import React from 'react';
import { withRouter } from 'react-router-dom';


class QuickSearchItem extends React.Component {
    handleClick = (Id) => {
        const mealtype = Id;
        const city = sessionStorage.getItem('city');
        const area = sessionStorage.getItem('area');
        this.props.history.push(`/restaurantsearchpage/?mealtype=${mealtype}&area=${area}&city=${city}`);
    }

    render() {
        const { id, name, content, image } = this.props;
        return (
            <div className="col-sm-12 col-md-12 col-lg-4" onClick={() => this.handleClick(id)}>
                <div className="tileContainer">
                    <div className="tileComponent1">
                        <img src={require('../' + image)} height="150" width="140" />
                    </div>
                    <div className="tileComponent2">
                        <div className="componentHeading">
                            {name}
                        </div>
                        <div className="componentSubHeading">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearchItem);