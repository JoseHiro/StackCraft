import React from 'react';

const Portfolio = () => {
  return (
    <>
      <Header userName="Hero" title="Web Developer" />
      <MainBody/>
    </>
  );
}

const Header = ({ userName, title }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
          <p className="text-sm text-gray-600">{title}</p>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
          <a href="#skills" className="text-gray-700 hover:text-blue-600 transition-colors">Skills</a>
          <a href="#projects" className="text-gray-700 hover:text-blue-600 transition-colors">Projects</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
            <i className="fab fa-github text-xl"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
            <i className="fab fa-linkedin text-xl"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
            <i className="fab fa-twitter text-xl"></i>
          </a>

          <button className="md:hidden text-gray-700">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

const MainBody = () => {
  return (
    <div className="container mx-auto px-4">
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">About Me</h2>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-lg text-gray-700 mb-6">
                Hello! I'm Hero, a passionate Web Developer with a keen eye for creating elegant, responsive, and user-friendly websites. With several years of experience in the industry, I specialize in building modern web applications using the latest technologies and best practices.
              </p>

              <p className="text-lg text-gray-700 mb-6">
                My journey in web development began when I discovered my passion for turning ideas into interactive digital experiences. Since then, I've dedicated myself to mastering various programming languages, frameworks, and design principles to deliver exceptional results for my clients and employers.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-gray-800">What I'm passionate about:</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Creating intuitive and accessible user interfaces</li>
                <li>Writing clean, maintainable, and efficient code</li>
                <li>Staying updated with the latest web technologies</li>
                <li>Solving complex problems with simple solutions</li>
                <li>Collaborating with teams to build amazing products</li>
              </ul>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Node.js</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Tailwind CSS</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">UX/UI Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
