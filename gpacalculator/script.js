function createSubjectForm() {
    // Get the number of subjects entered by the user
    var numberOfSubjects = document.getElementById("numberOfSubjects").value;
    
    // Get the container where you want to add subject forms
    var container = document.getElementById("subjectFormContainer");
    
    // Clear any previous content in the container
    container.innerHTML = '';
    
    // Create subject forms based on the entered number
    for (var i = 0; i < numberOfSubjects; i++) {
      // Create a new subject form
      var subjectForm = createSubjectFormElement(i + 1);
      
      // Append the subject form to the container
      container.appendChild(subjectForm);
    }

    // Show the GPA input field
    document.getElementById("gpa").style.display = "block";

    // Show the "Add New Subject" button
    document.getElementById("addNewSubjectButton").style.display = "block";

    document.getElementById("generatePDFButton").style.display = "block";
  }

  function createSubjectFormElement(index) {
    // Create a new subject form
    var subjectForm = document.createElement("div");
    subjectForm.className = "subject";
    
    // Create input fields for subject name, credit, score, and grade
    var subjectNameInput = createInputField("text", "subjectName" + index, "Subject Name");
    var creditInput = createInputField("number", "credit" + index, "Credit");
    creditInput.addEventListener('input', calculateGPA); // Listen for input event
    var scoreInput = createInputField("number", "score" + index, "Score");
    scoreInput.addEventListener('input', calculateGPA); // Listen for input event
    var gradeInput = createInputField("text", "grade" + index, "Grade Point");
    gradeInput.disabled = true; // Disable grade input
    
      // Create remove button
  var removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-button"; // Assign the class name
  removeButton.onclick = function() {
  subjectForm.remove();
  calculateGPA(); // Recalculate GPA after removing subject
  };

    
    // Append input fields and remove button to the subject form
    subjectForm.appendChild(subjectNameInput);
    subjectForm.appendChild(creditInput);
    subjectForm.appendChild(scoreInput);
    subjectForm.appendChild(gradeInput);
    subjectForm.appendChild(removeButton);
    
    return subjectForm;
  }

  function createInputField(type, name, placeholder) {
    var inputField = document.createElement("input");
    inputField.type = type;
    inputField.name = name;
    inputField.placeholder = placeholder;
    return inputField;
  }

  function addSubjectForm() {
    // Get the container where you want to add subject forms
    var container = document.getElementById("subjectFormContainer");
    
    // Create a new subject form
    var subjectForm = createSubjectFormElement(container.children.length + 1);
    
    // Append the subject form to the container
    container.appendChild(subjectForm);
  }

  function calculateGPA() {
    var totalGrade = 0;
    var totalCredit = 0;

    // Get all subject forms
    var subjectForms = document.querySelectorAll('.subject');

    // Calculate total grade and total credit
    subjectForms.forEach(function(subjectForm) {
      var credit = parseInt(subjectForm.querySelector('input[name^="credit"]').value) || 0;
      var score = parseInt(subjectForm.querySelector('input[name^="score"]').value) || 0;
      var grade = credit * score; // Calculate grade for the subject
      totalGrade += grade;
      totalCredit += credit;
      subjectForm.querySelector('input[name^="grade"]').value = grade; // Update grade input field
    });

    // Calculate GPA
    var gpa = totalCredit === 0 ? 0 : totalGrade / totalCredit;
    // Display GPA
    document.getElementById("gpa").value = isNaN(gpa) ? '' : gpa.toFixed(2); // Round to 2 decimal places
  }

  function generateOutput() {
    // Get user information
    var userName = document.getElementById("userName").value;
    var program = document.getElementById("program").value;
    var institute = document.getElementById("institute").value;

    // Initialize output string
    var output = "Name: " + userName + "\n";
    output += "Program: " + program + "\n";
    output += "Institute: " + institute + "\n\n";

    // Get all subject forms
    var subjectForms = document.querySelectorAll('.subject');

    // Generate subject details
    output += "Subject\tCredit\tScore\tGrade point\n";
    subjectForms.forEach(function(subjectForm) {
        var subjectName = subjectForm.querySelector('input[name^="subjectName"]').value;
        var credit = subjectForm.querySelector('input[name^="credit"]').value;
        var score = subjectForm.querySelector('input[name^="score"]').value;
        var gradePoint = credit * score;

        output += subjectName + "\t" + credit + "\t" + score + "\t" + gradePoint + "\n";
    });

    // Get GPA
    var gpa = document.getElementById("gpa").value;

    // Add GPA to the output
    output += "\nGPA: " + gpa;

    // Output the result
    console.log(output);
}

function generatePDF() {
  // Create a new jsPDF instance
  var doc = new jsPDF();

  // Get user information
  var userName = document.getElementById("userName").value;
  var program = document.getElementById("program").value;
  var institute = document.getElementById("institute").value;

  // Initialize y position for text
  var y = 20;

  // Add title
 
  // Add title
  var title = "GPA Details Report";
  var titleFontSize = 20;
  var titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
  var titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  
  // Set title font style to bold
  
  doc.setFontStyle('bold');
  doc.setFontSize(titleFontSize);
  doc.text(titleX, y, title);
  y += 10;

  // Add current date
  var currentDate = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text("Date : " + currentDate, 10, y);
  y += 10;

  // Add user information to the PDF
  doc.setFontSize(12);
  doc.text("Name : " + userName, 10, y);
  y += 10;
  doc.text("Program : " + program, 10, y);
  y += 10;
  doc.text("Institute : " + institute, 10, y);
  y += 20;

  // Define table headers
  var headers = ["Subject", "Credit", "Score", "Grade point"];
  var data = [];

  // Get all subject forms
  var subjectForms = document.querySelectorAll('.subject');

  // Add subject details to the table data
  subjectForms.forEach(function(subjectForm) {
      var subjectName = subjectForm.querySelector('input[name^="subjectName"]').value;
      var credit = subjectForm.querySelector('input[name^="credit"]').value;
      var score = subjectForm.querySelector('input[name^="score"]').value;
      var gradePoint = credit * score;

      data.push([subjectName, credit, score, gradePoint]);
  });

  // Add table to the PDF
  doc.autoTable({
      startY: y,
      head: [headers],
      body: data
  });

  // Get GPA
  var gpa = document.getElementById("gpa").value;

  // Add GPA to the PDF
  var gpaWidth = doc.getStringUnitWidth("GPA : " + gpa) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  var gpaX = doc.internal.pageSize.width - gpaWidth - 18;
  doc.text("GPA : " + gpa, gpaX, doc.autoTable.previous.finalY + 15);

  // Save the PDF
  doc.save("GPA_Details_Report.pdf");
}


