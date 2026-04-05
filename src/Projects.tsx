const Projects = () => {
  const projects = [
    {
      title: "Go Bank",
      subtitle: "Gemini-powered chatbot banking assistant",
      description:
        "A personal project showcasing a chatbot that helps users navigate the site and more.",
      url: "https://bank.anthonysjhenry.net",
      tags: ["Go", "React", "Gemini AI", "PostgreSQL"],
      status: "Live",
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-8 text-center">
          Projects &amp; WIPs
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-lg p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-600">
                  {project.title}
                </h3>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {project.status}
                </span>
              </div>
              <p className="text-sm font-medium text-purple-500">
                {project.subtitle}
              </p>
              <p className="text-gray-600 text-sm">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto text-sm text-blue-500 hover:underline"
              >
                Visit project →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
