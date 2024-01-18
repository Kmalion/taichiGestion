import mongoose from 'mongoose';

// Verifica si el modelo 'User' ya está definido
if (!mongoose.modelNames().includes('User')) {
  // Si no está definido, define el modelo 'User'
  const userSchema = new mongoose.Schema(
    {
    
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      nombre: {
        type: String,
        required: true,
      },
      apellido: {
        type: String,
        required: true,
      },
      cargo: {
        type: String,
        required: true,
      },
      foto: {
        type: String,
      },
      role: {
        type: String,
        enum: ['admin', 'user', 'premium'], // Define roles permitidos
        required: true,
      },
      resetToken: {
        type: String,
        required: false,
      },
      resetTokenExpiry: {
        type: Date,
        required: false,
      },
    },
    { timestamps: true }
  );

  const User = mongoose.model('User', userSchema);
}

// Exporta el modelo 'User'
export default mongoose.models.User || mongoose.model('User');
