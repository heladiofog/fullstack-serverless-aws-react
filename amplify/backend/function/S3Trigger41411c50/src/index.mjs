import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const S3 = new S3Client();
const IMAGE_WIDTH = 1000; // px

export const handler = async (event, context) => {
  const { eventTime, s3 } = event.Records[0];
  const srcBucket = s3.bucket.name;

  // Next, we get the bucket name and the key from the event. (done)
  // const BUCKET = event.Records[0].s3.bucket.name;
  // const KEY = event.Records[0].s3.object.key;
  // Object key may have spaces or unicode non-ASCII characters
  const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "));
  
  // If the event type is delete, return from the function
  if (event.Records[0].eventName === 'ObjectRemoved:Delete') {
    return event;
  }
  console.log(`${eventTime} - ${srcBucket}/${srcKey}`);

  // Get the image from the source bucket
  try {
    // let image = await s3.getObject({ Bucket: BUCKET, key: KEY }).promise();
    // image =  await sharp(image.Body);
    const { Body, ContentType } = await S3.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      })
    );
    // "Sharp" the image body
    const byteArrayImage = await Body.transformToByteArray();
    const sharpImage = await sharp(byteArrayImage);
    // Get the metadata from the image, including the width and height
    const metadata = await sharpImage.metadata();

    if (metadata.width > 1000) {
      // If the width is greater than 1000, the image is resized
      const resizedImage = await sharpImage.resize({ width: IMAGE_WIDTH }).toBuffer();
      // await s3.putObject({
      //   Bucket: BUCKET,
      //   Body: resizedImage,
      //   Key: KEY
      // }).promise();
      // store/replace new image in the destination bucket
      await S3.send(
        new PutObjectCommand({
          Bucket: srcBucket,
          Key: srcKey,
          Body: resizedImage,
          ContentType,
        })
      );
      const message = `Successfully resized ${srcBucket}/${srcKey} and uploaded to ${srcBucket}/${srcKey}`;
      console.log(message);
      return {
        statusCode: 200,
        body: message,
      };
      // return event;
    } else {
      return event;
    }

    // const { Body, ContentType } = await S3.send(
    //   new GetObjectCommand({
    //     Bucket: srcBucket,
    //     Key: srcKey,
    //   })
    // );
    // const image = await Body.transformToByteArray();
    // // resize image
    // const outputBuffer = await sharp(image).resize(THUMBNAIL_WIDTH).toBuffer();

    // // store new image in the destination bucket
    // await S3.send(
    //   new PutObjectCommand({
    //     Bucket: DEST_BUCKET,
    //     Key: srcKey,
    //     Body: outputBuffer,
    //     ContentType,
    //   })
    // );
    // const message = `Successfully resized ${srcBucket}/${srcKey} and uploaded to ${DEST_BUCKET}/${srcKey}`;
    // console.log(message);
    // return {
    //   statusCode: 200,
    //   body: message,
    // };
  } catch (error) {
    // console.log(error);
    console.log(`Error getting or resizing image file: ${error}`);
    context.fail(`Error getting or resizing image file: ${error}`);
  }
};

/*
// Import the sharp library
console.log(process.env.NODE_PATH);
const sharp = require('sharp');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function (event, context) { //eslint-disable-line
  // Default scaffolding
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const BUCKET = event.Records[0].s3.bucket.name;
  const KEY = event.Records[0].s3.object.key;
  console.log(`Bucket: ${BUCKET}`, `Key: ${KEY}`);
  // End Default scaffolding
  // ****** Book Chapter 06 logic ******
  // If the event type is delete, return from the function
  if (event.Records[0].eventName === 'ObjectRemoved:Delete') {
    return event;
  }
  // Next, we get the bucket name and the key from the event. (done)
  // const BUCKET = event.Records[0].s3.bucket.name;
  // const KEY = event.Records[0].s3.object.key;
  try {
    // Fetch the image data from s3
    let image = await s3.getObject({ Bucket: BUCKET, key: KEY }).promise();
    image =  await sharp(image.Body);

    // Get the metadata from the image, including the width and height
    const metadata = await image.metadata();
    if (metadata.width > 1000) {
      // If the width is greater than 1000, the image is resized
      const resizedImage = await image.resize({ width: 1000 }).toBuffer();
      await s3.putObject({
        Bucket: BUCKET,
        Body: resizedImage,
        Key: KEY
      }).promise();
      return event;
    } else {
      return event;
    }
  } catch (error) {
    console.log(`Error getting or resizing image file: ${error}`);
    context.fail(`Error getting or resizing image file: ${error}`);
  }
};
*/