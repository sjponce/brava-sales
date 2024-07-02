const uploadImageToImgbb = async (imageFile) => {
  const apiKey = 'c3e93becd7397da9778d5c011d0be12e';
  const apiUrl = 'https://api.imgbb.com/1/upload';

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('key', apiKey);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.url;
    }
    throw new Error('Image upload failed');
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default uploadImageToImgbb;
