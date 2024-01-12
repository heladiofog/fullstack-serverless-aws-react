import { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';

export default function Images() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    // Image rendering
    fetchImages();
  }, []);

  async function fetchImages(e) {
    /* This function fetches the list of image keys from your S3 bucket */
    const files = await Storage.list('');
    console.log({ files });
    // Once we have the image keys, the images must be signed in order for them to be displayed 
    const signedFiles = await Promise.all(files.results.map(async file => {
      /* To sign the images, we map over the image key array and get a
      signed url for each image */
      const signedFile = await Storage.get(file.key)
      return signedFile
    }));

    setImages(signedFiles);
  }

  async function onChangeFile(e) {
    // When a file is uploaded, create a unique name and save it using the Storage API
    const file = e.target.files[0];
    const filetype = file.name.split('.')[file.name.split.length - 1];
    await Storage.put(`${uuid()}.${filetype}`, file);
    // Once the file has been uploaded, fetch the image list
    fetchImages();
  }

  return (
    <>
      <input type='file' onChange={onChangeFile} />
      <section>
        {
          images?.map(image => (
            <img 
              src={image}
              alt={image}
              key={image}
              style={{ width: 500 }}
            />
          ))
        }
    </section>
    </>
  );
};
