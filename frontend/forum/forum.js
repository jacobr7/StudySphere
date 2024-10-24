// Function to load topics from the backend
async function loadTopics() {
    const response = await fetch('http://localhost:5000/api/topics');
    const topics = await response.json();
    displayTopics(topics);
  }
  
  // Function to display topics on the page
  function displayTopics(topics) {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = '';
  
    topics.forEach(topic => {
      const topicDiv = document.createElement('div');
      topicDiv.classList.add('topic');
  
      topicDiv.innerHTML = `
        <div class="topic-title">${topic.title}</div>
        <div class="topic-description">${topic.description}</div>
      `;
  
      topicsList.appendChild(topicDiv);
    });
  }
  
  // Form submission handler to create a new topic
  document.getElementById('topic-form').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const title = document.getElementById('topic-title').value;
    const description = document.getElementById('topic-description').value;
  
    // Send the new topic to the backend
    const response = await fetch('http://localhost:5000/api/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });
  
    const newTopic = await response.json();
    loadTopics(); // Reload the topics after adding a new one
  
    // Clear the form
    document.getElementById('topic-form').reset();
  });
  
  // Load topics when the page loads
  loadTopics();
  