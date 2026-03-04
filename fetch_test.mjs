const query = `
  query IntrospectionQuery {
    __schema {
      mutationType {
        name
        fields {
          name
          args {
            name
            type { name kind ofType { name kind } }
          }
        }
      }
    }
  }
`;

async function test() {
  try {
    const res = await fetch('https://api.keraai.in/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    const mutations = json.data.__schema.mutationType.fields;
    console.log(JSON.stringify(mutations, null, 2));
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

test();
