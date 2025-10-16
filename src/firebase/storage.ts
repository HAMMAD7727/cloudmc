
'use client';

import {
  ref,
  uploadString,
  getDownloadURL,
  getStorage,
} from 'firebase/storage';
import { useFirebaseApp } from '@/firebase';

/**
 * Custom hook to get a function for uploading files to Firebase Storage.
 * @returns { (file: File, path: string) => Promise<string> } An async function that takes a File object and a storage path, and returns the public download URL.
 */
export const useStorage = () => {
  const app = useFirebaseApp();
  const storage = getStorage(app);

  /**
   * Uploads a file to Firebase Storage.
   * @param file The file to upload.
   * @param path The path in Firebase Storage where the file will be stored.
   * @returns The public URL of the uploaded file.
   */
  const uploadFile = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const storageRef = ref(storage, path);
          try {
            const snapshot = await uploadString(storageRef, event.target.result as string, 'data_url');
            const downloadURL = await getDownloadURL(snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        } else {
            reject(new Error("Could not read the file."));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      }
      reader.readAsDataURL(file);
    });
  };

  return { uploadFile };
};

    