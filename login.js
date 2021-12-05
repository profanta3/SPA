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
var staffList = new Map();

/*
  Set boundaries for DOBs...
*/
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

var date = wrapDate(yesterday);

document.getElementById("student-dob").setAttribute("max", date);
document.getElementById("staff-dob").setAttribute("max", date);

document.getElementById("student-dob").setAttribute("value", date);
document.getElementById("staff-dob").setAttribute("value", date);

function wrapDate(date) {
  return date.getFullYear() + '-'
  + ('0' + (date.getMonth()+1)).slice(-2) + '-'
  + ('0' + date.getDate()).slice(-2);
}

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
  s += "<div id='backButtonPlaceholder'></div> ";
  s += "<div id='admin-btns'></div>";
  s += "<hr>";
  s += "<div id='addForm'></div>";
  s += "<div id='StudentLoginForm'></div>";
  s += "<div id='staff-list'></div>";
  document.getElementById("login-pannel").innerHTML = s;
  if (layout == 0) //dafault admin layout
  {
    s = ""
    s += "<button onclick='writeAdminStaffMenu()' class='button'>Staffs</button>";
    s += "<button onclick='writeAdminStudentsMenu()' class='button'>Students</button>";
    document.getElementById("admin-btns").innerHTML = s;
  }
  else if(layout == 1) //layout for displaying signup forms
  {
    //document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Back</button><br>";
  }
  document.getElementById("StudentSignUpFormContainer").style.display = "None";
  document.getElementById("StaffSignUpFormContainer").style.display = "None";
}

function writeAdminStudentsMenu()
{
  var s = ""
  s += "<button onclick='addNewStudentForm()' class='button'>Add Student</button>";
  s += "<button onclick='' class='button'>Update Student</button>";
  s += "<button onclick='' class='button'>Delete Student</button>";
  document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Home</button><br>";
  document.getElementById("admin-btns").innerHTML = s;
  displayList();
}

function writeAdminStaffMenu()
{
  var s = ""
  s += "<button onclick='addNewStaffForm()' class='button'>Add Staff</button>";
  s += "<button onclick='' class='button'>Update Staff</button>";
  s += "<button onclick='' class='button'>Delete Staff</button>";
  document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Home</button><br>";
  document.getElementById("admin-btns").innerHTML = s;
}

/**
 * Adds the Form for adding students
 */
function addNewStudentForm()
{
  writeAdminPannel(1);
  document.getElementById("StudentSignUpFormContainer").style.display = "Block";
}

/**
 * Adds the Form for adding students
 */
 function addNewStaffForm()
 {
   writeAdminPannel(1);
   document.getElementById("StaffSignUpFormContainer").style.display = "Block";
 }

/**
 * Called when a new student is added via the form
 */
function createStudentForm()
{
    let form = new FormData(document.getElementById("cStudentForm"));

    console.log("ID: "+form.get("student_id"));
    var s = new Student(form.get("student_id"), form.get("fname"), form.get("lname"), form.get("student-dob"), form.get("gender-male"), form.get("department"), form.get("email_id"));
    studentList.set(form.get("student_id"), s);

    localStorage.setItem(form.get("student_id"), JSON.stringify(s))
    console.log(JSON.stringify(studentList));
    writeAdminPannel();
    writeAdminStudentsMenu();
    displayList();
}

/**
 * Called when a new student is added via the form
 */
 function createStaffForm()
 {
    if (!validateStaffForm("cStaffForm"))
    {
      alert("Invalid DOB");
      //return false;
    }
    let form = new FormData(document.getElementById("cStaffForm"));
 
    console.log("ID: "+form.get("staff_id"));

    let new_staff_raw = {
      id: form.get("student_id"),
      fname: form.get("fname"),
      lname: form.get("lname"),
      dob: form.get("staff-dob"),
      gender: form.get("gender-male"),
      email: form.get("email_id")
    }

    let new_staff = Staff.from(new_staff_raw);

    //var s = new Student(form.get("student_id"), form.get("fname"), form.get("lname"), form.get("dob"), form.get("gender-male"), form.get("department"), form.get("email_id"));
    staffList.set(new_staff_raw.id, new_staff);
 
    localStorage.setItem(new_staff_raw.id, JSON.stringify(new_staff))
    console.log(JSON.stringify(staffList));
    writeAdminPannel();
    writeAdminStaffMenu();
    displayList(type="staff")
 }

 function validateStaffForm(form_id) {
   var form = new FormData(document.getElementById(form_id));
   //Age validation
   var today = new Date();
   var sel_date = new Date(form.get("staff-dob"))
   var age = today.getFullYear - sel_date;
   console.log("Age: "+age);
   if(age<17)
   {
     return false;
   }
 }

/*
  Adds Stuff to the stuff_list with generated UID and PW
*/
function addStaff() {
  let staff = {
    
  }
  /*
  // Returns a random integer from 1 to 100:
  staff_id = "Staff-"+ id;
  staff_pw = "Stf-"+ id++ + "PW";
  staff_list.set(staff_id,staff_pw);
  _last_staff_id.push(staff_id);
  staffChanged(_stf_lst_pannel_id);*/
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

function displayList(type="student")
{
  if(studentList.size == 0)
  {
    if(localStorage.length > 0)
    {
      
      for (let i = 0; i < localStorage.length; i++) {
        var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));

        console.log("Item to set: "+localStorage.key(i) + ", " + obj.getID());
        studentList.set(localStorage.key(i), obj);
      }
    }
    else 
    {
      console.log("Loal storage empty...");
    }
  }
  else 
  {
    console.log("Student list not empty...");
  }
  if(type == "staff")
  {
    s = "|\tSaff ID\t|\tFirst Name\t|\tEmail\t|<br>";
  }
  else
  {
    s = "|\tStudent ID\t|\tFirst Name\t|\tEmail\t|<br>";
  }

  for (const [key, student] of studentList) {
    s += "|\t" + key+ "\t|\t" + student.getFName() + "\t|\t" + student.getEMail() +"\t|<br>";
  }

  document.getElementById(_stf_lst_pannel_id).innerHTML = "<hr><br><code>"+s+"</code>";
}



/*
  Updates stuff list
*/
function staffChanged(cont, debug=false)
{
  s = "|\tStudent ID\t|\tFirst Name\t|\tEmail\t|<br>";


  for (const [key, value] of staff_list) {
    s += "|\t" + key+ "\t|\t" +value + "\t|<br>";
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

class Staff
{
  constructor() {}

  static from(json){
    return Object.assign(new Staff(), json);
  }

  getID() { return this.id; }

  getFName() { return this.fname; }

  getLName() { return this.lname; }

  getDOB() { return this.dob; }

  getGender() { return this.gender; }

  getEMail() { return this.email; }
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

    static from(json){
      return Object.assign(new Student(), json);
    }

    getFName() {
      return this.fname;
    }

    getID()
    {
      return this.id;
    }

    getLName()
    {
      return this.lname;
    }

    getDOB()
    {
      return this.dob;
    }

    getGender()
    {
      return this.gender;
    }

    getDepartment()
    {
      return this.department;
    }

    getEMail()
    {
      return this.email;
    }
}