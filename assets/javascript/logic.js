 // Attach web app's Firebase configuration
 let firebaseConfig = {
     apiKey: "AIzaSyAK81hjIOHRStxs5bHqcN5DMV_PIvjN0O4",
     authDomain: "jo-s-test.firebaseapp.com",
     databaseURL: "https://jo-s-test.firebaseio.com",
     projectId: "jo-s-test",
     storageBucket: "jo-s-test.appspot.com",
     messagingSenderId: "383211910396",
     appId: "1:383211910396:web:d4f294a20e1c05c9edd379",
     measurementId: "G-0PB10QHTNN"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 // Define a local variable for the firebase database
 let database = firebase.database();
 //Clear out historical data. Think about to do this every midnight.
 //database.ref().set('');

 // On click, do a function, grab the input and push to database and show on html
 $("#add-train-btn").on("click", function (event) {
     // Prevent page refresh, ???this doesn't seem to work.
     event.preventDefault();
     console.log("Click button");
     // Grab the userinputs, and declaire variable for each of the input, to save the input value
     // Pay attention to the format and type of the input
     let trainName = $("#train-name-input").val().trim();
     let destination = $("#destination-input").val().trim();
     // For the first train time, needs to modify its format using moment.js
     let firstTrainTime = moment($("#first-train-input").val().trim(), 'HH:mm').format('HH:mm');
     const frequency = $("#frequency-input").val().trim();

     //log the input values
     console.log("trainName:", trainName);
     console.log("destination:", destination);
     console.log("firstTrainTime", firstTrainTime);
     console.log("frequency:", frequency);



     // Pay attention to the format and type of the input

     // Include the input in an object, and push the object as a child into the correct node(s) in the database
     let inputObject = {
         name: trainName,
         dest: destination,
         firstT: firstTrainTime,
         freq: frequency
     };

     database.ref().push(inputObject);

     alert("Train info successfully added");
 })

 // Grab the information from the database, convert to the proper format or type, and save it to local variables
 database.ref().on("child_added", function (childSnapshot) {
     console.log(childSnapshot.val());
     let object = childSnapshot.val();
     let newTrainName = childSnapshot.val().name;
     let newDest = childSnapshot.val().dest;
     let newFirstT = childSnapshot.val().firstT;
     let newFreq = childSnapshot.val().freq;
     // Perform calculations for "minutes-away" and "next-arrival" based on current time and next arrival
     // minutes-away = frequency - (currentTime-firstTrainTime) % frequency 
     // nextArrival = currentTime + minutes-away 
     // something is wrong here...should I not use 'HH:mm' as format?
     // if else first train time in the future, or first train time in the future
     let timeDelta = moment().diff(moment(newFirstT, 'HH:mm'), 'minutes');
     let minutesAway = newFreq - timeDelta % newFreq;
     let nextArrival = moment().add(minutesAway);

     console.log(timeDelta);
     console.log(minutesAway);
     console.log(nextArrival);

     //  If everything is in the database, can use the below code
     //  const keys = Object.keys(object);
     //  console.log(keys);
     //  let tr = '<tr>';
     //  for (let i = 0; i < keys.length; i++) {
     //      tr += '<td>' + object[keys[i]] + '</td>'
     //      console.log(object[keys[i]])
     //  }
     //  tr += '</tr>';
     //  console.log(tr);
     //  $("tbody").append(tr);

     // Need to write the local variables into the html, each time the the admin updates the inputs
     // Create the new row
     var newRow = $("<tr>").append(
         $("<td>").text(newTrainName),
         $("<td>").text(newDest),
         $("<td>").text(newFreq),
         $("<td>").text(nextArrival),
         $("<td>").text(minutesAway)
     );
     $("tbody").append(newRow);
 })