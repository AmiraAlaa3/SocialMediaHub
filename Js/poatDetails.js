// get post id 
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const postId = params.get('postId');

function getPost() {
   toggleLoader(true);
   axios.get(baseUrl + `/posts/${postId}`)
      .then(function (response) {
         toggleLoader(false);
         let post = response.data.data;
         let comments = response.data.data.comments;
         let author = response.data.data.author.name;
         document.getElementById("post-username").innerHTML = author;
         document.getElementById("post").innerHTML = "";

         let postTitle = post.title || "";
         // Check if the author's profile image is a valid URL, otherwise use the default
         let profileImage = isValidURL(post.author.profile_image) ? post.author.profile_image : "./Images/user2.png";
         
         let commentsContent = ``;
         for (comment of comments) {
            let commentAutherImg =isValidURL(comment.author.profile_image) ? comment.author.profile_image : "./Images/user2.png";
            commentsContent += `
             <div class="p-3" style="background-color: rgba(232,229,229,91%);">
                    <div>
                        <img src="${commentAutherImg}" alt="user" class="rounded-circle border border-3"
                            width="40" height="40">
                        <b>${comment.author.name}</b>
                    </div>
                        <div class="mt-1 ps-5 comment-body">
                             <p>${comment.body}</p>
                        </div>
            </div>`;
         }

         let Content = `<div class="card my-5 shadow">
                        <div class="card-header">
                            <img src=${profileImage} alt="user" class="rounded-circle" width="40"
                                height="40">
                            <b>${post.author.name}</b>
                        </div>
                        <div class="card-body">
                            <img src=${post.image} class="w-100" alt="post image" style="width: 100%; max-height: 400px;">
                            <p class="mt-1 time">${post.created_at}</p>
                            <h4>${postTitle}</h4>
                            <p>
                             ${post.body}
                            </p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pen" viewBox="0 0 16 16">
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                </svg>
                                <span> (${post.comments_count}) comments</span>
                            </div>
                        </div>
                          <!-- comments -->
                        <div class="comments">
                           ${commentsContent}
                        </div>
                        <div class="input-group my-3 p-2" id="add-comment-div">
                           <input type="text" class="form-control" id="post-comment" placeholder="Add your comment here.....">
                           <button class="btn btn-outline-primary mx-2" type="button" onclick="addComment();"><ion-icon name="send" class="pt-2"></ion-icon></button>
                        </div>
                        
                    </div>`;
         document.getElementById("post").innerHTML += Content;


         // Add event listener for Enter key in the comment input field
         document.getElementById("post-comment").addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
               addComment();
            }
         });

      })
      .catch((error) => {
       const message =error.response.data.message
      })
}
function isValidURL(url) {
   // Regular expression to match common URL patterns
   const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/;
   return urlPattern.test(url);
}
function addComment() {
    let comment = document.getElementById("post-comment").value;
    let token = localStorage.getItem("token");
    let params = {
       "body": comment
    }
 
    axios.post(baseUrl + `/posts/${postId}/comments`, params, {
          headers: {
             "Authorization": `Bearer ${token}`
          }
       })
       .then(function (response) {
          getPost();
          showAlert('Comment Add successful!', 'success')
       })
       .catch(function(error){
         showAlert(error.response.data.message, 'danger')
       })
}
getPost()