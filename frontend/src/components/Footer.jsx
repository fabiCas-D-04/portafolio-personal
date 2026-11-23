export default function Footer() {
  return (
    <footer data-testid="footer">
      © {new Date().getFullYear()} · Portafolio personal construido con React, Express y MongoDB
    </footer>
  );
}
