import React from 'react';
import '../Styles/home.css';
import QuickSearchItem from './QuickSearchItem';

class QuickSearch extends React.Component {

    render() {
        const { mealtypes } = this.props;
        return (
            <div>
                <div className="quicksearch">
                    <p className="quicksearchHeading">
                        Quick Searches
                        </p>
                    <p className="quicksearchSubHeading">
                        Discover restaurants by type of meal
                        </p>
                    <div className="container-fluid">
                        <div className="row">
                            {mealtypes.map((item) => {
                                return <QuickSearchItem id={item.meal_type} name={item.name} content={item.content} image={item.image} />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default QuickSearch;