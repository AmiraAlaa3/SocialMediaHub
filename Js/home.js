getPosts();
setupUI();

let currentPage = 1;
let lastPage = 1;
window.addEventListener('scroll', () => {
   const {
      scrollTop,
      scrollHeight,
      clientHeight
   } = document.documentElement;

   if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage < lastPage) {
      currentPage = currentPage + 1;
      getPosts(false, currentPage)
   }
});

function getPosts(reload = true, page = 1) {
   toggleLoader(true)
   axios.get(baseUrl + `/posts?limit=20&page=${page}`)
      .then(function (response) {
         toggleLoader(false)
         let posts = response.data.data;
         lastPage = response.data.meta.last_page;
         if (reload) {
            document.getElementById("posts").innerHTML = "";
         }
         for (post of posts) {
            let user = currentUser();
            let isMyPost = user != null && user.id == post.author.id ;
            let btnEditContent=``;
            if(isMyPost){
               btnEditContent =` 
               <div class="dropdown float-end pt-2 dropdown-edit">
                <a class="btn btn-secondary btn-sm rounded-circle"href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                  <ion-icon name="ellipsis-horizontal-sharp"></ion-icon>
                </a>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                   <li><a class="dropdown-item" href="#" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}');" >Edit</a></li>
                   <li><a class="dropdown-item" href="#" onclick="deletePostBtn('${encodeURIComponent(JSON.stringify(post))}');">Delete</a></li>
                </ul>
               </div> `
            }
            let postTitle = post.title || "";
            // Check if the author's profile image is a valid URL, otherwise use the default 
            let profileImage = isValidURL(post.author.profile_image) ? post.author.profile_image : './images/user2.png';
            
            let content = `<div class="card my-5 shadow">
                          <div class="card-header">
                            <span onclick="userClick(${post.author.id});" class="card-cursor">
                                <img src=${profileImage} alt="user" class="rounded-circle" width="40"
                                  height="40">
                                 <b>${post.author.name}</b> 
                            </span>
                         
                            ${btnEditContent}
                        </div>
                        <div class="card-body card-cursor" onclick="postDetails(${post.id});">
                            <img src=${post.image} class="w-100" alt="post image" style="width: 100%;">
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
                                <h5  class="d-inline ms-2" id="post-Tags-${post.id}">

                                </h5>
                            </div>
                        </div>
                    </div>`;
               
            document.getElementById("posts").innerHTML += content;

            document.getElementById(`post-Tags-${post.id}`).innerHTML = ""
            for (tag of post.tags) {
               let tagContent = `
              <button class="btn btn-sm btn-secondary rounded-5">${tag.name}</button>`
               document.getElementById(`post-Tags-${post.id}`).innerHTML += tagContent;
            }
         }

      })
}

function isValidURL(url) {
   // Regular expression to match common URL patterns
   const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/;
   return urlPattern.test(url);
}
