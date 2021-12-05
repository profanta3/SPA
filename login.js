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
  Load Students from JSON file...
*/
function loadJSONStudents(callback, addr)
{

  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', 'https://raw.githubusercontent.com/profanta3/SPA/main/students.json', true);
  
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == "200" )
    {
      callback(xhr.responseText)
    }
  }
  xhr.send();
}

/*
  Load Staffs from JSON file...
*/
function loadJSONStaffs(callback, addr)
{

  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', 'https://raw.githubusercontent.com/profanta3/SPA/main/staffs.json', true);
  
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == "200" )
    {
      callback(xhr.responseText)
    }
  }
  xhr.send();
}

loadJSONStudents(function(response) {
  var actual_JSON = JSON.parse(response);
  console.log(actual_JSON);
  for (let i = 0; i < actual_JSON.length; i++) {
    let new_student = Student.from(actual_JSON[i])
    studentList.set(actual_JSON[i].id, new_student);
  }
})

loadJSONStaffs(function(response) {
  var actual_JSON = JSON.parse(response);
  console.log(actual_JSON);
  for (let i = 0; i < actual_JSON.length; i++) {
    let new_staff = Staff.from(actual_JSON[i])
    staffList.set(actual_JSON[i].id, new_staff);
  }
})

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

/**
 * wrap date tp String like: "YYYY-MM-DD" with leading zeros
 */
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

/**
 * called when logout is clicked
 */
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
  s += "<br><div id='filtered-list-placeholder'></div>";
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

/*
  Writes the Admin Panel for Managing the Students
*/
function writeAdminStudentsMenu()
{
  var s = ""
  s += "<button onclick='addNewStudentForm()' class='button'>Add Student</button>";
  s += "<button onclick='' class='button'>Update Student</button>";
  s += "<button onclick='' class='button'>Delete Student</button>";
  s += "<div id='dropdown-placeholder'/>";
  document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Home</button><br>";
  document.getElementById("admin-btns").innerHTML = s;
  
  //select the parent object on which we will append the new generated Dropwdowns
  var parent = document.getElementById("dropdown-placeholder");

  var filter_heading = document.createElement("h2");
  filter_heading.innerHTML = "Filter Dataset:";
  parent.appendChild(document.createElement("br"));
  parent.appendChild(document.createElement("hr"));
  parent.appendChild(filter_heading);

  //create a set containing all departments set -> eliminate duplicates
  var departments_set = new Set();
  departments_set.add("All"); //default value

  studentList.forEach((element, key) => {
    departments_set.add(element.getDepartment());
  });
  if (departments_set.size < 1) {return;}

  //create drop down for the Department filtering
  var selectList = document.createElement("select");
  selectList.id = "department-select-list";
  selectList.classList.add("input-box");
  selectList.classList.add("filter-box");

  var label = document.createElement("label");
  label.for = "department-select-list";
  label.textContent = "Department";

  //create drop down for the Semester filtering
  var selectListSemester = document.createElement("select");
  selectListSemester.id = "semester-select-list";
  selectListSemester.classList.add("input-box");
  selectListSemester.classList.add("filter-box");

  var labelSemester = document.createElement("label");
  labelSemester.for = "semester-select-list";
  labelSemester.textContent = "Semester";

  parent.appendChild(labelSemester);
  parent.appendChild(selectListSemester);
  parent.appendChild(document.createElement("br"));
  parent.appendChild(label);
  parent.appendChild(selectList);

  //Add the options to the department drop down selection
  var array = Array.from(departments_set);

  for (let i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
  }

  //add the Semester options to the Semester drop down selection
  var semesterArray = ["Select", "Fall", "Summer", "Winter"];

  for (let i = 0; i < semesterArray.length; i++) {
    var option = document.createElement("option");
    option.value = semesterArray[i];
    option.text = semesterArray[i];
    selectListSemester.appendChild(option);
  }

  //adding event listeners...
  if(navigator.userAgent.indexOf("Safari") != -1)
  {
    //Safari doesnt like 'click' event listeners so i used 'change'
    selectListSemester.addEventListener('change', filterSemesterStudenListOutput);
    selectList.addEventListener('change', filterDepartmentStudentListOutput);
  }
  else 
  {
    selectListSemester.addEventListener('click', filterSemesterStudenListOutput);
    selectList.addEventListener('click', filterDepartmentStudentListOutput);  
  }
  //init first 'All' selection to show whole Data set when loading the site
  filterDepartmentStudentListOutput();
}

