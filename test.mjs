const query = `
  query transactionHistory(
    $staff_id: String
  ) {
    transactionHistory(
      staff_id: $staff_id
    ) {
      records {
        created_by_staff {
          name
        }
      }
      total_count
    }
  }
`;

async function test() {
    const r = await fetch('https://api.keraai.in/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, variables: { staff_id: "09c7f54b-f790-4031-92bd-9796673de66d" } })
    });
    console.log(await r.json());
}
test();
