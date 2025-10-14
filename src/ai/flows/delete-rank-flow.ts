
'use server';
/**
 * @fileOverview A Genkit flow for securely deleting a rank.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DeleteRankInputSchema = z.object({
  rankId: z.string().describe('The ID of the rank to delete.'),
  adminKey: z.string().describe('The secret key to authorize deletion.'),
});

export type DeleteRankInput = z.infer<typeof DeleteRankInputSchema>;

// Initialize Firebase Admin SDK
// This ensures we have the necessary permissions to delete documents on the server.
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Define the flow
const deleteRankFlow = ai.defineFlow(
  {
    name: 'deleteRankFlow',
    inputSchema: DeleteRankInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async ({ rankId, adminKey }) => {
    // IMPORTANT: In a real application, the admin key should be stored securely
    // (e.g., as an environment variable or in a secret manager), not hardcoded.
    const correctAdminKey = "hammadisjassi";

    if (adminKey !== correctAdminKey) {
      throw new Error('Invalid admin key. You do not have permission to delete this rank.');
    }

    if (!rankId) {
      throw new Error('Rank ID is required.');
    }

    try {
      const rankRef = db.collection('ranks').doc(rankId);
      await rankRef.delete();
      return { success: true, message: 'Rank deleted successfully.' };
    } catch (error: any) {
      console.error('Error deleting rank:', error);
      throw new Error(`Failed to delete rank: ${error.message}`);
    }
  }
);

// Define the exported wrapper function
export async function deleteRank(input: DeleteRankInput): Promise<{ success: boolean; message: string; }>{
  return await deleteRankFlow(input);
}
