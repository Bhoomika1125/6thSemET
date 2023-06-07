import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Cookies from "js-cookie";
import '../pages/Home2.css';
const Home2 = () => {
  const [blogs, setBlogs] = useState([]);
  const[username, setUsername]=useState('');
    useEffect(() => {
        const storedUsername = Cookies.get('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }, []);
  useEffect(() => {
    // Fetch the blogs from the backend API
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/home2'); // Replace with your API endpoint
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <Navbar/>
      <h1>Blog Home Page</h1>
      <h1>Welcome {username}</h1>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <h2>{blog.category}</h2>
          <img src= {`http://localhost:3001/uploads/${blog.img}`} alt={blog.title} height="150px" width="250px"/>
          <p>{blog.subtitle}</p>
          <p>{blog.body}</p>
          <p>Author: {blog.createdUser}</p>
          <p>Time: {blog.timeCreated}</p>
        </div>
      ))}
    </div>
  );
};

export default Home2;
