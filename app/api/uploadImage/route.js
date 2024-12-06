import fs from 'fs';
import { cookies } from 'next/headers';
import path from 'path';
import { fetchData, updateData } from '../../helpers/DB';

export const config = {
  api: {
    bodyParser: false,  // Disable the default body parser
  },
};

export async function POST(req) {
  // Check if the request content type is multipart/form-data
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.startsWith('multipart/form-data')) {
    return new Response('Invalid Content-Type', { status: 400 });
  }

  try {
    // Use FormData to parse the form
    const formData = await req.formData();

    // Get the file from the formData object
    const file = formData.get('file');
    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }


    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    session = JSON.parse(session.value);

    const buffer = await file.arrayBuffer();
    const fileName = session.userId + path.extname(file.name);
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Create the upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file to the uploads folder

    if (file.size > 5 * 1024 * 1024) {  // 5MB limit
      return new Response('File is too large', { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return new Response('Invalid file type', { status: 400 });
    }

    const filePath = path.join(uploadDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);  // Delete the old file
    }
    fs.writeFileSync(filePath, Buffer.from(buffer));
    // fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(buffer));

    const user = (await fetchData('taya_user', { "userId": { $eq: session.userId } }))[0]
    user['id'] = `/uploads/${fileName}`
    user.status = "PENDING"

    const updateResult = await updateData('taya_user', { 'userId': { $eq: session.userId } }, user);

    return new Response(
      JSON.stringify({ message: 'File uploaded successfully', filePath: `/uploads/${fileName}` }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during file upload:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
