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
