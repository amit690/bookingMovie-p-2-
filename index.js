document.getElementById('booking-details').addEventListener('submit', (event) => {
    event.preventDefault();
    const bookingDetails = {
        name: document.getElementById('name').value,
        sitNumber: document.getElementById('sitNumber').value
    };

    // Check if the sit number is already booked
    axios.get("https://crudcrud.com/api/5ee59b2b06ee4d3392416e876bd0df46/booking")
        .then((response) => {
            const bookings = response.data;
            const sitNumberExists = bookings.some(booking => booking.sitNumber == bookingDetails.sitNumber);

            if (sitNumberExists) {
                alert('Sit number is already booked.');
            } else {
                axios.post("https://crudcrud.com/api/5ee59b2b06ee4d3392416e876bd0df46/booking", bookingDetails)
                    .then((response) => {
                        displayOnScreen(response.data);
                        updateTotalBookings();
                    })
                    .catch((error) => handleError(error));
                // Clearing input fields
                document.getElementById('name').value = "";
                document.getElementById('sitNumber').value = "";
            }
        })
        .catch((error) => handleError(error));
});

document.getElementById('slot-form').addEventListener('input', (event) => {
    const slotNumber = event.target.value;
    if (slotNumber) {
        axios.get(`https://crudcrud.com/api/5ee59b2b06ee4d3392416e876bd0df46/booking`)
            .then((response) => {
                const filteredBookings = response.data.filter(booking => booking.sitNumber == slotNumber);
                displayFilteredBookings(filteredBookings);
            })
            .catch((error) => handleError(error));
    } else {
        axios.get(`https://crudcrud.com/api/5ee59b2b06ee4d3392416e876bd0df46/booking`)
            .then((response) => {
                displayAllBookings(response.data);
            })
            .catch((error) => handleError(error));
    }
});

function displayOnScreen(bookingDetails) {
    const tableBody = document.getElementById('table-body');

    const row = document.createElement('tr');
    row.setAttribute('data-id', bookingDetails._id);

    const nameCell = document.createElement('td');
    nameCell.textContent = bookingDetails.name;
    row.appendChild(nameCell);

    const sitNumberCell = document.createElement('td');
    sitNumberCell.textContent = bookingDetails.sitNumber;
    row.appendChild(sitNumberCell);

    const actionsCell = document.createElement('td');
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.onclick = () => {
        deleteBooking(bookingDetails._id, row);
    };
    actionsCell.appendChild(deleteBtn);
    
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-secondary btn-sm';
    editBtn.onclick = () => {
        editBooking(bookingDetails);
    };
    actionsCell.appendChild(editBtn);

    row.appendChild(actionsCell);

    tableBody.appendChild(row);
}

function deleteBooking(id, row) {
    axios.delete(`https://crudcrud.com/api/5ee59b2b06ee4d3392416e876bd0df46/booking/${id}`)
        .then(() => {
            row.remove();
            updateTotalBookings();
        })
        .catch((error) => handleError(error));
}

function editBooking(bookingDetails) {
    document.getElementById('name').value = bookingDetails.name;
    document.getElementById('sitNumber').value = bookingDetails.sitNumber;

    deleteBooking(bookingDetails._id, document.querySelector(`tr[data-id="${bookingDetails._id}"]`));
}

function displayFilteredBookings(bookings) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table

    bookings.forEach(booking => {
        displayOnScreen(booking);
    });
}

function displayAllBookings(bookings) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table

    bookings.forEach(booking => {
        displayOnScreen(booking);
    });
    updateTotalBookings(bookings.length);
}

// Fetch existing bookings on page load and display them
document.addEventListener('DOMContentLoaded', () => {
    axios.get("https://crudcrud.com/api/5ee59b2b06ee4d3392416e876bd0df46/booking")
        .then((response) => {
            displayAllBookings(response.data);
        })
        .catch((error) => handleError(error));
});

function updateTotalBookings(count) {
    document.getElementById('total-booking').textContent = count || document.querySelectorAll('#table-body tr').length;
}

function handleError(error) {
    if (error.response) {
        console.log('Server responded with a status other than 2xx:', error.response.data);
    } else if (error.request) {
        console.log('The request was made but no response was received:', error.request);
    } else {
        console.log('Something happened in setting up the request that triggered an Error:', error.message);
    }
    console.log('Config:', error.config);
}
