//ID of the pannel to be displayed once loggin in 
const _login_pannel_id = "login-pannel";
//Admin credentials
const _admin_id = "Admin";
const _admin_pwd = "Admin";
//staff credentials
const _staff_id = "Staff";
const _staff_pwd = "Staff";

var n = 3;

var id = 0;

var _last_staff_id = [];

const staff_list = new Map();

function check(form)/*function to check userid & password*/
{
 /*the following code checkes whether the entered userid and password are matching*/
 if(form.userid.value == _admin_id && form.pswrd.value == _admin_pwd)
  {
    //window.open('admin.html')/*opens the target page while Id & password matches*/
    document.getElementById("login-form").style.display = "none";
    writeAdminPannel(_login_pannel_id);
    document.getElementById("logout-btn").style.display = "inline";
    n = 3;
    return;
  }
  for (const [key, value] of staff_list) {
    if (form.userid.value == key && form.pswrd.value == value) 
    {
      document.getElementById("login-form").style.display = "none";
      writeStaffPannel(_login_pannel_id, key);
      document.getElementById("logout-btn").style.display = "inline";
      n = 3;
      return;
    }
  }
   n--;
   if (n <= 0)
   {
     alert("Locked...")/*displays error message*/
     form.innerHTML = "Locked out...";
    }
    alert("Login Credentials Incorrect.")/*displays error message*/
}

function logout()
{
  document.getElementById("login-form").style.display = "initial";
  document.getElementById(_login_pannel_id).innerHTML = "";
  document.getElementById("logout-btn").style.display = "none";
}

/*
  Writes the Admin panel into the main html page
*/
function writeAdminPannel(_id)
{
  document.getElementById(_id).innerHTML = 
  "<h2>Admin panel!</h2><br><button onclick='addStaff()'>Add Stuff</button><button onclick='deleteStaff()'>Delete Stuff</button><div  id='staff-list'></div><br>";
  alert("Admin page laoded...");
  //document.getElementById("login-form").innerHTML = 
  //"<button onclick='logout()' class='button'>Logout</button>";
}

function addStaff() {
  // Returns a random integer from 1 to 100:
  staff_id = "Staff-"+ id;
  staff_pw = "Staff-"+ id++ + "PW!";
  staff_list.set(staff_id,staff_pw);
  _last_staff_id.push(staff_id);
  staffChanged("staff-list");
}

function deleteStaff() {
  if (_last_staff_id.length == 0)
  {
    return;
  }
  staff_list.delete(_last_staff_id.pop());
  id--;
  staffChanged("staff-list");
}

function staffChanged(cont)
{
  s = "";
  for (const [key, value] of staff_list) {
    s += "(" + key+ ", " +value + ")<br>";
  } 
  document.getElementById(cont).innerHTML = s;
}

/*
  Writes the Staff panel into the main html page
*/
function writeStaffPannel(_id, staff_name)
{
  document.getElementById(_id).innerHTML = 
  "<h2>Hello " + staff_name + "</h2>";
}