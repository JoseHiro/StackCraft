import React from "react";
import Input from "@components/ui/input";
import Button from "@components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-radial-custom flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Instantly Generate Your AI Portfolio
        </h1>
        <p className="text-gray-600 text-lg">
          Enter your name or project below. Our AI will design a sleek portfolio
          you can install and customize.
        </p>

        <form className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <Input placeholder="Your name or project..." />
          <Button>Set project name</Button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Love the design? Export and install the full code with one click.
        </p>
      </div>

      <div className="mt-10">
        <div className="bg-gray-400 h-3 w-3 rounded-full mb-2 dot-animate"></div>
        <div className="bg-gray-400 h-3 w-3 rounded-full mb-2 dot-animate"></div>
        <div className="bg-gray-400 h-3 w-3 rounded-full dot-animate"></div>
      </div>

      <div className="space-y-6 w-[60%]">
        <div className="flex gap-4 mt-6 space-y-6">
          {/* Color Input */}
          <div className="w-full ">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Choose a Color Theme
            </label>
            <Input
              id="color"
              name="color"
              placeholder="e.g. Blue, Red, Green"
              className="mt-1 w-full " // adds margin to space out from the label
            />
          </div>

          {/* Portfolio/Landing Page Input */}
          <div className="w-full">
            <label
              htmlFor="portfolio"
              className="block text-sm font-medium text-gray-700"
            >
              Portfolio Type or Landing Page Name
            </label>
            <Input
              id="portfolio"
              name="portfolio"
              placeholder="e.g. Developer Portfolio, Personal Landing Page"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-[60%]">
        {/* Technology Select */}
        <div className="w-full">
          <label
            htmlFor="tech"
            className="block text-sm font-medium text-gray-700"
          >
            Technology
          </label>
          <select
            id="tech"
            name="tech"
            className="w-full px-5 py-3 rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          >
            <option value="">Select a technology</option>
            <option value="react">React</option>
            <option value="nextjs">Next.js</option>
            <option value="vue">Vue</option>
            <option value="svelte">Svelte</option>
          </select>
        </div>

        {/* Styling Method Select */}
        <div className="w-full">
          <label
            htmlFor="style"
            className="block text-sm font-medium text-gray-700"
          >
            Styling Method
          </label>
          <select
            id="style"
            name="style"
            className="w-full px-5 py-3 rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          >
            <option value="">Select styling method</option>
            <option value="css">CSS</option>
            <option value="css-modules">CSS Modules</option>
            <option value="sass">Sass / SCSS</option>
            <option value="tailwind">Tailwind CSS</option>
            <option value="styled-components">Styled Components</option>
          </select>
        </div>
      </div>
    </div>
  );
}
