const accessKey = "YOUR_ACCESS_KEY";     // Keep your access key private

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search-input');
const searchIcon = document.querySelector('.material-icons');
const imagesContainer = document.querySelector('.images-container');
const loadMoreBtn = document.querySelector('.loadMoreBtn');

let page = 1;

// Function to fetch images using Unsplash API
const fetchImages = async (query, pageNo) => {
    try {
        if (pageNo === 1) {
            imagesContainer.innerHTML = '';
        }

        const url = `https://api.unsplash.com/search/photos/?query=${query}&per_page=28&page=${pageNo}&client_id=${accessKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            data.results.forEach(photo => {
                // Creating image container
                const imageElement = document.createElement('div');
                imageElement.classList.add('imageDiv');

                // Adding image and overlay elements
                imageElement.innerHTML = `
                    <img src="${photo.urls.regular}" alt="${photo.alt_description || 'Image'}">
                    <div class="overlay">
                        <h3>${photo.alt_description || 'No description'}</h3>
                    </div>
                    <button class="download-btn">⬇ Download</button>
                `;

                // Adding the image to the container
                imagesContainer.appendChild(imageElement);

                // Adding event listener to the download button
                const downloadBtn = imageElement.querySelector('.download-btn');
                downloadBtn.addEventListener('click', () => downloadImage(photo.urls.full));
            });

            // Hide "Load More" button if it's the last page
            if (data.total_pages === pageNo) {
                loadMoreBtn.style.display = "none";
            } else {
                loadMoreBtn.style.display = "block";
            }
        } else {
            imagesContainer.innerHTML = `<h2>No images found</h2>`;
            loadMoreBtn.style.display = "none";
        }

    } catch (error) {
        console.error("Error fetching images:", error);
        imagesContainer.innerHTML = `<h2>Failed to fetch images. Try again later.</h2>`;
    }
};

// Function to trigger the image download using Blob
const downloadImage = async (imageUrl) => {
    try {
        // Fetch image as a Blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Creating  a temporary download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = imageUrl.split('/').pop(); // Extract filename from the URL
        link.click();
        
        // Cleanup after download
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

// Adding event listener to search form
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = searchInput.value.trim();
    if (inputText !== '') {
        page = 1;
        fetchImages(inputText, page);
        document.querySelector('header').classList.add('header-up');

    } else {
        imagesContainer.innerHTML = `<h2>Enter a search query</h2>`;
        loadMoreBtn.style.display = "none";
    }
});

// Allow clicking the search icon to trigger the form submission,
// just like when you press Enter inside the input field.
searchIcon.addEventListener('click', () => {
    searchForm.dispatchEvent(new Event('submit'));
});


// Adding event listener to load more button
loadMoreBtn.addEventListener('click', () => {
    fetchImages(searchInput.value.trim(), ++page);
});
