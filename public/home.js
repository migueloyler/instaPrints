//Drop-down menu for profile on Navigation bar
let $profileIcon = $(".profile-dropdown");
let $dropdownContent = (".dropdown-content");
let profileDropdownDisplayed = false;
let displayProfileMenu = function(){
  if (!profileDropdownDisplayed){
    $($dropdownContent).css({
      display: "block",
    });
    profileDropdownDisplayed = true;
  }else {
    $($dropdownContent).css({
      display: "none",
    });
    profileDropdownDisplayed = false;
  }
}
$profileIcon.on("click", displayProfileMenu);

let getHomeProfiles = function() {
  let $gallery= $(".gallery");
  $.get("/api/profiles", function(profiles) {
      $gallery.html("");
      profiles.forEach(function(profile) {
        $gallery.append("<div class = \"gallery-item\">" + 
        "<img src = \"" + "/pictures/" + profile.profile_picture_link + ".jpeg"+ "\" class = \"gallery-image\">" +
        "<div class=\"gallery-item-info\">" + 
            "<ul>" +
                "<a href=\"#profile1\">" + 
                    "<li class=\"profile-picture\"><img src = \"" + "/pictures/" + profile.profile_picture_link + ".jpeg"+ "\" class = \"profile-image\"></li>" + 
                    "<li class=\"profile-name\"><a class=\"gallery-item-text\" href=\"#profile\">@" + profile.username + "</a></li>" +
                "</a>" +
            "</ul>" + 
        "</div>" +
        "</div>"
    );
     });
  });
};

getHomeProfiles();








// $(function(){  // $(document).ready shorthand
//   $('.monster').fadeIn('slow');
// });

// $(document).ready(function() {
    
//     /* Every time the window is scrolled ... */
//     $(window).scroll( function(){
//         /* Check the location of each desired element */
//         $('.gallery-item-fade').each( function(i){  
//             var bottom_of_object = $(this).position().top + $(this).outerHeight();
//             var bottom_of_window = $(window).scrollTop() + $(window).height();
//             /* If the object is completely visible in the window, fade it it */
//             if( bottom_of_window > bottom_of_object ){
//                 $(this).animate({'opacity':'1'},1500);
//             }
//         }); 
//     });
// });