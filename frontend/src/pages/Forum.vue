<template>
  <div class="bg">
    <div class="container-fluid mt-4 d-flex">
      <!-- Sidebar (Categories) -->
      <div class="categories-sidebar col-lg-2 col-md-3 mb-4">
        <div class="sticky-top">
          <h4>Categories</h4>
          <ul class="list-group">
            <li class="list-group-item" @click="setCategory('All')" :class="{ active: selectedCategory === 'All' }">All</li>
            <li class="list-group-item" @click="setCategory('General')" :class="{ active: selectedCategory === 'General' }">General</li>
            <li class="list-group-item" @click="setCategory('Questions')" :class="{ active: selectedCategory === 'Questions' }">Questions</li>
            <li class="list-group-item" @click="setCategory('SCIS')" :class="{ active: selectedCategory === 'SCIS' }">SCIS</li>
            <li class="list-group-item" @click="setCategory('SOA')" :class="{ active: selectedCategory === 'SOA' }">SOA</li>
            <li class="list-group-item" @click="setCategory('SOL')" :class="{ active: selectedCategory === 'SOL' }">SOL</li>
            <li class="list-group-item" @click="setCategory('SOB')" :class="{ active: selectedCategory === 'SOB' }">SOB</li>
            <li class="list-group-item" @click="setCategory('SOSS')" :class="{ active: selectedCategory === 'SOSS' }">SOSS</li>
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
                  <option value="SCIS">SCIS</option>
                  <option value="SOA">SOA</option>
                  <option value="SOL">SOL</option>
                  <option value="SOB">SOB</option>
                  <option value="SOSS">SOSS</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" style="background-color: #00A3E0; border: 0cm;">Post</button>
            </form>
          </div>
        </div>

        <!-- Display Forum Posts -->
        <div v-for="post in posts" :key="post.id" class="card mb-4">
          <div class="card-body position-relative">

            <!-- Dropdown for Edit/Delete -->
            <div v-if="user && post.ownerId === user.uid" class="top-right-dropdown">
              <button class="dropdown-btn">⋮</button>
              <div class="dropdown-content">
                <button @click="editPost(post)">Edit</button>
                <button @click="deletePost(post.id)">Delete</button>
              </div>
            </div>

            <!-- Conditional Rendering for Edit Form or Post Display -->
            <template v-if="editingPost && editingPost.id === post.id">
              <!-- Edit Form -->
              <input v-model="editingPost.title" class="form-control mb-2" />
              <textarea v-model="editingPost.content" class="form-control mb-2" rows="3"></textarea>
              <div>
                <button @click="savePostChanges" class="savebtn btn btn-success me-2">Save Changes</button>
                <button @click="cancelEdit" class="cancelbtn btn btn-secondary">Cancel</button>
              </div>
            </template>

            <!-- Post Content Area -->
            <h5 class="card-title">{{ post.title }}</h5>
            <div class="d-flex justify-content-between mb-3">
              <div>
                <span class="badge user-badge" :style="{ backgroundColor: getUserColor(post.author) }">{{ post.author }}</span>
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
              <div class="comments-list">
                <div v-for="comment in post.comments" :key="comment.id" class="comment mb-2">
                  <span class="badge user-badge" :style="{ backgroundColor: getUserColor(comment.author) }">{{ comment.author }}</span>
                  <small class="text-muted ms-2">{{ new Date(comment.timestamp.seconds * 1000).toLocaleString() }}</small>
                  <p>{{ comment.content }}</p>

                  <!-- Comment dropdown for deletion -->
                  <div v-if="user && user.displayName === comment.author" class="comment-dropdown">
                    <button class="comment-dropdown-btn">⋮</button>
                    <div class="comment-dropdown-content">
                      <button @click="deleteComment(post.id, comment.id)">Delete</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add Comment Section -->
              <div class="add-comment-section mt-2">
                <textarea v-model="post.newComment" placeholder="Write a comment..." class="form-control"></textarea>
                <button class="btn btn-primary mt-2" @click="addComment(post.id)" style="background-color: #00A3E0; border: 0cm;">Post Comment</button>
              </div>
            </div>

            <!-- Comment Count to Toggle Comment Section -->
            <div class="text-end text-muted mt-2" style="font-size: 0.85em; cursor: pointer;" @click="toggleComments(post.id)">
              {{ post.comments.length }} {{ post.comments.length === 1 ? "Comment" : "Comments" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
import { getFirestore, collection, addDoc, updateDoc, arrayUnion, getDocs, doc, query, orderBy, Timestamp, where, deleteDoc, arrayRemove} from 'firebase/firestore';
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
            user: null, 
            editingPost: null,
            userColors: {},
            availableColors: [
              "#FFB6C1", "#ADD8E6", "#90EE90", "#FFD700", "#FF6347", "#7B68EE",
              "#FF69B4", "#8A2BE2", "#5F9EA0", "#FF4500", "#DA70D6", "#20B2AA"
            ],
        };
    },
    methods: {
    isLikedByUser(post) {
        const auth = getAuth();
        const user = auth.currentUser;
        return user && post.likes.includes(user.uid);
    },
    editPost(post) {
        this.editingPost = { ...post }; // Clone the post to avoid direct mutation until saved
    },
    
    cancelEdit() {
        this.editingPost = null; // Clear editing state
    },
    async deletePost(postId) {
        const db = getFirestore();
        try {
            // Delete the post from Firestore
            await deleteDoc(doc(db, 'forumPosts', postId));
            
            // Update local state by filtering out the deleted post
            this.posts = this.posts.filter(post => post.id !== postId);
            console.log(`Post with ID ${postId} deleted successfully`);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    },
    async savePostChanges() {
        const db = getFirestore();
        const postRef = doc(db, 'forumPosts', this.editingPost.id);

        try {
            // Update the post in Firestore
            await updateDoc(postRef, {
                title: this.editingPost.title,
                content: this.editingPost.content,
                category: this.editingPost.category,
            });

            // Update local state to reflect changes
            const postIndex = this.posts.findIndex(post => post.id === this.editingPost.id);
            if (postIndex !== -1) {
                this.posts[postIndex] = { ...this.editingPost };
            }
            
            this.editingPost = null; // Clear editing state
            console.log("Post updated successfully");
        } catch (error) {
            console.error("Error updating post:", error);
        }
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
                    ownerId: user.uid, // Keep this consistent with what you use in the template
                    timestamp: Timestamp.now(),
                    likes: [],
                    comments: [],
                    category: this.newPost.category, 
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

        console.log("Loading posts for category:", this.selectedCategory); // Debug log;
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
            this.posts = snapshot.docs.map(doc => {
              const postData = doc.data();
              console.log("Post Data:", postData.ownerId); // Debugging line to log the data of each post
              return {
                  id: doc.id,
                  ...postData,
                  showComments: false,
                  newComment: ''
              };
          });
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
          id: Date.now().toString(), // Unique ID for each comment
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

      async deleteComment(postId, commentId) {
        const db = getFirestore();
        const postRef = doc(db, 'forumPosts', postId);
        const post = this.posts.find((p) => p.id === postId);

        // Find the comment to delete based on its unique ID
        const commentToDelete = post.comments.find((comment) => comment.id === commentId);

        if (commentToDelete) {
          try {
            // Remove the specific comment from Firestore
            await updateDoc(postRef, {
              comments: arrayRemove(commentToDelete),
            });

            // Update the local state to remove the comment
            post.comments = post.comments.filter((comment) => comment.id !== commentId);
            console.log(`Comment with ID ${commentId} deleted successfully`);
          } catch (error) {
            console.error('Error deleting comment:', error);
          }
        }
      },

      toggleCommentDropdown(comment) {
        comment.showDropdown = !comment.showDropdown;
      },
      getUserColor(username) {

      if (!this.userColors[username]) {
        
        const randomIndex = Math.floor(Math.random() * this.availableColors.length);
        this.userColors[username] = this.availableColors[randomIndex];
      }
      return this.userColors[username];
    },
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user; // Set this.user to make it reactive
                this.currentUsername = user.displayName || 'Anonymous';
                console.log("User UID:", this.user.uid); 
                this.loadPosts();
            } else {
              this.$router.push('/sign-in');
            }
        });

        const savedColors = JSON.parse(localStorage.getItem('userColors'));
        if (savedColors) {
          this.userColors = savedColors;
        }

        // Save userColors to localStorage on change
        this.$watch(
          () => this.userColors,
          (newColors) => {
            localStorage.setItem('userColors', JSON.stringify(newColors));
          },
          { deep: true }
        );
    },
  };
