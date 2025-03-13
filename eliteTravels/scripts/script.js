let seenEntries = new Set();
let results = [];
// Function to fetch and search data from JSON file
function fetchAndSearch(keyword) {
    fetch('scripts/travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load file. Status: ${response.status}`);
            }
            console.log('File loaded successfully');
            // console.log(response.json());
            return response.json();
        })
        .then(travelData => {
           

            // ✅ To prevent duplicates, create a Set to track id-name pairs
            

            // Function to check if keyword exists in any object or value
            function searchInObject(obj) {
                return Object.values(obj).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            
            // ✅ Step 1: Search the object NAME itself (like "countries", "temples", "beaches")
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
            
            
            // ✅ Step 2: Search in countries and their cities
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

            // ✅ Step 3: Search in temples
            travelData.temples.forEach(temple => {
                if (searchInObject(temple)) {
                    addUniqueResult(temple);
                }
            });

            // ✅ Step 4: Search in beaches
            travelData.beaches.forEach(beach => {
                if (searchInObject(beach)) {
                    addUniqueResult(beach);
                }
            });

           // // ✅ Step 5: Display the results
            displayResults(results);
        })
        .catch(error => {
            console.error('Error loading file:', error);
            document.getElementById('results').innerHTML = `<p>Error loading file. Please try again.</p>`;
        });

    // ✅ Function to add a result if it's not a duplicate
    function addUniqueResult(item) {
        const uniqueKey = `${item.id}-${item.name}`;
        console.log(uniqueKey);
        // console.log(JSON.stringify(seenEntries));
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
    resultContainer.innerHTML = '';

    if (results.length === 0) {
        resultContainer.innerHTML = '<p>No results found.</p>';
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
    resetPage();
    if (keyword.trim() === '') {
        alert('Please enter a search keyword');
        return;
    }
    fetchAndSearch(keyword);
});


function resetPage() {
    document.getElementById('searchInput').value='';
    document.getElementById('results').innerHTML='';

    seenEntries = new Set();
    results = [];  
}

document.getElementById('resetButton').addEventListener('click', resetPage);
