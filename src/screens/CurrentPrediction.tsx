import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Text, Progress } from '@ant-design/react-native';

// Dùng biến môi trường để lấy URL Realtime Database
const DATABASE_URL = `${process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL}/predictions/current.json`;

interface Prediction {
    id: string;
    modelName?: string;
    result?: string;
    confidence?: number;
    lastUpdated?: Date;
}

export const CurrentPrediction = () => {
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchPrediction = async () => {
            try {
                const res = await fetch(DATABASE_URL);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();

                if (data) {
                    setPrediction({
                        ...data,
                        lastUpdated: data.timestamp ? new Date(data.timestamp) : new Date(),
                    });
                    setError(null);
                } else {
                    setPrediction(null);
                    setError("Không tìm thấy dữ liệu dự đoán hiện tại.");
                }
            } catch (err) {
                console.error("Error fetching prediction:", err);
                setError("Lỗi khi tải dữ liệu dự đoán.");
                setPrediction(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
        const interval = setInterval(fetchPrediction, 2000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#108ee9" />
                <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    if (!prediction) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>Không có dữ liệu dự đoán.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Header
                    title="Kết quả dự đoán hiện tại"
                    thumbStyle={{ width: 30, height: 30 }}
                />
                <Card.Body>
                    <View style={styles.content}>
                        <Text style={styles.modelName}>Mô hình: {prediction.modelName || 'N/A'}</Text>
                        <Text style={styles.result}>Kết quả: {prediction.result || 'N/A'}</Text>
                        <View style={styles.confidenceContainer}>
                            <Text>
                                Độ tin cậy: {((prediction.confidence ?? 0) * 100).toFixed(2)}%
                            </Text>
                            <Progress
                                percent={typeof prediction.confidence === 'number' ? prediction.confidence * 100 : 0}
                                style={styles.progress}
                            />
                        </View>
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 16,
    },
    content: {
        padding: 12,
    },
    modelName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    result: {
        fontSize: 16,
        marginBottom: 16,
        color: '#555',
    },
    confidenceContainer: {
        marginBottom: 16,
    },
    progress: {
        marginTop: 8,
        height: 8,
    },
    timestamp: {
        marginTop: 8,
        color: '#888',
        fontSize: 12,
        textAlign: 'right',
    },
});
