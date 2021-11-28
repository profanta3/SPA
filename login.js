//ID of the pannel to be displayed once loggin in 
const _login_pannel_id = "login-pannel";
//ID of the div where the Staff list should be displayed in
const _stf_lst_pannel_id = "staff-list";
//Admin credentials
const _admin_id = "Admin";
const _admin_pwd = "Admin";

//number max incorrect logins till fail
var n = 3;

var id = 0;
var _last_staff_id = [];

const staff_list = new Map();

/*
  function to check userid & password
*/
function check(form)
{
 if(form.userid.value == _admin_id && form.pswrd.value == _admin_pwd)
  {
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
     //more than n times incorrect inputs
     alert("Locked...")
     form.innerHTML = "Locked out...";
     return;
    }
    alert("Login Credentials Incorrect.")
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
  "<hr><h2>Admin panel</h2><button onclick='addStaff()' class='button'>Add Stuff</button><button onclick='deleteStaff()' class='button'>Delete Stuff</button><hr><div id='staff-list'></div><br>";
}

/*
  Adds Stuff to the stuff_list with generated UID and PW
*/
function addStaff() {
  // Returns a random integer from 1 to 100:
  staff_id = "Staff-"+ id;
  staff_pw = "Stf-"+ id++ + "PW";
  staff_list.set(staff_id,staff_pw);
  _last_staff_id.push(staff_id);
  staffChanged(_stf_lst_pannel_id);
}

/*
  Deletes the last stuff from stuff_list taht was created
*/
function deleteStaff() {
  if (_last_staff_id.length == 0)
  {
    return;
  }
  staff_list.delete(_last_staff_id.pop());
  id--;
  staffChanged(_stf_lst_pannel_id);
}

/*
  Updates stuff list
*/
function staffChanged(cont, debug=false)
{
  s = "( UID  |  PWD )<br>";
  for (const [key, value] of staff_list) {
    s += "(" + key+ " | " +value + ")<br>";
  }
  if(debug)
  {
    document.getElementById(cont).innerHTML = "<code id='debug-msg'>"+s+"</code>";
  }
  else
  {
    document.getElementById(cont).innerHTML = "<code>"+s+"</code>";
  } 
}

/*
  Writes the Staff panel into the main html page
*/
function writeStaffPannel(_id, staff_name)
{
  document.getElementById(_id).innerHTML = 
  "<hr><h2>Staff panel</h2><hr><br>Hello " + staff_name + "";
}