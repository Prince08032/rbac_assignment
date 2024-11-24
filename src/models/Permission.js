import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  module: {
    type: String,
    required: [true, 'Please provide a module'],
    enum: ['Core', 'Users', 'Content', 'Settings']
  }
}, {
  timestamps: true
});

export default mongoose.models.Permission || mongoose.model('Permission', PermissionSchema); 