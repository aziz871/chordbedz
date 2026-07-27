import { db } from '../main.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export class SongRequestService {
    constructor() {
        this.collectionName = 'song_requests';
    }

    async getAllRequests() {
        try {
            const querySnapshot = await getDocs(collection(db, this.collectionName));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => b.tanggal_request - a.tanggal_request);
        } catch (error) {
            console.error('Error getting requests:', error);
            throw error;
        }
    }

    async addRequest(requestData) {
        try {
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...requestData,
                created_at: new Date(),
                updated_at: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding request:', error);
            throw error;
        }
    }

    async updateRequest(id, data) {
        try {
            const docRef = doc(db, this.collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updated_at: new Date()
            });
        } catch (error) {
            console.error('Error updating request:', error);
            throw error;
        }
    }

    async deleteRequest(id) {
        try {
            await deleteDoc(doc(db, this.collectionName, id));
        } catch (error) {
            console.error('Error deleting request:', error);
            throw error;
        }
    }
}
