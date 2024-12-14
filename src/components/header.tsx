export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              ImageUploader
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/upload" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Upload
            </a>
            <a 
              href="/gallery" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Gallery
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
} 