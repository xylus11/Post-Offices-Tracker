const userIP = GetUserIP();
const accessToken = 'e9a017b02abb0a';
const getDataBtn = document.getElementById('get-data');
const getData = document.getElementById('get-data');
const sideimg = document.getElementById('side-img');
const ipbox =document.getElementById('ip-box');

let lat = document.getElementById('lat');
let city = document.getElementById('city');
let organisation = document.getElementById('Organisation');
let long = document.getElementById('Long');
let region = document.getElementById('Region');

const mainContent = document.getElementById('main-content');
const map = document.getElementById('map');

const timeZone = document.getElementById('time-zone');
const dateTime = document.getElementById('date-time');
const pincode = document.getElementById('pincode');
const message = document.getElementById('message');

const postOfficesList = document.getElementById('post-offices-list');

let postOffices = [];

document.getElementById('ip').innerHTML = userIP;

function GetUserIP(){
    var ret_ip;
    $.ajaxSetup({async: false});
    $.get('https://jsonip.com/', function(r){ 
        ret_ip = r.ip; 
    });
    return ret_ip;
}

getDataBtn.addEventListener('click', fetchData);
function fetchData() {
    getDataBtn.style.display = "none";
    mainContent.style.display = 'block';
    sideimg.style.display=      'none';
  


    fetch(`https://ipinfo.io/${userIP}/json?token=${accessToken}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        lat.innerHTML = `<h3>Lat : </h3> ${data.loc.split(',')[0]}`;
        long.innerHTML = `<h3>Long : </h3> ${data.loc.split(',')[1]}`;
        city.innerHTML = `<h3>City : </h3> ${data.city}`;
        organisation.innerHTML = `<h3>Organisation : </h3> ${data.org}`;
        region.innerHTML = `<h3>Region : </h3> ${data.region}`;
        map.innerHTML = `<iframe src="https://maps.google.com/maps?q=${data.loc.split(',')[0]}, ${data.loc.split(',')[1]}&z=15&output=embed" width="360" height="270" frameborder="0" style="border:0"></iframe>`;

        timeZone.innerHTML = data.timezone;
        let datetime_str = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
        dateTime.innerHTML = datetime_str;
        pincode.innerHTML = data.postal;
        
        return data.postal;
    })
    .then((pincode) => {
        fetch(`https://api.postalpincode.in/pincode/${pincode}`)
            .then((postalRes) => postalRes.json())
            .then((postalData) => {
                console.log(postalData);
                message.innerHTML = postalData[0].Message;
                postOffices = postalData[0].PostOffice;
                console.log(postOffices);
                updatePostOffices(postOffices);
            })
            .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}

// console.log(postOffices);

function updatePostOffices(postOffices) {
    postOffices.forEach((post) => {
        postOfficesList.innerHTML += `<div class="post-office">
        <div class="post-office-name"><strong>Name :</strong> ${post.Name}</div>
        <div class="branch-type"><strong>Branch Type :</strong> ${post.BranchType}</div>
        <div class="delivery-status"><strong>Delivery Status :</strong> ${post.DeliveryStatus}</div>
        <div class="district"><strong>District :</strong> ${post.District}</div>
        <div class="division"><strong>Division :</strong> ${post.Division}</div>
    </div>`
    });
}

const filter = document.getElementById('filter');
filter.addEventListener('input', () => {
    const filterValue = filter.value.toLowerCase();
    const postLists = document.querySelectorAll('.post-office');
    postLists.forEach((post) => {
        const name = post.querySelector('.post-office-name').textContent.toLowerCase();
        const branchType = post.querySelector('.branch-type').textContent.toLowerCase();
        const deliveryStatus = post.querySelector('.delivery-status').textContent.toLowerCase();
        const district = post.querySelector('.district').textContent.toLowerCase();
        const division = post.querySelector('.division').textContent.toLowerCase();

        if (name.includes(filterValue) || branchType.includes(filterValue) || deliveryStatus.includes(filterValue) || district.includes(filterValue) || division.includes(filterValue)) {
            post.style.display = 'inline';
        } else {
            post.style.display = 'none';
        }
    });
});