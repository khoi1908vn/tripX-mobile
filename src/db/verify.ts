/**
 * Verification script for SQLite schema and FK cascade behavior
 * Run this to verify the database setup works correctly
 */

import { openDatabase, migrateDatabase, getDatabaseVersion } from './index';
import {
  TripRepository,
  ParticipantRepository,
  ExpenseRepository,
  SponsorRepository,
  TripSnapshotRepository,
} from './repositories/index';

async function verifyForeignKeyCascade() {
  console.log('🔍 Starting SQLite schema verification...\n');

  const db = await openDatabase();
  console.log('✅ Database opened');

  // Run migrations
  await migrateDatabase(db);
  const version = await getDatabaseVersion(db);
  console.log(`✅ Database migrated (version: ${version})\n`);

  // Initialize repositories
  const tripRepo = new TripRepository(db);
  const participantRepo = new ParticipantRepository(db);
  const expenseRepo = new ExpenseRepository(db);
  const sponsorRepo = new SponsorRepository(db);
  const snapshotRepo = new TripSnapshotRepository(db);

  console.log('📝 Testing CRUD operations and FK cascade...\n');

  // Create a test trip
  const trip = await tripRepo.create({
    id: 'test-trip-1',
    name: 'Test Trip',
    start_date: '2024-01-01',
    end_date: '2024-01-10',
  });
  console.log('✅ Trip created:', trip.name);

  // Create participants
  const participant1 = await participantRepo.create({
    id: 'test-participant-1',
    trip_id: trip.id,
    name: 'Alice',
  });
  const participant2 = await participantRepo.create({
    id: 'test-participant-2',
    trip_id: trip.id,
    name: 'Bob',
  });
  console.log('✅ Participants created:', participant1.name, participant2.name);

  // Create an expense with splits
  const expense = await expenseRepo.create({
    id: 'test-expense-1',
    trip_id: trip.id,
    description: 'Dinner',
    amount: 100,
    currency: 'USD',
    paid_by: participant1.id,
    paid_at: '2024-01-05T18:00:00Z',
    splits: [
      { id: 'split-1', participant_id: participant1.id, share_amount: 50 },
      { id: 'split-2', participant_id: participant2.id, share_amount: 50 },
    ],
  });
  console.log('✅ Expense created:', expense.description);

  const splits = await expenseRepo.findSplitsByExpenseId(expense.id);
  console.log(`✅ Splits created: ${splits.length} splits`);

  // Create a sponsor
  const sponsor = await sponsorRepo.create({
    id: 'test-sponsor-1',
    trip_id: trip.id,
    name: 'Company XYZ',
    contribution_amount: 500,
  });
  console.log('✅ Sponsor created:', sponsor.name);

  // Create a snapshot
  const snapshot = await snapshotRepo.create({
    id: 'test-snapshot-1',
    trip_id: trip.id,
    snapshot_data: { test: 'data', timestamp: Date.now() },
  });
  console.log('✅ Snapshot created');

  console.log('\n🗑️  Testing FK CASCADE on DELETE...\n');

  // Verify data exists
  const tripsBefore = await tripRepo.findAll();
  const participantsBefore = await participantRepo.findByTripId(trip.id);
  const expensesBefore = await expenseRepo.findByTripId(trip.id);
  const sponsorsBefore = await sponsorRepo.findByTripId(trip.id);
  const snapshotsBefore = await snapshotRepo.findByTripId(trip.id);

  console.log(`Before delete: ${tripsBefore.length} trips, ${participantsBefore.length} participants, ${expensesBefore.length} expenses, ${sponsorsBefore.length} sponsors, ${snapshotsBefore.length} snapshots`);

  // Delete the trip (should cascade to participants, expenses, splits, sponsors, snapshots)
  await tripRepo.delete(trip.id);
  console.log('✅ Trip deleted');

  // Verify cascade deletion
  const tripsAfter = await tripRepo.findAll();
  const participantsAfter = await participantRepo.findByTripId(trip.id);
  const expensesAfter = await expenseRepo.findByTripId(trip.id);
  const splitsAfter = await expenseRepo.findSplitsByExpenseId(expense.id);
  const sponsorsAfter = await sponsorRepo.findByTripId(trip.id);
  const snapshotsAfter = await snapshotRepo.findByTripId(trip.id);

  console.log(`After delete: ${tripsAfter.length} trips, ${participantsAfter.length} participants, ${expensesAfter.length} expenses, ${splitsAfter.length} splits, ${sponsorsAfter.length} sponsors, ${snapshotsAfter.length} snapshots`);

  // Verify all related data was deleted
  if (
    participantsAfter.length === 0 &&
    expensesAfter.length === 0 &&
    splitsAfter.length === 0 &&
    sponsorsAfter.length === 0 &&
    snapshotsAfter.length === 0
  ) {
    console.log('\n✅ FK CASCADE verified! All related data was deleted.');
  } else {
    console.error('\n❌ FK CASCADE failed! Some related data was not deleted.');
    throw new Error('FK CASCADE verification failed');
  }

  console.log('\n🎉 All verifications passed!');
}

// Run verification if this file is executed directly
if (require.main === module) {
  verifyForeignKeyCascade()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n❌ Verification failed:', error);
      process.exit(1);
    });
}

export { verifyForeignKeyCascade };
