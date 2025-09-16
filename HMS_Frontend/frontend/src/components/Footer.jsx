export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-12 border-t">
      <p className="text-gray-500 text-sm">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </footer>
  );
}
