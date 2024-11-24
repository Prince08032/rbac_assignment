import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true
  }]
}, {
  timestamps: true
});

// Add index for better query performance
RoleSchema.index({ name: 1 });

// Add middleware to populate permissions on find
RoleSchema.pre(['find', 'findOne'], function() {
  this.populate('permissions');
});

// Add validation to check if permissions exist
RoleSchema.pre('save', async function(next) {
  if (this.isModified('permissions')) {
    const Permission = mongoose.model('Permission');
    const permissionIds = this.permissions;
    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    
    if (permissions.length !== permissionIds.length) {
      next(new Error('One or more permission IDs are invalid'));
    }
  }
  next();
});

export default mongoose.models.Role || mongoose.model('Role', RoleSchema); 