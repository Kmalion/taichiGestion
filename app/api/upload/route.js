import { NextResponse } from 'next/server';
import { s3Client, endpoint } from '@/libs/s3Client';
import {v4 as uuid } from 'uuid'
import { PutObjectCommand} from '@aws-sdk/client-s3';


export async function POST(request) {
    try {
        const formData = await request.formData();


        const file = formData.get('file');
        if (!file) {
            return NextResponse.json('No se ha subido ninguna imagen', {
                status: 400
            })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileExtension = file.name.split('.').pop()
        const bucketParams ={
            Bucket: 'taichigestion',
            Key: `${uuid()}.${fileExtension}`,
            Body: buffer,
            ACL: 'public-read'
        }
        const result = await s3Client.send(new PutObjectCommand(bucketParams))

        console.log(result)



        return NextResponse.json({ 
            id: result.ETag,
            url: `${endpoint}/${bucketParams.Bucket}/${bucketParams.Key}`
          });
    } catch (error) {

        console.error('Error al procesar la carga de archivos:', error);
        return NextResponse.json({ error: 'Error al procesar la carga de archivos' }, { status: 500 });
    }
}
