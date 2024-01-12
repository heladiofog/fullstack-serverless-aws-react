# Notes for some of the book chapters

## Ch 06 - (Auth/Add User To Gruop && Resizing Images) through Lambdas

En este capítulo fue particularmente difñicil adaptar la función lambda para redimensionar las imágenes. Se batalló bastante con la instalación de "sharp". Se usaron los siguientes comandos para la instalación final, esto en ambiente MacOS:

  - "install": "npm install --arch=x64 --platform=linux --target=18x sharp",
  ```bash
    npm install --arch=x64 --platform=linux --target=18x sharp
  ````
  - "rebuild": "npm rebuild --platform=linux --arch=x64 sharp"
  ```bash
    npm rebuild --platform=linux --arch=x64 sharp
  ```
En parte basados en el post último de [stackoverflow](https://stackoverflow.com/questions/70487565/something-went-wrong-installing-the-sharp-on-aws-lambda) y la [documentación de AWS](https://docs.aws.amazon.com/lambda/latest/dg/with-s3-tutorial.html#with-s3-tutorial-create-function-package) de un ejercicio parecido. Al igual que el siguiente video de [Youtube](https://www.youtube.com/watch?v=QFgJFoS_Hl0).
Lo más importante es revisar las compatibilidades con lambdas y las herramientas usadas como **sharp**.