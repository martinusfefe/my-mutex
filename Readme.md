# my-mutex

A simple TypeScript/JavaScript mutex implementation.

## Features

- Lightweight and easy to use
- Written in TypeScript
- Suitable for synchronizing asynchronous operations

## Installation

```
npm install my-mutex
```

## Usage

```typescript
import { MyMutex } from 'my-mutex'

// Example: In-memory storage provider (for demonstration/testing)
class InMemoryStorage {
  private store = new Map<string, string>()
  async getValue(key: string) {
    return this.store.get(key) ?? null
  }
  async setValue(key: string, value: string) {
    this.store.set(key, value)
  }
  async clearValue(key: string) {
    this.store.delete(key)
  }
}

const storage = new InMemoryStorage()
const mutex = new MyMutex(storage, 'resource-key')

async function criticalSection() {
  await mutex.acquire()
  try {
    // Your critical code here
  } finally {
    await mutex.release()
  }
}
```

### Custom Storage Providers

You can implement your own storage by extending the `MyMutexStorage` abstract class. This allows you to use Redis, a database, or any other backend for distributed locks.

```typescript
import { MyMutex, MyMutexStorage } from 'my-mutex'

class MyCustomStorage extends MyMutexStorage {
  // Implement getValue, setValue, clearValue methods
}

const storage = new MyCustomStorage()
const mutex = new MyMutex(storage, 'key')
```

## TypeScript

Type definitions are included. This library is written in TypeScript and works great in both TypeScript and JavaScript projects.

## Development

- Source code is in the `src/` directory.
- Build with:

```
npm run build
```

## License

MIT
