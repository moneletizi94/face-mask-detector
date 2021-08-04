
import * as tf from '@tensorflow/tfjs';

export async function loadMaskModel() {
    let url = "MASK_MODEL_URL" in process.env
            ? process.env["MASK_MODEL_URL"] 
            : 'http://localhost:8080'
    
    return await tf.loadLayersModel(url + "/models/mask/model.json")
}

const offset = tf.scalar(127.5);

function preprocessImage(image) {

    // resize the input image to mobilenet's target size of (224, 224)
    return tf.tidy(() => {
        return tf.browser.fromPixels(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .sub(offset)
            .div(offset)
            .expandDims()
    })
}

export async function predict(model, image) {
    let prediction;
    
    tf.tidy(() => {
        let imageResized = preprocessImage(image)
        prediction = model.predict(imageResized).data()
    })
    return prediction
}