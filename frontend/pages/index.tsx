import React, { useState } from "react";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { RiNextjsFill } from "react-icons/ri";
import { FaHtml5, FaReact, FaVuejs, FaSass, FaCss3 } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { RiSvelteFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";
import * as Select from "@radix-ui/react-select";
const techOptions = [
  {
    value: "react",
    label: "React",
    icon: <FaReact className="text-sky-500" />,
  },
  {
    value: "nextjs",
    label: "Next.js",
    icon: <RiNextjsFill className="text-black" />,
  },
  // { value: "vue", label: "Vue", icon: <FaVuejs className="text-green-500" /> },
  // {
  //   value: "svelte",
  //   label: "Svelte",
  //   icon: <RiSvelteFill className="text-orange-500" />,
  // },
  // {
  //   value: "html",
  //   label: "HTML",
  //   icon: <FaHtml5 className="text-orange-600" />,
  // },
];

const stylingOptions = [
  {
    value: "CSS",
    label: "CSS",
    icon: <FaCss3 className="text-sky-500" />,
  },
  {
    value: "Tailwind",
    label: "Tailwind",
    icon: <RiTailwindCssFill className="text-sky-500" />,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleCallAPI = async (projectName, tech, style) => {
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ projectName, tech, style }),
    });

    if (response.status === 200) {
      const json = await response.json();
      console.log(json);
    }
    setLoading(false);
  };

  // const handleCallAPI = async (projectName, tech, style) => {
  //   const response = await fetch("/api/gpt", {
  //     method: "POST",
  //     headers: { "Content-type": "application/json" },
  //     body: JSON.stringify({ projectName, tech, style }),
  //   });

  //   if (response.status === 200) {
  //     const json = await response.json();
  //     console.log(json);
  //   }
  // };

  return (
    <div className="min-h-screen bg-radial-custom flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl w-full mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Instantly Generate Your AI Portfolio
        </h1>
        <p className="text-gray-600 text-lg">
          Enter your name or project below. Our AI will design a sleek portfolio
          you can install and customize.
        </p>
        {loading && (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
          </div>
        )}
        <form className="flex items-center gap-4 mt-6">
          <Input placeholder="Your name or project..." />
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleCallAPI("first Project", "React", "CSS");
            }}
          >
            Set project
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Love the design? Export and install the full code with one click.
        </p>
      </div>

      <div className="mt-10">
        <div className="bg-gray-400 h-2 w-2 rounded-full mb-2 dot-animate"></div>
        <div className="bg-gray-400 h-2 w-2 rounded-full mb-2 dot-animate"></div>
        <div className="bg-gray-400 h-2 w-2 rounded-full dot-animate"></div>
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

      <div className="my-10">
        <div className="bg-gray-400 h-2 w-2 rounded-full mb-2 dot-animate"></div>
        <div className="bg-gray-400 h-2 w-2 rounded-full mb-2 dot-animate"></div>
        <div className="bg-gray-400 h-2 w-2 rounded-full dot-animate"></div>
      </div>

      <div className="flex gap-4 w-[60%]">
        {/* Technology Select */}
        <div className="w-full space-y-1">
          <label
            htmlFor="tech"
            className="block text-sm font-medium text-gray-700"
          >
            Technology
          </label>
          <Select.Root>
            <Select.Trigger
              className="inline-flex items-center justify-between w-full px-5 py-3 text-left border-2 border-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Technology"
            >
              <Select.Value placeholder="Select a technology" />
              <Select.Icon>
                <FaChevronDown />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white border border-gray-300 rounded-xl shadow-lg">
                <Select.Viewport className="p-2">
                  {techOptions.map((tech) => (
                    <Select.Item
                      key={tech.value}
                      value={tech.value}
                      className="flex items-center justify-between gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        {tech.icon}
                        <Select.ItemText>{tech.label}</Select.ItemText>
                      </div>
                      <Select.ItemIndicator>
                        {/* <CheckIcon /> */}
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Styling Method Select */}
        <div className="w-full space-y-1">
          <label
            htmlFor="style"
            className="block text-sm font-medium text-gray-700"
          >
            Styling Method
          </label>
          <Select.Root>
            <Select.Trigger
              className="inline-flex items-center justify-between w-full px-5 py-3 text-left border-2 border-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Technology"
            >
              <Select.Value placeholder="Select a styling" />
              <Select.Icon>
                <FaChevronDown />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white border border-gray-300 rounded-xl shadow-lg">
                <Select.Viewport className="p-2">
                  {stylingOptions.map((tech) => (
                    <Select.Item
                      key={tech.value}
                      value={tech.value}
                      className="flex items-center justify-between gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        {tech.icon}
                        <Select.ItemText>{tech.label}</Select.ItemText>
                      </div>
                      <Select.ItemIndicator>
                        {/* <CheckIcon /> */}
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="w-full max-w-6xl my-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Preview your AI-generated portfolio
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-white shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400 text-xl">
                Design Preview {n}
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">
                  Design {n} -{/* {selectedTech} + {selectedStyle} */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
