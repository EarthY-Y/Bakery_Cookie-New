// Middleware สำหรับจัดการข้อผิดพลาด
export const errorHandler = (err) => {
    console.error('Error:', err.message);

    if (err.message === 'Database timeout') {
        return res.status(504).json({ error: 'Database request timed out' });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(400).json({ error: 'Bad request: Invalid field' });
    }

    // Error อื่นๆ
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
}
