
import * as tf from '@tensorflow/tfjs';
import * as utils from './utils'

export async function loadMaskModel() {
    return await tf.loadLayersModel(utils.getBaseUrl() + "/models/mask/model.json")
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