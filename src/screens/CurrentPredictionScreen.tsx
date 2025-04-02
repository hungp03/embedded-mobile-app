import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Text, Progress } from '@ant-design/react-native';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../../firebaseConfig';

export const CurrentPredictionScreen = () => {
    interface Prediction {
        id: string;
        modelName?: string;
        result?: string;
        confidence?: number;
        lastUpdated?: Date;
    }

    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const dbRef = ref(rtdb, 'predictions/current');

        // Lắng nghe thay đổi real-time của document
        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(data)
                const lastUpdatedDate = data.timestamp || new Date();
    
                setPrediction({
                    ...data,
                    lastUpdated: lastUpdatedDate,
                });
                setError(null); 
            } else {
                console.log("No such data!");
                setPrediction(null); 
                setError("Không tìm thấy dữ liệu dự đoán hiện tại.");
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching prediction: ", err);
            setError("Lỗi khi tải dữ liệu dự đoán.");
            setLoading(false);
            setPrediction(null);
        });
    
        return () => unsubscribe(); // Hủy lắng nghe khi component bị unmount
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
                {/*  */}
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
                        {/* Sử dụng dữ liệu từ state 'prediction' */}
                        <Text style={styles.modelName}>Mô hình: {prediction.modelName || 'N/A'}</Text>
                        <Text style={styles.result}>Kết quả: {prediction.result || 'N/A'}</Text>
                        <View style={styles.confidenceContainer}>
                            <Text>Độ tin cậy:</Text>
                            <Progress      
                                percent={typeof prediction.confidence === 'number' ? prediction.confidence * 100 : 0}
                                style={styles.progress}
                            />
                            <Text style={{ textAlign: 'right', marginTop: 4, color: '#666' }}>
                                {typeof prediction.confidence === 'number' ? `${(prediction.confidence * 100).toFixed(0)}%` : '0%'}
                            </Text>
                        </View>
                        <Text style={styles.timestamp}>
                            Cập nhật lúc: {prediction.lastUpdated instanceof Date ? prediction.lastUpdated.toLocaleString() : 'N/A'}
                        </Text>
                    </View>
                </Card.Body>
            </Card>
            {/*  */}
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