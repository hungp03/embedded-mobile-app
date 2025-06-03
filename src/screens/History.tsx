import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Text, Progress, Button } from '@ant-design/react-native';
import { rtdb } from '../../firebaseConfig';
import { ref, query, orderByChild, limitToLast, endBefore, get } from 'firebase/database';

export const History = () => {
    interface HistoryItem {
        id: string;
        modelName: string;
        result: string;
        confidence: number;
        timestamp: Date;
        timestampValue: number;
    }

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
    
    const ITEMS_PER_PAGE = 10;

    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const historyRef = ref(rtdb, 'predictions/history');
            const initialQuery = query(
                historyRef,
                orderByChild('timestamp'),
                limitToLast(ITEMS_PER_PAGE)
            );
            
            const snapshot = await get(initialQuery);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                const historyArray = Object.keys(data)
                    .map(id => ({
                        id,
                        ...data[id],
                        timestamp: data[id].timestamp ? new Date(data[id].timestamp) : new Date(),
                        timestampValue: data[id].timestamp || Date.now(),
                    }))
                    .sort((a, b) => b.timestampValue - a.timestampValue);

                setHistory(historyArray);
                
                // Cập nhật lastTimestamp cho pagination tiếp theo
                if (historyArray.length > 0) {
                    setLastTimestamp(historyArray[historyArray.length - 1].timestampValue);
                }
                
                // Kiểm tra còn dữ liệu không
                setHasMore(historyArray.length === ITEMS_PER_PAGE);
            } else {
                setHistory([]);
                setError("Không có lịch sử dự đoán.");
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error loading initial data: ", err);
            setError("Lỗi khi tải lịch sử.");
            setHistory([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm tải thêm dữ liệu
    const loadMoreData = useCallback(async () => {
        if (!hasMore || loadingMore || !lastTimestamp) return;

        try {
            setLoadingMore(true);
            
            const historyRef = ref(rtdb, 'predictions/history');
            const moreQuery = query(
                historyRef,
                orderByChild('timestamp'),
                endBefore(lastTimestamp),
                limitToLast(ITEMS_PER_PAGE)
            );
            
            const snapshot = await get(moreQuery);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                const newHistoryArray = Object.keys(data)
                    .map(id => ({
                        id,
                        ...data[id],
                        timestamp: data[id].timestamp ? new Date(data[id].timestamp) : new Date(),
                        timestampValue: data[id].timestamp || Date.now(),
                    }))
                    .sort((a, b) => b.timestampValue - a.timestampValue);

                const existingIds = new Set(history.map(item => item.id));
                const filteredNewItems = newHistoryArray.filter(item => !existingIds.has(item.id));

                if (filteredNewItems.length > 0) {
                    setHistory(prevHistory => [...prevHistory, ...filteredNewItems]);
                    setLastTimestamp(filteredNewItems[filteredNewItems.length - 1].timestampValue);
                    setHasMore(filteredNewItems.length === ITEMS_PER_PAGE);
                } else {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error loading more data: ", err);
            setError("Lỗi khi tải thêm dữ liệu.");
        } finally {
            setLoadingMore(false);
        }
    }, [hasMore, loadingMore, lastTimestamp, history]);

    // Hàm refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setLastTimestamp(null);
        setHasMore(true);
        await loadInitialData();
        setRefreshing(false);
    }, [loadInitialData]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const renderItem = ({ item }: { item: HistoryItem }) => (
        <Card style={styles.card}>
            <Card.Body>
                <View style={styles.content}>
                    <Text style={styles.modelName}>Mô hình: {item.modelName}</Text>
                    <Text style={styles.result}>Kết quả: {item.result}</Text>
                    <View style={styles.confidenceContainer}>
                        <Text>
                            Độ tin cậy: {((item.confidence ?? 0) * 100).toFixed(2)}%
                        </Text>
                        <Progress percent={(item.confidence ?? 0) * 100} style={styles.progress} />
                    </View>
                    <Text style={styles.timestamp}>
                        Thời gian: {item.timestamp.toLocaleString()}
                    </Text>
                </View>
            </Card.Body>
        </Card>
    );

    const renderFooter = () => {
        if (!hasMore) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.noMoreText}>Đã hiển thị tất cả lịch sử</Text>
                </View>
            );
        }

        if (loadingMore) {
            return (
                <View style={styles.footerContainer}>
                    <ActivityIndicator size="small" color="#108ee9" />
                    <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
                </View>
            );
        }

        return (
            <View style={styles.footerContainer}>
                <Button
                    type="ghost"
                    size="small"
                    onPress={loadMoreData}
                    style={styles.loadMoreButton}
                >
                    Tải thêm
                </Button>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#108ee9" />
                <Text style={{ marginTop: 10 }}>Đang tải lịch sử...</Text>
            </View>
        );
    }

    if (error && history.length === 0) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>
                    {error}
                </Text>
                <Button
                    type="primary"
                    size="small"
                    onPress={onRefresh}
                >
                    Thử lại
                </Button>
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#108ee9']}
                        tintColor="#108ee9"
                    />
                }
                ListFooterComponent={renderFooter}
                onEndReached={() => {
                    if (hasMore && !loadingMore) {
                        loadMoreData();
                    }
                }}
                onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={true}
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
    footerContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loadingMoreText: {
        marginTop: 8,
        color: '#666',
        fontSize: 12,
    },
    noMoreText: {
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
    },
    loadMoreButton: {
        borderColor: '#108ee9',
    },
});