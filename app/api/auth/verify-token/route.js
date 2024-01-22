import User from '@/models/User';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';



export const POST = async (request) => {
  const { token } = await request.json();

  let client;

  try {
 

    // Conectar a la base de datos
    client = await connectDB();
    if (!client) {
      throw new Error('Error al conectar a la base de datos');
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now()}
    })

    if(!user){
        return new NextResponse({ message: "Token invalido o expiro" }, { status: 400 });
    }

    return new NextResponse( JSON.stringify(user) , { status: 200 });

  } catch (error) {
    console.error('Error al validar Token:', error);
    return new NextResponse({ message: "Error" }, { status: 400 });
  }
};

