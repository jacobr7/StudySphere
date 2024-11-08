<template>
  <div>
    <div class="container-fluid mt-4 d-flex">
      <!-- Sidebar (Categories) -->
      <div class="categories-sidebar col-lg-2 col-md-3 mb-4">
        <div class="sticky-top">
          <h4>Categories</h4>
          <ul class="list-group">
            <li class="list-group-item" @click="setCategory('All')" :class="{ active: selectedCategory === 'All' }">All</li>
            <li class="list-group-item" @click="setCategory('General')" :class="{ active: selectedCategory === 'General' }">General</li>
            <li class="list-group-item" @click="setCategory('Questions')" :class="{ active: selectedCategory === 'Questions' }">Questions</li>
            <li class="list-group-item" @click="setCategory('Science')" :class="{ active: selectedCategory === 'Science' }">Science</li>
            <li class="list-group-item" @click="setCategory('Math')" :class="{ active: selectedCategory === 'Math' }">Math</li>
            <li class="list-group-item" @click="setCategory('Languages')" :class="{ active: selectedCategory === 'Languages' }">Languages</li>
            <li class="list-group-item" @click="setCategory('Business')" :class="{ active: selectedCategory === 'Business' }">Business</li>
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
                  <option value="Questions">Questions</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                  <option value="Languages">Languages</option>
                  <option value="Business">Business</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Post</button>
            </form>
          </div>
        </div>

        <!-- Display Forum Posts -->
        <div v-for="post in posts" :key="post.id" class="card mb-4">
          <div class="card-body">
            <!-- Post Content Area -->
            <h5 class="card-title">{{ post.title }}</h5>
            <div class="d-flex justify-content-between mb-3">
              <div>
                <span class="badge user-badge">{{ post.author }}</span>
                <small class="text-muted">
                  {{ new Date(post.timestamp.seconds * 1000).toLocaleString() }} · {{ post.category }}
                </small>
              </div>
            </div>
            <p class="card-text">{{ post.content }}</p>

            <!-- Like and Comment icons -->
            <div class="d-flex align-items-center">
              <!-- Like button with heart icon -->
              <span 
                @click="toggleLike(post.id)" 
                style="cursor: pointer; display: flex; align-items: center;"
                class="like-button">
                  <i :class="['fa-heart', isLikedByUser(post) ? 'fas liked' : 'far unliked']"></i>
                <span class="ms-2">{{ post.likes.length }}</span>
              </span>

              
              <!-- Comment button with icon -->
              <span class="ms-3" @click="toggleComments(post.id)" style="cursor: pointer; display: flex; align-items: center;">
                <i class="fas fa-comment"></i>
                <span class="ms-2">{{ post.comments.length }}</span>
              </span>
            </div>

            <!-- Comments Section (only shows when 'showComments' is true) -->
            <div v-if="post.showComments" class="comment-section mt-3">
              <!-- Scrollable comments list -->
              <div class="comments-list">
                <div v-for="comment in post.comments" :key="comment.id" class="comment mb-2">
                  <span class="badge user-badge">{{ comment.author }}</span>
                    <small class="text-muted ms-2">
                      {{ new Date(comment.timestamp.seconds * 1000).toLocaleString() }}
                    </small>
                  <p>{{ comment.content }}</p>
                </div>
              </div>

              <!-- Add Comment Section -->
              <div class="add-comment-section mt-2">
                <textarea v-model="post.newComment" placeholder="Write a comment..." class="form-control"></textarea>
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
  </div>
</template>

  
<script>
import { getFirestore, collection, addDoc, updateDoc, arrayUnion, getDocs, doc, query, orderBy, Timestamp, where } from 'firebase/firestore';
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
        selectedCategory: "All",
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
    setCategory(category) {
        this.selectedCategory = category;
        console.log("Selected Category:", this.selectedCategory); // Debug log
        this.loadPosts();
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
            category:  this.newPost.category, 
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
        let postsQuery;

        console.log("Loading posts for category:", this.selectedCategory); // Debug log

        if (this.selectedCategory === 'All') {
          postsQuery = query(collection(db, 'forumPosts'), orderBy('timestamp', 'desc'));
        } else {
          postsQuery = query(
            collection(db, 'forumPosts'),
            where('category', '==', this.selectedCategory),
            orderBy('timestamp', 'desc')
          );
        }

        try {
          const snapshot = await getDocs(postsQuery);
          this.posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            showComments: false,
            newComment: ''
          }));
        } catch (error) {
          console.error("Error loading posts:", error);
        }
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

body {
    background-color: #f4f4f9;
    font-family: 'Poppins', sans-serif;
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
  padding-top: 10px;
  border-top: 1px solid #eaeaea;
}

.comments-list {
  max-height: 300px; /* Adjust the height as needed */
  overflow-y: auto;
  padding-right: 5px; /* Optional: space for scrollbar */
}

.comment {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.add-comment-section {
  margin-top: 10px;
}



.like-button .unliked {
  color: #999; 
  transition: color 0.1s;
}

.like-button:hover .unliked {
  color: #e0245e; /* Pink outline on hover */
}

.liked {
  color: #e0245e; /* Solid pink for liked heart */
}


.fa-comment {
  color: #999;
  transition: color 0.3s;
}

.fa-comment:hover {
  color: #007bff;
}

.list-group-item.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

</style>
  
