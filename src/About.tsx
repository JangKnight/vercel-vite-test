const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-8 text-center">About Me</h2>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl mb-6">
            I'm a full-stack developer with 4+ years of experience building web
            applications that users love. My journey in tech started with a
            curiosity about how things work, which led me to pursue Computer
            Science and never look back.
          </p>

          <p className="text-lg mb-6">
            Currently, I specialize in building modern web applications using
            React, TypeScript, Node.js, FastAPI (or Django Ninja) and cloud
            platforms like AWS. I'm passionate about writing clean, maintainable
            code and staying up-to-date with the latest technologies and best
            practices.
          </p>

          <p className="text-lg">
            When I'm not coding, you'll find me working on personal projects,
            solving coding challenges, or exploring new frameworks and tools. I
            believe in continuous learning and sharing knowledge with the
            developer community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-semibold text-blue-600 mb-2">4+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-semibold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Katas Completed</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-semibold text-blue-600 mb-2">
              100+
            </div>
            <div className="text-gray-600">Open Source Contributions</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
