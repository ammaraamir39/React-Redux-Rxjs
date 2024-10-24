import { Icon,Spin,Divider } from 'antd';
import React, { Component } from 'react'
import './notificationbell.css';
import { debounce } from 'lodash';

// import Cookies from 'js-cookie';
import axios from 'axios'

export class Notificationbell extends Component {
  state = {
    toggle: false,
    notifications: [],
    loading : true

  }

  // componentDidMount=()=>{
  //   axios.get('/api/get_notification').then((res)=>{
  //     console.log("response = >",res.data.message)
  //     this.setState({
  //       notifications: res.data.message
  //     })
  //   })
  // }
  getNotifications = () => {
    axios.get('/api/get_notification').then((res) => {
      console.log("response = >", res.data.message)
      this.setState({
        notifications: res.data.message,
        loading:false
      })
    })
  }


  toggleController = () => {
    this.state.toggle === false ? this.setState({
      toggle: true
    }) : this.setState({
      toggle: false
    })
    const debounceSave = debounce(() => this.getNotifications(), 1000)
    debounceSave() 
  }


  // showNotification=()=>{
  //   this.state.loading ? <Spin/> :  this.state.notifications.map(notify=>(
  //     <div class="media-body">
  //       <p>{notify.notification.notification_message}</p>
  //       {/* <p>36 minutes ago</p> */}
  //   </div>
  // ))
  // }



  render() {
    const {toggle ,notifications,loading} = this.state

    console.log("TOggle Controller=>",toggle)
    return (  
        <div class="dropdown">
            <button class="dropdownbtn" onClick={()=>this.toggleController()} >
                <Icon type="bell" class="dropbtn" />
            </button>
            {toggle ? (
               <div class="dropdown-content notification_dropdown" id="myDropdown">
               <div class="text-align">
                   <div>
                       <h3>Notifications</h3>
                   </div>
               </div>
               {
                 loading ? <Spin/> : (
                  <div class="borders">
                  {
                    notifications.map(notify=>(
                      <div class="media-body">
                        <p>{notify.notification.notification_message}</p>
                        {/* <p>36 minutes ago</p> */}
                        <Divider/>
                    </div>
                   
                  ))
                }
                  </div>
                 )
               }
       
            </div>
          ) : <div></div>}

        </div>
    );
  }
}

export default Notificationbell;