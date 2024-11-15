import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (carId) => {
    try {
      setLoading(true);
      await axios.delete(`https://cma-backend-s3jf.onrender.com/api/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      alert('Car deleted successfully!');
      setCars(cars.filter((car) => car._id !== carId)); // Remove deleted car from the state
      setFilteredCars(filteredCars.filter((car) => car._id !== carId)); // Update filtered list
    } catch (error) {
      console.error('Error deleting car', error);
      alert('Failed to delete the car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('https://cma-backend-s3jf.onrender.com/api/cars', {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log("Fetched cars:", response.data);  // Debugging log for fetched cars
        setCars(response.data);
        setFilteredCars(response.data); // Initialize filtered list
      } catch (err) {
        console.error("Error fetching cars", err);
        navigate("/login");
      }
    };

    fetchCars();
  }, [cookies.access_token, navigate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCars(cars.filter(car => 
      car.title.toLowerCase().includes(query) || 
      car.description.toLowerCase().includes(query)
    ));
  };

  return (
    <div id='dashbord'>
      <h1>My Dashboard</h1>
      <div className="dashboard-header">
        <button onClick={() => navigate('/car/create')}>Create New Car</button>
        <input 
          type="text" 
          placeholder="Search cars..." 
          value={searchQuery} 
          onChange={handleSearch} 
        />
      </div>
      <ul>
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <li key={car._id}>
              <h2>{car.title}</h2>
              <p>{car.description}</p>
              <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
                {car.images.length > 0 ? (
                  car.images.map((image, index) => {
                    console.log("Car image URL:", image); // Debugging log for image URLs
                    return (
                      <div key={index}>
                        {/* Ensure the URL is valid */}
                        <img src={image} alt={`Car ${index}`} onError={(e) => e.target.src = '/path/to/default-image.jpg'} />
                      </div>
                    );
                  })
                ) : (
                  <p>No images available</p>
                )}
              </Carousel>
              <div>
                <button onClick={() => navigate(`/car/edit/${car._id}`)}>Edit</button>
                <button onClick={() => handleDelete(car._id)} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No cars found.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
