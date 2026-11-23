/* Restaurant booking form: validate details and prepare an email.
   This demonstration does not store bookings or confirm reservations. */

const bookingForm = document.getElementById("booking-form");

// Only run this code on pages containing the booking form.
if (bookingForm) {
    const nameInput = document.getElementById("booking-name");
    const emailInput = document.getElementById("booking-email");
    const dateInput = document.getElementById("booking-date");
    const timeInput = document.getElementById("booking-time");
    const guestsInput = document.getElementById("booking-guests");
    const messageInput = document.getElementById("booking-message");
    const submitButton = document.getElementById("booking-submit");
    const statusMessage = document.getElementById("booking-status");

    // Fictional address for the student demonstration.
    const restaurantEmail = "bookings@brickovenpizza.example.com";

    // Build today's date using the visitor's local time.
    function getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Prevent dates before today being selected.
    dateInput.min = getToday();

    // Create a copyable preview for visitors without an email application.
    const previewContainer = document.createElement("div");
    previewContainer.className = "booking-field";
    previewContainer.hidden = true;

    const previewLabel = document.createElement("label");
    previewLabel.htmlFor = "booking-email-preview";
    previewLabel.textContent = "Your booking email preview";

    const preview = document.createElement("textarea");
    preview.id = "booking-email-preview";
    preview.rows = 12;
    preview.readOnly = true;

    previewContainer.append(previewLabel, preview);
    bookingForm.append(previewContainer);

    // Clear previous custom errors when the visitor edits these fields.
    nameInput.addEventListener("input", function () {
        nameInput.setCustomValidity("");
    });

    dateInput.addEventListener("input", function () {
        timeInput.setCustomValidity("");
    });

    timeInput.addEventListener("input", function () {
        timeInput.setCustomValidity("");
    });

    bookingForm.addEventListener("submit", function (event) {
        // Stop the browser refreshing the page or submitting the form.
        event.preventDefault();

        statusMessage.textContent = "";
        previewContainer.hidden = true;

        // Refresh the date limit in case the page was left open overnight.
        dateInput.min = getToday();
        nameInput.setCustomValidity("");
        timeInput.setCustomValidity("");

        // A name containing only spaces should not count as valid.
        if (!nameInput.value.trim()) {
            nameInput.setCustomValidity("Please enter your name.");
        }

        // Check that the chosen date and time are in the future.
        const requestedDateTime = new Date(
            `${dateInput.value}T${timeInput.value}`
        );

        if (requestedDateTime <= new Date()) {
            timeInput.setCustomValidity(
                "Please choose a date and time in the future."
            );
        }

        // Show the browser's validation messages if anything is incorrect.
        if (!bookingForm.reportValidity()) {
            return;
        }

        const customerName = nameInput.value.trim();
        const customerEmail = emailInput.value.trim();
        const customerMessage =
            messageInput.value.trim() || "No additional message.";

        const formattedDate = requestedDateTime.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const subject = "Brick Oven Pizza — table booking request";

        // Join each line to create a readable email message.
        const emailBody = [
            "Hello Brick Oven Pizza,",
            "",
            "I would like to request a table.",
            "",
            `Name: ${customerName}`,
            `Email: ${customerEmail}`,
            `Preferred date: ${formattedDate}`,
            `Preferred time: ${timeInput.value}`,
            `Number of guests: ${guestsInput.value}`,
            "",
            "Additional message:",
            customerMessage,
            "",
            "I understand that this request is not a confirmed booking.",
            "",
            "Student project demonstration — fictional booking."
        ].join("\r\n");

        // Use value rather than innerHTML to display user input as plain text.
        preview.value =
            `To: ${restaurantEmail}\r\nSubject: ${subject}\r\n\r\n${emailBody}`;

        previewContainer.hidden = false;

        statusMessage.textContent =
            "Your email has been prepared. If your email application opens, " +
            "you can review it there. Otherwise, copy the preview below. " +
            "This is a demonstration with a fictional address; no booking " +
            "has been made and nothing has been sent automatically.";

        // Encode special characters so they work correctly in the email link.
        const emailLink =
            `mailto:${restaurantEmail}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(emailBody)}`;

        window.location.href = emailLink;
    });

    // Enable the button only after the form's behaviour has been set up.
    submitButton.disabled = false;
}