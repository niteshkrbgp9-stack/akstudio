# Capture Creation Studio - Website

A modern, responsive wedding photography website for Capture Creation Studio, Bhagalpur.

## Features

✨ **Modern Design**
- Responsive and mobile-friendly layout
- Smooth animations and transitions
- Professional color scheme
- Fast loading

📦 **Complete Packages Section**
- 1-Day Wedding Package (₹1,00,000)
- 3-Day Wedding Package (₹1,20,000 - Special Offer)
- Customized Packages
- Detailed service breakdowns

📸 **Gallery**
- Beautiful image grid
- Hover effects
- Professional wedding photography showcase

📅 **Booking System**
- Easy-to-use booking form
- Special date picker
- Package selection
- Form validation

💬 **Contact Integration**
- Phone contact
- WhatsApp direct messaging
- Email support
- Location map
- Testimonials section

## File Structure

```
camera/
├── index.html      (Main HTML file)
├── styles.css      (Complete styling)
├── script.js       (Interactivity & form handling)
├── README.md       (This file)
└── package.json    (For optional backend setup)
```

## Local Setup

Simply open `index.html` in your web browser. No server required for basic functionality!

```bash
# Option 1: Double-click index.html
# Option 2: Use VS Code Live Server Extension
# Option 3: Use Python's built-in server
python -m http.server 8000
```

## Deployment to Free Servers

### 1. **Netlify (Recommended for Beginners)**
- Go to https://netlify.com
- Drag & drop your files folder
- Your site goes live instantly!
- Free SSL certificate included
- Custom domain support

#### Steps:
1. Create Netlify account (free)
2. Drag this folder to Netlify
3. Site will be live in seconds!

### 2. **Vercel**
- Sign up at https://vercel.com
- Connect your GitHub repository
- Automatic deployments with every push
- Free tier very generous

#### Steps:
1. Push files to GitHub
2. Import project to Vercel
3. Done! Auto-deployed with SSL

### 3. **GitHub Pages**
- Push to GitHub repository
- Enable GitHub Pages in settings
- Free hosting with your GitHub account

#### Steps:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/camera.git
git push -u origin main
```

### 4. **Firebase Hosting**
- Very fast and reliable
- Free tier includes 1 project

#### Steps:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. `firebase init`
3. `firebase deploy`

### 5. **Cloudflare Pages**
- Sign up at https://pages.cloudflare.com
- Connect GitHub repository
- Instant deployments

## Email Integration (For Bookings)

### Option 1: FormSubmit.co (Easiest)
1. No account required
2. Modify the `sendToEmailService()` function in `script.js`
3. Replace email in the form action

### Option 2: Firebase Cloud Functions
```bash
npm install firebase-functions firebase-admin
firebase init functions
```

### Option 3: EmailJS
1. Sign up at https://www.emailjs.com
2. Connect your email service
3. Add EmailJS SDK to HTML

```html
<script type="text/javascript"
    src="https://cdn.emailjs.com/sdk/3.11.0/email.min.js"></script>
```

## Backend Setup (Optional)

For booking confirmation emails, follow one of these:

### Using Node.js + Express (Advanced)

```bash
npm install express body-parser nodemailer
```

See `server.js` for full setup.

## Features Explanation

### 1. Responsive Design
- Works perfectly on desktop, tablet, and mobile
- Mobile menu hamburger for navigation
- Touch-friendly buttons

### 2. Booking Form
- Collects all relevant information
- Validates required fields
- Stores locally in browser storage
- Can be sent to email service

### 3. Image Gallery
- Lazy loading for fast performance
- Beautiful hover effects
- Responsive grid layout

### 4. Testimonials
- Social proof with 5-star ratings
- Client success stories
- Professional presentation

### 5. SEO Optimized
- Meta tags included
- Proper heading hierarchy
- Mobile viewport configured
- Open Graph tags ready

## Customization Guide

### Change Studio Details
Edit `index.html`:
- Company name: Search for "Capture Creation Studio"
- Phone number: Update in contact section
- WhatsApp link: Update with your number
- Email: Add your email address

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary-color: #e74c3c;    /* Main red color */
    --secondary-color: #c0392b;  /* Darker red */
    --accent-color: #f39c12;     /* Orange accent */
}
```

### Change Package Prices
Edit `index.html` in the packages section:
```html
<span class="offer">Offer: ₹1,20,000</span>
```

### Add More Gallery Images
Replace image URLs in gallery section:
```html
<img src="YOUR_IMAGE_URL" alt="Description">
```

## Performance Tips

1. **Optimize Images**
   - Use WebP format when possible
   - Compress images: https://tinypng.com

2. **Caching**
   - Set cache headers on server
   - Browser caching enabled by default

3. **CDN**
   - Use Cloudflare free CDN
   - Automatically caches static files

## SEO Optimization

1. Meta description is set
2. Proper heading tags (H1, H2, H3)
3. Image alt text included
4. Mobile responsive
5. Fast loading times

You can test with:
- Google PageSpeed Insights
- GTmetrix
- Mobile-Friendly Test

## Analytics Setup

Add Google Analytics:

```html
<!-- In <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Troubleshooting

### Form not submitting?
- Check browser console for errors (F12)
- Verify email configuration
- Test with localStorage enabled

### Images not loading?
- Check image URLs in HTML
- Verify CORS if using external images
- Test image URLs in browser

### Mobile menu not working?
- Clear browser cache
- Check if JavaScript is enabled
- Try different browser

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This website is created for Capture Creation Studio, Bhagalpur. All rights reserved.

## Support

For issues or customizations:
- Check the code comments
- Review the CSS/JS structure
- Test on different devices
- Check browser console (F12)

## Future Enhancements

- [ ] Payment integration (Razorpay/PayPal)
- [ ] Booking confirmation emails
- [ ] Admin dashboard
- [ ] Client portal
- [ ] Image upload gallery
- [ ] Video showcase section
- [ ] Blog/News section
- [ ] Team member profiles

---

**Made with ❤️ for Capture Creation Studio**
