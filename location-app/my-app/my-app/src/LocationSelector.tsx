import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Home, Briefcase, Users } from 'lucide-react';

const containerStyle = {
  width: '900%',
  height: '900px',
};

const center = {
  lat: 19.076,
  lng: 72.8777,
};

interface Address {
  id: string;
  type: 'home' | 'office' | 'friends' | 'other';
  houseNo: string;
  area: string;
  fullAddress: string;
  lat: number;
  lng: number;
}

export const LocationSelector = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCvqxiS1kRzIsjUyT55QpDZlc_cGy0lgdk',
    libraries: ['places'],
  });

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState(center);
  const [address, setAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    houseNo: '',
    area: '',
    type: 'home',
  });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/addresses');
      const data = await response.json();
      setSavedAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLocation({
          lat: place.geometry?.location?.lat() || center.lat,
          lng: place.geometry?.location?.lng() || center.lng,
        });
      }
    }
  };

  const handleLocationChange = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      getAddressFromCoordinates(e.latLng.lat(), e.latLng.lng());
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      setAddress(data.results[0]?.formatted_address || 'Unknown location');
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const newAddress = {
        type: formData.type,
        houseNo: formData.houseNo,
        area: formData.area,
        fullAddress: address,
        lat: location.lat,
        lng: location.lng,
      };

      await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });

      fetchSavedAddresses();
      setShowAddressForm(false);
      setFormData({ houseNo: '', area: '', type: 'home' });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
          setIsModalOpen(false);
        },
        () => {
          alert('Permission denied. Please search manually.');
        }
      );
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      houseNo: address.houseNo,
      area: address.area,
      type: address.type,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/addresses/${id}`, {
        method: 'DELETE',
      });
      fetchSavedAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleMapPreview = (address: Address) => {
    setLocation({ lat: address.lat, lng: address.lng });
    setAddress(address.fullAddress);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Location permission is off</h3>
            <p className="mb-4">We need your location to find the nearest store & provide you a seamless delivery experience.</p>
            <button
              onClick={requestLocationPermission}
              className="w-full mb-2 bg-red-600 text-white py-2 rounded"
            >
              Enable Location
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full border border-red-600 text-red-600 py-2 rounded"
            >
              Search your Location Manually
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Location Information</h2>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={14}
            onClick={handleLocationChange}
          >
            <Marker position={location} />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      <div className="mb-6">
        <p className="font-semibold mb-2">Selected Address:</p>
        <p>{address}</p>
        <button
          onClick={() => setShowAddressForm(true)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Save This Location
        </button>
      </div>

      {showAddressForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Add Address Details</h3>
          <input
            type="text"
            placeholder="House/Flat/Block No."
            value={formData.houseNo}
            onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Apartment/Road/Area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setFormData({ ...formData, type: 'home' })}
              className={`flex items-center gap-2 p-2 rounded ${
                formData.type === 'home' ? 'bg-red-100' : 'bg-gray-100'
              }`}
            >
              <Home size={20} /> Home
            </button>
            <button
              onClick={() => setFormData({ ...formData, type: 'office' })}
              className={`flex items-center gap-2 p-2 rounded ${
                formData.type === 'office' ? 'bg-red-100' : 'bg-gray-100'
              }`}
            >
              <Briefcase size={20} /> Office
            </button>
            <button
              onClick={() => setFormData({ ...formData, type: 'friends' })}
              className={`flex items-center gap-2 p-2 rounded ${
                formData.type === 'friends' ? 'bg-red-100' : 'bg-gray-100'
              }`}
            >
              <Users size={20} /> Friends & Family
            </button>
          </div>
          <button
            onClick={handleSaveAddress}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Save Address
          </button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Saved Addresses</h3>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">House No.</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Area</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Full Address</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedAddresses.map((addr) => (
              <tr key={addr.id} className="border-b">
                <td className="px-4 py-2">{addr.type === 'home' && <Home size={20} />} {addr.type === 'office' && <Briefcase size={20} />} {addr.type === 'friends' && <Users size={20} />} {addr.type}</td>
                <td className="px-4 py-2">{addr.houseNo}</td>
                <td className="px-4 py-2">{addr.area}</td>
                <td className="px-4 py-2">{addr.fullAddress}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditAddress(addr)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleMapPreview(addr)}
                    className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                  >
                    View on Map
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationSelector;
