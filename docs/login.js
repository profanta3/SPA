//ID of the pannel to be displayed once loggin in 
const _login_pannel_id = "login-pannel";
//Admin credentials
const _admin_id = "Admin";
const _admin_pwd = "Admin";
//staff credentials
const _staff_id = "staff";
const _staff_pwd = "password";

var n = 3;

const staff_list = [];

function check(form)/*function to check userid & password*/
{
 /*the following code checkes whether the entered userid and password are matching*/
 if(form.userid.value == _admin_id && form.pswrd.value == _admin_pwd)
  {
    //window.open('admin.html')/*opens the target page while Id & password matches*/
    writeAdminPannel(_login_pannel_id);
    n = 3;
  }
  else if (form.userid.value == _staff_id && form.pswrd.value == _staff_pwd)
  {
    writeStaffPannel(_login_pannel_id);
    n = 3;
  }
 else
 {
   n--;
   if (n <= 0)
   {
     alert("Locked...")/*displays error message*/
     form.innerHTML = "Locked out...";
    }
    alert("Login Credentials Incorrect.")/*displays error message*/
  }
}

function logout()
{
  location.reload();
}

/*
  Writes the Admin panel into the main html page
*/
function writeAdminPannel(_id)
{
  document.getElementById(_id).innerHTML = 
  "<iframe src='admin.html' seamless></iframe>";
  alert("Admin page laoded...");
  document.getElementById("login-form").innerHTML = 
  "<button onclick='logout()'>Logout</button>";
}

function addStaff() {
  staff_list.push("Kira")
  staffChanged();
}

function deleteStaff() {
  staff_list.pop();
  staffChanged();
}

function staffChanged()
{
  document.getElementById("staff-list").innerHTML = staff_list;
}

/*
  Writes the Staff panel into the main html page
*/
function writeStaffPannel(_id)
{
  document.getElementById(_id).innerHTML = 
  "<h2>Staff panel!</h2>";
  alert("Staff page laoded...");
}