<template>
    <div>
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #141B4D;">
        <div class="container-fluid">
          <a class="navbar-brand text-white" href="#">StudySphere</a>
        </div>
      </nav>
  
      <div class="container-fluid mt-4 d-flex">
        <!-- Sidebar (Categories) -->
        <div class="categories-sidebar col-lg-2 col-md-3 mb-4">
          <div class="sticky-top">
            <h4>Categories</h4>
            <ul class="list-group">
              <li class="list-group-item">General</li>
              <li class="list-group-item">Questions</li>
              <li class="list-group-item">Science</li>
              <li class="list-group-item">Math</li>
              <li class="list-group-item">Languages</li>
              <li class="list-group-item">Business</li>
            </ul>
          </div>
        </div>
  
        <!-- Forum Content -->
        <div class="forum-content flex-grow-1">
          <!-- Post Form -->
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Create New Post</h5>
              <form @submit.prevent="addPost">
                <div class="mb-3">
                  <label for="postTitle" class="form-label">Title</label>
                  <input v-model="newPost.title" type="text" class="form-control" id="postTitle" required />
                </div>
                <div class="mb-3">
                  <label for="postContent" class="form-label">Content</label>
                  <textarea v-model="newPost.content" class="form-control" id="postContent" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="postCategory" class="form-label">Category</label>
                  <select v-model="newPost.category" class="form-select" id="postCategory" required>
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary">Post</button>
              </form>
            </div>
          </div>
  
        <!-- Display Forum Posts -->

        <!-- Display Forum Posts -->
        <div v-for="post in posts" :key="post.id" class="card mb-4">
        <div class="card-body d-flex">
            <!-- Post Content Area -->
            <div class="flex-grow-1">
            <h5 class="card-title">{{ post.title }}</h5>
            <div class="d-flex justify-content-between mb-3">
                <div>
                <span class="badge user-badge">{{ post.author }}</span>
                <small class="text-muted">{{ new Date(post.timestamp.seconds * 1000).toLocaleString() }} · {{ post.category }}</small>
                </div>
            </div>
            <p class="card-text">{{ post.content }}</p>
            <div class="d-flex align-items-center">
                <!-- Like button with heart icon -->
                <span @click="toggleLike(post.id)" style="cursor: pointer; display: flex; align-items: center;">
                <i :class="['fas', 'fa-heart', isLikedByUser(post) ? 'liked' : 'unliked']"></i>
                <span class="ms-2">{{ post.likes.length }}</span>
                </span>
                <!-- Comment link -->
                <span class="custom-comment-link ms-3" @click="toggleComments(post.id)" style="cursor: pointer; color: #007bff; text-decoration: underline;">
                Add a Comment
                </span>
            </div>
            </div>

            <!-- Comments Section on the Right -->
            <div v-if="post.showComments" class="comment-section ml-3">
            <div v-for="comment in post.comments" :key="comment.id" class="comment mb-2">
                <span class="badge user-badge">{{ comment.author }}</span>
                <p>{{ comment.content }}</p>
            </div>
            <textarea v-model="post.newComment" placeholder="Write a comment..." class="form-control mt-2"></textarea>
            <button class="btn btn-primary mt-2" @click="addComment(post.id)">Post Comment</button>
            </div>
        </div>

        <!-- Comment Count in Bottom Right Corner -->
        <div class="text-end text-muted mt-2" style="font-size: 0.85em;">
            {{ post.comments.length }} {{ post.comments.length === 1 ? "Comment" : "Comments" }}
        </div>
        </div>


        </div>

        </div>
        </div>

  </template>
  
  <script>
  import { getFirestore, collection, addDoc, updateDoc, arrayUnion, getDocs, doc, query, orderBy, Timestamp } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  
  export default {
    name: 'Forum',
    data() {
      return {
        newPost: {
          title: '',
          content: '',
          category: 'General',
        },
        posts: [],
        currentUsername: 'Anonymous',
      };
    },
    methods: {
    isLikedByUser(post) {
        const auth = getAuth();
        const user = auth.currentUser;
        return user && post.likes.includes(user.uid);
    },
    async toggleLike(postId) {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
        const postRef = doc(db, "forumPosts", postId);
        const post = this.posts.find(p => p.id === postId);

        if (user) {
        if (this.isLikedByUser(post)) {
            // Remove like
            await updateDoc(postRef, {
            likes: post.likes.filter(uid => uid !== user.uid)
            });
            post.likes = post.likes.filter(uid => uid !== user.uid);
        } else {
            // Add like
            await updateDoc(postRef, {
            likes: arrayUnion(user.uid)
            });
            post.likes.push(user.uid);
        }
        } else {
        alert("Please log in to like the post.");
        }
    },


    async addPost() {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (user) {
          const postData = {
            ...this.newPost,
            author: this.currentUsername,
            timestamp: Timestamp.now(),
            likes: [],
            comments: [],
          };
  
          try {
            await addDoc(collection(db, 'forumPosts'), postData);
            this.newPost = { title: '', content: '', category: 'General' };
            this.loadPosts();
          } catch (error) {
            console.error('Error adding post:', error);
          }
        } else {
          console.warn('User is not authenticated.');
        }
      },
      async loadPosts() {
        const db = getFirestore();
        const postsQuery = query(collection(db, 'forumPosts'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(postsQuery);
  
        this.posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          showComments: false,
          newComment: ''
        }));
      },
      toggleComments(postId) {
        const post = this.posts.find(p => p.id === postId);
        post.showComments = !post.showComments;
      },
      async addComment(postId) {
        const db = getFirestore();
        const post = this.posts.find(p => p.id === postId);
        const newComment = {
          author: this.currentUsername,
          content: post.newComment,
          timestamp: Timestamp.now(),
        };
  
        await updateDoc(doc(db, 'forumPosts', postId), {
          comments: arrayUnion(newComment),
        });
  
        post.comments.push(newComment);
        post.newComment = '';
      },
    },
    mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUsername = user.displayName || 'Anonymous';
          this.loadPosts();
        } else {
          console.log("No user is logged in.");
        }
      });
    },
  };
  </script>
  
