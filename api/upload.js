import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Disallow Next.js/Vercel JSON parsing so formidable can read the multipart stream
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const form = formidable({ multiples: false, keepExtensions: true });

        // Parse the incoming multipart form data containing the image
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Formidable parse error:", err);
                return res.status(500).json({ error: 'Failed to parse form data' });
            }

            const fileArray = files.image || files.file;
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

            if (!file) {
                return res.status(400).json({ error: 'No image file provided in the request body.' });
            }

            try {
                // Ensure ImgBB API key exists
                const imgbbKey = process.env.IMGBB_API_KEY;
                if (!imgbbKey) {
                    return res.status(500).json({ error: 'IMGBB_API_KEY is not configured in .env' });
                }

                // Read the file from disk into a base64 string
                const fileData = fs.readFileSync(file.filepath);
                const base64Image = fileData.toString('base64');

                // Prepare ImgBB payload
                const params = new URLSearchParams();
                params.append('image', base64Image);
                if (file.originalFilename) {
                    params.append('name', file.originalFilename.split('.')[0]); // Send filename without extension
                }

                // Upload to ImgBB
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
                    method: 'POST',
                    body: params
                });

                const data = await response.json();

                // Delete the temporary file from the Vercel server instance
                fs.unlinkSync(file.filepath);

                if (data.success) {
                    return res.status(200).json({
                        success: true,
                        url: data.data.url
                    });
                } else {
                    console.error("ImgBB Upload API Error:", data);
                    return res.status(500).json({ error: data.error?.message || 'ImgBB upload returned failure' });
                }

            } catch (uploadError) {
                console.error("ImgBB Upload Exception:", uploadError);
                fs.unlinkSync(file.filepath); // Ensure temp file is cleaned up on error
                return res.status(500).json({ error: uploadError.message });
            }
        });
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
