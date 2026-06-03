/**
 * Manual FK Cascade Verification Test
 *
 * This file demonstrates how to verify FK cascade behavior.
 * Import and call verifyFKCascade() in your app entry point during development.
 */

import { openDatabase, migrateDatabase } from './index';
import {
  TripRepository,
  ParticipantRepository,
  ExpenseRepository,
  SponsorRepository,
  TripSnapshotRepository,
} from './repositories/index';

export async function verifyFKCascade(): Promise<boolean> {
  try {
    console.log('🔍 Starting FK cascade verification...');

    const db = await openDatabase();
    await migrateDatabase(db);

    const tripRepo = new TripRepository(db);
    const participantRepo = new ParticipantRepository(db);
    const expenseRepo = new ExpenseRepository(db);
    const sponsorRepo = new SponsorRepository(db);
    const snapshotRepo = new TripSnapshotRepository(db);

    // Create test data
    const testTripId = `test-trip-${Date.now()}`;
    const testParticipant1Id = `test-p1-${Date.now()}`;
    const testParticipant2Id = `test-p2-${Date.now()}`;
    const testExpenseId = `test-exp-${Date.now()}`;
    const testSponsorId = `test-sponsor-${Date.now()}`;
    const testSnapshotId = `test-snapshot-${Date.now()}`;

    // Create trip
    await tripRepo.create({
      id: testTripId,
      name: 'FK Test Trip',
      start_date: '2024-01-01',
    });

    // Create participants
    await participantRepo.create({
      id: testParticipant1Id,
      trip_id: testTripId,
      name: 'Test Person 1',
    });

    await participantRepo.create({
      id: testParticipant2Id,
      trip_id: testTripId,
      name: 'Test Person 2',
    });

    // Create expense with splits
    await expenseRepo.create({
      id: testExpenseId,
      trip_id: testTripId,
      description: 'Test Expense',
      amount: 100,
      paid_by: testParticipant1Id,
      paid_at: new Date().toISOString(),
      splits: [
        {
          id: `split1-${Date.now()}`,
          participant_id: testParticipant1Id,
          share_amount: 50,
        },
        {
          id: `split2-${Date.now()}`,
          participant_id: testParticipant2Id,
          share_amount: 50,
        },
      ],
    });

    // Create sponsor
    await sponsorRepo.create({
      id: testSponsorId,
      trip_id: testTripId,
      name: 'Test Sponsor',
      contribution_amount: 500,
    });

    // Create snapshot
    await snapshotRepo.create({
      id: testSnapshotId,
      trip_id: testTripId,
      snapshot_data: { test: true },
    });

    // Verify data exists
    const participantsBefore = await participantRepo.findByTripId(testTripId);
    const expensesBefore = await expenseRepo.findByTripId(testTripId);
    const splitsBefore = await expenseRepo.findSplitsByExpenseId(testExpenseId);
    const sponsorsBefore = await sponsorRepo.findByTripId(testTripId);
    const snapshotsBefore = await snapshotRepo.findByTripId(testTripId);

    console.log('✅ Created test data:', {
      participants: participantsBefore.length,
      expenses: expensesBefore.length,
      splits: splitsBefore.length,
      sponsors: sponsorsBefore.length,
      snapshots: snapshotsBefore.length,
    });

    // Delete trip - should cascade
    await tripRepo.delete(testTripId);

    // Verify cascade deletion
    const participantsAfter = await participantRepo.findByTripId(testTripId);
    const expensesAfter = await expenseRepo.findByTripId(testTripId);
    const splitsAfter = await expenseRepo.findSplitsByExpenseId(testExpenseId);
    const sponsorsAfter = await sponsorRepo.findByTripId(testTripId);
    const snapshotsAfter = await snapshotRepo.findByTripId(testTripId);

    const allDeleted =
      participantsAfter.length === 0 &&
      expensesAfter.length === 0 &&
      splitsAfter.length === 0 &&
      sponsorsAfter.length === 0 &&
      snapshotsAfter.length === 0;

    if (allDeleted) {
      console.log('✅ FK CASCADE verified! All related data deleted.');
      return true;
    } else {
      console.error('❌ FK CASCADE failed! Some data remains:', {
        participants: participantsAfter.length,
        expenses: expensesAfter.length,
        splits: splitsAfter.length,
        sponsors: sponsorsAfter.length,
        snapshots: snapshotsAfter.length,
      });
      return false;
    }
  } catch (error) {
    console.error('❌ FK cascade verification error:', error);
    return false;
  }
}
