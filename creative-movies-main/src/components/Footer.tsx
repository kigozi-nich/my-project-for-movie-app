import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">Data provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline">TMDb</a>.</p>
        <p className="text-xs mt-2">This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
        <p className="text-xs mt-2">© {new Date().getFullYear()} Creative Movies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
