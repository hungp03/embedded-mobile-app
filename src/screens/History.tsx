import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Text, Progress } from '@ant-design/react-native';
import { rtdb } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export const History = () => {
    interface HistoryItem {
        id: string;
        modelName: string;
        result: string;
        confidence: number;
        timestamp: Date;
    }

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const historyRef = ref(rtdb, 'predictions/history');
        const unsubscribe = onValue(historyRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(data)
                const historyArray = Object.keys(data).map(id => ({
                    id,
                    ...data[id],
                    timestamp: data[id].timestamp ? new Date(data[id].timestamp) : new Date(),
                }));

                // Sắp xếp lịch sử theo thời gian (mới nhất trước)
                historyArray.sort((a, b) => b.timestamp - a.timestamp);

                setHistory(historyArray);
                setError(null);
            } else {
                setHistory([]);
                setError("Không có lịch sử dự đoán.");
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching history: ", err);
            setError("Lỗi khi tải lịch sử.");
            setLoading(false);
            setHistory([]);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }: { item: HistoryItem }) => (
        console.log(item),
        <Card style={styles.card}>
            <Card.Body>
                <View style={styles.content}>
                    <Text style={styles.modelName}>Mô hình: {item.modelName}</Text>
                    <Text style={styles.result}>Kết quả: {item.result}</Text>
                    <View style={styles.confidenceContainer}>
                        <Text>
                            Độ tin cậy: {((item.confidence ?? 0) * 100).toFixed(2)}%
                        </Text>

                        <Progress percent={item.confidence * 100} style={styles.progress} />
                    </View>
                    <Text style={styles.timestamp}>
                        Thời gian: {item.timestamp.toLocaleString()}
                    </Text>
                </View>
            </Card.Body>
        </Card>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#108ee9" />
                <Text style={{ marginTop: 10 }}>Đang tải lịch sử...</Text>
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

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 16,
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
