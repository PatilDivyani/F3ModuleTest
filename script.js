/* Add "https://api.ipify.org?format=json" statement
               this will communicate with the ipify servers in
               order to retrieve the IP address $.getJSON will
               load JSON-encoded data from the server using a
               GET HTTP request */

var ipAddress = "";
$.getJSON("https://api.ipify.org?format=json", function (data) {
  // Setting text of element P with id gfg
  $("#title").html(`MY Public IP ADDRESS : ${data.ip}`);
  ipAddress = data.ip;
  getInfo(ipAddress);
  console.log(ipAddress);
});

//       let object = {
//   "ip": "152.58.18.175",
//   "city": "Pune",
//   "region": "Maharashtra",
//   "country": "IN",
//   "loc": "18.5196,73.8554",
//   "org": "AS55836 Reliance Jio Infocomm Limited",
//   "postal": "411001",
//   "timezone": "Asia/Kolkata",
//   "readme": "https://ipinfo.io/missingauth"
// }

async function getInfo(ipAddress) {
  let geoApi = `https://ipinfo.io/${ipAddress}?token=94e3c2fe0173ec`;
  const response = await fetch(geoApi);
  try {
    let result = await response.json();
    console.log(result);

    let getDataBtn = document.getElementById("getDataBtn");
    getDataBtn.addEventListener("click", () => {
        getDataBtn.style.display = 'none';
      showContent(result);
    });
// Handle search input change
$('#searchInput').on('input', function() {
    filterPostOffices();
  });
    return result;
  } catch (error) {
    console.log(new Error(error));
  }
}

console.log(ipAddress);
function showContent(object) {
  console.log("showing content", object);
  let container = document.querySelector(".container");
  container.style.visibility = "visible";
  let location = object.loc;
  location = location.split(",");
  console.log(location);

  let pincode = object.postal;
  console.log(pincode);

  let locDetails = document.querySelector(".locDetails");
  locDetails.innerHTML = "";
  locDetails.innerHTML = ` <p>Lat:${location[0]}</p>
                          <p>City:${object.city}</p>
                         <p>Organisation:${object.org}</p>
                          <p>Long:${location[1]}</p>
                         <p>Region:${object.region}</p>
                        <p>Hostname:${object.country}</p>`;

  let map = document.querySelector(".map");
  map.innerHTML = "";
  map.innerHTML = `<iframe
      src="https://www.google.com/maps?q=${+location[0]},${+location[1]}&output=embed"    
      frameborder="0"
      style="border: 0"
    ></iframe>`;

  const indianTimezone = object.timezone;
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: indianTimezone,
  });
  console.log(currentTime);
  let count = 1;
  const info = document.querySelector(".info");
  info.innerHTML = "";
  //7/4/2023, 4:45:49 PM
  info.innerHTML = `<p>Time Zone:${indianTimezone}</p>
                    <p>Date And Time:${currentTime}</p>
                    <p>Pincode:${pincode}</p>
                    <p>Message: Number of pincode(s) found:${count}</p>`;

  // Get post offices based on pincode from postalpincode.in API
  $.getJSON(
    `https://api.postalpincode.in/pincode/${pincode}`,
    function (postalData) {
      console.log("Post Offices: postalData", postalData);

      // Process and display post offices
      if (postalData[0].Status === "Success") {
        const postOffices = postalData[0].PostOffice;
        console.log("postalData of all ", postOffices);
        
        displayPostoffices(postOffices)  
        function filterPostOffices() {
     //filter based on search
  const filter = document.querySelector('#filter').value.toLowerCase()
  alert('searching')
  console.log(filter)
   let filteredArr = postOffices.filter((postOffice)=>{
        return filter===postOffice.Name.toLowerCase() || filter===postOffice.BranchType.toLowerCase()
   })
   displayPostoffices(filteredArr)
        }
        }
        
        // Display post offices
        function displayPostoffices(postOffices) {
            let postalCardSection = document.querySelector(".postalCardSection");
            postalCardSection.innerHTML = "";
            postOffices.forEach((postOffice) => {
                let div = document.createElement("div");
                div.className = "card";
                div.innerHTML = `<p>Name : ${postOffice.Name}</p>
              <p>Branch Type : ${postOffice.BranchType}</p>
              <p>Delivery Status : ${postOffice.DeliveryStatus}</p>
              <p>District : ${postOffice.District}</p>
              <p>Division : ${postOffice.Division}</p>`;
                postalCardSection.append(div);
              });
            }
            
       
     
   
   
});

  
}

/*
Block: "Pune City"
BranchType: "Sub Post Office"
Circle: "Maharashtra"
Country: "India"
DeliveryStatus: "Non-Delivery"
Description: null
District: "Pune"
Division: "Pune City East"
Name: "C D A (O)"
Pincode: "411001"
Region: "Pune"
State: "Maharashtra"
{
  "ip": "152.58.18.175",
  "city": "Pune",
  "region": "Maharashtra",
  "country": "IN",
  "loc": "18.5196,73.8554",
  "org": "AS55836 Reliance Jio Infocomm Limited",
  "postal": "411001",
  "timezone": "Asia/Kolkata",
  "readme": "https://ipinfo.io/missingauth"
}
      */
