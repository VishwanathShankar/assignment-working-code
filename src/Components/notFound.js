import React from 'react';             // Importing React to create a component
import '../Styles/search.css';         // Importing css file for external styles
import axios from 'axios';             // Importing axios to make API Calls within the component
import queryString from 'query-string';// Importing query-string package to parse the values from URL's query string 

class NotFound extends React.Component {
    render() {
        return (
            <div> Page not found component</div>
        );
    }
}

export default NotFound;