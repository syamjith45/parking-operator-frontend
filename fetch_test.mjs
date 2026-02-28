const query = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      types {
        name
        fields {
          name
          args {
            name
            type {
              name
              kind
              ofType {
                name
              }
            }
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
            body: JSON.stringify({
                query: query
            })
        });
        const json = await res.json();
        const transHistory = json.data.__schema.types.find(t => t.name === 'Query')?.fields.find(f => f.name === 'transactionHistory');
        console.log(JSON.stringify(transHistory.args, null, 2));
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

test();
