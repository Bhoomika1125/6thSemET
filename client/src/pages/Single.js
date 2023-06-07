import React, { useEffect, useState } from 'react';

const Single = ({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost(postId);
  }, [postId]);

  const fetchPost = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`); // Replace with your API endpoint
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <p>Author: {post.authorName}</p>
      <img src={post.image} alt="Post" />
    </div>
  );
};

export default Single;