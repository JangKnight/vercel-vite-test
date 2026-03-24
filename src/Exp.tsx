interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const events: TimelineEvent[] = [
  {
    year: "2018 - 2020",
    title: "Researcher at GTRI",
    description:
      "I was offered a position at Georgia Tech Research Institute with a project of rebasing Java Swing code to JavaFX. I learned a lot about GUIs, human-computer interactions, and database orms during this co-op.",
  },
  {
    year: "2021 - 2022",
    title: "Engineering at Amazon",
    description:
      "I secured a junior position at Amazon during covid. I was actually supposed to commission into the military, but the pandemic altered my plans. I was lucky to secure this opportunity with a military bridging program. I shadowed most of the time, but I learned how to troubleshoot complex systems and collaborate with diverse teams.",
  },
  {
    year: "2022 - 2026",
    title: "Going pro at CodeMettle",
    description:
      "I graduated in 2022 with my degree in Computer Engineering! I joined CodeMettle as a software engineer where we built custom NOC solutions for clients(mostly DoD). I mostly focused on building web applications with React, TypeScript, Golang, and Python. I got to learn about cloud architecture and DevOps practices. My latest project that involved building a real-time network monitoring dashboard using React and WebSockets.",
  },
];

const Exp = () => {
  return (
    <div className="w-full h-96 overflow-y-auto  border border-gray-300 rounded-lg p-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-400"></div>

        {/* Events */}
        <div className="space-y-8 ml-16">
          {events.map((event, idx) => (
            <div key={idx} className="relative">
              {/* Dot on timeline */}
              <div className="absolute -left-12 top-1.5 w-5 h-5 bg-purple-500 rounded-full border-4 border-gray-400"></div>

              {/* Content */}
              <div className="p-4 rounded-lg shadow-sm border-4 border-gray-400">
                <div className="font-bold text-purple-500">{event.year}</div>
                <h3 className="font-semibold mt-1">{event.title}</h3>
                <p className=" text-sm mt-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exp;
