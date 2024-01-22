import User from '@/models/User';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs"



export const POST = async (request) => {
  const { password, email } = await request.json();

  let client;

  try {
 

    // Conectar a la base de datos
    client = await connectDB();
    if (!client) {
      throw new Error('Error al conectar a la base de datos');
    }
    
    const existingUser = await User.findOne({email})
    const hashedPassword = await bcrypt.hash(password, 5);
    existingUser.password = hashedPassword
    existingUser.resetToken = undefined
    existingUser.resetTokenExpiry = undefined

    await existingUser.save()

  
    return new NextResponse( {message: "El password ha sido cambiado exitosamente"} , { status: 200 });

  } catch (error) {

    return new NextResponse({ message: "Error" }, { status: 500 });
  }
};

