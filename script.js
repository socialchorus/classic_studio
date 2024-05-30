/*
 * jQuery v1.9.1 included
 */

$(document).ready(function() {

    //send user role to Google Analytics 

		var userRole = HelpCenter.user.role;
		ga('set', 'dimension1', userRole);
		ga('send', 'pageview');

		//Change string for My Activities
  
		$('.nav-wrapper .dropdown-menu .my-activities').html('See my tickets');
		$('.sub-nav').find('li').filter(":last");
  
   // Capture submit request event
  $('a.submit-a-request, .article-more-questions a').on('click', function(e) {
      var path = window.location.pathname;
      ga('send', 'event', 'Submit Request', 'Submit Request From', path);
  });
  
  // Capture ticket deflection event
  $("#new_request").on('click', '.searchbox-suggestions a', function(e) {
      var $this = $(this),
          link = $this.attr('href');
      ga('send', 'event', 'Ticket Deflection', 'Deflect', link);
  });
  
  // Capture search submit event
  $('form[role="search"]').on('submit', function(e) {
      var $this = $(this),
          query = $this.find('input[type="search"]').val().toLowerCase();
      ga('send', 'event', 'Search', 'Submit', query);
  });
  
    // Social sharing tracking
  $('.share a').on('click', function(e) {
      var $this = $(this),
          type = $this.attr('class').replace('share-',''),
          path = window.location.pathname;
      ga('send','event','Social Share',type, path);
  });
  
  // social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
  $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function() {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Commented out previous code -- Expand Request comment form when Add to conversation is clicked
 // var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
//    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
//    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

//  $showRequestCommentContainerTrigger.on("click", function() {
 //   $showRequestCommentContainerTrigger.hide();
//    $requestCommentFields.show();
 //   $requestCommentSubmit.show();
 //   $commentContainerTextarea.focus();
 // });
  
  
    // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }
  
  

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
  var $requestCommentTextarea = $(".request-container .comment-container textarea");

  $requestCommentTextarea.on("keyup", function() {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function() {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  $(".header .icon-menu").on("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function() {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function(e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
});


//<script>
/* ============================================================================================== */
/* ============================== Custom Article Table of Contents ============================== */
/* ============================================================================================== */

var $headers = $('.article-body:first h1');

if ($headers.length == 0) $headers = $('.article-body:first h2');

if ($headers.length > 0) {
var $toc = $('<div class="toc" style="margin-bottom: 25px">');
var $firstUl = $('<ul>');
var $currentUl = $firstUl;
var previous_level = 1;
var $arrayUl = [];


$firstUl.appendTo($toc);
$('#table-of-contents').length > 0 ? $toc.appendTo('#table-of-contents') : $toc.prependTo('.article-body:first');

// start with first H1
insertHeading($headers[0]);
}

function insertHeading(heading) {
var $heading = $(heading);
// what level heading are we on?
var current_level = headingLevel(heading);


// if it's an H1, add it to the original list
if (current_level === 1) {
newLi($heading, $firstUl);
$currentUl = $firstUl;
$arrayUl = [];
$arrayUl.push($firstUl);
}

// if it's the same as the one before it, add it to the current list
else if (current_level === previous_level) {
newLi($heading, $currentUl);
}

// if it's one level higher than the one before it... time to make a new nested list
else if (current_level > previous_level) {
nestUl();
$arrayUl.push($currentUl);
newLi($heading, $currentUl);
}

else if (current_level<previous_level){
for (i = 0; i < (previous_level-current_level); i++) {
$arrayUl.pop();
}
$currentUl = $arrayUl[$arrayUl.length-1];
newLi($heading, $currentUl);
}

previous_level = current_level;

var $nextHeading = $heading.nextAll("h1, h2, h3, h4, h5, h6").first()[0];
// if there's any headings left... run this again
if ($nextHeading) insertHeading($nextHeading);
}

// adds a new UL to the current UL
function nestUl() {
var $newUl = $('<ul>');
$newUl.appendTo($currentUl);
$currentUl = $newUl;
}

// returns a numerical value for each heading
function headingLevel(heading) {
switch (heading.nodeName) {
case 'H1':
return 1;
break;
case 'H2':
return 2;
break;
case 'H3':
return 3;
break;
case 'H4':
return 4;
break;
case 'H5':
return 5;
break;
case 'H6':
return 6;
break;
default:
return 0;
}
}

// inserts a new line to the current list
function newLi(heading, $list) {
var $heading = $(heading);
if ($heading.text().replace(/\s/g, '') == '') return null;
var $wrapper = $('<li></li>');
//var $link = $('<a>').prop('href', '#' + $heading.prop('id'));
var $anchorname = $heading[0].outerText.replace (/\s/g,'');
var $link = $('<a>').prop('href', '#' + $anchorname);

$link.html($heading.text());
$link.appendTo($wrapper);

$wrapper.appendTo($list);

var place_in_parent = $list.children('li').length;

$heading.html("<a name=\"" + $anchorname + "\"></a>" + $link.find('.index').text() + ' ' + $heading.text());
}

//</script>