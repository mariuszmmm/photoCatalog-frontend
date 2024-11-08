const cloudinary = require("./config/cloudinaryConfig");
const Item = require("./models/Item");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudFolder = process.env.CLOUDINARY_FOLDER;

const handler = async () => {
  try {
    const resourcesFromArchive = await cloudinary.api.resources_by_asset_folder('test');
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
    for (const resource of resourcesFromArchive.resources) {
      await cloudinary.uploader.upload(resource.secure_url, {
        upload_preset: preset,
        folder: cloudFolder,
        context: `caption=${resource?.context?.custom?.caption || ''} | alt=${resource?.context?.custom?.alt || ''}`,
      });
    };

    const resources = await cloudinary.api.resources_by_asset_folder(cloudFolder);
    console.log(cloudFolder)

    for (const resource of resources.resources) {
      const itemData = {
        header: resource.context?.custom?.caption || "Brak tytułu",
        content: resource.context?.custom?.alt || "Brak opisu",
        image: resource.public_id,
        url: resource.url,
        downloadUrl: `http://res.cloudinary.com/${cloudName}/image/upload/fl_attachment/v${resource.version}/${resource.public_id}.${resource.format}`
      };

      await Item.create(itemData);
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Images copied' }),
    }

  } catch (error) {
    console.error("'copyExampleImages' error: ", error);
  }
}

module.exports = { handler }