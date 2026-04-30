# End-to-End System Simulation - Web Application

## Overview

This project is a Single Page Application (SPA) developed as part of a web development course.
It simulates a complete end-to-end system including Client, Server, Network, and Database layers, enabling users to manage data through a structured REST API interface.

## Features

* **User Authentication**: Login and Registration system with form validation
* **Data Management (CRUD)**: Create, Read, Update, and Delete records
* **Search Functionality**: Find specific items based on different criteria
* **SPA Navigation**: Dynamic page switching without full page reload
* **REST API Simulation**: Supports GET, POST, PUT, DELETE operations
* **FAJAX Mechanism**: Custom implementation simulating asynchronous client-server communication
* **Network Layer Simulation**: Handles request/response transfer between client and server
* **Database Layer (Local Storage)**: Stores and manages data using JSON objects
* **Separation of Concerns**: Distinct modules for Client, Server, DB, Network, and FAJAX

## Technologies Used

* **Frontend**: HTML5, CSS3, JavaScript (ES6+)
* **Architecture**: SPA (Single Page Application)
* **Data Format**: JSON
* **Concepts**: REST API, Asynchronous JavaScript, OOP (Classes & Objects)

## Project Structure

* Single main HTML file (index.html)
* Separate JavaScript files for:

  * Client logic
  * Server logic
  * Database (DB)
  * Network simulation
  * FAJAX implementation
* Separate CSS files for styling

## Getting Started

1. Clone the repository
2. Open the project folder
3. Run the application by opening:

   ```
   index.html
   ```
4. Use the application through your browser

## Notes

* This project simulates a full system (Client-Server-Database) on the client side
* Communication is implemented using a custom FAJAX mechanism
* Data is stored locally using Local Storage
* The project focuses on functionality and architecture rather than design
