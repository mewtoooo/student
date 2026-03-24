import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStudents = () => api.get('/students/');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students/', data);
export const updateStudent = (id, data) => api.patch(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export default api;
