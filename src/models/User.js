import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Please provide at least one role']
  }],
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  status: {
    type: String,
    required: [true, 'Please provide a status'],
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ roles: 1 });

// Add middleware to populate roles and permissions on find
UserSchema.pre(['find', 'findOne'], function() {
  this.populate('roles').populate('permissions');
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 