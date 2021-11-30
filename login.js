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

var studentList = new Map();
/*
  function to check userid & password
*/
function check(form)
{
 if(form.userid.value == _admin_id && form.pswrd.value == _admin_pwd)
  {
    document.getElementById("login-form").style.display = "none";
    writeAdminPannel();
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
function writeAdminPannel(layout=0)
{
  var s = "";
  s += "<hr><h2>Admin Panel</h2>";
  s += "<div id='admin-btns'></div>";
  s += "<hr>";
  s += "<div id='addForm'></div><br>";
  s += "<div id='StudentLoginForm'></div>";
  s += "<div id='staff-list'></div>";
  document.getElementById("login-pannel").innerHTML = s;
  if (layout == 0) //dafualt admin layout
  {
    //"<hr><h2>Admin panel</h2><button onclick='addStaff()' class='button'>Add Stuff</button><button onclick='deleteStaff()' class='button'>Delete Stuff</button><hr><div id='staff-list'></div><br>";
    //"<hr><h2>Admin panel</h2><button onclick='addStaff()' class='button'>Students</button><button onclick='deleteStaff()' class='button'>Staffs</button><hr><div id='staff-list'></div><br>";
    s = ""
    s += "<button onclick='writeAdminStaffMenu()' class='button'>Staffs</button>";
    s += "<button onclick='writeAdminStudentsMenu()' class='button'>Students</button>";
    s += "<div id='backButtonPlaceholder'></div> ";
    document.getElementById("admin-btns").innerHTML = s;
  }
  else if(layout == 1) //layout for displaying signup forms
  {
    s = "";
    s += "<div id='backButtonPlaceholder'></div> ";
    document.getElementById("admin-btns").innerHTML = s;
    document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Back</button><br>";
  }
  document.getElementById("StudentSignUpFormContainer").style.display = "None";
}

function writeAdminStudentsMenu()
{
  var s = ""
  //s += "<button onclick='writeAdminPannel()' class='button'>Back</button><br>";
  s += "<button onclick='addNewStudentForm()' class='button'>Add Student</button>";
  s += "<button onclick='' class='button'>Update Student</button>";
  s += "<button onclick='' class='button'>Delete Student</button>";
  document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Back</button><br>";
  document.getElementById("admin-btns").innerHTML = s;
}

function writeAdminStaffMenu()
{
  var s = ""
  //s += "<button onclick='writeAdminPannel()' class='button'>Back</button><br>";
  s += "<button onclick='addStaff()' class='button'>Add Staff</button>";
  s += "<button onclick='' class='button'>Update Staff</button>";
  s += "<button onclick='' class='button'>Delete Staff</button>";
  document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Back</button><br>";
  document.getElementById("admin-btns").innerHTML = s;
}

/**
 * Adds the Form for adding students
 */
function addNewStudentForm()
{
  //var s = "";
  //s += "<h3>Add Student/ Staff</h3><br>";
  //s += "<object type=text/html data='LoginForm.html'></object>";
  writeAdminPannel(1);
  document.getElementById("StudentSignUpFormContainer").style.display = "Block";
}



/**
 * Called when a new student is added via the form
 */
function createStudentForm()
{
    let form = new FormData(document.getElementById("cStudentForm"));

    console.log("ID: "+form.get("student_id"));
    var s = new Student(form.get("student_id"), form.get("fname"), form.get("lname"), form.get("dob"), form.get("gender-male"), form.get("department"), form.get("fname"), form.get("email_id"));
    studentList.set(form.get("student_id"), s);

    console.log(JSON.stringify(studentList));
    writeAdminPannel();
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
    if(document.getElementById(cont).innerHTML.length == 0)
    {
      document.getElementById(cont).innerHTML = "<code id='debug-msg'>"+s+"</code>";
    }
    else
    {
      document.getElementById(cont).innerHTML = "";
    }
  }
  else
  {
    document.getElementById(cont).innerHTML = "<hr><br><code>"+s+"</code>";
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

class Student
{
    constructor(id, fname, lname, dob, gender, department, email)
    {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.dob = dob;
        this.gender = gender;
        this.department = department;
        this.email = email;
    }
}