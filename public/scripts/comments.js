const loadCommentBtnElement = document.getElementById('load-comments-btn');
const commentsSectionElement = document.getElementById('comments');
const commentsFormElement = document.querySelector('#comments-form form');
const commentTitleElement = document.getElementById('title');
const commentTextElement = document.getElementById('text');

function createCommentsList(comments) {
  const commentListElement = document.createElement('ol');

  for(const comment of comments) {
    const commentElement = document.createElement('li');
    commentElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>
    `;
    commentListElement.appendChild(commentElement);
  }
  return commentListElement;
}

// console.log(loadCommentBtnElement);

async function fetchCommentForPost() {
  const postId = loadCommentBtnElement.dataset.postid;
  try {
    const response = await fetch(`/posts/${postId}/comments`);

    if(!response.ok) {
      alert('Fetching comments failed!');
      return;
    }
    const responseData = await response.json();

    // console.log(responseData);
    if(responseData && responseData.length > 0) {
      const commentsListElement = createCommentsList(responseData);
      commentsSectionElement.innerHTML = '';
      commentsSectionElement.appendChild(commentsListElement);
    } else {
      commentsSectionElement.firstElementChild.textContent = 'We could not find any comments. Maybe add some?';
    }
  } catch(error) {
    alert('Getting comments failed!')
  }
  
}

async function saveComment(event) {
  event.preventDefault();
  const postId = commentsFormElement.dataset.postid;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = {
    title: enteredTitle,
    text: enteredText
  };
  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if(response.ok) { // hadling if server/database is not avaiable
      fetchCommentForPost();
    } else {
      alert('Could not send comment!')
    }
  } catch(error) {
    alert('Could not send request - maybe try again later!');
  }
}

loadCommentBtnElement.addEventListener('click', fetchCommentForPost);
commentsFormElement.addEventListener('submit', saveComment);