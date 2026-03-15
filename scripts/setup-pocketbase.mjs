/**
 * PocketBase Collection Setup Script (v0.23+)
 *
 * Creates the `roadblocks` and `subscriptions` collections with
 * correct fields, API rules, and indexes.
 *
 * Usage: PB_EMAIL=x PB_PASS=y node scripts/setup-pocketbase.mjs
 */

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const PB_EMAIL = process.env.PB_EMAIL;
const PB_PASS = process.env.PB_PASS;

if (!PB_EMAIL || !PB_PASS) {
  console.error("Error: PB_EMAIL and PB_PASS env vars are required");
  process.exit(1);
}

async function request(path, options = {}) {
  const url = `${PB_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = body;
  }

  if (!res.ok) {
    console.error(`${res.status} ${res.statusText}: ${path}`);
    console.error(JSON.stringify(json, null, 2));
    throw new Error(`Request failed: ${res.status}`);
  }

  return json;
}

async function main() {
  // 1. Authenticate as superuser (PocketBase v0.23+)
  console.log("Authenticating as superuser...");
  const auth = await request(
    "/api/collections/_superusers/auth-with-password",
    {
      method: "POST",
      body: JSON.stringify({
        identity: PB_EMAIL,
        password: PB_PASS,
      }),
    },
  );
  const token = auth.token;
  console.log("Authenticated successfully.");

  const authHeaders = { Authorization: token };

  // 2. Check existing collections
  console.log("Checking existing collections...");
  const existing = await request("/api/collections", {
    headers: authHeaders,
  });
  const collectionsList = existing.items ?? existing;
  const existingNames = new Set(collectionsList.map((c) => c.name));

  // 3. Create `roadblocks` collection
  if (existingNames.has("roadblocks")) {
    console.log("Collection 'roadblocks' already exists — skipping.");
  } else {
    console.log("Creating 'roadblocks' collection...");
    await request("/api/collections", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "roadblocks",
        type: "base",
        fields: [
          {
            name: "category",
            type: "select",
            required: true,
            values: ["CI/CD", "DX", "Process", "Tooling", "Culture"],
            maxSelect: 1,
          },
          {
            name: "severity",
            type: "select",
            required: true,
            values: ["Low", "Med", "High", "Critical"],
            maxSelect: 1,
          },
          {
            name: "title",
            type: "text",
            required: true,
            max: 100,
          },
          {
            name: "description",
            type: "editor",
            required: true,
          },
          {
            name: "estimated_waste",
            type: "number",
            required: true,
            min: 0,
          },
          {
            name: "status",
            type: "select",
            required: true,
            values: ["Open", "In Progress", "Resolved", "Closed"],
            maxSelect: 1,
          },
          {
            name: "resolver_id",
            type: "relation",
            required: false,
            collectionId: "_pb_users_auth_",
            maxSelect: 1,
          },
          {
            name: "resolution_note",
            type: "text",
            required: false,
          },
          {
            name: "created",
            type: "autodate",
            onCreate: true,
            onUpdate: false,
          },
          {
            name: "updated",
            type: "autodate",
            onCreate: true,
            onUpdate: true,
          },
        ],
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""',
      }),
    });
    console.log("'roadblocks' collection created.");
  }

  // 4. Get the roadblocks collection ID for the subscription relation
  const collectionsAfter = await request("/api/collections", {
    headers: authHeaders,
  });
  const allCollections = collectionsAfter.items ?? collectionsAfter;
  const roadblocksCollection = allCollections.find(
    (c) => c.name === "roadblocks",
  );
  if (!roadblocksCollection) {
    throw new Error("Could not find 'roadblocks' collection");
  }
  console.log(`Roadblocks collection ID: ${roadblocksCollection.id}`);

  // 5. Create `subscriptions` collection
  if (existingNames.has("subscriptions")) {
    console.log("Collection 'subscriptions' already exists — skipping.");
  } else {
    console.log("Creating 'subscriptions' collection...");
    await request("/api/collections", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "subscriptions",
        type: "base",
        fields: [
          {
            name: "user_id",
            type: "relation",
            required: true,
            collectionId: "_pb_users_auth_",
            maxSelect: 1,
          },
          {
            name: "roadblock_id",
            type: "relation",
            required: true,
            collectionId: roadblocksCollection.id,
            maxSelect: 1,
          },
          {
            name: "created",
            type: "autodate",
            onCreate: true,
            onUpdate: false,
          },
          {
            name: "updated",
            type: "autodate",
            onCreate: true,
            onUpdate: true,
          },
        ],
        listRule: 'user_id = @request.auth.id',
        viewRule: 'user_id = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: 'user_id = @request.auth.id',
        deleteRule: 'user_id = @request.auth.id',
        indexes: [
          "CREATE UNIQUE INDEX idx_unique_subscription ON subscriptions (user_id, roadblock_id)",
        ],
      }),
    });
    console.log("'subscriptions' collection created.");
  }

  console.log("\nPocketBase setup complete!");
  console.log("Collections created: roadblocks, subscriptions");
  console.log("Anonymity: No created_by field on roadblocks — by design.");
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