/**
 * Apply a filter on the students list based on the selected option in the drop down
 */
function filterDepartmentStudentListOutput() {

  //get the selected option from Department selection
  var opt = document.getElementById("department-select-list").options[document.getElementById("department-select-list").selectedIndex];
  
  if (opt.value != "All") {
    //only take these students of which the departments equals the selected department...
    var array = Array.from(studentList.values()).filter(student => student.department == opt.value);
  } 
  else {
    var array = Array.from(studentList.values());
  }

  outputFilteredStudents(array); //eg print the filtered list of students
}

/**
 * Apply a filter on the students list based on the selected option in the drop down
 */
function filterSemesterStudenListOutput() {
  //get the selected option from Department selection
  var opt = document.getElementById("semester-select-list").options[document.getElementById("semester-select-list").selectedIndex];

  var array = Array.from(studentList.values()).filter((student) => {
    //split the date by taking out the dashes -> '2021-01-02' becomes ["2021","01","02"]
    var d = parseInt(student.jdate.split('-')[1]);

    if ((d >= 10 || d <= 2) && opt.value == "Winter")
    {
      return true;
    }
    else if (d <= 8 && d >= 4 && opt.value == "Summer")
    {
      return true;
    }
    else {
      //What was the purpose of the Fall option? @khritiga
      return false;
    }
  })
  
  outputFilteredStudents(array); //eg print the filtered list of students
}

/**
 * Print out the Array containing students
 */
function outputFilteredStudents(students)
{
  array = students;

  if (document.getElementById("table-div")) //clear the list if one already exists...
  {
    document.getElementById("table-div").parentNode.removeChild(document.getElementById("table-div"));
  }
  //create the placeholder for the list
  var div = document.createElement("div");
  div.classList.add("table");
  div.id = "table-div";

  var list = document.createElement("ul");
  list.classList.add("person-view");

  var pre_array = ["ID", "First Name", "Last Name", "DOB", "Gender", "Department", "Email", "Join-Date"];

  for(key in pre_array)
  {
    var listItem = document.createElement("li");  
    listItem.classList.add("person-view");
    listItem.innerHTML = "<code style='font-weight: bold;'>"+pre_array[key]+"</code>";
    list.appendChild(listItem);
  }

  div.appendChild(list);
  document.getElementById("filtered-list-placeholder").appendChild(div);
  
  for (let i = 0; i < array.length; i++) { 
    var list = document.createElement("ul");
    list.classList.add("person-view");

    for(key in array[i])
    {
      var listItem = document.createElement("li");  
      listItem.classList.add("person-view");
      listItem.innerHTML = "<code>"+array[i][key]+"</code>";
      list.appendChild(listItem);
    }
    
    div.appendChild(list);
    document.getElementById("filtered-list-placeholder").appendChild(div);
  }
}

/*
  Writes the Admin Panel for Managing the staffs
*/
function writeAdminStaffMenu()
{
  var s = ""
  s += "<button onclick='addNewStaffForm()' class='button'>Add Staff</button>";
  s += "<button onclick='' class='button'>Update Staff</button>";
  s += "<button onclick='deleteStaff' class='button'>Delete Staff</button>";
  document.getElementById("backButtonPlaceholder").innerHTML = "<button onclick='writeAdminPannel()' class='button'>Home</button><br>";
  document.getElementById("admin-btns").innerHTML = s;

  //Print the staffs
  outputFilteredStudents(Array.from(staffList.values()));
}

