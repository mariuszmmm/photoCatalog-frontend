const cloudinary = require("./config/cloudinaryConfig");
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME

const handler = async (event) => {

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const archiveResponse = cloudinary.utils.download_zip_url({
      resource_type: "image",
      type: "upload",
      target_format: "zip",
      prefixes: "PhotoCatalog/",
      target_public_id: "images",
    });

    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'PhotoCatalog/'
    });

    const images = response.resources.map((resource) => {
      return {
        name: `${resource.display_name}.${resource.format}`,
        public_id: resource.public_id,
        url: resource.url,
        downloadUrl: `http://res.cloudinary.com/${cloudName}/image/upload/fl_attachment/v${resource.version}/${resource.public_id}.${resource.format}`
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ images, zipUrl: archiveResponse }),
    }
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.toString() }),
    }
  }
}

module.exports = { handler };