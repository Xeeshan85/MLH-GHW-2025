// let map;
// let markers = [];
// let infoWindow;
// let AdvancedMarkerElement;
// let photosContainer; 
// const errorContainer = document.getElementById('error_container');
// const gallery = document.getElementById('picture-gallery');
const heading = document.getElementById('heading');
const users_city = document.getElementById('city_name').value;
// const summary = document.getElementById('summary');

// function displayError(message, error){ 
//     console.error(message, error); 
//     let user_message = message

//     const error_message = error ? error.toString() : ''; 


//     if (error_message.includes('BillingNotEnabledMapError') || error_message.includes('ApiNotActivatedMapError')){
//         user_message = 'Error: Billing is not Enabled on your Google API account. Please go to the Google Cloud Console, select your project, and ensure it is linked to a valid billing account.'
//     } else if (error_message.includes('InvalidKeyMapError')){
//         user_message = 'Error: You entered an Invalud API Key. Please double check your key in the code.'
//     } else if (error_message.includes('RefererNotAllowedMapError')){
//         user_message = 'Error: Your API key has HTTP referrer restrictions that are blocking the request. For local testing, you can remove these restrictions. For production, add your website\'s domain to the allowed list in the Google Cloud Console.'
//     }

//     heading.textContent = '';
//     summary.textContent = '';

//     error_container.textContent = `${user_message}. Check the browser's dev console for more context on the existing error preventing the successful run of your page.`
//     error_container.classList.remove('hidden'); 
// }


// function displayPictures(place){
//     photosContainer.innerHTML = '';

//     if (!place.photos || place.photos.length === 0) {
//     photosContainer.innerHTML = "<p>No photos found for this location.</p>";
//     return;
//   }

//   place.photos.ForEach(photo => {
//     const img = document.createElement('img'); 
//     img.src = photo.getURI({ maxHeight: 400, maxWidth: 400 });
//     img.alt = `Photo of ${place.displayName}`;
//     img.addEventListener('click', () => {
//       showPostcard(photo.getURI(), place.displayName);
//     });
//     photosContainer.appendChild(img);
//   })
// }

// async function initMap() {
//   try {
//     const { Map, ControlPosition, InfoWindow } = await google.maps.importLibrary("maps");
//     await google.maps.importLibrary("places");
//     ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));

//     map = new Map(document.getElementById('map'), {
//       center: { lat: 48.8566, lng: 2.3522 },
//       zoom: 12,
//       mapId: 'DEMO_MAP_ID',
//       mapTypeControl: false,
//       streetViewControl: false,
//     });

//     infoWindow = new InfoWindow();

//     const toggleContentBtn = document.createElement('button');
//     toggleContentBtn.innerHTML = '<span class="material-icons">visibility</span>';
//     toggleContentBtn.classList.add('map-control-button');
//     toggleContentBtn.title = 'Hide content panel';

//     if (ControlPosition && ControlPosition.TOP_RIGHT) {
//         map.controls[ControlPosition.TOP_RIGHT].push(toggleContentBtn);
//     } else {
//         console.error('ControlPosition.TOP_RIGHT is undefined. Ensure the Google Maps library is loaded correctly.');
//     }

//     const container = document.getElementById('container');
//     toggleContentBtn.addEventListener('click', () => {
//       container.classList.toggle('content-hidden');
//       const icon = toggleContentBtn.querySelector('.material-icons');
//       if (container.classList.contains('content-hidden')) {
//         icon.textContent = 'visibility_off';
//         toggleContentBtn.title = 'Show content panel';
//       } else {
//         icon.textContent = 'visibility';
//         toggleContentBtn.title = 'Hide content panel';
//       }
//       google.maps.event.trigger(map, 'resize');
//     });

//     const placeAutocomplete = document.getElementById('place-autocomplete');
//     placeAutocomplete.addEventListener('gmp-select', async (event) => {
//         const place = event.place;
//         if (!place) return;

//         clearMarkers();
//         gallery.innerHTML = '';
//         heading.textContent = 'Loading...';
//         summary.textContent = '';
//         errorContainer.classList.add('hidden');

//         try {
//             await place.fetchFields({ fields: ['displayName', 'photos', 'editorialSummary', 'location'] });

//             heading.textContent = place.displayName;
//             summary.textContent = place.editorialSummary?.text || '';

//             if (place.location) {
//                 map.setCenter(place.location);
//                 map.setZoom(12);
//                 addMarker(place);
//             }

//             displayPictures(place); 

//             }catch (error) {
//             displayError(`Failed to fetch details for "${place.displayName || 'the selected location'}".`, error);
//         }
//     });

//     await searchForPlace('Paris, France');

//     const modal = document.getElementById('modal');
//     const span = document.getElementsByClassName('close');
//     span.onclick = function() {
//       modal.style.display = "none";
//     }
//   } catch (error) {
//     displayError('The Google Maps JavaScript API could not load.', error);
//   }
// }

// initMap();

document.getElementById("submit_button").addEventListener('click', function() {
    const users_city = document.getElementById('city_name').value;
    const iframe = document.getElementById("map_iframe").src;
    updateCity(users_city, iframe);
});

function updateCity(users_city, iframe){
    if (!users_city) return;
    heading.innerText = users_city;
    if (!iframe) return;
    iframe = iframe.split('&q=')[0] + `&q=${users_city}`;
}