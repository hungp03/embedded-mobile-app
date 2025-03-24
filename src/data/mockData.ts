import { Prediction, CurrentPrediction } from '../types';

export const mockCurrentPrediction: CurrentPrediction = {
    modelName: "ResNet50",
    result: "Cat",
    confidence: 0.95,
    lastUpdated: new Date().toISOString()
};

export const mockPredictions: Prediction[] = [
    {
        id: "1",
        modelName: "ResNet50",
        result: "Cat",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        confidence: 0.95
    },
    {
        id: "2",
        modelName: "VGG16",
        result: "Dog",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        confidence: 0.88
    },
    {
        id: "3",
        modelName: "InceptionV3",
        result: "Bird",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        confidence: 0.92
    },
    {
        id: "4",
        modelName: "ResNet50",
        result: "Cat",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        confidence: 0.95
    },
    {
        id: "5",
        modelName: "VGG16",
        result: "Dog",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        confidence: 0.88
    },
    {
        id: "6",
        modelName: "InceptionV3",
        result: "Bird",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        confidence: 0.92
    }
]; 