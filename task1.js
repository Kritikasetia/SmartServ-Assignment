fetch('https://s3.amazonaws.com/open-to-cors/assignment.json')
    .then(response => response.json())
    .then(data => {
        // Sort the products based on descending popularity
        const sortedProducts = Object.values(data.products).sort((a, b) => b.popularity - a.popularity);

        // Display the sorted data in the table
        const table = document.getElementById('productTable');
        sortedProducts.forEach(product => {
            const row = table.insertRow(-1);
            const titleCell = row.insertCell(0);
            const subcategoryCell = row.insertCell(1);
            const priceCell = row.insertCell(2);
            const popularityCell = row.insertCell(3);

            titleCell.textContent = product.title;
            subcategoryCell.textContent = product.subcategory;
            priceCell.textContent = `$${product.price}`;
            popularityCell.textContent = product.popularity;
        });
    })
    .catch(error => console.error('Error fetching data:', error));
