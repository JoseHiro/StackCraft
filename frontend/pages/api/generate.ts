import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Portfolio code components that need to be generated
const codeComponents = ["imports", "header", "mainBody"];

type PortfolioCode = {
  [key: string]: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userName = "Hero", title = "Web Developer" } = req.body;
  const portfolioCode: PortfolioCode = {};
  let tokenTrack = [];

  try {
    // Generate each code component separately
    for (const component of codeComponents) {
      // Add some artificial delay to avoid rate limits
      if (component !== codeComponents[0]) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const componentPrompt = generateComponentPrompt(component, {
        userName,
        title,
      });

      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        temperature: 0.5,
        system:
          "You are a React code generator. Provide ONLY the requested code without explanations or markdown formatting. Output raw code that can be directly used in a React component.",
        messages: [
          {
            role: "user",
            content: componentPrompt,
          },
        ],
      });

      // Extract just the code content
      let codeContent = response.content[0].text;

      // Clean up markdown code blocks if present
      if (codeContent.includes("```")) {
        const codeBlockMatches = codeContent.match(
          /```(?:jsx|tsx|javascript|typescript)?\n([\s\S]*?)```/
        );
        if (codeBlockMatches && codeBlockMatches[1]) {
          codeContent = codeBlockMatches[1].trim();
        }
      }

      tokenTrack = [
        ...tokenTrack,
        {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
        },
      ];

      portfolioCode[component] = codeContent;
    }

    // Assemble the complete portfolio component
    const completeCode = await cleanUp(
      assembleCompleteCode(portfolioCode, {
        userName,
        title,
      })
    );

    return res.json({
      success: true,
      portfolioCode,
      completeCode,
      tokenTrack,
    });
  } catch (error) {
    console.error("Error generating portfolio code:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate portfolio code",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

const generateComponentPrompt = (
  component: string,
  userData: { userName: string; title: string }
) => {
  const { userName, title } = userData;

  const prompts: { [key: string]: string } = {
    imports: `Generate ONLY the import statements for a React portfolio using Tailwind CSS and React 18. Include imports for:
- React and necessary hooks (useState, useEffect, etc.)
- react-icons (specifically FaGithub, FaLinkedin, FaTwitter, FaEnvelope)

NO explanations, NO markdown formatting. Return JUST the raw import statements.`,

    header: `Generate ONLY the JSX code for a Header component that accepts userName and title as props. The Header should include:
- The portfolio owner's name (use the prop: {userName})
- Their professional title (use the prop: {title})
- A navigation menu with links to different sections (About, Skills, Projects, Contact)
- Don't use svg, instead use react icons
- Social media icons with links
- A modern design, clean design using Tailwind CSS

The component should already be structured as:
const Header = ({ userName, title }) => {
  return (
    // YOUR CODE HERE - just provide the JSX inside the return
  );
};

Do NOT include the component definition or closing bracket, ONLY the JSX content that would go inside the return statement.`,

    mainBody: `Generate ONLY the JSX content for an "About Me" section. The content should include:
- A heading ("About Me" or similar)
- 2-3 paragraphs of placeholder text that can be replaced later (mentioning ${userName} as a ${title})
- Maybe a list of key points or interests
- Well-structured with Tailwind CSS classes for styling

The component should already be structured as:
const MainAbout = () => {
  return (
    // YOUR CODE HERE - just provide the JSX inside the return
  );
};


Do NOT include the component definition, ONLY the JSX content that would go inside the return statement of an AboutSection component.`,
  };

  return (
    prompts[component] ||
    `Generate ONLY the raw JSX code for the ${component} section of a React portfolio for ${userName}, a ${title}.
     This code will be placed within a component's return statement, so do NOT include the component definition.
     Use Tailwind CSS for styling. NO imports, NO explanations, NO markdown.`
  );
};

const assembleCompleteCode = (
  code: PortfolioCode,
  userData: { userName: string; title: string }
) => {
  // Create a complete React component that combines all sections
  return `${code.imports}

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header userName="${userData.userName}" title="${userData.title}" />
      <MainBody/>
    </>
  );
}

// Header Component
const Header = ({ userName, title }) => {

  return (
    ${code.header}
  );
};

// About Section Component
const MainBody = () => {
  return (
      <div className="container mx-auto px-4">
        ${code.mainBody}
      </div>
  );
};

export default Portfolio;`;
};

// footer: `Generate ONLY the JSX content for a Footer section. The content should include:
// - Copyright information with the current year and ${userName}
// - Social media links with icons
// - Perhaps a "Back to Top" link
// - Well-styled using Tailwind CSS
// const Footer = () => {
//   return (
//     // YOUR CODE HERE - just provide the JSX inside the return
//   );
// };

// Do NOT include the component definition, ONLY the JSX content that would go inside the return statement of a Footer component.`,

const cleanUp = async (code) => {
  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 8000,
    temperature: 0.5,
    system:
      "You are a React code generator. Please refine and delete unnecessary codes. Don't add any comments or explanation.",
    messages: [
      {
        role: "user",
        content: code,
      },
    ],
  });

  console.log(response.usage.input_tokens, response.usage.output_tokens);
  return response.content[0].text;
};