/**
 * Adds the Form for adding students
 */
function addNewStudentForm()
{
  //make the form visible
  writeAdminPannel(1);
  document.getElementById("StudentSignUpFormContainer").style.display = "Block";
}

/**
 * Adds the Form for adding students
 */
 function addNewStaffForm()
 {
   //make the form visible
   writeAdminPannel(1);
   document.getElementById("StaffSignUpFormContainer").style.display = "Block";
 }

/**
 * Called when a new student is added via the form
 */
function createStudentForm()
{
    if (!validateStaffForm("cStudentForm"))
    {
      alert("Invalid DOB");
      return true;
    }
    let form = new FormData(document.getElementById("cStudentForm"));
 
    //console.log("ID: "+form.get("staff_id"));

    var today = new Date();
    var gen_gender = "";
    if (form.get("gender-male") == "male")
    {
      gen_gender = "male";
    }
    else if(form.get("gender-female") == "female")
    {
      gen_gender = "female"
    }
    else {
      gen_gender = "other";
    }

    let new_student_raw = {
      id: form.get("student_id"),
      fname: form.get("fname"),
      lname: form.get("lname"),
      dob: form.get("student-dob"),
      gender: gen_gender,
      department: form.get("department"),
      email: form.get("email_id"),
      jdate: wrapDate(today)
    }
    
    let new_student = Student.from(new_student_raw);

    studentList.set(new_student_raw.id, new_student);

    localStorage.setItem("student", JSON.stringify(new_student))

    studentList.forEach( (value, key) => console.log("Key: "+key + " Value: "+ value));
    console.log(JSON.stringify(new_student));
    writeAdminPannel();
    writeAdminStudentsMenu();
}

/**
 * Called when a new student is added via the form
 */
 function createStaffForm()
 {
    if (!validateStaffForm("cStaffForm"))
    {
      alert("Invalid DOB");
      return true;
    }
    let form = new FormData(document.getElementById("cStaffForm"));
 
    //console.log("ID: "+form.get("staff_id"));

    var today = new Date();
    var gen_gender = "";
    if (form.get("gender-male") == "male")
    {
      gen_gender = "male";
    }
    else if(form.get("gender-female") == "female")
    {
      gen_gender = "female"
    }
    else {
      gen_gender = "other";
    }

    //create a staff var with all attributes
    let new_staff_raw = {
      id: form.get("staff_id"),
      fname: form.get("fname"),
      lname: form.get("lname"),
      dob: form.get("staff-dob"),
      gender: gen_gender,
      email: form.get("email_id"),
      jdate: wrapDate(today)
    }
    
    //store the staff var in a Staff object
    let new_staff = Staff.from(new_staff_raw);

    staffList.set(new_staff_raw.id, new_staff);
    
    //localStorage.setItem("staff", JSON.stringify(new_staff)) - purpose of client side serialization
    writeAdminPannel();
    writeAdminStaffMenu();
 }

 function validateStaffForm(form_id) {
   var form = new FormData(document.getElementById(form_id));
   //Age validation
   var today = new Date();
   var sel_date = new Date(form.get("dob")).getFullYear();
   var age = parseInt(today.getFullYear()) - parseInt(sel_date);
   if(age<17 || age>60)
   {
      console.log("age: "+age);
      return false;
   }
   return true;
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

  getJDate() { return this.jdate; }
}

class Student
{
    constructor() {}

    static from(json){
      return Object.assign(new Student(), json);
    }

    getID() { return this.id; }

    getFName() { return this.fname; }

    getLName() { return this.lname; }

    getDOB() { return this.dob; }

    getGender() { return this.gender; }

    getEMail() { return this.email; }

    getDepartment() { return this.department; }

    getJDate() { return this.jdate; }
  }