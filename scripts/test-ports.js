async function main() {
  try {
    const [r1, r2] = await Promise.all([
      fetch("http://localhost:3003"),
      fetch("http://localhost:3002/owner-portal/login"),
    ]);
    console.log("Port 3003 (Public Storefront):", r1.status);
    console.log("Port 3002 (Owner Portal):", r2.status);
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}
main();
