// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// function MyBlogs() {
//   const [username, setUsername] = useState('');
//   const [userBlogs, setUserBlogs] = useState([]);

//   useEffect(() => {
//     const storedUsername = Cookies.get('username');
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchUserBlogs = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/myblogs?username=${username}`);
//         setUserBlogs(response.data);
//       } catch (error) {
//         console.error('Error fetching user blogs:', error);
//       }
//     };

//     fetchUserBlogs();
//   }, [username]);

//   return (
//     <>
//       <h1>My Blogs</h1>
//       <h2>Welcome, {username}</h2>

//       <div>
//         {userBlogs.map((blog) => (
//           <div key={blog.id}>
//             <h3>{blog.title}</h3>   
//             <img src= {`http://localhost:3001/uploads/${blog.img}`} alt={blog.title} />
//             <p>{blog.body}</p>
//             <p>Category: {blog.category}</p>
//             <p>Time: {blog.timeCreated}</p>
            
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default MyBlogs;




import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {Link} from "react-router-dom";
import '../pages/MyBlogs.css';

function MyBlogs() {
  const [username, setUsername] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchUserBlogs(storedUsername);
    }
  }, []);

  // Fetch blogs associated with the logged-in user
  const fetchUserBlogs = async (username) => {
    try {
      const response = await axios.get(`http://localhost:3001/myblogs?username=${username}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  // Delete a blog post
  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:3001/blogs/${blogId}`);
      // Refresh blogs after deletion
      fetchUserBlogs(username);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  return (
    <>
      <h1>My Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          {/* <img src= {`http://localhost:3001/uploads/${blog.img}`} alt={blog.title} /> */}
          <img src={blog.img ? `http://localhost:3001/uploads/${blog.img}` : null} alt="Blog " height="100px" width="100px" />
          <p>{blog.subtitle}</p>
          <p>{blog.body}</p>
          <p>Category: {blog.category}</p>
          <p>Author: {blog.createdUser}</p>
          <p>Time: {blog.timeCreated}</p>

          {/* Edit button */}
          <Link to={`/blogs/${blog.id}/edit`}>
            <button className="editbtn">Edit</button>
          </Link>

          {/* Delete button */}
          <button onClick={() => deleteBlog(blog.id)}>Delete</button>

          {/* Read button/link */}
          <a href={`/blogs/${blog.id}`}>Read</a>
        </div>
      ))}
    </>
  );
}

export default MyBlogs;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { Link } from "react-router-dom";

// function MyBlogs() {
//   const [username, setUsername] = useState("");
//   const [blogs, setBlogs] = useState([]);

//   useEffect(() => {
//     const storedUsername = Cookies.get("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//       fetchUserBlogs(storedUsername);
//     }
//   }, []);

//   // Fetch blogs associated with the logged-in user
//   const fetchUserBlogs = async (username) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/myblogs?username=${username}`);
//       setBlogs(response.data);
//     } catch (error) {
//       console.error("Error fetching user blogs:", error);
//     }
//   };

//   // Delete a blog post
//   const deleteBlog = async (blogId) => {
//     try {
//       await axios.delete(`http://localhost:3001/blogs/${blogId}`);
//       // Refresh blogs after deletion
//       fetchUserBlogs(username);
//     } catch (error) {
//       console.error("Error deleting blog post:", error);
//     }
//   };

//   return (
//     <>
//       <h1>My Blogs</h1>
//       {blogs.map((blog) => (
//         <div key={blog.id}>
//           <h2>{blog.title}</h2>
//           {/* Other blog details */}
          // <Link to={`/blogs/${blog.id}/edit`}>
          //   <button className="editbtn">Edit</button>
          // </Link>
//           {/* Delete button */}
//           <button onClick={() => deleteBlog(blog.id)}>Delete</button>
//           {/* Read button/link */}
//           <a href={`/blogs/${blog.id}`}>Read</a>
//         </div>
//       ))}
//     </>
//   );
// }

// export default MyBlogs;