// const fixCode = `
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

// const Portfolio = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header userName="Hero" title="Web Developer" />
//       <MainBody />
//     </div>
//   );
// };

// // Header Component
// const Header = ({ userName, title }) => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className="bg-white shadow-sm py-4 px-6 fixed w-full top-0 z-10">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="flex flex-col">
//           <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
//           <p className="text-sm text-gray-600">{title}</p>
//         </div>

//         <nav className="hidden md:block">
//           <ul className="flex space-x-8">
//             <li>
//               <a
//                 href="#about"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 About
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#skills"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Skills
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#projects"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Projects
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#contact"
//                 className="text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 Contact
//               </a>
//             </li>
//           </ul>
//         </nav>

//         <div className="flex space-x-4">
//           <a
//             href="https://github.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-gray-700 hover:text-gray-900"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               aria-hidden="true"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </a>
//           <a
//             href="https://linkedin.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-gray-700 hover:text-gray-900"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               aria-hidden="true"
//             >
//               <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//             </svg>
//           </a>
//           <a
//             href="https://twitter.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-gray-700 hover:text-gray-900"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               aria-hidden="true"
//             >
//               <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//             </svg>
//           </a>
//         </div>

//         <button className="md:hidden text-gray-700 focus:outline-none">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//       </div>
//     </header>
//   );
// };

// // About Section Component
// const MainBody = () => {
//   return (
//     <div className="w-full">
//       <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
//             About Me
//           </h2>

//           <div className="flex flex-col md:flex-row items-center gap-10">
//             <div className="md:w-1/2">
//               <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
//                 Hello! I'm Hero, a passionate Web Developer with a keen eye for
//                 creating elegant, user-friendly digital experiences. I
//                 specialize in building responsive web applications that combine
//                 aesthetic appeal with functional efficiency, always keeping the
//                 end-user in mind.
//               </p>

//               <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
//                 With several years of experience in the industry, I've had the
//                 opportunity to work on diverse projects ranging from small
//                 business websites to complex enterprise applications. I thrive
//                 in collaborative environments and enjoy the process of
//                 transforming ideas into reality through clean, well-structured
//                 code.
//               </p>

//               <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
//                 What I Bring to the Table
//               </h3>

//               <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <span className="mr-2 text-blue-500">✓</span> Frontend
//                   Development
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <span className="mr-2 text-blue-500">✓</span> Responsive
//                   Design
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <span className="mr-2 text-blue-500">✓</span> UI/UX Principles
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <span className="mr-2 text-blue-500">✓</span> Performance
//                   Optimization
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <span className="mr-2 text-blue-500">✓</span> Modern JS
//                   Frameworks
//                 </li>
//                 <li className="flex items-center text-gray-600 dark:text-gray-300">
//                   <span className="mr-2 text-blue-500">✓</span> Problem Solving
//                 </li>
//               </ul>
//             </div>

//             <div className="md:w-1/2 bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
//               <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
//                 Personal Interests
//               </h3>
//               <p className="text-gray-600 dark:text-gray-300 mb-4">
//                 When I'm not coding, you can find me:
//               </p>
//               <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//                 <li className="flex items-start">
//                   <span className="text-blue-500 mr-2">•</span> Exploring new
//                   technologies and staying updated with industry trends
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-blue-500 mr-2">•</span> Contributing to
//                   open-source projects and the developer community
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-blue-500 mr-2">•</span> Hiking and
//                   enjoying the outdoors to recharge
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-blue-500 mr-2">•</span> Reading books on
//                   technology, design, and personal development
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Portfolio;
// `;

export default handler;
