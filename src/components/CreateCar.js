import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import '../css/CreateCar.css';

const CreateCar = () => {
  const [carData, setCarData] = useState({
    title: '',
    description: '',
    images: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error on form submit

    try {
      // Split 'images' and 'tags' from strings to arrays
      const imageArray = carData.images.split(',').map((img) => img.trim());
      const tagArray = carData.tags.split(',').map((tag) => tag.trim());

      // Check if the number of images exceeds 10
      if (imageArray.length > 10) {
        setError('You can only upload up to 10 image URLs.');
        setLoading(false);
        return;
      }

      const formattedCarData = {
        title: carData.title,
        description: carData.description,
        images: imageArray,
        tags: tagArray,
      };

      await axios.post('https://cma-backend-s3jf.onrender.com/api/cars/create', formattedCarData, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });

      navigate('/dashboard');  // Redirect to the dashboard after successful creation
    } catch (error) {
      console.error('Error creating car', error);
      setError('Failed to create car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create a New Car</h1>
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
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          name="tags"
          value={carData.tags}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Car'}
        </button>
      </form>

      {/* Back to Dashboard Button */}
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default CreateCar;
