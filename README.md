# geolocation
# Location Selector App

This is a React application that allows users to select, save, and manage locations on a map. The app integrates Google Maps for location selection, with features like saving addresses, editing, and viewing saved locations. It also supports location permissions and geolocation.

## Features

- **Google Maps Integration:** Users can select locations on the map.
- **Address Management:** Users can save, edit, and view addresses with types (Home, Office, Friends & Family).
- **Geolocation Support:** The app requests location permission to automatically detect the user's current location.
- **Form for Address Details:** Users can input address details like house number and area.
- **Saved Addresses Table:** Displays a list of saved addresses with the option to view them on the map.
- **Location Search:** Users can search and select locations using Google Places API.

## Installation

### Prerequisites

Before you begin, ensure you have the following software installed:

- [Node.js](https://nodejs.org/) - A JavaScript runtime used for building and running React apps.
- [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- [Google Maps API Key](https://console.cloud.google.com/) - Required for Google Maps integration.

### 1. Clone the Repository

First, clone the repository to your local machine.

git clone https://github.com/luckymoturi/geolocation.git
cd geolocation

npm install
# or
yarn install

#Backend

node index.js

#Frontend 

npm run dev
