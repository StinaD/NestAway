import React, { Component, Fragment } from 'react';

import Request from '../helpers/Request.js'

import Home from '../components/Home.js';
import NavBar from '../components/NavBar.js';
import BookingForm from '../components/BookingForm.js';
import PropertiesList from '../components/PropertiesList.js';
import PropertyForm from '../components/PropertyForm.js';
import Booking from '../components/Booking.js';
import CustomerForm from '../components/CustomerForm.js';
import CustomersList from '../components/CustomersList.js';
import BookingsList from '../components/BookingsList.js';
import { BrowserRouter as Router, Route } from "react-router-dom";

class SiteContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      properties: [],
      filteredProperties: [],
      customers: [],
      bookings: [],
      selectedCustomer: null,
      selectedProperty: null,
      selectedStartDate: null,
      selectedEndDate: null
    }

    this.criteria = null;
    this.bookingInfo = null;

    this.handleBookingCriteriaSubmit = this.handleBookingCriteriaSubmit.bind(this);
    this.setSelectedCustomer = this.setSelectedCustomer.bind(this);
    this.setSelectedProperty = this.setSelectedProperty.bind(this);
    // this.handleBookingPost = this.handleBookingPost.bind(this);
  }

  componentDidMount(){
    let request = new Request()
    request.get('/api/properties').then((propertiesData) => {
      this.setState({properties: propertiesData._embedded.properties})
    });
    request.get('/api/customers').then((customersData) => {
      this.setState({customers: customersData._embedded.customers})
      console.log(this.state.customers);
    });
    request.get('/api/bookings').then((bookingData) => {
     this.setState({bookings: bookingData._embedded.bookings})
     console.log(this.state.bookings);
   });

  }

  handleBookingCriteriaSubmit(criteria){
    this.criteria = criteria;

    const startDateArray = criteria.startDate.split("-");
    const reformattedStartDate = startDateArray[2] + startDateArray[1] + startDateArray[0];
    this.criteria.startDate = reformattedStartDate;

    const endDateArray = criteria.endDate.split("-");
    const reformattedEndDate = endDateArray[2] + endDateArray[1] + endDateArray[0];
    this.criteria.endDate = reformattedEndDate;

    console.log(criteria);

    const request = new Request();
    request.get(`/api/properties/findproperties/${this.criteria.startDate}/${this.criteria.endDate}/${this.criteria.capacity}/${this.criteria.maxPricePerNight}`).then((filteredPropertiesData) => {
      this.setState({filteredProperties: filteredPropertiesData});
    })
  }



  handleCustomerPost(customerInfo){
    const request = new Request();
    request.post('/api/customers', customerInfo).then(() => {
      window.location = '/bookingform'
    })
  }

  handlePropertyPost(propertyInfo){
    const request = new Request();
    request.post('/api/properties', propertyInfo).then(() => {
      window.location = '/properties'
    })
  }

  // handleBookingPost(){
  //   const confirmedBooking = {
  //     "customer_id": this.state.selectedCustomer,
  //     "property_id": this.state.selectedProperty,
  //     "startDate": this.state.selectedStartDate,
  //
  //   }
  //   const request = new Request();
  //   request.post('/api/bookings', confirmedBooking).then(() => {
  //     window.location = '/bookings'
  //   })
  // }

  setSelectedCustomer(index){
    console.log(index);
    let newSelectedCustomer = this.state.customers[index].id
    this.setState({selectedCustomer: newSelectedCustomer});
    // this.selectedCustomer = index;
    // console.log(this.selectedCustomer);
  }

  setSelectedProperty(propertyId){
    console.log(propertyId);
    let newSelectedProperty = propertyId
    this.setState({selectedProperty: newSelectedProperty})
    // this.selectedProperty = index;
    // console.log(this.selectedProperty);
  }

  render(){
    return (
      <Router>
      <Fragment>
      <h1 className="website-header">NestAway</h1>
      <NavBar/>
      <Route exact path="/" component={Home} />

      <Route path="/bookingform"
        render={() => <BookingForm
          filteredProperties={this.state.filteredProperties} onCriteriaSubmit={this.handleBookingCriteriaSubmit}
          existingCustomers={this.state.customers}
          setSelectedCustomer={this.setSelectedCustomer}
          setSelectedProperty={this.setSelectedProperty}
          // handleBookingPost={this.handleBookingPost}
          selectedCustomer={this.state.selectedCustomer}
          selectedProperty={this.state.selectedProperty}
          bookingCriteria={this.criteria}
        />
      }
      />

      <Route path="/customerform"
        render={() => <CustomerForm
          handleCustomerPost={this.handleCustomerPost}
        />
      }
      />

      <Route path="/customers"
        render={() => <CustomersList
          customers={this.state.customers}
        />
      }
      />

      <Route path="/propertyform"
        render={() => <PropertyForm handlePropertyPost={this.handlePropertyPost}
        />
      }
      />

      <Route path="/properties"
        render={() => <PropertiesList
          properties={this.state.properties}
        />
      }
      />

      <Route path="/bookings" render={() => <BookingsList bookings={this.state.bookings} />
      }
      />

      </Fragment>
      </Router>


    )
  }


}

  export default SiteContainer;
