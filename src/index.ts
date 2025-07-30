export abstract class MyMutexStorage {
    getValue(key: string): Promise<string | null> | string | null {
        throw new Error("Method not implemented.");
    }

    setValue(key: string, value: string): Promise<void> | void {
        throw new Error("Method not implemented.");
    }

    clearValue(key: string): Promise<void> | void {
        throw new Error("Method not implemented.");
    }
}

export class MyMutex {
  storage: MyMutexStorage;
  lockKey: string;
  timeout: number;
  instanceId: string;
  constructor(storage: MyMutexStorage, key: string, timeout = 5000) {
    this.storage = storage;
    this.lockKey = 'mutex-lock:' + key;
    this.timeout = timeout; // Maximum time to hold the lock (in milliseconds)
    this.instanceId = `${Date.now()}::${Math.random()}`; // Unique identifier for this participant
  }

  // Try to acquire the lock
  async acquire() {
    const startTime = Date.now();

    while (Date.now() - startTime < this.timeout) {
      const rawLock = await this.storage.getValue(
        this.lockKey
      );

      if (!rawLock || this._isLockExpired(rawLock)) {
        // Attempt to acquire the lock
        await this.storage.setValue(this.lockKey, `${this.instanceId}//${Date.now()}`);

        // Confirm that we successfully acquired the lock
        const currentRawLock = await this.storage.getValue(
          this.lockKey
        );
        const currentLockInstanceId = currentRawLock?.split('//')[0];
        if (currentLockInstanceId === this.instanceId) {
          return true; // Lock acquired
        }
      }

      // Wait briefly before retrying
      await this._sleep(50);
    }

    throw new Error('Failed to acquire lock within the timeout period.');
  }

  // Release the lock
  async release() {
    const currentLock = await this.storage.getValue(this.lockKey);
    const currentLockInstanceId = currentLock?.split('//')[0];
    if (currentLockInstanceId === this.instanceId) {
      await this.storage.clearValue(this.lockKey);
    }
  }

  // Check if the lock has expired
  _isLockExpired(rawLock: string) {
    const timestamp = +rawLock.split('//')[1];
    return Date.now() - timestamp > this.timeout;
  }

  // Helper function to sleep for a given duration
  _sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
