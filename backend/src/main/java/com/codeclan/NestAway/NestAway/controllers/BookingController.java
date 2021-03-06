package com.codeclan.NestAway.NestAway.controllers;

import com.codeclan.NestAway.NestAway.models.Booking;
import com.codeclan.NestAway.NestAway.repositories.bookings.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping(value = "/api/bookings")

public class BookingController {


    @Autowired
    BookingRepository bookingRepository;


    @GetMapping("/customer/{customer_id}")
    public List<Booking> findAllBookingsByCustomerId(@PathVariable Long customer_id){
        return bookingRepository.findAllBookingsByCustomerId(customer_id);
    }

    @GetMapping("/property/{property_id}")
    public List<Booking> findAllBookingsByPropertyId(@PathVariable Long property_id){
        return bookingRepository.findAllBookingsByPropertyId(property_id);
    }


}