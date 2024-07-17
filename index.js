// Function for getting booking details from the server
async function getBookingDetails() {
    try {
        const response = await axios.get("https://crudcrud.com/api/49a6016d17ea44cfb035b2c9c52b7133/booking");
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

// Function for posting and updating the table and total booking count
async function postBookingDetails(bookingDetails, updateTotalBookings) {
    try {
        const response = await axios.post("https://crudcrud.com/api/49a6016d17ea44cfb035b2c9c52b7133/booking", bookingDetails);
        displayOnScreen(response.data);
        updateTotalBookings();
    } catch (error) {
        console.log(error);
    }
}

// Deleting specific booking details and updating table and total booking count
async function deleteBookingDetails(id, row, updateTotalBookings) {
    try {
        await axios.delete(`https://crudcrud.com/api/49a6016d17ea44cfb035b2c9c52b7133/booking/${id}`);
        row.remove();
        updateTotalBookings();
    } catch (error) {
        console.log(error);
    }
}

// Handling main form submit
document.getElementById('booking-details').addEventListener('submit', async (event) => {
    event.preventDefault();
    const bookingDetails = {
        name: document.getElementById('name').value,
        sitNumber: document.getElementById('sitNumber').value
    };

    // Check if the sit number is already booked
    const bookings = await getBookingDetails();
    const sitNumberExists = bookings.some(booking => booking.sitNumber == bookingDetails.sitNumber);

    if (sitNumberExists) {
        alert('Sit number is already booked.');
    } else {
        postBookingDetails(bookingDetails, updateTotalBookings);
        // Clearing input fields
        document.getElementById('name').value = "";
        document.getElementById('sitNumber').value = "";
    }
});

// Filtering bookings by slot number
document.getElementById('slot-form').addEventListener('input', async (event) => {
    const slotNumber = event.target.value;
    const bookings = await getBookingDetails();
    if (slotNumber) {
        const filteredBookings = bookings.filter(booking => booking.sitNumber == slotNumber);
        displayFilteredBookings(filteredBookings);
    } else {
        displayAllBookings(bookings);
    }
});

// Display booking details on the screen
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
    deleteBtn.onclick = async () => {
        await deleteBookingDetails(bookingDetails._id, row, updateTotalBookings);
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

// Edit booking details
async function editBooking(bookingDetails) {
    document.getElementById('name').value = bookingDetails.name;
    document.getElementById('sitNumber').value = bookingDetails.sitNumber;

    await deleteBookingDetails(bookingDetails._id, document.querySelector(`tr[data-id="${bookingDetails._id}"]`), updateTotalBookings);
}

// Display filtered bookings
function displayFilteredBookings(bookings) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table

    bookings.forEach(booking => {
        displayOnScreen(booking);
    });
}

// Display all bookings
function displayAllBookings(bookings) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table

    bookings.forEach(booking => {
        displayOnScreen(booking);
    });
    updateTotalBookings(bookings.length);
}

// Fetch existing bookings on page load and display them
document.addEventListener('DOMContentLoaded', async () => {
    displayAllBookings(await getBookingDetails());
});

// Update the total number of bookings
function updateTotalBookings(count) {
    document.getElementById('total-booking').textContent = count || document.querySelectorAll('#table-body tr').length;
}