<style scoped>
.comment-section {
    max-width: 250px;
}

  
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

body {
    background-color: #f4f4f9;
    font-family: 'Poppins', sans-serif;
}

.navbar {
    background-color: #141B4D !important;
}

.navbar-brand {
    font-weight: bold;
    color: #ff9800 !important;
}

.custom-like-btn, .custom-comment-btn {
    margin-right: 10px;
}

.card {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-badge {
    background-color: #007bff;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
}

.comment-section {
    margin-top: 10px;
}

.comment {
    background-color: #f8f9fa;
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
}
/* Container to hold both the sidebar and the main content */
.forum-container {
  display: flex;
  gap: 20px; /* Space between sidebar and content */
}

/* Sidebar fixed to the left */
.categories-sidebar {
  position: fixed;
  top: 80px; /* Adjust based on the navbar height if necessary */
  left: 0;
  width: 200px; /* Fixed width for the sidebar */
  height: calc(100vh - 80px); /* Full height minus the navbar */
  padding: 20px;
  background-color: #f4f4f9; /* Background color for sidebar */
  overflow-y: auto; /* Allow scrolling within the sidebar if content overflows */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow */
  z-index: 1000; /* Ensure it stays above the content while scrolling */
}

/* Main content area with margin to the left to accommodate the sidebar */
.forum-content {
  margin-left: 220px; /* Space to accommodate the fixed sidebar */
  padding: 20px;
  width: 100%;
}

/* Basic styling for posts */
.forum-post {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

/* Sidebar category links */
.categories-sidebar ul {
  list-style-type: none;
  padding: 0;
}

.categories-sidebar li {
  margin-bottom: 10px;
}

.categories-sidebar a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.categories-sidebar a:hover {
  color: #007bff;
}

.custom-comment-link {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

.comment-section {
  max-width: 250px;
}

.liked {
  color: #e0245e; /* Twitter-like pink */
}

.unliked {
  color: #999;
}

</style>
  
