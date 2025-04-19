import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Portfolio code components that need to be generated
const codeComponents = [
  "imports",
  "header",
  "about",
  "experience",
  "skills",
  "projects",
  "contact",
  "footer",
  "layout",
];

type PortfolioCode = {
  [key: string]: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // const { prompt, userName, title, description } = req.body;


  const portfolioCode: PortfolioCode = {};

  try {
    // Generate each code component separately
    for (const component of codeComponents) {
      // Add some artificial delay to avoid rate limits if needed
      if (component !== codeComponents[0]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const componentPrompt = generateComponentPrompt(
        component,
        // prompt,
        // userName,
        // title,
        // description
      );
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1500, // Adjusting for code which may need more tokens
        temperature: 0.7, // A bit lower for more consistent code
        messages: [
          {
            role: "user",
            content: componentPrompt,
          },
        ],
      });

      portfolioCode[component] = response.content[0].text;
    }

    // Assemble the final complete component code
    const completeCode = assembleCompleteCode(portfolioCode);

    return res.json({
      success: true,
      portfolioCode,
      completeCode,
    });
  } catch (error) {
    console.error("Error generating portfolio code:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate portfolio code",
      details: error.message,
    });
  }
};

const generateComponentPrompt = (
  component: string,
  // basePrompt: string,
  userName = "Developer",
  title = "Full-Stack Developer",
  description = "A passionate web developer"
) => {
  const prompts: { [key: string]: string } = {
    imports: `Generate ONLY the import statements section for a React portfolio page using Tailwind CSS. Include all necessary imports for a modern portfolio including React, icons (react-icons), and any other essential libraries. Do not include any component code or explanations, just the import statements.

Return ONLY the import code, nothing else. The code should be directly usable in a React component.`,

    header: `Generate ONLY the header/hero section code for a React portfolio using Tailwind CSS. This should be the top part of the portfolio that includes name, title, a brief introduction, and potentially a profile picture placeholder and social links.




Return ONLY the JSX code for the header section with Tailwind styling, nothing else. Do not include imports or the full component structure.`,

    about: `Generate ONLY the "About Me" section code for a React portfolio using Tailwind CSS. This should include a section title, paragraphs about the person, and appropriate styling.


Return ONLY the JSX code for the About section with Tailwind styling, nothing else. Do not include imports or the full component structure.`,

    experience: `Generate ONLY the "Work Experience" section code for a React portfolio using Tailwind CSS. Create a component that displays work history in a visually appealing way using Tailwind.



Return ONLY the JSX code for the Experience section with Tailwind styling, nothing else. If specific experience details aren't provided, generate reasonable placeholder experience items. Do not include imports or the full component structure.`,

    skills: `Generate ONLY the "Skills" section code for a React portfolio using Tailwind CSS. Create a component that displays technical skills in an organized, visually appealing way.



Return ONLY the JSX code for the Skills section with Tailwind styling, nothing else. If specific skills aren't provided, generate reasonable skills based on the person's title and description. Do not include imports or the full component structure.`,

    projects: `Generate ONLY the "Projects" section code for a React portfolio using Tailwind CSS. Create a component that displays projects in a responsive grid or list with filtering capability.

Return ONLY the JSX code for the Projects section with Tailwind styling, nothing else. Include state management for filtering projects by category. If specific projects aren't provided, generate reasonable placeholder projects. Do not include imports or the full component structure.`,

    contact: `Generate ONLY the "Contact" section code for a React portfolio using Tailwind CSS. Create a component with a contact form and additional contact information.


Return ONLY the JSX code for the Contact section with Tailwind styling, nothing else. Do not include imports or the full component structure.`,

    footer: `Generate ONLY the footer section code for a React portfolio using Tailwind CSS. Create a simple, elegant footer with copyright information and possibly additional links.


Return ONLY the JSX code for the Footer section with Tailwind styling, nothing else. Do not include imports or the full component structure.`,

    layout: `Generate ONLY the main component structure that combines all sections of a React portfolio. This should create the layout that incorporates all the individual sections (header, about, experience, skills, projects, contact, footer).

Return ONLY the main component structure with the component function declaration and return statement that incorporates all sections. Include any necessary state management at the component level, but do not include the actual code for the individual sections. Add navigation if appropriate.`,
  };

  return (
    prompts[component] ||
    `Generate the ${component} code for a React portfolio with Tailwind CSS`
  );
};

function assembleCompleteCode(portfolioCode: PortfolioCode): string {
  // Start with the imports
  let completeCode = portfolioCode.imports || "";

  // Add the main component opening
  completeCode += "\n\nexport default function Portfolio() {\n";

  // Add any state from the layout component
  const stateMatches = portfolioCode.layout?.match(
    /const \[\w+, set\w+\] = useState\([^;]*\);/g
  );
  if (stateMatches) {
    completeCode += "\n  // State management\n";
    completeCode += stateMatches.join("\n") + "\n";
  }

  // Add return statement opening
  completeCode += "\n  return (\n";

  // Extract the main wrapper from layout if present, otherwise use a default wrapper
  const mainWrapper = portfolioCode.layout?.match(/<div[^>]*>([\s\S]*)<\/div>/);
  if (mainWrapper && mainWrapper[1]) {
    completeCode +=
      "    " +
      mainWrapper[0].replace(
        mainWrapper[1],
        "\n      {/* Portfolio Sections */}\n"
      );
  } else {
    completeCode +=
      '    <div className="min-h-screen bg-gray-50">\n      {/* Portfolio Sections */}\n';
  }

  // Add each section
  const sections = [
    "header",
    "about",
    "experience",
    "skills",
    "projects",
    "contact",
    "footer",
  ];
  sections.forEach((section) => {
    if (portfolioCode[section]) {
      completeCode += `\n      {/* ${
        section.charAt(0).toUpperCase() + section.slice(1)
      } Section */}\n`;
      completeCode +=
        "      " + portfolioCode[section].split("\n").join("\n      ") + "\n";
    }
  });

  // Close the main wrapper
  completeCode += "    </div>\n";

  // Close the return and component function
  completeCode += "  );\n}\n";

  return completeCode;
}

export default handler;
