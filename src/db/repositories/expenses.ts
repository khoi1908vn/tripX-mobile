import type { SQLiteDatabase } from 'expo-sqlite';

export interface Expense {
  id: string;
  trip_id: string;
  description: string;
  amount: number;
  currency: string;
  paid_by: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  participant_id: string;
  share_amount: number;
  created_at: string;
}

export interface CreateExpenseInput {
  id: string;
  trip_id: string;
  description: string;
  amount: number;
  currency?: string;
  paid_by: string;
  paid_at: string;
  splits: Array<{
    id: string;
    participant_id: string;
    share_amount: number;
  }>;
}

export interface UpdateExpenseInput {
  description?: string;
  amount?: number;
  currency?: string;
  paid_by?: string;
  paid_at?: string;
  splits?: Array<{
    id: string;
    participant_id: string;
    share_amount: number;
  }>;
}

export class ExpenseRepository {
  constructor(private db: SQLiteDatabase) {}

  async create(input: CreateExpenseInput): Promise<Expense> {
    const now = new Date().toISOString();

    await this.db.withTransactionAsync(async () => {
      // Insert expense
      await this.db.runAsync(
        `INSERT INTO expenses (id, trip_id, description, amount, currency, paid_by, paid_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        input.id,
        input.trip_id,
        input.description,
        input.amount,
        input.currency ?? 'USD',
        input.paid_by,
        input.paid_at,
        now,
        now
      );

      // Insert splits
      for (const split of input.splits) {
        await this.db.runAsync(
          `INSERT INTO expense_splits (id, expense_id, participant_id, share_amount, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          split.id,
          input.id,
          split.participant_id,
          split.share_amount,
          now
        );
      }
    });

    const expense = await this.findById(input.id);
    if (!expense) {
      throw new Error('Failed to create expense');
    }
    return expense;
  }

  async findById(id: string): Promise<Expense | null> {
    return await this.db.getFirstAsync<Expense>(
      'SELECT * FROM expenses WHERE id = ?',
      id
    );
  }

  async findByTripId(tripId: string): Promise<Expense[]> {
    return await this.db.getAllAsync<Expense>(
      'SELECT * FROM expenses WHERE trip_id = ? ORDER BY paid_at DESC',
      tripId
    );
  }

  async findSplitsByExpenseId(expenseId: string): Promise<ExpenseSplit[]> {
    return await this.db.getAllAsync<ExpenseSplit>(
      'SELECT * FROM expense_splits WHERE expense_id = ?',
      expenseId
    );
  }

  async update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const updates: string[] = [];
    const values: any[] = [];

    if (input.description !== undefined) {
      updates.push('description = ?');
      values.push(input.description);
    }
    if (input.amount !== undefined) {
      updates.push('amount = ?');
      values.push(input.amount);
    }
    if (input.currency !== undefined) {
      updates.push('currency = ?');
      values.push(input.currency);
    }
    if (input.paid_by !== undefined) {
      updates.push('paid_by = ?');
      values.push(input.paid_by);
    }
    if (input.paid_at !== undefined) {
      updates.push('paid_at = ?');
      values.push(input.paid_at);
    }

    await this.db.withTransactionAsync(async () => {
      if (updates.length > 0) {
        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(id);

        await this.db.runAsync(
          `UPDATE expenses SET ${updates.join(', ')} WHERE id = ?`,
          ...values
        );
      }

      // Update splits if provided
      if (input.splits) {
        // Delete existing splits
        await this.db.runAsync(
          'DELETE FROM expense_splits WHERE expense_id = ?',
          id
        );

        // Insert new splits
        const now = new Date().toISOString();
        for (const split of input.splits) {
          await this.db.runAsync(
            `INSERT INTO expense_splits (id, expense_id, participant_id, share_amount, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            split.id,
            id,
            split.participant_id,
            split.share_amount,
            now
          );
        }
      }
    });

    const expense = await this.findById(id);
    if (!expense) {
      throw new Error('Expense not found after update');
    }
    return expense;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM expenses WHERE id = ?', id);
  }
}
