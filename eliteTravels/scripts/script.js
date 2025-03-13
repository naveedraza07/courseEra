let seenEntries = new Set();
let results = [];

function fetchAndSearch(keyword) {
    fetch('scripts/travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load file. Status: ${response.status}`);
            }
            console.log('File loaded successfully');
            return response.json();
        })
        .then(travelData => {

            // check if keyword exists in any object or value for duplication
            function searchInObject(obj) {
                return Object.values(obj).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            
            // Search the main object NAME itself (like "countries", "temples", "beaches")
            if ("countries".includes(keyword.toLowerCase())) {
                travelData.countries.forEach(country => addUniqueResult(country));
            }
            
            if ("temples".includes(keyword.toLowerCase())) {
                travelData.temples.forEach(temple => addUniqueResult(temple));
            }

            if ("beaches".includes(keyword.toLowerCase())) {
                travelData.beaches.forEach(beach => {
                    addUniqueResult(beach);                
                });
            }
            
            
            // Search in countries and their cities
            travelData.countries.forEach(country => {
                if (searchInObject(country)) {
                    addUniqueResult(country);
                }

                country.cities.forEach(city => {
                    if (searchInObject(city)) {
                        addUniqueResult(city);
                    }
                });
            });

            // Search in temples
            travelData.temples.forEach(temple => {
                if (searchInObject(temple)) {
                    addUniqueResult(temple);
                }
            });

            // Search in beaches
            travelData.beaches.forEach(beach => {
                if (searchInObject(beach)) {
                    addUniqueResult(beach);
                }
            });

           // // Display the results
            displayResults(results);
        })
        .catch(error => {
            console.error('Error loading file:', error);
            document.getElementById('results').innerHTML = `<p>Error loading file. Please try again.</p>`;
        });

    // Function to add a result if it's not a duplicate
    function addUniqueResult(item) {
        const uniqueKey = `${item.id}-${item.name}`;
        console.log(uniqueKey);
        console.log(JSON.stringify(seenEntries));
        if (seenEntries != undefined){
         if (!seenEntries.has(uniqueKey)) {
            seenEntries.add(uniqueKey);
            results.push(item);
        }
    }
    else {seenEntries.add(uniqueKey); results.push(item);}
    }
}

// Function to display search results
function displayResults(results) {
    const resultContainer = document.getElementById('results');    

    if (results.length === 0) {
        const div = document.createElement('div');
        div.innerHTML = `
            <hr>
            <p>No results found.</p>
        `;
        resultContainer.appendChild(div);
        return;
    }

    results.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <hr>
            <h3>${item.name}</h3>
            <p>${item.description || ''}</p>
            <img src="${item.imageUrl}" alt="${item.name}" width="200">

        `;
        resultContainer.appendChild(div);
       
    });
    
}

// Event listener for search button
document.getElementById('searchButton').addEventListener('click', function() {
    
    const keyword = document.getElementById('searchInput').value;
    document.getElementById('results').innerHTML='';
    if (keyword.trim() === '') {
        alert('Please enter a search keyword');
        return;
    }
    seenEntries = new Set();
    results = [];
    fetchAndSearch(keyword);
});


function resetPage() {
    document.getElementById('searchInput').value='';
    document.getElementById('results').innerHTML='';

    seenEntries = new Set();
    results = [];  
}

document.getElementById('resetButton').addEventListener('click', resetPage);
