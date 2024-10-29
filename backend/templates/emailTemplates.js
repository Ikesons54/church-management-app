const welcomeTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Email styles */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: ${CHURCH_CONFIG.colors.primary};
      color: white;
      padding: 20px;
      text-align: center;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 15px;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4a90e2;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${CHURCH_CONFIG.logo.light}" alt="COPABUDHABI" class="logo" />
      <h1>Welcome to ${CHURCH_CONFIG.name.full}</h1>
    </div>
    <div class="content">
      <h2>Dear ${user.firstName},</h2>
      <p>Welcome to The Church Of Pentecost Abu Dhabi family! We're delighted to have you join our community.</p>
      <p>To get started, please verify your email address by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="${user.verificationUrl}" class="button">Verify Email</a>
      </p>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Blessings,<br>${CHURCH_CONFIG.name.full} Team</p>
    </div>
    <div class="footer">
      <p>Contact us: ${CHURCH_CONFIG.contact.email} | ${CHURCH_CONFIG.contact.phone}</p>
      <p>${CHURCH_CONFIG.contact.address}</p>
    </div>
  </div>
</body>
</html>
`;

const eventReminderTemplate = (event, user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Email styles */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Event Reminder</h1>
    </div>
    <div class="content">
      <h2>Hello ${user.firstName},</h2>
      <p>This is a reminder about the upcoming event:</p>
      <div class="event-details">
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.startDate}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
      </div>
      <p style="text-align: center;">
        <a href="${event.detailsUrl}" class="button">View Event Details</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

const donationReceiptTemplate = (donation, user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Email styles */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Donation Receipt</h1>
    </div>
    <div class="content">
      <h2>Hello ${user.firstName},</h2>
      <p>Thank you for your donation!</p>
      <div class="donation-details">
        <h3>${donation.title}</h3>
        <p><strong>Amount:</strong> ${donation.amount}</p>
        <p><strong>Date:</strong> ${donation.date}</p>
      </div>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Blessings,<br>Church Team</p>
    </div>
  </div>
</body>
</html>
`; 