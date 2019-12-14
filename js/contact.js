/* Contact button, form, submit button */
var ct_btn = document.getElementById('contact-button');

var ct_form = document.getElementById('contact-form');

/* Button holders */
var btn_holders = document.querySelectorAll('#contact-form .button-holders');

/* The inputs */
var inputs = document.querySelectorAll('#contact-form .form-control input');

/* The form */
var form = document.getElementById('gform');

/* Success message */
var success_msg = document.getElementById('success-msg');

/* h1 and submit button of the form */
var h1 = document.querySelectorAll('#gform h1')[0];
var submit = document.getElementById('submit');

/* start animation on ct_btn click by adding the grow class */

ct_btn.onclick = function() {
  this.innerHTML = '';
  this.className = 'grow';
}

/* add transitionend event for the button to show form */
ct_btn.addEventListener('transitionend', function(){
  this.style.display = 'none';
  ct_form.style.display = 'flex';
});

/* Shrink the button holders on click and reveal the input behind it */
btn_holders.forEach(btn => {
  btn.addEventListener('click', function(){
    btn.innerHTML += ':';
    btn.style.width = '80px';
    btn.parentNode.childNodes[3].focus();
  })
});

/* Submit form */
form.addEventListener('submit', function(e){
  e.preventDefault();
  
  var allRight = true;
  
  // Go through all inputs
  inputs.forEach(input => {
    
    // If an input is empty, don't allow to continue
    if(input.value === ''){
      allRight = false;
    }
  });
  
  
  // Only continue if every input is filled
  if(allRight) {
    
    // hide title and button
    h1.style.display = 'none';
    submit.style.display = 'none';
    
    inputs.forEach(input => {
      input.style.display = 'none';
    });
    
    btn_holders.forEach(btn => {
      btn.innerHTML = '';
      btn.style.width = '40px';
      btn.className = 'loader';
    });
    
    // after 6 seconds show to complete message
    setTimeout(function(){
      success_msg.className = 'grow';
      form.style.display = 'none';
    }, 6000);
    
  } else {
    alert('Please make sure to fill all the inputs!');
  }
});

function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validateHuman(honeypot) {
  if (honeypot) {  //if hidden form filled up
    console.log("Robot Detected!");
    return true;
  } else {
    console.log("Welcome Human!");
  }
}

// get all data in form and return object
function getFormData() {
  var form = document.getElementById("gform");
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append 
                                              // the current checked value to 
                                              // the end of it, along with 
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
                                  // from the  string to make the output 
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  data.formDataNameOrder = JSON.stringify(fields);
  data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
  data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

  console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var data = getFormData();         // get the values submitted in the form

  /* OPTION: Remove this comment to enable SPAM prevention, see README.md
  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
    return false;
  }
  */

  if( !validEmail(data.email) ) {   // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        console.log( xhr.status, xhr.statusText )
        console.log(xhr.responseText);
        document.getElementById('gform').style.display = 'none'; // hide form
        document.getElementById('thankyou_message').style.display = 'block';
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}
function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);