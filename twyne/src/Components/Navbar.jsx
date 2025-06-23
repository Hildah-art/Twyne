function Navbar() {
  return (
    <nav style={{ backgroundColor: "#ff4d6d", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ color: "#fff" }}>Twyne</h1>
      <ul style={{ listStyle: "none", display: "flex", gap: "1rem", color: "#fff" }}>
        <li>Home</li>
        <li>Discover</li>
        <li>Profile</li>
        <li>Logout</li>
      </ul>
    </nav>
  );
}

export default Navbar;
