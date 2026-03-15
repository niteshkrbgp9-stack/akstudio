// Optional: Backend Server for Email Integration
// To use this, run: npm install && node server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Email Configuration
// IMPORTANT: Set these environment variables or update directly
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your-app-password';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'info@capturecreation.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

// Routes

// Home route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// Booking submission endpoint
app.post('/api/submit-booking', async (req, res) => {
    const { name, email, phone, eventDate, packageType, location, message } = req.body;

    // Validate input
    if (!name || !email || !phone || !eventDate || !packageType || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Email to admin
        const adminMailOptions = {
            from: EMAIL_USER,
            to: RECIPIENT_EMAIL,
            subject: `New Booking Request - ${name}`,
            html: `
                <h2>New Booking Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Event Date:</strong> ${eventDate}</p>
                <p><strong>Package:</strong> ${packageType}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Additional Message:</strong></p>
                <p>${message || 'None'}</p>
                <hr>
                <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
            `
        };

        // Email to client
        const clientMailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Booking Confirmation - Capture Creation Studio',
            html: `
                <h2>Thank You for Your Booking Request!</h2>
                <p>Dear ${name},</p>
                <p>We have received your booking request for the following:</p>
                <ul>
                    <li><strong>Package:</strong> ${packageType}</li>
                    <li><strong>Event Date:</strong> ${eventDate}</li>
                    <li><strong>Location:</strong> ${location}</li>
                </ul>
                <p>Our team will contact you within 24 hours to confirm your booking and discuss the details.</p>
                <hr>
                <h3>Contact Information</h3>
                <p>📞 Phone: +91-80808-08080</p>
                <p>💬 WhatsApp: <a href="https://wa.me/918080808080">Click to Message</a></p>
                <p>📧 Email: info@capturecreation.com</p>
                <p>📍 Location: Sabour, Bhagalpur (Bihar), India</p>
                <hr>
                <p>Best regards,<br><strong>Capture Creation Studio</strong></p>
            `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(clientMailOptions);

        res.json({
            success: true,
            message: 'Booking request submitted successfully! Check your email.'
        });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({
            error: 'Error submitting booking. Please try again or contact us directly.'
        });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const mailOptions = {
            from: EMAIL_USER,
            to: RECIPIENT_EMAIL,
            subject: `Contact Form - ${name}`,
            html: `
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile('index.html', { root: __dirname });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║   Capture Creation Studio Server Started             ║
    ╠═══════════════════════════════════════════════════════╣
    ║   Listen on: http://localhost:${PORT}                      ║
    ║                                                       ║
    ║   📸 Wedding Photography Services                     ║
    ║   📍 Sabour, Bhagalpur (Bihar), India                 ║
    ║                                                       ║
    ║   Note: Email configuration required                 ║
    ║   Set environment variables:                         ║
    ║   - EMAIL_USER (Gmail)                               ║
    ║   - EMAIL_PASSWORD (App Password)                    ║
    ║   - RECIPIENT_EMAIL (admin@...)                      ║
    ╚═══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
