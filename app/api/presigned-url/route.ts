import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

const client = new S3Client({
    region: process.env.AWS_REGION,
    // credentials: {
    //     accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // },
});

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const file = searchParams.get("file");

    if (!file) {
        return Response.json(
            { error: "File query parameter is required" },
            { status: 400 }
        );
    }

    console.log(file);

    const command = new PutObjectCommand({
        Bucket: process.env.ASU_ID + '-input',
        Key: file,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 60 });

    console.log(Response.error)
    console.log(Response.json)
    console.log(Response.redirect);
    console.log(url)
    return Response.json({ presignedUrl: url });
}