</script>
  

<style scoped>

.bg{
  background-color: #E5E4E2;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-like-btn, .custom-comment-btn {
    margin-right: 10px;
}

.card {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color:#F0F4F8;
}

.user-badge {
  background-color:#1b87ae ;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 5px;
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
  background-color:#F0F4F8; 
  overflow-y: auto; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  z-index: 1000; 

}

/* Main content area with margin to the left to accommodate the sidebar */
.forum-content {
  margin-left: 220px;
  padding: 20px;
  width: 100%;
}

/* Basic styling for posts */
.forum-post {
  background: #DDEAF2;
  border-radius: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
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
  max-height: 300px; 
  overflow-y: auto;
  padding-right: 5px; 
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
  background-color:#00A3E0 ;
  color: white;
  font-weight: bold;
}

/* Ensure .card-body is positioned relatively */
.card-body {
  position: relative;
}

/* Dropdown button positioned absolutely within .card-body */
.top-right-dropdown {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-block;
}

/* Dropdown button styling */
.dropdown-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Dropdown content styling */
.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  top: 100%; /* Positions it below the dropdown button */
  background-color: white;
  min-width: 100px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dropdown-content button {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  color: #333;
  cursor: pointer;
  transition: background 0.3s;
}

.dropdown-content button:hover {
  background-color: #f1f1f1;
}

/* Show dropdown on hover or focus */
.top-right-dropdown:hover .dropdown-content,
.top-right-dropdown:focus-within .dropdown-content {
  display: block;
}

.comment {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  position: relative; /* Ensure that child elements can be absolutely positioned relative to this */
}

.comment-dropdown {
  position: absolute;
  top: 5px;
  right: 5px;
}

.comment-dropdown-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.comment-dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  top: 100%; /* Position it below the button */
  background-color: white;
  min-width: 100px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.comment-dropdown-content button {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  color: #333;
  cursor: pointer;
  transition: background 0.3s;
}

.comment-dropdown-content button:hover {
  background-color: #f1f1f1;
}

/* Show dropdown on hover or focus */
.comment-dropdown:hover .comment-dropdown-content,
.comment-dropdown:focus-within .comment-dropdown-content {
  display: block;
}

</style>



