const adminRoutes = require('./routes/adminRoutes');
const offerLetterRoutes = require('./routes/offerLetterRoutes');
// ... other requires

// Register the routes
app.use('/admin', adminRoutes);
app.use('/api/offer-letters', offerLetterRoutes); 