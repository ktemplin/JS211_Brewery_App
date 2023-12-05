// require('dotenv').config()

let longitude = ''
let latitude = ''

const locOptions = {
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;

    latitude = crd.latitude
    longitude = crd.longitude

    // console.log("Your current position is:");
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);

    fetchPubs(latitude, longitude)
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    return
}

navigator.geolocation.getCurrentPosition(success, error, locOptions);

// const successCallback = (position) => {
//     console.log(position);
//   };
  
//   const errorCallback = (error) => {
//     console.log(error);
//   };
  
//   navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


const fetchPubs = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=5`,
            {
                method: 'GET',
                contentType: 'application/json'
            });

        if (response.ok) {
            brewData = await response.json();
            // console.log(brewData)
            displayBreweries(brewData);
        }
    } catch (error) {
        console.error(error);
    }
};

const displayBreweries = (breweries) => {
    const breweryListContainer = document.getElementById('breweryList');

    breweries.forEach(brewery => {
        const breweryItem = document.createElement('div');
        breweryItem.innerHTML = `
        <div>
            <p><strong>${brewery.name}</strong></p>
            <p>Type: ${brewery.brewery_type}</p>
            <p>Address: ${brewery.address_1}, ${brewery.city}, ${brewery.state_province} ${brewery.postal_code}</p>
            <p>Phone: ${brewery.phone}</p>
            <p>Website: <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
            <p>
                <span class="heart heart-empty" onclick="toggleHeart(this)"></span>
            </p>
        </div>
        `;
        breweryListContainer.appendChild(breweryItem);
    });
};

function toggleHeart(element) {
    element.classList.toggle('heart-empty');
    element.classList.toggle('heart-filled');
}


document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('heart')) {
        // Handle marking the brewery as a favorite (you can update UI here)
        console.log('Heart clicked!');
    }
});

