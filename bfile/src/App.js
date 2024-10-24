import React, { Component } from 'react';
import 'antd/dist/antd.css';
import "react-datepicker/dist/react-datepicker.css";
import Routes from './Routes';
// import firebase,{getToken} from './firebase';

class App extends Component {
    // state= {
    //     tokenNotifier : false,
    //     token : ''
    // }
    // componentDidMount=()=>{
    //     let token = getToken(this.state.tokenNotifier)
    //     this.setState({
    //         token
    //     })
    // }

    
    render() {
        return (
            <Routes />
        );
    }
}

export default App;
