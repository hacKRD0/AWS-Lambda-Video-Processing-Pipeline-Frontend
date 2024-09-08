// pages/api/proxy-upload.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false
    }
}

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const presignedUrl = formData.get('presignedUrl') as string;
        const file = formData.get('file') as Blob;

        // console.log('formData', formData);
        console.log('PresignedUrl: ', presignedUrl);
        console.log('File: ', file);

        // Fetch the file and upload it to S3 using the presigned URL
        const s3UploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': 'true', // Required for cookies, authorization headers with HTTPS
            },
            body: file,
        });

        console.log('S3UploadResponse: ', s3UploadResponse);

        if (!s3UploadResponse.ok) {
            return NextResponse.json({ error: `Failed to upload file to S3 : ${s3UploadResponse.error}` }, { status: 500 });
        }

        return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error uploading file' });
    }
}
