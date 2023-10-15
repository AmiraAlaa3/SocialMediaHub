// Auth
const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUI(){
    const token=localStorage.getItem('token');
    const loginDiv = document.getElementById("login-div");
    const logoutDiv = document.getElementById("logout-div");
    const addPostBtn = document.getElementById("add-post");
    const editDropdown = document.getElementsByClassName("dropdown-edit");
    if(token == null){
        if(addPostBtn !=null){
            addPostBtn.style.visibility = "hidden";
        }
        if (editDropdown.length > 0) {
          for (const dropdown of editDropdown) {
             dropdown.style.display = "none"; 
          }
        }
        logoutDiv.style.setProperty("display", "flex", "important");
        loginDiv.style.setProperty("display", "none", "important");
    }else{
        if(addPostBtn !=null){
            addPostBtn.style.visibility = "visible";
        }
        if (editDropdown.length > 0) {
        for (const dropdown of editDropdown) {
           dropdown.style.display = "float-end"; // or "visible"
       }
       }
    
        logoutDiv.style.setProperty("display", "none", "important");
        loginDiv.style.setProperty("display", "flex", "important");
        const user = currentUser();
        document.getElementById("username-nav").innerHTML = user.username;
        document.getElementById("user-image-nav").src = user.profile_image;
    }
}
// register new user
function Register() {
    let name = document.getElementById("register-name-input").value;
    let userName = document.getElementById("register-username-input").value;
    let email = document.getElementById("register-email-input").value;
    let profileImage = document.getElementById("register-profile-image").files[0];
    let password = document.getElementById("register-password-input").value;
 
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', userName);
    formData.append('email', email);
    formData.append('image', profileImage);
    formData.append('password', password);
 
    axios.post(`${baseUrl}/register`, formData, {
          headers: {
             "Content-Type": "multipart/form-data",
          }
       })
       .then(function (response) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
 
          // Close the modal
          const modal = document.getElementById('register-model');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
 
          setupUI()
          showSuccess('Register successful!', 'success')
 
       })
       .catch(function (error) {
          const message = error.response.data.message;
          showAlert(message, 'danger')
       });
}
// login
function loginClicked() {
    let name = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;
 
 
    axios.post(`${baseUrl}/login`, {
          username: name,
          password: password
       })
       .then(function (response) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // Close the modal
          const modal = document.getElementById('login-model');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          setupUI()
          showAlert('Login successful!', 'success')
       })
       .catch(function (error) {
          const message = error.response.data.message;
          showAlert(message, 'danger')
       });
 
 }
// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setupUI()
    showAlert('Logout successful!', 'success')
}
 
function showAlert(message, type = 'success') {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
       `<div class="alert alert-${type} alert-dismissible" role="alert">`,
       `   <div>${message}</div>`,
       '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
       '</div>'
    ].join('')
 
    alertPlaceholder.append(wrapper)
    // Close the alert after 2 seconds (2000 milliseconds)
    setTimeout(() => {
       wrapper.remove(); // Remove the alert from the DOM
    }, 2000);
 
}

function currentUser() {
    let user = null;
    const userData = localStorage.getItem("user");
    if (userData != null) {
       user = JSON.parse(userData);
    }
    return user;
}
function isValidURL(url) {
   // Regular expression to match common URL patterns
   const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/;
   return urlPattern.test(url);
}
function createNewPost() {
   let postId=document.getElementById('post-id-input').value;
   let isCreate = postId == null || postId == "";
  
   let postTitle = document.getElementById("post-title").value;
   let postBody = document.getElementById("post-body").value;
   let image = document.getElementById("post-img").files[0];
   const token = localStorage.getItem("token");

   const formData = new FormData();
   formData.append('title', postTitle);
   formData.append('body', postBody);
   formData.append('image', image);
   
   let url=``;
   const header = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
   }
   if(isCreate){
      url=`${baseUrl}/posts`;
      axios.post(url, formData, {
         headers: header
      })
      .then(function (response) {
         // Close the modal
         const modal = document.getElementById('Add-post-model');
         const modalInstance = bootstrap.Modal.getInstance(modal);
         modalInstance.hide();
         showAlert('Create New Post successful!', 'success');
         getPosts();
      })
      .catch(function (error) {
         const message = error.response.data.message;
         showAlert(message, 'danger')
      });

   }
   else{
      url=`${baseUrl}/posts/${postId}`;
      formData.append("_method","put")
      axios.post(url, formData, {
         headers: header
      })
      .then(function (response) {
         // Close the modal
         const modal = document.getElementById('Add-post-model');
         const modalInstance = bootstrap.Modal.getInstance(modal);
         modalInstance.hide();
         showAlert('Update Post successful!', 'success');
         getPosts();
      })
      .catch(function (error) {
         const message = error.response.data.message;
         showAlert(message, 'danger')
      });

   }
  
}

function editPost(postObj) {
   let postEdit = JSON.parse(decodeURIComponent(postObj));
   document.getElementById('post-id-input').value = postEdit.id;
   document.getElementById("Add-postModalLabel").innerHTML = "Edit Post";
   document.getElementById('post-modal-submit-btn').innerHTML = 'Update';
   document.getElementById("post-title").value = postEdit.title;
   document.getElementById("post-body").value = postEdit.body;
   
   let postModal = new bootstrap.Modal(document.getElementById('Add-post-model'), {});
   postModal.toggle();
}

function addBtnClick(){
   document.getElementById('post-id-input').value ="";
   document.getElementById("Add-postModalLabel").innerHTML = "Create A New Post";
   document.getElementById('post-modal-submit-btn').innerHTML = 'Create';
   document.getElementById("post-title").value = '';
   document.getElementById("post-body").value = '';
   
   let postModal = new bootstrap.Modal(document.getElementById('Add-post-model'), {});
   postModal.toggle();
}

function deletePostBtn(postObj){
   let postDelete = JSON.parse(decodeURIComponent(postObj));
   document.getElementById("delete-post-id").value = postDelete.id;
   let postModal = new bootstrap.Modal(document.getElementById('Delete-post-model'), {});
   postModal.toggle();
}
function confirmDelete(){
   const postId = document.getElementById("delete-post-id").value;
   const token = localStorage.getItem("token");
   const url = `${baseUrl}/posts/${postId}`;
   const header = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
   }
   axios.delete(url,{headers: header })
   .then(function (response) {
      // Close the modal
      const modal = document.getElementById('Delete-post-model');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      getPosts();
      showAlert('The Post Has Been Delete successful!', 'success');
   })
   .catch(function (error) {
      const message = error.response.data.message;
      showAlert(message, 'danger')
   });

}
function postDetails(postId) {
   window.location = `postDetails.html?postId=${postId}`;
}
function userClick(userId){
   window.location = `profile.html?userId=${userId}`;
}

function profileClick(){
   const user=currentUser();
   if(user != null){
       const userId = user.id;
       window.location = `profile.html?userId=${userId}`;
   }
}
function toggleLoader(show = true)
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}