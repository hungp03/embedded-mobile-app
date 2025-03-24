import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Progress } from '@ant-design/react-native';
import { mockPredictions } from '../data/mockData';
import { Prediction } from '../types';

export const HistoryScreen = () => {
    const renderItem = ({ item }: { item: Prediction }) => (
        <Card style={styles.card}>
            <Card.Body>
                <View style={styles.content}>
                    <Text style={styles.modelName}>Mô hình: {item.modelName}</Text>
                    <Text style={styles.result}>Kết quả: {item.result}</Text>
                    <View style={styles.confidenceContainer}>
                        <Text>Độ tin cậy:</Text>
                        <Progress
                            percent={item.confidence * 100}
                            style={styles.progress}
                        />
                    </View>
                    <Text style={styles.timestamp}>
                        Thời gian: {new Date(item.timestamp).toLocaleString()}
                    </Text>
                </View>
            </Card.Body>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={mockPredictions}
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
}); 