
const CareerHero = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
        }}
      ></div>
      <div className="w-full max-w-[85%] mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Career Guidance & Planning
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Navigate your tech career with expert guidance. Discover career paths, assess your skills, and create a roadmap to success.
        </p>
      </div>
    </section>
  );
};

export default CareerHero;
