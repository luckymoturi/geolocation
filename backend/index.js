const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/delivery-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Address Schema
const addressSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  type: { type: String, enum: ['home', 'office', 'friends', 'other'] },
  houseNo: String,
  area: String,
  fullAddress: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now },
});

const Address = mongoose.model('Address', addressSchema);

// Routes
app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await Address.find().sort({ createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/addresses', async (req, res) => {
  try {
    const newAddress = new Address({
      ...req.body,
      id: uuidv4(),
    });
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/addresses/:id', async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  try {
    await Address.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;