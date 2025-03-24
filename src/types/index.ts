export interface Prediction {
    id: string;
    modelName: string;
    result: string;
    timestamp: string;
    confidence: number;
}

export interface CurrentPrediction {
    modelName: string;
    result: string;
    confidence: number;
    lastUpdated: string;
} 