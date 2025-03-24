import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Progress } from '@ant-design/react-native';
import { mockCurrentPrediction } from '../data/mockData';

export const CurrentPredictionScreen = () => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Header
                    title="Kết quả dự đoán hiện tại"
                    thumbStyle={{ width: 30, height: 30 }}
                />
                <Card.Body>
                    <View style={styles.content}>
                        <Text style={styles.modelName}>Mô hình: {mockCurrentPrediction.modelName}</Text>
                        <Text style={styles.result}>Kết quả: {mockCurrentPrediction.result}</Text>
                        <View style={styles.confidenceContainer}>
                            <Text>Độ tin cậy:</Text>
                            <Progress
                                percent={mockCurrentPrediction.confidence * 100}
                                style={styles.progress}
                            />
                        </View>
                        <Text style={styles.timestamp}>
                            Cập nhật lúc: {new Date(mockCurrentPrediction.lastUpdated).toLocaleString()}
                        </Text>
                    </View>
                </Card.Body>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginBottom: 16,
    },
    content: {
        padding: 8,
    },
    modelName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    result: {
        fontSize: 16,
        marginBottom: 16,
    },
    confidenceContainer: {
        marginBottom: 16,
    },
    progress: {
        marginTop: 8,
    },
    timestamp: {
        color: '#666',
        fontSize: 12,
    },
}); 