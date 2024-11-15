import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate and useParams
import { useCookies } from 'react-cookie';
import axios from 'axios';

const EditCar = () => {
  const { carId } = useParams();  // Get carId from the URL
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);

  // Initialize carData with API response structure
  const [carData, setCarData] = useState({
    title: '',
    description: '',
    images: '',
    tags: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userToken = cookies.access_token;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`https://cma-backend-s3jf.onrender.com/api/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,  // Pass the user token in the header
          },
        });
        const carData = response.data;

        // Extract images as a single string (or handle array differently)
        setCarData({
          title: carData.title,
          description: carData.description,
          images: carData.images.join(', '),  // Join image URLs into a string
          tags: carData.tags.join(', '),      // Join tags into a string
        });
      } catch (error) {
        console.error('Error fetching car data', error);
      } finally {
        setLoading(false);  // Stop the loading spinner after the data is fetched
      }
    };

    if (userToken) {
      fetchCar();  // Fetch car data if the user token exists
    }
  }, [carId, userToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });  // Update carData state on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error on form submit

    try {
      // Split image URLs and tags from the input string
      const imageArray = carData.images.split(',').map((url) => url.trim());
      const tagArray = carData.tags.split(',').map((tag) => tag.trim());

      // Check if the number of image URLs exceeds 10
      if (imageArray.length > 10) {
        setError('You can only upload up to 10 image URLs.');
        setLoading(false);
        return;
      }

      // Update the car details with the new data
      await axios.put(`https://cma-backend-s3jf.onrender.com/api/cars/${carId}`, {
        title: carData.title,
        description: carData.description,
        images: imageArray,  // Send images as an array
        tags: tagArray,      // Send tags as an array
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,  // Send the token again when updating
        },
      });
      navigate('/dashboard');  // Redirect to the dashboard after successful update
    } catch (error) {
      console.error('Error updating car', error);
      setError('Failed to update car. Please try again.');  // Show error if the update fails
    } finally {
      setLoading(false);  // Stop the loading spinner after submitting
    }
  };

  return (
    <div>
      <h1>Edit Car</h1>
      {loading ? (
        <p>Loading car data...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={carData.title}
            onChange={handleChange}
            required
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={carData.description}
            onChange={handleChange}
            rows="6"
            cols="40"
            required
          />
          <label>Image URLs (comma-separated, max 10):</label>
          <input
            type="text"
            name="images"
            value={carData.images}
            onChange={handleChange}
          />
          {error && <p className="error">{error}</p>}  {/* Display error message */}
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={carData.tags}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Car'}
          </button>
        </form>
      )}

      {/* Back to Dashboard Button */}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default EditCar;
