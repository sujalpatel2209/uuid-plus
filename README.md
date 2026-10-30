# uuid-plus

> 🚀 A fast, secure, zero-dependency UUID toolkit for Node.js and TypeScript with UUID v4, v5, time-sortable v7, HMAC-based v8, validation, parsing, compact IDs, timestamps, comparison, and batch generation.

[![npm version](https://img.shields.io/npm/v/uuid-plus.svg)](https://www.npmjs.com/package/uuid-plus)
[![npm downloads](https://img.shields.io/npm/dm/uuid-plus.svg)](https://www.npmjs.com/package/uuid-plus)
[![license](https://img.shields.io/npm/l/uuid-plus.svg)](LICENSE)
[![node](https://img.shields.io/node/v/uuid-plus.svg)](https://nodejs.org)

---

## ✨ Features

- 🔐 Cryptographically secure UUID v4
- 🏷️ Deterministic namespace-based UUID v5
- ⏱️ Time-sortable UUID v7
- 🔑 HMAC-SHA-256 based deterministic UUID v8
- ✅ UUID validation
- 🔎 UUID version detection
- 📦 UUID parsing to bytes
- 🔄 Convert bytes back to UUID
- 🕒 Extract timestamps from UUID v7
- ✂️ Compact 22-character Base64URL UUIDs
- 📤 Restore compact UUIDs
- ⚖️ Compare UUID values
- 🚀 Batch UUID generation
- 📘 TypeScript support
- 📦 ESM and CommonJS support
- 🪶 Zero runtime dependencies
- ⚡ Node.js 18+
- 🧩 Framework independent

Works with:

- Node.js
- TypeScript
- JavaScript
- Express
- Fastify
- NestJS
- Koa
- Hapi
- Next.js server-side applications
- REST APIs
- Microservices
- CLI applications

---

## 📦 Installation

Using npm:

```bash
npm install uuid-plus
```

Using yarn:

```bash
yarn add uuid-plus
```

Using pnpm:

```bash
pnpm add uuid-plus
```

---

## 🚀 Quick Start

```js
import { v4, v7 } from "uuid-plus";

console.log(v4());
console.log(v7());
```

Example output:

```text
8e93be20-1669-42ba-a5e5-07bf95021985

019a35bd-776f-7033-b8df-a9bc6670db0c
```

---

# 📚 API

## `v4()`

Generates a cryptographically random UUID v4.

```js
import { v4 } from "uuid-plus";

const id = v4();

console.log(id);
```

Use UUID v4 when you need unpredictable identifiers.

### Common use cases

- User IDs
- Public identifiers
- Request IDs
- File IDs
- Session references
- Distributed object IDs

Example:

```js
const user = {
  id: v4(),
  name: "John"
};
```

---

# ⏱️ UUID v7

## `v7()`

Generates a time-sortable UUID v7.

```js
import { v7 } from "uuid-plus";

const id = v7();

console.log(id);
```

UUID v7 contains Unix timestamp information and is useful when IDs should approximately follow creation order.

### Database example

```js
import { v7 } from "uuid-plus";

const order = {
  id: v7(),
  customerId: 123,
  total: 4999
};

await db.orders.insert(order);
```

UUID v7 can be useful for:

- Database primary keys
- Orders
- Transactions
- Events
- Logs
- Audit records
- Queue messages
- Distributed applications

---

## Custom v7 timestamp

You can generate a UUID v7 using a specific Unix timestamp in milliseconds:

```js
import { v7 } from "uuid-plus";

const id = v7(Date.now());

console.log(id);
```

---

# 🏷️ UUID v5

## `v5(name, namespace)`

Creates a deterministic namespace-based UUID.

```js
import {
  v5,
  DNS
} from "uuid-plus";

const id = v5(
  "example.com",
  DNS
);

console.log(id);
```

The same namespace and name produce the same UUID.

```js
const first = v5("example.com", DNS);
const second = v5("example.com", DNS);

console.log(first === second);
// true
```

Useful for:

- Migrating old identifiers
- Mapping external IDs
- Data synchronization
- Deterministic identifiers
- Namespace-based resources

---

# 🔑 UUID v8 with HMAC

## `v8(value, secret, context?)`

`uuid-plus` provides a deterministic UUID v8 helper based on HMAC-SHA-256.

```js
import { v8 } from "uuid-plus";

const id = v8(
  "customer:12345",
  "my-super-secret-key"
);

console.log(id);
```

Calling it again with the same input and secret produces the same value:

```js
const first = v8(
  "customer:12345",
  "my-super-secret-key"
);

const second = v8(
  "customer:12345",
  "my-super-secret-key"
);

console.log(first === second);
// true
```

### Recommended production usage

Store your secret outside your source code:

```env
UUID_SECRET=your-long-random-secret
```

Then:

```js
const id = v8(
  "customer:12345",
  process.env.UUID_SECRET
);
```

Useful for:

- Stable private identifiers
- Customer references
- External-facing database IDs
- Tenant IDs
- Internal → public ID mapping
- Deterministic application identifiers

> UUID v8 is application-specific. `uuid-plus` uses an HMAC-SHA-256-based scheme for its `v8()` helper.

---

# ✅ Validate UUID

## `validate()`

Check whether a value is a valid UUID supported by the validator.

```js
import {
  v4,
  validate
} from "uuid-plus";

const id = v4();

console.log(validate(id));
// true

console.log(validate("hello"));
// false
```

You can safely validate user input:

```js
if (!validate(req.params.id)) {
  throw new Error("Invalid UUID");
}
```

---

# 🔎 Detect UUID Version

## `version()`

```js
import {
  v7,
  version
} from "uuid-plus";

const id = v7();

console.log(version(id));
// 7
```

Another example:

```js
import {
  v4,
  version
} from "uuid-plus";

console.log(version(v4()));
// 4
```

---

# 📦 Parse UUID

## `parse()`

Converts a UUID string into a 16-byte `Uint8Array`.

```js
import {
  v4,
  parse
} from "uuid-plus";

const id = v4();

const bytes = parse(id);

console.log(bytes);
console.log(bytes.length);

// 16
```

Useful when databases or protocols store UUIDs in binary form.

---

# 🔄 Stringify UUID

## `stringify()`

Converts 16 UUID bytes back into UUID string format.

```js
import {
  v4,
  parse,
  stringify
} from "uuid-plus";

const original = v4();

const bytes = parse(original);

const restored = stringify(bytes);

console.log(restored);

console.log(original === restored);
// true
```

---

# 🕒 UUID v7 Timestamp

## `timestamp()`

Extract the creation timestamp from UUID v7.

```js
import {
  v7,
  timestamp
} from "uuid-plus";

const id = v7();

const createdAt = timestamp(id);

console.log(createdAt);
```

Get an ISO date:

```js
console.log(
  timestamp(id).toISOString()
);
```

Example:

```text
2026-10-30T05:30:00.000Z
```

> UUID v7 exposes time information. If revealing approximate creation time is undesirable, consider UUID v4 instead.

---

# ✂️ Compact UUID

## `compact()`

Normal UUID strings use 36 characters:

```text
550e8400-e29b-41d4-a716-446655440000
```

Convert one into a compact Base64URL representation:

```js
import {
  v4,
  compact
} from "uuid-plus";

const id = v4();

const shortId = compact(id);

console.log(shortId);
```

The encoded representation is normally only **22 characters**.

This does not reduce the UUID's underlying 128-bit value. It changes its representation.

Useful for:

- URLs
- API responses
- QR payloads
- Message payloads
- Shorter textual identifiers

---

# 📤 Expand Compact UUID

## `expand()`

Restore a compact UUID:

```js
import {
  v4,
  compact,
  expand
} from "uuid-plus";

const original = v4();

const encoded = compact(original);

const restored = expand(encoded);

console.log(original);
console.log(encoded);
console.log(restored);

console.log(original === restored);
// true
```

---

# 🚀 Batch Generation

## `batch(count, version?)`

Generate multiple UUIDs at once.

### Generate UUID v7

```js
import { batch } from "uuid-plus";

const ids = batch(10);

console.log(ids);
```

Or explicitly:

```js
const ids = batch(10, 7);
```

### Generate UUID v4

```js
const ids = batch(10, 4);
```

Example:

```js
const ids = batch(1000, 7);

console.log(ids.length);
// 1000
```

The package currently allows a maximum batch size of:

```text
1,000,000
```

For extremely large workloads, generating IDs incrementally can reduce memory usage.

---

# ⚖️ Compare UUIDs

## `compare()`

Compare two UUIDs by their binary representation.

```js
import {
  v7,
  compare
} from "uuid-plus";

const first = v7();
const second = v7();

console.log(
  compare(first, second)
);
```

Results follow standard comparison behavior:

```text
< 0    first comes before second
0      UUIDs are equal
> 0    first comes after second
```

This is particularly useful with UUID v7.

---

# 🧱 UUID Constants

`uuid-plus` exports several useful constants.

```js
import {
  NIL,
  MAX,
  DNS,
  URL
} from "uuid-plus";

console.log(NIL);
console.log(MAX);
console.log(DNS);
console.log(URL);
```

---

# 🧩 Express Example

```js
import express from "express";
import { v7 } from "uuid-plus";

const app = express();

app.use((req, res, next) => {
  req.requestId = v7();

  res.setHeader(
    "X-Request-ID",
    req.requestId
  );

  next();
});

app.get("/", (req, res) => {
  res.json({
    requestId: req.requestId
  });
});

app.listen(3000);
```

---

# ⚡ Fastify Example

```js
import Fastify from "fastify";
import { v7 } from "uuid-plus";

const app = Fastify({
  genReqId: () => v7()
});

app.get("/", async request => {
  return {
    requestId: request.id
  };
});

await app.listen({
  port: 3000
});
```

---

# 🏗️ NestJS Example

```ts
import {
  Injectable
} from "@nestjs/common";

import {
  v7
} from "uuid-plus";

@Injectable()
export class IdService {

  generate(): string {
    return v7();
  }

}
```

---

# 📘 TypeScript

`uuid-plus` includes TypeScript declarations.

```ts
import {
  UUID,
  v7
} from "uuid-plus";

const id: UUID = v7();
```

No separate `@types` package is required.

---

# 📦 CommonJS

CommonJS builds are also provided.

```js
const {
  v4,
  v7
} = require("uuid-plus");

console.log(v4());
console.log(v7());
```

---

# 🧠 Which UUID Should I Use?

| Type | Best for |
|---|---|
| UUID v4 | Secure random/general-purpose IDs |
| UUID v5 | Deterministic namespace IDs |
| UUID v7 | Time-sortable database and event IDs |
| UUID v8 HMAC | Application-specific deterministic
### Random public ID

Use:

```js
v4()
```

### Same input → same namespace ID

Use:

```js
v5(value, namespace)
```

### Same input → stable keyed/opaque ID

Use:

```js
v8(value, secret)
```

---

# 🔐 Security

Keep these rules in mind:

- UUIDs are identifiers, not authorization tokens.
- Do not rely on UUIDs alone to secure private resources.
- Keep UUID v8 HMAC secrets outside source control.
- UUID v7 contains its creation timestamp.
- Use secure environment variables for production secrets.
- Validate UUIDs received from untrusted sources.

---

# 🪶 Zero Runtime Dependencies

`uuid-plus` has no runtime dependencies.

This helps keep applications lightweight and minimizes the runtime dependency tree.

Development tools such as TypeScript, tsup, and Vitest are only used while developing or building `uuid-plus`.

---

# 🛠️ Development

Clone the project:

```bash
git clone https://github.com/sujalpatel2209/uuid-plus.git

cd uuid-plus

npm install
```

Type check:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

Run local examples:

```bash
npm run test:local
```

Check everything:

```bash
npm run check
```

Preview the npm package:

```bash
npm pack --dry-run
```

---

# 🤝 Contributing

Contributions, bug reports, feature requests, and pull requests are welcome.

If you find a bug or have an idea for improving `uuid-plus`, open an issue on GitHub.

Potential areas for contribution include:

- UUID performance improvements
- Additional test vectors
- Database integration examples
- Framework integrations
- Documentation improvements
- TypeScript improvements
- Benchmarks

---

# ⭐ Support

If `uuid-plus` helps your project:

- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Submit pull requests
- 📦 Use and share the npm package

---

# 📄 License

MIT License © 2026 Sujal Patel
